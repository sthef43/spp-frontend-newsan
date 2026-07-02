import { ILinea } from "app/models";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TimerIcon from "@mui/icons-material/Timer";
import DownloadIcon from "@mui/icons-material/Download";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";

interface Props {
  paradasLineaSelected: IParadasDeLinea[];
  lineaSelected: ILinea;
}

export const TableParadaLinea = ({ paradasLineaSelected, lineaSelected }: Props): JSX.Element => {
  const [totalTiempoParadas, setTotalTiempoParadas] = useState<number>(0);
  const [totalParadasLinea, setTotalParadasLinea] = useState<number>(0);

  const exportarExcelMovs = useRef<ExcelExport>(null);

  useEffect(() => {
    if (!paradasLineaSelected) return;
    setTotalParadasLinea(paradasLineaSelected.length);

    const tiempo = paradasLineaSelected.reduce((contador, parada) => {
      const inicio = moment(parada.horaInicio, "hh:mm a");
      const fin = moment(parada.horaFin, "hh:mm a");
      return contador + fin.diff(inicio, "minutes");
    }, 0);

    setTotalTiempoParadas(tiempo);
  }, [paradasLineaSelected, lineaSelected]);

  const dataListaParaExcel = useMemo(() => {
    if (!paradasLineaSelected) return [];

    const dataOrdenada = [...paradasLineaSelected].sort((a, b) => {
      return moment(b.createdDate).diff(moment(a.createdDate));
      // return moment(a.createdDate).diff(moment(b.createdDate));
    });

    return dataOrdenada.map((row) => {
      const inicio = moment(row.horaInicio, "hh:mm a");
      const fin = moment(row.horaFin, "hh:mm a");
      const minutos = fin.diff(inicio, "minutes");

      return {
        ...row,
        fechaFormateada: moment(row.createdDate).format("DD/MM/YYYY"),
        sectorNombre: row.areaTraza?.nombre || "Sin Sector",
        minutosCalculados: minutos
      };
    });
  }, [paradasLineaSelected]);

  const exportParadasLinea = () => {
    if (exportarExcelMovs.current) {
      exportarExcelMovs.current.save();
    }
  };

  return (
    <div className="w-full mt-3 px-3 ">
      <div className="bg-white rounded-t-md">
        <div className="w-full px-1.5 pt-0.5">
          <div className="bg-[#F2F4F6] rounded-t-md w-full flex justify-between items-center h-16 px-2">
            <div className="flex flex-row items-center gap-2">
              <ReportProblemIcon sx={{ color: "#F59E0B", fontSize: "1.7rem" }} />
              <p className="m-0 font-semibold text-[#45464D]">{lineaSelected.alias}</p>
            </div>
            <div className="flex flex-row items-center gap-7">
              <IconButton
                aria-label="fingerprint"
                onClick={exportParadasLinea}
                color="success"
                size="medium"
                sx={{
                  marginLeft: "60px",
                  backgroundColor: "#61D864",
                  "&:hover": { backgroundColor: "#45b848" }
                }}>
                <DownloadIcon
                  sx={{
                    color: "#3F3D56",
                    fontSize: "25px"
                  }}
                />
              </IconButton>
              <div className="flex flex-row items-center gap-2">
                <TimerIcon sx={{ color: "#D32F2F", fontSize: "2rem" }} />
                <div className="flex flex-col">
                  <p>{totalTiempoParadas} min.</p>
                  <p>{totalParadasLinea} paradas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TableComponent
          IDcolumn={"id"}
          columns={[
            {
              title: "Fecha",
              field: "createdDate",
              render: (row) => moment(row.createdDate).format("DD/MM/YYYY")
            },
            {
              title: "Sector",
              field: "",
              render: (row) => row.areaTraza.nombre
            },
            {
              title: "Motivo",
              field: "causa",
              render: (row) => (
                <Tooltip
                  title={row.causa}
                  arrow
                  placement="top"
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontSize: "14px",
                        backgroundColor: "#475569",
                        padding: "8px 12px"
                      }
                    },
                    arrow: {
                      sx: {
                        color: "#475569"
                      }
                    }
                  }}>
                  <div className="max-w-[250px] truncate cursor-pointer text-slate-700 hover:text-blue-600 transition-colors">
                    {row.causa}
                  </div>
                </Tooltip>
              )
            },
            {
              title: "Minutos",
              field: "",
              render: (row) => {
                const inicio = moment(row.horaInicio, "hh:mm a");
                const fin = moment(row.horaFin, "hh:mm a");
                return fin.diff(inicio, "minutes");
              }
            }
          ]}
          dataInfo={paradasLineaSelected}
        />
      </div>
      <>
        <ExcelExport
          data={dataListaParaExcel}
          ref={exportarExcelMovs}
          fileName={`Paradas_de_linea_${lineaSelected.alias}_${moment().format("DD-MM-YYYY_HH-mm")}.xlsx`}>
          <ExcelExportColumn field="supervisor" title="Supervisor" />
          <ExcelExportColumn field="fechaFormateada" title="Fecha" />
          <ExcelExportColumn field="sectorNombre" title="Sector" />
          <ExcelExportColumn field="causa" title="Motivo" />
          <ExcelExportColumn field="minutosCalculados" title="Tiempo(minutos)" />
        </ExcelExport>
      </>
    </div>
  );
};
