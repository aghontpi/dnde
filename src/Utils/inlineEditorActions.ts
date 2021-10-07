const InlineEditorActions = (type: string, extras = '') => {
  switch (type) {
    case 'bold':
      document.execCommand('bold');
      break;
    case 'underline':
      document.execCommand('underline');
      break;
    case 'italics':
      document.execCommand('italic');
      break;
    case 'size':
      document.execCommand('fontSize', false, extras);
      break;
    default:
      console.info(`unhandled action ${type}`);
  }
};

export { InlineEditorActions };
