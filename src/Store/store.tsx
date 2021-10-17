import { configureStore } from '@reduxjs/toolkit';
import { FC } from 'react';
import { templateListReducer } from './list';

import { Provider } from 'react-redux';

const store = configureStore({
  reducer: { templateList: templateListReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const StoreProvider: FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
