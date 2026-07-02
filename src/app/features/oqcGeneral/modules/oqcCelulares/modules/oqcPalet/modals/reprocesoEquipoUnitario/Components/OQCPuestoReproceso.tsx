import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { IDatesMotorola } from "app/models/sfcsplus/IDatesMotorola";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { IOQCReprocesoCelulares } from "app/models/IOQCReprocesoCelulares";
import { IAppUser } from "app/models";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCReprocesoCelularesSliceRequest } from "app/features/oqcGeneral/slices/OQCReprocesoCelularesSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const OQCPuestoReproceso = () => {
  const {
    control,
    trigger,
    setValue,
    formState: { errors }
  } = useForm();

  const lineaProduccion = useAppSelector((state) => state.lineaProduccion.object);
  const paletSeleccionado = useAppSelector((state) => state.oqcPalet.object);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPost } = useFetchApiMultiResults();

  const handleKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    let response: IDatesMotorola[];
    let reprocesoEncontrado: IOQCReprocesoCelulares;

    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      response = unwrapResult(
        await dispatch(OQCDesignadaResultadoSliceRequests.GetAllDatesMotorola(inputActual.value))
      );
      reprocesoEncontrado = unwrapResult(
        await dispatch(OQCReprocesoCelularesSliceRequest.GetSampleByTrackId(inputActual.value))
      );
      if (inputActual) {
        const esValido = await trigger(inputActual.name);
        if (!esValido) {
          inputActual.select();
          return;
        }
        if (reprocesoEncontrado) {
          openNotificationUI("Se encontro este Track Id ya ingresado para reproceso", "error");
          inputActual.select();
          return;
        }
        if (response) {
          const reprocesoIgresado = generarNuevoReproceso(response, inputActual.value);
          FetchPost(OQCReprocesoCelularesSliceRequest.PostRequest, reprocesoIgresado, false, async () => {
            openNotificationUI("Se ingreso el reproceso con exito", "success");
            setValue("trackId", "");
            inputActual.focus();
          });
        }
      }
    }
  };

  const generarNuevoReproceso = (datosMuestra: IDatesMotorola[], inputValue: string) => {
    const buscarCodigo = datosMuestra.find((elementos) => {
      return elementos.codigoPuesto == "imei2";
    });
    const imei2 = buscarCodigo ? buscarCodigo.codigo : null;
    try {
      const nuevoReproceso: IOQCReprocesoCelulares = {
        imei1: datosMuestra.find((elementos) => {
          return elementos.codigoPuesto == "imei";
        }).codigo,
        imei2: imei2 ? imei2 : null,
        msn: datosMuestra.find((elementos) => {
          return elementos.codigoPuesto == "msn";
        }).codigo,
        numeroSerie: datosMuestra.find((elementos) => {
          return elementos.codigoPuesto == "Newsan";
        }).codigo,
        lpn: datosMuestra.find((elementos) => {
          return elementos.codigoPuesto.toLowerCase().includes("en caja");
        }).codigo,
        trackId: inputValue,
        validado: false,
        lineaProduccionId: lineaProduccion.id,
        oqcPaletId: paletSeleccionado.id,
        operatorid: infoUser.operatorId
      };
      console.log(nuevoReproceso);
      if (nuevoReproceso !== null) {
        return nuevoReproceso;
      }
    } catch (error) {
      openNotificationUI(`Ocurrio un error genrando el nuevo reproceso: ${error}`, "error");
    }
  };

  return (
    <main>
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese un Track ID"
        nameInput="trackId"
        valueDefault=""
        requiredBool
        errors={errors}
        onKeyUp={handleKey}
        onKeyUpFunction
        autoFocus
        typeInput="standard"
      />
    </main>
  );
};
