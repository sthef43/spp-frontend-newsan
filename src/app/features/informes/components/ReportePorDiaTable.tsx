/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import { IPlanProd } from "app/models";
import { ModalCompoment } from "../../../shared/components/ModalComponent";
import { ProduccionDialog } from "../../produccion/modules/gestionProduccion/modals/ProduccionDialog";

interface props {
  lotes: IPlanProd[];
}

const norm = (v: any) => String(v ?? "").trim();
const isAutomotriz = (row: any) => norm(row?.linea?.descripcion).toUpperCase() === "AUTOMOTRIZ";

const scoreRow = (x: any) => {
  let s = 0;
  if (x?.desde != null) s += 2;
  if (x?.hasta != null) s += 2;
  if (x?.semielaboradoId != null) s += 3;
  if (x?.organizacion != null) s += 2;
  if (x?.producidoPlacas != null) s += 2;
  if (x?.producido != null) s += 1;
  return s;
};

export const ReportePorDiaTable = ({ lotes }: props): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanProd, setSelectedPlanProd] = useState(0);
  const [loteSelect, setLoteSelect] = useState(null);

  const setRow = (row) => {
    setSelectedPlanProd(row.idProduccion);
    setLoteSelect(row);
    setModalOpen(true);
  };

  const getPrefijo = (row: any) => {
    const pref = (row?.prefijo ?? "").toString().trim();
    if (pref) return pref;

    const ultimoRaw = row?.ultimoNewsan;
    if (ultimoRaw === "Placas") return "Placas";
    if (ultimoRaw === null || ultimoRaw === undefined) return "Placas";

    const s = String(ultimoRaw).trim();
    if (!s || s === "0" || s === "0000" || s === "00000") return "Placas";

    return s.padStart(5, "0");
  };

  const lotesView = useMemo(() => {
    if (!lotes || lotes.length === 0) return [];

    const map = new Map<string, any[]>();

    lotes.forEach((r: any) => {
      const key = `${r?.idLinea}|${norm(r?.numeroOp)}|${norm(r?.lote)}`;
      const arr = map.get(key) ?? [];
      arr.push(r);
      map.set(key, arr);
    });

    const out: any[] = [];

    for (const [, group] of map.entries()) {
      if (group.length === 1) {
        out.push(group[0]);
        continue;
      }

      if (!isAutomotriz(group[0])) {
        out.push(...group);
        continue;
      }

      let best = group[0];
      let bestScore = scoreRow(best);

      for (let i = 1; i < group.length; i++) {
        const s = scoreRow(group[i]);
        if (s > bestScore) {
          best = group[i];
          bestScore = s;
        }
      }

      out.push(best);
    }

    return out;
  }, [lotes]);

  return (
    <div>
      <TableComponent
        excel
        IDcolumn={"idProduccion"}
        columns={[
          { title: "Modelo", field: "codigoModelo" },
          { title: "Linea", field: "linea.descripcion" },
          {
            title: "Prefijo",
            field: "ultimoNewsan",
            render: (row) => getPrefijo(row)
          },
          { title: "Lote", field: "lote" },
          { title: "Numero-OP", field: "numeroOp" },
          { title: "Cantidad", field: "cantidad" },
          { title: "Producidos", field: "cantidadProducida" },
          {
            title: "Pendiente",
            field: "",
            render: (row) => (row.tipoSemiElaborado == null ? row.pendiente : row.cantidad - row.producidoPlacas)
          },
          { title: "No conformes", field: "cantidadRechazos" },
          { title: "Familia", field: "capacidad" },
          {
            title: "Acciones",
            field: "",
            render: (row) => (
              <div className="flex w-full justify-end sm:justify-start gap-4">
                <div>
                  <IconButton onClick={() => setRow(row)} size="small" style={{ position: "relative" }}>
                    <Info />
                  </IconButton>
                </div>
              </div>
            )
          }
        ]}
        dataInfo={lotesView}
        buscar={true}
        Dense={true}
        filterWithSpecificValues={"Estado"}
      />

      <ModalCompoment title="Detalle de lote" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <ProduccionDialog id={selectedPlanProd} loteSelect={loteSelect} />
      </ModalCompoment>
    </div>
  );
};
