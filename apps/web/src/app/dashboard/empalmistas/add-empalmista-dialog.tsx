"use client";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
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
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
dayjs.extend(utc);
dayjs.locale("es");
type EmpalmistaType = RouterOutputs['empalmistas']['list'][number];

interface AddEmpalmistaDialogProps {
  empalmista?: EmpalmistaType;
}

export function AddEmpalmistaDialog({ empalmista }: AddEmpalmistaDialogProps) {
  const { mutateAsync: createEmpalmista, isPending: isCreating } = api.empalmistas.create.useMutation();
  const { mutateAsync: updateEmpalmista, isPending: isUpdating } = api.empalmistas.update.useMutation();
  const [name, setName] = useState(empalmista?.Nombre || "");
  const [DNI, setDNI] = useState(empalmista?.DNI || "");
  const [BirthDate, setBirthDate] = useState<Date | undefined>(empalmista?.BirthDate || undefined);
  const [open, setOpen] = useState(false);
  const [popover1Open, setPopover1Open] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (empalmista) {
      setName(empalmista.Nombre ?? "");
      setDNI(empalmista.DNI ?? "");
      setBirthDate(empalmista.BirthDate ?? new Date());
    }
  }, [empalmista]);

  async function handleSave() {
    try {
      console.log("BirthDate", BirthDate);
      if (empalmista) {
        await updateEmpalmista({ Id: empalmista.Id, name, DNI, BirthDate: BirthDate?.getTime() });
        toast.success("Empalmista actualizado correctamente");
      } else {
        await createEmpalmista({ name, DNI, BirthDate:BirthDate?.getTime() });
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
          <div>
            <Label htmlFor="name">DNI</Label>
            <Input
              id="dni"
              placeholder="..."
              value={DNI}
              onChange={(e) => setDNI(e.target.value)}
            />
          </div>
          <div>
          <Label>Fecha de nacimiento</Label>
          <br />
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !BirthDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {BirthDate ? dayjs(BirthDate).format("D [de] MMMM [de] YYYY") : <span>Seleccione una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={BirthDate}
                onSelect={setBirthDate}
              />
            </PopoverContent>
          </Popover> */}
          <Popover open={popover1Open} onOpenChange={setPopover1Open}>
                <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !BirthDate && "text-muted-foreground"
                      )}
                    >
                      <p>
                        {BirthDate ? (
                          dayjs.utc(BirthDate).format("D [de] MMMM [de] YYYY")
                        ) : (
                          <span>Escoga una fecha</span>
                        )}
                      </p>
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={BirthDate ? new Date(BirthDate) : undefined}
                    onSelect={(e)=>{
                      setBirthDate(e);
                    }}
                    disabled={(date: Date) => date < new Date("1900-01-01")}
                    
                  />
                </PopoverContent>
              </Popover>
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
