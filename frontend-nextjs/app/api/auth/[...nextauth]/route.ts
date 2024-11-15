import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
