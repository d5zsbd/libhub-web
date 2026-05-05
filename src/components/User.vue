<template>
  {{ user }}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import request from '../utils/request';

const user = ref({})

onMounted(async () => {
  const data = await request.get('/user/1');

  user.value = data;
});
</script>