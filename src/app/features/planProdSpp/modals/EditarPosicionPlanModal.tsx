/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { PlanProdSppSliceRequest } from "../reducers/PlanProdSppSlice";
import { CambiarPosicionDTO } from "../models/DTOS/CambiarPosicionDTO";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { unwrapResult } from "@reduxjs/toolkit";
import FetchApi from "app/shared/helpers/FetchApi";
import { InfoRounded } from "@mui/icons-material";
import { tooltipClasses, Typography, Button, TooltipProps, Tooltip, styled } from "@mui/material";
import { AyudaPlanificacion } from "../models/DTOS/AyudaPlanificacionDTO";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { StatesFormModalsSlice } from "../reducers/StatesForModalsSlice";
import { debounce } from "lodash";
import { IPlanProdSpp } from "../models/IPlanProdSpp";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9"
  }
}));

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  planesFiltrados: IPlanProdSpp[];
}

export const EditarPosicionPlanModal: React.FC<Props> = ({ setOpenModal, openModal, planesFiltrados }) => {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { isValid, errors }
  } = useForm();

  const lineaProduccion = useAppSelector((state) => state.lineaProduccion.object);
  const { mesSeleccionado, listaPosiciones, listaPosicionesOriginal, mesFinSeleccionado, listaMeses } = useAppSelector(
    (state) => state.statesFormModals
  );
  const planProduccionSpp = useAppSelector((state) => state.planProdSpp.dataAll);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPut } = useFetchApiMultiResults();
  const { getConfirmation } = useConfirmationDialog();

  const [cambioValido, setCambioValido] = useState(false);

  const [ayudaPlanificacion, setAyudaPlanificacion] = useState<AyudaPlanificacion[]>([]);
  FetchApi(
    PlanProdSppSliceRequest.GetAllPlansByNumberPosition,
    { posiciones: listaPosiciones, mesProduccion: listaMeses, lineaProduccionId: lineaProduccion.id },
    false,
    openModal,
    setAyudaPlanificacion,
    true
  );

  const onSubmit = async (data) => {
    const { actualizacionPlan, listaPosiciones } = cambiarPosiciones(data);
    const objetoPost: CambiarPosicionDTO = {
      posiciones: listaPosiciones,
      mesProduccion: listaMeses,
      lineaProduccionId: lineaProduccion.id,
      planProdCambio: listaPosicionesOriginal
    };
    try {
      if (
        await getConfirmation(
          "Cambiar Posiciones",
          "Si se encuentra algun plan con una de las posiciones ingresadas se intercambiaran las posiciones, ¿Desea continuar?",
          null,
          "Actualizar"
        )
      ) {
        const response = unwrapResult(await dispatch(PlanProdSppSliceRequest.SearchPosisitonsByNumbers(objetoPost)));
        if (response) {
          FetchPut({
            consoleLog: false,
            modelPut: actualizacionPlan,
            sliceRequest: PlanProdSppSliceRequest.multiPutRequest,
            activeConfirmation: false,
            functionAdd: async () => {
              openNotificationUI("Se cambiaron las posiciones con exito", "success");
              await dispatch(
                PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId({
                  lineaProduccionId: lineaProduccion.id,
                  mesInicio: mesSeleccionado,
                  mesFin: mesFinSeleccionado
                })
              );
              setOpenModal(false);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error intentando cambiar las posiciones", "error");
    }
  };

  const handleKey = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const inputs = document.querySelectorAll(".MuiFormControl");
    const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
    if (!inputActual) return;
    debouncedProcesarInput(inputActual, index);
  };
  const debouncedProcesarInput = debounce(async (inputActual: HTMLInputElement, index: number) => {
    const esValido = await trigger(inputActual.name);
    if (!esValido) {
      inputActual.select();
      setCambioValido(false);
      return;
    }
    if (inputActual.value === "1") {
      openNotificationUI("El número 1 no está permitido", "warning");
      inputActual.select();
      setCambioValido(false);
      return;
    }
    if (inputActual.value === "99") {
      openNotificationUI("El número 99 no está permitido", "warning");
      inputActual.select();
      setCambioValido(false);
      return;
    }
    const valorNumerico = parseInt(inputActual.value, 10);
    if (isNaN(valorNumerico) || valorNumerico > planProduccionSpp.length) {
      openNotificationUI("El número ingresado es mayor a la cantidad de planes disponibles", "error");
      inputActual.select();
      setCambioValido(false);
      return;
    }
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const clonPosiciones = listaPosiciones.map((elementos, indexNumber) =>
        index === indexNumber ? valorNumerico : elementos
      );
      const unicos = new Set(clonPosiciones);
      if (unicos.size !== listaPosiciones.length) {
        openNotificationUI("Error! Los números no pueden ser iguales", "error");
        inputActual.select();
        setCambioValido(false);
        return;
      }
      setCambioValido(true);
      const response = unwrapResult(
        await dispatch(
          PlanProdSppSliceRequest.GetAllPlansByNumberPosition({
            posiciones: clonPosiciones,
            mesProduccion: listaMeses,
            lineaProduccionId: lineaProduccion.id
          })
        )
      );
      if (response) {
        const todosValidos = response.every(
          (r) => r.planesAux.planAnterior !== null && r.planesAux.planSiguiente !== null
        );
        if (todosValidos) {
          setAyudaPlanificacion(response);
          dispatch(StatesFormModalsSlice.actions.setListaPosiciones(clonPosiciones));
        } else {
          openNotificationUI("El plan ingresado no tiene un plan anterior o siguiente como ayuda", "info");
          setAyudaPlanificacion(response);
          dispatch(StatesFormModalsSlice.actions.setListaPosiciones(clonPosiciones));
        }
      }
    } catch (error) {
      console.error(error);
      openNotificationUI("Se generó un error buscando la posición ingresada", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, 500);

  const cambiarPosiciones = (formData) => {
    try {
      const planes = Object.keys(formData);
      const nuevasPosiciones: string[] = Object.values(formData);
      const parsePosiciones = nuevasPosiciones.map((elementos) => {
        return parseInt(elementos, 10);
      });
      const actualizacionPlan = planes.map((elementos, index) => {
        const nuevaPosicion = planesFiltrados.find((plan) => plan.id === parseInt(elementos, 10));
        const clonPlan = {
          ...nuevaPosicion,
          position: nuevasPosiciones[index]
        };
        delete clonPlan.modelo;
        return clonPlan;
      });
      return {
        actualizacionPlan: actualizacionPlan,
        listaPosiciones: parsePosiciones
      };
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error cambiando las posiciones", "error");
    }
  };

  return (
    <main className="w-[30vw]">
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        {planesFiltrados.map((elementos, index) => (
          <div key={index} className="flex flex-row items-center gap-x-4">
            <TextFieldComponent
              key={index}
              control={control}
              index={index}
              labelInput={`Ingrese la posicion para el modelo: ${elementos.modelo.nombre} - PO: ${elementos.po}`}
              nameInput={elementos.id.toString()}
              valueDefault={elementos.position.toString()}
              requiredBool
              disabled={elementos.position === 1}
              errors={errors}
              onKeyUpFunction
              onKeyUp={handleKey}
            />
            {ayudaPlanificacion && ayudaPlanificacion.length > 0 && (
              <div>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">Informacion nueva composicion del plan</Typography>
                      {ayudaPlanificacion[index].planesAux.planAnterior && (
                        <p>
                          Este plan quedaria entre el {ayudaPlanificacion[index].planesAux.planAnterior.modelo.nombre}{" "}
                          con el numero de lote {ayudaPlanificacion[index].planesAux.planAnterior.lote}
                        </p>
                      )}
                      <br />
                      {ayudaPlanificacion[index].planesAux.planSiguiente && (
                        <p>
                          Y el modelo {ayudaPlanificacion[index].planesAux.planSiguiente.modelo.nombre} con el numero de
                          lote {ayudaPlanificacion[index].planesAux.planSiguiente.lote}
                        </p>
                      )}
                    </React.Fragment>
                  }>
                  <Button>
                    <InfoRounded />
                  </Button>
                </HtmlTooltip>
              </div>
            )}
          </div>
        ))}
        <FormButtons
          onCancel={() => {
            setOpenModal(false);
          }}
          disabled={!isValid || !cambioValido}
        />
      </form>
    </main>
  );
};
