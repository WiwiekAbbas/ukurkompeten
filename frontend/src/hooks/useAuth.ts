import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface User {
  id: string
  email: string
  full_name: string
  location?: string
  target_role?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }

    // Fetch user data
    api.get('/api/v1/users/me')
      .then((response) => {
        setUser(response.data)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', null, {
      params: { email, password },
    })
    
    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)
    
    const userResponse = await api.get('/api/v1/users/me')
    setUser(userResponse.data)
  }

  const register = async (userData: any) => {
    const response = await api.post('/api/v1/auth/register', userData)
    
    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)
    
    const userResponse = await api.get('/api/v1/users/me')
    setUser(userResponse.data)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    router.push('/login')
  }

  return { user, loading, login, register, logout }
}
