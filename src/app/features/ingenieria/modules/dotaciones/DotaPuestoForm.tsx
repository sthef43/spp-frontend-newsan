import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { DotaPuestoSliceRequests } from "app/Middleware/reducers/DotaPuestoSlice";
import { DotaSectorSliceRequests } from "app/Middleware/reducers/DotaSectorSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { IDotaPuesto } from "app/models/IDotaPuesto";
import { IDotaSector } from "app/models/IDotaSector";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState, useEffect } from "react";
import { Label } from "recharts";

export const DotaPuestoForm = () => {
  const classesButtons = MaterialButtons();
  const dispatch = useAppDispatch();
  const [listDotaPuesto, setListDotaPuesto] = useState<IDotaPuesto[]>([]);

  const initialState: IDotaPuesto = {
    nombre: "",
    dotaSectorId: 0
  };

  const formValid = () => {
    if (form.nombre != "" && form.dotaSectorId != 0) return true;
    else return false;
  };

  const guardar = async () => {
    if (!formValid) openNotificationUI("Cargar campos", "warning");
    const result = unwrapResult(await dispatch(DotaPuestoSliceRequests.PostRequest(form)));
    if (result) {
      openNotificationUI("Guardado con exito", "success");
      getListDotaPuesto();
      setForm({ ...form, nombre: "" }); //Reset form.
    }
  };

  const { openNotificationUI } = useNotificationUI();

  const getListDotaPuesto = async () => {
    const result = unwrapResult(await dispatch(DotaPuestoSliceRequests.getAllRequest()));
    if (result) setListDotaPuesto(result);
  };

  useEffect(() => {
    getPlantas();
    getListDotaPuesto();
  }, []);

  const [sectores, setSectores] = useState<IDotaSector[]>([]);
  const getSectores = async (plantId: number) => {
    const result = unwrapResult(await dispatch(DotaSectorSliceRequests.getAllRequest()));
    if (result) {
      setSectores(result.filter((x) => x.plantId == plantId));
    }
  };

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
  };

  const [form, setForm] = useState<IDotaPuesto>(initialState);

  const handlePlant = (e) => {
    const plantId = e.target.value;
    //setForm({...form, plantId: plantId});
    if (plantId) getSectores(plantId);
  };

  const handleSector = (e) => {
    const sectorId = e.target.value;
    setForm({ ...form, dotaSectorId: sectorId });
  };

  return (
    <div className="flex flex-col">
      {plantas && (
        <div className="p-2">
          <InputLabel>Seleccione una planta</InputLabel>
          <Select variant="standard" style={{ width: "400px" }} onChange={handlePlant}>
            {plantas?.map((x) => (
              <MenuItem key={x.id} value={x.id}>
                <div className="w-full">
                  <div>{x.name}</div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
      {sectores && (
        <div className="p-2">
          <InputLabel>Seleccione un sector</InputLabel>
          <Select value={form.dotaSectorId} variant="standard" style={{ width: "400px" }} onChange={handleSector}>
            {sectores?.map((x) => (
              <MenuItem key={x.id} value={x.id}>
                <div className="w-full">
                  <div>{x.nombre}</div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
      <Label>Nombre</Label>
      <TextField
        id="outlined-basic"
        label="Nombre"
        variant="outlined"
        value={form.nombre}
        onChange={(e) => {
          setForm({ ...form, nombre: e.target.value });
        }}
      />
      <Button className={classesButtons.greenButton} onClick={guardar}>
        Guardar
      </Button>

      <div>
        {listDotaPuesto && (
          <TableComponent
            Collapse={false}
            Dense={true}
            Overflow={false}
            buscar={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Sector",
                field: "dotaSector.nombre"
              },
              {
                title: "Puesto",
                field: "nombre"
              }
            ]}
            dataInfo={listDotaPuesto}
          />
        )}
      </div>
    </div>
  );
};
