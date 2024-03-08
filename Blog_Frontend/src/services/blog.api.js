import { BLOG_URL } from "./constant.js";
import { apiSlice } from "./api.js";

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBlogPost: builder.mutation({
      query: (data) => ({
        url: `${BLOG_URL}/create-blog-post`,
        method: "POST",
        body: data,
      }),
    }),
    updateTheBlogImage: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `${BLOG_URL}/update-the-blog-image/${blogId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateTheBlogDetails: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `${BLOG_URL}/update-blog-details/${blogId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteTheBlogPost: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `${BLOG_URL}/delete-blog/${blogId}`,
        method: "DELETE",
        body: { data },
      }),
    }),
    getAllTheBlogPosts: builder.query({
      query: ({ page = 1, limit = 10, sortBy, search }) => {
        let url = `/get-all-posts?page=${page}&limit=${limit}`;
        if (sortBy) {
          url += `&sortBy=${sortBy}`;
        }
        if (search) {
          url += `&search=${search}`;
        }
        return { url };
      },
    }),
    getTheSingleBlogPost: builder.query({
      queryFn: (blogId) => `${BLOG_URL}/get-blog/${blogId}`,
    }),
  }),
});

export const {
  useCreateBlogPostMutation,
  useGetAllTheBlogPostsQuery,
  useDeleteTheBlogPostMutation,
  useGetTheSingleBlogPostQuery,
  useUpdateTheBlogImageMutation,
  useUpdateTheBlogDetailsMutation,
} = blogApiSlice;
