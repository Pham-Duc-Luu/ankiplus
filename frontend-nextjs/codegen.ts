import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5000/graphql",
  documents: ["store/**/*.graphql"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    // "store/graphql-request/sdk.ts": {
    //   plugins: [
    //     "typescript",
    //     "typescript-graphql-request",
    //     "typescript-operations",
    //   ],
    // },
  },
};

export default config;
