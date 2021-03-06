import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);
        const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken);
        return {
            ...token,
            accessToken: refreshedToken.access-token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
            refreshToken: refreshedToken.refresh_token && token.refreshToken
        }
    } catch (error) {
        console.error(error)
        return {
            ...token,
            error: "refreshAccessTokenError"
        }
        
    }
}
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL

    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
      signIn: "/login"
  },
  callbacks:{
      async jwt({token, account, user}){
        // initial signIn
        if(account && user){
            return{
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000, //we are hadling expiry times in millisecondes hence * 1000
            }
        }
        // refresh token ==>access token still valid
        // return previous toke if the acces token has not expired yet
        if(Date.now() < token.accessTokenExpires){
            console.log("EXISTING TOKEN IS VALID");
            return token;
        }

        // acces token has expired, so we need to refresh it
        console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING....");
        return await refreshAccessToken(token)

      },
      
      async session({session, token}){
          session.user.accessToken = await token.accessToken;
          session.user.refreshToken = await token.refreshToken;
          session.user.username = await token.username;
          return session;
      }
  }
})