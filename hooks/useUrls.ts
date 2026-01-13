import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

export interface URL {
  id: string
  original_url: string
  short_code: string
  custom_alias?: string
  title?: string
  description?: string
  favicon_url?: string
  qr_code_url?: string
  domain_id?: string
  campaign_id?: string
  password?: string
  expiry_date?: string
  click_limit?: number
  is_active: boolean
  created_at: string
  updated_at: string
  domains?: { domain: string }
  campaigns?: { name: string; utm_campaign?: string }
  url_tags?: Array<{ tags: { name: string; color: string } }>
  url_clicks?: Array<any>
}

export interface URLsResponse {
  urls: URL[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CreateURLRequest {
  originalUrl: string
  customAlias?: string
  title?: string
  description?: string
  domainId?: string
  campaignId?: string
  password?: string
  expiryDate?: string
  clickLimit?: number
  tags?: string[]
  utmParameters?: Record<string, string>
}

export interface UpdateURLRequest {
  originalUrl?: string
  title?: string
  description?: string
  domainId?: string
  campaignId?: string
  password?: string
  expiryDate?: string
  clickLimit?: number
  isActive?: boolean
  tags?: string[]
}

export interface BulkOperation {
  action: 'delete' | 'activate' | 'deactivate' | 'add_tags' | 'remove_tags' | 'set_campaign' | 'set_expiry'
  urlIds: string[]
  data?: any
}

export function useUrls() {
  const { user } = useAuth()
  const [urls, setUrls] = useState<URL[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const fetchUrls = async (params?: {
    page?: number
    limit?: number
    search?: string
    tag?: string
    campaign?: string
  }) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.search) queryParams.set('search', params.search)
      if (params?.tag) queryParams.set('tag', params.tag)
      if (params?.campaign) queryParams.set('campaign', params.campaign)

      const response = await fetch(`/api/urls?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch URLs')
      }

      const data: URLsResponse = await response.json()
      setUrls(data.urls)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createUrl = async (urlData: CreateURLRequest) => {
    if (!user) throw new Error('Not authenticated')

    const response = await fetch('/api/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(urlData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create URL')
    }

    const newUrl = await response.json()
    
    // Refresh the URLs list
    await fetchUrls({ page: pagination.page, limit: pagination.limit })
    
    return newUrl
  }

  const updateUrl = async (id: string, urlData: UpdateURLRequest) => {
    if (!user) throw new Error('Not authenticated')

    const response = await fetch(`/api/urls/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(urlData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update URL')
    }

    const result = await response.json()
    
    // Update the URL in the local state
    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.id === id ? { ...url, ...urlData, updated_at: new Date().toISOString() } : url
      )
    )
    
    return result
  }

  const deleteUrl = async (id: string) => {
    if (!user) throw new Error('Not authenticated')

    const response = await fetch(`/api/urls/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete URL')
    }

    // Remove the URL from local state
    setUrls(prevUrls => prevUrls.filter(url => url.id !== id))
    
    return await response.json()
  }

  const bulkOperation = async (operation: BulkOperation) => {
    if (!user) throw new Error('Not authenticated')

    const response = await fetch('/api/urls/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(operation)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Bulk operation failed')
    }

    // Refresh the URLs list after bulk operation
    await fetchUrls({ page: pagination.page, limit: pagination.limit })
    
    return await response.json()
  }

  const getUrlAnalytics = async (id: string) => {
    if (!user) throw new Error('Not authenticated')

    const response = await fetch(`/api/urls/${id}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch URL analytics')
    }

    return await response.json()
  }

  // Auto-fetch on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUrls()
    }
  }, [user])

  return {
    urls,
    loading,
    error,
    pagination,
    fetchUrls,
    createUrl,
    updateUrl,
    deleteUrl,
    bulkOperation,
    getUrlAnalytics,
    refresh: () => fetchUrls({ page: pagination.page, limit: pagination.limit })
  }
}