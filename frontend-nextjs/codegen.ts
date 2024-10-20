import { CodegenConfig } from "@graphql-codegen/cli";
const config: CodegenConfig = {
  schema: `http://localhost:5000/graphql`,
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["./src/**/*.{ts,tsx}"],
  generates: {
    "./__generated__/": {
      plugins: [
        "typescript", // Generates TypeScript types for GraphQL schema
        "typescript-operations", // Generates TypeScript types for GraphQL operations
        "typescript-react-apollo", // Generates Apollo hooks in TypeScript
      ],
      config: {
        withHooks: true, // Enables Apollo Client hooks (e.g., useQuery, useMutation)
      },
    },
  },
  ignoreNoDocuments: true, // Generates types even if no operations are found
};

export default config;
