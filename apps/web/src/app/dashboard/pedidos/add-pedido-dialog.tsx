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

export function AddPedidoDialog() {
  const { mutateAsync: createPedido, isPending } =
    api.pedidos.create.useMutation();

  const { mutateAsync: createProductoPedido, isPending: isPendingProducto } =
    api.productosPedidos.create.useMutation();

  const [cliente, setCliente] = useState("");
  const [productoSeleccion, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [productCounts, setProductCounts] = useState<Record<number, number>>({});

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: clientes } = api.clientes.list.useQuery(undefined)
  const { data: productos } = api.productos.list.useQuery(undefined)

  const handleClienteChange = (value : any) => {
    setCliente(value);
  }
  const handleProductoChange = (value : any) => {
    setProducto(value);
  }
  

  const handleProductCountChange = (productId: number, count: number) => {
    setProductCounts(prevCounts => ({
      ...prevCounts,
      [productId]: count
    }));
  };

  async function handleCreate() {
    try {
      const result = await createPedido({
        Cliente: parseInt(cliente),
        Estado: "Pendiente",
        FechaCreacion: new Date().getTime(),
      });
      console.log("result");
      console.log(result);
      const id = result.lastInsertRowid
      if(id){
        for (const [productId, count] of Object.entries(productCounts)) {
            const desc = productos?.find((producto) => producto.Id === Number.parseInt(productId))?.Descripcion;
            const nombre = productos?.find((producto) => producto.Id === Number.parseInt(productId))?.Nombre;
            const codigo = productos?.find((producto) => producto.Id === Number.parseInt(productId))?.Codigo_de_barras;
            await createProductoPedido({
                Pedido: Number(id),
                Producto: parseInt(productId),
                Cantidad: count,
                Descripcion: desc ?? "",
                Nombre: nombre ?? "",
                CodigoBarras: "Codigo: " + codigo
            });
        };
        const prod = productos?.find((producto) => producto.Id === Number.parseInt(productoSeleccion));
        await createProductoPedido({
          Pedido: Number(id),
          Producto: parseInt(productoSeleccion), 
          Cantidad: cantidad,
          Descripcion: prod?.Descripcion || "",
          CodigoBarras: prod?.Codigo_de_barras || "",
          Nombre:prod?.Nombre || "",
        })
        }
      toast.success("Pedido creado correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      console.log(e);
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
            options={clientes?.map((cliente) => ({
              value: cliente.Id.toString(),
              label: cliente.Nombre || "",
            })) ?? []}
            onSelectionChange={handleClienteChange}
          />
          <Label className="relative top-2" htmlFor="name">Producto</Label>
          <ComboboxDemo
            title="Seleccionar producto..."
            placeholder="Producto"
            options={productos?.map((producto) => ({
              value: producto.Id.toString(),
              label: producto.Nombre || "",
            })) ?? []}
            onSelectionChange={handleProductoChange}
            />
            <Label htmlFor="name">Cantidad</Label>
            <Input
                type="number"
                min="0"
                value={cantidad}
                onChange={e => setCantidad(Number.parseInt(e.target.value))}
            />

          </div>
          {/* <div>
          <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Nombre del producto</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Cantidad</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {productos?.map((producto) => (
                    <TableRow key={producto.Id}>
                        <TableCell>{producto.Nombre}</TableCell>
                        <TableCell>{producto.Descripcion}</TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                min="0"
                                value={productCounts[producto.Id] || 0}
                                onChange={e => handleProductCountChange(producto.Id, Number.parseInt(e.target.value))}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
          </div> */}
          <DialogFooter>
            <Button disabled={isPending} onClick={handleCreate}>
              {isPending && (
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
