"use client";

import { Loader2Icon, PlusCircleIcon, Edit3Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

interface AddPasoDialogProps {
  paso?: {
    id: number;
    descripcion: string;
    detalle: string;
    useCamera: boolean | null;
  };
}

export function AddPasoDialog({ paso }: AddPasoDialogProps) {
  const { mutateAsync: createPaso, isPending: isCreating } = api.pasoCritico.create.useMutation();
  const { mutateAsync: updatePaso, isPending: isUpdating } = api.pasoCritico.update.useMutation();

  const [open, setOpen] = useState(false);
  const [descripcion, setDecripcion] = useState(paso?.descripcion || "");
  const [detalle, setDetalle] = useState(paso?.detalle || "");
  const [usesCamera, setUsesCamera] = useState(paso?.useCamera || false);
  const router = useRouter();

  useEffect(() => {
    if (paso) {
      setDecripcion(paso.descripcion ?? "");
      setDetalle(paso.detalle ?? "");
      setUsesCamera(paso.useCamera ?? false);
    }
  }, [paso]);


  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  async function handleSave() {
    if(isButtonDisabled || isCreating || isUpdating){
      return null
     }
     setIsButtonDisabled(true);

    try {
      if (paso) {
        await updatePaso({ id: paso.id, descripcion: descripcion, detalle, useCamera: usesCamera });
        toast.success("Paso actualizado correctamente");
      } else {
        await createPaso({ descripcion: descripcion, detalle, useCamera: usesCamera });
        toast.success("Paso creado correctamente");
      }
      router.refresh();
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar el paso");
    }finally {
      setTimeout(() => setIsButtonDisabled(false), 1500);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {paso ? (
          <>
            <Edit3Icon className="mr-2" size={20} />
            Editar paso
          </>
        ) : (
          <>
            <PlusCircleIcon className="mr-2" size={20} />
            Agregar paso
          </>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{paso ? "Editar paso" : "Agregar nuevo paso"}</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="descripcion">Descripcion del paso</Label>
            <Input
              id="descripcion"
              placeholder="ej: Dimensiones de la preparacion del cable"
              value={descripcion}
              onChange={(e) => setDecripcion(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="detalles">Detalles del paso</Label>
            <Input
              id="detalles"
              placeholder="ej: Se debe tomar una foto del cable preparado junto a la regla de preparacion para confirmar las dimensiones correctas"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="usesCamera">Se debe usar la camara en este paso?</Label><br />
            <Checkbox checked={usesCamera} onClick={() => setUsesCamera(!usesCamera)} />
          </div>
          <DialogFooter>
            <Button disabled={isCreating || isUpdating || isButtonDisabled} onClick={handleSave}>
              {(isCreating || isUpdating || isButtonDisabled) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              {paso ? "Actualizar paso" : "Agregar paso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
