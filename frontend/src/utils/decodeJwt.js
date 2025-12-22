export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch (err) {
    console.error('Failed to decode JWT', err)
    return null
  }
}
