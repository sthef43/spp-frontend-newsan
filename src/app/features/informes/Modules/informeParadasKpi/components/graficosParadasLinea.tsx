import { ParadasPorSectorDTO } from "app/models/DTO/ParadasPorSectorDTO";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TimerIcon from "@mui/icons-material/Timer";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import moment from "moment";
import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";

interface Props {
  dataParadasLinea?: ParadasPorSectorDTO[];
}

export const GraficosParadasLinea = ({ dataParadasLinea }: Props): JSX.Element => {
  const [sectorSeleccionado, setSectorSeleccionado] = useState<ParadasPorSectorDTO | null>(null);
    const exportarExcelMovs = useRef<ExcelExport>(null);


  useEffect(() => {
    if (dataParadasLinea && dataParadasLinea.length > 0) {
      setSectorSeleccionado(dataParadasLinea[0]);
    } else {
      setSectorSeleccionado(null);
    }
  }, [dataParadasLinea]);



const dataParadasSectorExcel = useMemo(() => {

  if (!sectorSeleccionado || !sectorSeleccionado.paradas) return [];

  // Mapeamos las paradas de ese sector
  return sectorSeleccionado.paradas.map(parada => {
    return {
      ...parada,

      fechaFormateada: moment(parada.fecha).format("DD/MM/YYYY"),
      rangoHorario: `${parada.horaInicio} a ${parada.horaFin}`,
      minutosStr: `${parada.minutos} min`
    };
  });
}, [sectorSeleccionado]); 

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    // payload.value trae el texto que esta en el dataKey
    const nombreCompleto = payload.value;
    const MAX_LETRAS = 12;

    const nombreCorto =
      nombreCompleto.length > MAX_LETRAS ? `${nombreCompleto.substring(0, MAX_LETRAS)}...` : nombreCompleto;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16} // Esto empuja el texto un poquito hacia abajo para que no se pegue a la línea
          textAnchor="middle" // Centra el texto debajo de la marquita
          fill="#666" // Color de la letra
          fontSize={15}>
          <title>{nombreCompleto}</title>
          {nombreCorto}
        </text>
      </g>
    );
  };


const handleExportarDetalle = () => {
  if (exportarExcelMovs.current) {
    exportarExcelMovs.current.save();
  }
};



  return (
    <div className="w-full flex flex-col md:flex-row gap-4 h-[400px]">
      <div className="w-[65%] bg-white p-2 rounded-md">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataParadasLinea} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="areaTraza.nombre" tick={<CustomXAxisTick />} interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="totalMinutos"
              name="Tiempo Total (Minutos)"
              radius={[10, 10, 0, 0]}
              cursor="pointer"
              onClick={(data) => {
                console.log("data", data);
                const infoOriginal = data.payload ? data.payload : data;
                setSectorSeleccionado(infoOriginal);
              }}>
              {dataParadasLinea?.map((entry, index) => {
                const estaSeleccionado = sectorSeleccionado?.areaTrazaId === entry.areaTrazaId;

                return <Cell key={`cell-${index}`} fill={estaSeleccionado ? "#EF787A" : "#69A7FF"} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {sectorSeleccionado && (
        <div className="w-full md:w-1/3 bg-slate-50 border border-slate-200 shadow-md rounded-md overflow-y-auto animate__animated animate__fadeInRight">
          <div className="flex justify-end items-center mb-4 border-b border-slate-300 pb-2 absolute top-1 right-2">
            <button onClick={() => setSectorSeleccionado(null)} className="text-slate-400 hover:text-red-500 font-bold">
              X
            </button>
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <div className="w-full flex flex-row justify-between p-1 gap-1 bg-[#F2F4F6] h-16">
              <div className="flex items-center gap-1 w-1/2">
                <ReportProblemIcon sx={{ color: "#F59E0B", fontSize: "1.5rem" }} />
                <p className="m-0 font-semibold text-slate-600 text-xs">
                  Área: {sectorSeleccionado.areaTraza?.nombre ?? "Desconocida"}
                </p>
              </div>
              <div className="flex flex-row  items-center gap-2">
                <IconButton
                  aria-label="descargar excel"
                  color="success"
                  onClick={handleExportarDetalle}
                  size="small"
                  sx={{
                    backgroundColor: "#61D864",
                    "&:hover": { backgroundColor: "#45b848" }
                  }}>
                  <DownloadIcon
                    sx={{
                      color: "#3F3D56",
                      fontSize: "20px"
                    }}
                  />
                </IconButton>
                <TimerIcon sx={{ color: "#D32F2F", fontSize: "1.7rem" }} />
                <div className="flex flex-col">
                  <p className="m-0 text-sm">{sectorSeleccionado.totalMinutos} min.</p>
                  <p className="m-0 text-sm">{sectorSeleccionado.paradas?.length ?? 0} paradas.</p>
                </div>
              </div>
            </div>
            <div className="mt-2 p-4">
              <strong className="text-slate-800 uppercase tracking-wider text-xs">Historial de eventos:</strong>

              <ul className="mt-2 space-y-2">
                {sectorSeleccionado.paradas?.map((parada, idx) => (
                  <li key={idx} className="bg-white p-2 rounded border border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-700">
                      {moment(parada.fecha).format("DD/MM/YYYY")} - {parada.horaInicio} a {parada.horaFin}
                    </span>
                    <br />
                    <span className="text-xs text-slate-500 italic">
                      Causa: {parada.causa} ({parada.minutos} min)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <>
        <ExcelExport
            data={dataParadasSectorExcel}
            ref={exportarExcelMovs}
            fileName={`Paradas_de_sector_${sectorSeleccionado?.areaTraza?.nombre}_${moment().format("DD-MM-YYYY_HH-mm")}.xlsx`}>
            <ExcelExportColumn field="lineaProduccion.nombre" title="Linea" />
            <ExcelExportColumn field="fechaFormateada" title="Fecha" />
            <ExcelExportColumn field="areaTraza.nombre" title="Sector" />
            <ExcelExportColumn field="causa" title="Motivo" />
            <ExcelExportColumn field="rangoHorario" title="Horario cargado" />
            <ExcelExportColumn field="minutosStr" title="Duración(mins)" />
          </ExcelExport>
      </>
    </div>
  );
};
