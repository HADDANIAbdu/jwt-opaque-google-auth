'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { authService } from '@/lib/auth-service'

export default function Login() {
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  useEffect(() => {
    getGoogleUrl()
  }, [])

  const getGoogleUrl = async () => {
    try {
      const data = await authService.getGoogleUrl()
      setUrl(data.authURL)
    } catch (error) {
      console.error('Error getting Google URL:', error)
    }
  }

  const validateForm = () => {
    const newErrors = { email: '', password: '' }
    let isValid = true

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setMessage('يرجى ملء جميع الحقول بشكل صحيح')
      return
    }

    try {
      await authService.login(formData.email, formData.password)
      router.push('/dashboard')
    } catch (error: any) {
      setMessage(error.message || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiM2NjYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">تسجيل الدخول إلى حسابك</h2>
        
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border-r-4 border-red-500 text-red-700">
            <span>{message}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6" dir="rtl">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-right">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل بريدك الإلكتروني"
              dir="rtl"
            />
            {errors.email && (
              <div className="mt-1 text-sm text-red-600">
                <p>{errors.email}</p>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-right">كلمة المرور</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل كلمة المرور"
              dir="rtl"
            />
            {errors.password && (
              <div className="mt-1 text-sm text-red-600">
                <p>{errors.password}</p>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو المتابعة باستخدام</span>
          </div>
        </div>
        
        <a
          href={url}
          className="no-underline w-full flex items-center justify-center space-x-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
          dir="rtl"
        >
          <span className="text-sm font-medium text-gray-700">تسجيل الدخول باستخدام جوجل</span>
          <Image 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            width={20} 
            height={20} 
            alt="شعار جوجل"
            className="mr-2"
          />
        </a>

        <div className="mt-6 text-center text-sm text-gray-500">
          ليس لديك حساب؟ <Link href="/register" className="text-blue-600 hover:underline cursor-pointer">إنشاء حساب</Link>
        </div>
      </div>
    </div>
  )
}