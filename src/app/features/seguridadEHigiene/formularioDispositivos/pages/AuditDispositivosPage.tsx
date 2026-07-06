import { Delete, Edit } from "@mui/icons-material";
import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AuditDispositivosForm } from "app/features/seguridadEHigiene/formularioDispositivos/modals/AuditDispositivosForm";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { AuditDispositivoSliceRequests } from "app/features/audit/slices/AuditDispositivoSlice";

export const AuditDispositivosPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const ListOfPlants = useAppSelector((p) => p.plant.dataAll);
  const [plantSelect, setPlantSelect] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editState, setEditState] = useState(null);
  const getDispositivos = async () => {
    try {
      const response = unwrapResult(
        await dispatch(AuditDispositivoSliceRequests.GetAllByPlantAndTable({ table: 2, plantId: plantSelect }))
      );
      setAuditData(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleEdit = (row) => {
    setEditState(row);
    setOpenModal(true);
  };
  const handleDelete = async (id) => {
    try {
      const confirmation = await getConfirmation("Eliminar", "Esta seguro de eliminar el registro?");
      if (confirmation) {
        const response = await dispatch(AuditDispositivoSliceRequests.deleteRequest(id));
        getDispositivos();
        openNotificationUI("Se elimino correctamente", "success");
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    TitleChanger("Formulario para dispositivos de seguridad e higiene");
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);
  useEffect(() => {
    if (plantSelect) getDispositivos();
  }, [plantSelect]);

  return (
    <div className="my-2 mx-4 h-full shadow-elevation-4 bg">
      <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Seleccione una planta</InputLabel>
          <Select
            variant="standard"
            onChange={(e) => {
              if (e.target.value) setPlantSelect(e.target.value);
            }}>
            {ListOfPlants &&
              ListOfPlants.map((x) => (
                <MenuItem key={x.id} value={x.id}>
                  <div className="w-full">
                    <div>{x.name}</div>
                  </div>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
      {plantSelect && (
        <>
          <TableComponent
            columns={[
              {
                title: "Nombre",
                field: "nombre"
              },
              {
                title: "Marca",
                field: "marca"
              },
              {
                title: "Modelo",
                field: "modelo"
              },
              {
                title: "Año",
                field: "ano"
              },
              {
                title: "Interno",
                field: "interno"
              },
              {
                title: "Código",
                field: "codigo"
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => {
                              handleEdit(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              handleDelete(row.id);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            IDcolumn="id"
            dataInfo={auditData}
            buscar
            agregar={() => {
              setEditState(null);
              setOpenModal(true);
            }}
          />
          <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Agregar dispositivos">
            <AuditDispositivosForm
              refresh={getDispositivos}
              plantId={plantSelect}
              setOpenModal={setOpenModal}
              editState={editState}
            />
          </ModalCompoment>
        </>
      )}
    </div>
  );
};
