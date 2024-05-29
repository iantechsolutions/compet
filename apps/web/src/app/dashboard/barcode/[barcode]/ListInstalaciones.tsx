import { useState } from "react";

   
export default function CreateBarCode(props: { params: { bonusId: number } }) {
    
    const [desde, setDesde] = useState<string>("0")
    const [hasta, setHasta] = useState<string>("0")
     const [barcode, setBarcode] = useState("");

    const GenerateBarcode =() => {
        setBarcode(desde.concat(",",hasta))
    }

    return(
        <h1></h1>
    )
} 