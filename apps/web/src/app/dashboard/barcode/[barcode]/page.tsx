"use client"
import { useState } from "react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { ComboboxDemo } from "~/components/ui/combobox";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function CreateBarCode(props: { params: { barcodeId: number } }) {
  const { data: productos, isLoading } = api.productos.list.useQuery();

  const updateBarcodeMutation = api.CodigoBarras.update.useMutation();

  const [productoSeleccion, setProductoSeleccion] = useState("");
  const [desde, setDesde] = useState<number | undefined>(1);
  const [hasta, setHasta] = useState<number | undefined>(undefined);

  const handleProductoChange = (value: any) => {
    setProductoSeleccion(value);
  };

  const handleEdit = () => {
    if (!productoSeleccion || desde === undefined || hasta === undefined) {
      alert("Por favor, seleccione un producto y especifique un rango válido.");
      return;
    }

    for (let i = desde; i <= hasta; i++) {
      updateBarcodeMutation.mutate({
        Id: i,
        descripcion: "",
        productoSeleccionado: parseInt(productoSeleccion),
      });
    }
  };

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <Title>Asociar códigos de barra</Title>

        <div className="grid grid-cols-2 gap-4">
          {/* Primera parte */}
          <div>
            <Title>Seleccione un producto</Title>
            <div className="mt-10">
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
          </div>

          {/* Segunda parte */}
          <div>
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
                {isLoading && <Loader2Icon className="mr-2 animate-spin" size={20} />}
                Asociar códigos
              </Button>
            </div>
          </div>
        </div>
      </section>
    </LayoutContainer>
  );
}