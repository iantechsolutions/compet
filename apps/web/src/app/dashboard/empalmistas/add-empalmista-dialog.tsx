"use client";

import React, { useState, useEffect } from "react";
import { Loader2Icon, PlusCircleIcon, Edit3Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/server/api/root";


type EmpalmistaType = RouterOutputs['empalmistas']['list'][number];

interface AddEmpalmistaDialogProps {
  empalmista?: EmpalmistaType;
}

export function AddEmpalmistaDialog({ empalmista }: AddEmpalmistaDialogProps) {
  const { mutateAsync: createEmpalmista, isPending: isCreating } = api.empalmistas.create.useMutation();
  const { mutateAsync: updateEmpalmista, isPending: isUpdating } = api.empalmistas.update.useMutation();
  const [name, setName] = useState(empalmista?.Nombre || "");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (empalmista) {
      setName(empalmista.Nombre ?? "");
    }
  }, [empalmista]);

  async function handleSave() {
    try {
      if (empalmista) {
        await updateEmpalmista({ Id: empalmista.Id, name });
        toast.success("Empalmista actualizado correctamente");
      } else {
        await createEmpalmista({ name });
        toast.success("Empalmista creado correctamente");
      }
      router.refresh();
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar empalmista");
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {empalmista ? (
          <>
            <Edit3Icon className="mr-2" size={20} />
            Editar empalmista
          </>
        ) : (
          <>
            <PlusCircleIcon className="mr-2" size={20} />
            Agregar empalmista
          </>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{empalmista ? "Editar empalmista" : "Agregar nuevo empalmista"}</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="name">Nombre del empalmista</Label>
            <Input
              id="name"
              placeholder="..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button disabled={isCreating || isUpdating} onClick={handleSave}>
              {(isCreating || isUpdating) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              {empalmista ? "Actualizar empalmista" : "Agregar empalmista"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
