import { apiSlice } from "./api.js";
import { COMMENT_URL } from "./constant.js";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addComments: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `${COMMENT_URL}/add-comment/${blogId}`,
        method: "POST",
        body: data,
      }),
    }),
    updateComment: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `${COMMENT_URL}/update-comment/${commentId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteComment: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `${COMMENT_URL}/delete-comment/${commentId}`,
        method: "DELETE",
        body: { data },
      }),
    }),
    getTheBlogComments: builder.query({
      queryFn: (blogId) => `${COMMENT_URL}/get-comments/${blogId}`,
    }),
  }),
});

export const {
  useAddCommentsMutation,
  useDeleteCommentMutation,
  useGetTheBlogCommentsQuery,
  useUpdateCommentMutation,
} = commentApiSlice;
