"use client";

import React, { useState, useEffect } from "react";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MultiSelectFormField from "~/components/multi-select";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/server/api/root";

type EmpalmistaType = RouterOutputs['tipoInstalaciones']['list'][number];
type pasoType = RouterOutputs['pasoCritico']['list'][number];

interface AddEmpalmistaDialogProps {
  tipoInstalacion?: EmpalmistaType;
}


export function AddTipoInstalacionDialog({ tipoInstalacion }: AddEmpalmistaDialogProps) {
  const { mutateAsync: createTipoInstalacion } = api.tipoInstalaciones.create.useMutation();
  const { mutateAsync: updateTipoInstalacion } = api.tipoInstalaciones.update.useMutation();
  const { mutateAsync: createRelacion, isPending } = api.pasoCriticoTotipoInstalacion.create.useMutation();
  
  const [open, setOpen] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [selectedPasos, setSelectedPasos] = useState<string[]>([]);
  const router = useRouter();
  const { data: pasosCriticos } = api.pasoCritico.list.useQuery(undefined);
  const { mutateAsync:deleteRelation } = api.pasoCriticoTotipoInstalacion.delete.useMutation();

  useEffect(() => {
    if (tipoInstalacion) {
      setDescripcion(tipoInstalacion.description);
      const selectedPasoIds = tipoInstalacion.pasoCriticoTotipoInstalacion?.map((paso: any) => paso.id) || [];
      setSelectedPasos(selectedPasoIds);
    }
  }, [tipoInstalacion]);

  async function handleSave() {
    try {
      if (tipoInstalacion) {
        await updateTipoInstalacion({
          Id: tipoInstalacion.id,
          description: descripcion,
        });
        // Delete existing relations before creating new ones
        for (const paso of tipoInstalacion.pasoCriticoTotipoInstalacion) {
          await deleteRelation({
            Id: paso.id
          });
        }
      } else {
        const newTipoInstalacion = await createTipoInstalacion({
          description: descripcion,
        });
        const conversion = {
          id: newTipoInstalacion[0]?.id ?? "",
          description: newTipoInstalacion[0]?.description ?? "",
          pasoCriticoTotipoInstalacion: []
        }
        
        tipoInstalacion = conversion;
      }

      // Create new relations
      selectedPasos.forEach(async (pasoId) => {
        await createRelacion({
          pasoCritico: pasoId,
          tipoInstalacion: tipoInstalacion?.id ?? "",
        });
      });

      toast.success("Categoria creada correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar categoria");
    }
  }

  function handleAddPaso(input: string[]) {
    setSelectedPasos(input);
  }

  const listaPasos = pasosCriticos ? pasosCriticos.map(paso => ({
    value: paso.id,
    label: paso.description,
  })) : [];

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircleIcon className="mr-2" size={20} />
        {tipoInstalacion ? "Editar categoria" : "Agregar categoria"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tipoInstalacion ? "Editar categoria" : "Agregar nueva categoria"}</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="descripcion">Descripcion de la categoria</Label>
            <Input
              id="descripcion"
              placeholder="ej: Dimensiones de la preparacion del cable"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div>
            <MultiSelectFormField
              options={listaPasos}
              defaultValue={selectedPasos}
              onValueChange={(e) => handleAddPaso(e)}
              placeholder="Seleccionar pasos"
              variant="inverted"
            />
          </div>
          <DialogFooter>
            <Button disabled={isPending} onClick={handleSave}>
              {isPending && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              {tipoInstalacion ? "Actualizar categoria" : "Agregar categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
