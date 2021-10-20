import React from 'react';
import { HashRouter } from 'react-router-dom';
import Pages from './Pages';
import 'antd/dist/antd.css';
import 'quill/dist/quill.snow.css';
import './App.scss';
import { StoreProvider } from './Store/store';

function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <div className="my-app">
          <Pages />
        </div>
      </HashRouter>
    </StoreProvider>
  );
}

export default App;
