"use client";

import { Loader2Icon, PlusCircleIcon, Edit3Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUserInfo } from "~/components/auth-provider/auth-provider-client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RouterOutputs } from "~/server/api/root";
// import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";

type ClientType = RouterOutputs['clientes']['list'][number];

interface AddClienteDialogProps {
  client?: ClientType;
}

export function AddClienteDialog({ client }: AddClienteDialogProps) {
  const { mutateAsync: createClient, isPending: isCreating } =
    api.clientes.create.useMutation();
  const { mutateAsync: updateClient, isPending: isUpdating } =
    api.clientes.update.useMutation();

  const userinfo = useUserInfo();

  const [direccion, setDireccion] = useState(client?.Direccion || "");
  const [name, setName] = useState(client?.Nombre || "");

  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleSave() {
    try {
      if (client) {
        await updateClient({
          Id: client.Id,
          name: name,
          direccion: direccion,
        });
        toast.success("Cliente actualizado correctamente");
      } else {
        await createClient({
          Nombre: name,
          Direccion: direccion,
        });
        toast.success("Cliente creado correctamente");
      }
      router.refresh();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {client ? (
          <>
            <Edit3Icon className="mr-2" size={20} />
            Editar cliente
          </>
        ) : (
          <>
            <PlusCircleIcon className="mr-2" size={20} />
            Agregar cliente
          </>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {client ? "Editar cliente" : "Agregar nuevo cliente"}
            </DialogTitle>
            {/* <DialogDescription>
                    
                </DialogDescription> */}
          </DialogHeader>
          <div>
            <Label htmlFor="name">Nombre del cliente</Label>
            <Input
              id="name"
              placeholder="ej: Martin o Empresa SA"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Direccion del cliente</Label>
            <Input
              id="direccion"
              placeholder="..."
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button disabled={isCreating || isUpdating} onClick={handleSave}>
              {(isCreating || isUpdating) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              {client ? "Actualizar cliente" : "Agregar cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
