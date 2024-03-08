import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./constant.js";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: true,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery,
  endpoints: () => ({}),
});

export const { useLazyQuery } = apiSlice;
