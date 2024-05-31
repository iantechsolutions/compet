import { createRouteHandler } from "uploadthing/server";

import { ourFileRouter } from "./core";
import { Hono } from "hono";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

const app = new Hono();


const ut = new Hono()
  .get("/", (context) => GET(context.req.raw))
  .post("/", (context) => POST(context.req.raw));
 
app.route("/api/uploadthing", ut);
 
export default app;