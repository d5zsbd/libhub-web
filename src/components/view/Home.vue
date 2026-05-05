<template>
  <div class="wrap">
    <div class="main-content">
      <Posts :page="page ? page : 1" :tags="tags" :search="search"></Posts>
    </div>
    <div class="right">
      <UserController v-if="authStore.payload"></UserController>
      <div class="form" @click="$router.push({ name: 'login' })" v-else>
        <button class="field button">登录/注册</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserController from '../UserController.vue';
import Posts from '../Posts.vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const props = defineProps<{
  page?: number,
  tags?: string,
  search?: string
}>();
</script>

<style scoped>
.wrap {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.right {
  margin-left: 1rem;

  >*:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.form {
  border-radius: 4px;
  width: 320px;
  overflow: hidden; 
  background-color: white;
  padding: 1rem;
  display: flex;
  justify-content: center;

  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>