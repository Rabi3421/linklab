import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'

// GET /api/urls/[id] - Get specific URL with analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: url, error } = await supabase
      .from('urls')
      .select(`
        *,
        domains(domain),
        campaigns(name, utm_campaign),
        url_tags(tags(name, color))
      `)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error || !url) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 })
    }

    // Get click analytics
    const { data: analytics } = await supabase
      .from('url_clicks')
      .select('*')
      .eq('url_id', id)
      .order('clicked_at', { ascending: false })

    // Calculate analytics summary
    const totalClicks = analytics?.length || 0
    const uniqueClicks = analytics?.filter(click => click.is_unique).length || 0
    
    const countryStats = analytics?.reduce((acc, click) => {
      if (click.country) {
        acc[click.country] = (acc[click.country] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    const deviceStats = analytics?.reduce((acc, click) => {
      if (click.device_type) {
        acc[click.device_type] = (acc[click.device_type] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    const browserStats = analytics?.reduce((acc, click) => {
      if (click.browser) {
        acc[click.browser] = (acc[click.browser] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    return NextResponse.json({
      url,
      analytics: {
        totalClicks,
        uniqueClicks,
        clickRate: totalClicks > 0 ? (uniqueClicks / totalClicks * 100).toFixed(1) : '0',
        countries: Object.entries(countryStats)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([country, count]) => ({ country, count })),
        devices: Object.entries(deviceStats)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .map(([device, count]) => ({ device, count })),
        browsers: Object.entries(browserStats)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([browser, count]) => ({ browser, count })),
        recentClicks: analytics?.slice(0, 50) || []
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/urls/[id] - Update URL
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      originalUrl,
      title,
      description,
      domainId,
      campaignId,
      password,
      expiryDate,
      clickLimit,
      isActive,
      tags = []
    } = body

    // Validate URL if provided
    if (originalUrl) {
      try {
        new URL(originalUrl)
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
    }

    // Update URL record
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (originalUrl !== undefined) updateData.original_url = originalUrl
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (domainId !== undefined) updateData.domain_id = domainId
    if (campaignId !== undefined) updateData.campaign_id = campaignId
    if (password !== undefined) updateData.password = password
    if (expiryDate !== undefined) updateData.expiry_date = expiryDate
    if (clickLimit !== undefined) updateData.click_limit = clickLimit
    if (isActive !== undefined) updateData.is_active = isActive

    const { data: updatedUrl, error } = await supabase
      .from('urls')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error || !updatedUrl) {
      return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 })
    }

    // Update tags if provided
    if (tags.length >= 0) {
      // Remove existing tags
      await supabase
        .from('url_tags')
        .delete()
        .eq('url_id', id)

      // Add new tags
      for (const tagName of tags) {
        // Create tag if it doesn't exist
        const { data: tag } = await supabase
          .from('tags')
          .upsert(
            { user_id: session.user.id, name: tagName },
            { onConflict: 'user_id,name' }
          )
          .select()
          .single()

        if (tag) {
          // Link URL to tag
          await supabase
            .from('url_tags')
            .insert({ url_id: id, tag_id: tag.id })
        }
      }
    }

    return NextResponse.json({
      message: 'URL updated successfully',
      url: updatedUrl
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/urls/[id] - Delete URL
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('urls')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 })
    }

    return NextResponse.json({ message: 'URL deleted successfully' })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}