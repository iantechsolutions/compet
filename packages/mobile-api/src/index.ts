import type { User } from 'auth-helpers'
import { Hono } from 'hono'


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

export const appv1 = new Hono()

appv1.get('/user/info', (c) => {
    const user = c.get('user')

    return c.json({ user })
})

// appv1.get('/productos', (c) => {
//     const productos = c.get('productos') 
//     console.log("productosget")
//     console.log(c.get('productos'))
    
//     console.log("productos")
//     console.log(productos)
//     return c.json(productos)
// });


// appv1.post('/productos', async (c) => {
//     const body = await c.req.parseBody();
//     const file = body['file']
    
// });
