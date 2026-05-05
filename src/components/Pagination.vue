<template>
  <div class="pagination">
    <button @click="emit('to', page - 1)" class="field button" :class="page === 1 ? 'disabled' : 'normal'" :disabled="page === 1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button @click="emit('to', i)" class="field button" :class="{ normal: i !== page }" v-for="i in pageCount">
      <span>{{ i }}</span>
    </button>
    <button @click="emit('to', page + 1)" class="field button" :class="page === pageCount ? 'disabled' : 'normal'" :disabled="page === pageCount">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits<{
  to: [page: number]
}>();

const props = withDefaults(defineProps<{
  count: number,
  page: number,
  size?: number,
}>(), {
  size: 10
});

const pageCount = computed(() => Math.trunc((props.count - 1) / props.size) + 1);
</script>

<style lang="css" scoped>
.pagination {
  display: flex;

  >.button:not(:last-child) {
    margin-right: 1rem;

    >span {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>