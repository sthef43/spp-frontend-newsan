import { Button } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

interface Props {
  reporteDiario: IOQCDesignadaResultado[];
  reportePorPlanta: IOQCDesignadaResultado[];
  reporteCSV: IOQCDesignadaResultado[];
}

export const OQCOpcionExportacionReporte: React.FC<Props> = ({ reporteDiario, reportePorPlanta, reporteCSV }) => {
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const [dataExcel, setDataExcel] = useState<any[]>([]);
  const [dataExcelPorPlanta, setDataExcelPorPlanta] = useState<any[]>([]);

  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const producto = useAppSelector((state) => state.producto.object);
  const planta = useAppSelector((state) => state.plant.object);

  const setExcel = () => {
    const reporteSinCancelados = reporteDiario.filter((elementos) => {
      return elementos.canceled === false;
    });
    const newData = reporteSinCancelados.map((ocqDR) => {
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

  const setExcelTotalPorPlanta = () => {
    const reporteSinCancelados = reportePorPlanta.filter((elementos) => {
      return elementos.canceled === false;
    });
    const newData = reporteSinCancelados.map((ocqDR) => {
      const auditorName = ocqDR.operator?.name + " " + ocqDR.operator?.surname;
      const lineaAny =
        ocqDR?.oqcPalet === null
          ? ocqDR.oqcDesignada.lineaProduccion.nombre
          : ocqDR?.oqcPalet?.oqcModelo?.lineaProduccion?.nombre;
      const plantaDesc = planta.name;
      const productoDesc = producto.nombre;
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
        indice,
        auditorNameCanceled,
        cancelada,
        ponderacion,
        listaHallazgos,
        createdDateFormat,
        linea: lineaAny,
        planta: plantaDesc,
        producto: productoDesc,
        hallazgo,
        origen,
        palet: numeroPalet
      };
    });
    setDataExcelPorPlanta(newData);
    setearDatosCSV();
  };

  const headers = [
    { label: "country", key: "country" },
    { label: "site", key: "site" },
    { label: "Date", key: "date" },
    { label: "Sequence", key: "sequence" },
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
    reporteCSV.forEach((elementos) => {
      const numerosOp = elementos.numeroOP?.replace(/[^0-9]/g, "");
      const fecha = new Date(elementos.createdDate);
      let objetoCsv = undefined;
      objetoCsv = {
        country: "ARG",
        site: "TDF",
        date: `${fecha.getFullYear()}-${añadirCero(fecha.getMonth() + 1)}-${añadirCero(fecha.getDate())}`,
        sequence: numerosOp,
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
        audited_quantity: elementos.oqcHallazgoResult.length == 0 ? 1 : 1,
        severity: elementos.oqcHallazgoResult.length == 0 ? "" : 2,
        fail: elementos.oqcHallazgoResult.map((elementos) => {
          return elementos.oqcBloqueHallazgo.oqcHallazgo.nombre;
        }),
        indication: "",
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

  const añadirCero = (hora) => {
    if (hora < 10) {
      hora = "0" + hora;
      return hora;
    } else {
      return hora;
    }
  };

  const getIndice = (hallazgosEncontrados: IOQCDesignadaResultado) => {
    if (hallazgosEncontrados.indicePonderacion == null) {
      return `100%`;
    } else {
      return hallazgosEncontrados.indicePonderacion.toFixed(2);
    }
  };

  useEffect(() => {
    if (reporteDiario || reportePorPlanta) {
      setExcel();
      setExcelTotalPorPlanta();
    }
  }, [reporteDiario, reportePorPlanta]);

  return (
    <main className="flex flex-row ">
      <div>
        {dataExcel.length > 0 && (
          <main className="flex flex-row items-center gap-x-4 my-5 w-full">
            <ExportExcel
              title="PruebasOQC"
              stylesButton="m-0"
              data={dataExcel.length > 0 ? dataExcel : []}
              columns={[
                {
                  title: "Palet",
                  field: "palet"
                },
                {
                  title: "Modelo",
                  field: "codigoModelo"
                },
                {
                  title: "Número de serie",
                  field: "numeroSerie"
                },
                {
                  title: "Imei",
                  field: "imei"
                },
                {
                  title: "Imei 2",
                  field: "imei2"
                },
                {
                  title: "Caja master",
                  field: "cajaMaster"
                },
                {
                  title: "Eancode",
                  field: "eanCode"
                },
                {
                  title: "Ponderacion",
                  field: "ponderacion"
                },
                {
                  title: "Indice",
                  field: "indice"
                },
                {
                  title: "Auditor",
                  field: "auditorName"
                },
                {
                  title: "Cancelada",
                  field: "cancelada"
                },
                {
                  title: "Auditor que cancelo",
                  field: "auditorNameCanceled"
                },
                {
                  title: "Fecha",
                  field: "createdDateFormat"
                },
                {
                  title: "Linea",
                  field: "linea"
                },
                {
                  title: "Planta",
                  field: "planta"
                },
                {
                  title: "Producto",
                  field: "producto"
                },
                {
                  title: "Hallazgos",
                  field: "hallazgo"
                },
                {
                  title: "Defecto",
                  field: "listaHallazgos"
                },
                {
                  title: "Origen",
                  field: "origen"
                },
                {
                  title: "Causa",
                  field: "observacion"
                }
              ]}
            />
            <ExportExcel
              titleButton="EXPORTAR EXCEL POR PLANTA"
              title="PruebasOQC"
              stylesButton="m-0"
              data={dataExcelPorPlanta.length > 0 ? dataExcelPorPlanta : []}
              columns={[
                {
                  title: "Palet",
                  field: "palet"
                },
                {
                  title: "Modelo",
                  field: "codigoModelo"
                },
                {
                  title: "Número de serie",
                  field: "numeroSerie"
                },
                {
                  title: "Imei",
                  field: "imei"
                },
                {
                  title: "Imei 2",
                  field: "imei2"
                },
                {
                  title: "Caja master",
                  field: "cajaMaster"
                },
                {
                  title: "Eancode",
                  field: "eanCode"
                },
                {
                  title: "Ponderacion",
                  field: "ponderacion"
                },
                {
                  title: "Indice",
                  field: "indice"
                },
                {
                  title: "Auditor",
                  field: "auditorName"
                },
                {
                  title: "Cancelada",
                  field: "cancelada"
                },
                {
                  title: "Auditor que cancelo",
                  field: "auditorNameCanceled"
                },
                {
                  title: "Fecha",
                  field: "createdDateFormat"
                },
                {
                  title: "Linea",
                  field: "linea"
                },
                {
                  title: "Planta",
                  field: "planta"
                },
                {
                  title: "Producto",
                  field: "producto"
                },
                {
                  title: "Hallazgos",
                  field: "hallazgo"
                },
                {
                  title: "Defecto",
                  field: "listaHallazgos"
                },
                {
                  title: "Origen",
                  field: "origen"
                },
                {
                  title: "Causa",
                  field: "observacion"
                }
              ]}
            />
            {producto.nombre.toLocaleLowerCase().includes("celu") && (
              <div className="">
                <Button className={`${buttonClases.blueButton}`}>
                  <CSVLink data={listaCsv} header={headers} filename={"Reporte-OQC-Celulares.csv"} separator=",">
                    Exportar a CSV
                  </CSVLink>
                </Button>
              </div>
            )}
          </main>
        )}
      </div>
    </main>
  );
};
