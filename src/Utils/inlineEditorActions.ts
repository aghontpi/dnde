import { logger } from './logger';

const InlineEditorActions = (e: any, type: string, extras = '') => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  logger.log('editor action:', type, extras);
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
    case 'color':
      document.execCommand('backColor', false, extras);
      break;
    case 'fontColor':
      document.execCommand('foreColor', false, extras);
      break;
    case 'fontFamily':
      document.execCommand('fontName', false, extras);
      break;
    default:
      logger.info(`unhandled action ${type}`);
  }
  return false;
};

export { InlineEditorActions };
