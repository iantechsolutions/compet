"use client";
import { useState } from "react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { Accordion } from "~/components/ui/accordion";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import AccordionList from "../../pedidos/accordion-list";
import { Label } from "~/components/ui/label";
import { ComboboxDemo } from "~/components/ui/combobox";
import { Button } from "~/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function CreateBarCode(props: { params: { barcodeId: number } }) {
  const { data: productos, isLoading } = api.productos.list.useQuery();
  const updateBarcodeMutation = api.CodigoBarras.update.useMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [productoSeleccion, setProductoSeleccion] = useState("");
  const [desde, setDesde] = useState<number | undefined>(undefined);
  const [hasta, setHasta] = useState<number | undefined>(undefined);

  const handleProductoChange = (value: any) => {
    setProductoSeleccion(value);
  };

  const handleEdit = () => {
    if (!productoSeleccion || desde === undefined || hasta === undefined) {
      alert("Por favor, seleccione un producto y especifique un rango válido.");
      return;
    }

    const idsToUpdate = Array.from(
      { length: hasta - desde + 1 },
      (_, i) => desde + i
    );

    updateBarcodeMutation.mutate({
      Id: 1,
      descripcion: "",
      productoSeleccionado: parseInt(productoSeleccion),
    });
  };

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Asociar códigos de barra</Title>
        </div>
        <div>
          <Title>Seleccione un producto</Title>
          <Label className="relative top-2" htmlFor="name">
            Producto
          </Label>
          <ComboboxDemo
            title="Seleccionar producto..."
            placeholder="Producto"
            options={
              productos?.map((producto) => ({
                value: producto.Id.toString(),
                label: producto.Nombre || "",
              })) ?? []
            }
            onSelectionChange={handleProductoChange}
          />
        </div>
        <Title>Seleccione el rango</Title>
        <div className="flex space-x-4">
          <div>
            <Title>Desde</Title>
            <Input
              id="desde"
              type="number"
              placeholder="ej: 1"
              value={desde}
              onChange={(e) => setDesde(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Title>Hasta</Title>
            <Input
              id="hasta"
              type="number"
              placeholder="ej: 10"
              value={hasta}
              onChange={(e) => setHasta(parseInt(e.target.value))}
            />
          </div>

          <Button disabled={isLoading} onClick={handleEdit}>
                            {isLoading && <Loader2Icon className='mr-2 animate-spin' size={20} />}
                            Asociar codigos
                        </Button>
        </div>
      </section>
    </LayoutContainer>
  );
}
