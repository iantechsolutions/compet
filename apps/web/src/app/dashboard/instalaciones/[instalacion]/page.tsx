"use client"
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Barcode } from "lucide-react";
import { Button } from "~/components/ui/button";
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
import { BarcodeComponent } from "~/components/barcodesvg";

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
    const pathname = usePathname().split('/')[usePathname().split('/').length - 1];
    const { data: instalacion, isLoading } = api.instalaciones.get.useQuery({ Id: pathname?.toString()! });
    const {mutateAsync: updateInstalacion} = api.instalaciones.update.useMutation();

    const approveInstalacion = () => {
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
        });
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
        });
        toast.success("Instalación rechazada con éxito");
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mt-6 bg-white p-6 rounded shadow-md">
                <div className="grid grid-cols-2">
<div>
<h1 className="text-2xl font-bold mb-4">Detalles de la Instalación</h1>
                <p className="mb-2"><strong>Cliente:</strong> {instalacion?.cliente.Nombre}</p>
                <p className="mb-2"><strong>Empalmista:</strong> {instalacion?.empalmista?.Nombre}</p>
                <p className="mb-2"><strong>Fecha de alta:</strong> {dateToDMY(instalacion?.Fecha_de_alta)}</p>
                <p className="mb-2"><strong>Fecha de instalación:</strong> {dateToDMY(undefined)}</p>
                <p className="mb-2"><strong>Fecha de verificación:</strong> {dateToDMY(undefined)}</p>
</div>
                    <div>
                    {instalacion?.Codigo_de_barras && (
                    <div className="mt-6 flex justify-center mr-48">
                        <div className="border border-black p-3 flex flex-col items-center">
                            <BarcodeComponent key={instalacion?.Id} id={instalacion?.Codigo_de_barras}/>
                        </div>
                    </div>
                )}
                    </div>
                </div>

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
                {instalacion?.Estado !== "Aprobada" && instalacion?.Estado !== "Rechazada" && (
                    <div className="mt-6 flex space-x-4">
                        <Button onClick={approveInstalacion} className="bg-green-500 hover:bg-green-600 text-white">
                            Aprobar
                        </Button>
                        <Button onClick={rejectInstalacion} className="bg-red-500 hover:bg-red-600 text-white">
                            Rechazar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
