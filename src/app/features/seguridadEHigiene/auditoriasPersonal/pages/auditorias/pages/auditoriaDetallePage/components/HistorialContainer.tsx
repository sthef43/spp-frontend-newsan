import { Edit, RemoveRedEyeRounded, VisibilityOff } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import FetchApi from "app/shared/helpers/FetchApi";
import { SEH_Auditoria } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria";
import { SEH_Auditoria_Detalles } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria_Detalles";
import { sehAuditoriaSliceRequest } from "app/features/seguridadEHigiene/auditoriasPersonal/reducers/SEH_AuditoriaSlice";
import moment from "moment";

import React, { useEffect, useState } from "react";
import { useAuditoriaContext } from "../context/AuditoriaContext";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

interface chunkedData {
  data: SEH_Auditoria[];
  sancion: boolean;
  fechaSancion: string;
}

interface Props {
  personalId: number | string;
  currentAuditoriaId?: number;
  clickEdit?: (id: number) => void;
}

const DetallesString = ({ detalles }: { detalles: SEH_Auditoria_Detalles[] }) => {
  if (detalles.length == 0) return <span>Sin Informacion</span>;
  const descripcion = detalles.map((d) => d.epp?.nombre).join("-");
  return <span>{descripcion}</span>;
};

const HistorialContainer = ({ personalId, currentAuditoriaId, clickEdit }: Props) => {
  const [chunkedData, setChunkedData] = useState<chunkedData[]>([]);
  const [historial, setHistorial] = useState<SEH_Auditoria[]>([]);
  const { getConfirmation } = useConfirmationDialog();
  const { setConteoUltimoGrupoHistorial, setAuditoriasIdAviso } = useAuditoriaContext();

  const buttonClases = MaterialButtons();

  FetchApi(sehAuditoriaSliceRequest.GetHistorialByPersonalId, personalId, false, null, setHistorial);

  useEffect(() => {
    const chunk = chunkArray(historial, 3);
    if (chunk.length > 0) {
      const primerGrupo: number = chunk[0].data.length;
      const ids = chunk[0].data.map((d) => d.id);
      setAuditoriasIdAviso(ids);
      setConteoUltimoGrupoHistorial(primerGrupo);
    }
    setChunkedData(chunk);
  }, [historial]);

  const handleViewSancion = async (fecha) => {
    await getConfirmation(
      null,
      null,
      <div className="p-4 text-center">
        El operario fue sancionado por RRHH el dia {moment(fecha).format("DD/MM/YYYY")}
      </div>,
      null,
      "Cerrar"
    );
  };

  return (
    <>
      {chunkedData.map((group, groupIndex) => (
        // Cambia la clase para que el contenedor use una sola columna
        <div
          key={groupIndex}
          style={{
            backgroundColor: "var(--background-color)",
            border: "1px solid gray"
          }}
          className={`p-2 rounded-lg shadow-xl grid grid-cols-12 gap-1 justify-center items-center place-content-center`}>
          <div className="col-span-11">
            {group.data.map((item, itemIndex) => (
              <div key={item.id} className=" p-2 w-full grid grid-cols-12 items-center">
                {/* HistorialAuditoriaItem */}

                {/* INDEX Y FECHA */}
                <div
                  className={`bg-green-600 p-2 rounded-full w-10 h-10 text-black text-center font-bold col-span-1 flex justify-center items-center`}>
                  <p className="m-0">{itemIndex + 1}</p>
                </div>

                {!group.sancion && item.id != currentAuditoriaId ? (
                  <div className="col-span-1">
                    <Tooltip title="Editar">
                      <IconButton
                        className={buttonClases.blueButton}
                        onClick={() => clickEdit(item.id)}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="col-span-1"></div>
                )}

                <p className={`m-0 text-center col-span-2`}>{moment(item.createdDate).format("DD/MM/YYYY")}</p>

                {/* EPP FALTANTES */}
                <p className={`m-0 text-center col-span-5`}>
                  <DetallesString detalles={item.detalles} />
                </p>

                {/* AUDITOR */}
                <p className="m-0 text-center col-span-3">
                  <span>Auditor:</span>
                  {item.auditor ? (
                    <span>
                      {item.auditor?.apellido} {item.auditor?.nombre}
                    </span>
                  ) : (
                    <span>Sin Informacion</span>
                  )}
                </p>
              </div>
            ))}
          </div>
          {group.data.length == 3 && (
            <div className="col-span-1">
              <IconButton disabled={!group.sancion} color="primary" size="large">
                {group.sancion ? (
                  <RemoveRedEyeRounded onClick={() => handleViewSancion(group.fechaSancion)} />
                ) : (
                  <VisibilityOff />
                )}
              </IconButton>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

//Funcion para agrupar y ordernar el historial
const chunkArray = (arr: SEH_Auditoria[], size: number): chunkedData[] => {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    const data = arr.slice(i, i + size).sort((a, b) => {
      if (a.createdDate > b.createdDate) {
        return -1;
      }
      if (a.createdDate < b.createdDate) {
        return -1;
      }
      return 0;
    });
    const tieneSancion = data.some((auditoria) => auditoria.sancionId !== null && auditoria.sancionId !== undefined);
    let fechaSancion = null;
    if (tieneSancion) {
      fechaSancion = data[0].sancion.fecha;
    }
    chunkedArr.push({
      data,
      sancion: tieneSancion,
      fechaSancion
    });
  }
  return chunkedArr.reverse();
};

export default HistorialContainer;
