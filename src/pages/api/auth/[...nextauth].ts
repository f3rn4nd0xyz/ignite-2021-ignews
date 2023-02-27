import { query as q } from "faunadb";

import NextAuth, { Account, DefaultUser, Profile, Session, User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";

interface signInCallbackProps {
  user: User;
  account: Account | null;
  profile?: Profile;
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session }: any) {
      try {
        const userActiveSubscription = await fauna.query<string>(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session!.user!.email as q.ExprArg)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (e) {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn({ user, account, profile }: signInCallbackProps) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email!))
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email!)))
          )
        );

        return true;
      } catch (error) {
        return false;
      }
    },
  },
  database: process.env.DATABASE_URL,
};

export default NextAuth(authOptions);
