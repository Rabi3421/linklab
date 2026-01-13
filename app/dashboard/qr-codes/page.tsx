'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/dateUtils'
import { 
  QrCode, 
  Download, 
  Copy, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Link2,
  Eye,
  MousePointer,
  Loader2
} from 'lucide-react'

interface QRCodeData {
  id: string
  shortUrl: string
  originalUrl: string
  title: string
  qrCodeUrl: string
  scans: number
  downloads: number
  createdAt: string
  format: string
  size: string
}

export default function QrCodesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchQrCodes()
  }, [])

  const fetchQrCodes = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/qr-codes')
      if (!response.ok) {
        throw new Error('Failed to fetch QR codes')
      }
      const data = await response.json()
      setQrCodes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load QR codes')
    } finally {
      setLoading(false)
    }
  }

  const filteredCodes = qrCodes.filter(qr => 
    qr.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSelectCode = (id: string) => {
    setSelectedCodes(prev => 
      prev.includes(id) 
        ? prev.filter(codeId => codeId !== id)
        : [...prev, id]
    )
  }

  const selectAllCodes = () => {
    setSelectedCodes(
      selectedCodes.length === filteredCodes.length 
        ? []
        : filteredCodes.map(qr => qr.id)
    )
  }

  const downloadQr = (qrCode: QRCodeData) => {
    // Create download link for the QR code
    const link = document.createElement('a')
    link.href = qrCode.qrCodeUrl
    link.download = `${qrCode.shortUrl.split('/').pop()}-qr.png`
    link.click()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const regenerateAllQrCodes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/qr-codes/generate', {
        method: 'PUT'
      })
      
      if (!response.ok) {
        throw new Error('Failed to regenerate QR codes')
      }

      const result = await response.json()
      console.log(result.message)
      
      // Refresh the QR codes list
      await fetchQrCodes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate QR codes')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto lg:pt-0 pt-16">
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading QR codes...</p>
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
              onClick={fetchQrCodes}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto lg:pt-0 pt-16">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Codes</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Generate and manage QR codes for your short links
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <QrCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">QR Codes</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{qrCodes.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Scans</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {qrCodes.reduce((sum, qr) => sum + qr.downloads, 0)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <MousePointer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Scans</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {qrCodes.length ? Math.round(qrCodes.reduce((sum, qr) => sum + qr.scans, 0) / qrCodes.length) : 0}
            </p>
          </div>
        </div>

        {/* QR Codes Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search QR codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {selectedCodes.length > 0 && (
                  <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedCodes.length})
                  </button>
                )}
                <button 
                  onClick={regenerateAllQrCodes}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  {loading ? 'Generating...' : 'Regenerate All'}
                </button>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New URL
                </button>
              </div>
            </div>
          </div>

          {/* QR Codes Grid/Table */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCodes.map((qrCode) => (
                <motion.div
                  key={qrCode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                >
                  {/* QR Code Image */}
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      {qrCode.qrCodeUrl ? (
                        <img 
                          src={qrCode.qrCodeUrl} 
                          alt="QR Code" 
                          className="w-28 h-28 rounded"
                        />
                      ) : (
                        <QrCode className="h-24 w-24 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* QR Code Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Title
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {qrCode.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Short URL
                      </p>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                        {qrCode.shortUrl}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Original URL
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                        {qrCode.originalUrl}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Scans
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {qrCode.scans}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Downloads
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {qrCode.downloads}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{qrCode.format} • {qrCode.size}</span>
                      <span>{formatDate(qrCode.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(qrCode.id)}
                          onChange={() => toggleSelectCode(qrCode.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadQr(qrCode)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Download QR Code"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => copyToClipboard(qrCode.shortUrl)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Copy Short URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => window.open(qrCode.originalUrl, '_blank')}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Open Original URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCodes.length === 0 && !loading && (
              <div className="text-center py-12">
                <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No QR codes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Create URLs to automatically generate QR codes.'}
                </p>
                {!searchTerm && (
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create New URL
                    </button>
                    <button
                      onClick={regenerateAllQrCodes}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Check for Existing URLs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generate QR Code Modal */}
      {showCreateModal && (
        <QRCodeCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchQrCodes() // Refresh the list
          }}
        />
      )}
    </div>
  )
}

// QR Code Creation Modal Component
function QRCodeCreateModal({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void
  onSuccess: () => void 
}) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url.trim(),
          title: title.trim() || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create URL')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create QR code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Generate QR Code
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My QR Code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={loading || !url.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}