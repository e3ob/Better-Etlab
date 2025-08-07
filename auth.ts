import Axios from "@/lib/axios";
import { User } from "@/types";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"



export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials({
    credentials: {
      username: { label: "Username", type: "text", placeholder: "Etlab Username" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const { data } = await Axios.post("/login", credentials)
      if (!data.login) return null
      return data;
    },

  }),],
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});