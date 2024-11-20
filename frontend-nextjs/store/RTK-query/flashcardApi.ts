import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios/axiosBaseQuery";
import { AxiosError, AxiosResponse } from "axios";
import { flashCardDto } from "../dto/dto.type";

export const flashcardApi = createApi({
  reducerPath: "flashcardApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "localhost",
  }), // Use the Axios base query
  endpoints: (builder) => ({
    deleteFlashCard: builder.mutation({
      queryFn: async (
        {
          collectionId,
          flashcardId,
        }: { collectionId: string; flashcardId: string },
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        try {
          const { data } = (await baseQuery({
            url: `/users/collections/${collectionId}/flashcards/${flashcardId}`,
            method: "DELETE",
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

    updateFlashcardInformation: builder.mutation({
      queryFn: async (
        {
          collectionId,
          flashcardId,
          front,
          back,
        }: { collectionId: string; flashcardId: string } & flashCardDto,
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        try {
          const { data } = (await baseQuery({
            url: `/users/collections/${encodeURIComponent(
              collectionId
            )}/flashcards/${encodeURIComponent(flashcardId)}`,
            method: "PATCH",
            data: { front, back },
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

    addFlashCardToCollection: builder.mutation({
      queryFn: async (
        {
          collectionId,
          listCard,
        }: { collectionId: string; listCard: flashCardDto[] },
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        try {
          const { data } = (await baseQuery({
            url: `/users/collections/${collectionId}/flashcards`,
            method: "POST",
            data: listCard,
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

export const {
  useDeleteFlashCardMutation,
  useUpdateFlashcardInformationMutation,
  useAddFlashCardToCollectionMutation,
} = flashcardApi;
