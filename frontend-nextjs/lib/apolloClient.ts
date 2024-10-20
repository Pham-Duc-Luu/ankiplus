import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Function to create Apollo Client with authentication
const createApolloClient = (config: { token?: string }) => {
  // HTTP Link for the GraphQL API
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_BASE_URL}/graphql`,
  });

  // Middleware to add Authorization header
  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from localStorage or any other storage method

    // Return the headers with the token, if it exists
    return {
      headers: {
        ...headers,
        authorization: config?.token ? `Bearer ${config?.token}` : "", // Add the token as a Bearer token
      },
    };
  });

  // Create the Apollo Client
  return new ApolloClient({
    link: authLink.concat(httpLink), // Use the authLink before the httpLink
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
