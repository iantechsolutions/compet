"use client";

import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "~/components/uploadthing";
import { metadata } from "~/app/layout";
import { instalaciones } from "~/server/db/schema";



export default function UploadPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>();


  const router = useRouter();

  return (
    <LayoutContainer>
      <Title>Cargar documento</Title>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <UploadDropzone
        input={{ instalacionId: 1}}
        endpoint="imageuploader"
        config={{
          mode: "manual",
          appendOnPaste: true,
        }}
        content={{
          button: "Continuar",
          allowedContent: "Archivos",
          label: "Arrastra y suelta el archivo aquí",
        }}
        onClientUploadComplete={(res) => {
          const [file] = res;

          if (!file) return;
             
          console.log(file.name)
          router.push(`./api/app/v1/uploads/${file.serverData.uploadId}`);
        }}
        onUploadError={(error: Error) => {
          setErrorMessage(error.message);
        }}
      />
    </LayoutContainer>
  );
}
