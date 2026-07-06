/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { IAppUser, IInicio } from "app/models";
import moment from "moment";
import { InicioHistorySliceRequests } from "app/Middleware/reducers/InicioHistorySlice";
import { ITrazaManual } from "app/models/ITrazaManual";
import { TrazaManualHistorySliceRequests } from "app/features/calidad/slices/TrazaManualHistorySlice";
import { TrazaManualSliceRequests } from "app/features/calidad/slices/TrazaManualSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  infoTraza: IInicio;
}

export const ReasignarNumeroTraza: React.FC<Props> = ({ setOpenModal, openModal, infoTraza }) => {
  const {
    control,
    trigger,
    setValue,
    formState: { errors, isValid }
  } = useForm();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  //--- Validaciones de si el numero de serie tiene asignado otros datos ---

  //Valida si el numero de serie ya tiene un manual
  const validarSiTieneManual = async (numeroSerie: string) => {
    let result;
    try {
      result = unwrapResult(await dispatch(TrazaManualSliceRequests.getByNroSerie(numeroSerie)));
      return result;
    } catch (e) {
      openNotificationUI(`${e}`, "error");
    }
  };

  //Valida si el codigo de trazabilidad ya existe
  const existeCodigoTrazabilidad = async (codigoTrazabilidadDestino) => {
    let result;
    try {
      result = unwrapResult(
        await dispatch(InicioSliceRequests.getByCodigoTrazabilidadDisponible(codigoTrazabilidadDestino))
      );
      return result ? true : false;
    } catch (e) {
      openNotificationUI(`${e}`, "error");
    }
  };

  //--- Validaciones de si el numero de serie tiene asignado otros datos ---

  //Validaciones anteriores antes de poder cambiar la trazabilidad
  const validarAntesDeCambiarTrazabilidad = async (codigoTrazabilidadDestino) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const validarManual = await existeCodigoTrazabilidad(codigoTrazabilidadDestino);
      if (validarManual) {
        openNotificationUI("El numero de trazabilidad ya esta ocupado por otro numero de serie", "error");
        return false;
      }
      return true;
    } catch (e) {
      openNotificationUI(`${e}`, "error");
      return false;
    }
  };

  //--- Cambio la trazabilidad y genero el registro de trazabilidad para el historico ---
  const cambiarTrazabilidad = async (codigoTrazabilidadDestino) => {
    try {
      const nuevaTraza = generarNuevoInicio(codigoTrazabilidadDestino);
      await dispatch(
        InicioHistorySliceRequests.PostRequest({
          ...infoTraza,
          id: 0,
          userName: infoUser.operator.name + " " + infoUser.operator.surname,
          codigoTrazabilidad: codigoTrazabilidadDestino,
          codigoTrazabilidadOriginal: infoTraza.codigoTrazabilidad
        })
      );

      const response = unwrapResult(
        await dispatch(
          InicioSliceRequests.cambiarTrazaRequest({
            inicio: nuevaTraza,
            trazaVieja: infoTraza.codigoTrazabilidad
          })
        )
      );

      if (response) {
        openNotificationUI("Trazabilidad cambiada exitosamente", "success");
        setOpenModal(false);
      }
    } catch (e) {
      openNotificationUI(`${e}`, "error");
    }
  };

  //--- Cambio la trazabilidad del manual y genero el registro de trazabilidad manual para el historico ---
  const changeTrazaSerieoManual = async (trazaManual, codTrazaD) => {
    try {
      const response = unwrapResult(
        await dispatch(TrazaManualSliceRequests.PutRequest({ ...trazaManual, trazabilidad: codTrazaD }))
      );
      const responseHistory = unwrapResult(
        await dispatch(TrazaManualHistorySliceRequests.PostRequest({ ...trazaManual, id: 0 }))
      );
      if (response && responseHistory) {
        openNotificationUI("Trazabilidad cambiada exitosamente", "success");
        setOpenModal(false);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  //--- Valido que antes de hacer el update el codigo de trazabilidad no este ocupado ---
  //--- una vez validado que el codigo de trazabilidad no esta ocupado procedo a hacer el update con la traza del manual incluida dependiendo si se encontro traza manual ---
  const updateTrazabilidad = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index].querySelector("input") as HTMLInputElement | null;
      const esValido = await trigger(inputActual.name);
      if (!esValido) {
        inputActual.select();
        return;
      }
      if (isValid) {
        const regex = /[A-Z]\d+[A-Z]+/g;
        const familiaEntrante = inputActual.value.match(regex);
        const familiaOriginal = infoTraza.codigoTrazabilidad.match(regex);

        console.log(familiaEntrante, familiaOriginal);
        if (familiaEntrante[0] != familiaOriginal[0]) {
          openNotificationUI("Las familias no coinciden", "error");
          inputActual.select();
          return;
        }
        try {
          dispatch(LoadingUISlice.actions.LoadingUIOpen());
          const validarTrazabilidad = await validarAntesDeCambiarTrazabilidad(inputActual.value);
          if (!validarTrazabilidad) {
            inputActual.select();
            return;
          }
          const validarTrazabilidadManual: ITrazaManual = await validarSiTieneManual(infoTraza.codigoNewsan);
          if (validarTrazabilidadManual && validarTrazabilidadManual.trazabilidad !== inputActual.value) {
            await changeTrazaSerieoManual(validarTrazabilidadManual, inputActual.value);
          }
          cambiarTrazabilidad(inputActual.value);
        } catch (error) {
          openNotificationUI(`${error}`, "error");
        } finally {
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        }
      }
    }
  };

  //--- Genero el nuevo inicio ---
  const generarNuevoInicio = (trazaNueva: string) => {
    const fechaActual = moment().format("YYYY-MM-DD HH:mm:ss");
    const horaDesdeFormat = moment().format("HH:mm:ss");

    const inicio: IInicio = {
      idInicio: infoTraza.idInicio,
      fecha: fechaActual,
      turno: "M",
      idProduccion: infoTraza.idProduccion,
      tipoUnidad: infoTraza.tipoUnidad,
      codigoTrazabilidad: trazaNueva,
      codigoNewsan: null,
      fechaFin: null,
      nombreInicio: infoTraza.nombreInicio,
      nombreFin: null,
      turnoFin: null,
      hora: horaDesdeFormat,
      horaFin: null,
      observaciones: null,
      compresor: null,
      codigoNewsan2: infoTraza.codigoNewsan2,
      idModelo: null,
      montado: null,
      fechaMontado: null,
      horaMontado: null,
      modeloFin: null,
      nroOp: null,
      organizacion: null,
      lote: null,
      target: null,
      nroLpn: null,
      codigoEvaporador: null,
      idProveedor: null
    };

    return inicio;
  };

  useEffect(() => {
    TitleChanger("Reasignar Numero Traza");
  }, []);

  return (
    <main className="w-[60vw]">
      <section className="flex flex-row justify-between w-full gap-x-4">
        <TextFieldComponent
          control={control}
          nameInput="numeroNewsan"
          labelInput="Numero Serie"
          requiredBool
          errors={errors}
          valueDefault={infoTraza.codigoNewsan}
          index={0}
          disabled
        />
        <TextFieldComponent
          control={control}
          nameInput="trazaActual"
          labelInput="Trazabilidad Actual"
          requiredBool
          errors={errors}
          valueDefault={infoTraza.codigoTrazabilidad}
          index={1}
          disabled
        />
        <TextFieldComponent
          control={control}
          nameInput="trazaNueva"
          labelInput="Trazabilidad Nueva"
          requiredBool
          errors={errors}
          valueDefault={""}
          index={2}
          onKeyUp={updateTrazabilidad}
          onKeyUpFunction
          autoFocus
        />
      </section>
    </main>
  );
};
