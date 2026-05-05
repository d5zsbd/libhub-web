<template>
  <div class="notifications">
    <NotificationItem @read="async () => { await refresh(); emit('read'); }" :notification="notification" v-for="notification in notifications"></NotificationItem>
    <Pagination @to="page => $router.replace({ name: 'notification', params: { page } })" :count="totalCount" :page="page"></Pagination>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NotificationItem from './NotificationItem.vue';
import { reqToken } from '../../utils/request';
import Pagination from '../Pagination.vue';

const emit = defineEmits<{
  read: []
}>();

const props = defineProps<{
  page: number
}>();

type Notification = {
  id: number,
  user_id: number,
  json: string
};

const notifications = ref<Notification[]>([]);
const totalCount = ref(0);

const refresh = async () => {
  const data: any = await reqToken.get('/notifications/' + props.page);

  notifications.value = data.notifications;
  totalCount.value = data.notifications[0]?.total_count || 0;
}

onMounted(async () => {
  await refresh();
});
</script>

<style lang="css" scoped>
.notifications {
  display: flex;
  flex-direction: column;
  justify-content: center;

  >*:not(:last-child)::after {
    margin-top: 1rem;
    margin-bottom: 1rem;
    content: '';
    display: block;
    border-bottom: 2px solid #F5F5F5;
  }
}
</style>