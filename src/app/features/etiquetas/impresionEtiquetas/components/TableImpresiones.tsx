import React, { useEffect, useState } from "react";
import { IZPL_Etiquetas } from "app/models/IZPL_Etiquetas";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { ZPL_ImpresionesSliceRequests } from "app/Middleware/reducers/ZPL_ImpresionesSlice";
import { useAppDispatch } from "app/core/store/store";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import { IZPL_Productos } from "app/models/IZPL_Productos";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { IAppUser } from "app/models";
import TitleUIComponent from "../../../../shared/components/helpComponents/TitleUIComponent";

interface props {
  etiqueta: IZPL_Etiquetas;
  producto: IZPL_Productos;
}

export const TableImpresiones = ({ etiqueta, producto }: props) => {
  const dispatch = useAppDispatch();

  const [impresiones, setImpresiones] = useState(null);
  const [appUsers, setAppUsers] = useState([]);

  const getTipoEtiqueta = async (tipEtiquetaId) => {
    let result = [];
    result = unwrapResult(await dispatch(ZPL_TipoEtiquetasSliceRequests.getAllRequest()));
    if (result) {
      return result.find((x) => x.id == tipEtiquetaId);
    }
  };

  const getImpresiones = async () => {
    let result = [];
    const year = moment().year();
    const tipoEtiqueta = await getTipoEtiqueta(etiqueta.tipoEtiqueta);
    //Si tiene inicioEBS = true, y no existen registros, tiene q empezar de 1000 la impresion.
    if (tipoEtiqueta.inicioEBS) {
      result = unwrapResult(
        await dispatch(
          ZPL_ImpresionesSliceRequests.getAllByTipoEtiquetaAndFamiliaId({
            tipoEtiqueta: tipoEtiqueta.id,
            productoId: producto.id
          })
        )
      );
    }
    //Si cambia mes = true, busca las ultimas impresiones por mes y año
    else if (etiqueta.cambiaMes) {
      const month = moment().month() + 1;
      const params = { tipoEtiqueta: tipoEtiqueta.id, familiaId: producto.idFamilia, month: month, year: year };
      result = unwrapResult(await dispatch(ZPL_ImpresionesSliceRequests.getAllByMonthAndYear(params)));
    } else {
      //sino cambia mes, no busca mas solo por año. Ahora busca por tipoEtiqueta, la familia y el prefijo de la etiqueta.
      const params = { tipoEtiqueta: tipoEtiqueta.id, familiaId: producto.idFamilia, prefijo: etiqueta.prefijo };
      result = unwrapResult(
        await dispatch(ZPL_ImpresionesSliceRequests.GetAllByTipoEtiquetaAndFamiliaAndPrefijo(params))
      );
    }
    if (result) {
      if (result.length > 0) {
        result.reverse();
        setImpresiones(result);
      } else setImpresiones(null);
    }
  };

  const getAppUsers = async () => {
    let result: Array<IAppUser> = [];
    result = unwrapResult(await dispatch(AppUserSliceRequests.getAllRequest()));
    if (result) {
      setAppUsers(result);
    } else setAppUsers([]);
  };

  useEffect(() => {
    getImpresiones();
    getAppUsers();
  }, []);

  const getUser = (row) => {
    const userSelected = appUsers.find((x) => x.id == row.idUsuario);
    if (userSelected) return userSelected.operator.name + " " + userSelected.operator.surname;
  };

  return (
    <div>
      {impresiones != null ? (
        <TitleUIComponent title="IMPRESIONES HISTORICAS" classNameDiv="" classNameTitle="" />
      ) : (
        <TitleUIComponent title="NO EXISTEN IMPRESIONES HISTORICAS" classNameDiv="" classNameTitle="" />
      )}
      {
        impresiones != null ? (
          <TableComponent
            Dense={true}
            Overflow={true}
            buscar={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Numero Desde",
                field: "numeradorDesde"
              },
              {
                title: "Numero Hasta",
                field: "numeradorHasta"
              },
              {
                title: "Usuario",
                field: "",
                render: (row) => {
                  return getUser(row);
                }
              },
              {
                title: "Fecha Impresion",
                field: "",
                render: (row) => {
                  return moment(row?.impresoFecha).format("L");
                }
              },
              {
                title: "Prefijo",
                field: "prefijo"
              }
            ]}
            dataInfo={impresiones}
          />
        ) : (
          ""
        ) /* (
        <div className="text-center">
          <Typography variant="h2" gutterBottom>
            No Existen Impresiones
          </Typography>
        </div>
      ) */
      }
    </div>
  );
};
