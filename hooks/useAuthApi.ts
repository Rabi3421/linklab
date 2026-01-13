'use client'

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export const useAuthApi = () => {
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`/api/auth${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'An error occurred' }
      }

      return data
    } catch (error) {
      return { error: 'Network error occurred' }
    }
  }

  const signUp = (email: string, password: string, name?: string) => 
    apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })

  const signIn = (email: string, password: string) =>
    apiCall('/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

  const signOut = () =>
    apiCall('/signout', {
      method: 'POST',
    })

  const resetPassword = (email: string) =>
    apiCall('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

  const updatePassword = (password: string) =>
    apiCall('/user', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })

  const getUser = () =>
    apiCall('/user', {
      method: 'GET',
    })

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    getUser,
  }
}

export default useAuthApi