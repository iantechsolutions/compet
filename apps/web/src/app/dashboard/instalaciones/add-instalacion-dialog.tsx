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
import { Cliente, Clientes } from "~/server/api/routers/clientes";
import { Empalmista } from "~/server/api/routers/empalmistas";
import { Pedido } from "~/server/api/routers/pedidos";
import { Producto } from "~/server/api/routers/productos";
// import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";

export function AddInstalacionDialog() {
 


  const [open, setOpen] = useState(false);
  const [empalmista, setEmpalmista] = useState("");
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState(0);
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
    setProducto(Number(value));
  }

const { data: empalmistas} = api.empalmistas.list.useQuery(undefined);
const { data: clientes } = api.clientes.list.useQuery(undefined);
const { data: pedidos } = api.pedidos.list.useQuery(undefined);


async function handleCreate() {
  
  if(!empalmista || !cliente || !producto){
    toast.error("Cargue todos los campos")
    return null
  }

    try {
        const clienteT = clientes?.find((client) => client?.id === cliente);
        const pedidoT = pedidos?.find((pedido: Pedido) => pedido?.id === producto);
        const empalmistaT = empalmistas?.find((empalmis) => empalmis?.id === empalmista );
       
        if(pedidoT?.productosPedidos){
         
         try{

           pedidoT.productosPedidos.forEach(async (producto) => {
            //  await createInstalacion({
            //    Cliente:clienteT?.id ?? "",
            //    Pedido:pedidoT?.id ?? "",
            //    Empalmista: empalmistaT?.id ?? "",
            //    FechaAlta: new Date().getTime(),
            //    Estado: "Pendiente",
            //    Producto_pedido: producto?.id ?? "",
            //    tipoInstalacionId: producto?.tipoInstalacion ?? "",
            //    NroLoteArticulo: "",
            //   });
            })
          }catch(e){
            console.log(e);
            toast.error("No existen barcodes disponibles");
          }
        }
        
        

        router.refresh();
        setOpen(false);
        toast.success("Instalacion creada correctamente");
    } catch (e) {
        console.log(e);
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
              value: empalmista?.id.toString(),
              label: empalmista?.nombre || "",
            })) ?? []}
            onSelectionChange={handleEmpalmistaChange}

          />
        </div>
        <div>
          <ComboboxDemo
            title="Seleccionar cliente..."
            placeholder="Cliente"
            options={clientes?.map((cliente) => ({
              value: cliente?.id.toString(),
              label: cliente?.nombre || "",
            })) ?? []}
            onSelectionChange={handleClienteChange}
          />
        </div>
        <div>
          <ComboboxDemo
            title="Seleccionar pedido..."
            placeholder="Producto"
            options={pedidos?.map((pedido) => ({
              value: pedido?.id?.toString() || "",
              label: pedido?.numero?.toString() || "",
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
            <Button disabled={false} onClick={handleCreate}>
              {false && (
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
