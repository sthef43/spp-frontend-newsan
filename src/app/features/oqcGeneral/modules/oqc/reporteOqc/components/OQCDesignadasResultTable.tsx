/* eslint-disable unused-imports/no-unused-vars */
import { Campaign, Cancel, DoDisturb, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests, operatorSlice } from "app/Middleware/reducers/OperatorSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { OQCSeguimientoSelect } from "app/features/oqcGeneral/modules/oqc/reporteOqc/components/OQCSeguimientoSelect";
import { IPlanProd } from "app/models";
import { Rechazos } from "../../../../../calidad/modules/cargaNoConforme/components/Rechazos";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { OQCDialogCancelPage } from "./OQCDialogCancelPage";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { oqcDesignadaResultadoImagenSlice } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoImagenSlice";
import {
  OQCDesignadaResultadoSliceRequests,
  oqcDesignadaResultadoSlice
} from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { oqcDesignadaSlice } from "app/features/oqcGeneral/slices/OQCDesignadaSlice";
import { oqcHallazgoResultSlice } from "app/features/oqcGeneral/slices/OQCHallazgoResultSlice";

interface IOQCDesignadasResultTable {
  refresh: () => void;
}
export const OQCDesignadasResultTable = ({ refresh }: IOQCDesignadasResultTable): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [seguimientoForm, setSeguimientoForm] = useState(false);
  const [dataExcel, setDataExcel] = useState<unknown[]>([]);
  const [rechazoForm, setRechazoForm] = useState(false);
  const [planProd, setPlanProd] = useState<IPlanProd>();

  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const oqcDesResul = useAppSelector((state) => state.oqcDesignadaResultado.dataAll);
  const { getConfirmation } = useConfirmationDialog();

  //Cancelar
  const [cancelForm, setCancelForm] = useState(false);
  const [msjCancel, setMsjCancel] = useState(null);
  const [oqcCancel, setOqcCancel] = useState(null);
  const onCanceled = async (oqc: IOQCDesignadaResultado) => {
    setCancelForm(true);
    setOqcCancel(oqc);
  };

  useEffect(() => {
    if (msjCancel) {
      onCanceledAccept(oqcCancel);
    }
  }, [msjCancel]);

  const onCanceledAccept = async (oqc: IOQCDesignadaResultado) => {
    try {
      if (await getConfirmation("Dar de baja OQC", "Esta seguro de dar de baja el resultado del oqc")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const operator = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0)));
        const objectSubmit: IOQCDesignadaResultado = {
          ...oqc,
          operatorCanceledId: operator.id,
          canceled: true,
          canceledComentario: msjCancel.descripcion
        };
        delete objectSubmit.operator;
        delete objectSubmit.oqcDesignada;
        delete objectSubmit.oqcHallazgoResult;
        delete objectSubmit.oqcPalet;
        delete objectSubmit.operatorCanceled;
        await dispatch(OQCDesignadaResultadoSliceRequests.PutRequest(objectSubmit));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        refresh();
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onView = async (oqc: IOQCDesignadaResultado) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCDesignadaResultadoSliceRequests.GetAlldatesByOQCId(oqc.id)));
      if (response) {
        dispatch(oqcDesignadaResultadoSlice.actions.setObject(response));
        dispatch(oqcDesignadaSlice.actions.setObject(response.oqcDesignada));
        dispatch(operatorSlice.actions.setObject(response.operator));
        dispatch(oqcDesignadaResultadoImagenSlice.actions.setOQCArray(response.oqcDesignadaResultadoImagen));
        dispatch(
          oqcHallazgoResultSlice.actions.setNewOQCArray(
            response.oqcHallazgoResult.filter((haRe) => haRe.state == false)
          )
        );
        history.push("oqc-realizar-designada");
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error intentando examinar el OQC", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const setExcel = () => {
    const newData = oqcDesResul.map((ocqDR) => {
      const auditorName = ocqDR.operator.name + " " + ocqDR.operator.surname;
      const lineaAny = linea as any;
      const lineadesc = lineaAny.nombre;
      const plantaDesc = lineaAny.plant.name;
      const productoDesc = lineaAny.producto.nombre;
      const auditorNameCanceled =
        ocqDR.operatorCanceled === null ? "-" : ocqDR.operatorCanceled?.name + " " + ocqDR.operatorCanceled?.surname;
      const ponderacion = getPonderacion(ocqDR);
      const observacion = getObeservacion(ocqDR.oqcHallazgoResult);
      const listaHallazgos = getHallazgos(ocqDR.oqcHallazgoResult);
      const numeroPalet = getNumeroPalet(ocqDR);
      const origen = "Montaje";
      //const ponderacion = getPonderacion(ocqDR);
      const indice = getIndice(ocqDR);
      const cancelada = ocqDR.canceled ? "Si" : "No";
      const hallazgo = ocqDR.oqcHallazgoResult.length > 0 ? "Si" : "No";
      const createdDateFormat = moment(ocqDR.createdDate).format("DD/MM/YYYY, HH:mm");
      return {
        ...ocqDR,
        auditorName,
        observacion,
        ponderacion,
        indice,
        auditorNameCanceled,
        cancelada,
        createdDateFormat,
        linea: lineadesc,
        planta: plantaDesc,
        producto: productoDesc,
        hallazgo,
        listaHallazgos,
        origen,
        palet: numeroPalet
      };
    });
    setDataExcel(newData);
    setearDatosCSV();
  };

  const onSeguimiento = (oqc: IOQCDesignadaResultado) => {
    dispatch(oqcDesignadaSlice.actions.setObject(oqc.oqcDesignada));
    dispatch(oqcDesignadaResultadoSlice.actions.setObject(oqc));
    dispatch(oqcDesignadaResultadoImagenSlice.actions.setOQCArray(oqc.oqcDesignadaResultadoImagen));
    dispatch(
      oqcHallazgoResultSlice.actions.setNewOQCArray(oqc.oqcHallazgoResult.filter((haRe) => haRe.state == false))
    );
    setSeguimientoForm(true);
  };

  const onRechazar = async (oqc: IOQCDesignadaResultado) => {
    dispatch(oqcDesignadaResultadoSlice.actions.setObject(oqc));
    history.push("/main/calidad/calidad");
  };

  const getIndice = (hallazgosEncontrados: IOQCDesignadaResultado) => {
    if (hallazgosEncontrados.indicePonderacion == null) {
      return `100%`;
    } else {
      return hallazgosEncontrados.indicePonderacion.toFixed(2);
    }
  };

  const getPonderacion = (hallazgosEncontrado: IOQCDesignadaResultado) => {
    let ponderacion;
    if (hallazgosEncontrado.oqcHallazgoResult.length > 0) {
      hallazgosEncontrado.oqcHallazgoResult.map((elementos) => {
        switch (elementos.oqcBloqueHallazgo.oqcHallazgo.oqcPonderacion.nombre) {
          case "A":
            ponderacion = elementos.oqcBloqueHallazgo.oqcHallazgo.oqcPonderacion.nombre;
            break;
          case "B":
            ponderacion = elementos.oqcBloqueHallazgo.oqcHallazgo.oqcPonderacion.nombre;
            break;
          case "C":
            ponderacion = elementos.oqcBloqueHallazgo.oqcHallazgo.oqcPonderacion.nombre;
            break;
        }
      });
    }

    if (ponderacion == null) {
      return `OK`;
    } else {
      return `${ponderacion}`;
    }
  };

  const getObeservacion = (hallazgos: IOQCHallazgoResult[]) => {
    if (hallazgos.length > 0) {
      return `${hallazgos
        .map((elementos) => elementos.comentario)
        .flat()
        .join(", ")}`;
    } else {
      return `No se encontro una causa`;
    }
  };

  const getHallazgos = (hallazgos: IOQCHallazgoResult[]) => {
    if (hallazgos.length > 0) {
      return `${hallazgos
        .map((elementos) => elementos.oqcBloqueHallazgo.oqcHallazgo.oqcPonderacion.tipoDefecto)
        .flat()
        .join(", ")}`;
    } else {
      return `No se encontro un hallazgo`;
    }
  };

  const getNumeroPalet = (reportes: IOQCDesignadaResultado) => {
    if (reportes.oqcPalet != null) {
      return `${reportes.oqcPalet.numeroPalet}`;
    } else {
      return `Sin palet asignado`;
    }
  };

  const headers = [
    { label: "country", key: "country" },
    { label: "site", key: "site" },
    { label: "Date", key: "date" },
    { label: "Sequence", key: "numeroOp" },
    { label: "shift", key: "Shift" },
    { label: "SALES_MODEL", key: "codigoModelo" },
    { label: "customer", key: "customer" },
    { label: "product_code", key: "productoCode" },
    { label: "imei1", key: "imei" },
    { label: "imei2", key: "imei2" },
    { label: "imei3", key: "imei3" },
    { label: "imei4", key: "imei4" },
    { label: "imei5", key: "imei5" },
    { label: "imei6", key: "imei6" },
    { label: "imei7", key: "imei7" },
    { label: "imei8", key: "imei8" },
    { label: "imei9", key: "imei9" },
    { label: "imei10", key: "imei10" },
    { label: "audited_quantity", key: "audited_quantity" },
    { label: "severity", key: "severity" },
    { label: "fail", key: "fail" },
    { label: "indication", key: "indication" },
    { label: "fail_quantity", key: "fail_quantity" },
    { label: "failed_time", key: "failed_time" },
    { label: "auditor", key: "auditor" },
    { label: "status", key: "status" }
  ];

  const [listaCsv, setListaCsv] = useState([]);
  const setearDatosCSV = () => {
    const listaCsv = [];
    oqcDesResul.forEach((elementos) => {
      const numerosOp = elementos.numeroOP?.replace(/[^0-9]/g, "");
      const fecha = new Date(elementos.createdDate);
      let objetoCsv = undefined;
      objetoCsv = {
        country: "ARG",
        site: "TDF",
        Date: `${fecha.getFullYear()}-${añadirCero(fecha.getDate())}-${añadirCero(fecha.getMonth() + 1)}`,
        Sequence: numerosOp,
        shift: 1,
        codigoModelo: elementos.codigoModelo,
        customer: "RETAIL",
        productoCode: elementos.oqcPalet?.oqcModelo?.compania == null ? "" : elementos.oqcPalet.oqcModelo.compania,
        imei: elementos.imei,
        imei2: elementos.imei2 == null ? "" : elementos.imei2,
        imei3: elementos.imei3 == null ? "" : elementos.imei3,
        imei4: elementos.imei4 == null ? "" : elementos.imei4,
        imei5: elementos.imei5 == null ? "" : elementos.imei5,
        imei6: elementos.imei6 == null ? "" : elementos.imei6,
        imei7: elementos.imei7 == null ? "" : elementos.imei7,
        imei8: elementos.imei8 == null ? "" : elementos.imei8,
        imei9: elementos.imei9 == null ? "" : elementos.imei9,
        imei10: elementos.imei10 == null ? "" : elementos.imei10,
        audited_quantity: elementos.oqcHallazgoResult.length == 0 ? "" : 1,
        severity: elementos.oqcHallazgoResult.length == 0 ? "" : 2,
        fail: elementos.oqcHallazgoResult.map((elementos) => {
          return elementos.oqcBloqueHallazgo.oqcHallazgo.nombre;
        }),
        fail_quantity: elementos.oqcHallazgoResult.length == 0 ? "" : elementos.oqcHallazgoResult.length,
        failed_time: añadirCero(fecha.getHours()) + ":" + añadirCero(fecha.getMinutes()),
        auditor: elementos.operator.surname + " " + elementos.operator.name,
        status: !elementos.canceled ? "CONFORME" : "NO CONFORME"
      };
      listaCsv.push(objetoCsv);
    });
    setListaCsv(listaCsv);

    if (listaCsv.length == 0) {
      openNotificationUI("No se pudo exportar el archivo", "warning");
    }
  };

  const añadirCero = (hora) => {
    if (hora < 10) {
      hora = "0" + hora;
      return hora;
    } else {
      return hora;
    }
  };

  useEffect(() => {
    oqcDesResul?.length > 0 && setExcel();
  }, [oqcDesResul]);

  return (
    <div>
      <TableComponent
        Dense={true}
        IDcolumn="id"
        columns={[
          {
            title: "OQC",
            field: "oqcDesignada.oqc.nombre"
          },
          {
            title: "Modelo",
            field: "codigoModelo"
          },
          {
            title: "Auditor",
            field: "operator.name",
            render: (row: IOQCDesignadaResultado) => <>{row.operator?.name + " " + row.operator?.surname}</>
          },
          {
            title: "Número de serie",
            field: "numeroSerie"
          },
          {
            title: "Causa",
            field: "",
            render: (row) => getObeservacion(row.oqcHallazgoResult)
          },
          {
            title: "Ponderacion",
            field: "",
            render: (row) => getPonderacion(row)
          },
          {
            title: "Indice",
            field: "",
            render: (row) => getIndice(row)
          },
          {
            title: "Fecha",
            field: "createdDate",
            render: (row: IOQCDesignadaResultado) => <>{moment(row.createdDate).format("L")}</>
          },
          {
            title: "Cancelado por",
            field: "operatorCanceled.name",
            render: (row: IOQCDesignadaResultado) =>
              row.operatorCanceled && <>{row.operatorCanceled?.name + " " + row.operatorCanceled?.surname}</>
          },
          {
            title: "Fecha de baja",
            field: "",
            render: (row: IOQCDesignadaResultado) => row.canceled && <>{moment(row.lastModifiedDate).format("L")}</>
          },
          {
            title: "Motivo de baja",
            field: "canceledComentario"
          },
          {
            title: "Acciones",
            field: "",
            render: (row: IOQCDesignadaResultado) => (
              <div className="flex w-full justify-end sm:justify-start gap-4 ml-3">
                <div>
                  <Tooltip title="Ver oqc">
                    <IconButton onClick={() => onView(row)}>
                      <Visibility color="info" />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className={`ml-5 minnotebook:ml-0 ${row.canceled && "hidden"}`}>
                  <Tooltip title="Dar de baja">
                    <IconButton disabled={row.canceled} onClick={() => onCanceled(row)}>
                      <Cancel color="error" />
                    </IconButton>
                  </Tooltip>
                </div>

                <div
                  className={`ml-5 minnotebook:ml-0 ${
                    (!row.oqcHallazgoResult.find((oqcHR) => oqcHR.state == false) || row.canceled) && "hidden"
                  }`}>
                  <Tooltip title="Dar seguimiento">
                    <IconButton onClick={() => onSeguimiento(row)}>
                      <Campaign color={row.oqcSeguimiento ? "error" : "info"} />
                    </IconButton>
                  </Tooltip>
                </div>
                <div
                  className={`ml-5 minnotebook:ml-0 ${
                    (!row.oqcHallazgoResult.find((oqcHR) => oqcHR.oqcSeguimiento) ||
                      !row.oqcDesignada.oqc.validarNumSerie ||
                      row.canceled) &&
                    "hidden"
                  }`}>
                  <Tooltip title="Rechazar equipos">
                    <IconButton onClick={() => onRechazar(row)}>
                      <DoDisturb color={row.oqcSeguimiento ? "error" : "info"} />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            )
          }
        ]}
        rowStyle={(rowData: IOQCDesignadaResultado) => {
          switch (rowData.canceled) {
            case true:
              return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
            default:
              return { padding: 1, fontSize: 14 };
          }
        }}
        buscar
        dataInfo={oqcDesResul}
      />
      <ModalCompoment title="Hallazgos NG del OQC" setOpenPopup={setSeguimientoForm} openPopup={seguimientoForm}>
        <OQCSeguimientoSelect closeModal={setSeguimientoForm} refresh={refresh} />
      </ModalCompoment>
      <ModalCompoment title="Rechazar equipos" setOpenPopup={setRechazoForm} openPopup={rechazoForm}>
        <Rechazos refresh={refresh} plan={planProd} />
      </ModalCompoment>
      <ModalCompoment title="Baja OQC" setOpenPopup={setCancelForm} openPopup={cancelForm}>
        <OQCDialogCancelPage setOpenPopup={setCancelForm} mensaje={setMsjCancel} />
      </ModalCompoment>
    </div>
  );
};
