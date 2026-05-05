<template>
  <div class="window">
    <div class="content">
      <div class="title">
        LIBHUB
      </div>
      <template v-if="state === 'success'">
        <div class="field gap info success">
          {{ infoMessage }}
        </div>
      </template>
      <template v-if="state === 'failed'">
        <div class="field gap info danger">
          {{ infoMessage }}
        </div>
      </template>
      
      <form class="form" @submit.prevent="handleSubmit">
        <input @input="validate({ username })" class="field" :class="{ gap: usernameField }" v-model="username" placeholder="用户名" ></input>
        <div class="info-text gap" v-if="!usernameField">最少需要1个字符，不能超过12个字符</div>
        <input @input="validate({ account })" class="field" :class="{ gap: accountField }" v-model="account" placeholder="账户"></input>
        <div class="info-text gap" v-if="!accountField">例如：username@email.com</div>
        <input @input="validate({ password })" class="field" :class="{ gap: passwordField }" v-model="password" type="password" placeholder="密码"></input>
        <div class="info-text gap" v-if="!passwordField">最少需要6个字符、大小写字母、数字和符号</div>
        <input @input="validate({ check })" class="field" :class="{ gap: checkField }" v-model="check" type="password" placeholder="重复密码"></input>
        <div class="info-text gap" v-if="!checkField">输入一样的密码</div>
        <button :disabled="typing || isLoading" class="field button" :class="{ 'loading': isLoading, 'disabled': typing }">        
          <template v-if="isLoading">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
            <div>加载中</div>
          </template>
          <template v-else-if="typing">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>请输入用户名、账户和密码</div>
          </template>
          <template v-else>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <div>注册</div>
          </template>
        </button>
      </form>
    </div>
    <div class="footer">
      <router-link to="/login" class="fac">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        <div>返回登录</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { type User } from '../utils/validator';
import validator from 'validator';
import request from '../utils/request';
import { AxiosError } from 'axios';
import { useRouter } from 'vue-router';


const username = ref('');
const usernameField = ref(false);
const account = ref('');
const accountField = ref(false);
const password = ref('');
const passwordField = ref(false);
const check = ref(''); 
const checkField = ref(false);

const infoMessage = ref('');

let isLoading = ref(false);

const router = useRouter();

type SignupState = 
  | 'unsignup'
  | 'success'
  | 'failed'
;
const state: Ref<SignupState> = ref('unsignup');

const handleSubmit = async () => {
  isLoading.value = true;

  const user = {
    username: username.value,
    account: account.value,
    password: password.value,
  };

  try {
    const data: any = await request.post('/user/signup', user);
  
    if (data.success) {
      state.value = 'success';
      infoMessage.value = '注册成功';
      setTimeout(() => {
        router.back()
      }, 500);
    } else {
      state.value = 'failed';
      infoMessage.value = '注册失败';
    }
  } catch (error) {
    state.value = 'failed';
    infoMessage.value = '注册失败';
    if (error instanceof AxiosError) {
      if (error.response?.data.error === 'user has been exist') infoMessage.value = '该账户已被注册';
    }
  } finally {
    isLoading.value = false;
  }
};

type Field = User & { check: string };
const validate = (field: Partial<Field>) => {
  if (field.check) {
    checkField.value = password.value === check.value;
  } else if (field.account) {
    accountField.value = validator.isEmail(account.value);
  } else if (field.username !== undefined) {
    usernameField.value = validator.isLength(username.value, { min: 1, max: 12 });
  } else if (field.password) {
    passwordField.value = validator.isStrongPassword(password.value, { minLength: 6 });
  }
}
const typing = computed(() => !(usernameField.value && accountField.value && passwordField.value && checkField.value));
</script>

<style lang="css" scoped>
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

.gap {
  margin-bottom: 1rem;
}

.field {
  border: 0;
  background-color: #F5F5F5;
  padding: 0.5rem;
  border-radius: 4px;
}

.field::selection {
  background-color: #00a3af;
}

.info-text {
  color: #757575;
  font-size: 0.8rem;
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

.button.disabled {
  background-color: #757575;
}

.button.disabled:hover {
  background-color: #757575;
}
</style>