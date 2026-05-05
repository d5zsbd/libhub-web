<template>
  <div>
    <div v-show="props.comment.replies.length > 0" class="replies field">
      <div class="reply" v-for="reply in props.comment.replies">
        <div class="reply-layout">
          <div class="left">
            <img class="avatar" :src="'/pub/' + reply.avatar" />
          </div>
          <div class="right">
            <div class="username">{{ reply.username + ' ' + new Date(reply.updated_at.replace(' ', 'T') + 'Z').toLocaleString() + ' #' + reply.id }}</div>
            <template v-if="reply.reply_to !== reply.root_id">
              <span class="username">{{ `回复#` + reply.reply_to }}</span>
              <div class="reply-to-content">
                <div>{{ reply.reply_to_username + ': ' }}</div>
                <ReplyToContent :content="JSON.parse(reply.reply_to_content)"></ReplyToContent>
              </div>
            </template>
            <div class="reply-content">
              <Content :content="JSON.parse(reply.content)"></Content>
            </div>
            <div class="actions">
              <div class="left"></div>
              <div class="right">
                <span v-if="authStore.payload" class="reply-action" @click="() => { isFocus = true; replyTo = { id: reply.id, username: reply.username }; }">回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrap" v-show="isFocus">
      <div v-if="replyTo" class="reply-to">回复：{{ `${replyTo!.username + ' #' + replyTo!.id }` }}</div>
      <div ref="editorRef" class="field content"></div>
    </div>

    <div class="actions">
      <div class="left">
        <button @click="handleInsertImage" v-if="isFocus" class="field button success">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
      </div>
      <div class="right">
        <button class="field button" v-if="!isFocus && authStore.payload" @click="() => { isFocus = true; replyTo = null; }">回复</button>
        <button class="field button" v-if="isFocus" @click="isFocus = false">取消</button>
        <button class="field button" v-if="isFocus" @click="handleReply">回复</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { editorStateConfig, postSchema } from '../utils/editor';
import { insertImage, translate } from '../utils/editor';
import { AxiosError } from 'axios';
import { reqToken } from '../utils/request';
import Content from './Content.vue';
import { Node } from 'prosemirror-model';
import ReplyToContent from './post/ReplyToContent.vue';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits<{
  reply: []
}>();

const props = defineProps<{
  comment: any
}>();

const authStore = useAuthStore();

const editorRef = ref<HTMLElement | null>();
let editorView: EditorView | null = null;
const replyTo = ref<{ id: number, username: string } | null>(null);

const isFocus = ref(false);

watch(isFocus, async (value) => {
  if (value) {
    if (!editorRef.value) return;

    editorView = new EditorView(editorRef.value, { state: EditorState.create(editorStateConfig) });
  } else {
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }
  }
});

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

const clear = () => {
  const doc = Node.fromJSON(postSchema, {
    type: 'doc',
    content: []
  });
  const editorState = EditorState.create({ ...editorStateConfig, doc });
  editorView?.updateState(editorState);
  replyTo.value = null;
  isFocus.value = false;
}

const handleReply = async () => {
  if (!editorView) return;

  const editorNodes = editorView.state.toJSON().doc.content;
  const content = translate(editorNodes);

  if (replyTo.value) {
    await reqToken.post('post/comment', {
      content,
      postId: props.comment.post_id,
      rootId: props.comment.id,
      replyTo: replyTo.value.id
    });
  } else {
    await reqToken.post('post/comment', {
      content,
      postId: props.comment.post_id,
      rootId: props.comment.id,
      replyTo: props.comment.id
    });
  } 

  emit('reply');
  clear();
}
</script>

<style scoped>
.content {
  flex: 1;
  min-height: 128px;
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
  max-width: 50%;
  vertical-align: bottom;
}

.content-wrap {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.replies {
  margin-bottom: 1rem;
}

.reply:not(:first-child) {
  margin-top: 1rem;
}

.reply-content:deep(img) {
  max-width: 50%;
  max-height: 50%;
}

.avatar {
  max-width: 48px;
  max-height: 48px;
  border-radius: 50%;
}

.reply-layout {
  display: flex;

  >.left {
    margin-right: 1rem;
  }

  >.right {
    flex: 1;

    .username {
      font-size: 0.8rem;
      color: #757575;
    }

    >*:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
}

.reply-to {
  font-size: 0.8rem;
  color: #757575;
}

.reply-to-content {
  font-size: 0.8rem;
  color: #757575;
  background-color: #e1dfdf;
  border-radius: 4px;
  padding: 0.5rem;
}

.reply-action {
  color: #757575;
  font-size: 0.8rem;
  cursor: pointer;
}
</style>