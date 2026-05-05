<template>

</template>

<script setup lang="ts">
import { AxiosError } from 'axios'
import { login } from '../../services/user'
import { access } from '../../services/authentication'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

try {
  const res: any = await login('123@qq.com', '2025.Dan')

  const payload = JSON.parse(atob(res.refreshToken.split('.')[1]))

  console.log(payload);

  const result: any = await access(res.refreshToken)

  authStore.setRefreshToken(result.refreshToken)
  authStore.setAccessToken(result.accessToken)
} catch (error) {
  if (error instanceof AxiosError) {
    console.log('错误码: ', error.status)
    console.log(error.response?.data)
  }
}
</script>