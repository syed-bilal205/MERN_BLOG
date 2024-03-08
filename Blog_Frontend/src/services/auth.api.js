import { apiSlice } from "./api.js";
import { USERS_URL } from "./constant.js";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    refreshAccessToken: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/refresh-token`,
        method: "POST",
        body: data,
      }),
    }),
    changeUserPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "POST",
        body: data,
      }),
    }),
    updateUserAccountDetails: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-user-account-details`,
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => `${USERS_URL}/get-current-user`,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useChangeUserPasswordMutation,
  useRefreshAccessTokenMutation,
  useUpdateUserAccountDetailsMutation,
} = authApiSlice;
