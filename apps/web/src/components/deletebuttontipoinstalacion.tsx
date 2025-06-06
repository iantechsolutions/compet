"use client";

import React,{useState} from "react";
import { Button } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface DeleteTipoInstalacionButtonProps {
  clientId: number;
}

export function DeleteTipoInstalacionButton({ clientId }: DeleteTipoInstalacionButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const router = useRouter();
  const { mutateAsync: deleteInstalacionMethod } = api.tipoInstalaciones.delete.useMutation();

const {data:productos} = api.productos.getByInstalation.useQuery({instalacionId: clientId})

const {data:instalaciones} = api.instalaciones.getByTipoInstalacion.useQuery({tipoId: clientId})


  const {mutateAsync: deleteRelaciones} = api.pasoCriticoTotipoInstalacion.deleteByTipoInstalacionId.useMutation();

  const deleteInstalacion = async () => {
    try {
      await deleteRelaciones({id: clientId});
      await deleteInstalacionMethod({ id: clientId });
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
          <div>Los siguientes productos no tendran tipo de instalacion</div>
          <ul>
            <h1>Productos</h1>
          {productos && productos.map((prod) => 
          { return(
            <li key={prod.id}>-{prod.nombre}</li>
           )}
          )}
            <h1>Instalaciones</h1>

          {instalaciones && instalaciones.map((prod) => 
          { return(
            <li key={prod.id}>-N° {prod.id}</li>
           )}
          )}
          </ul>
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
