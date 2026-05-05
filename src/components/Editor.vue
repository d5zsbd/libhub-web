<template>
  <div class="window">
    <div v-if="postState === 'success' || postState === 'failed'"
      class="field info" :class="{ 'success': postState === 'success', 'danger': postState === 'failed' }">
      {{ infoMessage }}
    </div>
    <div class="field info" v-else-if="postState === 'loading'">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
      <div>发布中</div>
    </div>
    <input v-model="title" class="field title" placeholder="标题：" :disabled="!!postId" />
    <TagInput v-model="tags"></TagInput>
    <div class="content field" ref="editorRef">
    </div>
    <div class="actions">
      <div class="left">
        <button class="field button success">
          <svg @click="insertImage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
      </div>
      <div class="right">
        <button v-if="!oldPost" :disabled="postState === 'loading'" @click="post('draft')" class="field button" :class="{ 'disabled': postState === 'loading' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </button>
        <button v-if="oldPost && oldPost.status === 0" class="field button" @click="publish">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </button>
        <button :disabled="postState === 'loading'" @click="post()" class="field button success" :class="{ 'disabled': postState === 'loading' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button class="field button danger" @click="$router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'prosemirror-view/style/prosemirror.css';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { reqToken } from '../utils/request';
import { AxiosError } from 'axios';
import { editorStateConfig, fromPost, postSchema, translate } from '../utils/editor';
import TagInput from './TagInput.vue';
import { Node } from 'prosemirror-model';
import { useRouter } from 'vue-router';

const props = defineProps<{
  postId?: number
}>();

const oldPost = ref<any>();

const getPost = async () => {
  const data: any = await reqToken.get('/post/' + props.postId);
  data.content = JSON.parse(data.content);

  oldPost.value = data;
}
watch(oldPost, () => {
  title.value = oldPost.value.title;
  tags.value = oldPost.value.tags.split(',');
  const content = fromPost(oldPost.value.content);
  const doc = Node.fromJSON(postSchema, {
    type: 'doc',
    content
  });
  const editorState = EditorState.create({ ...editorStateConfig, doc });
  editorView?.updateState(editorState);
});

const clear = () => {
  title.value = '';
  tags.value = [];
  const doc = Node.fromJSON(postSchema, {
    type: 'doc',
    content: []
  });
  const editorState = EditorState.create({ ...editorStateConfig, doc });
  editorView?.updateState(editorState);
}

const editorRef = ref<HTMLElement | null>(null);
let editorView: EditorView | null = null;
const tags = ref<string[]>([]);

onMounted(async () => {
  if (!editorRef.value) return;

  const state = EditorState.create(editorStateConfig);

  editorView = new EditorView(editorRef.value, {
    state,
    dispatchTransaction(tr) {
      if (editorView === null) return;

      const newState = editorView.state.apply(tr);
      editorView.updateState(newState);
    }
  });

  if (props.postId) await getPost();
});

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy();
    editorView = null;
  }
});

const insertImage = async () => {
  if (!editorView) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async () => {
    const file = input.files?.item(0);
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const { filename } = await reqToken.post('/upload/image', formData) as any;

    const imageNode = postSchema.nodes.image.create({
      src: '/pub/' + filename,
      alt: filename,
      title: filename
    });

    if (!editorView) return;
    const tr = editorView.state.tr.replaceSelectionWith(imageNode);
    editorView.dispatch(tr);
  });
  input.click();
};

type PostState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'failed'
;
const postState = ref<PostState>('idle');
const infoMessage = ref('');

const title = ref('');

const router = useRouter();
const post = async (status = 'publish') => {
  if (!editorView) return;

  const editorNodes = editorView.state.toJSON().doc.content;
  console.log(editorView.state.toJSON());
  const nodes = translate(editorNodes);

  if (props.postId) {
    console.log(nodes);

    try {
      postState.value = 'loading';

      await reqToken.post('/post/content/update', {
        postId: props.postId,
        content: nodes
      })

      postState.value = 'success';
      infoMessage.value = '更新成功';
      clear();
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      postState.value = 'failed';
      infoMessage.value = '更新失败';
      throw error;
    }

    return;
  }

  try {
    postState.value = 'loading';

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const data = await reqToken.post('/post/save', {
      title: title.value,
      content: nodes,
      status,
      tags: tags.value
    }) as any;

    if (data.success) {
      postState.value = 'success';
      infoMessage.value = '发布成功';
      clear();
      setTimeout(() => {
        router.back();
      }, 500);
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error(err);
    postState.value = 'failed';
    infoMessage.value = '发布失败';
    if (err instanceof AxiosError) {
      const { error, errors } = err.response?.data;
      if (error === 'no content') infoMessage.value = '不能发布空文章';
      else if (error === 'wrong fields') {
        for (const error of errors) {
          if (error.field === 'title') {
            infoMessage.value = '标题的长度必须在1到24内';
          } else if (error.field === 'tags') {
            infoMessage.value = '错误的标签数(请输入1到3个标签)';
          }
        }
      }
    }
  }
};

const publish = async () => {
  if (!oldPost.value) return;

  postState.value = 'loading';
  try {
    await reqToken.post('/post/publish-draft', { id: props.postId });

    postState.value = 'success';
    infoMessage.value = '发布成功';

    clear();
    setTimeout(() => {
      router.back();
    }, 500);
  } catch (error) {
    postState.value = 'failed';
    infoMessage.value = '发布失败';
  }
};
</script>

<style scoped>
.title {
  max-width: 100%;
}

.info {
  text-align: center;
  color: #757575;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1rem;
    height: 1rem;
    stroke: #757575;
    stroke-width: 2px;
  }
}

.info.success {
  color: white;
  background-color: #aacf53;
}

.info.danger {
  color: white;
  background-color: #d9333f;
}

.window {
  border-radius: 4px;
  width: 640px;
  overflow: hidden; 
  background-color: white;
  padding: 1rem;

  >*:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.content {
  border: 0;
  background-color: #F5F5F5;
  padding: 0.5rem;
  border-radius: 4px;
  min-height: 480px;
  display: flex;
}

.content :deep(.ProseMirror:focus) {
  outline: none;
  box-shadow: none;  /* 如果有点击阴影效果也移除 */
}

.content :deep(.ProseMirror) {
  flex: 1;
  min-width: 0;
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
  max-width: 90%;
  vertical-align: bottom;
}
</style>