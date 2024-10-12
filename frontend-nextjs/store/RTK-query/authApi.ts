// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
}

// Define an API slice
export const authApi = createApi({
  reducerPath: "authApi", // Unique key for the slice
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "localhost",
  }), // Use the Axios base query
  endpoints: (builder) => ({
    // Define a login endpoint
    signUp: builder.mutation<
      IAuthResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/sign-in",
        method: "POST",
        data: credentials,
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const { useSignUpMutation } = authApi;
