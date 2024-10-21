import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:5000/graphql",
  documents: ["./**/*.ts", "../**/*.gql"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./__generated__/": {
      preset: "client",
      plugins: [
        // "typescript", // Generates TypeScript types from GraphQL schema
        // "typescript-operations", // Generates TypeScript types for operations
        // "typescript-react-apollo", // Apollo hooks with TypeScript support
      ],

      // presetConfig: {
      //   gqlTagName: "gql",
      // },
    },
    // "./graphql.schema.json": {
    //   plugins: ["introspection"],
    // },
  },
  watch: true,
};

export default config;
