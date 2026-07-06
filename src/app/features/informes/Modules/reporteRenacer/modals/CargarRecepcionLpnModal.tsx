import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { RecepcionLpnSliceRequest } from "app/Middleware/reducers/RecepcionLpnSlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { useAppDispatch } from "app/core/store/store";
import { IOperator } from "app/models";
import { IRecepcionLpn } from "app/models/IRecepcionLpn";
import { ReporteRenacerLpn } from "app/models/Stored Procdure/ReporteRenacerLpn";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Sliders } from "app/shared/components/ui/Sliders";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  setReporteRenacerLpn: (newValue: ReporteRenacerLpn[]) => void;
}

export const CargarRecepcionLpnModal: React.FC<Props> = ({ openModal, setOpenModal, setReporteRenacerLpn }) => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const inputLpn = useRef<HTMLInputElement | null>(null);
  const codigoLpn = watch("numeroLpn");

  const [expandend, setExpanded] = useState<string | false>(false);
  const [opcionSlider, setOpcionSlider] = useState<string>("Agregar");

  const [listaRecepcionado, setListaRecepcionado] = useState<IRecepcionLpn[]>([]);
  FetchApi<IRecepcionLpn[]>(RecepcionLpnSliceRequest.GetAllByRecepcionado, null, false, null, setListaRecepcionado);

  const [sesionUsaurio, setSesionUsuario] = useState<IOperator>();
  FetchApi<IOperator>(OperatorSliceRequests.getInfoByDni, GetInfoUser().dni, false, openModal, setSesionUsuario);

  const cargarNuevaRecepcion = async () => {
    const recepcionFormateada = { ...recepcionEncontrada, operatorId: sesionUsaurio.id, recepcionado: true };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(await dispatch(RecepcionLpnSliceRequest.PutRequest(recepcionFormateada)));
      const listaRecepcion = unwrapResult(await dispatch(RecepcionLpnSliceRequest.GetAllByRecepcionado()));
      const reporteLpn = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.GetReporteTotalRenacer()));
      if (response) {
        setListaRecepcionado(listaRecepcion);
        setReporteRenacerLpn(reporteLpn);
        openNotificationUI("El LPN ingresado fue recepcionado", "success");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    setValue("numeroLpn", "");
  };

  const [recepcionEncontrada, setRecepcionEncontrada] = useState<IRecepcionLpn>();
  const buscarLpnEnviado = async (event: any) => {
    try {
      event.preventDefault();
      if (codigoLpn.length > 9) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(RecepcionLpnSliceRequest.GetRecepcionByLpn(codigoLpn)));
        if (response) {
          console.log(response);
          setRecepcionEncontrada(response);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const buscarLocalizador = () => {
    const lpnNoDisponibleRecepcion = lpnNoEnviada();
    if (lpnNoDisponibleRecepcion) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      cargarNuevaRecepcion();
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const lpnNoEnviada = () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
    try {
      if (recepcionEncontrada) {
        const lpnRecepcionada = listaRecepcionado.find((elementos) => {
          return elementos.lpn == codigoLpn && !recepcionEncontrada.recepcionado;
        });
        console.log(lpnRecepcionada);
        if (lpnRecepcionada) {
          return lpnRecepcionada;
        } else if (lpnRecepcionada === undefined) {
          openNotificationUI("La LPN no es valida para recepcionar", "error");
          inputLpn.current?.select();
          return;
        } else {
          openNotificationUI("No se encontro una lpn enviada", "error");
          inputLpn.current?.select();
          return;
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`${error}`, "error");
    }
  };

  const saberRecepcionado = (rowData: IRecepcionLpn) => {
    if (rowData.recepcionado) {
      return "Recepcionado";
    } else {
      return "Sin Recepcion";
    }
  };

  const saberEnvio = (rowData: IRecepcionLpn) => {
    if (rowData.enviado) {
      return "Recepcionado";
    } else {
      return "Sin Recepcion";
    }
  };

  const saberOperarioRecepcionado = (rowData: IRecepcionLpn) => {
    if (rowData.operator != null) {
      return `${rowData.operator.name} ${rowData.operator.surname}`;
    } else {
      return "Sin Recepcion";
    }
  };

  const saberOperarioEnviado = (rowData: IRecepcionLpn) => {
    if (rowData.operatorEnviado != null) {
      return `${rowData.operatorEnviado.name} ${rowData.operatorEnviado.surname}`;
    } else {
      return "Sin Recepcion";
    }
  };

  useEffect(() => {
    if (openModal) {
      inputLpn.current?.focus();
    }
  }, [openModal]);

  return (
    <main className="w-[80vw]">
      <section className="flex flex-col gap-y-4 w-full">
        <Sliders
          nameSlider="cargarRecepcionLpn"
          titleSlider="Cargar Nueva Recepcion"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <section className="flex flex-col gap-4">
              <div className="w-full">
                <Controller
                  control={control}
                  name="numeroLpn"
                  defaultValue=""
                  rules={{ required: { value: true, message: "Debe ingresar un lpn" } }}
                  render={({ field }) => (
                    <TextField
                      {...register("numeroLpn")}
                      onKeyUp={(event) => {
                        buscarLpnEnviado(event);
                      }}
                      inputRef={inputLpn}
                      fullWidth
                      label={"Ingrese el LPN"}
                      error={!!errors.localizador}
                      helperText={errors.localizador?.message}
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </section>
          }
        />
        <div className="w-full">
          {listaRecepcionado && (
            <>
              <Sliders
                nameSlider="verRecepciones"
                titleSlider="Recepciones Echas"
                expandend={expandend}
                setExpanded={setExpanded}
                setOpcionSlider={setOpcionSlider}
                elementJSX={
                  <div className="w-full">
                    <TableComponent
                      IDcolumn="id"
                      buscar
                      dataInfo={listaRecepcionado}
                      columns={[
                        {
                          title: "Numero LPN",
                          field: "lpn"
                        },
                        {
                          title: "Modelo",
                          field: "modelo"
                        },
                        {
                          title: "Remito",
                          field: "remito"
                        },
                        {
                          title: "Cantidad",
                          field: "total"
                        },
                        {
                          title: "Recepcion",
                          field: "",
                          render: (row) => saberRecepcionado(row)
                        },
                        {
                          title: "Enviado",
                          field: "",
                          render: (row) => saberEnvio(row)
                        },
                        {
                          title: "Recepcion Operario",
                          field: "",
                          render: (row) => saberOperarioRecepcionado(row)
                        },
                        {
                          title: "Envio Operario",
                          field: "",
                          render: (row) => saberOperarioEnviado(row)
                        }
                      ]}
                    />
                  </div>
                }
              />
            </>
          )}
        </div>
        <div className="mt-5 flex justify-center gap-x-4">
          <Button
            onClick={() => {
              buscarLocalizador();
            }}
            className={buttonClases.blueButton}>
            Guardar
          </Button>
          <Button
            onClick={() => {
              setOpenModal(false);
            }}
            className={buttonClases.redButton}>
            Cancelar
          </Button>
        </div>
      </section>
    </main>
  );
};
