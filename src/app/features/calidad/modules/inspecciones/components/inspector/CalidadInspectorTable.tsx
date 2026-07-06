import { unwrapResult } from "@reduxjs/toolkit";
import { CalidadInspectorSliceRequest } from "app/Middleware/reducers/CalidadInspectorSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ICalidadInspector } from "app/models/ICalidadInspector";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import CalidadInspectorForm from "./CalidadInspectorForm";
import { Edit, Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";

const CalidadInspectorTable = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [inspectores, setInspectores] = useState<ICalidadInspector[]>();
  const [openModal, setOpenModal] = useState(false);
  const { getConfirmation } = useConfirmationDialog();
  const [editState, setEditState] = useState<ICalidadInspector | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  const getData = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const response = unwrapResult(await dispatch(CalidadInspectorSliceRequest.getAllRequest()));
      setInspectores(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Ocurrio un error al intentar Obtener los datos", "error");
    }
  };

  const onRefresh = () => {
    console.log("refres");
    getData();
  };

  const onAdd = () => {
    console.log("add");
    setEdit(false);
    setOpenModal(true);
  };

  const onEdit = (inspector: ICalidadInspector) => {
    setEditState(inspector);
    setEdit(true);
    setOpenModal(true);
  };

  const onDelete = async (id) => {
    try {
      const resp = await getConfirmation("Borrar Inspector", "¿Esta seguro que quiere eliminar al inspector?");
      if (!resp) return;
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CalidadInspectorSliceRequest.deleteRequest(id)));
      if (response) {
        openNotificationUI("Registro Eliminado Correctamente", "success");
        onRefresh();
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Ocurrio Un error al intentar eliminar el registro", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <TableComponent
        IDcolumn="id"
        buscar
        agregar={onAdd}
        columns={[
          {
            title: "Usuario",
            field: "appUser.username"
          },
          {
            title: "Codigo",
            field: "codigo"
          },
          {
            title: "Categoria",
            field: "categoria"
          },
          {
            title: "Ranking",
            field: "",
            render: (row) => {
              return <span>10</span>;
            }
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
                          onEdit(row);
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
                          onDelete(row.id);
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
        dataInfo={inspectores}
      />
      <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title="Calidad Inspector">
        <CalidadInspectorForm edit={edit} editState={editState} setModal={setOpenModal} refresh={onRefresh} />
      </ModalCompoment>
    </div>
  );
};

export default CalidadInspectorTable;
