"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ComboboxDemo } from "~/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
// import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";
import { Producto, Productos } from "~/server/api/routers/productos";
import { Cliente } from "~/server/api/routers/clientes";
import { Pedido } from "~/server/api/routers/pedidos";

export function AddPedidoDialog({
  refetch,
}: 
{
  refetch: () => void;
}) {
  const { mutateAsync: createPedido, isPending } =
    api.pedidos.create.useMutation();

  // const { mutateAsync: createProductosPedido, isPending: isPendingProducto } =
  //   api.productosPedidos.createMany.useMutation();

    const [cliente, setCliente] = useState("");
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: clientes }: { data: Cliente[] | undefined } = api.clientes.list.useQuery();
  const { data: productos } = api.productos.list.useQuery()

  const handleClienteChange = (value : any) => {
    console.log(value);
    setCliente(value);
  }
  
  

  const handleProductCountChange = (productId: string, count: number) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: count
    }));
  };

  async function handleCreate() {

     if (cliente === null || cliente === "") {
      toast.error("Debes seleccionar un cliente");
      return;
    }
    const productosValidos = Object.values(productCounts).some(c => c > 0);
    if (!productosValidos) {
      toast.error("Debes seleccionar al menos un producto con cantidad > 0");
      return;
    }


    try {

      const productosParaGuardar = Object.entries(productCounts)
  .filter(([_, count]) => count > 0)
  .map(([productId, count]) => {
    const producto = productos?.find((p: Producto) => p?.Id === productId);
    if (!producto) {
      throw new Error(`Producto con ID ${productId} no encontrado`);
    }
    return {
      Producto_id: producto.Id,
      Cantidad: count,
      Descripcion: producto.Descripcion ?? "",
      Nombre: producto.Nombre ?? "",
      tipoInstalacionId: producto.tipoDeInstalacion_id ?? "",
    };
  })
  .filter(Boolean) as {
    Producto_id: string;
    Cantidad: number;
    Descripcion: string;
    Nombre: string;
    tipoInstalacionId: string;
  }[];

     await createPedido({
        Cliente: cliente ?? "",
        Estado: "Pendiente",
        FechaCreacion: new Date().getTime(),
        Productos: productosParaGuardar
      }).then((res) => res.at(0));
      

      
    

       
      setOpen(false);
      refetch();
      toast.success("Pedido creado correctamente");
      router.refresh();
    } catch (e) {
      console.log(e);
      toast.error("Error al crear el pedido");
    }
   
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircleIcon className="mr-2" size={20} />
        Agregar pedido
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo pedido</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-y-6 gap-x-0 pr-7 right-4 whitespace-nowrap overflow-hidden text-ellipsis">
          <Label className="relative top-3" htmlFor="name">Cliente</Label>
          <ComboboxDemo
            title="Seleccionar cliente..."
            placeholder="Cliente"
            options={clientes?.map((cliente: Cliente) => ({
              value: cliente?.Id?.toString() || "",
              label: cliente?.Nombre || "",
            })).filter(option => option.value !== "") ?? []}
            onSelectionChange={handleClienteChange}
          />
         
          </div> 
          <div>
          <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Nombre del producto</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Cantidad</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {productos?.filter((x: Producto)=>(x?.tipoDeInstalacion?.pasoCriticoTotipoInstalacion?.length ?? 0) > 0)
                .map((producto: Producto) => (
                    <TableRow key={producto?.Id}>
                        <TableCell>{producto?.Nombre}</TableCell>
                        <TableCell>{producto?.Descripcion}</TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                min="0"
                                value={producto?.Id ? productCounts[producto.Id] || "" : ""}
                                onChange={e => producto?.Id && handleProductCountChange(producto.Id, Number.parseInt(e.target.value))}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button disabled={isPending} onClick={handleCreate}>
              {(isPending) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
