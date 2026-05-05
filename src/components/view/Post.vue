<template>
  <div class="wrap">
    <div class="main-content">
      <Post @get="handleGet" :id="id" :page="page"></Post>
    </div>
    <div class="right">
      <UserDetail v-if="post" :id="post.user_id"></UserDetail>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Post from '../Post.vue';
import UserDetail from '../UserDetail.vue';

const post = ref<any | null>(null);
 
const handleGet = (p: any) => {
  if (p && Object.keys(p).length > 0) {
    post.value = p;
  }
}

const props = withDefaults(defineProps<{
  id: number,
  page?: number
}>(), {
  page: 1
});
</script>

<style lang="css" scoped>
.wrap {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.right {
  margin-left: 1rem;

  >*:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>