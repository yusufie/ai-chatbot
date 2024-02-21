import { type NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { Adapter } from 'next-auth/adapters'
import clientPromise from "@/utils/clientPromise";

import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
// import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";

// import { sendVerificationRequest } from "@/lib/emailVerificationRequest";

import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
/*      EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: process.env.EMAIL_SERVER_PORT as string as unknown as number,
        auth: {
          user: process.env.EMAIL_SERVER_USER as string,
          pass: process.env.EMAIL_SERVER_PASSWORD as string,
        }
      },
      from: process.env.EMAIL_FROM as string,
      sendVerificationRequest,
    }), */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        profile(profile) {
          return {
              id: profile.sub,
              name: profile.name,
              username: "@" + profile.email.split("@")[0],
              slug: slugify(profile.email.split("@")[0] + `-${uuidv4().slice(0, 4)}`, { lower: true }),
              email: profile.email,
              image: profile.picture,
              role: profile.role || "user",
          };
        }
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
      version: "2.0", // opt-in to Twitter OAuth 2.0
        profile(profile) {
          return {
            id: profile.data.id, 
            name: profile.data.name,
            username: "@" + profile.data.username,
            slug: slugify(profile.data.name + `-${uuidv4().slice(0, 4)}`, { lower: true }),
            email: profile.data.email, 
            image: profile.data.profile_image_url,
            role: profile.role || "user",
          };
        }
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        profile(profile) {
          console.log(profile);
          return {
              id: profile.id,
              name: profile.username,
              username: "@" + profile.username,
              slug: slugify(profile.username + `-${uuidv4().slice(0, 4)}`, { lower: true }),
              email: profile.email,
              image: profile.avatar,
              role: profile.role || "user",
          };
        }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
        profile(profile) {
          return {
              id: profile.id,
              name: profile.login,
              username: "@" + profile.login,
              slug: slugify(profile.login + `-${uuidv4().slice(0, 4)}`, { lower: true }),
              email: profile.email,
              image: profile.avatar_url,
              role: profile.role || "user",
          };
        }
    })
  ],

  pages: {
    signIn: '/auth/login',  // Displays signin options
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/register', // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user }:any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.slug = user.slug;
        session.user.role = user.role || "user";
      }
      return session;
    },
  },

};

export default authOptions;
