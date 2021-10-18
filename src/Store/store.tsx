import { configureStore } from '@reduxjs/toolkit';
import { FC } from 'react';
import { DndeApi } from '../Api/api';
import { templateListReducer } from './list';

import { Provider } from 'react-redux';

const store = configureStore({
  reducer: { [DndeApi.reducerPath]: DndeApi.reducer, templateList: templateListReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(DndeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const StoreProvider: FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
