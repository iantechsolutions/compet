"use client";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import Barcode from 'react-barcode';

export default function Home() {
  const { data: tipos, isLoading, error } = api.tipoInstalaciones.list.useQuery();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [barcodeValue, setBarcodeValue] = useState<string>("");

  const handleAddId = (id: number) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleAddBarcode = () => {
    const combinedIds = selectedIds.join("-");
    setBarcodeValue(combinedIds);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Ingrese las instalaciones</Title>
          <Button onClick={handleAddBarcode}>
            Generar código de barra
          </Button>
        </div>
        {barcodeValue && <Barcode value={barcodeValue} />}
        <div>
          <ul>
            {tipos?.map((tipo) => (
              <li key={tipo.Id} className="flex items-center space-x-4">
                <h1>ID: {tipo.Id} {tipo.description}</h1>
                <Button onClick={() => handleAddId(tipo.Id)}>
                  {selectedIds.includes(tipo.Id) ? "Remover" : "Agregar"}
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h2>IDs seleccionados:</h2>
            <ul>
              {selectedIds.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </LayoutContainer>
  );
}
