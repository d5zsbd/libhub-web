<template>
  <div class="window">
    <div class="tags" v-if="tags.length !== 0">
      <button class="field button tag" v-for="tag in tags">
        <div>{{ tag }}</div>
        <svg @click="tags = tags.filter(t => t !== tag)" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle clickable"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </button>
    </div>
    <div class="actions">
      <div class="left">
        <TagInput class="tag-input" :visibility="false" v-model="tags"></TagInput>
        <input @keydown.enter.prevent="handleSearch" v-model="search" class="field search-input" placeholder="请输入查询内容" />
      </div>
      <div class="right">
        <button class="field button success" @click="handleSearch()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>

        <button v-if="authStore.payload" class="field button success" @click="$router.push({ name: 'postEditor' })">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
      </div>
    </div>
  </div>
  <div class="window">
    <post-list @delete="refresh" :posts="posts"></post-list>
    <pagination @to="page => router.replace({ name: 'home', params: { page, query: JSON.stringify({ tags: tags.join(','), search: search }) } })" :page="page" :count="totalCount"></pagination>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import request from '../utils/request';
import PostList from './post/PostList.vue';
import TagInput from './TagInput.vue';
import { useRouter } from 'vue-router';
import Pagination from './Pagination.vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{
  page: number,
  tags?: string,
  search?: string
}>();

const tags = ref(props.tags ? props.tags.split(',') : []);
const search = ref(props.search ? props.search : '');

const authStore = useAuthStore();

const router = useRouter();

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
const totalCount = ref(0);

watch(tags, async () => {
  if (!isUpdating.value) {
    console.log('tags');
    await handleSearch();
  }
});

const refresh = async () => {
  const params = new URLSearchParams();
  if (search.value) params.append('search', search.value);
  if (tags.value) params.append('tags', JSON.stringify(tags.value));

  const data: any = await request.get(`/posts/${props.page}?${params.toString()}`);
  posts.value = data.posts;
  totalCount.value = data.posts[0]?.total_count || 0;
}

const isUpdating = ref(false);
watch(props, async () => {
  isUpdating.value = true;
  tags.value = props.tags ? props.tags.split(',') : [];
  search.value = props.search ? props.search : '';
  await refresh();
  nextTick(() => {
    isUpdating.value = false;
  });
});

onMounted(async () => {
  await refresh();
});

const handleSearch = async () => {
  // const params = new URLSearchParams();
  // params.append('search', search.value);
  // params.append('tags', JSON.stringify(tags.value));

  // const data: any = await request.get(`/posts/1?${params.toString()}`);
  // posts.value = data.posts;
  router.replace({ name: 'home', params: { page: props.page, query: JSON.stringify({ tags: tags.value.join(','), search: search.value }) } });
}
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

.window>:not(:last-child)::after {
  margin-top: 1rem;
  margin-bottom: 1rem;
  content: '';
  display: block;
  border-bottom: 2px solid #F5F5F5;
}

.tag-input {
  max-width: 12rem;
}

.search-input {
  flex: 1;
}

.tags {
  display: flex;
  margin-bottom: 1rem;

  .tag {
    margin-right: 1rem;
  }
}

.tag {
  display: flex;
  justify-content: start;
  align-items: center;
  cursor: unset;
  
  svg {
    margin-left: 4px;
    width: 1rem;
    height: 1rem;
    stroke: white;
    stroke-width: 2px;
  }
}
</style>