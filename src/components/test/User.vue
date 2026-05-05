<template>
  {{ authStore.refreshToken }}
  <br />
  {{ authStore.accessToken || 'null' }}

  <button @click="handleClick">refresh</button>
  <button @click="handleCheck">check</button>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request';

const authStore = useAuthStore()
const handleClick = async () => {
  const { accessToken, refreshToken } = await request.post('/auth/access', { refreshToken: authStore.refreshToken }) as any
  
  authStore.setAccessToken(accessToken)
  authStore.setRefreshToken(refreshToken)
}

const handleCheck = async () => {
  console.log(authStore.isAccessTokenValid())
}
</script>