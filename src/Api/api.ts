import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ListTemplateResponse {
  response: ListTemplateInfo[];
}

export interface ListTemplateInfo {
  preview: string;
  docRef: string;
  id: number;
}

export const DndeApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API }),
  endpoints: (builder) => ({
    getTemplates: builder.query<ListTemplateResponse, void>({
      query: () => `templates/`,
    }),
  }),
});

export const { useGetTemplatesQuery } = DndeApi;
