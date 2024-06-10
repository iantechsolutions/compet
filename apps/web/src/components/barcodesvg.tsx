import React from 'react';
import { useBarcode } from 'next-barcode';

interface BarcodeComponentProps {
  id: string;
}

export const BarcodeComponent: React.FC<BarcodeComponentProps> = ({ id }) => {
  const { inputRef } = useBarcode({
    value: id,
    options:{
        width: 2,
        height:100,
        background: 'transparent',
    }
  });

  return (
    
    <div className="Barcode border-black border-2 p-3 flex-col flex items-center">
      <svg ref={inputRef} />
    </div>
  );
};