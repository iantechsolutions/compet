"use client";

import React, { useState, useEffect, MouseEventHandler } from "react";
import { Loader2Icon, PlusCircleIcon, Edit3Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MultiSelectFormField from "~/components/multi-select";
import Select, {
  components,
  MultiValueGenericProps,
  MultiValueProps,
  OnChangeValue,
  Props,
} from 'react-select';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortEndHandler,
  SortableHandle,
} from 'react-sortable-hoc';

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/server/api/root";
import { int } from "drizzle-orm/mysql-core";

type EmpalmistaType = RouterOutputs['tipoInstalaciones']['list'][number];
interface pasoType {
  readonly id: number;
  readonly value: string;
  readonly label: string;
}

interface AddEmpalmistaDialogProps {
  tipoInstalacion?: EmpalmistaType;
}

export function AddTipoInstalacionDialog({ tipoInstalacion }: AddEmpalmistaDialogProps) {
  const { mutateAsync: createTipoInstalacion, isPending: isCreating} = api.tipoInstalaciones.create.useMutation();
  const { mutateAsync: updateTipoInstalacion, isPending: isUpdating } = api.tipoInstalaciones.update.useMutation();
  const { mutateAsync: createRelacion} = api.pasoCriticoTotipoInstalacion.create.useMutation();
  console.log("tipoInstalacion",tipoInstalacion);
  const [open, setOpen] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [selectedPasos, setSelectedPasos] = useState<readonly pasoType[]>([]);
  const router = useRouter();
  const { data: pasosCriticos } = api.pasoCritico.list.useQuery(undefined);
  const { mutateAsync: deleteRelation } = api.pasoCriticoTotipoInstalacion.delete.useMutation();
  
  useEffect(() => {
    if (tipoInstalacion && pasosCriticos) {
      setDescripcion(tipoInstalacion.descripcion);
      console.log("entra al if");
      const pasosArray = tipoInstalacion.pasoCriticoTotipoInstalacion.map((paso) =>{
        const pasoCritico = pasosCriticos?.find((pasoCritico) => pasoCritico.id === paso.pasoCriticoId);
        console.log("pasoCritico",pasoCritico)
        if(pasoCritico){
          const createdPaso = {
            id: pasoCritico.id,
            value: pasoCritico.id.toString(),
            label: pasoCritico.descripcion,
          }
          setSelectedPasos(currentSelectedPasos => [...currentSelectedPasos, createdPaso]);
        }
        
      });
    }
  }, [pasosCriticos]);

  function arrayMove<T>(array: readonly T[], from: number, to: number) {
    const slicedArray = array.slice();
    slicedArray.splice(
      to < 0 ? array.length + to : to,
      0,
      slicedArray.splice(from, 1)[0] as T
    );
    return slicedArray;
  }

  const onChange = (selectedOptions: OnChangeValue<pasoType, true>) =>
    setSelectedPasos(selectedOptions);

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(selectedPasos, oldIndex, newIndex);
    setSelectedPasos(newValue);
    console.log(
      'Values sorted:',
      newValue.map((i) => i.id)
    );
  };

  const SortableMultiValue = SortableElement(
    (props: MultiValueProps<pasoType>) => {
      const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const innerProps = { ...props.innerProps, onMouseDown };
      return <components.MultiValue {...props} innerProps={innerProps} />;
    }
  );

  const SortableMultiValueLabel = SortableHandle(
    (props: MultiValueGenericProps) => <components.MultiValueLabel {...props} />
  );
  
  const SortableSelect = SortableContainer(Select) as React.ComponentClass<
    Props<pasoType, true> & SortableContainerProps
  >;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  async function handleSave() {
    if(isButtonDisabled || isCreating || isUpdating){
      return null
     }
     setIsButtonDisabled(true);

    try {
      
      if (tipoInstalacion) {
        await updateTipoInstalacion({
          id: tipoInstalacion.id,
          descripcion: descripcion,
        });
        // Delete existing relations before creating new ones
        for (const paso of tipoInstalacion.pasoCriticoTotipoInstalacion) {
          await deleteRelation({
            Id: paso.id
          });
        }
      } else {
        const newTipoInstalacion = await createTipoInstalacion({
          descripcion: descripcion,
        });
        const conversion = {
          id: Number(newTipoInstalacion[0]?.id ?? 0),
          descripcion: newTipoInstalacion[0]?.descripcion ?? "",
          pasoCriticoTotipoInstalacion: []
        }
        
        tipoInstalacion = conversion;
      }

      // Create new relations
      for (let i = 0; i < selectedPasos.length; i++) {
        await createRelacion({
          pasoCriticoId: selectedPasos[i]?.id ?? 0,
          tipoInstalacionId: tipoInstalacion?.id ?? 0,
          number: i,
        });
      }
      toast.success("Categoria creada correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      
      console.error(e);
      toast.error("Error al guardar categoria");
    }finally {
      setTimeout(() => setIsButtonDisabled(false), 1500);
    }
  }

  const listaPasos = pasosCriticos ? pasosCriticos.map(paso => ({
    id: paso.id,
    value: paso.id.toString(),
    label: paso.descripcion,
  })) : [];

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {tipoInstalacion ? (
          <>
            <Edit3Icon className="mr-2" size={20} />
            Editar categoria
          </>
        ) : (
          <>
            <PlusCircleIcon className="mr-2" size={20} />
            Agregar categoria
          </>
        )}
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
            <SortableSelect
              useDragHandle
              axis="xy"
              onSortEnd={onSortEnd}
              distance={4}
              getHelperDimensions={({ node }) => node.getBoundingClientRect()}
              isMulti
              options={listaPasos}
              value={selectedPasos}
              onChange={onChange}
              components={{
                // @ts-ignore We're failing to provide a required index prop to SortableElement
                MultiValue: SortableMultiValue,
                // @ts-ignore We're failing to provide a required index prop to SortableElement
                MultiValueLabel: SortableMultiValueLabel,
              }}
              closeMenuOnSelect={false}
            />
          </div>
          <DialogFooter>
            <Button disabled={isCreating || isUpdating || isButtonDisabled} onClick={handleSave}>
              {isCreating || isUpdating || isButtonDisabled && (
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
