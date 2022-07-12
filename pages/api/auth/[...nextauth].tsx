import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import type { NextAuthOptions } from "next-auth";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

export default NextAuth(nextAuthOptions);
export { nextAuthOptions };
