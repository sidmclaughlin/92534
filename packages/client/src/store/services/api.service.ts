import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
});

export const api = createApi({
  baseQuery,
  endpoints: (build) => ({}),
});

// export const {} = api;
