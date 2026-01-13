'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  QrCode,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { SignInModal } from '@/components/auth/SignInModal'
import { SignUpModal } from '@/components/auth/SignUpModal'
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal'
import QRCodeLib from 'qrcode'
import { useRouter, useSearchParams } from 'next/navigation'


interface ShortenedResult {
  shortCode: string
  shortUrl: string
  originalUrl: string
  qrCodeUrl: string
  title?: string
}

export function HomeURLShortener() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShortenedResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | 'forgot' | null>(null)
  const [pendingUrl, setPendingUrl] = useState<ShortenedResult | null>(null)

  const { user } = useAuth()

  // Check if user just authenticated and assign pending URL
  useEffect(() => {
    // Check for pendingUrl in query params if user just logged in
    const params = new URLSearchParams(window.location.search)
    const pendingShortCode = params.get('pendingUrl')

    if (user && pendingShortCode) {
      assignUrlToUser({ shortCode: pendingShortCode } as ShortenedResult)
      setPendingUrl(null)
      // Remove the query param from the URL
      params.delete('pendingUrl')
      window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`)
    }
  }, [user])

  const assignUrlToUser = async (urlResult: ShortenedResult) => {
    console.log("check")
    try {
      // Get the user's session token
      const response = await fetch('/api/assign-demo-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortCode: urlResult.shortCode })
      })

      if (response.ok) {
        // Redirect to analytics page
        window.location.href = `/dashboard/analytics?url=${urlResult.shortCode}`
      }
    } catch (error) {
      console.error('Failed to assign URL to user:', error)
    }
  }

  // Generate short code for demo/non-authenticated users
  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Validate URL
      const urlObj = new URL(url)

      if (user) {
        // Authenticated user - use API
        const response = await fetch('/api/urls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalUrl: url })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create short link')
        }

        const newUrl = await response.json()
        setResult({
          shortCode: newUrl.shortCode,
          shortUrl: newUrl.shortUrl,
          originalUrl: newUrl.originalUrl,
          qrCodeUrl: newUrl.qrCodeUrl,
          title: newUrl.title
        })
      } else {
        // Non-authenticated user - use demo API
        const response = await fetch('/api/demo-shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalUrl: url })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to create short link')
        }

        const demoResult = await response.json()
        setResult({
          shortCode: demoResult.shortCode,
          shortUrl: demoResult.shortUrl,
          originalUrl: demoResult.originalUrl,
          qrCodeUrl: demoResult.qrCodeUrl,
          title: demoResult.title
        })
      }

      setUrl('')
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('Invalid URL')) {
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


  const handleAnalytics = () => {
    if (!user) {
      if (result) {
        // Add ?pendingUrl=shortCode to the URL without reloading
        const params = new URLSearchParams(window.location.search)
        params.set('pendingUrl', result.shortCode)
        router.replace(`?${params.toString()}`)
        setPendingUrl(result)
        setAuthModal('signin')
      }
      return
    }
    if (result) {
      window.location.href = `/dashboard/analytics?url=${result.shortCode}`
    }
  }

  const handleNewLink = () => {
    setResult(null)
    setError('')
    setShowQR(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Result Display */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400 mb-2">Your shortened URL:</p>
                <div className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Link2 className="w-4 h-4" />
                    <span className="font-mono">{result.shortUrl}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.shortUrl)}
                    className="h-8 w-8 p-0 hover:bg-gray-700"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewLink}
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Shorten Another
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQR(!showQR)}
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  QR Code Available
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalytics}
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics Ready
                </Button>
              </div>

              {/* QR Code Display */}
              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 text-center border-t border-gray-700 pt-6"
                  >
                    <img
                      src={result.qrCodeUrl}
                      alt="QR Code"
                      className="w-32 h-32 mx-auto border border-gray-600 rounded-lg bg-white p-2"
                    />
                    <p className="text-xs text-gray-400 mt-2">Scan to visit link</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features List */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Custom aliases available</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Detailed analytics</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=RnsBnRf8ILWYY&list=RDRnsBnRf"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-14 text-lg px-6 rounded-2xl"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={!url.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 rounded-2xl text-lg font-medium"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Link2 className="w-5 h-5 mr-2" />
                    Shorten
                  </>
                )}
              </Button>
            </form>

            {/* Features List */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Custom aliases available</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Detailed analytics</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals */}
      <Suspense fallback={<div />}>
        <SignInModal
          isOpen={authModal === 'signin'}
          onClose={() => setAuthModal(null)}
          onSwitchToSignUp={() => setAuthModal('signup')}
          onSwitchToForgotPassword={() => setAuthModal('forgot')}
        />

        <SignUpModal
          isOpen={authModal === 'signup'}
          onClose={() => setAuthModal(null)}
          onSwitchToSignIn={() => setAuthModal('signin')}
        />

        <ForgotPasswordModal
          isOpen={authModal === 'forgot'}
          onClose={() => setAuthModal(null)}
          onBack={() => setAuthModal('signin')}
        />
      </Suspense>
    </div>
  )
}