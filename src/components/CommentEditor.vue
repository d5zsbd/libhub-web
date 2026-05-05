<template>
  <div class="editor-wrapper">
    <div class="editor">
      <div ref="editorRef" class="content"></div>
    </div>
    <div class="actions">
      <div class="left">
        <button class="field button success" @click="handleInsertImage">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
      </div>
      <div class="right">
        <button class="field button" @click="commit">评论</button>
        <!-- <button class="field button" @click="privateComment">私人评论</button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { editorStateConfig, postSchema, translate } from '../utils/editor';
import { insertImage } from '../utils/editor';
import { reqToken } from '../utils/request';
import { AxiosError } from 'axios';
import { Node } from 'prosemirror-model';

const emit = defineEmits<{
  commit: []
}>();

const props = defineProps<{
  postId: number
}>();

const editorRef = ref<HTMLElement | null>();
let editorView: EditorView | null = null;

onMounted(() => {
  if (!editorRef.value) return;

  editorView = new EditorView(editorRef.value, { state: EditorState.create(editorStateConfig) });
});

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy();
    editorView = null;
  }
});

type State = 
  | 'idle'
  | 'loading'
  | 'success'
  | 'failed'
;
const state = ref<State>('idle');

const handleInsertImage = async () => {
  if (!editorView) return;
  try {
    await insertImage(editorView);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
    throw error;
  }
}

// const privateComment = async () => {
//   if (!editorView) return;

//   const editorNodes = editorView.state.toJSON().doc.content;
//   const content = translate(editorNodes);

//   try {
//     state.value = 'loading';

//     await reqToken.post('post/comment', { 
//       content,
//       postId: props.postId,
//       private: true
//     });

//     state.value = 'success';
//   } catch (error) {
//     console.error(error);
//     state.value = 'failed';
//   }
// };

const clear = () => {
  const doc = Node.fromJSON(postSchema, {
    type: 'doc',
    content: []
  });
  const editorState = EditorState.create({ ...editorStateConfig, doc });
  editorView?.updateState(editorState);
}

const commit = async () => {
  if (!editorView) return;

  const editorNodes = editorView.state.toJSON().doc.content;
  const content = translate(editorNodes);

  try {
    state.value = 'loading';

    await reqToken.post('post/comment', { 
      content,
      postId: props.postId
    });

    state.value = 'success';
    emit('commit');
    clear();
  } catch (error) {
    console.error(error);
    state.value = 'failed';
  }
};
</script>

<style scoped>
.editor-wrapper {
  border-radius: 4px;
  width: 640px;
  overflow: hidden; 
  background-color: white;
  padding: 1.5rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
}

.editor {
  margin-bottom: 1rem;
}

.actions {
  display: flex;

  .left {
    display: flex;
    flex: 1;
  }

  .right {
    display: flex;

    button {
      margin-left: 1rem;
    }
  }
}

.content {
  border: 0;
  background-color: #F5F5F5;
  padding: 0.5rem;
  border-radius: 4px;
  min-height: 128px;
  display: flex;
}

.content :deep(.ProseMirror:focus) {
  outline: none;
  box-shadow: none;  /* 如果有点击阴影效果也移除 */
}

.content :deep(.ProseMirror) {
  flex: 1;
}

.content :deep(.ProseMirror) *::selection {
  background-color: #00a3af;
}

.content :deep(.ProseMirror) p,
.content :deep(.ProseMirror) div,
.content :deep(.ProseMirror) h1,
.content :deep(.ProseMirror) h2,
.content :deep(.ProseMirror) h3,
.content :deep(.ProseMirror) ul,
.content :deep(.ProseMirror) ol,
.content :deep(.ProseMirror) li,
.content :deep(.ProseMirror) blockquote,
.content :deep(.ProseMirror) pre {
  margin: 0;
  padding: 0;
  line-height: 1.4;  /* 自定义你需要的行高 */
}

.content :deep(.ProseMirror) ul,
.content :deep(.ProseMirror) ol {
  padding-left: 1.5rem;  /* 保留缩进，也可以设为 0 */
}

.content :deep(.ProseMirror) img {
  max-width: 100%;
  vertical-align: bottom;
}
</style>