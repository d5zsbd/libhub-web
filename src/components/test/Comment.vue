<template>
  <h1>游客查询</h1>
  {{ comments }}
  <h1>用户查询</h1>
  {{ userComments }}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import request, { reqToken } from '../../utils/request';

const comments = ref<any>();
const userComments = ref<any>();

onMounted(async () => {
  comments.value = await request.get('/post/1/comments');
  userComments.value = await reqToken.get('/post/1/comments');
});
</script>