import { type User, getServerAuthSession, getUserFromAccessToken } from 'auth-helpers'
import { Context, Hono } from 'hono'
import { appv1 } from 'mobile-api'
import { api } from '~/trpc/server'
import { createRouteHandler } from "uploadthing/server";
import { utapi } from '~/server/uploadthing';
import { UploadthingComponentProps } from '@uploadthing/react';
import { error } from 'console';
import { Description } from '@radix-ui/react-dialog';
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

app.route('/', appv1)

appv1.post('/productos', async (c) => {
    const body = await c.req.parseBody();
    const file = body['file']
    
    return c.json({body})
});
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
    const clients = await api.clientes.get({
        clienteId: parseInt(Id)
    });
    return c.json({clients})
});

app.delete('/clientes/delete/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
    const clientes = await api.clientes.delete({
        Id
    });
    return c.text("Succefuled delete")
});
app.put('/clientes/update/:Id', async (c) => {
   
    const db = await api.clientes.get({
        clienteId: parseInt(c.req.param('Id'))
    });
    if(db?.Nombre != undefined && db.Direccion != undefined)
        {
    await api.clientes.update({
        name: db.Nombre,
        direccion: db.Direccion,
        Id: db.Id
        })
        return c.json(db)
    }
});

app.post('/clientes/post', async (c) => {
    const result = await api.clientes.create({
        Nombre: "1",
        Direccion: '1'
    });
    return c.json("Succesful")
});


app.get('/productos', async (c) =>{
    const productos = await api.productos.list();
    return c.json({productos})
})
app.get('/productos/:Id', async (c) =>{
    const Id = parseInt(c.req.param('Id'))
    const products = await api.productos.get({
        Id: Id,
    });
    return c.json({products})
});
app.delete('/productos/delete/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
     await api.productos.delete({
        Id
    });
    return c.json("Succefuled delete")
});

app.put('/productos/update/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
    const db = await api.productos.get({
        Id: Id
    });
    if(db?.Nombre != undefined && db.Descripcion != undefined && db.Codigo_de_barras != null)
        {
    await api.productos.update({
        Id: db.Id,
        name: db.Nombre,
        description: db.Descripcion,
        barcode: db.Codigo_de_barras
    })
        return c.json(db)
    }
});

app.post('/productos/post', async (c) => {
    const result = await api.productos.create({
        name: '1',
        description: '1',
        barcode: '1'
    });
    return c.json("Succesful")
});


app.get('/pedidos', async (c) =>{
    const pedidos = await api.pedidos.list();
    return c.json({pedidos})
})
app.get('/pedidos/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const pedidos = await api.pedidos.get({
        Id: parseInt(Id)
    });
    return c.json({pedidos})
});


app.delete('/pedidos/delete/:Id', async (c) => {
    const Id = c.req.param('Id');
    const pedidos = await api.pedidos.delete({
        Id: parseInt(Id)
    });
    return c.text("Succefuled delete")
});

app.put('/pedidos/update/:Id', async (c) => {
   
    const db = await api.pedidos.get({
        Id: parseInt(c.req.param('Id'))
    });
    if(db?.cliente != null  && db.Fecha_de_creacion != null && db.Estado != undefined)
        {
    await api.pedidos.update({
        Id: db.Id,
        Cliente: db.Cliente,
        FechaCreacion: db.Fecha_de_creacion.getTime(),
        Estado: db.Estado,

    })
        return c.json(db)
    }
});

app.post('/pedidos/post', async (c) => {
    const result = await api.pedidos.create({
        Cliente: 1,
        FechaCreacion: 0,
        Estado: '1'
    });
    return c.json("Succesful")
});



app.get('/instalaciones', async (c) =>{
    const instalaciones = await api.instalaciones.list();
    return c.json({instalaciones})
})
app.get('/instalaciones/:Id', async (c) =>{
    const Id = parseInt(c.req.param('Id'))
    const instalaciones = await api.instalaciones.get({
        Id: Id,
    });
    return c.json({instalaciones})
});
app.delete('/instalaciones/delete/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
    const instalaciones = await api.instalaciones.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/instalaciones/update/:Id', async (c) => {
   
    const db = await api.instalaciones.get({
        Id: parseInt(c.req.param('Id'))
    });
    if(db?.Empalmista != null  && db.Fecha_de_alta != null && db.Fecha_de_verificacion != undefined && db.Fecha_de_instalacion != undefined)
        {
    await api.instalaciones.update({
        Id: db.Id,
        Cliente: db.Cliente,
        Empalmista: db.Empalmista,
        Pedido: db.Pedido,
        Estado: db.Estado,
        tipoInstalacion: db.tipoInstalacion,
        FechaAlta: db.Fecha_de_alta,
        FechaVeri: db.Fecha_de_verificacion,
        FechaInst: db.Fecha_de_instalacion
    })
        return c.json(db)
    }
});

app.post('/instalaciones/post', async (c) => {
    const result = await api.instalaciones.create({
        Cliente: 1,
        Empalmista: 1,
        Pedido: 1,
        Estado: 0,
        FechaAlta: 0,
        FechaInst: 0,
        FechaVeri: 0,
        tipoInstalacion: 1
    });
    return c.json("Succesful")
});


app.get('/fotos', async (c) =>{
    const fotos = await api.fotos.list();
    return c.json({fotos})
})
app.get('/fotos/:Id', async (c) =>{
    const Id = parseInt(c.req.param('Id'))
    const fotos = await api.fotos.get({
        Id: Id,
    });
    return c.json({fotos})
});

app.delete('/fotos/delete/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
    const fotos = await api.fotos.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/fotos/update/:Id', async (c) => {
   
    const db = await api.fotos.get({
        Id: parseInt(c.req.param('Id'))
    });
    if(db?.Instalacion != null  && db.Link != null)
        {
    await api.fotos.update({
        Id: db.Id,
        Link: db.Link,
        Instalacion: db.Instalacion
    })
        return c.json(db)
    }
});

app.post('/fotos/post', async (c) => {
    const result = await api.fotos.create({
        Link: "",
        Instalacion: 0
    });
    return c.json("Succesful")
});

app.get('/empalmistas', async (c) =>{
    const empalmistas = await api.empalmistas.list();
    return c.json({empalmistas})
})
app.get('/empalmistas/:Id', async (c) =>{
    const Id = parseInt(c.req.param('Id'))
    const empalmistas = await api.empalmistas.get({
        Id: Id,
    });
    return c.json({empalmistas})
});

app.delete('/empalmistas/delete/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
    const empalmistas = await api.empalmistas.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/empalmistas/update/:Id', async (c) => {
   
    const db = await api.empalmistas.get({
        Id: parseInt(c.req.param('Id'))
    });
    if(db?.Nombre != null)
        {
    await api.empalmistas.update({
        Id: db.Id,
        name: db.Nombre
        
    })
        return c.json(db)
    }
});

app.post('/empalmistas/post', async (c) => {
    const result = await api.empalmistas.create({
        name: ""
    });
    return c.json("Succesful")
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
    const Id = parseInt(c.req.param('Id'))
    const tipoInstalaciones = await api.tipoInstalaciones.get({
        Id: Id,
    });
    return c.json({tipoInstalaciones})
});
app.delete('/tipoInstalaciones/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
    const tipoInstalaciones = await api.tipoInstalaciones.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/tipoInstalaciones/:Id', async (c) => {
   
    const db = await api.tipoInstalaciones.get({
        Id: parseInt(c.req.param('Id'))
    });
    if(db?.description != null)
        {
    await api.tipoInstalaciones.update({
        Id: db.Id,
        description: db.description,
        pasoCritico: db.pasoCritico
    })
        return c.json(db)
    }
});

app.post('/tipoInstalaciones', async (c) => {
    const result = await api.tipoInstalaciones.create({
        description: "",
        pasoCritico: 1
        });
    return c.json("Succesful")
});



app.get('/pasocritico', async (c) =>{
    const pasoCritico = await api.pasoCritico.list();
    return c.json({pasoCritico})
})
app.get('/pasocritico/:Id', async (c) =>{
    const Id = parseInt(c.req.param('Id'))
    const pasoCritico = await api.pasoCritico.get({
        Id: Id,
    });
    return c.json({pasoCritico})
});
app.delete('/pasoCritico/delete/:Id', async (c) => {
    const Id = parseInt(c.req.param('Id'))
    const pasoCritico = await api.pasoCritico.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/pasoCritico/update/:Id', async (c) => {
   
    const db = await api.pasoCritico.get({
        Id: parseInt(c.req.param('Id'))
    });
    if(db?.description != null && db?.useCamera != null)
        {
    await api.pasoCritico.update({
        Id: db.Id,
        description: db.description,
        detalle: db.detalle,
        useCamera: db.useCamera
    })
        return c.json(db)
    }
});

app.post('/pasoCritico/post', async (c) => {
    const result = await api.pasoCritico.create({
        description: "",
        detalle: "",
        useCamera: true
        });
    return c.json("Succesful")
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
