import { useEffect } from 'react';

const useContentEditableCallback = (element: HTMLDivElement, callback: (e: any) => void, active: boolean) => {
  useEffect(() => {
    if (element && active) {
      let editorInstance = element.children[0];
      editorInstance.addEventListener('blur', callback);
      editorInstance.classList.add('editor-active');
      editorInstance.setAttribute('contentEditable', 'true');
      editorInstance.setAttribute('spellcheck', 'false');

      return () => {
        editorInstance.classList.remove('editor-active');
        editorInstance.setAttribute('contentEditable', 'false');
        editorInstance.setAttribute('spellcheck', 'unset');
        editorInstance.removeEventListener('onblur', callback);
      };
    }
  }, [element, callback, active]);
};

export { useContentEditableCallback };
