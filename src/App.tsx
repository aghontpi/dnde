import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import 'quill/dist/quill.snow.css';
import Editor from './Pages/Editor/';

function App() {
  return (
    <div className="my-app">
      <Editor />
    </div>
  );
}

export default App;
