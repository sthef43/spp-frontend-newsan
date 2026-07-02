/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import _ from "lodash";
import { IControlLote } from "app/models";
import { Typography } from "@mui/material";
interface props {
  controlLote: any;
  rechazados: any;
  planProd: any;
}

//;Muetras los codigo que fueron reprocesador y los que no.
export const AccionVisualizarRechazos = ({ controlLote, rechazados, planProd }: props) => {
  useEffect(() => {
    armarLista();
  }, []);

  const [hayReprocesados, setHayReprocesados] = useState(null);

  const armarLista = async () => {
    if (!controlLote) console.log("sin lote");
    const reprocesoLinea = await getReprocesoLineaByControlLoteId(controlLote.idControlLote);
    if (reprocesoLinea != null) {
      generarNumeros(reprocesoLinea, controlLote);
      setHayReprocesados(true);
    } else {
      setHayReprocesados(false);
    }
  };

  //Genera los 2 listados, los reprocesados y los que no.
  const generarNumeros = (reprocesoLinea: IReprocesoLinea[], controlLote: IControlLote) => {
    const listadoOrdenadoReprocesados = _.orderBy(reprocesoLinea, "codigoNewsan"); //Los ordeno por codigo newsan.
    const listadoCod = [];
    //Obtengo solamente la numeracion del codigo, quitandole la primera parte estatica de numeros y los 0. para poder trabajar mejor.
    listadoOrdenadoReprocesados.forEach((element) => {
      const codigoSinPrimerosdigitos = parseInt(element.codigoNewsan.substring(5));
      const codigoSinCeros = Number(codigoSinPrimerosdigitos);
      listadoCod.push(codigoSinCeros);
    });
    const serieDesde = controlLote.serieDesde;
    const serieHasta = controlLote.serieHasta;
    const listReprocesados = [];
    const listNoReprocesados = [];
    for (let desde = serieDesde; desde <= serieHasta; desde++) {
      if (listadoCod.includes(desde)) {
        listReprocesados.push({ numero: desde });
      } else {
        listNoReprocesados.push({ numero: desde });
      }
    }
    setDataInfoReprocesados(listReprocesados);
    setDataInfoNoReprocesados(listNoReprocesados);
  };
  const [dataInfoReprocesados, setDataInfoReprocesados] = useState([]);
  const [dataInfoNoReprocesados, setDataInfoNoReprocesados] = useState([]);
  const dispatch = useAppDispatch();

  const getReprocesoLineaByControlLoteId = async (idControlLote: number) => {
    const result = unwrapResult(await dispatch(ReprocesoLineaSliceRequests.getListByControlLoteId(idControlLote)));
    if (result && result.length > 0) {
      return result;
    } else return null;
  };

  return (
    <div>
      {hayReprocesados && hayReprocesados == true ? (
        <div
          style={{
            display: "flex",
            padding: "10px",
            alignItems: "stretch",
            justifyContent: "space-between"
          }}>
          <div>
            <Typography variant="h2">Reprocesados</Typography>
            <TableComponent
              IDcolumn={"numero"}
              columns={[
                {
                  title: "Numero",
                  field: "numero"
                }
              ]}
              dataInfo={dataInfoReprocesados}
            />
          </div>
          <div>
            <Typography variant="h2">Sin Reprocesar</Typography>
            <TableComponent
              IDcolumn={"numero"}
              columns={[
                {
                  title: "Numero",
                  field: "numero"
                }
              ]}
              dataInfo={dataInfoNoReprocesados}
            />
          </div>
        </div>
      ) : (
        <div>
          <Typography variant="h2">No existen Reprocesados</Typography>
        </div>
      )}
    </div>
  );
};
