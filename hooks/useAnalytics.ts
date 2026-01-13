import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

export interface AnalyticsOverview {
  totalUrls: number
  totalClicks: number
  uniqueVisitors: number
  averageClicksPerUrl: number
}

export interface ClicksOverTime {
  date: string
  clicks: number
}

export interface TopUrl {
  id: string
  title: string
  shortCode: string
  clicks: number
}

export interface CountryStat {
  country: string
  count: number
}

export interface DeviceStat {
  device: string
  count: number
}

export interface BrowserStat {
  browser: string
  count: number
}

export interface ReferrerStat {
  referrer: string
  count: number
}

export interface Analytics {
  overview: AnalyticsOverview
  clicksOverTime: ClicksOverTime[]
  topUrls: TopUrl[]
  countries: CountryStat[]
  devices: DeviceStat[]
  browsers: BrowserStat[]
  referrers: ReferrerStat[]
  period: string
  dateRange: {
    start: string
    end: string
  }
}

export function useAnalytics() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (period: string = '30d', timezone: string = 'UTC') => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      queryParams.set('period', period)
      queryParams.set('timezone', timezone)

      const response = await fetch(`/api/analytics?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data: Analytics = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user])

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    refresh: () => fetchAnalytics()
  }
}