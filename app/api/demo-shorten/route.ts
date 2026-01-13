import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/server'

// Create a global Map for demo URLs that persists across requests
declare global {
  var demoUrls: Map<string, {
    originalUrl: string
    title: string
    qrCodeUrl: string
    createdAt: Date
    clicks: number
  }> | undefined
}

// Initialize or get the global demo URLs storage
const getDemoUrls = () => {
  if (!global.demoUrls) {
    global.demoUrls = new Map()
  }
  return global.demoUrls
}

// POST /api/demo-shorten - Create shortened URL for non-authenticated users
export async function POST(request: NextRequest) {
  try {
    const { originalUrl } = await request.json()

    if (!originalUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {
      new URL(originalUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    let shortCode = nanoid(9)
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${shortCode}`

    // Fetch page title
    let title = new URL(originalUrl).hostname
    try {
      const response = await fetch(originalUrl, { 
        headers: { 'User-Agent': 'LinkLab URL Shortener Bot' },
        signal: AbortSignal.timeout(5000)
      })
      const html = await response.text()
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      if (titleMatch) title = titleMatch[1].trim()
    } catch {}

    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' }
    })

    // Store in Supabase with user_id: null
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('urls')
      .insert({
        user_id: null,
        original_url: originalUrl,
        short_code: shortCode,
        title,
        qr_code_url: qrCodeDataUrl,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to store demo URL' }, { status: 500 })
    }

    return NextResponse.json({
      shortCode,
      shortUrl,
      originalUrl,
      title,
      qrCodeUrl: qrCodeDataUrl,
      isDemo: true
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}