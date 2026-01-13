'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatNumber } from '@/lib/dateUtils'
import { useUrls } from '@/hooks/useUrls'
import { useAnalytics } from '@/hooks/useAnalytics'
import { URLList } from '@/components/url/URLList'
import { CreateURLModal } from '@/components/url/CreateURLModal'
import { Button } from '@/components/ui/button'
import { 
  Link2, 
  MousePointer, 
  Eye, 
  BarChart3,
  Plus
} from 'lucide-react'

export default function LinksPage() {
  const { urls, loading: urlsLoading } = useUrls()
  const { analytics, loading: analyticsLoading } = useAnalytics()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const isLoading = urlsLoading || analyticsLoading

  // Calculate stats from real data
  const totalUrls = urls.length
  const totalClicks = urls.reduce((sum, url) => sum + (url.url_clicks?.length || 0), 0)
  const uniqueClicks = urls.reduce((sum, url) => 
    sum + (url.url_clicks?.filter(click => click.is_unique).length || 0), 0
  )

  return (
    <div className="flex-1 overflow-auto lg:pt-0 pt-16">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Link Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage all your shortened links in one place
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Link
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? '...' : formatNumber(totalUrls)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <MousePointer className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? '...' : formatNumber(totalClicks)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Clicks</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? '...' : formatNumber(uniqueClicks)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Click Rate</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoading ? '...' : totalUrls > 0 ? `${((totalClicks / totalUrls) * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
        </div>

        {/* URL List Component */}
        <URLList showCreateButton={false} />

        {/* Create URL Modal */}
        <CreateURLModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  )
}