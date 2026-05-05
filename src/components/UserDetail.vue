<template>
  <div>
    <div class="window">
      <div class="user-detail">
        <div class="avatar">
          <svg v-if="!user?.avatar" xmlns="http://www.w3.org/2000/svg"
            width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#00a3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <img v-else :src="'/pub/' + user.avatar">
        </div>
        <div class="detail">
          <div v-if="user">{{ '用户名：' + user.username }}</div>
          <div v-if="user">{{ '发帖数：' + user.posts_count }}</div>
          <div v-if="user">{{ '分数：' + (user.likes_count + user.favorites_count) }}</div>
        </div>
      </div>
      <div class="actions">
        <div class="left">
          <button @click="$router.push({name: 'ownedPosts', params: { id: user.id, page: 1 }})" class="field button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
          <button v-if="authStore.payload && authStore.payload?.id !== user?.id" @click="handleFollow" class="field button" :class="user?.is_followed ? 'warn' : 'normal'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
        </div>
        <div class="right">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { req, reqToken } from '../utils/request';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{
  id: number
}>();

const user = ref<any>();

const authStore = useAuthStore();

const emit = defineEmits<{
  get: [user: any]
}>();

const refresh = async () => {
  const data: any = await req().get(`/user/${props.id}/detail`);
  user.value = data;
  emit('get', user.value);
};

onMounted(async () => {
  await refresh();
});

const handleFollow = async () => {
  const isFollowed = user.value?.is_followed;

  console.log(user.value.id);

  try {
    if (isFollowed) {
      await reqToken.post('/user/unfollow', { followingId: user.value.id });
    } else {
      await reqToken.post('/user/follow', { followingId: user.value.id });
    }
  } catch (error:any) {
    console.log(error.response);
  }
  
  await refresh();
};

defineExpose({
  refresh
});
</script>

<style scoped>
.window {
  border-radius: 4px;
  width: 320px;
  overflow: hidden; 
  background-color: white;
  padding: 1rem;

  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.user-detail {
  display: flex;

  .avatar {
    margin-right: 1rem;
  }
}

.avatar img {
  max-width: 128px;
  max-height: 128px;
  border-radius: 50%;
}

.detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
  color: #757575;
  font-size: 0.8rem;
}
</style>