import { Component } from 'react';

export default class Editor extends Component<{ preview?: boolean; showUndoRedo?: boolean }> {
  getHtml: () => string;
  getJson: () => string;
  loadJson: (json: string | null) => string;
  undoredo: {
    undoActionCallback: () => void;
    redoActionCallback: () => void;
    isUndoEmpty: () => boolean;
    isRedoEmpty: () => boolean;
  };
}

export { Editor };
