import React, { FC, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  styled,
  Tooltip
} from "@mui/material";
import { IPlanProdSpp } from "../../models/IPlanProdSpp";
import { IPlanProdSppMes } from "../../models/IPlanProdSppMes";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--background-color-tableHeader-planProdSpp)",
    color: "var(--text-color)",
    padding: 4,
    minWidth: 80,
    fontSize: 12,
    whiteSpace: "nowrap"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 4,
    whiteSpace: "nowrap"
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

interface Props {
  planes: IPlanProdSpp[];
  mesInicio: string;
  mesFin: string;
  anio: number;
  mostrar: boolean;
}

interface DayInfo {
  label: string;
  date: dayjs.Dayjs;
}

interface PlanDayDistribution {
  planIndex: number;
  plan: IPlanProdSpp;
  days: { dayIndex: number; cantidad: number }[];
}

function generarDiasHabiles(mesInicio: string, mesFin: string, anio: number): DayInfo[] {
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  const mesIndexInicio = meses.findIndex((m) => m === mesInicio.toUpperCase());
  const mesIndexFin = meses.findIndex((m) => m === mesFin.toUpperCase());

  if (mesIndexInicio === -1 || mesIndexFin === -1) return [];

  const startDate = dayjs(new Date(anio, mesIndexInicio, 1));
  const endDate = dayjs(new Date(anio, mesIndexFin + 1, 0));

  const days: DayInfo[] = [];
  let current = startDate;
  while (current.isSameOrBefore(endDate, "day")) {
    const diaSemana = current.day();
    if (diaSemana !== 0 && diaSemana !== 6) {
      days.push({
        label: current.format("DD/MM"),
        date: current
      });
    }
    current = current.add(1, "day");
  }
  return days;
}

function distribuirPlanesEnDias(planes: IPlanProdSpp[], dias: DayInfo[]): PlanDayDistribution[] {
  const planesOrdenados = [...planes].sort((a, b) => (a.position || 0) - (b.position || 0));
  let dayCursor = 0;
  const result: PlanDayDistribution[] = [];

  for (let i = 0; i < planesOrdenados.length; i++) {
    const plan = planesOrdenados[i];
    const diasNecesarios = Math.ceil(plan.cantidad / plan.ritmo);
    const cantidadPorDia = plan.ritmo;
    let restante = plan.cantidad;
    const planDays: { dayIndex: number; cantidad: number }[] = [];

    for (let d = 0; d < diasNecesarios && dayCursor < dias.length; d++) {
      const todayQty = d === diasNecesarios - 1 ? restante : cantidadPorDia;
      planDays.push({ dayIndex: dayCursor, cantidad: todayQty });
      restante -= todayQty;
      dayCursor++;
    }

    result.push({ planIndex: i, plan, days: planDays });
  }

  return result;
}

export const TableDesgloceDiarioComponent: FC<Props> = ({ planes, mesInicio, mesFin, anio, mostrar }) => {
  const { dias, distribucion, mockTotales } = useMemo(() => {
    if (!mostrar || !planes || planes.length === 0) {
      return { dias: [], distribucion: [], mockTotales: [] as IPlanProdSppMes[] };
    }

    const diasHabiles = generarDiasHabiles(mesInicio, mesFin, anio);
    const distribucion = distribuirPlanesEnDias(planes, diasHabiles);

    const mockTotales: IPlanProdSppMes[] = diasHabiles.map((dia, i) => {
      const produccionDelDia = distribucion.reduce((sum, p) => {
        const dayData = p.days.find((d) => d.dayIndex === i);
        return sum + (dayData?.cantidad || 0);
      }, 0);
      const objetivoDelDia = distribucion.reduce((sum, p) => {
        const dayData = p.days.find((d) => d.dayIndex === i);
        return sum + (dayData ? p.plan.ritmo : 0);
      }, 0);

      return {
        id: i + 1,
        objetivoMensual: objetivoDelDia,
        produccionReal: produccionDelDia,
        diferencia: objetivoDelDia - produccionDelDia,
        produccionProyectada: 0,
        produccionTotal: produccionDelDia,
        diasHabiles: dia.label,
        porcentajeDiferencia: BigInt(0),
        planProdSppId: 0,
        planProdSpp: null!
      };
    });

    return { dias: diasHabiles, distribucion, mockTotales };
  }, [planes, mesInicio, mesFin, anio, mostrar]);

  if (!mostrar || dias.length === 0) return null;

  const totalPlan = (planIdx: number) => {
    return distribucion[planIdx].days.reduce((sum, d) => sum + d.cantidad, 0);
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ minWidth: dias.length * 80 + 200 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" sx={{ minWidth: 80 }}>SKU</StyledTableCell>
            <StyledTableCell align="center" sx={{ minWidth: 40 }}>Pos</StyledTableCell>
            <StyledTableCell align="center" sx={{ minWidth: 50 }}>Lote</StyledTableCell>
            {dias.map((dia, i) => (
              <StyledTableCell key={i} align="center" sx={{ minWidth: 60 }}>
                <Tooltip title={dia.date.format("dddd DD/MM/YYYY")}>
                  <span>{dia.label}</span>
                </Tooltip>
              </StyledTableCell>
            ))}
            <StyledTableCell align="center" sx={{ minWidth: 60 }}>Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {distribucion.map((item, planIdx) => (
            <StyledTableRow key={item.plan.id || planIdx}>
              <StyledTableCell align="center">{item.plan.modelo?.nombre || "—"}</StyledTableCell>
              <StyledTableCell align="center">{item.plan.position}</StyledTableCell>
              <StyledTableCell align="center">{item.plan.lote}</StyledTableCell>
              {dias.map((_dia, dayIdx) => {
                const dayData = item.days.find((d) => d.dayIndex === dayIdx);
                return (
                  <StyledTableCell
                    key={dayIdx}
                    align="center"
                    sx={dayData ? { backgroundColor: "rgba(89, 183, 247, 0.15)" } : {}}
                  >
                    {dayData ? dayData.cantidad : "—"}
                  </StyledTableCell>
                );
              })}
              <StyledTableCell align="center" sx={{ fontWeight: 600 }}>
                {totalPlan(planIdx)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
          <StyledTableRow sx={{ backgroundColor: "var(--background-color-tableHeader-planProdSpp)" }}>
            <StyledTableCell align="center" sx={{ fontWeight: 700 }}>Total</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
            {mockTotales.map((total, i) => (
              <StyledTableCell key={i} align="center" sx={{ fontWeight: 600 }}>
                <Tooltip
                  title={`Obj: ${total.objetivoMensual} | Real: ${total.produccionReal} | Diff: ${total.diferencia}`}
                >
                  <span>{total.produccionReal}</span>
                </Tooltip>
              </StyledTableCell>
            ))}
            <StyledTableCell align="center" sx={{ fontWeight: 700 }}>
              {mockTotales.reduce((s, t) => s + t.produccionReal, 0)}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
