/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { unwrapResult } from "@reduxjs/toolkit";
import { IOQCReprocesoCelulares } from "app/models/IOQCReprocesoCelulares";
import { OQCReprocesoCelularesSliceRequest } from "app/features/oqcGeneral/slices/OQCReprocesoCelularesSlice";

export const OQCPuestoControl = () => {
  const {
    control,
    setValue,
    trigger,
    formState: { errors }
  } = useForm();

  const reproceso = useAppSelector((state) => state.oqcReprocesoCelulares.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const handleKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    let reprocesoEncontrado: IOQCReprocesoCelulares;

    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      if (inputActual) {
        const esValido = await trigger(inputActual.name);
        if (!esValido) {
          inputActual.select();
          return;
        }
        if (index === 0) {
          reprocesoEncontrado = unwrapResult(
            await dispatch(OQCReprocesoCelularesSliceRequest.GetSampleByTrackId(inputActual.value))
          );
          if (reprocesoEncontrado) {
            openNotificationUI("Se encontro un reproceso valido", "success");
          } else {
            openNotificationUI("No se encontro un reproceso con este Track ID", "error");
            inputActual.select();
            return;
          }
        }
        const siguienteInput = inputs[index + 1]?.querySelector("input") as HTMLInputElement | null;
        if (siguienteInput && siguienteInput instanceof HTMLElement) {
          siguienteInput.focus();
        }
        if (index === 2) {
          openNotificationUI("Se validaron los datos de la muestra con exito", "success");
          setValue("trackId", "");
          setValue("msn", "");
          setValue("serieNewsan", "");
          const volverInicial = inputs[0]?.querySelector("input") as HTMLInputElement | null;
          volverInicial.focus();
        }
      }
    }
  };

  const validarMsn = (value: string, index: number) => {
    if (value != reproceso.msn && index == 1) {
      return "El codigo msn es incorrecto";
    } else {
      return true;
    }
  };

  const validarNumeroSerie = (value: string, index: number) => {
    if (value !== reproceso.numeroSerie && index == 2) {
      return "El codigo de serie es incorrecto";
    } else {
      return true;
    }
  };

  return (
    <main className="flex flex-col gap-y-4">
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese un Track ID"
        nameInput="trackId"
        valueDefault=""
        requiredBool
        errors={errors}
        onKeyUpFunction
        onKeyUp={handleKey}
        typeInput="standard"
      />
      <TextFieldComponent
        control={control}
        index={1}
        labelInput="Ingrese el codigo MSN"
        nameInput="msn"
        valueDefault=""
        requiredBool
        onKeyUpFunction
        onKeyUp={handleKey}
        validacionAdicionales={validarMsn}
        errors={errors}
        typeInput="standard"
      />
      <TextFieldComponent
        control={control}
        index={2}
        labelInput="Ingrese el codigo de serie"
        nameInput="serieNewsan"
        valueDefault=""
        requiredBool
        onKeyUpFunction
        onKeyUp={handleKey}
        errors={errors}
        validacionAdicionales={validarNumeroSerie}
        typeInput="standard"
      />
    </main>
  );
};
