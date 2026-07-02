import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
//import "../styles/pdfCustom.css"
import "@react-pdf-viewer/core/lib/styles/index.css";

interface Props {
  urlPdf: string;
  pantallActualizacion?: boolean;
  fileUnsaved?: boolean;
}

export const ViewerPdf: React.FC<Props> = ({ urlPdf, pantallActualizacion, fileUnsaved }) => {
  return (
    <main className={`${pantallActualizacion ? "w-1/2" : "w-10/12"} h-full`}>
      <div style={{ height: "100%" }} className="pdf-wrapper">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={
              fileUnsaved ? urlPdf : `${import.meta.env.BASE_URL}assets/modulosManuales/${urlPdf.toLowerCase()}.pdf`
            }
          />
        </Worker>
      </div>
    </main>
  );
};
