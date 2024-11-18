// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios/axiosBaseQuery";

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
    signIn: builder.mutation<
      IAuthResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/sign-in",
        method: "POST",
        data: credentials,
      }),
    }),
    signUp: builder.mutation<
      IAuthResponse,
      { email: string; password: string; username: string }
    >({
      query: (credentials) => ({
        url: "/sign-up",
        method: "POST",
        data: credentials,
      }),
    }),
    sendOtp: builder.mutation<string, { email: string }>({
      query: (credentials) => ({
        url: "/reset-password/send-otp",
        method: "POST",
        data: credentials,
      }),
    }),
    resetPassword: builder.mutation<
      string,
      { email: string; password: string; otp: string }
    >({
      query: (credentials) => ({
        url: "/reset-password",
        method: "POST",
        data: credentials,
      }),
    }),
    GoogleOAuth2: builder.mutation<IAuthResponse, string>({
      query: (token) => ({
        url: "/auth/google/verify",
        method: "POST",
        data: { token },
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useSignInMutation,
  useSignUpMutation,
  useGoogleOAuth2Mutation,
  useResetPasswordMutation,
  useSendOtpMutation,
} = authApi;
