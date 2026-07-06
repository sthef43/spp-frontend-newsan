import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { BinariosIdentificadoresSliceRequest } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IBinariosIdentificadores } from "app/models/IBinariosIdentificadores";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { BinariosForm } from "../modal/BinariosForm";

export const BinariosTable = () => {
  const [editState, setEditState] = useState<IBinariosIdentificadores>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const binarios = useAppSelector<IBinariosIdentificadores[]>((state) => state.binariosIdentificadores.dataAll);
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const handleDelete = async (id) => {
    try {
      const confirm = await getConfirmation("Borrar binario", "Está seguro que desea borrar el binario?");
      if (confirm) {
        const response = await dispatch(BinariosIdentificadoresSliceRequest.deleteRequest(id));
        openNotificationUI("Se elimino correctamente", "success");
        await dispatch(BinariosIdentificadoresSliceRequest.getAllRequest());
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleEdit = (rowData) => {
    setEditState(rowData);
    setModalOpen(true);
  };
  const handleOpenModal = () => {
    setEditState(null);
    setModalOpen(true);
  };
  return (
    <div>
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Nombre ",
            field: "nombre"
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
        agregar={() => {
          handleOpenModal();
        }}
        dataInfo={binarios}
      />
      <ModalCompoment title={`Agregar un binario`} openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <BinariosForm setOpenPopup={setModalOpen} editState={editState} />
      </ModalCompoment>
    </div>
  );
};
