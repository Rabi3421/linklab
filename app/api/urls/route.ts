import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'

// GET /api/urls - Get all URLs for authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''
    const campaign = searchParams.get('campaign') || ''
    const offset = (page - 1) * limit

    let query = supabase
      .from('urls')
      .select(`
        *,
        domains(id, domain),
        campaigns(id, name, utm_campaign),
        url_tags(tag_id, tags(name, color))
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,original_url.ilike.%${search}%,short_code.ilike.%${search}%`)
    }

    // Add tag filter
    if (tag) {
      query = query.eq('url_tags.tags.name', tag)
    }

    // Add campaign filter
    if (campaign) {
      query = query.eq('campaign_id', campaign)
    }

    const { data: urls, error } = await query

    if (error) {
      console.error('Error fetching URLs:', error)
      return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 })
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('urls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (countError) {
      console.error('Error counting URLs:', countError)
      return NextResponse.json({ error: 'Failed to count URLs' }, { status: 500 })
    }

    return NextResponse.json({
      urls: urls || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/urls - Create new shortened URL
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      originalUrl,
      customAlias,
      title,
      description,
      domainId,
      password,
      expiryDate,
      clickLimit,
      tags = [],
      utmParameters
    } = body

    // Validate required fields
    if (!originalUrl) {
      return NextResponse.json({ error: 'Original URL is required' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(originalUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Generate short code
    let shortCode = customAlias || nanoid(9)
    
    // Check if custom alias is available
    if (customAlias) {
      const { data: existing } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code', customAlias)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Custom alias already taken' }, { status: 409 })
      }
    }

    // Fetch page metadata (title, description, favicon)
    let pageTitle = title
    let pageDescription = description
    let faviconUrl = null

    if (!title || !description) {
      try {
        const response = await fetch(originalUrl, { 
          headers: { 'User-Agent': 'LinkLab URL Shortener Bot' },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        const html = await response.text()
        
        // Extract title
        if (!pageTitle) {
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
          pageTitle = titleMatch ? titleMatch[1].trim() : new URL(originalUrl).hostname
        }
        
        // Extract description
        if (!pageDescription) {
          const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)
          pageDescription = descMatch ? descMatch[1].trim() : ''
        }
        
        // Extract favicon
        const faviconMatch = html.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i) ||
                            html.match(/<link[^>]*rel="shortcut icon"[^>]*href="([^"]*)"[^>]*>/i)
        if (faviconMatch) {
          faviconUrl = new URL(faviconMatch[1], originalUrl).href
        } else {
          faviconUrl = `${new URL(originalUrl).origin}/favicon.ico`
        }
      } catch (error) {
        console.warn('Failed to fetch page metadata:', error instanceof Error ? error.message : 'Unknown error')
        pageTitle = pageTitle || new URL(originalUrl).hostname
      }
    }

    // Generate QR Code
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${shortCode}`
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Insert URL record with complete schema
    const { data: newUrl, error: insertError } = await supabase
      .from('urls')
      .insert({
        user_id: user.id,
        original_url: originalUrl,
        short_code: shortCode,
        custom_alias: customAlias || null,
        title: pageTitle || null,
        description: pageDescription || null,
        favicon_url: faviconUrl || null,
        qr_code_url: qrCodeDataUrl || null,
        domain_id: domainId || null,
        campaign_id: null,
        password: password || null,
        expiry_date: expiryDate || null,
        click_limit: clickLimit || null,
        utm_parameters: utmParameters || null,
        is_active: true
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating URL:', insertError)
      
      // Check for RLS policy violation
      if (insertError.code === '42501') {
        return NextResponse.json({ 
          error: 'Permission denied',
          message: 'Authentication required or insufficient permissions'
        }, { status: 403 })
      }
      
      // Check if it's a missing table/column error
      if (insertError.code === 'PGRST204' || insertError.message?.includes('could not find')) {
        return NextResponse.json({ 
          error: 'Database not set up properly',
          message: 'The required database table is missing. Please check DATABASE_SETUP.md for instructions.',
          details: insertError.message
        }, { status: 500 })
      }
      
      if (insertError.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'Short code already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create URL' }, { status: 500 })
    }

    // Add tags if provided
    if (tags.length > 0) {
      for (const tagName of tags) {
        // Create tag if it doesn't exist
        const { data: tag, error: tagError } = await supabase
          .from('tags')
          .upsert(
            { user_id: user.id, name: tagName },
            { onConflict: 'user_id,name' }
          )
          .select()
          .single()

        if (!tagError && tag) {
          // Link URL to tag
          await supabase
            .from('url_tags')
            .insert({ url_id: newUrl.id, tag_id: tag.id })
        }
      }
    }

    return NextResponse.json({
      id: newUrl.id,
      shortCode: newUrl.short_code,
      shortUrl,
      originalUrl: newUrl.original_url,
      title: newUrl.title,
      description: newUrl.description,
      faviconUrl: newUrl.favicon_url,
      qrCodeUrl: newUrl.qr_code_url,
      createdAt: newUrl.created_at
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}