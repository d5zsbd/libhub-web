<template>
  <div class="wrap">
    <div class="main-content">
      <div class="window toolbar">
        <span @click="$router.back">
          {{ '<<' }}
        </span>
        <span>{{ user?.username }}的帖子</span>
      </div>
      <div class="window pagination">
        <post-list @delete="refresh" :posts="posts"></post-list>
        <Pagination @to="page => $router.replace({ name: 'ownedPosts', params: { id, page } })" :page="page" :count="totalCount"></Pagination>
      </div>
    </div>
    <div class="right">
      <UserController @get="handleGet" v-if="authStore.payload?.id === id"></UserController>
      <UserDetail @get="handleGet" v-else :id="id"></UserDetail>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import request from '../../utils/request';
import PostList from '../post/PostList.vue';
import UserController from '../UserController.vue'; 
import { useAuthStore } from '../../stores/auth';
import UserDetail from '../UserDetail.vue';
import Pagination from '../Pagination.vue';

const authStore = useAuthStore();

const user = ref<any | null>();

const handleGet = (u: any) => {
  user.value = u;
}

const totalCount = ref(0);

const props = defineProps<{
  id: number,
  page: number
}>();

type PostDetails = {
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
};

const posts = ref<PostDetails[]>([]);

const refresh = async () => {
  const data: any = await request(`/user/${props.id}/posts/${props.page}`).catch(err => console.log(err.response));
  posts.value = data.posts;

  totalCount.value = data.posts[0]?.total_count || 0;
}

watch(props, async () => {
  await refresh();
});

onMounted(async () => {
  await refresh();
});
</script>

<style scoped>
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

.pagination {
  >*:not(:last-child)::after {
    margin-top: 1rem;
    margin-bottom: 1rem;
    content: '';
    display: block;
    border-bottom: 2px solid #F5F5F5;
  }
}

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

.toolbar {
  display: flex;
  align-items: center;
  color: #00a3af;

  span {
    color: #00a3af;
    padding: 0.25rem;
    cursor: pointer;
  }

  span:hover {
    color: white;
    background-color: #00a3af;
    border-radius: 2px;
  }
}
</style>