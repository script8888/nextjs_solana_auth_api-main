import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import Moralis from "moralis";
// import db from "../../../../utils/db.js";
// import User from "../../../../models/User.js";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "MoralisAuth",
      credentials: {
        message: {
          label: "message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const { message, signature } = credentials;

          await Moralis.start({ apiKey: process.env.MORALIS_API });

          const { address, profileId, expirationTime } = (
            await Moralis.Auth.verify({
              message,
              signature,
              network: "solana",
            })
          ).raw;

          const user = {
            address,
            network,
            profileId,
            signature,
            expirationTime,
          };

          // await db.connect();

          return user;
        } catch (e) {
          console.error(e);
          console.log("error with login/ invalid login param");
          return null;
        }
      },
    }),
  ],

  //adding user info to the user session object
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token.user._id = user._id;
      return token;
    },
    async session({ session, token, user }) {
      if (token?._id) session.user._id = token._id;
      session.expires = token.user.expirationTime;
      // session.user.role = user.role //checks user object and assigns token based on user role
      return session;
    },
  },
});
