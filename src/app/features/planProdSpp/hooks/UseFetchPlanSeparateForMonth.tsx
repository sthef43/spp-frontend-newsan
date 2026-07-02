import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { StatesFormModalsSlice } from "../reducers/StatesForModalsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlanProdSppSliceRequest } from "../reducers/PlanProdSppSlice";
import { PlanProdSppEmbarqueSlice } from "../reducers/PlanProdSppEmbarqueSlice";
import { IPlanProdSpp } from "../models/IPlanProdSpp";

export function UseFetchPlanSeparateForMonth() {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  //Funcion que directamente trae el plan de produccion separado por lo meses al cual corresponde cada uno de los planes
  const getAllPlan = async (
    lineaSeleccionada: number,
    fechaSeleccionadaMesNombre: string,
    fechaFinSeleccionadaMesNombre: string
  ) => {
    const listaIndexMayor = [];
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId({
            lineaProduccionId: lineaSeleccionada,
            mesInicio: fechaSeleccionadaMesNombre,
            mesFin: fechaFinSeleccionadaMesNombre
          })
        )
      );
      if (response) {
        response.map((elementos) => {
          if (elementos.mes) {
            const aux = {
              mes: elementos.mes,
              position: elementos.position
            };
            listaIndexMayor.push(aux);
          }
        });
        const maximasPosicions = listaIndexMayor.reduce((acc, current) => {
          const { mes, position } = current;
          if (!acc[mes] || position < acc[mes]) {
            acc[mes] = position;
          }
          return acc;
        }, {});
        const resultadoFinal = Object.keys(maximasPosicions).map((mes) => {
          return {
            mes: mes,
            position: maximasPosicions[mes]
          };
        });
        dispatch(StatesFormModalsSlice.actions.setListaMesAndPosicionMasAlta(resultadoFinal));
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error buscandos los planes", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //Funcion que dependiendo de lo que me de el response separo segun los meses
  const refreshPlanByFetchComplete = (response: IPlanProdSpp[], setOpenModal?: (newValue: boolean) => void) => {
    const listaIndexMayor = [];
    if (response) {
      response.map((elementos) => {
        if (elementos.mes) {
          const aux = {
            mes: elementos.mes,
            position: elementos.position
          };
          listaIndexMayor.push(aux);
        }
      });
      const maximasPosicions = listaIndexMayor.reduce((acc, current) => {
        const { mes, position } = current;
        if (!acc[mes] || position < acc[mes]) {
          acc[mes] = position;
        }
        return acc;
      }, {});
      const resultadoFinal = Object.keys(maximasPosicions).map((mes) => {
        return {
          mes: mes,
          position: maximasPosicions[mes]
        };
      });
      dispatch(StatesFormModalsSlice.actions.setListaMesAndPosicionMasAlta(resultadoFinal));
    }
    openNotificationUI("Se actualizo el plan de produccion con exito", "success");
    dispatch(PlanProdSppEmbarqueSlice.actions.setEmptyPreCarga());
    if (setOpenModal && setOpenModal) {
      setOpenModal(false);
    }
  };
  return { getAllPlan, refreshPlanByFetchComplete };
}
