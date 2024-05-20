import { type User, getServerAuthSession, getUserFromAccessToken } from 'auth-helpers'
import { Context, Hono } from 'hono'
import { appv1 } from 'mobile-api'
import { api } from '~/trpc/server'
import { createRouteHandler } from "uploadthing/server";
import { utapi } from '~/server/uploadthing';
import { UploadthingComponentProps } from '@uploadthing/react';
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

// app.use(async (c,next) => {
//     console.log("llega");
//     const products = await api.productos.list();
//     c.set('productos',products);
//     next()
// })

app.get('/clientes', async (c) =>{
    const clients = await api.clientes.list();
    return c.json({clients})
})
app.get('/clientes/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const products = await api.clientes.get({
        clienteId: Id,
    });
    return c.json({products})
});

app.get('/productos', async (c) =>{
    const productos = await api.productos.list();
    return c.json({productos})
})
app.get('/productos/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const products = await api.productos.get({
        Id: Id,
    });
    return c.json({products})
});

app.get('/pedidos', async (c) =>{
    const pedidos = await api.pedidos.list();
    return c.json({pedidos})
})
app.get('/pedidos/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const pedidos = await api.pedidos.get({
        Id: Id,
    });
    return c.json({pedidos})
});

app.get('/instalaciones', async (c) =>{
    const instalaciones = await api.instalaciones.list();
    return c.json({instalaciones})
})
app.get('/instalaciones/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const instalaciones = await api.instalaciones.get({
        Id: Id,
    });
    return c.json({instalaciones})
});
app.get('/fotos', async (c) =>{
    const fotos = await api.fotos.list();
    return c.json({fotos})
})
app.get('/fotos/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const fotos = await api.fotos.get({
        Id: Id,
    });
    return c.json({fotos})
});

app.get('/empalmistas', async (c) =>{
    const empalmistas = await api.empalmistas.list();
    return c.json({empalmistas})
})
app.get('/empalmistas/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const empalmistas = await api.empalmistas.get({
        Id: Id,
    });
    return c.json({empalmistas})
});


// app.get('/documentUploads', async (c) =>{
//     const documentUploads = await api.documentUploads.list();
//     return c.json({documentUploads})
// })
// app.get('/documentUploads/:Id', async (c) =>{
//     const Id = c.req.param('Id');
//     const documentUploads = await api.documentUploads.get({
//         Id: Id,
//     });
//     return c.json({documentUploads})
// });

app.get('/tipoinstalaciones', async (c) =>{
    const tipoInstalaciones = await api.tipoInstalaciones.list();
    return c.json({tipoInstalaciones})
})
app.get('/tipoinstalaciones/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const tipoInstalaciones = await api.tipoInstalaciones.get({
        Id: Id,
    });
    return c.json({tipoInstalaciones})
});

app.get('/pasocritico', async (c) =>{
    const pasoCritico = await api.pasoCritico.list();
    return c.json({pasoCritico})
})
app.get('/pasocritico/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const pasoCritico = await api.pasoCritico.get({
        Id: Id,
    });
    return c.json({pasoCritico})
});

app.route('/', appv1)



    app.post( async (request: any, reply: any) => {
        const input = request.body;
        if (!input.imagedata || !input.fileName) {
            return reply.json({ error: 'Missing image data or file name' }, 400);
        }

        const uploaded = await utapi.uploadFiles(
            new File([input.imagedata], input.fileName, { type: "image/png" }),
        );

        if (!uploaded) {
            return reply.json({ error: 'Failed to upload image' }, 500);
        }

        return reply.json({ message: 'Image uploaded successfully', data: uploaded }, 200);
    }
    );




export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
export const PATCH = app.fetch
