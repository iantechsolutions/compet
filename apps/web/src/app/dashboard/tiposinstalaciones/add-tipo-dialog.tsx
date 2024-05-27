"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import MultiSelectFormField from "~/components/multi-select";
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

export function AddTipoInstalacionDialog() {
  const { mutateAsync: createTipoInstalacion , } =
    api.tipoInstalaciones.create.useMutation();
  const {mutateAsync: createRelacion, isPending} =
  api.pasoCriticoTotipoInstalacion.create.useMutation();
  
  const [open, setOpen] = useState(false);
  const [descripcion, setDecripcion] = useState("");
  const router = useRouter();
  const [selectedPasos, setSelectedPasos] = useState<string[]>([]);
  const { data: pasosCriticos } = api.pasoCritico.list.useQuery(undefined);

async function handleCreate() {
    try {
        const instalacion = await createTipoInstalacion({
          description: descripcion,
        });
        selectedPasos.map(paso=>(    
          createRelacion({
            pasoCritico: paso,
            tipoInstalacion: instalacion[0]!.id!
          })
        ))

        toast.success("Categoria creada correctamente");
        router.refresh();
        setOpen(false);
    } catch (e) {
        console.log(e);
    }
}
function handleAddPaso(input:string[]){
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
        Agregar categoria
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nueva categoria</DialogTitle>
          </DialogHeader>
        <div>
            <Label htmlFor="descripcion">Descripcion de la categoria</Label>
            <Input
              id="descripcion"
              placeholder="ej: Dimensiones de la preparacion del cable"
              value={descripcion}
              onChange={(e) => setDecripcion(e.target.value)}
            />
        </div>
        <div>
          <MultiSelectFormField
              options={listaPasos}
              defaultValue={selectedPasos}
              onValueChange={(e)=>handleAddPaso(e)}
              placeholder="Seleccionar pasos"
              variant="inverted"
            />
        </div>
          <DialogFooter>
            <Button disabled={isPending} onClick={handleCreate}>
              {isPending && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
