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
      // query: () => ({
      //   url: "/user/profile",
      // }),
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        // For the success case, the return type for the `data` property
        // must match `ResultType`
        //              v
        const data = await baseQuery({
          url: "/user/profile",
          method: "GET",
        });
        console.log(data.data);

        return { data: data.data };
      },
    }),
  }),
});

// Export hooks for the endpoints
export const { useGetProfileQuery } = userApi;
