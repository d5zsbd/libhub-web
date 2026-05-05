<template>
  <div>
    <div class="window">
      <div class="avatar">
        <input ref="fileInput" type="file" accept="image/*" style="display: none;">

        <div v-if="imagrSrc">
          <avatar-cropper ref="avatarCropper" :src="imagrSrc"></avatar-cropper>
          <div class="actions">
            <div class="left"></div>
            <div class="right">
              <button class="field button success" @click="handleAvatarSubmit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <button class="field button warn" @click="closeAvatarSubmit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>  
        </div>
        <template v-else>
          <svg v-if="!userProfile.avatar" @click="fileInput?.click()" xmlns="http://www.w3.org/2000/svg"
            width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="#00a3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <img v-else :src="'/pub/' + userProfile.avatar.filename" @click="fileInput?.click()">
        </template>

      </div>
      <div class="username">
        <input v-model="userProfile.username" class="field w100" placeholder="更改用户名..." :disabled="!isEdit" :style="isEdit ? {} : { backgroundColor: 'white' }"/>
      </div>
      <div class="signature">
        <input v-model="userProfile.signature" class="field w100" placeholder="没有签名..." :disabled="!isEdit" :style="isEdit ? {} : { backgroundColor: 'white' }"/>
      </div>

      <div class="actions">
        <div class="left">
          <button @click="navigateTo({ name: 'notification', params: { page: 1 } })" class="field button" :class="{ 'red-dot': hasUnreadNotification }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </button>
          <button @click="navigateTo({ name: 'favoritePosts', params: { page: 1 } })" class="field button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
          <button @click="navigateTo({ name: 'followingUsers', params: { page: 1 } })" class="field button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </button>
          <!-- 之后需要修改这个 -->
          <button @click="navigateTo({ name: 'ownedPosts', params: { id: userProfile.id, page: 1 } })" class="field button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>

        <div class="right">
          <template v-if="!isEdit">
            <button  class="field button success" @click="isEdit = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="field button warn" @click="() => { authStore.clearRefreshToken(); $router.replace({ name: 'home' }) }">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-key"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </button>
          </template>
          
          <template v-else>
            <button class="field button success" @click="handleUpdate">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button class="field button warn" @click="isEdit = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reqToken } from '../utils/request';
import AvatarCropper from './AvatarCropper.vue';
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();

const emit = defineEmits<{
  get: [user: any]
}>();

export type UserProfile = {
  id: number,
  username: string,
  account: string,
  signature: string | null,
  avatar: any,
  status: 0 | 1 | 2
};

const userProfile = ref<UserProfile>({
  id: 0,
  username: '',
  account: '',
  signature: null,
  status: 0,
  avatar: undefined
});

const fileInput = ref<HTMLInputElement | undefined>();
const imagrSrc = ref<string | undefined>();
const avatarCropper = ref<InstanceType<typeof AvatarCropper> | undefined>();

const hasUnreadNotification = ref<boolean>(false);

const handleAvatarSubmit = () => {
  if (avatarCropper.value && avatarCropper.value.cropper) {
    const formData = new FormData();
    const canvas = avatarCropper.value.cropper.getCroppedCanvas({ width: 512, height: 512 });
    canvas.toBlob(async (image) => {
      if (!image) return;

      formData.append('image', image);
      await reqToken.post('/upload/avatar', formData);
      await userProfileFresh();
      imagrSrc.value = undefined;
    }, 'image/png', 1.0);
  }
}

const closeAvatarSubmit = () => {
  imagrSrc.value = undefined;
}

const userProfileFresh = async () => {
  const data: any = await reqToken.get('/user/' + authStore.payload!.id);
  userProfile.value = {
    id: data.id,
    username: data.username,
    account: data.account,
    signature: data.signature,
    avatar: data.avatar,
    status: data.status
  };
}

onMounted(async () => {
  await userProfileFresh();
  emit('get', userProfile.value);

  if (!fileInput.value) return;
  fileInput.value.onchange = (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => imagrSrc.value = e.target?.result as string;
    reader.readAsDataURL(file);
    
    if (fileInput.value) fileInput.value.value = '';
  };

  const result: any = await reqToken.get('/notifications/has-unread');
  
  hasUnreadNotification.value = result.hasUnread;
});

const isEdit = ref(false);

const handleUpdate = async () => {
  await reqToken.post('/user/update', { 
    username: userProfile.value.username,
    signature: userProfile.value.signature
  });

  await userProfileFresh();
  isEdit.value = false;
};

const route = useRoute();
const router = useRouter();
const navigateTo = (to: { name: string, params?: any }) => {
  const tabs = ['notification', 'favoritePosts', 'followingUsers', 'ownedPosts'];

  if (tabs.includes(route.name?.toString() || '') && tabs.includes(to.name)) {
    router.replace(to);
  } else {
    router.push(to);
  }
}

defineExpose({
  refresh: async () => {
    const result: any = await reqToken.get('/notifications/has-unread');
    hasUnreadNotification.value = result.hasUnread;
  }
});
</script>

<style scoped>
.window {
  border-radius: 4px;
  width: 320px;
  overflow: hidden; 
  background-color: white;
  padding: 1rem;

  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.w100 {
  width: 100%;
}

.gap {
  margin-bottom: 1rem;
}

.avatar {
  display: flex;
  justify-content: center;

  img {
    width: 128px;
    height: 128px;
    border-radius: 50%;
  }
}
</style>