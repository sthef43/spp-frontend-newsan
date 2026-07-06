import { DotacionSliceRequests } from "app/features/ingenieria/slices/DotacionSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { IDotacion } from "../../models/IDotacion";
import { IDotacionGrupoSectoresBloque } from "../../models/IDotacionGrupoSectoresBloque";
import { IDotacionTareasResultados } from "../../models/IDotacionTareasResultados";
import { DotacionTareasResultadosSliceRequest } from "../../reducers/DotacionTareasResultadosSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  dotacionSeleccionada: IDotacion;
}

export const ExaminarDatosTareasModal: React.FC<Props> = ({ setOpenModal, openModal, dotacionSeleccionada }) => {
  const [sectorSeleccionado, setSectorSeleccioado] = useState<string | number>(0);

  const [listaSectores, setListaSectores] = useState<IDotacionGrupoSectoresBloque[]>([]);
  FetchApi<IDotacionGrupoSectoresBloque[]>(
    DotacionSliceRequests.GetDotacionBySector,
    dotacionSeleccionada.id,
    true,
    openModal,
    setListaSectores
  );

  const [listaTareas, setListaTareas] = useState<IDotacionTareasResultados[]>([]);
  FetchApi<IDotacionTareasResultados[]>(
    DotacionTareasResultadosSliceRequest.GetAllTasksByDotacionId,
    { dotacionId: dotacionSeleccionada.id, sectorId: sectorSeleccionado },
    false,
    sectorSeleccionado,
    setListaTareas
  );

  const formatearFechaTabla = (row: IDotacionTareasResultados) => {
    const fecha = new Date(row.createdDate);
    if (fecha) {
      return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} - ${añadirCero(
        fecha.getHours()
      )}:${añadirCero(fecha.getMinutes())}`;
    } else {
      return "Sin Fecha de creacion";
    }
  };

  const añadirCero = (hora) => {
    if (hora < 10) {
      hora = "0" + hora;
      return hora;
    } else {
      return hora;
    }
  };

  return (
    <main className="w-[75vw]">
      {listaSectores && (
        <section className="flex flex-row justify-between w-full">
          {listaSectores.map((elementos, index) => (
            <div
              onClick={() => {
                setSectorSeleccioado(elementos.dotacionSectoresId);
              }}
              key={elementos.id}
              className="flex flex-col items-center w-1/3">
              <p
                className={`${
                  sectorSeleccionado == elementos.dotacionSectoresId
                    ? "bg-primaryNew text-white"
                    : "border-black bg-transparent"
                } hover:bg-primaryNew hover:text-white transition-colors hover:border-primaryNew border text-4xl rounded-full py-5 px-8 cursor-pointer`}>
                {index}
              </p>
              <p className="mt-4 text-xl">{elementos.dotacionSectores.nombre}</p>
            </div>
          ))}
        </section>
      )}
      {listaTareas && listaTareas ? (
        <TableComponent
          IDcolumn="id"
          dataInfo={listaTareas}
          buscar
          columns={[
            {
              title: "Tarea",
              field: "nombreTarea"
            },
            {
              title: "Valor ingresado",
              field: "valorTarea"
            },
            {
              title: "Fecha Creacion",
              field: "",
              render: (row) => formatearFechaTabla(row)
            }
          ]}
        />
      ) : (
        <section className="w-full text-center mt-4">
          {sectorSeleccionado !== 0 && <p>No se encontraron tareas realizadas</p>}
        </section>
      )}
    </main>
  );
};
