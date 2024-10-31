// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import {
  CreateCollectionDto,
  IQueryOptions,
  IUserProfileDto,
  UpdateCollectionDto,
} from "../dto/dto.type";
import axiosBaseQuery from "./axios/axiosBaseQuery";
import { RootState } from "../store";
import _ from "lodash";
import { IReorderItemCard } from "@/app/[locale]/create/collection/page";
import { api } from "../graphql/COLLECTION.generated";

// Define an API slice
export const collectionApi = createApi({
  reducerPath: "collectionApi", // Unique key for the slice
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "localhost",
  }), // Use the Axios base query
  tagTypes: ["Collection"],
  endpoints: (builder) => ({
    // Define a login endpoint
    updateCollectionInformation: builder.mutation({
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

    createNewCollection: builder.mutation({
      queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
        // For the success case, the return type for the `data` property
        // must match `ResultType`
        //              v
        const { newCollection } = (queryApi.getState() as RootState)
          .persistedReducer.createNewCollection;

        if (!newCollection.name) {
          return { error: "Invalid collection name" };
        }
        const list = newCollection.flashCards.filter((c) => c.front && c.back);

        const dataDto: CreateCollectionDto = {
          ...newCollection,
          name: newCollection.name,
          flashCards: newCollection.flashCards
            .filter((c) => c.front && c.back)
            .map((c) => ({ front: c.front, back: c.back })),
        };
        try {
          const { data } = (await baseQuery({
            url: "/users/collections",
            method: "POST",
            data: dataDto,
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

    deleteCollection: builder.mutation({
      queryFn: async (
        arg: { id?: string | number },
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        try {
          const { data } = (await baseQuery({
            url: `/users/collections/${arg.id}`,
            method: "DELETE",
          })) as AxiosResponse<string>;

          const { persistedReducer } = queryApi.getState() as RootState;
          const { user } = persistedReducer;
          const LIMIT = user?.amountOfCollectionPerPage;
          const SKIP =
            user.page && user.amountOfCollectionPerPage
              ? (user.page - 1) * user.amountOfCollectionPerPage
              : 10;

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
      invalidatesTags: ["Collection"],
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useCreateNewCollectionMutation,
  useUpdateCollectionInformationMutation,
  useDeleteCollectionMutation,
} = collectionApi;
