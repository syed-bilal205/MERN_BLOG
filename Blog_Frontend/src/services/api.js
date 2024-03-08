import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./constant.js";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery,
  endpoints: () => ({}),
});

export const { useLazyQuery } = apiSlice;
