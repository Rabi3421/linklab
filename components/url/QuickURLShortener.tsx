'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink,
  Loader2,
  Plus
} from 'lucide-react'
import { useUrls } from '@/hooks/useUrls'

export function QuickURLShortener() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const { createUrl } = useUrls()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Validate URL
      new URL(url)
      
      const newUrl = await createUrl({ originalUrl: url })
      setResult(newUrl)
      setUrl('')
    } catch (err) {
      if (err instanceof TypeError) {
        setError('Please enter a valid URL (include http:// or https://)')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create short link')
      }
    } finally {
      setLoading(false)
    }
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

  const handleNewLink = () => {
    setResult(null)
    setError('')
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Link Shortener</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create a short link instantly</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Link created successfully!
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Short URL:</p>
                  <p className="font-mono text-blue-600 dark:text-blue-400 truncate">
                    {result.shortUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.shortUrl)}
                  className="ml-3"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleNewLink}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Another
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.open(result.originalUrl, '_blank')}
                size="sm"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/very-long-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={!url.trim() || loading}
                className="px-6"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Shorten'
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter a URL to create a short link with analytics tracking
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}