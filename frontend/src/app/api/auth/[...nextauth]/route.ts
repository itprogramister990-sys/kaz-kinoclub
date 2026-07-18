import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In a real app, this would be a database call
// Using a mock array for demonstration purposes
const users: any[] = [];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: false },
        password: { label: "Password", type: "password", required: false },
        token: { label: "Token", type: "text", required: false }
      },
      async authorize(credentials) {
        // 1. Magic Link / Token verification login
        if (credentials?.token) {
          try {
            const secret = process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_mode_only_123456_do_not_use_in_prod";
            const decoded = jwt.verify(credentials.token, secret) as any;
            
            if (decoded && decoded.email) {
              // In a real app, save/activate the user in DB here
              // const user = await db.user.create({ ... })
              return {
                id: decoded.email, // using email as ID for mock
                name: decoded.name,
                email: decoded.email,
              };
            }
          } catch (e) {
            console.error("Invalid token during login", e);
            return null;
          }
        }

        // 2. Standard Email/Password login
        if (!credentials?.email || !credentials?.password) return null;
        
        // For development/mock purposes:
        if (credentials.email === "test@test.com" && credentials.password === "test") {
            return { id: "1", name: "Test User", email: "test@test.com" };
        }

        // In a real app, fetch user from DB here:
        // const user = await db.user.findUnique({ where: { email: credentials.email } });
        // if (user && await bcrypt.compare(credentials.password, user.password)) {
        //   return { id: user.id, name: user.name, email: user.email };
        // }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_mode_only_123456_do_not_use_in_prod",
});

export { handler as GET, handler as POST };
