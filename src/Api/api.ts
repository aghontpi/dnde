import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ListTemplateResponse {
  response: ListTemplateInfo[];
}

export interface ListTemplateInfo {
  preview: string;
  docRef: string;
  id: number;
}

export interface getTemplateRequest {
  id: string;
}

export interface getTemplateResponse {
  response: Response;
}
export interface Response {
  date: string;
  docRef: string;
  data: string;
}

export const DndeApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API }),
  endpoints: (builder) => ({
    getTemplates: builder.query<ListTemplateResponse, void>({
      query: () => `templates/`,
    }),
    getTemplate: builder.query<getTemplateResponse, getTemplateRequest>({
      query: ({ id }) => `templates/${id}`,
    }),
  }),
});

export const { useGetTemplatesQuery, useLazyGetTemplateQuery } = DndeApi;
