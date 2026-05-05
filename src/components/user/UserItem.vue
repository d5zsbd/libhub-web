<template>
  <div class="user">
    <div class="flex">
      <div class="avatar">
        <svg v-if="!user?.avatar" xmlns="http://www.w3.org/2000/svg"
          width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00a3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <img v-else :src="'/pub/' + user.avatar">
      </div>
      <div class="info">
        <div>
          {{ '用户名：' + user.username }}
        </div>
        <div>
          {{ '发帖数：' + (user as any)?.posts_count }}
        </div>

        <div class="actions">
          <div class="left">
            <button @click="$router.push({name: 'ownedPosts', params: { id: user.id, page: 1 }})" class="field button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <Follow @unfollow="emit('unfollow')" :id="user.id" :is-followed="true"></Follow>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Follow from '../button/Follow.vue';

const props = defineProps<{
  user: UserProfile
}>();

const emit = defineEmits<{
  unfollow: []
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
.flex {
  display: flex;

  >*:not(:last-child) {
    margin-right: 1rem;
  }
}

.avatar {
  img {
    max-width: 64px;
    max-height: 64px;
    border-radius: 50%;
  }
}

.info {
  color: #757575;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;

  >* {
    flex: 1;
  }
}
</style>