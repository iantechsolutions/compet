import { type User, getServerAuthSession, getUserFromAccessToken } from 'auth-helpers'
import { Hono } from 'hono'
import { appv1 } from 'mobile-api'
import { api } from '~/trpc/server'
import { createRouteHandler } from "uploadthing/server";
import { utapi } from '~/server/uploadthing';
export const runtime = 'edge'

const app = new Hono().basePath('/api/app/v1')

declare module 'hono' {
    interface ContextVariableMap {
        user: User,
        productos: {
            Id: number;
            Nombre: string;
            Codigo_de_barras: string | null;
            Descripcion: string | null;
        }[]
    }
}

app.use(async (c, next) => {
    console.log("llega")
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

    next()
})

app.use(async (c,next) => {
    console.log("llega");
    const products = await api.productos.list();
    console.log(products)
    c.set('productos',products);
    next()
})




app.route('/', appv1)


app.route('/upload', {
    post: async (c) => {
        const input = c.req.body;
        if (!input.imagedata || !input.fileName) {
            return c.json({ error: 'Missing image data or file name' }, 400);
        }

        const uploaded = await utapi.uploadFiles(
            new File([input.imagedata], input.fileName, { type: "image/png" }),
        );

        if (!uploaded) {
            return c.json({ error: 'Failed to upload image' }, 500);
        }

        return c.json({ message: 'Image uploaded successfully', data: uploaded }, 200);
    }
});




export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
export const PATCH = app.fetch
