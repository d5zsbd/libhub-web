<template>
  <input type="file" accept="image/*" @change="handleFileChange"/>
  <AvatarCropper ref="avatarCropperRef" v-if="imageSrc" :src="imageSrc" />
  <button @click="visit">visit</button>
  <img :src="croppedImageSrc" class="cropped"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AvatarCropper from '../AvatarCropper.vue';

const avatarCropperRef = ref<InstanceType<typeof AvatarCropper> | null>(null);
const imageSrc = ref<string | null>(null);
const croppedImageSrc = ref<string | undefined>();

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = e => imageSrc.value = e.target?.result as string;
  reader.readAsDataURL(file);
}

const visit = () => {
  if (!avatarCropperRef.value?.cropper) return;

  const canvas = avatarCropperRef.value.cropper.getCroppedCanvas({ width: 512, height: 512 });

  croppedImageSrc.value = canvas.toDataURL('image/png', 1);
}
</script>

<style scoped>
.cropped {
  width: 64px;  
  height: 64px;
  border-radius: 50%;
  image-rendering: auto;
}
</style>