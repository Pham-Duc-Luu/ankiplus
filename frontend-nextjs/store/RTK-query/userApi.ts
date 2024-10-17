// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";
import { AxiosError, AxiosResponse } from "axios";
import { IQueryOptions, IUserProfileDto } from "../dto/dto.type";
import { setState } from "../userSlice";
import { loggedOut } from "../authSilce";
import { buildParameters } from "@/utils/params";

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
      queryFn: async (
        { options }: { options?: IQueryOptions },
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        // For the success case, the return type for the `data` property
        // must match `ResultType`
        //              v

        try {
          const { data } = (await baseQuery({
            url: `/user/profile?${buildParameters({ ...options })}`,
            method: "GET",
          })) as AxiosResponse<IUserProfileDto>;
          if (!data) {
            queryApi.dispatch(loggedOut());
          }
          queryApi.dispatch(setState(data));

          return { data: data };
        } catch (error) {
          const err = error as AxiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message,
            },
          };
        }
      },
    }),
  }),
});

// Export hooks for the endpoints
export const { useGetProfileQuery } = userApi;
