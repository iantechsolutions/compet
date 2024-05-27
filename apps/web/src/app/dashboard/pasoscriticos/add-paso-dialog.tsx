"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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

export function AddPasoDialog() {
  const { mutateAsync: createPaso, isPending } =
    api.pasoCritico.create.useMutation();

  const [open, setOpen] = useState(false);
  const [descripcion, setDecripcion] = useState("");
  const [detalle, setDetalle] = useState("");
  const [usesCamera, setUsesCamera] = useState(false);
  const router = useRouter();


async function handleCreate() {
    try {
        await createPaso({
          description: descripcion,
          detalle: detalle,
        useCamera: usesCamera
        });

        toast.success("Paso creada correctamente");
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
        Agregar paso
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo paso</DialogTitle>
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
            <Label htmlFor="detalles">Se debe usar la camara en este paso?</Label><br/>
            <Checkbox checked={usesCamera} onClick={()=>setUsesCamera(!usesCamera)} />
        </div>
          <DialogFooter>
            <Button disabled={isPending} onClick={handleCreate}>
              {isPending && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar paso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
