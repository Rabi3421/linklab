import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/analytics - Get user's overall analytics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // Calculate date range
    let startDate: Date
    const endDate = new Date()

    switch (period) {
      case '1d':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }

    // Get user's URLs
    const { data: urls } = await supabase
      .from('urls')
      .select('id, title, short_code, created_at, original_url')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (!urls || urls.length === 0) {
      return NextResponse.json({
        totalClicks: 0,
        totalUrls: 0,
        clicksToday: 0,
        topUrls: [],
        clicksByDate: [],
        clicksByCountry: [],
        clicksByDevice: [],
        clicksByBrowser: [],
        clicksByReferer: []
      })
    }

    const urlIds = urls.map(url => url.id)

    // Get total clicks
    const { count: totalClicks } = await supabase
      .from('url_clicks')
      .select('*', { count: 'exact', head: true })
      .in('url_id', urlIds)
      .gte('clicked_at', startDate.toISOString())

    // Get clicks today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const { count: clicksToday } = await supabase
      .from('url_clicks')
      .select('*', { count: 'exact', head: true })
      .in('url_id', urlIds)
      .gte('clicked_at', todayStart.toISOString())

    // Get detailed analytics data
    const { data: analyticsData } = await supabase
      .from('url_clicks')
      .select('url_id, clicked_at, country, device_type, browser, referer')
      .in('url_id', urlIds)
      .gte('clicked_at', startDate.toISOString())
      .order('clicked_at', { ascending: true })

    // Process analytics data
    const clicksByDate: any[] = []
    const clicksByCountry: any[] = []
    const clicksByDevice: any[] = []
    const clicksByBrowser: any[] = []
    const clicksByReferer: any[] = []
    const topUrls: any[] = []

    if (analyticsData && analyticsData.length > 0) {
      // Group by date
      const dateGroups = analyticsData.reduce((acc, click) => {
        const date = new Date(click.clicked_at).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      clicksByDate.push(...Object.entries(dateGroups).map(([date, clicks]) => ({
        date, clicks
      })))

      // Group by country
      const countryGroups = analyticsData.reduce((acc, click) => {
        const country = click.country || 'Unknown'
        acc[country] = (acc[country] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      clicksByCountry.push(...Object.entries(countryGroups)
        .map(([country, clicks]) => ({ country, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10))

      // Group by device
      const deviceGroups = analyticsData.reduce((acc, click) => {
        const device = click.device_type || 'Unknown'
        acc[device] = (acc[device] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      clicksByDevice.push(...Object.entries(deviceGroups)
        .map(([device, clicks]) => ({ device, clicks })))

      // Group by browser
      const browserGroups = analyticsData.reduce((acc, click) => {
        const browser = click.browser || 'Unknown'
        acc[browser] = (acc[browser] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      clicksByBrowser.push(...Object.entries(browserGroups)
        .map(([browser, clicks]) => ({ browser, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10))

      // Group by referer
      const refererGroups = analyticsData.reduce((acc, click) => {
        let referer = 'Direct'
        if (click.referer) {
          try {
            referer = new URL(click.referer).hostname
          } catch {
            referer = 'Unknown'
          }
        }
        acc[referer] = (acc[referer] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      clicksByReferer.push(...Object.entries(refererGroups)
        .map(([referer, clicks]) => ({ referer, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10))

      // Top URLs
      const urlGroups = analyticsData.reduce((acc, click) => {
        acc[click.url_id] = (acc[click.url_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      topUrls.push(...Object.entries(urlGroups)
        .map(([urlId, clicks]) => {
          const url = urls.find(u => u.id === urlId)
          return {
            title: url?.title || 'Untitled',
            shortCode: url?.short_code || '',
            originalUrl: url?.original_url || '',
            clicks
          }
        })
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10))
    }

    return NextResponse.json({
      totalClicks: totalClicks || 0,
      totalUrls: urls.length,
      clicksToday: clicksToday || 0,
      topUrls,
      clicksByDate,
      clicksByCountry,
      clicksByDevice,
      clicksByBrowser,
      clicksByReferer
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}