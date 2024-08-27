"use client";
import { ComboboxDemo } from "~/components/ui/combobox";
import { Loader2Icon, PlusCircleIcon, Edit3Icon } from "lucide-react";
import Select from 'react-select';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/server/api/root";

type ProductType = RouterOutputs['productos']['list'][number];

interface AddProductoDialogProps {
  product?: ProductType;
}

export function AddProductoDialog({ product }: AddProductoDialogProps) {
  const { mutateAsync: createProduct, isPending: isCreating } =
    api.productos.create.useMutation();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    api.productos.update.useMutation();

  const [name, setName] = useState(product?.Nombre || "");
  const [description, setDescription] = useState(product?.Descripcion || "");
  const [barcode, setBarcode] = useState(product?.Codigo_de_barras || "");

  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { data: categorias } = api.tipoInstalaciones.list.useQuery(undefined);

  const [categoria, setCategoria] = useState(product?.tipoDeInstalacion_id || "");
  const handleCategoriaChange = (value: any) => {
    setCategoria(value.value);
  };
  const opciones:readonly any[] = categorias?.map((categoria) => ({
    value: categoria.id,
    label: categoria.description || "",
  })) ?? [];
  useEffect(() => {
    if (product) {
      setName(product.Nombre);
      setDescription(product.Descripcion ?? "");
      setBarcode(product.Codigo_de_barras ?? "");
      setCategoria(product.tipoDeInstalacion_id ?? "");
    }
  }, [product]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  async function handleSave() {
   
   if(isButtonDisabled || isCreating || isUpdating){
    return null
   }
  setIsButtonDisabled(true);

    try {
      const categoriaItem = categorias?.find((categoriaT) => categoriaT.id === categoria);

      if (product) {
        console.log("update");
        await updateProduct({
          Id: product.Id,
          name,
          description,
          barcode,
          categoria: categoriaItem ? categoriaItem?.id : null,
        });
        toast.success("Producto actualizado correctamente");
      } else {
        console.log("create");
        await createProduct({
          categoria: categoriaItem ? categoriaItem?.id : null,
          name,
          description,
          barcode,
        });
        toast.success("Producto creado correctamente");
      }
      setCategoria("");
      setOpen(false);
      
      router.refresh();
    } catch (e) {
      console.log(e);
      toast.error("Error al guardar producto");
    }finally {
      setTimeout(() => setIsButtonDisabled(false), 2000);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {product ? (
          <>
            <Edit3Icon className="mr-2" size={20} />
            Editar producto
          </>
        ) : (
          <>
            <PlusCircleIcon className="mr-2" size={20} />
            Agregar producto
          </>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{product ? "Editar producto" : "Agregar nuevo producto"}</DialogTitle>
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
              id="description"
              placeholder="..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* <div>
            <Label htmlFor="barcode">Codigo de barras del producto</Label>
            <Input
              id="barcode"
              placeholder="..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </div> */}
          <div>
            <Label>Categoria de producto</Label><br/>
            {/* <ComboboxDemo
              title="Seleccionar categoria..."
              placeholder="Categoria"
              options={categorias?.map((categoria) => ({
                value: categoria.id,
                onChange: { handleCategoriaChange },
                label: categoria.description || "",
              })) ?? []}
              onSelectionChange={handleCategoriaChange}
              // selectedValue={categoria}
            /> */}
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={opciones.find((categoria) => categoria.value === product?.tipoDeInstalacion_id)}
              isClearable={true}
              isSearchable={true}
              name="Categoria"
              options={opciones}
              onChange={handleCategoriaChange}
            />


          </div>
          <DialogFooter>
            <Button disabled={isCreating || isUpdating || isButtonDisabled} onClick={handleSave}>
              {(isCreating || isUpdating || isButtonDisabled) && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              {product ? "Actualizar producto" : "Agregar producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
