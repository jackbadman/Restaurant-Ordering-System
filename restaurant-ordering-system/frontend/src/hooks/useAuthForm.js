import { useState } from 'react'
import api from '../api/axios.js'
import { decodeJwt } from '../utils/decodeJwt.js'

const initialPayload = {
  name: '',
  email: '',
  password: '',
}

export default function useAuthForm({ setView, setAuth }) {
  const [signupStatus, setSignupStatus] = useState(null)
  const [loginStatus, setLoginStatus] = useState(null)

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setLoginStatus(null)
    const formData = new FormData(event.target)
    const payload = {
      email: formData.get('email')?.toString().trim() || '',
      password: formData.get('password')?.toString() || '',
    }
    try {
      const response = await api.post('/api/users/login', payload)
      const token = response.data?.token
      const decoded = decodeJwt(token)
      setAuth({
        token,
        userId: decoded?.userId || null,
        role: decoded?.role || null,
      })
      localStorage.setItem('authToken', token)
      event.target.reset()
      setView('home')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Login failed. Please try again.'
      setLoginStatus({ type: 'error', message })
    }
  }

  const handleSignupSubmit = async (event) => {
    event.preventDefault()
    setSignupStatus(null)
    const formData = new FormData(event.target)
    const payload = {
      ...initialPayload,
      name: formData.get('name')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      password: formData.get('password')?.toString() || '',
    }
    try {
      await api.post('/api/users/register', payload)
      event.target.reset()
      setSignupStatus({
        type: 'success',
        message: 'Account created. Please log in.',
      })
      setView('login')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Sign up failed. Please try again.'
      setSignupStatus({ type: 'error', message })
      console.error('Signup failed', err)
    }
  }

  const clearSignupStatus = () => setSignupStatus(null)

  return {
    handleLoginSubmit,
    handleSignupSubmit,
    signupStatus,
    loginStatus,
    clearSignupStatus,
  }
}
