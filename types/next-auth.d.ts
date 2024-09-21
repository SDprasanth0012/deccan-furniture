// types/next-auth.d.ts

import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    firstname?: string;
    lastname?: string;
  }

  interface Session {
    user: User;
  }

  interface Token {
    role?: string;
  }
}
