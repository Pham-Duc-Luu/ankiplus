import { graphql } from "@/__generated__/gql";

export const GET_USER_COLLECTIONS = graphql(/* GraphQL */ `
  query GetUserCollections($LIMIT: Int!, $SKIP: Int!) {
    getUserCollections(limit: $LIMIT, skip: $SKIP) {
      skip
      total
      limit
      data {
        _id
        name
        thumnail
        icon
        language
        createdAt
        updatedAt
        description
      }
    }
  }
`);

export const GET_USER_TOTAL_AMOUNT_OF_COLLECTION = graphql(`
  query GetUserTotalAmountOfCollection {
    getUserCollections {
      total
    }
  }
`);
