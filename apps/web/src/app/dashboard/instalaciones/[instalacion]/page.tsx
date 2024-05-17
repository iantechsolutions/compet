"use client"
import { usePathname,useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table"

const dateToDMY = (date: Date | undefined) => {
    if(date){
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
    else{
        return "No hay fecha"
    }
}

export default function Page() {
    const router = useRouter();
    const goBack = () => {
        router.back();
    }
    const pathname = usePathname().split('/')[usePathname().split('/').length - 1];
    const {data:instalacion,isLoading} = api.instalaciones.get.useQuery({Id: parseInt(pathname?.toString()!)});
    console.log(instalacion);
    return (
        <div>
            <Button asChild variant="outline"><Link href={"/dashboard/instalaciones"}>{'<'}</Link></Button>
            <br/>
            <p>Cliente: {instalacion?.cliente.Nombre}</p>
            <p>Empalmista: {instalacion?.empalmista?.Nombre}</p>
            <p>Fecha de alta: {dateToDMY(instalacion?.Fecha_de_alta)}</p>
            <p>Fecha de instalacion: {dateToDMY(undefined)}</p>
            <p>Fecha de verificacion: {dateToDMY(undefined)}</p>
            <p>Listado productos pedido: {instalacion?.pedido.Id}</p>
            <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead>Nombre del producto</TableHead>
                          <TableHead>Descripcion</TableHead>
                          <TableHead>Cantidad</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {instalacion?.pedido.productos?.map((producto) => (
                              <TableRow key={producto.Id}>
                                  <TableCell>{producto.Nombre}</TableCell>
                                  <TableCell>{producto.Descripcion}</TableCell>
                                  <TableCell>{producto.Cantidad}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                    </Table>

        </div>
    )
}