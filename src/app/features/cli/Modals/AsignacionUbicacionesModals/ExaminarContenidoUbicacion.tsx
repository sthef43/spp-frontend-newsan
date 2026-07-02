/* eslint-disable unused-imports/no-unused-vars */
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React from "react";
import { ICLIUbicacionSector } from "../../Models/ICLIUbicacionSector";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  ubicacionSeleccionada: ICLIUbicacionSector;
}

export const ExaminarContenidoUbicacion: React.FC<Props> = ({ setOpenModal, ubicacionSeleccionada }) => {
  return (
    <main className="w-[65vw]">
      {ubicacionSeleccionada.cliContenedorItems != null ? (
        <section>
          <TableComponent
            IDcolumn="id"
            dataInfo={ubicacionSeleccionada.cliContenedorItems.cliImpresionEtiquetas}
            buscar
            columns={[
              {
                title: "LPN Item",
                field: "lpnGenerada"
              },
              {
                title: "Articulo",
                field: "articulo"
              },
              {
                title: "Nombre Item",
                field: "cliItems.nombreItem"
              },
              {
                title: "Descripcion Item",
                field: "cliItems.descripcion"
              },
              {
                title: "Nombre Sector",
                field: "cliSectores.nombreSector"
              }
            ]}
          />
        </section>
      ) : (
        <section>
          <TableComponent
            IDcolumn="id"
            dataInfo={ubicacionSeleccionada.cliImpresionEtiquetas}
            buscar
            columns={[
              {
                title: "LPN Item",
                field: "lpnGenerada"
              },
              {
                title: "Articulo",
                field: "articulo"
              },
              {
                title: "Nombre Item",
                field: "cliItems.nombreItem"
              },
              {
                title: "Descripcion Item",
                field: "cliItems.descripcion"
              },
              {
                title: "Nombre Sector",
                field: "cliSectores.nombreSector"
              }
            ]}
          />
        </section>
      )}
    </main>
  );
};
