// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import {
  IQueryOptions,
  IUserProfileDto,
  UpdateCollectionDto,
} from "../dto/dto.type";
import { setState } from "../userSlice";
import { loggedOut } from "../authSilce";
import { buildParameters } from "@/utils/params";
import axiosBaseQuery from "./axios/axiosBaseQuery";

// Define an API slice
export const collectionApi = createApi({
  reducerPath: "userApi", // Unique key for the slice
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "localhost",
  }), // Use the Axios base query
  endpoints: (builder) => ({
    // Define a login endpoint
    updateCollectionInformation: builder.mutation({
      // query: () => ({
      //   url: "/user/profile",
      // }),
      queryFn: async (
        {
          id,
          parameters,
        }: { id: string; parameters: Partial<UpdateCollectionDto> },
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        // For the success case, the return type for the `data` property
        // must match `ResultType`
        //              v

        try {
          const { data } = (await baseQuery({
            url: `/users/collections/${id}`,
            data: parameters,
            method: "PATCH",
          })) as AxiosResponse<string>;

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
export const { useUpdateCollectionInformationMutation } = collectionApi;
