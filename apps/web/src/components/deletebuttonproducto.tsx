"use client";

import React,{useState} from "react";
import { Button } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";



interface DeleteProductoButtonProps {
    productoId: string;
  }
  
  export function DeleteProductoButton({ productoId }: DeleteProductoButtonProps) {
      const [isDialogOpen, setIsDialogOpen] = useState(false); 
    const router = useRouter();
    const { mutateAsync: deletProductoMethod } = api.productos.delete.useMutation();
    const deleteProducto = async () => {
      try {
          
        await deletProductoMethod({ Id: productoId });
        toast.success("Producto eliminado correctamente");
        router.refresh();
      } catch (e) {
        console.error(e);
        toast.error("Error al eliminar producto");
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