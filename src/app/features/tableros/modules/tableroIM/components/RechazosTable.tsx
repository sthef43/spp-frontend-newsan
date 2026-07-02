import { unwrapResult } from "@reduxjs/toolkit";
import { CodigoRechazosSliceRequest } from "app/Middleware/reducers/CodigoRechazosSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { useAppDispatch } from "app/core/store/store";
import { ICodigoRechazos } from "app/models/ICodigoRechazos";
import { IRechazo } from "app/models/IRechazo";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface props {
  lineaId: number;
  fecha: any;
  turno: string;
}

export const RechazosTable = ({ lineaId, fecha, turno }: props) => {
  const dispatch = useAppDispatch();
  const [rechazos, setRechazos] = useState(null);
  const [dataOpen, setDataOpen] = useState<IRechazo[]>(null);

  //Traigo todos los rechazos por fecha y linea.
  const getRechazos = async () => {
    const result = unwrapResult(
      await dispatch(
        RechazoSliceRequests.GetAllByFechaLineaHoraGroup({
          fecha: moment(fecha).format("YYYY-MM-DD"),
          idLinea: lineaId,
          horaDesde: turno == "M" ? "06:00:00" : turno == "T" ? "15:00:00" : "00:00:00",
          horaHasta: turno == "M" ? "15:00:00" : turno == "T" ? "23:59:59" : "05:59:59",
          conRechazoMain: false
        })
      )
    );
    if (result && result.length > 0) {
      console.log(result);
      setRechazos(result);
    } else limpiarDatos();
  };

  //cuando la linea cambia, traigo nuevamente la data.
  useEffect(() => {
    if (lineaId != null) getRechazos();
  }, [lineaId]);

  //cuando la fecha cambia, traigo nuevamente la data.
  useEffect(() => {
    if (fecha != "") getRechazos();
  }, [fecha]);

  //Cuando se carga el listado, obtengo los codigos de rechazos por cada registro.
  useEffect(() => {
    if (rechazos != null && rechazos.length > 0) getCodigosRechazos();
    else limpiarDatos();
    return () => {
      setRechazos(null);
    };
  }, [rechazos]);

  useEffect(() => {
    getRechazos();
  }, [turno]);

  const limpiarDatos = () => {
    setRechazos(null);
    setDataOpen([]);
  };

  //Para cada rechazo, traigo la informacion.
  const getCodigosRechazos = async () => {
    let codigoRechazo: ICodigoRechazos;
    const arrayRechazos: IRechazo[] = [];
    let objetoRechazo: IRechazo;
    for (let index = 0; index < rechazos.length; index++) {
      const rechazo = rechazos[index];
      codigoRechazo = await getCodigoRechazoByCodigo(rechazo.codigoRechazo);
      objetoRechazo = { ...rechazo, codigoRechazoModel: codigoRechazo };
      arrayRechazos.push(objetoRechazo);
    }
    setDataOpen(arrayRechazos);
  };

  const getCodigoRechazoByCodigo = async (codigoRechazo) => {
    const result = unwrapResult(
      await dispatch(
        CodigoRechazosSliceRequest.GetByCodigoAndLineaRequest({
          codigo: codigoRechazo,
          lineaId: lineaId
        })
      )
    );
    if (result) {
      return result;
    } else return null;
  };

  return (
    <div>
      {dataOpen && (
        <div>
          <div className="w-full flex justify-center">
            <TitleUIComponent title={"Rechazos"} classNameDiv="w-full whitespace-wrap mx-0" />
          </div>
          <div>
            <TableComponent
              Dense={true}
              IDcolumn={"codigoRechazo"}
              columns={[
                {
                  title: "Codigo",
                  field: "descripcionRechazo"
                },
                {
                  title: "Total",
                  field: "total"
                }
              ]}
              dataInfo={dataOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};
