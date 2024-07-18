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
import { useState, useEffect, useRef } from "react";
import GoogleMaps from "~/components/maps-widget";

const dateToDMY = (date: Date | null | undefined) => {
    if (date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } else {
        return "No hay fecha";
    }
}

export default function Page() {
    const router = useRouter();
    const pathname = usePathname().split('/').pop();
    const { data: instalacion, isLoading } = api.instalaciones.get.useQuery({ Id: pathname?.toString()! });
    const { mutateAsync: updateInstalacion } = api.instalaciones.update.useMutation();    
    const [comment, setComment] = useState(instalacion?.Comentario);
    useEffect(()=>{
        if(instalacion && instalacion?.Estado === "Aprobada" || instalacion?.Estado === "Rechazada"){
            setComment(instalacion?.Comentario)
        }
    },[instalacion]);
    const handleUpdate = (estado: string) => {
        updateInstalacion({
            Id: pathname?.toString()!,
            Estado: estado,
            Cliente: instalacion?.Cliente ?? "",
            Empalmista: instalacion?.Empalmista ?? "",
            FechaAlta: instalacion?.Fecha_de_alta?.getTime() ?? 0,
            FechaVeri: Date.now(),
            FechaInst: Date.now(),
            Pedido: instalacion?.Pedido ?? "",
            Producto_pedido: instalacion?.Producto_pedido ?? "",
            tipoInstalacion: instalacion?.tipoInstalacionId ?? "",
            Codigo_de_barras: instalacion?.Codigo_de_barras ?? "",
            Comentario: comment ?? "",
            NroLoteArticulo: instalacion?.NroLoteArticulo ?? "",
        });
        toast.success(`Instalación ${estado.toLowerCase()} con éxito`);
        router.refresh();
    };

    const mapRef = useRef(null);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="mt-6 bg-white p-6 rounded shadow-md">
                <div className="grid grid-cols-3">
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Detalles de la Instalación</h1>
                            <p className="mb-2"><strong>Cliente:</strong> {instalacion?.cliente?.Nombre}</p>
                            <p className="mb-2"><strong>Nro de lote del articulo:</strong> {instalacion?.NroLoteArticulo}</p>
                            <p className="mb-2"><strong>Fecha de alta:</strong> {dateToDMY(instalacion?.Fecha_de_alta)}</p>
                            <p className="mb-2"><strong>Fecha de instalación:</strong> {dateToDMY(instalacion?.Fecha_de_instalacion)}</p>
                            <p className="mb-2"><strong>Fecha de verificación:</strong> {dateToDMY(instalacion?.Fecha_de_verificacion)}</p>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Detalles del Empalmista</h1>
                            <p className="mb-2"><strong>Nombre: </strong> {instalacion?.empalmista?.Nombre}</p>
                            <p className="mb-2"><strong>DNI: </strong> {instalacion?.empalmista?.DNI}</p>
                            <p className="mb-2"><strong>Fecha de nacimiento:</strong> {dateToDMY(instalacion?.empalmista?.BirthDate)}</p>
                        </div>
                        <div>
                            
                        {instalacion?.Codigo_de_barras && (
                            <div className="flex flex-col justify-center mr-48">
                                <h1 className="text-2xl font-bold mb-4">Codigo QR</h1>
                                <div className="p-3 flex flex-col items-center mt-6">
                                    <BarcodeComponent key={instalacion?.Id} id={instalacion?.Codigo_de_barras} />
                                </div>
                            </div>
                        )}
                        </div>
                    {/* </div>
                    <div>
                        <div id="map" ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
                    </div> */}
                </div>
                <h2 className="text-xl font-bold mb-4">Informacion del producto</h2>
                <div className="">
                    <p className="mb-2"><strong>Nombre:</strong> {instalacion?.productoPedido?.Nombre}</p>
                    <p className="mb-2"><strong>Descripcion:</strong> {instalacion?.productoPedido?.Descripcion}</p>
                    { instalacion?.productoPedido?.tipoInstalacion && 
                    <>
                    <p className="mb-2"><strong>Categoria:</strong> {instalacion?.tipoInstalacion?.description}</p>
                    <p className="mb-2"><strong>Pasos:</strong></p>
                    <ul>
                        {instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion?.map((e) => (
                            <li key={e.pasoCriticoData?.id}>-{e.pasoCriticoData?.description}</li>
                        ))}
                    </ul>
                    </>
                    }
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
                
                {instalacion?.lat && instalacion?.long && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-4">Ubicación de finalización de la instalación</h2>
                        <GoogleMaps lat={instalacion?.lat} lng={instalacion?.long} zoom={18} />
                    </div>
                )}
                {instalacion?.Estado === "Aprobada" || instalacion?.Estado === "Rechazada" ? (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">Comentario</h2>
                        <textarea
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Añadir comentario..."
                            disabled={true}
                            value={comment ?? ""}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                ) : null}
                {instalacion?.Estado === "Completada" && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">Comentario</h2>
                        <textarea
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Añadir comentario..."
                            value={comment ?? ""}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex space-x-4">
                            <Button onClick={() => handleUpdate("Aprobada")} className="bg-green-500 hover:bg-green-600 text-white">
                                Aprobar
                            </Button>
                            <Button onClick={() => handleUpdate("Rechazada")} className="bg-red-500 hover:bg-red-600 text-white">
                                Rechazar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
