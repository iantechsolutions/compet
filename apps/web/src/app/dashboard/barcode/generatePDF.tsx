import { PDFDownloadLink, PDFViewer, Document, Page, Text, View } from "@react-pdf/renderer";
import Barcode from "react-barcode";
import { Button } from "~/components/ui/button";

export default function GeneratePDF(props: { params: { desde: number; hasta: number } }) {
    const { desde, hasta } = props.params;

    const rows = [];
    const columns = 4;
    const selectedIds = hasta - desde + 1;
    const rowsCount = Math.ceil(selectedIds / columns);

    for (let row = 0; row < rowsCount; row++) {
        const rowElements = [];
        for (let col = 0; col < columns; col++) {
            const id = row * columns + col + desde;
            if (id > hasta) break; // Stop if we exceed the 'to' number
            rowElements.push(
                <div key={id} className="border-black border-2 p-3 flex-col flex items-center">
                    <Barcode width={100} height={50} value={id.toString()} />
                    <Text>{id}</Text>
                </div>
            );
        }
        rows.push(
            <div key={row} style={{ display: 'flex' }}>
                {rowElements}
            </div>
        );
    }

    return (
        <Document>
            <Page size="A4">
                <View>
                    {rows}
                </View>
            </Page>
        </Document>
    );
}
