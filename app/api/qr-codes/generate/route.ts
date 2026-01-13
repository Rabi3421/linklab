import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'

// POST /api/qr-codes/generate - Generate QR code for an existing URL
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { urlId } = body

    if (!urlId) {
      return NextResponse.json({ error: 'URL ID is required' }, { status: 400 })
    }

    // Get the URL record
    const { data: url, error: urlError } = await supabase
      .from('urls')
      .select('*')
      .eq('id', urlId)
      .eq('user_id', user.id)
      .single()

    if (urlError || !url) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 })
    }

    // Generate QR Code
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://linklab.co'}/${url.short_code}`
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Update the URL record with QR code
    const { error: updateError } = await supabase
      .from('urls')
      .update({ qr_code_url: qrCodeDataUrl })
      .eq('id', urlId)

    if (updateError) {
      console.error('Error updating QR code:', updateError)
      return NextResponse.json({ error: 'Failed to save QR code' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      qrCodeUrl: qrCodeDataUrl 
    })

  } catch (error) {
    console.error('Generate QR Code Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/qr-codes/regenerate-all - Regenerate QR codes for all URLs without them
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get URLs without QR codes
    const { data: urls, error: urlsError } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .is('qr_code_url', null)

    if (urlsError) {
      return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 })
    }

    let updated = 0

    // Generate QR codes for URLs that don't have them
    for (const url of urls || []) {
      try {
        const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://linklab.co'}/${url.short_code}`
        const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })

        await supabase
          .from('urls')
          .update({ qr_code_url: qrCodeDataUrl })
          .eq('id', url.id)

        updated++
      } catch (error) {
        console.error(`Failed to generate QR code for URL ${url.id}:`, error)
      }
    }

    return NextResponse.json({ 
      success: true,
      updated,
      message: `Generated QR codes for ${updated} URLs`
    })

  } catch (error) {
    console.error('Regenerate QR Codes Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}