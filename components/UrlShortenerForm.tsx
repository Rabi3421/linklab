'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Link2, Copy, Check, QrCode, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function UrlShortenerForm() {
  const [url, setUrl] = React.useState('')
  const [shortUrl, setShortUrl] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    
    // Mock API call - simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate mock short URL
    const mockShortUrl = `lnk.lab/${Math.random().toString(36).substring(2, 8)}`
    setShortUrl(mockShortUrl)
    setIsLoading(false)
  }

  const copyToClipboard = async () => {
    if (!shortUrl) return
    
    try {
      await navigator.clipboard.writeText(`https://${shortUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => {
    setUrl('')
    setShortUrl('')
    setCopied(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL here..."
              className="w-full rounded-lg border bg-background px-4 py-3 text-base transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Shorten
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result */}
      {shortUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Your shortened URL:</p>
              <div className="mt-1 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <code className="truncate text-base font-mono text-primary">
                  https://{shortUrl}
                </code>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Shorten Another
            </button>
            <span className="inline-flex items-center rounded-md bg-accent px-3 py-1 text-sm text-accent-foreground">
              <QrCode className="mr-1 h-3 w-3" />
              QR Code Available
            </span>
            <span className="inline-flex items-center rounded-md bg-accent px-3 py-1 text-sm text-accent-foreground">
              <BarChart3 className="mr-1 h-3 w-3" />
              Analytics Ready
            </span>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>No registration required</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Custom aliases available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span>Detailed analytics</span>
        </div>
      </div>
    </div>
  )
}