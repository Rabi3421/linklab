'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Link2, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Settings, 
  Calendar,
  Hash,
  Eye,
  EyeOff,
  X
} from 'lucide-react'
import { useUrls } from '@/hooks/useUrls'
import { useCampaigns, useTags } from '@/hooks/useCampaignsAndTags'

interface CreateURLModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (url: any) => void
}

export function CreateURLModal({ isOpen, onClose, onSuccess }: CreateURLModalProps) {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    description: '',
    campaignId: '',
    password: '',
    expiryDate: '',
    clickLimit: '',
    tags: [] as string[]
  })
  const [newTag, setNewTag] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [createdUrl, setCreatedUrl] = useState<any>(null)

  const { createUrl } = useUrls()
  const { campaigns } = useCampaigns()
  const { tags, createTag } = useTags()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate URL
      if (!formData.originalUrl) {
        throw new Error('URL is required')
      }

      try {
        new URL(formData.originalUrl)
      } catch {
        throw new Error('Please enter a valid URL')
      }

      // Prepare data
      const urlData = {
        originalUrl: formData.originalUrl,
        ...(formData.customAlias && { customAlias: formData.customAlias }),
        ...(formData.title && { title: formData.title }),
        ...(formData.description && { description: formData.description }),
        ...(formData.campaignId && { campaignId: formData.campaignId }),
        ...(formData.password && { password: formData.password }),
        ...(formData.expiryDate && { expiryDate: new Date(formData.expiryDate).toISOString() }),
        ...(formData.clickLimit && { clickLimit: parseInt(formData.clickLimit) }),
        ...(formData.tags.length > 0 && { tags: formData.tags })
      }

      const result = await createUrl(urlData)
      setCreatedUrl(result)
      
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create URL')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    try {
      await createTag(newTag.trim())
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    } catch (err) {
      console.error('Failed to create tag:', err)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      originalUrl: '',
      customAlias: '',
      title: '',
      description: '',
      campaignId: '',
      password: '',
      expiryDate: '',
      clickLimit: '',
      tags: []
    })
    setCreatedUrl(null)
    setError('')
    setShowAdvanced(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  // Success state - show created URL
  if (createdUrl) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Link Created Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your short link is ready to use
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Short URL:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(createdUrl.shortUrl)}
                className="h-6 px-2"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <p className="text-blue-600 dark:text-blue-400 font-mono break-all">
              {createdUrl.shortUrl}
            </p>
          </div>

          {createdUrl.qrCodeUrl && (
            <div className="text-center mb-4">
              <img 
                src={createdUrl.qrCodeUrl} 
                alt="QR Code" 
                className="w-32 h-32 mx-auto border border-gray-200 dark:border-gray-600 rounded"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">QR Code</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="flex-1"
            >
              Create Another
            </Button>
            <Button 
              onClick={handleClose}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create Short Link
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Original URL */}
            <div>
              <Label htmlFor="originalUrl">Enter your long URL *</Label>
              <Input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/very-long-url"
                value={formData.originalUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            {/* Custom Alias */}
            <div>
              <Label htmlFor="customAlias">Custom alias (optional)</Label>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  {process.env.NEXT_PUBLIC_APP_URL || 'linklab.co'}/
                </span>
                <Input
                  id="customAlias"
                  placeholder="my-custom-link"
                  value={formData.customAlias}
                  onChange={(e) => setFormData(prev => ({ ...prev, customAlias: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="Link title for easier identification"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>

            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                    rows={2}
                  />
                </div>

                {/* Campaign */}
                {campaigns.length > 0 && (
                  <div>
                    <Label htmlFor="campaign">Campaign</Label>
                    <Select
                      value={formData.campaignId}
                      onChange={(e) => setFormData(prev => ({ ...prev, campaignId: e.target.value }))}
                    >
                      <option value="">Select a campaign</option>
                      {campaigns.map(campaign => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-1 mb-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Password Protection */}
                <div>
                  <Label htmlFor="password">Password Protection</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Optional password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                {/* Click Limit */}
                <div>
                  <Label htmlFor="clickLimit">Click Limit</Label>
                  <Input
                    id="clickLimit"
                    type="number"
                    placeholder="Maximum number of clicks"
                    value={formData.clickLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, clickLimit: e.target.value }))}
                    className="mt-1"
                    min="1"
                  />
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.originalUrl}
                className="flex-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Create Short Link
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}