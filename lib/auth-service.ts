import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = 'http://localhost:8080/api'

class AuthService {
  private token: string = ''

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = this.getItem('token') || ''
    }
  }

  async getGoogleUrl() {
    const response = await axios.get(`${API_URL}/auth/url`)
    return response.data
  }

  async getUserInfo() {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
    
    this.setItem('user-info', response.data.data)
    return response.data
  }

  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password })
    
    if (response.data && response.data.data) {
      this.setItem('token', response.data.data.token)
      this.token = response.data.data.token
    }
    
    return response.data
  }

  async register(registerData: {
    name: string
    email: string
    phone: string
    password: string
  }) {
    const response = await axios.post(`${API_URL}/auth/register`, registerData)
    return response.data
  }

  async getDocuments() {
    const response = await axios.get(`${API_URL}/documents`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
    
    return response.data
  }

  async getToken(code: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/auth/callback?code=${code}`)
      
      if (response.status === 200 && response.data) {
        this.token = response.data.token
        this.setItem('token', this.token)
        return true
      }
      
      return false
    } catch (error) {
      return false
    }
  }

  logOut(): void {
    this.token = ''
    this.removeItem('user-info')
    this.removeItem('token')
  }

  setItem(key: string, value: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }

  getItem(key: string): any {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  }

  async addPhoto(file: File) {
    const formData = new FormData()
    formData.append('photo', file)

    const response = await axios.post(`${API_URL}/add-photo`, formData, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data && response.data.data) {
      const userInfo = this.getItem('user-info')
      if (userInfo) {
        userInfo.photo = response.data.data.photo
        this.setItem('user-info', userInfo)
      }
    }

    return response.data
  }
}

export const authService = new AuthService()

export interface ApiResponse {
  status: string
  message: string
  data: any
}