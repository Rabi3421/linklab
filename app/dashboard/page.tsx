'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDate, formatRelativeTime, formatNumber } from '@/lib/dateUtils'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useUrls } from '@/hooks/useUrls'
import { URLList } from '@/components/url/URLList'
import { CreateURLModal } from '@/components/url/CreateURLModal'
import { 
  BarChart3, 
  Link2, 
  Eye, 
  MousePointer, 
  Calendar,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Copy,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// Mock data for demonstration
const mockUrls = [
  {
    id: 1,
    originalUrl: 'https://example.com/very-long-url-that-needs-shortening',
    shortUrl: 'linklab.co/abc123',
    clicks: 245,
    uniqueClicks: 180,
    createdAt: '2024-12-20',
    lastClicked: '2024-12-24',
    status: 'active'
  },
  {
    id: 2,
    originalUrl: 'https://github.com/user/awesome-project',
    shortUrl: 'linklab.co/github-proj',
    clicks: 89,
    uniqueClicks: 65,
    createdAt: '2024-12-19',
    lastClicked: '2024-12-23',
    status: 'active'
  },
  {
    id: 3,
    originalUrl: 'https://docs.example.com/api/documentation',
    shortUrl: 'linklab.co/api-docs',
    clicks: 156,
    uniqueClicks: 98,
    createdAt: '2024-12-18',
    lastClicked: '2024-12-24',
    status: 'active'
  }
]

const mockAnalytics = {
  totalUrls: 12,
  totalClicks: 1250,
  uniqueClicks: 890,
  clicksThisMonth: 340,
  topPerformer: 'linklab.co/abc123',
  devices: {
    desktop: 45,
    mobile: 35,
    tablet: 20
  },
  countries: {
    'United States': 40,
    'United Kingdom': 25,
    'Canada': 15,
    'Australia': 10,
    'Others': 10
  }
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created')
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  
  const { analytics, loading: analyticsLoading, fetchAnalytics } = useAnalytics()
  const { urls, loading: urlsLoading } = useUrls()
  
  const [filteredUrls, setFilteredUrls] = useState(urls)

  useEffect(() => {
    let filtered = urls.filter(url => 
      url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (url.title && url.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Sort logic
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'clicks':
          return (b.url_clicks?.length || 0) - (a.url_clicks?.length || 0)
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredUrls(filtered)
  }, [searchTerm, sortBy, urls])

  // Refresh analytics when period changes
  useEffect(() => {
    if (selectedPeriod) {
      fetchAnalytics(selectedPeriod)
    }
  }, [selectedPeriod])

  const isLoading = analyticsLoading || urlsLoading

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const StatCard = ({ title, value, icon: Icon, trend, description, isPositive = true }: any) => (
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
            <span className="text-xs font-medium">{trend}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </motion.div>
  )

  return (
    <div className="flex-1 overflow-auto lg:pt-0 pt-16">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your links today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Links"
            value={mockAnalytics.totalUrls}
            icon={Link2}
            trend={12}
            description="Active short links"
          />
          <StatCard
            title="Total Clicks"
            value={formatNumber(mockAnalytics.totalClicks)}
            icon={MousePointer}
            trend={8}
            description="All-time clicks"
          />
          <StatCard
            title="Click Rate"
            value="7.2%"
            icon={Eye}
            trend={15}
            description="This month"
          />
          <StatCard
            title="Monthly Clicks"
            value={mockAnalytics.clicksThisMonth}
            icon={Calendar}
            trend={22}
            description="vs last month"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Click Performance</h3>
              <select className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Chart placeholder - Real chart would go here</p>
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Locations</h3>
            <div className="space-y-4">
              {Object.entries(mockAnalytics.countries).slice(0, 5).map(([country, percentage]) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{country}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Links</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  />
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  New Link
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Short Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUrls.slice(0, 5).map((url) => (
                  <tr key={url.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {url.short_code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${url.short_code}`)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">
                        {url.original_url}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {url.url_clicks?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {url.url_clicks?.filter(click => click.is_unique).length || 0} unique
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(url.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View all links →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}