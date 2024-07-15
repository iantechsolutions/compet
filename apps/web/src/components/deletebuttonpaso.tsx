"use client";

import React,{useState} from "react";
import { Button } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface DeletePasoButtonProps {
  clientId: string;
}

export function DeletePasoButton({ clientId }: DeletePasoButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const router = useRouter();
  const { mutateAsync: deleteClientMethod } = api.pasoCritico.delete.useMutation();
  const deleteClient = async () => {
    try {
        
      await deleteClientMethod({ Id: clientId });
      toast.success("Paso eliminado correctamente");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar el paso");
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
          <div>¿Seguro que quieres eliminar este paso?</div>
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
