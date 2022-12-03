import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from '../../common/dtos/api-response.dto';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4000',
});

export const api = createApi({
  baseQuery,
  endpoints: (build) => ({
    getEvents: build.query<ApiResponse<Record<string, any>[]>, { limit: number; offset: number }>({
      query: ({ limit, offset }) => ({ url: `v0/events?limit=${limit}&offset=${offset}` }),
    }),
    getEvent: build.query<ApiResponse<Record<string, any>>, Record<string, any>>({
      query: (args) => ({ url: `v0/events/${args.id}` }),
    }),
  }),
});

export const { useGetEventsQuery, useGetEventQuery } = api;
