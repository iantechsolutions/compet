"use client";

import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Input } from "~/components/ui/input";
import { Barcode } from "lucide-react";
import BarcodePrintComponent from "~/components/barcodeprintsvg";

export default function Home() {
  const {data: generatedBarcodes} = api.generatedBarcodes.list.useQuery();
  const {mutateAsync: addGeneratedBarcode, isPending: isLoading} = api.generatedBarcodes.add.useMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [ultimaId, setUltimaId] = useState<number | undefined>(undefined);
  const [desde, setDesde] = useState<number>(0);
  const [hasta, setHasta] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (generatedBarcodes && generatedBarcodes.length > 0) {
      const lastBarcode = generatedBarcodes[generatedBarcodes.length - 1];
      setUltimaId(parseInt(lastBarcode?.CodigoBarras ?? "0"));
    }
  }, [generatedBarcodes]);

  //Obtener el ultimo codigo de barras

  useEffect(() => {
    if (ultimaId !== undefined) {
      setDesde(ultimaId + 1);
      setHasta(ultimaId + 1);
    }
  }, [ultimaId]);

  const handleAddIds = async () => {
    const ids = [];
    for (let i = desde; i <= hasta; i++) {
      addGeneratedBarcode({
        Codigo: i.toString(),
      });
      ids.push(i);
    }
    setSelectedIds(ids);
    try {
      for (let i = desde; i <= hasta; i++) {
      }
      toast.success("Códigos de barra creados correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }


  const generatePDF = () => {
    const input = document.getElementsByClassName('Barcode');
    
    let rows = 0;
    let cols = 0;
  
    if (input.length > 0) {
      const pdf = new jsPDF();
      
      Array.from(input).forEach(async codigo => {
        if (codigo instanceof HTMLElement) {
          
          const canvas = await html2canvas(codigo);
          
              const imgData = canvas.toDataURL('image/png');
              const imgProps = { width: canvas.width, height: canvas.height };
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              pdf.addImage(imgData, 'PNG', rows*5, cols*5,pdfWidth,pdfHeight);
              pdf.addPage(); 
              
              console.log(imgProps)
              console.log(imgData)
              
              if(cols<= 4){
                cols+=1
              }
              else{
                rows+=1
                cols=0
              }
              // if (cols * rows >= 68) {
              // }
          }
        
      });
  
      pdf.save('barcodes.pdf');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Generar códigos de barra</Title>
          <Button onClick={handleAddIds}>
            Generar IDs
          </Button>
          {/* <Button>
            <Link href="/dashboard/barcode/1">Asociar códigos de barra</Link>
          </Button> */}
          {/* <Button onClick={generatePDF} disabled={true}>Generar PDF</Button> */}
        </div>
        <div className="flex space-x-4">
          <div>
            <Title>Desde</Title>
            <Input
              id='desde'
              type="number"
              placeholder={ultimaId !== undefined ? `Última ID: ${ultimaId}` : 'ej: 1'}
              value={desde}
              disabled={true}
              onChange={(e) => setDesde(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Title>Hasta</Title>
            <Input
              id='hasta'
              type="number"
              placeholder="..."
              value={hasta}
              onChange={(e) => setHasta(parseInt(e.target.value))}
            />
          </div>
        </div>
          {/* {selectedIds.map((id) => ( */}
            <BarcodePrintComponent selectedIds={selectedIds}/>
          {/* // ))} */}
      </section>
    </LayoutContainer>
  );
}