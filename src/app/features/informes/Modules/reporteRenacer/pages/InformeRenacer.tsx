/* eslint-disable unused-imports/no-unused-vars */
import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { useAppDispatch } from "app/core/store/store";
import { ReporteRenacer } from "app/models/Stored Procdure/ReporteRenacer";
import { ReporteRenacerLpn } from "app/models/Stored Procdure/ReporteRenacerLpn";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CargarEnvioLPN } from "../modals/CargarEnvioLPN";
import { CargarIngresoPlacasModal } from "../modals/CargarIngresoPlacasModal";
import { CargarProduccionCEModal } from "../modals/CargarProduccionCEModal";
import { CargarRecepcionLpnModal } from "../modals/CargarRecepcionLpnModal";
import { CargarReparacionesModal } from "../modals/CargarReparacionesModal";
import { OpcionesExportacionModal } from "../modals/OpcionesExportacionModal";

export const InformeRenacer = () => {
  const {
    register,
    control,
    watch,
    formState: { errors }
  } = useForm();

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();

  const [openModalRecepcion, setOpenModalRecepcion] = useState<boolean>(false);
  const [openModalEnvio, setOpenModalEnvio] = useState<boolean>(false);
  const [openModalProduccionCE, setOpenModalProduccionCE] = useState<boolean>(false);
  const [openModalIngresoPlacas, setOpenModalIngresoPlacas] = useState<boolean>(false);
  const [openModalReparaciones, setOpenModalReparaciones] = useState<boolean>(false);
  const [openModalExportacionInformes, setOpenModalExportacionInformes] = useState<boolean>(false);

  const inputLpn = useRef<HTMLInputElement | null>(null);
  const codigoLpn = watch("numeroLpn");

  const [reporteProduccion, setReporteProduccion] = useState<ReporteRenacer[]>([]);
  const buscarProduccion = async (event) => {
    try {
      if (event.key === "Enter") {
        event.preventDefault();
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(
          await dispatch(TrazaOperacionesSliceRequests.GetReporteRenacerByLpn({ lpn: codigoLpn }))
        );
        if (response) {
          openNotificationUI("Se encontraron registros de producción", "success");
          setReporteProduccion(response);
        }
        if (response.length == 0) {
          openNotificationUI("No se encontraron registros de producción", "warning");
          inputLpn.current?.select();
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const buscarProduccionTotal = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.GetReporteTotalRenacer()));
      if (response) {
        setExcelReporteTotalProducido(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [dataExcel, setDataExcel] = useState([]);
  const setExcelReporteTotalProducido = (ReporteRenacerLpn: ReporteRenacerLpn[]) => {
    const newData = ReporteRenacerLpn.map((elementos) => {
      const fechaEnvioFormat = new Date(elementos.fechaEnvio);
      const fechaActualizacionFormat = new Date(elementos.fechaRecepcion);
      const LPN = elementos.lpn;
      const totalProducido = elementos.totalProducido;
      const recepcionado = elementos.recepcionado ? "Recepcionado" : "No Recepcionado";
      const enviado = elementos.enviado ? "Enviado" : "No Enviado";
      const nombreApellidoRecepcion = elementos.recepcionado
        ? `${elementos.nombreRecepcion} ${elementos.apellidoRecepcion}`
        : "No Recepcionado";
      const nombreApellidoEnviado = elementos.enviado
        ? `${elementos.nombreEnvio} ${elementos.apellidoEnvio}`
        : "No Enviado";
      const fechaEnvio = elementos.fechaEnvio
        ? `${fechaEnvioFormat.getDate()}/${fechaEnvioFormat.getMonth() + 1}/${fechaEnvioFormat.getFullYear()}`
        : "ERROR";
      const fechaActualizacion = elementos.fechaRecepcion
        ? `${fechaActualizacionFormat.getDate()}/${
            fechaActualizacionFormat.getMonth() + 1
          }/${fechaActualizacionFormat.getFullYear()}`
        : "ERROR";
      const modelo = elementos.modelo ? `${elementos.modelo}` : "Modelo no Encontrado";
      return {
        ...elementos,
        LPN,
        totalProducido,
        recepcionado,
        modelo,
        enviado,
        nombreApellidoRecepcion,
        nombreApellidoEnviado,
        fechaEnvio,
        fechaActualizacion
      };
    });
    setDataExcel(newData);
  };

  useEffect(() => {
    TitleChanger("REPORTE PRODUCCION RENACER");
    buscarProduccionTotal();
    inputLpn.current?.focus();
  }, []);

  return (
    <main className="w-screen p-4">
      <section className="w-full">
        <div className="bg-background p-3 border border-gray-200 rounded-xl shadow-shadowBox">
          <Controller
            control={control}
            name="numeroLpn"
            defaultValue=""
            rules={{ required: { value: true, message: "Debe ingresar un lpn" } }}
            render={({ field }) => (
              <TextField
                {...register("numeroLpn")}
                inputRef={inputLpn}
                onKeyUp={() => {
                  buscarProduccion(event);
                }}
                fullWidth
                label={"Ingrese el LPN"}
                error={!!errors.localizador}
                helperText={errors.localizador?.message}
                variant="outlined"
              />
            )}
          />
        </div>
        <div>
          {dataExcel.length > 0 && (
            <main className="flex flex-row justify-between w-full items-center my-4">
              <div className="flex flex-row items-center gap-x-4 w-[80%]">
                <ExportExcel
                  title="ProducidoPorLpnRenacer"
                  stylesButton="m-0"
                  titleButton="Cantidad Total Por LPN"
                  data={dataExcel.length > 0 ? dataExcel : []}
                  columns={[
                    {
                      title: "Numero LPN",
                      field: "LPN"
                    },
                    {
                      title: "Total Producido",
                      field: "totalProducido"
                    },
                    {
                      title: "Modelo",
                      field: "modelo"
                    },
                    {
                      title: "Nombre y Apellido Recepcion",
                      field: "nombreApellidoRecepcion"
                    },
                    {
                      title: "Nombre y Apellido Enviado",
                      field: "nombreApellidoEnviado"
                    },
                    {
                      title: "Recepcionado",
                      field: "recepcionado"
                    },
                    {
                      title: "Enviado",
                      field: "enviado"
                    },
                    {
                      title: "Fecha Envio",
                      field: "fechaEnvio"
                    },
                    {
                      title: "Fecha Recepcion",
                      field: "fechaActualizacion"
                    }
                  ]}
                />
                <Button
                  onClick={() => {
                    setOpenModalRecepcion(true);
                  }}
                  className={buttonClases.redButton}>
                  Recepción de Cajones
                </Button>
                <Button
                  onClick={() => {
                    setOpenModalEnvio(true);
                  }}
                  className={buttonClases.greenButton}>
                  Envío de Cajones
                </Button>
                <Button
                  onClick={() => {
                    setOpenModalProduccionCE(true);
                  }}
                  className={buttonClases.blueButton}>
                  Producción Diaria
                </Button>
                <Button
                  onClick={() => {
                    setOpenModalIngresoPlacas(true);
                  }}
                  className={buttonClases.blueButton}>
                  Ingreso Placas a Renacer
                </Button>
                <Button
                  onClick={() => {
                    setOpenModalReparaciones(true);
                  }}
                  className={buttonClases.blueButton}>
                  Reparaciones{" "}
                </Button>
              </div>
              <div className="w-[20%] flex justify-end">
                <Button
                  onClick={() => {
                    setOpenModalExportacionInformes(true);
                  }}
                  className={buttonClases.greenButton}>
                  Opciones de Exportación
                </Button>
              </div>
            </main>
          )}
        </div>
        <div className="mt-4 bg-background">
          <TableComponent
            IDcolumn="codigo"
            buscar
            dataInfo={reporteProduccion}
            excel
            columns={[
              {
                title: "Familia",
                field: "familia"
              },
              {
                title: "LPN",
                field: "lpn"
              },
              {
                title: "Codigo Caja Electrica",
                field: "codigoInit"
              },
              {
                title: "Codigo Main",
                field: "codigo"
              }
            ]}
          />
        </div>
      </section>
      <ModalCompoment openPopup={openModalRecepcion} setOpenPopup={setOpenModalRecepcion} title="Cargar Recepcion LPN">
        <CargarRecepcionLpnModal
          setReporteRenacerLpn={setExcelReporteTotalProducido}
          setOpenModal={setOpenModalRecepcion}
          openModal={openModalRecepcion}
        />
      </ModalCompoment>
      <ModalCompoment openPopup={openModalEnvio} setOpenPopup={setOpenModalEnvio} title="Cargar Envio LPN">
        <CargarEnvioLPN
          openModal={openModalEnvio}
          setOpenModal={setOpenModalEnvio}
          listaCodigosLpn={dataExcel}
          setReporteRenacerLpn={setExcelReporteTotalProducido}
        />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalProduccionCE}
        setOpenPopup={setOpenModalProduccionCE}
        title="Cargar Produccion CE">
        <CargarProduccionCEModal setOpenModal={setOpenModalProduccionCE} openModal={openModalProduccionCE} />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalIngresoPlacas}
        setOpenPopup={setOpenModalIngresoPlacas}
        title="Cargar Ingreso Placas">
        <CargarIngresoPlacasModal setOpenModal={setOpenModalIngresoPlacas} openModal={openModalIngresoPlacas} />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalReparaciones}
        setOpenPopup={setOpenModalReparaciones}
        title="Cargar Reparaciones">
        <CargarReparacionesModal setOpenModal={setOpenModalReparaciones} openModal={openModalReparaciones} />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalExportacionInformes}
        setOpenPopup={setOpenModalExportacionInformes}
        title="Opciones de Exportacion">
        <OpcionesExportacionModal
          setOpenModal={setOpenModalExportacionInformes}
          openModal={openModalExportacionInformes}
        />
      </ModalCompoment>
    </main>
  );
};
