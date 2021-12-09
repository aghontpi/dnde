import React from 'react';
import { HashRouter } from 'react-router-dom';
import Pages from './Pages';
import 'antd/dist/antd.css';
import './App.scss';
import { StoreProvider } from './Store/store';
import { Modal } from 'antd';

function App() {
  return (
    <StoreProvider>
      <HashRouter
        getUserConfirmation={async (message, callback) => {
          const userConfirm = await new Promise<boolean>((resolve) => {
            Modal.confirm({
              title: message,
              onOk: () => resolve(true),
              onCancel: () => resolve(false),
            });
          });

          callback(userConfirm);
        }}
      >
        <div className="my-app">
          <Pages />
        </div>
      </HashRouter>
    </StoreProvider>
  );
}

export default App;
