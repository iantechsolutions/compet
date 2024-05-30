"use client"
import { useState } from "react";
import { api } from "~/trpc/react";

   
export default function CreateBarCode(props: { params: { barcodeId: number } }) {
    
    const { data: tipos, isLoading, error } = api.tipoInstalaciones.list.useQuery();
    
    const [selectedIds, setSelectedIds] = useState<number[]>([]);


    const validIds = selectedIds.filter(id => tipos?.filter(tipo => tipo.Id === id));

     const [barcode, setBarcode] = useState("");

    

    return(
        <h1>Llegaste</h1>
    )
} 