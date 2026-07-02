import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RenacerIngresoPlacaSliceRequest } from "app/Middleware/reducers/RenacerIngresoPlacasSlice";
import { RenacerProduccionCESliceRequest } from "app/Middleware/reducers/RenacerProduccionCESlice";
import { RenacerReparacionesSliceRequest } from "app/Middleware/reducers/RenacerReparacioneSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRenacerIngresoPlacas } from "app/models/IRenacerIngresoPlacas";
import { IRenacerProduccionCE } from "app/models/IRenacerProduccionCE";
import { IRenacerReparaciones } from "app/models/IRenacerReparaciones";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import React, { useEffect, useState } from "react";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
}

export const OpcionesExportacionModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  const getProduccionCE = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(RenacerProduccionCESliceRequest.getAllRequest()));
      if (response) {
        setExcelReporteProduccionCE(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getIngresoPlacas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(RenacerIngresoPlacaSliceRequest.getAllRequest()));
      if (response) {
        setExcelReporteIngresoPlacas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getReparaciones = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(RenacerReparacionesSliceRequest.GetReparacionesGroupByPosicion()));
      if (response) {
        setExcelReporteReparaciones(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [dataExcelProduccionCE, setDataExcelProduccionCE] = useState([]);
  const setExcelReporteProduccionCE = (reporteProduccionCE: IRenacerProduccionCE[]) => {
    const newData = reporteProduccionCE.map((elementos) => {
      const fecha = elementos.fecha;
      const turno = elementos.turno.abreviatura;
      const modelo = elementos.modelo;
      const cantidad = elementos.cantidad;
      return {
        ...elementos,
        fecha,
        turno,
        modelo,
        cantidad
      };
    });
    setDataExcelProduccionCE(newData);
  };

  const [dataExcelIngresoPlacas, setDataExcelIngresoPlacas] = useState([]);
  const setExcelReporteIngresoPlacas = (reporteIngresoPlacas: IRenacerIngresoPlacas[]) => {
    const newData = reporteIngresoPlacas.map((elementos) => {
      const fecha = elementos.fecha;
      const remito = elementos.remito;
      const modelo = elementos.modelo;
      const cantidadPlacas = elementos.cantidadPlacas;
      const comentarios = elementos.comentarios;
      return {
        ...elementos,
        fecha,
        remito,
        modelo,
        cantidadPlacas,
        comentarios
      };
    });
    setDataExcelIngresoPlacas(newData);
  };

  const [dataExcelReparaciones, setDataExcelReparaciones] = useState([]);
  const setExcelReporteReparaciones = (reporteReparaciones: IRenacerReparaciones[]) => {
    const newData = reporteReparaciones.map((elementos) => {
      const modelo = elementos.modelo;
      const estado = elementos.estado;
      const posicion = elementos.posicion;
      const cantidad = elementos.cantidad;
      return {
        ...elementos,
        modelo,
        estado,
        posicion,
        cantidad
      };
    });
    setDataExcelReparaciones(newData);
  };

  useEffect(() => {
    if (openModal) {
      getProduccionCE();
      getIngresoPlacas();
      getReparaciones();
    }
  }, [openModal]);

  return (
    <main className="w-[20vw]">
      <section className="flex flex-col justify-center items-center w-full gap-y-4">
        <div>
          {dataExcelProduccionCE.length > 0 && (
            <ExportExcel
              title="InformeProduccionCE"
              stylesButton="m-0"
              titleButton="Exportar Informe Produccion CE"
              data={dataExcelProduccionCE.length > 0 ? dataExcelProduccionCE : []}
              columns={[
                {
                  title: "Fecha",
                  field: "fecha"
                },
                {
                  title: "Turno",
                  field: "turno"
                },
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Cantidad",
                  field: "cantidad"
                }
              ]}
            />
          )}
        </div>
        <div>
          {dataExcelIngresoPlacas.length > 0 && (
            <ExportExcel
              title="InformeIngresoPlacas"
              stylesButton="m-0"
              titleButton="Exportar Informe Ingreso Placas"
              data={dataExcelIngresoPlacas.length > 0 ? dataExcelIngresoPlacas : []}
              columns={[
                {
                  title: "Fecha",
                  field: "fecha"
                },
                {
                  title: "Remito",
                  field: "remito"
                },
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Cantidad Placas",
                  field: "cantidadPlacas"
                },
                {
                  title: "Comentarios",
                  field: "comentarios"
                }
              ]}
            />
          )}
        </div>
        <div>
          {dataExcelReparaciones.length > 0 && (
            <ExportExcel
              title="InformeReparaciones"
              stylesButton="m-0"
              titleButton="Exportar Informe Reparaciones"
              data={dataExcelReparaciones.length > 0 ? dataExcelReparaciones : []}
              columns={[
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Estado",
                  field: "estado"
                },
                {
                  title: "Posicion",
                  field: "posicion"
                },
                {
                  title: "Cantidad",
                  field: "cantidad"
                }
              ]}
            />
          )}
        </div>
      </section>
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button
            type="button"
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
