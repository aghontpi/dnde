import { useEffect } from 'react';

//https://stackoverflow.com/a/38479462/6843092
function saveCaretPosition(context: any) {
  var selection = window.getSelection();
  if (selection) {
    var range = selection.getRangeAt(0);
    range.setStart(context, 0);
    var len = range.toString().length;

    return function restore() {
      var pos = getTextNodeAtPosition(context, len);
      if (selection) {
        selection.removeAllRanges();
        var range = new Range();
        range.setStart(pos.node, pos.position);
        selection.addRange(range);
      }
    };
  }
}
//
function getTextNodeAtPosition(root: any, index: any) {
  const NODE_TYPE = NodeFilter.SHOW_TEXT;
  var treeWalker = document.createTreeWalker(root, NODE_TYPE, function next(elem: any) {
    if (index > elem.textContent.length) {
      index -= elem.textContent.length;
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  });
  var c = treeWalker.nextNode();
  return {
    node: c ? c : root,
    position: index,
  };
}

const useContentEditableCallback = (element: HTMLDivElement, callback: (e: any) => void, active: boolean) => {
  useEffect(() => {
    if (element && active) {
      let editorInstance = element.children[0];
      editorInstance.addEventListener('onfoucsout', callback);
      editorInstance.classList.add('editor-active');
      editorInstance.setAttribute('contentEditable', 'true');
      editorInstance.setAttribute('spellcheck', 'false');
      console.log('created dynamic blur event listener');
      editorInstance.addEventListener('onfocusout', () => saveCaretPosition(editorInstance));

      return () => {
        editorInstance.classList.remove('editor-active');
        editorInstance.setAttribute('contentEditable', 'false');
        editorInstance.setAttribute('spellcheck', 'unset');
        editorInstance.removeEventListener('onfocusout', callback);
        editorInstance.removeEventListener('onfocusout', () => saveCaretPosition(editorInstance));
        console.log('removed dynamic blur event listender');
      };
    }
  }, [element, callback, active]);
};

export { useContentEditableCallback };
