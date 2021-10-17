import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Pages from './Pages';
import './App.css';
import 'antd/dist/antd.css';
import 'quill/dist/quill.snow.css';
import { StoreProvider } from './Store/store';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="my-app">
          <Pages />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
