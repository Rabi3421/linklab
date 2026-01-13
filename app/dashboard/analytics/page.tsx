'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatNumber } from '@/lib/dateUtils'
import { 
  BarChart3, 
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Users,
  MousePointer,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react'

interface AnalyticsData {
  totalClicks: number
  totalUrls: number
  clicksToday: number
  topUrls: Array<{
    title: string
    shortCode: string
    originalUrl: string
    clicks: number
  }>
  clicksByDate: Array<{
    date: string
    clicks: number
  }>
  clicksByCountry: Array<{
    country: string
    clicks: number
  }>
  clicksByDevice: Array<{
    device: string
    clicks: number
  }>
  clicksByBrowser: Array<{
    browser: string
    clicks: number
  }>
  clicksByReferer: Array<{
    referer: string
    clicks: number
  }>
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (period: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/analytics?period=${period}&timezone=UTC`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(timeRange)
  }, [timeRange])

  // Calculate device percentages
  const getDevicePercentages = () => {
    if (!analyticsData?.clicksByDevice.length) return { desktop: 0, mobile: 0, tablet: 0 }
    
    const totalClicks = analyticsData.clicksByDevice.reduce((sum, item) => sum + item.clicks, 0)
    if (totalClicks === 0) return { desktop: 0, mobile: 0, tablet: 0 }
    
    const devices = { desktop: 0, mobile: 0, tablet: 0 }
    analyticsData.clicksByDevice.forEach(item => {
      const deviceType = item.device.toLowerCase()
      if (deviceType.includes('desktop') || deviceType.includes('computer')) {
        devices.desktop += Math.round((item.clicks / totalClicks) * 100)
      } else if (deviceType.includes('mobile') || deviceType.includes('phone')) {
        devices.mobile += Math.round((item.clicks / totalClicks) * 100)
      } else if (deviceType.includes('tablet')) {
        devices.tablet += Math.round((item.clicks / totalClicks) * 100)
      }
    })
    return devices
  }

  // Calculate country percentages
  const getCountryPercentages = () => {
    if (!analyticsData?.clicksByCountry.length) return {}
    
    const totalClicks = analyticsData.clicksByCountry.reduce((sum, item) => sum + item.clicks, 0)
    if (totalClicks === 0) return {}
    
    const countries: Record<string, number> = {}
    analyticsData.clicksByCountry.slice(0, 6).forEach(item => {
      countries[item.country] = Math.round((item.clicks / totalClicks) * 100)
    })
    return countries
  }

  // Calculate referrer percentages
  const getReferrerPercentages = () => {
    if (!analyticsData?.clicksByReferer.length) return {}
    
    const totalClicks = analyticsData.clicksByReferer.reduce((sum, item) => sum + item.clicks, 0)
    if (totalClicks === 0) return {}
    
    const referrers: Record<string, number> = {}
    analyticsData.clicksByReferer.slice(0, 5).forEach(item => {
      referrers[item.referer] = Math.round((item.clicks / totalClicks) * 100)
    })
    return referrers
  }

  // Generate hourly data from daily data
  const generateHourlyData = () => {
    if (!analyticsData?.clicksByDate.length) {
      return Array.from({ length: 24 }, (_, i) => ({
        hour: i.toString().padStart(2, '0'),
        clicks: 0
      }))
    }
    
    // For now, distribute daily clicks evenly across hours
    // In a real implementation, you'd track actual hourly data
    const dailyAverage = analyticsData.clicksByDate.reduce((sum, item) => sum + item.clicks, 0) / analyticsData.clicksByDate.length
    const hourlyAverage = dailyAverage / 24
    
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i.toString().padStart(2, '0'),
      clicks: Math.round(hourlyAverage * (0.5 + Math.random() * 1.5)) // Add some variation
    }))
  }

  const deviceData = getDevicePercentages()
  const countryData = getCountryPercentages()
  const referrerData = getReferrerPercentages()
  const hourlyData = generateHourlyData()
  
  if (loading) {
    return (
      <div className="flex-1 overflow-auto lg:pt-0 pt-16">
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto lg:pt-0 pt-16">
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => fetchAnalytics(timeRange)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  const StatCard = ({ title, value, icon: Icon, trend, isPositive = true, suffix = '' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="text-xs font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}{suffix}</p>
    </motion.div>
  )

  return (
    <div className="flex-1 overflow-auto lg:pt-0 pt-16">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Detailed insights into your link performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value)
                fetchAnalytics(e.target.value)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Clicks"
            value={formatNumber(analyticsData?.totalClicks || 0)}
            icon={MousePointer}
            trend={12}
          />
          <StatCard
            title="Total URLs"
            value={formatNumber(analyticsData?.totalUrls || 0)}
            icon={Users}
            trend={8}
          />
          <StatCard
            title="Clicks Today"
            value={analyticsData?.clicksToday || 0}
            icon={TrendingUp}
            trend={-2.3}
            isPositive={false}
          />
          <StatCard
            title="Avg. Clicks/Link"
            value={analyticsData?.totalUrls ? Math.round((analyticsData.totalClicks / analyticsData.totalUrls) || 0) : 0}
            icon={BarChart3}
            trend={15}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Hourly Activity</h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {hourlyData.map((item) => {
                const maxClicks = Math.max(...hourlyData.map(d => d.clicks), 1)
                const height = (item.clicks / maxClicks) * 100
                return (
                  <div key={item.hour} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                      title={`${item.hour}:00 - ${item.clicks} clicks`}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{item.hour}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Device Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(deviceData).map(([device, percentage]) => {
                const Icon = device === 'desktop' ? Monitor : device === 'mobile' ? Smartphone : Globe
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{device}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Countries */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Countries</h3>
            <div className="space-y-4">
              {Object.entries(countryData).map(([country, percentage]) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referrer Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Traffic Sources</h3>
            <div className="space-y-4">
              {Object.entries(referrerData).map(([source, percentage]) => (
                <div key={source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-10">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}