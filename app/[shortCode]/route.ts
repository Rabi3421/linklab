import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { UAParser } from 'ua-parser-js'

// // Lazy import geoip-lite with error handling
// let geoip: any = null
// try {
//   geoip = require('geoip-lite')
// } catch (error) {
//   console.warn('GeoIP not available in production build:', error)
// }

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params
    const supabase = await createClient()

    // Get client information for analytics (needed for both authenticated and demo URLs)
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ip = (forwardedFor || realIP || '127.0.0.1').split(',')[0].trim()
    console.log("ip:",ip)
    // Parse user agent for device/browser info
    const parser = new UAParser(userAgent)
    const uaResult = parser.getResult()

    // Get geographic information
    let geoData = null;
    if (ip && ip !== '127.0.0.1') {
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        geoData = await response.json();
        console.log("GeoIP data:", geoData);
      } catch (error) {
        console.warn('GeoIP lookup failed:', error);
      }
    }

    // Get URL record by short code (authenticated users)
    const { data: url, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single()

    if (error || !url) {
      // If not found in authenticated context, check in-memory demo URLs
      const demoUrls = getDemoUrls()
      const demoUrl = demoUrls.get(shortCode)

      if (demoUrl) {
        // Increment demo click count
        demoUrl.clicks += 1

        // Redirect to original URL for demo
        return NextResponse.redirect(demoUrl.originalUrl)
      }

      // URL not found anywhere
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // Check if URL has expired
    if (url.expiry_date && new Date() > new Date(url.expiry_date)) {
      return NextResponse.redirect(new URL('/expired', request.url))
    }

    // Check click limit
    if (url.click_limit) {
      const { count } = await supabase
        .from('url_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('url_id', url.id)

      if (count && count >= url.click_limit) {
        return NextResponse.redirect(new URL('/limit-reached', request.url))
      }
    }

    // Prepare analytics data
    const clickData = {
      url_id: url.id,
      ip_address: ip,
      user_agent: userAgent,
      referer: referer || null,
      country: geoData?.country_name || null,
      region: geoData?.region || null,
      city: geoData?.city || null,
      device_type: uaResult.device.type || 'desktop',
      browser: uaResult.browser.name || 'Unknown',
      browser_version: uaResult.browser.version || null,
      os: uaResult.os.name || 'Unknown',
      os_version: uaResult.os.version || null,
      clicked_at: new Date().toISOString()
    }

    // Record the click analytics (fire and forget)
    supabase
      .from('url_clicks')
      .insert(clickData)
      .then(({ error: clickError }) => {
        if (clickError) {
          console.error('Error recording click:', clickError)
        }
      })

    // Handle UTM parameters
    const { searchParams } = new URL(request.url)
    const utmParams = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content')
    }

    // Prepare final redirect URL
    let finalUrl = url.original_url

    // Add UTM parameters to the destination URL if any exist
    const hasUtmParams = Object.values(utmParams).some(param => param !== null)
    if (hasUtmParams) {
      try {
        const urlObj = new URL(finalUrl)

        Object.entries(utmParams).forEach(([key, value]) => {
          if (value) {
            urlObj.searchParams.set(key, value)
          }
        })

        finalUrl = urlObj.toString()
      } catch (error) {
        console.warn('Invalid URL, using original:', error)
      }
    }

    // Perform the redirect
    return NextResponse.redirect(finalUrl)

  } catch (error) {
    console.error('Redirect Error:', error)
    return NextResponse.redirect(new URL('/error', request.url))
  }
}