<template>
  <div class="window">
    <div class="content">
      <div class="title">
        LIBHUB
      </div>

      <div class="field gap info" :class="{'success': state === 'success', 'danger': state === 'failed'}" v-if="state !== 'unexecuted'">
        {{ infoMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="form">
        <input v-model="account" class="field gap" placeholder="账户"></input>
        <input type="password" v-model="password" class="field gap" placeholder="密码"></input>
        <button :disabled="isLoading" class="field button" :class="{ 'loading': isLoading }">
          <template v-if="isLoading">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
            <div>加载中</div>
          </template>
          <template v-else>
            <div>登录</div>
          </template>
        </button>
      </form>
    </div>
    <div class="footer">
      <router-link to="/signup" class="fac">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <div>注册</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import request from '../utils/request';
import { AxiosError } from 'axios';
import { useAuthStore } from '../stores/auth';
import validator from 'validator';
import { useRouter } from 'vue-router';

type LoginState = 
  | 'unexecuted'
  | 'success'
  | 'failed'
;
const state: Ref<LoginState> = ref('unexecuted');
const infoMessage = ref('');

const account = ref('');
const password = ref('');

const isLoading = ref(false);

const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;

  const user = {
    account: account.value,
    password: password.value,
  };

  try {
    const data: any = await request.post('user/login', user);

    state.value = 'success';
    infoMessage.value = '登录成功';

    if (data.success) {
      const { refreshToken } = data;
    
      if (refreshToken && validator.isJWT(refreshToken)) {
        const authStore = useAuthStore();
        authStore.setRefreshToken(refreshToken);
      } else {
        throw new Error('错误的refresh token');
      }
    } else {
      throw new Error('错误的响应');
    }

    setTimeout(() => {
      router.push({ name: 'home' })
    }, 500);
  } catch (error) {
    state.value = 'failed';
    infoMessage.value = '登录失败';

    console.error(error);

    if (error instanceof AxiosError) {
      const data = error.response?.data;

      console.log(data);
      
      if (data?.error === 'invalid fields') {
        infoMessage.value = '错误的账户或密码';
      } else if (data?.error === 'wrong account or password') {
        infoMessage.value = '错误的账户或密码';
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.window {
  border-radius: 4px;
  width: 480px;
  overflow: hidden; 
}

.content {
  background-color: #FFFFFF;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.title {
  color: #00a3af;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.4rem;
}

.form {
  display: flex;
  flex-direction: column;
}

.field {
  border: 0;
  background-color: #F5F5F5;
  padding: 0.5rem;
  border-radius: 4px;
}

.button {
  background-color: #00a3af;
  color: white;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1rem;
    height: 1rem;
    stroke: white;
    stroke-width: 2px;
  }
}

.button:hover {
  background-color: #008899;
}

.button.loading {
  background-color: #bce2e8;
}

.button.loading:hover {
  background-color: #bce2e8;
}

.gap {
  margin-bottom: 1rem;
}

.info {
  text-align: center;
  color: #757575;
}

.info.success {
  color: white;
  background-color: #aacf53;
}

.info.danger {
  color: white;
  background-color: #d9333f;
}

.footer {
  background-color: #F5F5F5;
  padding: 0.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  color: #757575;
  display: flex;
  align-items: center;

  svg {
    width: 1rem;
    height: 1rem;
    stroke: #757575;
    stroke-width: 2px;
  }
}
</style>