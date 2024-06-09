"use client"
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
// import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
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

const dateToDMY = (date: Date | null | undefined) => {
    if (date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // Adjusted month +1
    } else {
        return "No hay fecha";
    }
}

export default function Page() {
    const router = useRouter();
    const goBack = () => {
        router.back();
    }
    // const navigate = useNavigate();
    const pathname = usePathname().split('/')[usePathname().split('/').length - 1];
    const { data: instalacion, isLoading } = api.instalaciones.get.useQuery({ Id: pathname?.toString()! });
    const {mutateAsync: updateInstalacion} = api.instalaciones.update.useMutation();

    const approveInstalacion = () => {
        // Implement the logic to approve the instalacion
        console.log("Instalación aprobada");
        updateInstalacion({
            Id: pathname?.toString()!,
            Estado: "Aprobada",
            Cliente: instalacion?.Cliente ?? "",
            Empalmista: instalacion?.Empalmista ?? "",
            FechaAlta: instalacion?.Fecha_de_alta?.getTime() ?? 0,
            FechaVeri: Date.now(),
            FechaInst: Date.now(),
            Pedido: instalacion?.Pedido ?? "",
            Producto_pedido: instalacion?.Producto_pedido ?? "",
            tipoInstalacion: instalacion?.tipoInstalacionId ?? "", 
            Codigo_de_barras: instalacion?.Codigo_de_barras ?? "",
        })
        // navigate('/dashboard/instalaciones'); // Navigate after operation
        toast.success("Instalación aprobada con éxito");

    };

    const rejectInstalacion = () => {
        updateInstalacion({
            Id: pathname?.toString()!,
            Estado: "Rechazada",
            Cliente: instalacion?.Cliente ?? "",
            Empalmista: instalacion?.Empalmista ?? "",
            FechaAlta: instalacion?.Fecha_de_alta?.getTime() ?? 0,
            FechaVeri: Date.now(),
            FechaInst: Date.now(),
            Pedido: instalacion?.Pedido ?? "",
            Producto_pedido: instalacion?.Producto_pedido ?? "",
            tipoInstalacion: instalacion?.tipoInstalacionId ?? "", 
            Codigo_de_barras: instalacion?.Codigo_de_barras ?? "",
        })
        console.log("Instalación rechazada");
        // navigate('/dashboard/instalaciones'); // Navigate after operation
        toast.success("Instalación rechazada con éxito");

    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mt-6 bg-white p-6 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4">Detalles de la Instalación</h1>
                <p className="mb-2"><strong>Cliente:</strong> {instalacion?.cliente.Nombre}</p>
                <p className="mb-2"><strong>Empalmista:</strong> {instalacion?.empalmista?.Nombre}</p>
                <p className="mb-2"><strong>Fecha de alta:</strong> {dateToDMY(instalacion?.Fecha_de_alta)}</p>
                <p className="mb-2"><strong>Fecha de instalación:</strong> {dateToDMY(undefined)}</p>
                <p className="mb-2"><strong>Fecha de verificación:</strong> {dateToDMY(undefined)}</p>
                <p className="mb-4"><strong>Listado productos pedido:</strong> {instalacion?.pedido.Id}</p>

                <Table className="w-full mb-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre del producto</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Cantidad del pedido</TableHead>
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

                <h2 className="text-xl font-bold mb-4">Imágenes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {instalacion?.fotos?.map((e) => (
                        <img
                            key={e.Link}
                            src={e.Link ?? ""}
                            alt="Instalación"
                            className="w-full h-48 object-cover rounded"
                        />
                    ))}
                </div>
                <div className="mt-6 flex space-x-4">
                    <Button onClick={approveInstalacion} className="bg-green-500 hover:bg-green-600 text-white">
                        Aprobar
                    </Button>
                    <Button onClick={rejectInstalacion} className="bg-red-500 hover:bg-red-600 text-white">
                        Rechazar
                    </Button>
                </div>
            </div>
        </div>
    );
}
