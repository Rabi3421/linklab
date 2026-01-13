import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

export interface Campaign {
  id: string
  name: string
  description?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  is_active: boolean
  created_at: string
  updated_at: string
  urlCount?: number
  totalClicks?: number
}

export interface Tag {
  id: string
  name: string
  color: string
  created_at: string
  urlCount?: number
}

export function useCampaigns() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/campaigns')
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }

      const data = await response.json()
      setCampaigns(data.campaigns)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'urlCount' | 'totalClicks'>) => {
    if (!user) throw new Error('Not authenticated')

    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create campaign')
    }

    const result = await response.json()
    
    // Add the new campaign to local state
    setCampaigns(prev => [result.campaign, ...prev])
    
    return result.campaign
  }

  // Auto-fetch on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCampaigns()
    }
  }, [user])

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    refresh: fetchCampaigns
  }
}

export function useTags() {
  const { user } = useAuth()
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/tags')
      
      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }

      const data = await response.json()
      setTags(data.tags)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createTag = async (name: string, color: string = '#3b82f6') => {
    if (!user) throw new Error('Not authenticated')

    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create tag')
    }

    const result = await response.json()
    
    // Add the new tag to local state
    setTags(prev => [...prev, result.tag])
    
    return result.tag
  }

  // Auto-fetch on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTags()
    }
  }, [user])

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    refresh: fetchTags
  }
}