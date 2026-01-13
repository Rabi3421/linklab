import { NextRequest, NextResponse } from 'next/server'

// Access the global demo URLs storage
declare global {
  var demoUrls: Map<string, {
    originalUrl: string
    title: string
    qrCodeUrl: string
    createdAt: Date
    clicks: number
  }> | undefined
}

const getDemoUrls = () => {
  if (!global.demoUrls) {
    global.demoUrls = new Map()
  }
  return global.demoUrls
}

export async function GET(request: NextRequest) {
  try {
    const demoUrls = getDemoUrls()
    
    // Convert Map to Array for easier processing
    const demoUrlsArray = Array.from(demoUrls.entries()).map(([shortCode, data]) => ({
      shortCode,
      originalUrl: data.originalUrl,
      title: data.title,
      has_qr_code: !!data.qrCodeUrl,
      qr_code_length: data.qrCodeUrl?.length || 0,
      clicks: data.clicks,
      created_at: data.createdAt.toISOString()
    }))

    // Sort by creation date (most recent first)
    demoUrlsArray.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({
      totalDemoUrls: demoUrlsArray.length,
      recentDemoUrls: demoUrlsArray.slice(0, 10), // Show last 10
      note: "Demo URLs are stored in memory and will be lost on server restart"
    })

  } catch (error) {
    console.error('Debug demo URLs error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}