// store/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import {
  CreateCollectionDto,
  IFlashCardDto,
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
        const { collection } = (queryApi.getState() as RootState)
          .persistedReducer;

        if (!collection.name) {
          throw new AxiosError("Collection name must be provided");
        }
        if (!collection.cards) {
          throw new AxiosError("Collection cards must be provided");
        }

        const dataDto: CreateCollectionDto = {
          name: collection.name,
          description: collection.description,
          flashCards: collection.cards.map((c) => ({
            front: c.front || "",
            back: c.back || "",
          })),
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

    // ! DELETE A COLLECTION APIs
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

    /**
     * IMPORTANT
     *
     * this is a APIs for updating all of the colletion's flashcards,
     * including modifications the content of each card, place and delete
     *
     *  */
    updateAllFlashcards: builder.mutation({
      queryFn: async (
        arg: {
          collectionId: string;
          flashcards: (Pick<IFlashCardDto, "back" | "front"> &
            Partial<Pick<IFlashCardDto, "id">>)[];
        },
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        try {
          const { data } = (await baseQuery({
            url: `/users/collections/${arg.collectionId}`,
            method: "PUT",
            data: { flashCards: arg.flashcards },
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
export const {
  useCreateNewCollectionMutation,
  useUpdateCollectionInformationMutation,
  useDeleteCollectionMutation,

  useUpdateAllFlashcardsMutation,
} = collectionApi;
