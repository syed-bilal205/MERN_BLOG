import { apiSlice } from "./api.js";
import { LIKE_URL } from "./constant.js";

export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    blogLikes: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `${LIKE_URL}/${blogId}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useBlogLikesMutation } = likeApiSlice;
