<template>
  <button @click="insertImage">insert image</button>
  <button @click="analyze">analyze</button>
  <button @click="handleVisit">visit</button>
  <button @click="post">post</button>
  <button @click="get">get</button>
  <div ref="editorRef"></div>
</template>

<script setup lang="ts">
import { EditorState } from 'prosemirror-state';
import { schema } from 'prosemirror-schema-basic';
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { EditorView } from 'prosemirror-view';
import { history, redo, undo } from 'prosemirror-history';
import { Schema } from 'prosemirror-model';
import request, { reqToken } from '../../utils/request';

const editorRef: Ref<HTMLElement | null> = ref(null)
let editorView: EditorView | null = null

const mySchema = new Schema({
  nodes: schema.spec.nodes.append({
    image: {
      inline: true,
      attrs: {
        src: { default: '' },
        alt: { default: '' },
        title: { default: '' },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom) {
            return {
              src: dom.getAttribute('src'),
              alt: dom.getAttribute('alt'),
              title: dom.getAttribute('title'),
            }
          }
        }
      ],
      toDOM(node) {
        const { src, alt, title } = node.attrs

        return ['img', { src, alt, title }]
      }
    }
  }),
  marks: schema.spec.marks
})

onMounted(() => {
  if (!editorRef.value) return

  const state = EditorState.create({
    schema: mySchema,
    plugins: [
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
      }),
      keymap(baseKeymap)
    ]
  })

  editorView = new EditorView(editorRef.value, {
    state,
    dispatchTransaction(transaction) {
      if (editorView === null) return

      const newState = editorView.state.apply(transaction)
      editorView.updateState(newState)
    }
  })
})

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
})

const insertImage = async () => {
  if (!editorView) return

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    const { filename } = await request.post('/upload/image', formData) as any

    const imageNode = mySchema.nodes.image.create({
      src: 'http://localhost:3000/pub/' + filename,
      alt: filename,
      title: filename
    })

    if (!editorView) return
    const tr = editorView.state.tr.replaceSelectionWith(imageNode)
    editorView.dispatch(tr)
  })
  input.click()
}

const analyze = () => {
  console.log(editorView?.state.toJSON().doc.content);
}

const handleVisit = () => {
  if (!editorView) return;

  const nodes = editorView.state.toJSON().doc.content;
  console.log(visit(nodes));
}

type EditorNode = 
  | { type: 'image', attrs: { title: string } }
  | { type: 'paragraph', content?: Array<EditorNode> }
  | { type: 'text', text: string };

type Node = 
  | { type: 'image', filename: string }
  | { type: 'paragraph', content?: Array<Node> }
  | { type: 'text', text: string };

// filter原型
const visit = (nodes: EditorNode[]) => {
  const children: Node[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case 'image':
        console.log(node.attrs.title);
        children.push({ type: 'image', filename: node.attrs.title });
      break;
      case 'paragraph':
        if (node.content) children.push({ type: 'paragraph', content: visit(node.content) });
        else children.push({ type: 'paragraph' });
      break;
      case 'text':
        console.log(node.text);
        children.push({ type: 'text', text: node.text });
      break;
      default:
    } 
  }

  return children;
}

const post = async () => {
  if (!editorView) return;

  const editorNodes = editorView.state.toJSON().doc.content;
  const nodes = visit(editorNodes);

  try {
    const data = await reqToken.post('/post/save', {
      title: 'TEST',
      nodes
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const get = async () => {
  try {
    const data: any = await request.get('/post/1');
    console.log(data);
    console.log(JSON.parse(data.post.content));
  } catch (error) {
    console.error(error);
  }
}
</script>