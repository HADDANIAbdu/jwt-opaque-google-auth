'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/lib/auth-service'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      authService.getToken(code).then((success) => {
        if (success) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      })
    } else {
      // Check if user is already logged in
      const token = authService.getItem('token')
      if (token) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}