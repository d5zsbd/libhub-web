<template>
  <Navigation class="window" :tags="post?.tags ? post.tags.split(',') : []" :title="post?.title"></Navigation>

  <div class="window">
    <PostInfo v-if="post.tags" :post="post"></PostInfo>
    <div class="content">
      <Content v-if="post.content" :content="post.content" />
    </div>
    <div class="actions">
      <div class="left"></div>
      <div class="right">
        <button @click="copyCurrentUrl" class="field button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </button>
        <button v-if="authStore.payload" @click="handleLike" class="field button" :class="{ 'normal': !post.likes, 'success': post.likes }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        </button>
        <button v-if="authStore.payload" @click="handleFavorite" class="field button" :class="{ 'normal': !post.favorite, 'success': post.favorite }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>
    </div>
  </div>

  <CommentEditor @commit="refresh(true)" v-if="authStore.payload" class="comment-editor" :post-id="props.id"></CommentEditor>

  <div class="window comments">
    <div class="comment" v-for="comment in comments">
      <div class="comment-layout">
        <div class="left">
          <img class="avatar clickable" @click="$router.push({ name: 'ownedPosts', params: { id: comment.user_id, page: 1 } })" :src="'/pub/' + comment.avatar" />
        </div>
        <div class="right">
          <div class="username">{{ comment.username + ' ' + new Date(comment.updated_at.replace(' ', 'T') + 'Z').toLocaleString() + ' #' + comment.id }}</div>
          <div class="comment-content">
            <Content :content="JSON.parse(comment.content)"></Content>
          </div>
          <ReplyEditor @reply="refresh(true)" :comment="comment"></ReplyEditor>
        </div>
      </div>
    </div>
    <Pagination @to="page => $router.replace({ name: 'post', params: { id, page } })" :page="page" :count="totalCount"></Pagination>
  </div>
</template>

<script setup lang="ts">
import Content from './Content.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { req, reqToken } from '../utils/request';
import CommentEditor from './CommentEditor.vue';
import ReplyEditor from './ReplyEditor.vue';
import Navigation from './Navigation.vue';
import PostInfo from './post/PostInfo.vue';
import { useAuthStore } from '../stores/auth';
import Pagination from './Pagination.vue';

const props = defineProps<{
  id: number,
  page: number
}>();

const post = ref<any>({});
const comments = ref<any>();

const totalCount = ref(0);

const authStore = useAuthStore();

const emit = defineEmits<{
  get: [post: any]
}>();

const getPostDetails = async (isRefresh: boolean = false) => {
  const params = new URLSearchParams();
  params.append('isRefresh', 'true');

  const data: any = await req().get(!isRefresh ? '/post/' + props.id : `/post/${props.id}?${params.toString()}`);
  data.content = JSON.parse(data.content);

  return data;
}

const refresh = async (isRefresh: boolean = false) => {
  post.value = await getPostDetails(isRefresh);
  emit('get', post.value);
  const { comments: result } = await req().get(`/post/${post.value.id}/comments/${props.page}`) as any;
  comments.value = result;

  totalCount.value = result[0]?.total_count || 0;
}

watch(props, async () => {
  await refresh(true);
})

onMounted(async () => {
  await refresh();
});

const handleLike = async () => {
  if (post.value.likes) {
    await reqToken.post('/post/unlike', { postId: post.value.id });
  } else {
    await reqToken.post('/post/like', { postId: post.value.id });
  }

  post.value = await getPostDetails(true);
}

const handleFavorite = async () => {
  if (post.value.favorite) {
    await reqToken.post('/post/unfavorite', { postId: post.value.id });
  } else {
    await reqToken.post('/post/favorite', { postId: post.value.id });
  }

  post.value = await getPostDetails(true);
}

const copyCurrentUrl = async () => {
  const url = window.location.href;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error(error);
    }
  } else {
    throw new Error('no clipboard api')
  }
}

defineExpose({
  post: computed(() => post)
});
</script>

<style scoped>
.mt {
  margin-top: 1rem;
}

.window {
  border-radius: 4px;
  width: 640px;
  overflow: hidden; 
  background-color: white;
  padding: 1rem;
}

.window:not(:last-child) {
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  color: #00a3af;
}

.info {
  font-size: 0.8rem;
  color: #757575;
}

.content {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.comment-editor {
  margin-top: 1rem;
}

.comment-editor:deep(.ProseMirror) img {
  max-width: 50%;
  max-height: 50%;
}

.comments {
  margin-top: 1rem;
}

.comment-content:deep(img) {
  max-width: 50%;
  max-height: 50%;
}

.comment:not(:last-child)::after {
  margin-top: 1rem;
  margin-bottom: 1rem;
  content: '';
  display: block;
  border-bottom: 2px solid #F5F5F5;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.reply-editor {
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 128px;
}

.actions {
  display: flex;

  .left {
    flex: 1;
  }

  .right {
    display: flex;

    button {
      margin-left: 1rem;
    }
  }
}

.comment-layout {
  display: flex;

  .left {
    margin-right: 1rem;
  }

  .right {
    flex: 1;

    .username {
      font-size: 0.8rem;
      color: #757575;
    }

    >*:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
}
</style>