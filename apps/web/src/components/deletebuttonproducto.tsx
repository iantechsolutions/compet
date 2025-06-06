"use client";

import React,{useState} from "react";
import { Button } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { List, ListTile } from "./list";



interface DeleteProductoButtonProps {
    productoId: string;
  }
  
  export function DeleteProductoButton({ productoId }: DeleteProductoButtonProps) {
      const [isDialogOpen, setIsDialogOpen] = useState(false); 
    const router = useRouter();
    const { mutateAsync: deletProductoMethod } = api.productos.delete.useMutation();
    
    // const {data: pedidoToProductos} = api.productosPedidos.getByProduct.useQuery({IdProducto: productoId})
    // const pedido = pedidoToProductos?.filter((x) => x.pedido.Estado === "Pendiente")
    // console.log("list:", pedido)
    const {data: instalaciones} = api.instalaciones.getByProduct.useQuery({tipoId: productoId})


    const deleteProducto = async () => {
      
      
      try {
        await deletProductoMethod({ id: productoId });
        toast.success("Producto eliminado correctamente");
        router.refresh();
      } catch (e) {
        console.error(e);
        toast.error("El producto tiene instalaciones y/o pedidos relacionados");
      }
    };
    return (
      <>
    <Button variant={"secondary"} onClick={() => setIsDialogOpen(true)}>
    <Trash2Icon size={20} />
  </Button>
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
        </DialogHeader>
        <div>¿Seguro que quieres eliminar este producto?</div>
      {instalaciones && instalaciones.length > 0 ? (
        <div>
          <div>Se eliminarán los siguientes pedidos pendientes:</div>
          <List>
            {instalaciones.map((producto) => (
              <h1>
                -N° {producto.id} Estado {producto.estado}
              </h1>
            ))}
          </List>
        </div>
      ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" className="bg-black text-white" onClick={deleteProducto}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      </>
  
);
}