'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth-service'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
    let isValid = true

    if (!formData.name) {
      newErrors.name = 'الاسم مطلوب'
      isValid = false
    } else if (formData.name.length < 2) {
      newErrors.name = 'يجب أن يكون الاسم حرفين على الأقل'
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'الرجاء إدخال بريد إلكتروني صحيح'
      isValid = false
    }

    if (!formData.phone) {
      newErrors.phone = 'رقم الهاتف مطلوب'
      isValid = false
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'الرجاء إدخال رقم هاتف صحيح مكون من 10 أرقام'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })

      if (response.status === 'success') {
        setSuccessMessage(response.message)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setErrorMessage(response.message)
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Registration failed. Please try again.')
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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">إنشاء حساب جديد</h2>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-right">
            {errorMessage === 'Invalid credentials' ? 'بيانات الاعتماد غير صالحة' : errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-right">
            {successMessage === 'Registration successful!' ? 'تم التسجيل بنجاح!' : successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-right">الاسم الكامل</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              placeholder="أدخل اسمك الكامل"
              dir="rtl"
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1 text-right">
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-right">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              placeholder="أدخل بريدك الإلكتروني"
              dir="rtl"
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1 text-right">
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الهاتف</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              placeholder="أدخل رقم هاتفك"
              dir="rtl"
            />
            {errors.phone && (
              <div className="text-red-500 text-sm mt-1 text-right">
                {errors.phone}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              placeholder="أدخل كلمة المرور"
              dir="rtl"
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1 text-right">
                {errors.password}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-right">تأكيد كلمة المرور</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              placeholder="تأكيد كلمة المرور"
              dir="rtl"
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm mt-1 text-right">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            إنشاء حساب
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          لديك حساب بالفعل؟ <Link href="/login" className="text-blue-600 hover:underline cursor-pointer">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  )
}