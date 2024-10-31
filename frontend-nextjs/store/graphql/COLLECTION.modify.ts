import { api as generatedApi } from "./COLLECTION.generated";

export const CollectionGraphqlApi = generatedApi.enhanceEndpoints({
  addTagTypes: ["Collection"],
  endpoints: {
    GetUserCollections: {
      providesTags: ["Collection"],
    },
  },
});
export const {
  useGetUserCollectionsQuery,
  useLazyGetUserCollectionsQuery,
  useGetFLashCardsInCollectionQuery,
  useLazyGetFLashCardsInCollectionQuery,
  useGetCollectionDetailQuery,
  useLazyGetCollectionDetailQuery,
} = CollectionGraphqlApi;
