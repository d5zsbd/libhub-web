<template>
  <div class="wrap">
    <div class="main-content">
      <Editor :post-id="postId"></Editor>
    </div>
    <div class="right">
      <UserController></UserController>
    </div>
  </div>
</template>

<script setup lang="ts">
import Editor from '../Editor.vue';
import UserController from '../UserController.vue';

const props = defineProps<{
  postId?: number
}>();
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