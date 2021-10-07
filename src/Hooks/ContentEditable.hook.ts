import { useEffect } from 'react';

const useContentEditableCallback = (element: HTMLDivElement, callback: (e: any) => void, active: boolean) => {
  useEffect(() => {
    if (element && active) {
      let editorInstance = element.children[0];
      editorInstance.addEventListener('onfoucsout', callback);
      editorInstance.classList.add('editor-active');
      editorInstance.setAttribute('contentEditable', 'true');
      editorInstance.setAttribute('spellcheck', 'false');
      console.log('created dynamic blur event listener');

      return () => {
        editorInstance.classList.remove('editor-active');
        editorInstance.setAttribute('contentEditable', 'false');
        editorInstance.setAttribute('spellcheck', 'unset');
        editorInstance.removeEventListener('onfocusout', callback);
        console.log('removed dynamic blur event listender');
      };
    }
  }, [element, callback, active]);
};

export { useContentEditableCallback };
