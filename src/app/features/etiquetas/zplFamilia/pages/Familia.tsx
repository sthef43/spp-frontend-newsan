import { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IconButton, Tooltip } from "@mui/material";
import { Cancel, CheckCircle, Delete, Edit } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ZPL_FamiliasSliceRequests } from "app/Middleware/reducers/ZPL_FamiliasSlice";
import { IZPL_Familias } from "app/models/IZPL_Familias";
import React from "react";
import { FamiliaForm } from "../modals/FamiliaForm";

export const Familia = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();

  //Eliminar
  const eliminar = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro que quiere eliminar el registro?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(ZPL_FamiliasSliceRequests.deleteRequest(row)));
        if (response) {
          openNotificationUI("Se eliminó el registro correctamente", "success");
          getZPLFamilias();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  //Leer
  const [ZPLFamilias, setZPLFamilias] = useState<IZPL_Familias[] | null>(null);
  const getZPLFamilias = async () => {
    try {
      const result = unwrapResult(await dispatch(ZPL_FamiliasSliceRequests.getRequest()));
      setZPLFamilias(result);
    } catch (error) {
      openNotificationUI("Error al leer zplFamilias.", "error");
    }
  };

  //Editar
  const [ModalOpen, setModalOpen] = useState(false);
  const [editState, setEditState] = useState<IZPL_Familias | null>(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  useEffect(() => {
    TitleChanger("ZPL Familias");
    getZPLFamilias();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Código Familia",
            field: "codigoFamilia"
          },
          {
            title: "Activa",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    {row.activa ? (
                      <Tooltip title="Está Activo">
                        <IconButton size="small" color="success" style={{ position: "relative" }}>
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="No está Activo">
                        <IconButton size="small" color="error" style={{ position: "relative" }}>
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
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
                          editar(row);
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
                          eliminar(row.id);
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
          setEstaEditando(false);
          setEditState(null);
          setModalOpen(true);
        }}
        dataInfo={ZPLFamilias}
      />
      <ModalCompoment title="Nueva Familia" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <FamiliaForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getZPLFamilias}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
