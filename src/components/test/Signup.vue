<template>
  <label>
    用户名<input v-model="username" type="textarea" />
  </label>
  <label>
    账户<input v-model="account" type="textarea" />
  </label>
  <label>
    密码<input v-model="password" type="password" />
  </label>
  <button @click="handleSignup" :disabled="disabled">{{ label }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signup } from '../../services/user'
import { AxiosError } from 'axios'

const account = ref('')
const username = ref('')
const password = ref('')

const disabled = ref(false)
const label = ref('注册')

const handleSignup = async () => {
  try {
    disabled.value = true;
    label.value = '请求注册中';
    
    await new Promise<void>((resolve) => {
      setTimeout(() => {resolve()}, 1000)
    })

    const data = await signup(username.value, account.value, password.value)

    console.log('注册结果: ', data)
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('错误码: ', error.status)
      console.log(error.response?.data)
    }
  } finally {
    disabled.value = false
    label.value = '注册'
  }
}
</script>