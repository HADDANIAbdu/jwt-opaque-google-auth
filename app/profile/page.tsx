'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { authService } from '@/lib/auth-service'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [editableUser, setEditableUser] = useState<any>({})
  const [isGoogle, setIsGoogle] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userInfo = authService.getItem('user-info')
    if (userInfo) {
      setUser(userInfo)
      setIsGoogle(userInfo.isGoogle || false)
      setEditableUser({ ...userInfo })
    }
  }, [])

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message)
    setAlertType(type)
    setTimeout(() => {
      setAlertMessage('')
      setAlertType(null)
    }, 5000)
  }

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadPhoto(file)
    }
  }

  const uploadPhoto = async (file: File) => {
    setIsUploading(true)
    try {
      const response = await authService.addPhoto(file)
      if (response && response.data) {
        const updatedUser = authService.getItem('user-info')
        setUser(updatedUser)
        setEditableUser({ ...updatedUser })
        showAlert(response.message, response.status === 'success' ? 'success' : 'error')
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      showAlert(error.message || 'حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const onUpdateProfile = () => {
    authService.setItem('user-info', editableUser)
    setUser({ ...editableUser })
    showAlert('تم تحديث الملف الشخصي بنجاح!', 'success')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditableUser((prev: any) => ({ ...prev, [name]: value }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-700 to-indigo-900">
        {alertMessage && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-500 ${
            alertType === 'success' 
              ? 'bg-green-100 border-l-4 border-green-500 text-green-700' 
              : 'bg-red-100 border-l-4 border-red-500 text-red-700'
          }`} role="alert">
            <div className="flex items-center">
              {alertType === 'success' && (
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {alertType === 'error' && (
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="mr-3">
                <p className="text-sm font-medium">{alertMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute w-64 h-64 bg-blue-500 rounded-full -top-16 -left-16 opacity-30 mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute w-72 h-72 bg-purple-500 rounded-full -bottom-16 -right-16 opacity-30 mix-blend-multiply filter blur-xl animation-delay-2000 animate-blob"></div>
        <div className="absolute w-80 h-80 bg-indigo-500 rounded-full top-1/4 left-1/4 opacity-30 mix-blend-multiply filter blur-xl animation-delay-4000 animate-blob"></div>

        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-md relative z-10 text-center" dir="rtl">
          <div className="relative inline-block">
            <img 
              src={isGoogle ? user?.photo : `data:image/png;base64,${user?.photo}`}
              alt="صورة الملف الشخصي" 
              className="w-28 h-28 mx-auto rounded-full border-4 border-blue-500 mb-4 object-cover" 
            />
            {!isGoogle && (
              <div className="absolute bottom-0 right-0">
                <label htmlFor="profilePhoto" className="cursor-pointer">
                  <div className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <input
                    type="file"
                    id="profilePhoto"
                    onChange={onFileSelected}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">{user?.name}</h2>

          {!isGoogle && (
            <form onSubmit={(e) => { e.preventDefault(); onUpdateProfile(); }} className="space-y-4 text-right">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editableUser.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  placeholder="أدخل اسمك الكامل"
                  dir="rtl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                حفظ التغييرات
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <p><strong>الاسم الكامل:</strong> {user?.name}</p>
            <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
            <p><strong>اللغة:</strong> {user?.locale}</p>
            <p><strong>الهاتف:</strong> {user?.phone}</p>
            <p>
              <strong>تم التحقق من البريد الإلكتروني:</strong>
              <span className={user?.email_verified ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {user?.email_verified ? 'نعم ✅' : 'لا ❌'}
              </span>
            </p>
            {isGoogle && (
              <p className="mt-4 text-blue-600">
                <i>ملف شخصي مرتبط بحساب Google - لا يمكن تعديل المعلومات</i>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}