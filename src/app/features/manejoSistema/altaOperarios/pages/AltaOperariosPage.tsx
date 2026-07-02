import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useState } from "react";
import { AltaOperarioForm } from "../form/AltaOperarioForm";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IOperator } from "app/models";
import { EditarOperatorModal } from "../modals/EditarOperatorModal";

export const AltaOperariosPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();

  const [modalForm, setModalForm] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [operatorSelected, setOperatorSelected] = useState<IOperator>();

  //Leer
  const [operators, setOperators] = useState([]);
  const getOperators = async () => {
    try {
      const responses = unwrapResult(await dispatch(OperatorSliceRequests.getListOperator()));
      setOperators(responses);
    } catch (error) {
      openNotificationUI("Error al leer operarios.", "error");
    }
  };

  //Eliminar
  const eliminar = async (row) => {
    if (row.appUser[0]?.validado) {
      openNotificationUI("Operario validado, no puede eliminar.", "error");
    } else {
      const resp = await getConfirmation("Eliminar", "Esta seguro que quiere eliminar el operario?");
      if (resp) {
        try {
          const response = unwrapResult(await dispatch(OperatorSliceRequests.deleteRequest(row.id)));
          if (response) {
            openNotificationUI("Se eliminó el operario correctamente", "success");
            getOperators();
          }
        } catch (error) {
          openNotificationUI("Error al eliminar operario.", "error");
        }
      }
    }
  };

  const handleModalEdit = (operator: IOperator) => {
    setOperatorSelected(operator);
    setOpenModalEdit(true);
  };

  useEffect(() => {
    TitleChanger("ALTA OPERARIOS");
    getOperators();
  }, []);

  return (
    <div>
      <TableComponent
        IDcolumn={"id"}
        buscar
        Dense={true}
        filterWithSpecificValues={"nombre"}
        columns={[
          {
            title: "Nombre",
            field: "name"
          },
          {
            title: "Apellido",
            field: "surname"
          },
          {
            title: "Usuario",
            field: "appUser[0].username"
          },
          {
            title: "Posicion",
            field: "position"
          },
          {
            title: "Dni",
            field: "dni"
          },
          {
            title: "Turno",
            field: "turno.nombre"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Eliminar">
                      {row.appUser[0]?.validado ? (
                        <IconButton
                          onClick={() => {
                            eliminar(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            eliminar(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      )}
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          handleModalEdit(row);
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
        agregar={(row) => {
          setModalForm(true);
        }}
        dataInfo={operators}
      />
      <ModalCompoment setOpenPopup={setModalForm} openPopup={modalForm} title="Alta operario">
        <AltaOperarioForm refresh={getOperators} setModalForm={setModalForm}></AltaOperarioForm>
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalEdit} openPopup={openModalEdit} title="Editar Datos Operario">
        <EditarOperatorModal
          refreshList={setOperators}
          setOpenModal={setOpenModalEdit}
          openModal={openModalEdit}
          operatorSeleccionado={operatorSelected}
        />
      </ModalCompoment>
    </div>
  );
};
