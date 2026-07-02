/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { ICtrlPlacas } from "app/models/ICtrlPlacas";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";

interface Props {
  reporteMuestrasPlacas: ICtrlPlacas[];
}

export const ExportacionMuestrasPlacasExcel: React.FC<Props> = ({ reporteMuestrasPlacas }) => {
  const { formatDateHourOrMinutes } = UseUtilHooks();

  const [dataExcel, setDataExcel] = useState<any[]>([]);

  const setExcel = () => {
    const newData = reporteMuestrasPlacas.map((elementos) => {
      const auditorName = elementos.appUser.operator.name + " " + elementos.appUser.operator.surname;
      const linea = elementos.lineaProduccion.nombre;
      const planta = elementos.plant.name;
      const semielaborado = elementos.semiElaborado;
      const modelo = elementos.modelo;
      const estado = elementos.estado ? "GOOD" : "NO GODD";
      const detalles = elementos.detalle;
      const hallazgo =
        elementos.ctrlPlacasHallazgosId && elementos.ctrlPlacasHallazgos?.descripcion
          ? elementos.ctrlPlacasHallazgos.descripcion
          : "-";
      const muestra =
        elementos.ctrlPlacasTipoMuestraId && elementos.ctrlPlacasTipoMuestra?.nombre
          ? elementos.ctrlPlacasTipoMuestra.nombre
          : "-";
      const fecha = formatDateHourOrMinutes({
        optionDate: "fullDate",
        optionHour: "fechaBaseDatos",
        fechaIngresada: elementos.createdDate
      });
      return {
        ...elementos,
        auditorName,
        linea,
        planta,
        semielaborado,
        modelo,
        estado,
        detalles,
        hallazgo,
        muestra,
        fecha
      };
    });
    setDataExcel(newData);
  };

  useEffect(() => {
    if (reporteMuestrasPlacas) {
      setExcel();
    }
  }, reporteMuestrasPlacas);

  return (
    <main>
      <div>
        {dataExcel && dataExcel.length > 0 && (
          <main>
            <ExportExcel
              title="Reporte Muestreo Placas"
              stylesButton="m-0"
              data={dataExcel && dataExcel.length > 0 ? dataExcel : []}
              columns={[
                {
                  title: "Auditor",
                  field: "auditorName"
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
                  title: "SemiElaborado",
                  field: "semielaborado"
                },
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Estado",
                  field: "estado"
                },
                {
                  title: "Detalles",
                  field: "detalles"
                },
                {
                  title: "Hallazgo",
                  field: "hallazgo"
                },
                {
                  title: "Muestra",
                  field: "muestra"
                },
                {
                  title: "Fecha",
                  field: "fecha"
                }
              ]}
            />
          </main>
        )}
      </div>
    </main>
  );
};
