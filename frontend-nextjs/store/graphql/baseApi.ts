import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "../rtk-query-graphql-request-base-query";

export const graphqlApi = createApi({
  reducerPath: "api/graphql",
  baseQuery: graphqlRequestBaseQuery({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}` || "http://localhost:5000",
  }),
  endpoints: () => ({}),
});
