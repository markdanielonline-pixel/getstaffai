import NextAuth from "next-auth"
import Authentik from "next-auth/providers/authentik"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Authentik({
      clientId: process.env.AUTHENTIK_ID,
      clientSecret: process.env.AUTHENTIK_SECRET,
      issuer: process.env.AUTHENTIK_ISSUER, 
      // Example issuer: "https://auth.caribbeacon.com/application/o/staffai/"
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    },
  },
  pages: {
    signIn: '/portal/login',
  }
})
