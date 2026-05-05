<template>
  <div class="cropper-container">
    <!-- 文件选择 -->
    <input type="file" accept="image/*" @change="handleFileChange" />

    <!-- 图片裁剪容器，仅当有图片时显示 -->
    <div v-if="imageSrc" class="cropper-container">
      <img ref="imageRef" :src="imageSrc" alt="待裁剪图片" />
    </div>

    <!-- 裁剪操作按钮 -->
    <button @click="handleCrop">裁剪并保存</button>

    <!-- 显示裁剪结果 -->
    <div v-if="croppedImage">
      <h3>裁剪结果：</h3>
      <img :src="croppedImage" alt="裁剪后图片" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
// 导入 Cropper 核心库和其类型定义
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';


// --- 响应式状态与引用 ---
const imageSrc = ref<string | null>(null);        // 原始图片地址
const croppedImage = ref<string | null>(null);    // 裁剪后的图片地址
const imageRef = ref<HTMLImageElement | null>(null); // 图片 DOM 元素引用
let cropper: Cropper | null = null;           // Cropper 实例

// --- 处理文件选择 ---
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// --- 初始化 Cropper 实例 ---
const initCropper = () => {
  // 确保 DOM 元素存在且图片地址有效
  if (imageRef.value && imageSrc.value) {
    cropper = new Cropper(imageRef.value, {
      aspectRatio: 1,       // 设置裁剪框为正方形，NaN 代表自由比例
      viewMode: 1,          // 限制裁剪框不能超出图片范围
      dragMode: 'move',     // 拖拽模式为移动
      autoCropArea: 1,      // 自动生成的裁剪框占图片的 100%
      zoomable: true,       // 允许缩放
    });
  }
};

// --- 处理裁剪操作 ---
const handleCrop = () => {
  if (cropper) {
    // 获取裁剪后的 canvas 元素
    const canvas = cropper.getCroppedCanvas();
    // 将 canvas 转换为 Data URL (默认是 PNG 格式)
    croppedImage.value = canvas.toDataURL('image/png');
  }
};

// --- 当图片源 (imageSrc) 变化时，重新初始化裁剪器 ---
watch(imageSrc, () => {
  if (cropper) {
    cropper.destroy(); // 先销毁旧实例
    cropper = null;
  }
  // 等待 DOM 更新后再初始化
  nextTick(() => {
    initCropper();
  });
});

// --- 组件销毁前，销毁 Cropper 实例以防内存泄漏 ---
onBeforeUnmount(() => {
  if (cropper) {
    cropper.destroy();
  }
});
</script>

<style scoped>
/* 确保图片容器能正确显示 */
.cropper-container img {
  display: block;
  max-width: 100%;
}
</style>