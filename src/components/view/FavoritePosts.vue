<template>
  <div class="wrap">
    <div class="main-content">
      <div class="window toolbar">
        <span @click="$router.back">
          {{ '<<' }}
        </span>
        <span>{{ user?.username }}的收藏</span>
      </div>
      <div class="window pagination">
        <post-list @delete="refresh" v-if="posts" :posts="posts"></post-list>
        <Pagination :page="page" :count="totalCount" @to="page => $router.replace({ name: 'favoritePosts', params: { page } })" ></Pagination>
      </div>
    </div>
    <div class="right">
      <UserController @get="handleGet"></UserController>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reqToken } from '../../utils/request';
import PostList from '../post/PostList.vue';
import UserController from '../UserController.vue';
import Pagination from '../Pagination.vue';

const props = defineProps<{
  page: number
}>();

const user = ref<any | null>(null);
const handleGet = (u: any) => {
  user.value = u;
};

const totalCount = ref(0);

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
  const data: any = await reqToken.get(`/user/favorites/${props.page}`).catch(err => console.log(err.response));
  posts.value = data.posts;
  
  totalCount.value = data.posts[0]?.total_count || 0;
};

onMounted(async () => {
  const data: any = await reqToken.get(`/user/favorites/${props.page}`).catch(err => console.log(err.response));
  posts.value = data.posts;
  
  totalCount.value = data.posts[0]?.total_count || 0;
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