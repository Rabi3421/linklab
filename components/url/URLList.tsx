'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Copy, 
  ExternalLink, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  QrCode,
  Calendar,
  MousePointer,
  Search,
  Filter,
  Plus
} from 'lucide-react'
import { formatDate, formatRelativeTime, formatNumber } from '@/lib/dateUtils'
import { useUrls, type URL } from '@/hooks/useUrls'
import { CreateURLModal } from './CreateURLModal'

interface URLListProps {
  showCreateButton?: boolean
  limit?: number
  className?: string
}

export function URLList({ showCreateButton = true, limit, className = '' }: URLListProps) {
  const { urls, loading, error, fetchUrls, deleteUrl } = useUrls()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Filter URLs based on search term and limit
  const filteredUrls = urls
    .filter(url => 
      url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (url.title && url.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(0, limit || urls.length)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDeleteUrl = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await deleteUrl(id)
      } catch (err) {
        console.error('Failed to delete URL:', err)
      }
    }
  }

  const getShortUrl = (shortCode: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${baseUrl}/${shortCode}`
  }

  const getTotalClicks = (url: URL) => {
    return url.url_clicks?.length || 0
  }

  const getUniqueClicks = (url: URL) => {
    return url.url_clicks?.filter(click => click.is_unique).length || 0
  }

  if (loading && urls.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
        <p className="text-red-600 dark:text-red-400">Error loading URLs: {error}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Links
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {urls.length} link{urls.length !== 1 ? 's' : ''} created
          </p>
        </div>
        {showCreateButton && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Link
          </Button>
        )}
      </div>

      {/* Search */}
      {urls.length > 0 && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* URL List */}
      {filteredUrls.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No links found' : 'No links yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first short link to get started'
            }
          </p>
          {!searchTerm && showCreateButton && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Link
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUrls.map((url) => (
            <motion.div
              key={url.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Title and URL */}
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {url.title || 'Untitled Link'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={getShortUrl(url.short_code)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-sm"
                      >
                        {getShortUrl(url.short_code)}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(getShortUrl(url.short_code), url.id)}
                        className="h-6 w-6 p-0"
                      >
                        {copied === url.id ? (
                          <div className="w-3 h-3 text-green-500">✓</div>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                      {url.original_url}
                    </p>
                  </div>

                  {/* Tags */}
                  {url.url_tags && url.url_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {url.url_tags.map((urlTag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          style={{ backgroundColor: `${urlTag.tags.color}20`, color: urlTag.tags.color }}
                          className="text-xs"
                        >
                          {urlTag.tags.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      <span>{formatNumber(getTotalClicks(url))} clicks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(getUniqueClicks(url))} unique</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {formatRelativeTime(url.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  {url.qr_code_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Show QR code modal
                        const modal = document.createElement('div')
                        modal.innerHTML = `
                          <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onclick="this.remove()">
                            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm" onclick="event.stopPropagation()">
                              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">QR Code</h3>
                              <img src="${url.qr_code_url}" alt="QR Code" class="w-48 h-48 mx-auto mb-4" />
                              <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Close</button>
                            </div>
                          </div>
                        `
                        document.body.appendChild(modal)
                      }}
                      title="Show QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <a
                    href={url.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Visit original URL"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </a>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUrl(url.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create URL Modal */}
      <CreateURLModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // URLs will be refetched automatically by the hook
          setShowCreateModal(false)
        }}
      />
    </div>
  )
}