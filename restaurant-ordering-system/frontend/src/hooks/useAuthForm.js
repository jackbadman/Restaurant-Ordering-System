import { useState } from 'react'
import api from '../api/axios.js'

const initialPayload = {
  name: '',
  email: '',
  password: '',
}

export default function useAuthForm({ setView }) {
  const [signupStatus, setSignupStatus] = useState(null)

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    // Placeholder for authentication flow
    console.log('Submit login')
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

  return { handleLoginSubmit, handleSignupSubmit, signupStatus, clearSignupStatus }
}
