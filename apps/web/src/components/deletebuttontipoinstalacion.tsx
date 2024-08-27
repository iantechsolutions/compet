"use client";

import React,{useState} from "react";
import { Button } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface DeleteTipoInstalacionButtonProps {
  clientId: string;
}

export function DeleteTipoInstalacionButton({ clientId }: DeleteTipoInstalacionButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const router = useRouter();
  const { mutateAsync: deleteInstalacionMethod } = api.tipoInstalaciones.delete.useMutation();
  const {mutateAsync: deleteRelaciones} = api.pasoCriticoTotipoInstalacion.deleteByTipoInstalacionId.useMutation();
  const deleteInstalacion = async () => {
    try {
      await deleteRelaciones({Id: clientId});
      await deleteInstalacionMethod({ Id: clientId });
      toast.success("Categoria eliminada correctamente");
      setIsDialogOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar la categoria");
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
          <div>¿Seguro que quieres eliminar esta categoria?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="bg-black text-white" onClick={deleteInstalacion}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
    
  );
}
