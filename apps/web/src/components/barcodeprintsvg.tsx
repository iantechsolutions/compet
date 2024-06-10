import React, { useRef } from 'react';
import { useBarcode } from 'next-barcode';
import ReactToPrint from 'react-to-print';

interface BarcodeComponentProps {
  id: string;
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({ id }) => {
  const { inputRef } = useBarcode({
    value: id,
    options: {
      width: 2,
      height: 100,
      background: 'transparent',
    },
  });

  return (
    <div className="Barcode bg-white border border-gray-300 shadow-md p-4 rounded-lg flex flex-col items-center">
      <svg ref={inputRef} />
    </div>
  );
};

interface BarcodePrintComponentProps {
  selectedIds: number[];
}

const BarcodePrintComponent: React.FC<BarcodePrintComponentProps> = ({ selectedIds }) => {
  const printRef = useRef(null);

  return (
    <div className="container mx-auto p-6">
      {selectedIds.length > 0 && (
        <div className="flex justify-end mb-4">
          <ReactToPrint
            trigger={() => (
              <button className="print-button px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none">
                Imprimir codigos
              </button>
            )}
            content={() => printRef.current}
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" ref={printRef}>
        {selectedIds.map((id) => (
          <BarcodeComponent key={id} id={id.toString()} />
        ))}
      </div>
    </div>
  );
};

export default BarcodePrintComponent;
