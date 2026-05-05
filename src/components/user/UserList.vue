<template>
  <div class="users">
    <user-item @unfollow="emit('unfollow')" class="user" :user="user" v-for="user in users"></user-item>
  </div>
</template>

<script setup lang="ts">
import UserItem from './UserItem.vue';

const emit = defineEmits<{
  unfollow: []
}>();

const props = defineProps<{
  users: UserProfile[]
}>();

type UserProfile = {
  id: number,
  role: 0 | 1,
  username: string,
  account: string,
  password: string,
  signature: string,
  status: 0 | 1 | 2,
  created_at: string,
  updated_at: string,
  avatar?: string
};
</script>

<style lang="css" scoped>
.users {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user:not(:last-child)::after {
  margin-top: 1rem;
  margin-bottom: 1rem;
  content: '';
  display: block;
  border-bottom: 2px solid #F5F5F5;
}
</style>