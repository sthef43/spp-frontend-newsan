/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Grow } from "@mui/material";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { IRechazo } from "app/models/IRechazo";
import { IInicio, ILinea, IModelos } from "app/models";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import moment from "moment";
import FetchApi from "app/shared/helpers/FetchApi";

export const RechazarCodigoNewsan = () => {
  const {
    control,
    trigger,
    setValue,
    formState: { errors }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { FetchPost } = useFetchApiMultiResults();
  const dispatch = useAppDispatch();

  const [rechazosIngresados, setRechazosIngresados] = useState<IRechazo[]>([]);
  FetchApi<IRechazo[]>(RechazoSliceRequests.GetAllRejectionByDrain, null, false, null, setRechazosIngresados, false);

  const [dataCodigo, setDataCodigo] = useState([]);

  const rechazarCodigoNewsan = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index].querySelector("input") as HTMLInputElement | null;
      const esValido = await trigger(inputActual.name);
      if (!esValido) {
        inputActual.select();
        return;
      }
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen());
        const response = unwrapResult(
          await dispatch(InicioSliceRequests.GetInicioEndedByCodigoNewsan(inputActual.value))
        );
        if (response) {
          setDataCodigo((prev) => prev.concat(response));
          const modelo = unwrapResult(await dispatch(ModelosSliceRequests.getModeloByName(response.modeloFin)));
          const linea = unwrapResult(await dispatch(LineaSliceRequests.GetByCodigoInicio(response.codigoNewsan2)));
          const nuevoRechazo = generarModeloRechazo(response, modelo, linea);
          if (modelo && linea && nuevoRechazo) {
            recharEquipoPorFuga(nuevoRechazo);
          }
        }
      } catch (error) {
        console.log(error);
        openNotificationUI(`${error}`, "error");
        setDataCodigo([]);
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  const recharEquipoPorFuga = async (rechazo: IRechazo) => {
    FetchPost(
      RechazoSliceRequests.AddRechazo,
      rechazo,
      false,
      async () => {
        setValue("codigoNewsan", "");
        openNotificationUI("Se agrego el rechazo", "success");
        const response = unwrapResult(await dispatch(RechazoSliceRequests.GetAllRejectionByDrain()));
        setRechazosIngresados(response);
      },
      true
    );
  };

  const generarModeloRechazo = (responseInicio: IInicio, responseModelo: IModelos, responseLinea: ILinea) => {
    const horaActual = formatDateHourOrMinutes({
      optionDate: "onlyHourAndDate",
      optionHour: "fechaAutomatica",
      fechaIngresada: null
    });

    const fechaActual = moment().format("YYYY-MM-DD HH:mm:ss");
    const horaHastaFormat = moment().add(1, "hours").format("HH:mm:ss");
    const horaDesdeFormat = moment().format("HH:mm:ss");

    const rechazo: IRechazo = {
      barcode: responseInicio.codigoTrazabilidad,
      cantidad: 1,
      turno: responseInicio.turno.trim(),
      fecha: fechaActual,
      familia: responseModelo.capacidadTipo.trim(),
      descripcionRechazo: "Fuga",
      puesto: "Fuga 24 Horas",
      estado: "R",
      codigoRechazo: 176,
      idCodigoRechazo: 176,
      linea: "",
      idLinea: responseLinea.idLinea,
      hora: horaActual,
      horaDesde: horaDesdeFormat,
      horaHasta: horaHastaFormat
    };
    return rechazo;
  };

  useEffect(() => {
    TitleChanger("Rechazar Codigo Newsan Por Fuga");
  }, []);

  return (
    <main className="flex flex-col w-full justify-center p-4">
      <header className="flex flex-col gap-y-2 items-center">
        <h2 className="text-2xl font-bold">Rechazar Codigo Newsan</h2>
        <TextFieldComponent
          nameInput="codigoNewsan"
          control={control}
          labelInput="Codigo Newsan"
          index={0}
          valueDefault=""
          autoFocus
          requiredBool
          errors={errors}
          onKeyUp={rechazarCodigoNewsan}
          onKeyUpFunction
        />
      </header>
      <Grow in={rechazosIngresados.length > 0} timeout={200}>
        <section className="mt-4">
          <TableComponent
            IDcolumn="idInicio"
            buscar
            columns={[
              {
                title: "Codigo Trazabilidad",
                field: "barcode"
              },
              {
                title: "Puesto",
                field: "puesto"
              },
              {
                title: "Rechazo",
                field: "descripcionRechazo"
              },
              {
                title: "Fecha",
                field: "fecha",
                render: (row) =>
                  formatDateHourOrMinutes({
                    optionDate: "fullDate",
                    fechaIngresada: row.fecha,
                    optionHour: "fechaBaseDatos"
                  })
              }
            ]}
            dataInfo={rechazosIngresados}
          />
        </section>
      </Grow>
    </main>
  );
};
