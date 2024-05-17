// import { type AfterCallbackAppRoute, handleAuth, handleCallback } from '@auth0/nextjs-auth0/edge'
import { AfterCallbackAppRoute } from '@auth0/nextjs-auth0/edge'
import { handleAuth } from '@auth0/nextjs-auth0/edge'
import { handleCallback } from '@auth0/nextjs-auth0/edge'
// import initAuth0  from 'src/app/api/auth/[auth0]/utils/auth0'

import { db, schema } from '~/server/db'

const afterCallback: AfterCallbackAppRoute = async (_req, session, _state) => {
    try{
        await db.insert(schema.users).values({
            Id: session.user.sub,
            email: session.user.email,
            name: session.user.name,
            picture: session.user.picture,
        })
    }
    catch(e){
        console.log(e)   
    }
    return session
}

export const GET = handleAuth({
    callback: handleCallback({
        afterCallback,
    }),
})
