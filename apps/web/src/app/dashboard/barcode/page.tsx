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

export default function Home() {
  const { data: productos, isLoading, error } = api.productos.list.useQuery();
  const { data: CodigoBarras } = api.CodigoBarras.list.useQuery();
  const { mutateAsync: createBarcodes, isPending } = api.CodigoBarras.create.useMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [ultimaId, setUltimaId] = useState<number | undefined>(undefined);
  const [desde, setDesde] = useState<number>(0);
  const [hasta, setHasta] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (CodigoBarras && CodigoBarras.length > 0) {
      const LastCodigoBarras = CodigoBarras[CodigoBarras.length - 1];
      setUltimaId(LastCodigoBarras?.Id);
    }
  }, [CodigoBarras]);

  //Obtener el ultimo codigo de barras

  useEffect(() => {
    if (ultimaId !== undefined) {
      setDesde(ultimaId + 1);
    }
  }, [ultimaId]);

  const handleAddIds = async () => {
    const ids = [];
    for (let i = desde; i <= hasta; i++) {
      ids.push(i);
    }
    setSelectedIds(ids);


    //
    try {
      for (let i = desde; i <= hasta; i++) {
        await createBarcodes({
          descripcion: "",
          productoSeleccionado: 0
        });
      }
      toast.success("Códigos de barra creados correctamente");
      router.refresh();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

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



  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Generar códigos de barra</Title>
          <Button onClick={handleAddIds}>
            Generar IDs
          </Button>
          <Button>
            <Link href="/dashboard/barcode/1">Asociar códigos de barra</Link>
          </Button>
          <Button onClick={generatePDF}>Generar PDF</Button>
        </div>
        <div className="flex space-x-4">
          <div>
            <Title>Desde</Title>
            <Input
              id='desde'
              type="number"
              placeholder={ultimaId !== undefined ? `Última ID: ${ultimaId}` : 'ej: 1'}
              value={desde}
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

        <div id="barcode-section" className="p-10 mt-4 grid grid-cols-8 gap-4">
          {selectedIds.map((id) => (
            <div key={id} className="border-black border-2 p-3 flex-col flex items-center">
              <Barcode width={50} height={50} values={id.toString()} />
              <h1>{id}</h1>
            </div>
          ))}
        </div>
      </section>
    </LayoutContainer>
  );
}