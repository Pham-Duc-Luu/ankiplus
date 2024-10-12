// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

// Define an API slice
export const userApi = createApi({
  reducerPath: "userApi", // Unique key for the slice
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "localhost",
  }), // Use the Axios base query
  endpoints: (builder) => ({
    // Define a login endpoint
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const { useGetProfileQuery } = userApi;
