import { Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import type { EditorStateConfig } from "prosemirror-state";
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { EditorView } from "prosemirror-view";
import { reqToken } from "./request";

export const postSchema =  new Schema({
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
});

export const editorStateConfig: EditorStateConfig = {
  schema: postSchema,
  plugins: [
    history(),
    keymap({
      'Mod-z': undo,
      'Mod-y': redo,
    }),
    keymap(baseKeymap)
  ],
};

export type EditorNode = 
  | { type: 'image', attrs: { title: string, src: string, alt: string } }
  | { type: 'paragraph', content?: Array<EditorNode> }
  | { type: 'text', text: string };

export type PostNode = 
  | { type: 'image', filename: string }
  | { type: 'paragraph', content?: Array<PostNode> }
  | { type: 'text', text: string };

export const translate = (nodes: EditorNode[]) => {
  const children: PostNode[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case 'image':
        children.push({ type: 'image', filename: node.attrs.title });
      break;
      case 'paragraph':
        if (node.content) children.push({ type: 'paragraph', content: translate(node.content) });
        else children.push({ type: 'paragraph' });
      break;
      case 'text':
        children.push({ type: 'text', text: node.text });
      break;
    }
  }

  return children;
}

export const fromPost = (nodes: PostNode[]) => {
  const children: EditorNode[] = [];

  for (const node of nodes) {
    switch (node.type) {
    case "image":
      children.push({ type: 'image', attrs: { title: node.filename, alt: node.filename, src: '/pub/' +  node.filename } });
    break;
    case "paragraph":
      if (node.content) children.push({ type: 'paragraph', content: fromPost(node.content) });
      else children.push({ type: 'paragraph' });
    break;
    case "text":
      children.push({ type: 'text', text: node.text });
    break;
    }
  }

  return children;
}

export const insertImage = (editorView: EditorView) => {
  return new Promise<void>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const { filename } = await reqToken.post('/upload/image', formData) as any;

        const imageNode = postSchema.nodes.image.create({
          src: '/pub/' + filename,
          alt: filename,
          title: filename
        });

        const tr = editorView.state.tr.replaceSelectionWith(imageNode);
        editorView.dispatch(tr);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    input.click();
  });
};