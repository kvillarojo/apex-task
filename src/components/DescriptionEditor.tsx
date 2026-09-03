import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'link'],
  ['clean']
];

const hasMarkup = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

export const DescriptionEditor: React.FC<DescriptionEditorProps> = ({ value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const syncingValueRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editorMount = document.createElement('div');
    container.replaceChildren(editorMount);
    const editor = new Quill(editorMount, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
      placeholder: 'Add detailed description or notes...'
    });
    quillRef.current = editor;

    if (initialValueRef.current) {
      if (hasMarkup(initialValueRef.current)) {
        editor.clipboard.dangerouslyPasteHTML(initialValueRef.current);
      } else {
        editor.setText(initialValueRef.current);
      }
    }

    const handleTextChange = () => {
      if (!syncingValueRef.current) {
        onChangeRef.current(editor.getSemanticHTML());
      }
    };

    editor.on('text-change', handleTextChange);
    return () => {
      editor.off('text-change', handleTextChange);
      quillRef.current = null;
      container.replaceChildren();
    };
  }, []);

  useEffect(() => {
    const editor = quillRef.current;
    if (!editor) return;

    const currentValue = editor.getSemanticHTML();
    if (value === currentValue || (!value && !editor.getText().trim())) return;

    syncingValueRef.current = true;
    editor.setText('');
    if (value) {
      if (hasMarkup(value)) {
        editor.clipboard.dangerouslyPasteHTML(value);
      } else {
        editor.setText(value);
      }
    }
    syncingValueRef.current = false;
  }, [value]);

  return <div ref={containerRef} className="description-editor" />;
};
