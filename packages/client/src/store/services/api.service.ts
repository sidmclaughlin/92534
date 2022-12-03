import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from '../../common/dtos/api-response.dto';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4000',
});

export const api = createApi({
  baseQuery,
  endpoints: (build) => ({
    getAreas: build.query<ApiResponse<Record<string, any>[]>, void>({
      query: () => ({ url: `v0/areas` }),
    }),
    getEvents: build.query<
      ApiResponse<Record<string, any>[]>,
      { limit: number; offset: number; area_id: string; severity: string; event_type: string; start_date: string }
    >({
      query: ({ limit, offset, area_id, severity, event_type, start_date }) => {
        const urlParts: string[] = [`v0/events?limit=${limit}&offset=${offset}`];

        if (area_id) urlParts.push(`area_id=${area_id}`);
        if (severity) urlParts.push(`severity=${severity}`);
        if (event_type) urlParts.push(`event_type=${event_type}`);
        if (start_date) urlParts.push(`start_date=${start_date}`);

        return { url: urlParts.join('&') };
      },
    }),
    getEvent: build.query<ApiResponse<Record<string, any>>, Record<string, any>>({
      query: (args) => ({ url: `v0/events/${args.id}` }),
    }),
  }),
});

export const { useGetAreasQuery, useGetEventsQuery, useGetEventQuery } = api;
