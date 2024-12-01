import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios/axiosBaseQuery";
import { AxiosError, AxiosResponse } from "axios";
import { flashCardDto } from "../dto/dto.type";
import { RootState } from "../store";
import { nextReview, reviewAgain } from "../collectionSlice";

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
    reviewFlashcard: builder.mutation({
      queryFn: async (
        {
          collectionId,
          quality,
          cardId,
        }: { collectionId: string; cardId?: string; quality: number },
        queryApi,
        extraOptions,
        baseQuery
      ) => {
        try {
          const baseState = queryApi.getState() as RootState;
          const dispatch = queryApi.dispatch;

          const flashCardId =
            cardId || baseState.persistedReducer.collection.reviewCard?._id;

          if (!flashCardId) {
            throw new AxiosError(`Invalid flashcard's id`);
          }

          // IMPORTANT : check the quality is between 1 and 5
          if (quality > 5 || quality < 1) {
            throw new AxiosError(`Invalid quality`);
          }
          if (quality === 1) {
            dispatch(reviewAgain());
          } else {
            dispatch(nextReview());
          }

          const { data } = (await baseQuery({
            url: `/users/collections/${collectionId}/flashcards/${flashCardId}/review/${quality}`,
            method: "GET",
          })) as AxiosResponse<string>;

          return { data: "ok" };
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
  useReviewFlashcardMutation,
} = flashcardApi;
