<template>
  {{ result }}
  <input v-model="search" />
  <TagInput v-model="tags"></TagInput>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import request from '../../utils/request';
import TagInput from '../TagInput.vue';
const result = ref<any>();

const search = ref('');
const tags = ref<string[]>([]);

onMounted(async () => {
  const params = new URLSearchParams();
  params.append('search', search.value);
  params.append('tags', JSON.stringify(tags.value));

  result.value = await request.get(`/posts/1?${params.toString()}`);
  console.log(result.value);
});

watch(search, async () => {
  const params = new URLSearchParams();
  params.append('search', search.value);
  params.append('tags', JSON.stringify(tags.value));
  
  result.value = await request.get(`/posts/1?${params.toString()}`);
  console.log(result.value);
});
</script>