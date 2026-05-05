<template>
  <div class="wrap">
    <div class="main-content">
      <div class="window toolbar">
        <span @click="$router.back">
          {{ '<<' }}
        </span>
        <span>{{ user?.username }}的通知</span>
      </div>
      <div class="window">
        <NotificationList @read="userControllerRef?.refresh()" :page="page"></NotificationList>
      </div>
    </div>
    <div class="right">
      <UserController ref="userControllerRef" @get="handleGet"></UserController>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserController from '../UserController.vue';
import NotificationList from '../notification/NotificationList.vue';

const userControllerRef = ref<InstanceType<typeof UserController> | null>(null);

const props = defineProps<{
  page: number
}>();

const user = ref<any | null>(null);
const handleGet = (u: any) => {
  user.value = u;
};
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