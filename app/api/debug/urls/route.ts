import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/debug/urls - Debug endpoint to check URLs in database
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all URLs for the user
    const { data: urls, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching URLs:', error)
      return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 })
    }

    const stats = {
      totalUrls: urls?.length || 0,
      urlsWithQR: urls?.filter(url => url.qr_code_url).length || 0,
      urlsWithoutQR: urls?.filter(url => !url.qr_code_url).length || 0,
      activeUrls: urls?.filter(url => url.is_active).length || 0
    }

    return NextResponse.json({
      stats,
      urls: urls?.map(url => ({
        id: url.id,
        short_code: url.short_code,
        original_url: url.original_url,
        title: url.title,
        has_qr_code: !!url.qr_code_url,
        qr_code_length: url.qr_code_url?.length || 0,
        is_active: url.is_active,
        created_at: url.created_at
      }))
    })

  } catch (error) {
    console.error('Debug URLs Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}