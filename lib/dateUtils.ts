/**
 * Utility functions for consistent date formatting across server and client
 */

export function formatDate(date: string | Date, options?: {
  format?: 'short' | 'long' | 'iso'
  includeTime?: boolean
}): string {
  const { format = 'short', includeTime = false } = options || {}
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Return empty string for invalid dates
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  try {
    switch (format) {
      case 'iso':
        return dateObj.toISOString().split('T')[0] // YYYY-MM-DD
      
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          ...(includeTime && {
            hour: '2-digit',
            minute: '2-digit'
          })
        })
      
      case 'short':
      default:
        // Use consistent MM/DD/YYYY format to avoid hydration issues
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
        const day = dateObj.getDate().toString().padStart(2, '0')
        const year = dateObj.getFullYear()
        
        if (includeTime) {
          const hours = dateObj.getHours().toString().padStart(2, '0')
          const minutes = dateObj.getMinutes().toString().padStart(2, '0')
          return `${month}/${day}/${year} ${hours}:${minutes}`
        }
        
        return `${month}/${day}/${year}`
    }
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateObj.toISOString().split('T')[0] // Fallback to ISO format
  }
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`
  } else {
    return formatDate(dateObj, { format: 'short' })
  }
}

export function formatNumber(num: number, options?: {
  style?: 'decimal' | 'currency' | 'percent'
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}): string {
  const { 
    style = 'decimal',
    currency = 'USD',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options || {}
  
  try {
    // Use consistent formatting to avoid hydration issues
    if (style === 'currency') {
      return `$${num.toFixed(minimumFractionDigits)}`
    } else if (style === 'percent') {
      return `${(num * 100).toFixed(maximumFractionDigits)}%`
    } else {
      // For decimal, use manual formatting to ensure consistency
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  } catch (error) {
    console.error('Number formatting error:', error)
    return num.toString()
  }
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}