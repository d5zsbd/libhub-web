<template>
  <div class="wrap">
    <div class="main-content">
      <div class="window toolbar">
        <span @click="$router.back">
          {{ '<<' }}
        </span>
        <span>{{ user?.username }}的关注</span>
      </div>
      <div class="window pagination">
        <user-list @unfollow="refresh" :users="users"></user-list>
        <pagination @to="page => $router.replace({ name: 'followingUsers', params: { page } })" :page="page" :count="totalCount"></pagination>
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
import UserList from '../user/UserList.vue';
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

const users = ref<any>([]);

const refresh = async () => {
  const data: any = await reqToken.get('/user/following/' + props.page);
  users.value = data.followings;
  totalCount.value = data.followings[0]?.total_count || 0;
}

onMounted(async () => {
  await refresh();
});
</script>

<style lang="css" scoped>
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