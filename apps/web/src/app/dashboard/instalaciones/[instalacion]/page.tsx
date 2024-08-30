"use client"
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Barcode, Loader2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Select from 'react-select';
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "~/components/ui/dialog";
import { BarcodeComponent } from "~/components/barcodesvg";
import { useState, useEffect, useRef } from "react";
import GoogleMaps from "~/components/maps-widget";
import path from "path";
import { Label } from "~/components/ui/label";

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

    const { data: categorias } = api.tipoInstalaciones.list.useQuery();


    const { mutateAsync: deleteInstalacion, isPending: isDeleating } = api.instalaciones.delete.useMutation();
    const { mutateAsync: updateInstalacion, isPending: isUpdated } = api.instalaciones.update.useMutation();    
   
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)

    const [categoria, setCategoria] = useState("")

    const handleCategoriaChange = (value: any) => {
        setCategoria(value.value);
      };

    const opciones:readonly any[] = categorias?.map((categoria) => ({
        value: categoria.id,
        label: categoria.description || "",
      })) ?? [];

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

  

    async function handleUpdateTipo() {
    
       try{

           await updateInstalacion({
               Id: pathname?.toString()!,
               Cliente: instalacion?.Cliente ?? "",
               Empalmista: instalacion?.Empalmista ?? "",
               FechaAlta: instalacion?.Fecha_de_alta?.getTime() ?? 0,
               FechaVeri: Date.now(),
               FechaInst: Date.now(),
               Pedido: instalacion?.Pedido ?? "",
               Producto_pedido: instalacion?.Producto_pedido ?? "",
               tipoInstalacion: categoria ?? "",
               Codigo_de_barras: instalacion?.Codigo_de_barras ?? "",
               Comentario: comment ?? "",
               NroLoteArticulo: instalacion?.NroLoteArticulo ?? "",
               Estado: ""
            })
            toast.success(`Instalación asignada con éxito`);
            router.refresh();
            setOpenUpdate(false)
        }
        catch{
            toast.error("Ha ocurrido un error")
        }


    }

async function handleDelete() {
    
    await deleteInstalacion({
        Id: pathname?.toString()!
    })
    setOpenDelete(false)
    router.push("/dashboard/instalaciones")
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

                 {/* JblpR_RHKujpdeLyi4air */}
                 {!instalacion?.tipoInstalacion ? (
                              
                        <div className="w-1/3">
                                <h1>No existe el tipo de instalacion</h1>
                                <br />
                                <div className="flex justify-between">
                                    <Button onClick={() => setOpenDelete(true)}>Eliminar instalacion</Button>
                                    <Button onClick={() => setOpenUpdate(true)}>Asignar tipo de instalacion</Button>
                                </div>
                        </div>
                        ) : (
                            <div>

                            <h2 className="text-xl font-bold mb-4">Imágenes</h2>
                            <Tabs defaultValue={instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion? instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion[0]?.pasoCritico : undefined}>
                    <TabsList
                    className="max-w-full overflow-ellipsis"
                    >
                        {instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion?.map((e) => (
                            <TabsTrigger
                            key={e.pasoCriticoData?.id}
                            value={e.pasoCriticoData?.id}
                            className="data-[state=active]:bg-[#71EBD4]"
                            >
                            {e.pasoCriticoData?.description}
                        </TabsTrigger>
                        ))}
                    </TabsList>
                    {instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion?.map((e) => (
                        <TabsContent key={e.pasoCriticoData?.id} value={e.pasoCriticoData?.id}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {instalacion?.fotos?.filter((f) => f.pasoId === e.pasoCritico).map((f) => (
                                    <img
                                    key={f.Link}
                                    src={f.Link ?? ""}
                                    alt="Instalación"
                                    className="w-full h-48 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                    {/* <TabsContent value="conditional">
                    </TabsContent>
                    <TabsContent value="perAge">
                    </TabsContent> */}
                </Tabs>
                </div>
                
                    )}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {instalacion?.fotos?.map((e) => (
                        <img
                            key={e.Link}
                            src={e.Link ?? ""}
                            alt="Instalación"
                            className="w-full h-48 object-cover rounded"
                        />
                    ))}
                </div> */}
                
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
                            <Button 
                            disabled={isUpdated}
                            onClick={() => handleUpdate("Aprobada")} className="bg-green-500 hover:bg-green-600 text-white">
                                 {(isUpdated) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )} Aprobar
                            </Button>
                            <Button disabled={isUpdated} onClick={() => handleUpdate("Rechazada")} className="bg-red-500 hover:bg-red-600 text-white">
                            {(isUpdated) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}  Rechazar
                            </Button>
                        </div>
                    </div>
                )}





<Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
             Esta seguro que desea eliminar la instalacion?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
          <Button onClick={()=> setOpenDelete(false)}>
              {(isDeleating) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
             Cancelar
            </Button>
            <Button  onClick={handleDelete}>
              {(isDeleating) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
             Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
            Asigne el tipo de instalacion
            </DialogTitle>
          </DialogHeader>

          <div>
            <Label>Categoria de producto</Label><br/>
            
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={opciones.find((categoria) => categoria.value === instalacion?.tipoInstalacionId)}
              isClearable={true}
              isSearchable={true}
              name="Categoria"
              options={opciones}
              onChange={handleCategoriaChange}
            />


          </div>



          <DialogFooter>
          <Button onClick={()=> setOpenUpdate(false)}>
              {(isDeleating) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
             Cancelar
            </Button>
            <Button  onClick={handleUpdateTipo}>
              {(isDeleating) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
             Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
            </div>
        </div>
    );
}
