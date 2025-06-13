export interface User {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
  locale: string
  phone?: string
  isGoogle?: boolean
}

export interface Register {
  name: string
  email: string
  phone: string
  password: string
}

export interface Token {
  token: string
}

export interface Document {
  documentId: string
  documentName: string
  documentCategory: string
  documentImage: string
}

export interface ApiResponse {
  status: string
  message: string
  data: any
}