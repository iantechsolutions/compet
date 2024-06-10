import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge'
import { NextRequest, NextFetchEvent } from 'next/server'

const middleware = withMiddlewareAuthRequired()

export default function(req: NextRequest, res: NextFetchEvent) {
    // Check if the current route starts with the exception route.
    if (req.url.startsWith('https://compet-tracc.vercel.app/api/')) {
        // If it does, bypass the middleware
        return 
    }
    
    // Otherwise, apply the middleware
    return middleware(req, res)
}

export const config = {
    matcher: ['/:path*'],
}