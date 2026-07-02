import { TextField, InputLabel, Select, MenuItem } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotaSectorSliceRequests } from "app/Middleware/reducers/DotaSectorSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDotaSector } from "app/models/IDotaSector";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState, useEffect } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Edit, Label } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AccionPuestosOfSector } from "./AccionPuestosOfSector";
import { IPlant } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";

export const DotaSectorForm = () => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const classesButtons = MaterialButtons();
  const [list, setList] = useState<IDotaSector[]>(null);
  const [name, setName] = useState("");
  const [planta, setPlanta] = useState(0);
  const [modalEdit, setModalEdit] = useState(false);
  const [sectorSelected, setSectorSelected] = useState<IDotaSector>();
  const [plantas, setPlantas] = useState<IPlant[]>();

  const guardar = async () => {
    if (!planta || planta == 0) {
      openNotificationUI("Seleccione planta", "warning");
      return false;
    }
    const objectGuardar: IDotaSector = { nombre: name.toUpperCase(), plantId: planta };
    const result = unwrapResult(await dispatch(DotaSectorSliceRequests.PostRequest(objectGuardar)));
    if (result) {
      openNotificationUI("Guardado con exito", "success");
      getList();
      setName("");
    }
  };

  const getList = async () => {
    const result = unwrapResult(await dispatch(DotaSectorSliceRequests.getAllRequest()));
    if (result) setList(result);
  };

  useEffect(() => {
    getList();
    getPlantas();
  }, []);

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
    else setPlantas([]);
  };

  const handlePlant = (e) => {
    setPlanta(e.target.value);
  };

  return (
    <div className="flex flex-col w-full p-2">
      {plantas && (
        <div>
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
      <Label>Nombre</Label>
      <TextField
        id="outlined-basic"
        label="Nombre"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button className={classesButtons.greenButton} onClick={guardar}>
        Guardar
      </Button>
      <div>
        {list && (
          <TableComponent
            Collapse={false}
            Dense={true}
            Overflow={false}
            buscar={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Planta",
                field: "plant.name"
              },
              {
                title: "Nombre",
                field: "nombre"
              },
              {
                title: "Acciones",
                field: "",
                render: (row: IDotaSector) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Agrrgar Puestos">
                          <IconButton
                            onClick={() => {
                              setSectorSelected(row);
                              setModalEdit(true);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Edit color="primary" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={list}
          />
        )}
      </div>
      <ModalCompoment openPopup={modalEdit} setOpenPopup={setModalEdit} title={"Asignacion de puestos."}>
        <AccionPuestosOfSector sectorSelected={sectorSelected}></AccionPuestosOfSector>
      </ModalCompoment>
    </div>
  );
};
