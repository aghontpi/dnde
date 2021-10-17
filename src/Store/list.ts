import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templates: [
    {
      id: 24234234,
      preview: 'https://picsum.photos/320/550',
    },
    {
      id: 4535345,
      preview: 'https://picsum.photos/320/400',
    },
    {
      id: 976824,
      preview: 'https://picsum.photos/320/600',
    },
  ],
};
const slice = createSlice({
  name: 'templates',
  initialState,
  reducers: {},
});

export const { reducer: templateListReducer } = slice;
