import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import fs from 'fs'
import path from 'path'

const tokensFile = path.join(process.cwd(), 'data', 'tokens.json')

function readTokens() {
  try { return JSON.parse(fs.readFileSync(tokensFile, 'utf8')) } catch (e) { return {tokens:{}} }
}
function writeTokens(obj) { fs.writeFileSync(tokensFile, JSON.stringify(obj, null, 2)) }

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPass = process.env.ADMIN_PASSWORD
        if (credentials.email === adminEmail && credentials.password === adminPass) {
          return { id: 1, name: 'Admin', email: adminEmail }
        }
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // When signing in with Google, persist the tokens in a simple file (demo only)
      if (account && account.provider === 'google') {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : null

        // persist tokens by email
        try {
          const tokens = readTokens()
          tokens.tokens = tokens.tokens || {}
          tokens.tokens[profile.email] = {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            scope: account.scope,
            token_type: account.token_type,
            expires_at: account.expires_at
          }
          writeTokens(tokens)
        } catch (e) {
          console.error('Failed to write tokens file', e)
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.expires = token.accessTokenExpires
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' }
}

export default NextAuth(authOptions)
