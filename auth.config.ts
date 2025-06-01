import Credentials from "@auth/core/providers/credentials";
import { defineConfig } from "auth-astro";
import { strapiAPI } from "./src/lib/api";

interface StrapiAuthResponse {
  data: {
    jwt: string;
    user: {
      id: number;
      email: string;
      username: string;
    };
  };
}

declare module "@auth/core/types" {
  interface Session {
    jwt?: string;
  }
}

export default defineConfig({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Partial<Record<"identifier" | "password", unknown>>,
        request: Request
      ) => {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Las credenciales son obligatorias");
        }

        console.log("credentials", credentials);

        const response = await strapiAPI.post<StrapiAuthResponse>(
          "/auth/local",
          {
            identifier: credentials.identifier,
            password: credentials.password,
          }
        );

        if (response.data?.jwt) {
          return {
            id: response.data.user.id.toString(),
            email: response.data.user.email,
            name: response.data.user.username,
            jwt: response.data.jwt,
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Si hay user (primer login), pásale el jwt al token
      if (user && "jwt" in user) {
        token.jwt = user.jwt;
      }
      return token;
    },

    async session({ session, token }) {
      // Exponer el JWT en la sesión para usarlo en llamadas a la API
      if (token?.jwt) {
        session.jwt = token.jwt as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
