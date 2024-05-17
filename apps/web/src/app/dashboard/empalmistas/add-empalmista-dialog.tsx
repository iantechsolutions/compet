"use client";

import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
// import { asTRPCError } from "~/lib/errors";
import { api } from "~/trpc/react";

export function AddEmpalmistaDialog() {
  const { mutateAsync: createEmpalmista, isPending } =
    api.empalmistas.create.useMutation();

  const [name, setName] = useState("");

  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleCreate() {
    try {
      await createEmpalmista({
        name,
      });

      toast.success("Empalmista creado correctamente");
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
        Agregar empalmista
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo empalmista</DialogTitle>
            {/* <DialogDescription>
                    
                </DialogDescription> */}
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
            <Button disabled={isPending} onClick={handleCreate}>
              {isPending && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar instalacion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
