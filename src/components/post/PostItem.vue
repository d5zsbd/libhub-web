<template>
  <div class="post">
    <div class="title" >
      <span class="draft" v-if="post.status === 0">草稿:</span>
      <span class="clickable" @click="toPost">{{ post.title }}</span>
      <span class="tags" @click="router.push({ name: 'home', params: { page: 1, query: JSON.stringify({ tags: post.tags }) } });">{{ post.tags.split(',').join('&') }}</span>
    </div>

    <post-info :post="post"></post-info>

    <div class="content truncate-3-lines">
      <content class="text-clamp" :content="JSON.parse(post.content)"></content>
    </div>

    <div class="actions">
      <div class="left"></div>
      <div class="right">
        <button v-if="authStore.payload?.id === post.user_id" class="field button danger" @click="deletePost">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <edit-content v-if="authStore.payload?.id === post.user_id" :post-id="post.id"></edit-content>
        <button class="field button" @click="toPost">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-maximize-2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Content from '../Content.vue';
import PostInfo from './PostInfo.vue';
import { useAuthStore } from '../../stores/auth';
import { reqToken } from '../../utils/request';
import EditContent from '../button/EditContent.vue';

const emit = defineEmits<{
  delete: []
}>();

const authStore = useAuthStore();

const props = defineProps<{
  post: {
    id: number,
    title: string,
    username: string,
    updated_at: string,
    hit: number,
    comments_count: number,
    likes_count: number,
    content: string,
    user_id: number,
    tags: string,
    status: number
  }
}>();

const router = useRouter();

const toPost = () => {
  router.push({ name: 'post', params: { id: props.post.id } });
};

const deletePost = async () => {
  await reqToken.post('/post/delete', { id: props.post.id });
  emit('delete')
}
</script>

<style lang="css" scoped>
.content {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.content:deep(img) {
  max-width: 60%;
  max-height: 60%;
}

.title {
  color: #00a3af;
  font-size: 2rem;

  >*:not(:last-child) {
    margin-right: 1rem;
  }
}

.truncate-3-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3;                   /* 标准属性 */
  -webkit-line-clamp: 3;          /* 限制显示行数为 3 */
  overflow: hidden;               /* 隐藏超出内容 */
  text-overflow: ellipsis;        /* 超出部分显示省略号（可选） */
}

.tags {
  color: #00a3af;
  cursor: pointer;
  font-size: 1rem;
}

.draft {
  color: #aacf53;
}
</style>