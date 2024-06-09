import { initAuth0 } from "@auth0/nextjs-auth0";

export default initAuth0({
    secret: 'LONG_RANDOM_VALUE',
    issuerBaseURL: 'https://your-tenant.auth0.com',
    baseURL: 'http://192.168.0.179:3000',
    clientID: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET'
  });