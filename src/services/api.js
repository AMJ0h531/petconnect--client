// src/services/api.js
// WHY axios instance: configure base URL and JWT header ONCE
// Every service file imports this — never writes the full URL or auth header again
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
})

// WHY request interceptor: automatically adds "Authorization: Bearer <token>"
// to every outgoing request — no manual header management in components
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// WHY response interceptor: if server returns 401 (token expired),
// automatically log the user out and redirect to login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api