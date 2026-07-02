import React, { useEffect, useState } from "react";
import { Sliders } from "../../../shared/components/Sliders";
import { ViewerPdf } from "../components/ViewerPdf";
import FetchApi from "app/shared/helpers/FetchApi";
import { RoutesAyudaSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaSlice";
import { IRoutesAyuda } from "app/features/ayuda/models/IRoutesAyuda";
import { RoutesAyudaPadresSliceRequest } from "app/features/ayuda/middleware/RoutesAyudaPadresSlice";
import { IRoutesAyudaPadres } from "app/features/ayuda/models/IRoutesAyudaPadres";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

export const AyudaPage = () => {
  const { TitleChanger } = useTitleOfApp();

  const [expanded, setExpanded] = useState<string | false>(false);
  const [urlPdf, setUrlPdf] = useState<string>("");
  const [opcionSlider, setOpcionSlider] = useState<string>("Auditorias");

  const [listaPadres, setListaPadres] = useState<IRoutesAyudaPadres[]>([]);
  FetchApi<IRoutesAyudaPadres[]>(RoutesAyudaPadresSliceRequest.getAllRequest, null, true, null, setListaPadres);

  const [listaRoutes, setListaRoutes] = useState<IRoutesAyuda[]>([]);
  FetchApi<IRoutesAyuda[]>(RoutesAyudaSliceRequest.GetAllByPadre, opcionSlider, true, opcionSlider, setListaRoutes);

  useEffect(() => {
    TitleChanger("Visualisar PDF Ayuda");
  }, []);

  return (
    <main className="w-screen p-5 flex flex-row gap-x-8 h-[94vh]">
      <section className="w-[40%] flex flex-col">
        <h2 className="text-2xl font-semibold">Ayuda</h2>
        <p className="text-lg">
          Acá encontrarás manuales instructivos de las operaciones que podes realizar en el sistema SPP.
        </p>
        <div>
          {listaPadres && (
            <>
              {listaPadres.map((elementos, index) => (
                <main key={index} className="mt-4">
                  <Sliders
                    nameSlider={elementos.padre}
                    titleSlider={elementos.padre}
                    expandend={expanded}
                    setExpanded={setExpanded}
                    setOpcionSlider={setOpcionSlider}
                    elementJSX={
                      <main className="px-12">
                        <ul className="list-disc">
                          {listaRoutes && (
                            <>
                              {listaRoutes.map((elementos, index) => (
                                <li key={index} className="hover:text-blue-500 transition-colors">
                                  <button onClick={() => setUrlPdf(elementos.ruta)}>{elementos.nombrePDF}</button>
                                </li>
                              ))}
                            </>
                          )}
                        </ul>
                      </main>
                    }
                  />
                </main>
              ))}
            </>
          )}
        </div>
      </section>
      {urlPdf != "" && <ViewerPdf urlPdf={urlPdf.toLowerCase()}></ViewerPdf>}
    </main>
  );
};
