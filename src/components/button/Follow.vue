<template>
  <button @click="handleFollow" class="field button" :class="isFollowed ? 'warn' : 'normal'">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  </button>
</template>

<script setup lang="ts">
import { reqToken } from '../../utils/request';

const emit = defineEmits<{
  follow: [],
  unfollow: []
}>();

const props = defineProps<{
  id: number,
  isFollowed: boolean,
  refresh?: Function
}>();

const handleFollow = async () => {
  if (props.isFollowed) {
    await reqToken.post('/user/unfollow', { followingId: props.id });
    emit('unfollow');
  } else {
    await reqToken.post('/user/follow', { followingId: props.id });
    emit('follow');
  }

  if (props.refresh) props.refresh();
}
</script>