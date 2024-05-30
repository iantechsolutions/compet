"use client";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import Barcode from 'react-barcode';
import { Input } from "~/components/ui/input";
import Link from "next/link";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {

  const { data: tipos, isLoading, error } = api.tipoInstalaciones.list.useQuery();


  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  
  const [desde, setDesde] = useState<number>(0);
  const [hasta, setHasta] = useState<number>(0);
  
  const handleAddIds = () => {
    const ids = [];
    for (let i = desde; i <= hasta; i++) {
      ids.push(i);
    }
    setSelectedIds(ids);
  };
  
  const generatePDF = () => {
    const input = document.getElementById('barcode-section');
    if (input) {
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('barcodes.pdf');
      });
    }
  };


  if (isLoading) {
    return <p>Loading...</p>;
  }
  
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  
  const validIds = selectedIds.filter(id => tipos?.filter(tipo => tipo.Id === id));
  
  
 

  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Ingrese las instalaciones</Title>
          <Button onClick={handleAddIds}>
            Generar IDs
          </Button>
          <Link href="/dashboard/barcode/1">Asociar codigos de barra</Link>

          <div className="mt-4">
          <Button onClick={generatePDF}>Generar PDF</Button>
        </div>
        </div>
        <div className="flex space-x-4">
          <div>
            <Title>Desde</Title>
            <Input
              id='desde'
              type="number"
              placeholder='ej: 1'
              value={desde}
              onChange={(e) => setDesde(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Title>Hasta</Title>
            <Input
              id='hasta'
              type="number"
              placeholder='ej: 10'
              value={hasta}
              onChange={(e) => setHasta(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* <div className="mt-4 flex">
          <h2>IDs seleccionados:</h2>
          <ul className="flex flex-wrap space-x-1">
            {validIds.map((id) => (
              <li key={id}>{id},</li>
            ))}
          </ul>
        </div> */}

        <div id="barcode-section" className="mt-4 grid grid-cols-4 gap-4">
          {validIds.map((id) => (
            <div key={id}>
              <Barcode value={id.toString()} />
            </div>
          ))}
        </div>
      </section>

      
    </LayoutContainer>
  );
}
