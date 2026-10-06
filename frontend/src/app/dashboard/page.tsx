'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch user data and modules
    const fetchData = async () => {
      try {
        // TODO: Implement get user endpoint
        // const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
        // setUser(userResponse.data)

        const modulesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/assessments/modules`)
        setModules(modulesResponse.data.modules)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-navy">UkurKompeten</div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hi, {user?.full_name || 'User'}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                router.push('/')
              }}
              className="text-gray-600 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Dashboard</h1>

        {/* Welcome Card */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-navy mb-2">
            Selamat Datang di UkurKompeten!
          </h2>
          <p className="text-gray-600">
            Mulai perjalanan Anda untuk mengenal kemampuan dan mengembangkan kompetensi.
          </p>
        </div>

        {/* Assessment Modules */}
        <h2 className="text-xl font-semibold text-navy mb-4">Assessment Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module: any) => (
            <div key={module.module_id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-navy mb-2">{module.name}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {module.time_limit ? `${module.time_limit} menit` : 'Unlimited'}
                </span>
                <Link
                  href={`/assess/${module.module_id}`}
                  className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition"
                >
                  Mulai
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
