"use client";
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Barcode, Loader2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Select from "react-select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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
import { Label } from "~/components/ui/label";

const dateToDMY = (date: Date | null | undefined) => {
  if (date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } else {
    return "No hay fecha";
  }
};

export default function Page() {
  const router = useRouter();
  const pathname = usePathname().split("/").pop();
  const { data: instalacion, isLoading, refetch } = api.instalaciones.get.useQuery({ id: Number(pathname) });
  const { data: categorias } = api.tipoInstalaciones.list.useQuery();

  const { mutateAsync: deleteInstalacion, isPending: isDeleting } = api.instalaciones.delete.useMutation();
  const { mutateAsync: updateInstalacion, isPending } = api.instalaciones.update.useMutation();

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [categoria, setCategoria] = useState("");

  const handleCategoriaChange = (value: any) => {
    setCategoria(value.value);
  };

  const opciones: readonly any[] = categorias?.map((categoria) => ({
    value: categoria.id,
    label: categoria.descripcion || "",
  })) ?? [];

  const [comment, setComment] = useState(instalacion?.comentario);
  useEffect(() => {
    if (instalacion && (instalacion?.estado === "Aprobada" || instalacion?.estado === "Rechazada")) {
      setComment(instalacion?.comentario);
    }
  }, [instalacion]);

  type EstadoInstalacion = "Pendiente" | "Generada" | "Instalada" | "Verificada";

  const handleUpdate = async (estado: EstadoInstalacion) => {
    await updateInstalacion({
      id: Number(pathname),
      estado,
      clienteId: instalacion?.clienteId ?? "",
      empalmistaId: instalacion?.empalmista?.id ?? "",
      fechaAlta: instalacion?.fechaAlta?.getTime() ?? 0,
      fechaVerificacion: Date.now(),
      fechaInstalacion: Date.now(),
      pedidoId: instalacion?.pedidoId ?? 0,
      productoPedidoId: instalacion?.productoPedidoId ?? "",
      tipoInstalacion: instalacion?.tipoInstalacionId ?? 0,
      Codigo_de_barras: instalacion?.codigoDeBarras ?? "",
      comentario: comment ?? "",
      nroLoteArticulo: instalacion?.nroLoteArticulo ?? "",
    });
    refetch();
    toast.success(`Instalación ${estado.toLowerCase()} con éxito`);
  };

  const handleUpdateTipo = async () => {
    try {
      await updateInstalacion({
        id: Number(pathname),
        clienteId: instalacion?.clienteId ?? "",
        empalmistaId: instalacion?.empalmista?.id ?? "",
        fechaAlta: instalacion?.fechaAlta?.getTime() ?? 0,
        fechaVerificacion: Date.now(),
        fechaInstalacion: Date.now(),
        pedidoId: instalacion?.pedidoId ?? 0,
        productoPedidoId: instalacion?.productoPedidoId ?? "",
        tipoInstalacion: Number(categoria),
        Codigo_de_barras: instalacion?.codigoDeBarras ?? "",
        comentario: comment ?? "",
        nroLoteArticulo: instalacion?.nroLoteArticulo ?? "",
        estado: "Pendiente",
      });
      toast.success(`Instalación asignada con éxito`);
      router.refresh();
      setOpenUpdate(false);
    } catch {
      toast.error("Ha ocurrido un error");
    }
  };

  async function handleDelete() {
    await deleteInstalacion({ id: Number(pathname) });
    setOpenDelete(false);
    router.push("/dashboard/instalaciones");
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mt-6 bg-white p-6 rounded shadow-md">
        <div className="grid grid-cols-3">
          <div>
            <h1 className="text-2xl font-bold mb-4">Detalles de la Instalación</h1>
            <p className="mb-2"><strong>Cliente:</strong> {instalacion?.cliente?.nombre}</p>
            <p className="mb-2"><strong>Nro de lote del artículo:</strong> {instalacion?.nroLoteArticulo}</p>
            <p className="mb-2"><strong>Fecha de alta:</strong> {dateToDMY(instalacion?.fechaAlta)}</p>
            <p className="mb-2"><strong>Fecha de instalación:</strong> {dateToDMY(instalacion?.fechaInstalacion)}</p>
            <p className="mb-2"><strong>Fecha de verificación:</strong> {dateToDMY(instalacion?.fechaVerificacion)}</p>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-4">Detalles del empalmista</h1>
            <p className="mb-2"><strong>Nombre:</strong> {instalacion?.empalmista?.nombre}</p>
            <p className="mb-2"><strong>DNI:</strong> {instalacion?.empalmista?.dni}</p>
            <p className="mb-2"><strong>Fecha de nacimiento:</strong> {dateToDMY(instalacion?.empalmista?.birthDate)}</p>
          </div>
          <div>
            {instalacion?.codigoDeBarras && (
              <div className="flex flex-col justify-center mr-48">
                <h1 className="text-2xl font-bold mb-4">Código QR</h1>
                <div className="p-3 flex flex-col items-center mt-6">
                  <BarcodeComponent key={instalacion.id} id={instalacion.codigoDeBarras} />
                </div>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Información del producto</h2>
        <div>
          <p className="mb-2"><strong>Nombre:</strong> {instalacion?.productoPedido?.nombre}</p>
          <p className="mb-2"><strong>Descripción:</strong> {instalacion?.productoPedido?.descripcion}</p>
          {instalacion?.tipoInstalacion && (
            <>
              <p className="mb-2"><strong>Categoría:</strong> {instalacion.tipoInstalacion.descripcion}</p>
              <p className="mb-2"><strong>Pasos:</strong></p>
              <ul>
                {instalacion.tipoInstalacion.pasoCriticoTotipoInstalacion?.map((e) => (
                  <li key={e.pasoCritico?.id}>-{e.pasoCritico?.descripcion}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {!instalacion?.tipoInstalacion ? (
          <div className="w-1/3">
            <h1>No existe el tipo de instalación</h1>
            <br />
            <div className="flex justify-between">
              <Button onClick={() => setOpenDelete(true)}>Eliminar instalación</Button>
              <Button onClick={() => setOpenUpdate(true)}>Asignar tipo de instalación</Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Imágenes</h2>
            <Tabs defaultValue={instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion?.[0]?.pasoCritico?.id.toString()}>
              <TabsList className="max-w-full overflow-ellipsis">
                {instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion?.map((e) => (
                  <TabsTrigger key={e.pasoCriticoId} value={e.pasoCriticoId.toString()} className="data-[state=active]:bg-[#71EBD4]">
                    {e.pasoCritico?.descripcion}
                  </TabsTrigger>
                ))}
              </TabsList>
              {instalacion?.tipoInstalacion?.pasoCriticoTotipoInstalacion?.map((e) => (
                <TabsContent key={e.pasoCritico?.id} value={e.pasoCritico?.id.toString()}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {instalacion?.fotos?.filter((f) => f.pasoCriticoId === e.pasoCriticoId).map((f) => (
                      <img
                        key={f.link ?? ""}
                        src={f.link ?? ""}
                        alt="Instalación"
                        className="w-full h-48 object-cover rounded"
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {instalacion?.lat && instalacion?.long && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Ubicación de finalización de la instalación</h2>
            <GoogleMaps lat={instalacion.lat} lng={instalacion.long} zoom={18} />
          </div>
        )}

        {(instalacion?.estado === "Aprobada" || instalacion?.estado === "Rechazada") && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Comentario</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Añadir comentario..."
              disabled
              value={comment ?? ""}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )}

        {instalacion?.estado === "Completada" && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Comentario</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Añadir comentario..."
              value={comment ?? ""}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button disabled={isPending} onClick={() => handleUpdate("Verificada")} className="bg-green-500 hover:bg-green-600 text-white">
              {isPending && <Loader2Icon className="mr-2 animate-spin" size={20} />} Aprobar
            </Button>
            <Button disabled={isPending} onClick={() => handleUpdate("Pendiente")} className="bg-red-500 hover:bg-red-600 text-white">
              {isPending && <Loader2Icon className="mr-2 animate-spin" size={20} />} Rechazar
            </Button>
          </div>
        )}

        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>¿Está seguro que desea eliminar la instalación?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpenDelete(false)}>
                {isDeleting && <Loader2Icon className="mr-2 animate-spin" size={20} />} Cancelar
              </Button>
              <Button onClick={handleDelete}>
                {isDeleting && <Loader2Icon className="mr-2 animate-spin" size={20} />} Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Asigne el tipo de instalación</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Categoría de producto</Label><br />
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={opciones.find((categoria) => categoria.value === instalacion?.tipoInstalacionId)}
                isClearable
                isSearchable
                name="Categoria"
                options={opciones}
                onChange={handleCategoriaChange}
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setOpenUpdate(false)}>
                {isDeleting && <Loader2Icon className="mr-2 animate-spin" size={20} />} Cancelar
              </Button>
              <Button onClick={handleUpdateTipo}>
                {isDeleting && <Loader2Icon className="mr-2 animate-spin" size={20} />} Aceptar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
