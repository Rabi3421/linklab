import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/qr-codes - Get user's QR codes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch URLs with QR codes
    const { data: urls, error } = await supabase
      .from('urls')
      .select(`
        id,
        title,
        short_code,
        original_url,
        qr_code_url,
        created_at,
        is_active,
        url_clicks(count)
      `)
      .eq('user_id', user.id)
      .not('qr_code_url', 'is', null)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching QR codes:', error)
      return NextResponse.json({ error: 'Failed to fetch QR codes' }, { status: 500 })
    }

    // Transform the data to include scan counts
    const qrCodes = await Promise.all(
      (urls || []).map(async (url) => {
        // Get scan count for this QR code
        const { count: scans } = await supabase
          .from('url_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('url_id', url.id)

        return {
          id: url.id,
          shortUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'linklab.co'}/${url.short_code}`,
          originalUrl: url.original_url,
          title: url.title || 'Untitled',
          qrCodeUrl: url.qr_code_url,
          scans: scans || 0,
          downloads: 0, // We'll implement download tracking later
          createdAt: url.created_at,
          format: 'PNG', // QR codes are generated as PNG data URLs
          size: '300x300'
        }
      })
    )

    return NextResponse.json(qrCodes)

  } catch (error) {
    console.error('QR Codes API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}