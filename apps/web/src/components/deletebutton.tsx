"use client";

import React,{useState} from "react";
import { Button } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface DeleteClientButtonProps {
  clientId: string;
}

export function DeleteClientButton({ clientId }: DeleteClientButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const router = useRouter();
  const { mutateAsync: deleteClientMethod } = api.clientes.delete.useMutation();
  const deleteClient = async () => {
    try {
        
      await deleteClientMethod({ Id: clientId });
      toast.success("Cliente eliminado correctamente");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar cliente");
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
          <div>¿Seguro que quieres eliminar este cliente?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="bg-black text-white" onClick={deleteClient}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
    
  );
}
