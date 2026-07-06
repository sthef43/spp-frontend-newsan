/* eslint-disable unused-imports/no-unused-vars */
import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { RecepcionLpnSliceRequest } from "app/Middleware/reducers/RecepcionLpnSlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { useAppDispatch } from "app/core/store/store";
import { IOperator } from "app/models";
import { IModelo } from "app/models/IModelo";
import { IRecepcionLpn } from "app/models/IRecepcionLpn";
import { ReporteRenacerLpn } from "app/models/Stored Procdure/ReporteRenacerLpn";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Sliders } from "app/shared/components/ui/Sliders";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  listaCodigosLpn: ReporteRenacerLpn[];
  setReporteRenacerLpn: (newValue: ReporteRenacerLpn[]) => void;
}

export const CargarEnvioLPN: React.FC<Props> = ({ openModal, setOpenModal, listaCodigosLpn, setReporteRenacerLpn }) => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const inputLpn = useRef<HTMLInputElement | null>(null);
  const codigoLpn = watch("numeroLpn");
  const codigoRemito = watch("remito");

  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  const [expandend, setExpanded] = useState<string | false>(false);
  const [opcionSlider, setOpcionSlider] = useState<string>("Agregar");

  const [listaEnviado, setListaEnviado] = useState<IRecepcionLpn[]>([]);
  FetchApi<IRecepcionLpn[]>(RecepcionLpnSliceRequest.GetAllByRecepcionado, null, false, openModal, setListaEnviado);

  const [sesionUsuario, setSesionUsuario] = useState<IOperator>();
  FetchApi<IOperator>(OperatorSliceRequests.getInfoByDni, GetInfoUser().dni, false, openModal, setSesionUsuario);

  const [listaModelos, setListaModelos] = useState<IModelo[]>([]);
  FetchApi<IModelo[]>(ModeloSliceRequest.GetAllModelsActivateByRenacer, null, true, openModal, setListaModelos);

  const cargarNuevoEnvio = async () => {
    const nuevoEnvio = generarNuevoEnvio();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(await dispatch(RecepcionLpnSliceRequest.PostRequest(nuevoEnvio)));
      const listaRecepcion = unwrapResult(await dispatch(RecepcionLpnSliceRequest.GetAllByRecepcionado()));
      const reporteLpn = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.GetReporteTotalRenacer()));
      if (response) {
        setListaEnviado(listaRecepcion);
        setReporteRenacerLpn(reporteLpn);
        setearValoreInputs();
        openNotificationUI("El LPN ingresado fue recepcionado", "success");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [recepcionEncontrada, setRecepcionEncontrada] = useState<IRecepcionLpn>();
  const buscarLpnEnviado = async (event: any) => {
    try {
      event.preventDefault();
      if (codigoLpn.length > 9) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(RecepcionLpnSliceRequest.SearchRecepcionByLpn(codigoLpn)));
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

  const buscarLpnEnviada = () => {
    const lpnDisponibleRecepcion = buscarLpn();
    const lpnYaIngresado = buscarLpnYaIngresado();
    console.log(lpnDisponibleRecepcion);
    console.log(lpnYaIngresado);
    if (lpnDisponibleRecepcion && lpnYaIngresado === false) {
      cargarNuevoEnvio();
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const buscarLpn = () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
    const encontrado = listaCodigosLpn.some((elementos) => {
      return elementos.lpn == codigoLpn;
    });
    if (encontrado) {
      return encontrado;
    } else {
      openNotificationUI("No se encontro un LPN", "error");
    }
  };

  const buscarLpnYaIngresado = () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const yaIngresado = listaEnviado.some((elementos) => {
      return elementos.lpn == codigoLpn;
    });
    console.log(yaIngresado);
    if (yaIngresado) {
      openNotificationUI("Se encontro un registro con este LPN", "error");
      return;
    } else if (!yaIngresado) {
      return yaIngresado;
    }
  };

  const setearValoreInputs = () => {
    setValue("numeroLpn", "");
    setValue("remito", "");
    inputLpn.current?.focus();
  };

  const generarNuevoEnvio = () => {
    const reporteBuscado = listaCodigosLpn.find((elementos) => {
      return elementos.lpn == codigoLpn;
    });
    const nuevoEnvio: IRecepcionLpn = {
      lpn: codigoLpn,
      operatorEnviadoId: sesionUsuario.id,
      recepcionado: false,
      enviado: true,
      modelo: modeloSeleccionado,
      remito: codigoRemito,
      operatorId: 0,
      total: reporteBuscado.totalProducido
    };
    if (nuevoEnvio != null) {
      return nuevoEnvio;
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
          nameSlider="cargarEnvioLpn"
          titleSlider="Cargar Envio Nuevo"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <section className="flex flex-col gap-y-4">
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
              <div className="w-full">
                <Controller
                  control={control}
                  name="remito"
                  defaultValue=""
                  rules={{ required: { value: true, message: "Debe ingresar un numero de remito" } }}
                  render={({ field }) => (
                    <TextField
                      {...register("remito")}
                      fullWidth
                      label={"Ingrese el remito"}
                      error={!!errors.localizador}
                      helperText={errors.localizador?.message}
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <SelectComponent
                nameSelect="modeloSeleccionado"
                inputLabel="Seleccione un modelo"
                listaObjetos={listaModelos}
                valueLabel={(item) => item.nombre}
                valueSelect={(item) => item.nombre}
                ValueSave={setModeloSeleccionado}
                valueKey={(item) => item}
                control={control}
              />
            </section>
          }
        />
        <div className="w-full">
          {listaEnviado && (
            <>
              <Sliders
                nameSlider="registroEnviados"
                titleSlider="Registros Enviados"
                expandend={expandend}
                setExpanded={setExpanded}
                setOpcionSlider={setOpcionSlider}
                elementJSX={
                  <div className="w-full">
                    <TableComponent
                      IDcolumn="id"
                      buscar
                      dataInfo={listaEnviado}
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
              buscarLpnEnviada();
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
