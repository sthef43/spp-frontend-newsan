import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { IOQCReprocesoCelulares } from "app/models/IOQCReprocesoCelulares";
import { unwrapResult } from "@reduxjs/toolkit";
import { TableComponent } from "../../../../../../../../../shared/components/Table/TableComponent";
import { OQCReprocesoCelularesSliceRequest } from "app/features/oqcGeneral/slices/OQCReprocesoCelularesSlice";

export const OQCPuestoEmbalaje = () => {
  const {
    control,
    setValue,
    trigger,
    watch,
    formState: { errors }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [listaReprocesos, setListaReprocesos] = useState<IOQCReprocesoCelulares[]>([]);

  const handleKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    let reprocesoEncontrado: IOQCReprocesoCelulares[];

    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      reprocesoEncontrado = unwrapResult(
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
      if (reprocesoEncontrado) {
        setListaReprocesos(reprocesoEncontrado);
        siguienteInput.focus();
      } else {
        openNotificationUI("No se encontraron reprocesos con esta lpn", "warning");
      }
    }
  };

  const validarImeiKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const lpn = watch("lpn");

    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      const equipoEncontrado = listaReprocesos.find((item) => item.imei1 === inputActual.value);
      if (equipoEncontrado) {
        const equipoEncontradClon = { ...equipoEncontrado, validado: true };
        if (equipoEncontrado.validado) {
          openNotificationUI("El equipo ya se encuentra validado", "warning");
          inputActual.select();
          return;
        }
        const response = unwrapResult(
          await dispatch(OQCReprocesoCelularesSliceRequest.PutRequest(equipoEncontradClon))
        );
        if (response) {
          setValue("imei1", "");
          inputActual.focus();
          const reprocesoEncontrado = unwrapResult(
            await dispatch(OQCReprocesoCelularesSliceRequest.GetListSamplesByLpn(lpn))
          );
          setListaReprocesos(reprocesoEncontrado);
          openNotificationUI("Equipo validado correctamente", "success");
        }
      } else {
        openNotificationUI("El IMEI ingresado no se encuentra en esta LPN", "warning");
      }
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll(".MuiFormControl");
    const inputActual = inputs[0]?.querySelector("input") as HTMLInputElement | null;
    inputActual?.focus();
  }, []);

  return (
    <main className="flex flex-col gap-y-4">
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
      {listaReprocesos && listaReprocesos.length > 0 && (
        <section>
          <TableComponent
            IDcolumn="id"
            buscar
            dataInfo={listaReprocesos}
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
