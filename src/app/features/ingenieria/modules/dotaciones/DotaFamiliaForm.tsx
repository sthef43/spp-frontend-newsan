import { TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotaFamiliaSliceRequests } from "app/features/ingenieria/slices/DotaFamiliaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDotaFamilia } from "app/models/IDotaFamilia";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState, useEffect } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Edit, Label } from "@mui/icons-material";
import { AccionLineasOfFamilia } from "./AccionLineasOfFamilia";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";

export const DotaFamiliaForm = (props: any) => {
  const classesButtons = MaterialButtons();
  const dispatch = useAppDispatch();
  const [list, setList] = useState<IDotaFamilia[]>(null);
  const [name, setName] = useState("");
  const [modalEdit, setModalEdit] = useState(false);
  const [dotaFamiliaSelected, setDotaFamiliaSelected] = useState<IDotaFamilia>();

  const { setRefreshFamilia } = props;

  const guardar = async () => {
    const objectGuardar: IDotaFamilia = { nombre: name.toUpperCase() };
    const result = unwrapResult(await dispatch(DotaFamiliaSliceRequests.PostRequest(objectGuardar)));
    if (result) {
      openNotificationUI("Guardado con exito", "success");
      getList();
      setName("");
      //setRefreshFamilia(true);
    }
  };

  const { openNotificationUI } = useNotificationUI();

  const getList = async () => {
    const result = unwrapResult(await dispatch(DotaFamiliaSliceRequests.getAllRequest()));
    if (result) setList(result);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="flex flex-col">
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
                title: "Nombre",
                field: "nombre"
              },
              {
                title: "Acciones",
                field: "",
                render: (row: IDotaFamilia) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Agregar Lineas">
                          <IconButton
                            onClick={() => {
                              setDotaFamiliaSelected(row);
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
      {dotaFamiliaSelected && (
        <ModalCompoment openPopup={modalEdit} setOpenPopup={setModalEdit} title={"Asignacion de lineas."}>
          <AccionLineasOfFamilia
            dotaFamiliaSelected={dotaFamiliaSelected.id}
            setRefreshFamilia={setRefreshFamilia}></AccionLineasOfFamilia>
        </ModalCompoment>
      )}
    </div>
  );
};
