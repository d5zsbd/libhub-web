<template>
  <div class="avatar-container">
    <img ref="imageRef" :src="src" alt="裁剪框"/>
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
  src: string
}>();
let cropper = ref<Cropper | null>(null);

const imageRef = ref<HTMLImageElement | null>(null);

onMounted(() => {
  if (!imageRef.value) return;

  cropper.value = new Cropper(imageRef.value, {
    aspectRatio: 1,       // 设置裁剪框为正方形，NaN 代表自由比例
    viewMode: 1,          // 限制裁剪框不能超出图片范围
    dragMode: 'move',     // 拖拽模式为移动
    autoCropArea: 1,      // 自动生成的裁剪框占图片的 100%
    zoomable: true,       // 允许缩放
  });
});

onBeforeUnmount(() => {
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
});

defineExpose({
  cropper
});
</script>

<style>
.avatar-container {
  max-width: 256px;
  min-width: 128px;
  max-height: 256px;
  min-height: 128px;
}
</style>