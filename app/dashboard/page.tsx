'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { authService } from '@/lib/auth-service'

interface Document {
  documentId: string
  documentName: string
  documentCategory: string
  documentImage: string
}

interface ApiResponse {
  status: string
  message: string
  data: any
}

export default function Dashboard() {
  const [responseMessage, setResponseMessage] = useState<ApiResponse | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const router = useRouter()

  useEffect(() => {
    getUserInfo()
    getDocuments()
  }, [])

  const getUserInfo = async () => {
    try {
      const response = await authService.getUserInfo()
      setResponseMessage(response)
    } catch (error) {
      router.push('/login')
    }
  }

  const getDocuments = async () => {
    try {
      const response = await authService.getDocuments()
      setDocuments(response.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <>
      <Header />
      <div>
        <div>
          <h5 className="bg-green-300 text-green-600">{responseMessage?.message}</h5>
        </div>
        <span>{responseMessage?.data?.name}</span>
      </div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Documents</h2>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.documentId} className="bg-white rounded-2xl shadow-md p-6">
              <img 
                src={`data:image/png;base64,${doc.documentImage}`} 
                className="w-full h-48 object-cover rounded mb-3"
                alt={doc.documentName}
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{doc.documentName}</h3>
              <p className="text-sm text-gray-500 mb-1"><strong>Category:</strong> {doc.documentCategory}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}