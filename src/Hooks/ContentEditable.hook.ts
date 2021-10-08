import { useEffect } from 'react';

const useContentEditableCallback = (element: HTMLDivElement, callback: (e: any) => void, active: boolean) => {
  useEffect(() => {
    if (element && active) {
      let editorInstance = element.children[0];
      editorInstance.addEventListener('focusout', (e: any) => {
        console.log('custom inlin editor: foucs out', e);
        callback(e);
      });
      editorInstance.classList.add('editor-active');
      editorInstance.setAttribute('contentEditable', 'true');
      editorInstance.setAttribute('spellcheck', 'false');

      console.log('custom inline editor: created dynamic event listener');

      return () => {
        editorInstance.classList.remove('editor-active');
        editorInstance.setAttribute('contentEditable', 'false');
        editorInstance.setAttribute('spellcheck', 'unset');
        editorInstance.removeEventListener('focusout', (e: any) => {
          callback(e);
        });
        console.log('custom inline editor: removed dynamic event listener');
      };
    }
  }, [element, callback, active]);
};

export { useContentEditableCallback };
