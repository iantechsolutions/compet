"use client";
import { ComboboxDemo } from "~/components/ui/combobox";
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
import { set } from "zod";

export function AddProductoDialog() {
  const { mutateAsync: createProduct, isPending } =
    api.productos.create.useMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");

  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { data: categorias} = api.tipoInstalaciones.list.useQuery(undefined);

  const [categoria,setCategoria] = useState("");
  const handleCategoriaChange= (value : any) => {
    console.log(value);
    setCategoria(value);
  }

  async function handleCreate() { 
    try {
      const categoriaItem = categorias?.find((categoriaT) => categoriaT.id === categoria);
      await createProduct({
        categoria: categoriaItem!.id,
        name,
        description,
        barcode
      });

      toast.success("Producto creado correctamente");
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
        Agregar producto
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo producto</DialogTitle>
            {/* <DialogDescription>
                    
                </DialogDescription> */}
          </DialogHeader>
          <div>
            <Label htmlFor="name">Nombre del producto</Label>
            <Input
              id="name"
              placeholder="..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Descripcion del producto</Label>
            <Input
              id="descripcion"
              placeholder="..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* <div>
            <Label htmlFor="description">Codigo de barras del producto</Label>
            <Input
              id="barcode"
              placeholder="..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </div> */}
          <div>
            <Label>Categoria de producto</Label><br/>
            <ComboboxDemo
              title="Seleccionar categoria..."
              placeholder="Categoria"
              options={categorias?.map((categoria) => ({
                value: categoria.id,
                onChange:{handleCategoriaChange},
                label: categoria.description || "",
              })) ?? []}
              onSelectionChange={handleCategoriaChange}
            />
          </div>
          <DialogFooter>
            <Button disabled={isPending} onClick={handleCreate}>
              {isPending && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
