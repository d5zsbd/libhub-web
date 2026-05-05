<template>
  <div class="notification">
    <template v-if="content.type === 'comment'">
      <div class="content">
        <span class="link" @click="$router.push({ name: 'ownedPosts', params: { id: content.user.id, page: 1} })">{{ content.user.username }}</span>
        {{ `回复了文章` }}
        <span class="link" @click="$router.push({ name: 'post', params: { id: content.post.id } })">{{ content.post.title }}</span>
      </div>
    </template> 
    <template v-if="content.type === 'like'">
      <div class="content">
        <span class="link" @click="$router.push({ name: 'ownedPosts', params: { id: content.user.id, page: 1} })">{{ content.user.username }}</span>
        {{ `点赞了文章` }}
        <span class="link" @click="$router.push({ name: 'post', params: { id: content.post.id } })">{{ content.post.title }}</span>
      </div>
    </template>
    <template v-if="content.type === 'favorite'">
      <div class="content">
        <span class="link" @click="$router.push({ name: 'ownedPosts', params: { id: content.user.id, page: 1} })">{{ content.user.username }}</span>
        {{ `收藏了文章` }}
        <span class="link" @click="$router.push({ name: 'post', params: { id: content.post.id } })">{{ content.post.title }}</span>
      </div>
    </template>
    <template v-if="content.type === 'reply'">
      <div class="content">
        <span class="link" @click="$router.push({ name: 'ownedPosts', params: { id: content.user.id, page: 1} })">{{ content.user.username }}</span>
        {{ `回复了评论` }}
        <span class="link" @click="$router.push({ name: 'post', params: { id: content.comment.postId } })">{{ '#' + content.comment.id }}</span>
        <div class="reply-content">
          <ReplyToContent :content="JSON.parse(content.comment.content)"></ReplyToContent>
        </div>
      </div>
    </template>
    <template v-if="content.type === 'followingPost'">
      <div class="content">
        <span class="link" @click="$router.push({ name: 'ownedPosts', params: { id: content.following.id, page: 1} })">{{ content.following.username }}</span>
        {{ `发布了文章` }}
        <span class="link" @click="$router.push({ name: 'post', params: { id: content.post.id } })">{{ content.post.title }}</span>
      </div>
    </template>
    <div class="actions">
      <div class="left"></div>
      <div class="right">
        <button @click="handleRead" class="field button success">
          已读
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { reqToken } from '../../utils/request';
import ReplyToContent from '../post/ReplyToContent.vue';

const emit = defineEmits<{ read: [notification: Notification] }>();

type Notification = {
  id: number,
  user_id: number,
  json: string
};

type Content = 
  | { type: 'comment', post: { id: number, title: string }, user: { id: number, username: string } }
  | { type: 'followingPost', post: { id: number, title: string }, following: { id: number, username: string } }
  | { type: 'reply', comment: { id: number, content: string, postId: number }, user: { id: number, username: string } }
  | { type: 'like', post: { id: number, title: string }, user: { id: number, username: string } }
  | { type: 'favorite', post: { id: number, title: string }, user: { id: number, username: string } }
;

const props = defineProps<{
  notification: Notification
}>();
const content = ref<Content>(JSON.parse(props.notification.json));

const handleRead = async () => {
  await reqToken.post('/notifications/read', { id: props.notification.id });
  emit('read', props.notification);
};
</script>

<style scoped>
.link {
  color: #00a3af;
  cursor: pointer;
}

.reply-content {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #F5F5F5;
  color: #757575;
}
</style>