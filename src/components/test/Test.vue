<template>
  <!-- <Pagination :page="1" :count="200"></Pagination> -->
  <!-- <NotificationItem :notification=""></NotificationItem> -->
  <!-- <NotificationList class="window"></NotificationList> -->
</template>

<script setup lang="ts">
// import NotificationList from '../notification/NotificationList.vue';

// import Pagination from '../Pagination.vue';

// import { onMounted, ref } from 'vue';
// import request, { reqToken } from '../../utils/request';


// onMounted(async () => {
//   const data: any = await reqToken.get('/user/following/1');
//   console.log(data);
// });
</script>

<style scoped>
.window {
  border-radius: 4px;
  width: 640px;
  overflow: hidden; 
  background-color: white;
  padding: 1.5rem;
}

.window:not(:last-child) {
  margin-bottom: 1rem;
}
</style>