import { unwrapResult } from "@reduxjs/toolkit";
import { DotaPuestoSliceRequests } from "app/features/ingenieria/slices/DotaPuestoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDotaSector } from "app/models/IDotaSector";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useState, useEffect } from "react";
import { InputLabel, MenuItem, Select, Button } from "@mui/material";
import { IDotaPuesto } from "app/models/IDotaPuesto";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Typography } from "@mui/material";

interface props {
  sectorSelected: IDotaSector;
}
export const AccionPuestosOfSector = ({ sectorSelected }: props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [sectores, setSectores] = useState([]);
  const [puestos, setPuestos] = useState<IDotaPuesto[]>([]);
  const [puestoSelected, setPuestoSelected] = useState<IDotaPuesto>();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    getPuestosBySector();
    getPuestos();
  };

  const getPuestosBySector = async () => {
    const result = unwrapResult(await dispatch(DotaPuestoSliceRequests.getAllRequest()));
    if (!result) console.log("sin sectores");
    setSectores(result.filter((x) => x.dotaSectorId == sectorSelected.id)); //Traigo los  puestos para el sector seleccionado.
  };

  const getPuestos = async () => {
    const result = unwrapResult(await dispatch(DotaPuestoSliceRequests.getAllRequest()));
    if (!result) console.log("sin puestos");
    setPuestos(result.filter((x) => x.dotaSectorId == null)); //Filtro los que no tienen asignado un sector.
  };

  const guardar = async () => {
    if (!puestoSelected) openNotificationUI("Seleccione un puesto", "warning");

    //Le asigno un sector y updeteo el puesto.
    const objectPuesto: IDotaPuesto = { ...puestoSelected, dotaSectorId: sectorSelected.id };
    const result = unwrapResult(await dispatch(DotaPuestoSliceRequests.PutRequest(objectPuesto)));
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      refresh();
    }
  };

  const handleChange = (e) => {
    const idPuestoSelected = e.target.value;
    const puestoSelected = puestos.find((x) => x.id == idPuestoSelected);
    setPuestoSelected(puestoSelected);
  };

  return (
    <div>
      <Typography variant="h3">Sector: {sectorSelected.nombre}</Typography>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "400px" }}>
          <InputLabel>Seleccione un puesto</InputLabel>
          <Select variant="standard" style={{ width: "400px" }} onChange={handleChange}>
            {puestos?.map((x) => (
              <MenuItem key={x.id} value={x.id}>
                <div className="w-full">
                  <div>{x.nombre}</div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </div>
        <Button className="text-center" onClick={guardar}>
          Guardar
        </Button>
      </div>

      <TableComponent
        Dense={true}
        Overflow={false}
        buscar={false}
        IDcolumn={"id"}
        columns={[
          {
            title: "Sector",
            field: "nombre"
          }
        ]}
        dataInfo={sectores}
      />
    </div>
  );
};
