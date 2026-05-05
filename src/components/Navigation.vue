<template>
  <div class="navigation">
    <span @click="back">
      {{ '<<' }}
    </span>
    <span @click="router.push({ name: 'home', params: { page: 1, query: JSON.stringify({ tags: tags.join(',') }) } });">{{ tags.join('&') }}</span>
    <span>{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  tags: string[],
  title: string
}>();

const router = useRouter();

const back = () => {
  router.back();
};
</script>

<style scoped>
.navigation {
  svg {
    width: 1rem;
    height: 1rem;
    stroke: #00a3af;
  }

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