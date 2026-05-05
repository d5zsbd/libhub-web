<template>
  <div class="posts">
    <post-item @delete="emit('delete')" :post="post" v-for="post in posts"></post-item>
  </div>
</template>

<script setup lang="ts">
import PostItem from './PostItem.vue';

const emit = defineEmits<{
  delete: []
}>();

const props = defineProps<{
  posts: {
    id: number,
    title: string,
    content: string,
    user_id: number,
    username: string,
    hit: number,
    created_at: string,
    updated_at: string,
    comments_count: number,
    likes_count: number,
    tags: string,
    status: number
  }[]
}>();
</script>

<style lang="css" scoped>
.posts {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post:not(:last-child)::after {
  margin-top: 1rem;
  margin-bottom: 1rem;
  content: '';
  display: block;
  border-bottom: 2px solid #F5F5F5;
}
</style>