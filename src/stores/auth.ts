import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { API_URL } from '../utils/shared'

function decoded(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function isExpired(token: string, minus: number = 30) {
  const payload = decoded(token)
  if (!payload || !payload.exp) return true

  const now = Math.floor(Date.now() / 1000)

  return now > (payload.exp - minus)
}

export const useAuthStore = defineStore('auth', () => {
  const refreshToken = ref<string | null>(null)

  const payload = computed<{
    id: number,
    role: 0 | 1
  } | null>(() => refreshToken.value ? decoded(refreshToken.value) : null);

  function init() {
    const stored = localStorage.getItem('refresh_token')
    if (stored) {
      refreshToken.value = stored
    }
  }

  function setRefreshToken(token: string) {
    refreshToken.value = token
    localStorage.setItem('refresh_token', token)
  }

  function clearRefreshToken() {
    refreshToken.value = null
    localStorage.removeItem('refresh_token')
  }

  function isRefreshTokenValid() {
    if (!refreshToken.value) return false

    return !isExpired(refreshToken.value)
  }

  const accessToken = ref<string | null>(null)

  function setAccessToken(token: string) {
    accessToken.value = token
  }

  function clearAccessToken() {
    accessToken.value = null
  }

  function isAccessTokenValid() {
    if (!accessToken.value) return false

    return !isExpired(accessToken.value)
  }

  async function rotateToken() {
    if (!refreshToken.value) throw new Error('No refresh token')

    try {
      const res = await axios.post(API_URL + '/auth/refresh', {
        refreshToken: refreshToken.value
      });    
      setAccessToken(res.data.accessToken)
      setRefreshToken(res.data.refreshToken)
    } catch (error) {
      clearAccessToken()
      clearRefreshToken()
      throw error
    }
  }

  return {
    refreshToken,
    init,
    setRefreshToken,
    clearRefreshToken,
    accessToken,
    setAccessToken,
    clearAccessToken,
    isAccessTokenValid,
    isRefreshTokenValid,
    rotateToken,
    payload
  }
})