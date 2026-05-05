<template>
  <template v-for="node in content">
    <img v-if="node.type === 'image'" :src="'/pub/' + node.filename" />
    <template v-else-if="node.type === 'text'">{{ node.text }}</template>
    <p v-else-if="node.type === 'paragraph'">
      <Content v-if="node.content" :content="node.content"></Content>
    </p>
  </template>
</template>

<script setup lang="ts">
import { type PostNode } from '../utils/editor';

defineOptions({
  name: 'Content'
});

const props = defineProps<{
  content: PostNode[]
}>();
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
}

*::selection {
  background-color: #00a3af;
}

p {
  margin: 0;
}
</style>