/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { unwrapResult } from "@reduxjs/toolkit";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { XXE_WIP_ITF_SERIE_HistorySliceRequest } from "app/Middleware/reducers/XXE_WIP_ITF_SERIE_History";
import { IOQCReprocesoCelulares } from "app/models/IOQCReprocesoCelulares";
import { IAppUser } from "app/models";
import { IDatesMotorola } from "app/models/sfcsplus/IDatesMotorola";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCReprocesoCelularesSliceRequest } from "app/features/oqcGeneral/slices/OQCReprocesoCelularesSlice";

export const OQCPuestoEmbalajeSinValidacion = () => {
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm();

  const lineaProduccion = useAppSelector((state) => state.lineaProduccion.object);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [listaReprocesos, setListaReprocesos] = useState<IXXE_WIP_ITF_SERIE[]>([]);
  const [listaReprocesosTabla, setListaReprocesosTabla] = useState<IOQCReprocesoCelulares[]>([]);

  const handleKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    let reprocesoEncontrado: IXXE_WIP_ITF_SERIE[];
    let reprocesosTabla: IOQCReprocesoCelulares[];

    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      reprocesoEncontrado = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.GetByLPN(inputActual.value)));
      reprocesosTabla = unwrapResult(
        await dispatch(OQCReprocesoCelularesSliceRequest.GetListSamplesByLpn(inputActual.value))
      );
      if (inputActual) {
        const esValido = await trigger(inputActual.name);
        if (!esValido) {
          inputActual.select();
          return;
        }
      }
      const siguienteInput = inputs[index + 1]?.querySelector("input") as HTMLInputElement | null;
      if (reprocesoEncontrado.length > 0) {
        setListaReprocesos(reprocesoEncontrado);
        siguienteInput.focus();
      } else {
        const registroLpn = unwrapResult(
          await dispatch(XXE_WIP_ITF_SERIE_HistorySliceRequest.GetByLpn(inputActual.value))
        );
        if (registroLpn.length > 0) {
          setListaReprocesos(registroLpn);
          openNotificationUI("Se encontraron registros con esta LPN", "success");
          siguienteInput.focus();
        } else {
          setListaReprocesos([]);
          openNotificationUI("No se encontraron registros con esta LPN", "warning");
        }

        if (reprocesosTabla.length > 0) {
          setListaReprocesosTabla(reprocesosTabla);
        } else {
          setListaReprocesosTabla([]);
        }
      }
    }
  };

  const validarImeiKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const lpn = watch("lpn");

    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;

      const imeiIngresado = unwrapResult(
        await dispatch(OQCReprocesoCelularesSliceRequest.GetSampleByImeiCode(inputActual.value))
      );
      if (imeiIngresado) {
        inputActual.select();
        openNotificationUI("El IMEI ya se encuentra registrado", "warning");
        return;
      }

      const equipoEncontrado = listaReprocesos.find((item) => item.referenciA_1 === inputActual.value);
      if (equipoEncontrado) {
        const datosCelulares = unwrapResult(
          await dispatch(OQCDesignadaResultadoSliceRequests.GetAllDatesMotorola(inputActual.value))
        );
        const nuevoReproceso = generateReproceso(equipoEncontrado, datosCelulares);
        const response = unwrapResult(await dispatch(OQCReprocesoCelularesSliceRequest.PostRequest(nuevoReproceso)));
        if (response) {
          setValue("imei1", "");
          inputActual.focus();
          const reprocesoEncontrado = unwrapResult(
            await dispatch(OQCReprocesoCelularesSliceRequest.GetListSamplesByLpn(lpn))
          );
          setListaReprocesosTabla(reprocesoEncontrado);
          openNotificationUI("Equipo validado correctamente", "success");
        }
      } else {
        openNotificationUI("El IMEI ingresado no se encuentra en esta LPN", "warning");
      }
    }
  };

  const generateReproceso = (equipoEncontrado: IXXE_WIP_ITF_SERIE, datosCelulares: IDatesMotorola[]) => {
    const msn = datosCelulares.find((item) => item.codigoPuesto === "msn")?.codigo;
    const numeroSerie = datosCelulares.find((item) => item.codigoPuesto === "Newsan")?.codigo;
    const imei2 = datosCelulares.find((item) => item.codigoPuesto === "imei2")?.codigo;
    const trackId = datosCelulares.find((item) => item.codigoPuesto === "Trackid")?.codigo;

    const nuevoReproceso: IOQCReprocesoCelulares = {
      imei1: equipoEncontrado.referenciA_1,
      lineaProduccionId: lineaProduccion.id,
      lpn: equipoEncontrado.lpn,
      imei2: imei2 ? imei2 : null,
      msn: msn,
      numeroSerie: numeroSerie,
      operatorid: infoUser.operatorId,
      validado: true,
      trackId: trackId,
      oqcPaletId: 4021
    };
    return nuevoReproceso;
  };

  useEffect(() => {
    const inputs = document.querySelectorAll(".MuiFormControl");
    const inputActual = inputs[0]?.querySelector("input") as HTMLInputElement | null;
    inputActual?.focus();
  }, []);

  return (
    <main>
      <TextFieldComponent
        control={control}
        index={0}
        labelInput="Ingrese un Nro.LPN"
        nameInput="lpn"
        valueDefault=""
        autoFocus
        requiredBool
        errors={errors}
        onKeyUpFunction
        onKeyUp={handleKey}
        typeInput="standard"
      />
      <TextFieldComponent
        control={control}
        index={1}
        labelInput="Ingrese un Nro de IMEI"
        nameInput="imei1"
        valueDefault=""
        requiredBool
        errors={errors}
        onKeyUpFunction
        onKeyUp={validarImeiKey}
        typeInput="standard"
      />
      {listaReprocesosTabla && listaReprocesosTabla.length > 0 && (
        <section>
          <TableComponent
            IDcolumn="id"
            buscar
            dataInfo={listaReprocesosTabla}
            columns={[
              {
                title: "IMEI 1",
                field: "imei1"
              },
              {
                title: "IMEI 2",
                field: "",
                render: (row: IOQCReprocesoCelulares) => {
                  return <>{row.imei2 !== null ? <p>{row.imei2}</p> : <p>-</p>}</>;
                }
              },
              {
                title: "Caja Master",
                field: "lpn"
              },
              {
                title: "Numero Serie",
                field: "numeroSerie"
              },
              {
                title: "Track ID",
                field: "trackId"
              },
              {
                title: "Validado",
                field: "",
                render: (row: IOQCReprocesoCelulares) => {
                  return <>{row.validado ? <p>Si</p> : <p>No</p>}</>;
                }
              }
            ]}
          />
        </section>
      )}
    </main>
  );
};
