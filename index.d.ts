import { Component } from 'react';

export default class Editor extends Component {
  getHtml: () => string;
  getJson: () => string;
  loadJson: (json: string | null) => string;
}
