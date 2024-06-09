import { createRouteHandler } from "uploadthing/server";

import { ourFileRouter } from "./core";
import { Hono } from "hono";
import { getServerAuthSession, getUserFromAccessToken } from "auth-helpers";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

const app = new Hono();

app.use(async (c, next) => {
  const authorizationHeader = c.req.header('Authorization')

  if (!authorizationHeader) {
      const sessionFromCookie = await getServerAuthSession()
      if (sessionFromCookie) {
          c.set('user', sessionFromCookie.user)
          return next()
      }

      return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = /Bearer (.*)/.exec(authorizationHeader)?.[1]

  if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
  }

  const user = await getUserFromAccessToken(token)

  if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('user', user)

  await next()
})

const ut = new Hono()
  .get("/", (context) => GET(context.req.raw))
  .post("/", (context) => POST(context.req.raw));
 
app.route("/api/app/uploadthing", ut);
 


export const PUT = app.fetch
export const DELETE = app.fetch
export const PATCH = app.fetch