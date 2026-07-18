import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Here you should connect to your DB and verify the user
        // Mock authorization for now
        if (credentials?.email && credentials?.password) {
          return { id: "1", name: "User", email: credentials.email };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
