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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
// import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";

export function AddInstalacionDialog() {
  const { mutateAsync: createInstalacion, isPending } =
    api.instalaciones.createAssignBarcode.useMutation();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [empalmista, setEmpalmista] = useState("");
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const router = useRouter();

  const handleEmpalmistaChange = (value : any) => {
    setEmpalmista(value);
  }
  const handleClienteChange = (value : any) => {
    console.log(value);
    setCliente(value);
    console.log(cliente)
  }
  const handleProductoChange = (value : any) => {
    setProducto(value);
  }

const { data: empalmistas} = api.empalmistas.list.useQuery(undefined);
const { data: clientes } = api.clientes.list.useQuery(undefined);
const { data: pedidos } = api.pedidos.list.useQuery(undefined);

const [isButtonDisabled, setIsButtonDisabled] = useState(false);

async function handleCreate() {
  if(isPending || isButtonDisabled){
    return null
  }

  setIsButtonDisabled(true);
    try {
        const clienteT = clientes?.find((categoriaT) => categoriaT.Id === cliente);
        const pedidoT = pedidos?.find((categoriaT) => categoriaT.Id === producto);
        const empalmistaT = empalmistas?.find((categoriaT) => categoriaT.Id === empalmista);
        console.log("cliente",clienteT);
        console.log("pedido",pedidoT);
        console.log("empalmista",empalmistaT);
        if(pedidoT?.productos){
          pedidoT.productos.forEach(async (producto) => {
            await createInstalacion({
              Cliente:clienteT?.Id ?? "",
              Pedido:pedidoT?.Id ?? "",
              Empalmista: empalmistaT?.Id ?? "",
              FechaAlta: new Date().getTime(),
              Estado: "Pendiente",
              Producto_pedido: producto.Id,
              tipoInstalacionId: producto.tipoInstalacion ?? "",
              NroLoteArticulo: "",
            });
          })
        }
        
        

        setOpen(false);
        toast.success("Instalacion creada correctamente");
        router.refresh();
    } catch (e) {
        console.log(e);
    } finally {
      setTimeout(() => setIsButtonDisabled(false), 2000);
    }
}

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircleIcon className="mr-2" size={20} />
        Agregar instalacion
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nueva instalacion</DialogTitle>
          </DialogHeader>
        <div>
          <ComboboxDemo
            title="Seleccionar empalmista..."
            placeholder="Empalmista"
            options={empalmistas?.map((empalmista) => ({
              value: empalmista.Id.toString(),
              label: empalmista.Nombre || "",
            })) ?? []}
            onSelectionChange={handleEmpalmistaChange}

          />
        </div>
        <div>
          <ComboboxDemo
            title="Seleccionar cliente..."
            placeholder="Cliente"
            options={clientes?.map((cliente) => ({
              value: cliente.Id.toString(),
              label: cliente.Nombre || "",
            })) ?? []}
            onSelectionChange={handleClienteChange}
          />
        </div>
        <div>
          <ComboboxDemo
            title="Seleccionar pedido..."
            placeholder="Producto"
            options={pedidos?.map((pedido) => ({
              value: pedido.Id.toString(),
              label: pedido.Numero?.toString() || "",
            })) ?? []}
            onSelectionChange={handleProductoChange}
          />
        </div>
        {/* <Input
          type="number"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Codigo de barras"
          >
        </Input> */}
          <DialogFooter>
            <Button disabled={isPending || isButtonDisabled} onClick={handleCreate}>
              {isPending || isButtonDisabled && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar instalacion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
