<template>
  <div class="field tag-input" :class="{ 'disabled': modelValue.length === size && !visibility }">
    <div v-if="visibility" class="tags">
      <div class="tag" v-for="tag in modelValue">
        <div>{{ tag }}</div>
        <svg @click="close(tag)" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
    </div>
    <input @focusout="enter" v-if="modelValue.length !== size" v-model="tag" @keydown.enter.prevent="enter" placeholder="请输入标签" />
    <input v-else-if="!visibility" :value="'标签已满'" disabled="true"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = withDefaults(defineProps<{
  modelValue: string[],
  size?: number,
  visibility?: boolean,
}>(), {
  visibility: true,
  size: 3
});
const emit = defineEmits(['update:modelValue']);

const tag = ref("");

const enter = () => {
  const value = tag.value;
  tag.value = '';
  if (props.modelValue.includes(value)) return;
  if (value !== '') emit('update:modelValue', props.modelValue.concat([value.trim()]));
}

const close = (tag: string) => {
  emit('update:modelValue', props.modelValue.filter(n => n !== tag));
}
</script>

<style scoped>
.tags {
  display: flex;
}

.tag-input {
  display: flex;
}

.tag {
  background-color: #00a3af;
  color: white;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  border-radius: 4px;
  margin-right: 0.25rem;
  display: flex;
  justify-content: start;
  align-items: center;

  svg {
    margin-left: 4px;
    width: 1rem;
    height: 1rem;
    stroke: white;
    stroke-width: 2px;
  }
}
</style>