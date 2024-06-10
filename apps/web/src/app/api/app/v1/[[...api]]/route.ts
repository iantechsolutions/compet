import { type User, getServerAuthSession, getUserFromAccessToken } from 'auth-helpers'
import { Context, Hono } from 'hono'
import { appv1 } from 'mobile-api'
import { api } from '~/trpc/server'
import * as fs from 'fs';
import * as path from 'path';
import { createRouteHandler } from "uploadthing/server";
import { utapi } from '~/server/uploadthing';
import { UploadthingComponentProps } from '@uploadthing/react';
import { error } from 'console';
import { Description } from '@radix-ui/react-dialog';
import { ConsoleLogWriter } from 'drizzle-orm';
import { get } from 'http';
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

app.route('/', appv1)






// appv1.post('/productos', async (c) => {
//     const body = await c.req.parseBody();
//     const file = body['file']
    
//     return c.json({body})
// });
// app.use(async (c,next) => {
//     console.log("llega");
//     const products = await api.productos.list();
//     c.set('productos',products);
//     next()
// })



app.get('/clientes', async (c) => {
    try {
        const clients = await api.clientes.list();
        return c.json({clients})
    } catch (error) {
        console.error(error);
        return c.status(500);
    }
});

app.get('/clientes/:Id', async (c) =>{
    const Id = c.req.param('Id');
    const clients = await api.clientes.get({
        clienteId: Id
    });
    return c.json({clients})
});

app.delete('/clientes/delete/:Id', async (c) => {
    const Id = c.req.param('Id')
    const clientes = await api.clientes.delete({
        Id
    });
    return c.text("Succefuled delete")
});
app.put('/clientes/update/:Id', async (c) => {
   
    const db = await api.clientes.get({
        clienteId: c.req.param('Id')
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
    console.log(productos);
    return c.json({productos})
})
app.get('/productos/:Id', async (c) =>{
    const Id = c.req.param('Id')
    const products = await api.productos.get({
        Id: Id,
    });
    return c.json({products})
});
app.delete('/productos/delete/:Id', async (c) => {
    const Id = c.req.param('Id')
     await api.productos.delete({
        Id
    });
    return c.json("Succefuled delete")
});

app.put('/productos/update/:Id', async (c) => {
    const Id = c.req.param('Id')
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
        barcode: "",
        description: "",
        categoria:  "",
        name: ""
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
        Id: Id
    });
    return c.json({pedidos})
});


app.delete('/pedidos/delete/:Id', async (c) => {
    const Id = c.req.param('Id');
    const pedidos = await api.pedidos.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/pedidos/update/:Id', async (c) => {
   
    const db = await api.pedidos.get({
        Id: c.req.param('Id')
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
        Cliente: "",
        FechaCreacion: 0,
        Estado: '1'
    });
    return c.json("Succesful")
});



app.get('/instalaciones', async (c) =>{
    const instalaciones = await api.instalaciones.list();
    return c.json({instalaciones})
})
app.get('/instalaciones/barcode/:barcode', async (c) =>{
    const barcode = c.req.param('barcode')
    const instalaciones = await api.instalaciones.getBarCode({
        barcode: barcode
    });
    return c.json({instalaciones})
});
app.delete('/instalaciones/delete/:Id', async (c) => {
    const Id = c.req.param('Id')
    const instalaciones = await api.instalaciones.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/instalaciones/update/:Id', async (c) => {
    const Id = c.req.param('Id'); // Step 1: Extract the Id from URL parameters.
    const body = await c.req.json(); // Step 2: Parse the request body.

    // Step 3: Check if the instalacion with the given Id exists.
    const db = await api.instalaciones.get({ Id });
    if (!db) {
        return c.json({ error: "Instalacion not found" }, 404);
    }

    // Step 4: Update the instalacion with new values.
    const updated = await api.instalaciones.update({
        Id: db.Id,
        Cliente: body.Cliente ?? db.Cliente,
        Empalmista: body.Empalmista ?? db.Empalmista,
        Pedido: body.Pedido ?? db.Pedido,
        Estado: body.Estado ?? db.Estado,
        Codigo_de_barras: body.Codigo_de_barras ?? db.Codigo_de_barras,
        Producto_pedido: body.Producto_pedido ?? db.Producto_pedido,
        tipoInstalacion: body.tipoInstalacion ?? db.tipoInstalacionId,
        FechaAlta: (body.Fecha_de_alta ? new Date(body.Fecha_de_alta).getTime() : db.Fecha_de_alta?.getTime()) ?? 0,
        FechaVeri: body.Fecha_de_verificacion ? new Date(body.Fecha_de_verificacion).getTime() : db.Fecha_de_verificacion?.getTime() ?? 0,
        FechaInst: body.Fecha_de_instalacion ? new Date(body.Fecha_de_instalacion).getTime() : db.Fecha_de_instalacion?.getTime() ?? 0,
    });

    // Step 5: Return a success response.
    return c.json(updated);
});

app.post('/instalaciones/post', async (c) => {
    const body = await c.req.json();
    console.log("body",body);
    const result = await api.instalaciones.create({
        Cliente: body.Cliente?.toString() ?? "",
        Empalmista: body.Empalmista?.toString() ?? "",
        Pedido: body.Pedido?.toString() ?? "",
        Estado: body.Estado?.toString() || "Pendiente",
        FechaAlta: parseInt(body.Fecha_de_alta?.toString() ?? "0"),
        Producto_pedido: body.Producto_pedido?.toString() ?? "",
        Codigo_de_barras: body.Codigo_de_barras?.toString() ?? "aa",
        // FechaInst: parseInt(body.FechaInst?.toString() ?? "0"),
        // FechaVeri: parseInt(body.FechaVeri?.toString() ?? "0"),
        tipoInstalacionId: body.tipoInstalacion?.toString() ?? "",
    });
    return c.json("Succesful")
});


app.get('/fotos', async (c) =>{
    const fotos = await api.fotos.list();
    return c.json({fotos})
})
app.get('/fotos/:Id', async (c) =>{
    const Id = c.req.param('Id')
    const fotos = await api.fotos.get({
        Id: Id,
    });
    return c.json({fotos})
});

app.delete('/fotos/delete/:Id', async (c) => {
    const Id = c.req.param('Id')
    const fotos = await api.fotos.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/fotos/update/:Id', async (c) => {
   
    const db = await api.fotos.get({
        Id: c.req.param('Id')
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
        Instalacion: ""
    });
    return c.json("Succesful")
});

app.get('/empalmistas', async (c) =>{
    const empalmistas = await api.empalmistas.list();
    return c.json({empalmistas})
})
app.get('/empalmistas/:Id', async (c) =>{
    const Id = c.req.param('Id')
    const empalmistas = await api.empalmistas.get({
        Id: Id,
    });
    return c.json({empalmistas})
});

app.delete('/empalmistas/delete/:Id', async (c) => {
    const Id = c.req.param('Id')
    const empalmistas = await api.empalmistas.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/empalmistas/update/:Id', async (c) => {
   
    const db = await api.empalmistas.get({
        Id: c.req.param('Id')
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
    const Id = c.req.param('Id')
    const tipoInstalaciones = await api.tipoInstalaciones.get({
        Id: Id,
    });
    return c.json({tipoInstalaciones})
});
app.delete('/tipoInstalaciones/:Id', async (c) => {
    const Id = c.req.param('Id')
    const tipoInstalaciones = await api.tipoInstalaciones.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/tipoInstalaciones/:Id', async (c) => {
   
    const db = await api.tipoInstalaciones.get({
        Id: c.req.param('Id')
    });
    if(db?.description != null)
        {
    await api.tipoInstalaciones.update({
        Id: db.id,
        description: db.description,
    })
        return c.json(db)
    }
});

app.post('/tipoInstalaciones', async (c) => {
    const result = await api.tipoInstalaciones.create({
        description: "",
        });
    return c.json("Succesful")
});



app.get('/pasocritico', async (c) =>{
    const pasoCritico = await api.pasoCritico.list();
    return c.json({pasoCritico})
})
app.get('/pasocritico/:Id', async (c) =>{
    const Id = c.req.param('Id')
    const pasoCritico = await api.pasoCritico.get({
        Id: Id,
    });
    return c.json({pasoCritico})
});
app.delete('/pasoCritico/delete/:Id', async (c) => {
    const Id = c.req.param('Id')
    const pasoCritico = await api.pasoCritico.delete({
        Id: Id
    });
    return c.text("Succefuled delete")
});

app.put('/pasoCritico/update/:Id', async (c) => {
   
    const db = await api.pasoCritico.get({
        Id: c.req.param('Id')
    });
    if(db?.description != null && db?.useCamera != null)
        {
    await api.pasoCritico.update({
        Id: db.id,
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


app.post('/instalaciones/upload',async (c)=>{
    const body = await c.req.json();
    console.log("FOTOS");
    // const uploaded = await api.uploadthing.upload({
    //     instalacionId: "",
    //     fileName: "test.png",
    //     imagedata: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3gAAABECAYAAADTPpcFAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACB8SURBVHhe7Z17yGVV+cf3aP0QZ9LGstIsG/GCpQ6pqV0YEyPU0go0hWHG6I8aLyA4hRkqkYIZGAjDSKDipUCngVDTkUi8UKiTFt6ovGYXC2o0Cy/1R/Pzs+Y8p/Xud5991rP25Zz3vN8Ps2efd5911n7Ws571rOtee8me+6zYvr3YXhT8/+Zp29o7imUbjimEEEIIIYQQQiwsdhqchRBCCCGEEEIscNTBE0IIIYQQQogZQR08IYQQQgghhJgR1METQgghhBBCiBlBHTwhhBBCCCGEmBHUwRNCCCGEEEKIGUEdPCGEEEIIIYSYEdTBE0IIIYQQQogZQR08IYQQQgghhJgR1METQgghhBBCiBlBHTwhhBBCCCGEmBHUwRNCCCGEEEKIGUEdPCGEEEIIIYSYEdTBE0IIIYQQQogZQR08IYQQQgghhJgR1METQgghhBBCiBlBHTwhhBBCCCGEmBHUwRNCCCGEEEKIGUEdPCGEEEIIIYSYEdTBE0IIIYQQQogZQR08IYQQQgghhJgRprqDd/DBBxff//73i6uuumpwRcRIP/VIP+0ifc42yl8hhBBiNpjqDt5vfvObcF65cmXxxS9+MXwW/yNHP/fee++8o026jt+D7KddpM/ZJid/L7jgglDG6RjmwH34rexpNllo+XvCCSc0sue2aVq+xGSRfxOTJOrgLQn/cmH091vf+lbxox/9aNiw5/N3vvOdYs899xyE8nP33XeH8/HHHx/O46AwcW8cYxn7Dic+K3j187vf/W54dEHX8QP29OUvf7m46aabhrY2Kk+9+hH1SJ/d8NGPfjTYcBNf2QZ95++XvvSl4qCDDgrnOqZFP8KH8nc26Tq/ps0ecuVJtX8huqCVGTyM/8orryw++clPhgJgDXw+H3PMMcUNN9wwCOln06ZNxd/+9rdQSLiPmItXP1/96leHRxd0HT9pZOBg7dq1xfve977B1dHIftpF+uwGGgDf+MY3iiOOOGJwZTL0nb9//OMf55xHMS36ET6Uv7NJ1/k1bfaQK0+q/QvRBY07eHTiLr744mLXXXctHnzwweK0004bNvDPOuusYNibN28ehM5jy5Yt4fy5z30unMVcFpN+dt999+K1114LtnbhhRcmzRTKftpF+pxt+sxf6glWeXQ1ICTmwsqHc889t7eZEeWvWMzI/sUkadzBO+ecc0LnjoY2IxyM/ho807FmzZriuuuuG1zJ4/bbbw+NemYDWQoq5rKY9PPII48UJ510UrC1Bx54YHC1HtlPu0ifs03f+XvXXXcNPomuoWN36qmnhlU1NDyVv0J0i+xfTIole+6zYvv2Ynux49/2YtuaO4plG44ZfD0elstRaWzcuDEs7/HAEiBm/7Zt21acf/75czqHZXim7sQTTwyjy1dcccXg6nx4zo7lRVXh7DsqtrjQIT8jm/vtt1/4PoaOa9XoC/IceeSRw5FQZirvueeeeZ1ZuycQhg4vzyoeddRRoWPMNXQXd1Zy5UnRTwzPrgFLa8dRTi9y8LxOXZ53HT+MytMyHv20YQ+j5B8lB+v76bSW48+xHyA+7nPAAQeEcPDoo4+G+1bpqSz/KHs2UvVp6SLc888/H2b4uQcdiMceeyws7Y7LfW56U/RvsnA/5CjDzAaNX/R03nnnDa7uwKufFP2bPOOoKj8p6TUI05U/sXDE89BDDwX9kd5R+QtxHhtV92minxT9x6Tq03zajTfeGNIKl156aXHGGWeEzWlI6yWXXDLcsMbSkGr/wC6mxAWEw9bQbdnWLG6PPfObL3zhC3P0X2c7QD1t6QPCX3/99WHZGvGU9d9H/npJtQeTyeyZ31h+bd26NfiiKrrwDxCXr3I5NT1ji+X7pNqzxV/On1gPdt+u86tJ/B79EybFH+bKk2r/YPfge8pxir15y6NYvOy8dLflcyzo9ZWri//bes3gr/Ewgwdf//rXw9nD6tWriw9+8INh2d1zzz1XPPPMM4Nv5vPSSy8Vn/3sZ4v3vve9xU9/+tNQAKo4+eSTi3e+850hrl/84heDqzuw737+85/PuRcFkrXVfIdj+Otf/1rQ6eT4y1/+MqzUDToTxx13XLF06dJQuAiHs6DAvfvd755zX5zOv//97xA36dxpp53C0ifSu/3NrvVee+0VfkdH2fDKA6n6icEhAM6hjnJ6X3/99ZDej3zkIyE9v/71rwch59J1/DAqT8t49NPUHurk/8QnPhEq9bJ97r///uE77vGTn/xkcDXPfmjYfeUrXyne8573FP/4xz+KP/3pTyEsMnGPskweezZS9Wnp+u9//xsqL36HPpF7n332CZXVj3/840HovPSm6h+df+YznxlWoE8++WS4buCP0BnpaaKfVP0jB8+REh+NvLe+9a3z7I0jtgfwlpcu/YnZMzKsWrUqxM1B3q1YsSLkL2Uz/r3lMfdHL6Sjyl/n6qep/dfp03waPPvssyHt2MEf/vCHYueddw72ydnS4rV/YObU9POWt7yleP/73x/uQdg4rTn2zG+Ig87LsmXLine9611BFtJKXNgzHVHLL+7JICz5wDXK4R577FF8+MMfDjqCsn/vOn+9eOwh9sOk/V//+tcwvz7wgQ+Eo0l7ADzy8Dc2VqWHr33ta+F88803hzgMjz1b/OX8qaqPus6vtvwhYer0n+oPc+VJtX+I/QMbW8X+ocrecsqjWLw0WqLJ6EMT7r///mCkFBqW3tXBiCjPXVHQTj/99MHV5pAGKyyMgjJjwAiOHeURFLa7pQJmtIVnDC0cz4MRx7HHHhscg8Hv+d7A6RCWa2effXa4RnhbKuOVx+hKPzgU0gsmNzLZc5U2ip1L1/Ebqfrx6r9r+b32w9nuycguaSAsZ2SirNnsAnjt2fDam400mz65F/Gja0ZTDW96vfq/7777wvnjH/94OBvEyb2AJYqGVz8e/TMLafFxHX74wx8Or9kR401vX/6EezCzavGfeeaZQWdcL//e8pjj4YcfHlydT45+vPafW363bNky1B2NMj4/8cQT4e+99947nGNS7R9i/SA3YZGbOMrbrXvt2UAH3Ifl7uQbs0f8hvRedtllg1BFmCnABviePDWZ/vznPw9CzKfL/PXitQcDXfO95RedCGAlQUyX/qEOsxnuG69m6LI+6jq/cuL36t/jD3PTm2r/Mdhb7D9H2VtOeRSLl1Z20cyFAkQFg1FTQMdhu3FSaLuAUaDYGVRx+OGHhzMVfOyISQtLbih8jA6N4umnnw5hgTQz4gT77rtvOMekyBPThX5WrVoVzjgUkxs2bNgQnCTpxWnm0nX8MV79pOi/T/lhnP2ccsop4UzjvLw8BZlYCh3L2cSePfpE1lge7nXnnXeGz9YQrWJcer36v+WWW8J17mmdRGAmGIgn9kVe/Xj176WJvXXpT8iXTdHyL3RonQ9mCPrCq/8uyu8uu+wy+PQ/cu0fCGudR2ZFY7z2XMXjjz9evPjiiyGeMpZ3zBLF8ZhtTDu55ZEGfRzelk1iDzGT8A/Yo3XUuG9M3/XRpGlSf3n9YZdgb7H/HGVvC708in5p1MGL14r3UVAowDQkuFd51DMX0oCzpSAxQ8DSL96vxghKlSNcvnx5OLNNP1Pn8WEjZ3UwVR/DCAxrpk2XXnliutCPTfvTAChjo1pVI9apdB1/TIp+vPrvU34YZz92r5dffjmcy5Qbe03s2WNvzHKUsbRUNYiNcen16p/0U/FD/K63Aw88MJxpGMV49ePVvxdveifpT1Lyt228+u+r/HrsH12zjCy2tVGdbK89x9h9rr766rB8FBvBVuIlXlyDcqcD21gI5JbHqs5uFX35B2adyCvKL89sWV6VO4l910eTxqv/Jv6wS1LtbaGXR9EvjWfwzCExGtIH9rzC0UcfHc5lRjnOOnCYTOkzCkSDBmeKc+A6Bb8KnAThq44XXnhhECqPHHmMcfpZ7KTop4n+Fyq59rwQ7e3WW28N57jRfNhhh4Vz1XI26LK8d82k/AnPl8Abb7wRzmI8LO+iscqSLRrk5BfHq6++OggxH489M8vHPZg9tPtQh2MbLPXCJsbNIIn5dO0faNiTVwy2WGfgqaeeCmfh0/9irN/F4qRxB48HzcGWhHQNIzBUSDi7qhGXug6ejX5UQaXGLkc2Q2AFnYLPunbD4udM+KqjjdGUVHnKjNNPFVQao+AhXqga9cMxQtVoYUzX8XtI1U+q/tuSv61RVbuXjeSOo6k9p+qTB8HLtNEByNE/eUvjGbtEZp7jwDdULWfz6ser/zKmk1Hk2luf/sQ49NBDw7luFsnLOP149d+X/0m1f/IGaIDGzweNe5Yt1Z5ZIsg9+J7GrT0Hhm2Uw8bEyz+h/HdbjMtfL03L4zj68g/kFfnGYUufWaZZrlv7ro/azq8y4+L36t/I9YddpzeVvsqjWNg07uCx9pcRJZwH2ztXGdoo46MgMZLIFHldJ6AMIy/AspIy7AAG7GQUx0mlZw5u3IYu8Morrww+zYWpf2C0NGfZUi6j5KmiTj8xVqHXbaLARjjAMx6x42MnMBoJ5D2NwCq6jj+XVP3EjNJ/rvxxBY+dtjUDftttt4UzDXK2jh5HG/acok/SGMePT7AZB56zyyVX/2yhDVTu9hxHVUfEqx+v/g12bwNmyup8YVvlpQt/YiA/DSZ0gA8YNSvqIVU/Xv335X+89h8vTUYu6rM6Uu0ZmO2gA0njtrzEr4zFsW7dunA22OChTVLz10tueUylL/8QQ8eEcoV9rl+/fnB1B33VR13ll5Eaf1vtsXH+sOv0ptJXeRSzQeP34AEFi9EkHAgwmogjARwZFQrT32VwcNZooEHgqUjpGHI/dk4qj9DQYbTOHCNfhLO/aazgIA1GPJEtljkOz3VGUmNY4kJFCvyGMMDvmNG0nZhwsLatNnoAuw8Ow8LF5MhTRZ1+jFj/dj/uwzMY8QO/5A0jW1DWJyPAoxoJXcQf6xQIR/hYX8TPCF0do/STo3+P/DTsePcVYaikeTaHsDxHY3Fw/Xvf+1747LUfoDyy/AoIy28M4jHbNVLtuY5x+kQvpJOto7mHpYe08iwE55zyAh79x5jM3JutrG3nxzJe/Xj1D7FdxL9h5ufaa6+d4xs96e3an1gZj2WO8xY7jssiuqGRZJA+GkyEtefUqvLaox+v/j36tAYlv+Ge/M1v6CyZLuxv8Ng/8JwV35ncJgv1lvnSKr1Cqj17oExefvnl4bPJhM6ZBaITAbE++8hfLx57iPPL8tCwvC/bT5f+ocqmwOQEs0XDY8+e+ii2ty7zCzzxe/Sf6w9T5fHav9fevOVRLG6i9+C92cN7E+978ID3qvzqV78K79XhHUAUFt4xwoHh4izid68YvPvjYx/7WHjvB41yK3Ap8A4hdhTiHj/72c8GV3fAe5fe9ra3FW9/+9vDO4R4JxMFgWcV2E0qZtWqVWE5Au8dMZkJj9y//OUvg7Msy0XBQ2bu8Y53vGP4W373+9//flgwDznkkOLzn/98+M4gDH/znpSq98XkyFNFnX4M3svCe1Z4F5Ldi3ThLOL84ve8T4bNABjpM3muueaa8JDyKLqIP9YpB++mAdMrB8uZyptzlBmlnxz9e+T/+9//Hhp57ALJPagweKHpHXfcUXzqU58KYWickQbi89oPoNsq++SgHPz2t78Nchip9lzHKH2ypMXep8TzXFRClEl0yEz6RRddNGyE5pQXyLVP5MU+0Tey2Oh6Ga9+vPoH/mZ5FY2B+DdLliwJHar4HWee9HbtT2iQch07tviJG51897vfDZ9jPv3pT4eGo4VF98DZrlXltUc/Xv179GkDEPbeTf7GtpG36p1lHvsH3k/H98iD3P/5z3/CrAyDknZv8w9lH5dqzx54vxq6RO+mR6794Ac/GPqreFOWPvLXi8ce4vwqy2j6j9MLXfqHKpsC8p7GPr+hLrFnZcFjz9yHuFPqo9jeuswv8MTv0X+uP0yVx2v/XnvzlkexuFmydPmeoWdns3ivrbvXPYM3CTBw2xq2jZHKWUP6qUf6aZdR+qwboZw0yMzINANSVOxNR51nGZWXPPq0/z7tmUcemHmkMcyrjoQQk0PlUVQx0ffgNYEGBg8bM+LV1w6eCwnppx7pp10Wmj5peFtjmBFede7qUXmZbvqyZ5aqsQzNZhfsFQ1CiP5ReRR1LNgZPCHE9DNNM3gsaWKUk0awgVzlZXJCtEWX9t+HPZv8VdDZ58XcKjtC9IPKo/CwYGfwhBDCA89a0BimEczGTxs3bgyNblWIYiEyCXsmbu63efNmNSaFmDAqj6IOzeAJIYQQQgghxIygGTwhhBBCCCGEmBHUwRNCCCGEEEKIGUFLNIUQQgghWoCNMHjZ9PLlyytf6u6Fl98Dcd1yyy3hvWtCCDEOzeCJWqis2HbbKhkhYnj/DrbBebFBuYhfoltFE/2kxC+mG/lPH7zLj3f48UJus//yy7ljxpUviyM+usJkZ5dDXnZ90EEHhZdRN4V4OOg0Xn311WFb/La44IILgk5kn4uDJvWRWHiog7dIYYttGh9USqIdrDGX0oiYNv3nysP7d2h82Ht4JolH/30xTfrpkoXuT+QPJw+6511+dI6WLl0adgfkePLJJwch5jOufFkcHF2zfv36IDsvm77xxhtDh6yNV2MQz2mnnVZs2bIl/L127dpWO3liPLPiH1LrI/nD2UAdvEUKBZyRxiOOOGJwRfTJtOk/Vx7evROfxVwWi34Wuj+RP5w855xzTnjtA2XlzDPPDJ0jjroljuPKl8XRRkerDhrD1rm79NJLi+uuu27wTTuw/f0VV1wROo5w6qmnqvHdI7PiH1LrI/nD2UAdPCFENjScWJbUdQNqoSL9CJHGhz70oXC+/fbbk9/nNS3l68QTTwzn++67r3jggQfC5y6g48hs5K677lqcfvrpg6tCpKH6aHGhDp4QLcMo7mLirrvuGnyaDqZN/9OmHyGmEZuR2rRpUzinMg3la+XKleF82223hXOXPPTQQ+F86KGHhrMQHlQfLR5a20WTh3WPPPLIoZNmCviee+6Zt1SBBzxZAwyEWbNmTViCcdRRR4VRKa5t3LhxOArmDW+U5WHU6+67755XeeTGD6xTvvjii4tt27YV559/fvKoYx0s9WBqnPX2zz//fFh7TxpotD722GPFlVdeOe8+V1111bCCIRwyUwmUdW9xj4M1/4b9Bv0RJyOVJs/WrVsrl8/wPc8I7LfffkPdGsQTjx7lpBdS7c3gPsh+wAEHhHyFRx99NNy3LYeHPVx++eXz0mjk6N/wpDdV/7nyxGXGQI8sISoT5y/5mGI/6PGMM84Y2jQyX3/99WHZCPet0g+M038uZXmwm8suu2y4+UMT/YA3fg85+ocU/9nEnlOx5ylZmsayNGAJnOmLNF1yySVzdhbs0h8a/DbFn9g90F+q//SSml7w2IOFJRx+ucy5554b8oR0n3feeYOr+Vhej7MXb/kyUuMHj78dp6cyxJlaP1Zx8MEHh81WoEnZAtKJDVTd1/RM2bN0e+wnxuNPTJby31DOw1x5UrC4x1GVBynpzcVbP6aWlybpFdNJKzN4TPlawcLYOFhLz8PAGHoMW/3yPRAGR4fB4EApoFyjs2R4w0NZHsJi4GeffXb4fUxO/MaqVatC5U6Yttcq4/yR94033gjycR/W+PMQepmXX345hOF49dVXQ1rRPQU75pVXXhmGwwEC6bRrdoyCyjyWBz1VOVBkRP/IUY4ffVfhSa/H3oCGCI4Lh4h+CE/e8jfXyzaRy7ilObn696Y3Vf+58liZ4UCPKZC/yDvOfqi8GDQhb5CJsHvssUewjXIlVaaLpVFV8uy9997FRRddNAgxH49+cuLPIVX/kOo/m/oTD+iHBhty44/xedwLGU855ZRBqB107Q9z/Umq//SSmt6YFHugo0q60HHVrnt0boEOXp/k+B8PXn9rvPTSS4NP9eTUjzF9vSbB/G3V/brwJy+88MLg0w7233//cEb3QAcEiKOMR55U2qqvR6U3h5z6MbW89OnPRT80nsHD8WNcGE48kmqGCDwwXTYsG4mhcrj55ptD44wCYaPWZ5111hzHkhqe+zKKDxdeeOGw0WejjRjuSSedFK7FeOUBS2MXM3gQj5wxasdsFo4rvl4FYb/5zW8Gx8jsY9WokY3q4IzqZrBGyWPXy/qMr1flexlver32Fo92lvWGTRx99NEjZ2hzID04ynHxperfm16v/o1UecrQ4KEyGzWCHudvbIuxnLH92GwE5ZBZLJMfuejwAxX3KFL1n0pTecbpp2n84/DqP9d/5trPOMwvW7z8TSODEX3TLbqrm0Fq0x96/Ums/xT/2QZ16fXag+V7Wcdx3cisVaqficHWmHUw0D+UG5HMTowqz+PKV4zZUl15ymnPmAxml3XEevb45zIpaUlhlOx0ROgwIV88K+m1H68/IV12T2Q75JBDgh2TTrtHbIteeXJJ9Q+5/jOVrusjoyt/Lvql8Qze4YcfHs4YTNwBwrBZYkcDvW526+mnnx4WAozVnPu+++4bzmXGhWdWDSgAFg42bNgQChfyUPhH4ZGHcBRWlnVaQWsL4osbD+j2zjvvDJ8p4HUQ9oknngifV6xYEc5NYSQnlscKPfocxXHHHRcaAimkptdrbza6/+CDD86JH7AJOuaxnTQFvbQZX5Py5dF/12A/cUNzlP3YrACDLHGZuuGGGwaf6mlb/03lGUfX8Rup+m/qPyfBLrvsMvhUTZv+MNef5PjPXFLSm2oPvFibfMcH03E0Tj755HDGTmK79bD77ruHRqQdRnyNg3B90bQ942Ga/HMM5ZvOCKCHKrryJ1wznTArZ3ZMGFY2wIsvvhjOManydE3X/rOv+kLMBo07eMuXLw9nRnsYfYkPG1Go45lnnhl82gGjSIxAWAEtMy48TgFGOQEwR1GFV56uqFruYbKVGzSMtjHiEuv+2GOPHXzbDjinFNATjR8cGSOhjPLedNNNYSSozrGlptdrb5bXLGOqIrdx0hfe9Obqv2tS7ccq5HIjOW5s9UnX8vSV3lT9N/Wf00CX/jDXn6TqP4ec9KbKQ3ro2MDxxx8fznDggQeGMw3ZXPBV1K12GPE1jj7r3pz2jEcH0+qfmSXDhpCHmS/kqxrEMLryJ3YNkIHn8rm22267DTt+VWWsy/LloWv/2Vd9IWaD1nbRxBkw2lN1lNdWi/ZgjTmVESOdOBBmHDl4FmNSUEGwPIG8RxYqDypHrlORtcFiszdPevvQvxDTyDT6wy7pI7233nprOMedxsMOOyyceaXBLJJTv/AsVApN/XM8k9oWdBywITpR1ll66qmnwrlPeIYOWOqIXv75z3+Gwd94Jrqq8ySEmE/jDp6NZHJmTW/V0efownPPPRfOVaMkOAxYCA6iqrKwh47NCYKNfFJhsFSUGUeOhx9+OFwfh8XZNowwkfc2A2oVFxUZzrtManq99mZ5bSNr08Y4/eeWL6/+ja7swUu5EdNFo8ZD1/JMS3qb+s9J20/X/nDa/EnT9KaAL6HzSOOfWSaeU6ND0GR55iSpWxaZ429thpF4U8ttrn8G+57OYVsQF3Jw8C4/YJlmna5S8PoT+2x6RLdc4/dW5h555JFwngTj/ENf7c++6otpaQ+IPBp38Fi6AIzuNd0hqA3uv//+cOaZgdhR8pArlRKjU20t+SB+nhNjiUVTR1iG+GJ9UoBtBJXnBMvES0uRiy1667DdutgUoG3Zq2DjizpS0+u1N3svEaOTPGA8LaTqv63yNU7/fdvDKGy507p168LZYEOCSdC1PNOW3lz/OS32Y3TlD6fVn3jT64VXBAAdAHtOzbM0cRqwzmjdC8Jz/a3poryjayrj/HMMNgqPP/54OLcNHU90RXlfv3794Goeuf6EMmj5xTl+TGMSgwqp/qHr9mdf9cW0+XORRyvvwWOZiI0kYsC21hiDfvbZZ4db1WLwtmsWFSQQlt9gUBbO8IY3GA1jJAwYmUIOGz2JdzLLjd+ggmdHIuCebXQcGSFlqYYt3WCHTuQx+XButssX2G5HpndLK8s/TDbCsjVzvG6bDpTtUmm/BWbSrr322mFaYnkYbYyxytDyHiy86RFi/XOdkWbDm15ItTeDipplTBCHB+4Ty98XqfoHT3q9+jdS5UGX1sAAvrfK2J6jjMuO134ok7YLmcnBPRj1pNKEPvPLK49XP12n16t/wJel+M8Yjz17MBmRiTj429Ji/jdOW9f+EDz+JEf/HrzpbSIPg5nET3xLly5ttAtkFSn68JavmLi+RlfoDF2xS2e8QYfH3xq2+ybh6RSNWrWU658Nsz1+24b+q8oQmJxgZQ+69icWv+mde1RdM3LkycHjHzzp9dJ1fWR05c9Fv7TyDB7GgVHb6AIVDocZtRHvmmUQhr/32muvwZX/4Q1vUOCp4DBKwvIbChoyxoUrN36D0Roz/i6WDVDxMHKFPNyH5wLKnR3el8V1IBzhSTujcAYFurwTGRUQLwwu5xkVNw8058LSBOQzPXKY/pFr1DsFISW9kGpvBnleFZ6DvMOZ9Y1H/5705uo/VR5syb7j4O/y9ZSyMwoaoaTVKkbioyJi17BJUCePVXoxXv144++DVP8Z05U/8dKHP5wmf5Kb3hx4DyEQHxuvlP1yH8TliIO/y9dH+R90QqOfusX8IwOKy5YtG4TYgbd+ATqIhKcMf/vb3w4djyqa1I/MAtnAAp3tLvVPAx6ZYPXq1eGcS44/QY90PMA6E1yLH9foE49/yElvKt76Mbe8TIs/F81oZQZPtEfdiNQsstjSK/KIR8jbeK+REMIHjUJmAmmw0sjUKP5c0A/vJqMhDPgqOsXl2REvNktr0EltGqeYLVQ/iipa20VTCCHahtkQlpnYUmrbsl0I0R8MxFnnjg6GOnfzYUaNQUqW4THzwU6mTVYzGHTumA1ippaOtTp3wlD9KOrQDN6UoRk8sZgxe6iCRg5LmCaxNEyIxQbP+zArQKfOwE+zLFRlUIj+Uf0oPAxn8JYMzkIIMS1QWdGo3Lx5syovIXqE5/bs+SFmjzZu3BgG4VQGhZgOVD+KOoYzeGEOTzN4QgghhBBCCLFg0TN4QgghhBBCCDEjqIMnhBBCCCGEEDNBUfw/zenE3ap4hXsAAAAASUVORK5CYII=',
    // })
    const uploaded = await api.uploadthing.upload({
        fileName: body.Instalacion+".png",
        imagedata: 'data:image/png;base64,' + body.Link,
    })
    console.log("uploaded");
    console.log(uploaded);
    console.log(body.instalacion);
    const foto = await api.fotos.create({
        Instalacion: body.Instalacion,
        Link: uploaded.data?.url ?? "error"
    })
    console.log(foto);
    console.log(uploaded.data)
    return c.json("Succesful");
});

app.route('/', appv1)

 



export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
export const PATCH = app.fetch
