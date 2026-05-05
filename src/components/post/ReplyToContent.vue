<template>
  <template v-for="node in content">
    <span v-if="node.type === 'image'">[图片]</span>
    <template v-else-if="node.type === 'text'">{{ node.text }}</template>
    <p v-else-if="node.type === 'paragraph'">
      <Content v-if="node.content" :content="node.content"></Content>
    </p>
  </template>
</template>

<script setup lang="ts">
import { type PostNode } from '../../utils/editor';

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