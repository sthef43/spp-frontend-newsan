import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { IntDarsenaSliceRequests } from "app/Middleware/reducers/IntDarsenaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IIntDarsena } from "app/models/IIntDarsena";
import { IntGestorDarsenasForm } from "app/features/contenedor/modules/intDarsenas/modals/IntGestorDarsenasForm";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
interface props {
  setOpenPopup: any;
  plantaId: any;
  refresh: any;
}
export const IntGestorDarsenas = ({ setOpenPopup, plantaId, refresh }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  //Leer
  const [listDarsenas, setlistDarsenas] = useState<IIntDarsena[] | null>(null);
  const getDarsenas = async () => {
    try {
      const responses = unwrapResult(await dispatch(IntDarsenaSliceRequests.getAllByPlantRequest(plantaId)));
      setlistDarsenas(responses);
      refresh();
    } catch (error) {
      openNotificationUI("Error al leer dársenas.", "error");
    }
  };
  useEffect(() => {
    if (plantaId) {
      getDarsenas();
    }
  }, [plantaId]);

  //Editar
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<IIntDarsena | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Eliminar
  const eliminar = async (row) => {
    if (row.intRemitoPadreId == 1) {
      const resp = await getConfirmation("Eliminar", "Esta seguro de eliminar la dársena?");
      if (resp) {
        try {
          unwrapResult(await dispatch(IntDarsenaSliceRequests.deleteRequest(row.id)));
          getDarsenas();
          refresh();
        } catch (error) {
          openNotificationUI("Error al eliminar el registro.", "error");
        }
      }
    } else {
      openNotificationUI("La dársena está ocupada, no puede eliminar.", "error");
    }
  };

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Detalle",
            field: "detalle"
          },
          {
            title: "Estado",
            field: "",
            render: (row) => {
              return row.intRemitoPadreId == 1 ? "Libre" : "Ocupado";
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
                          eliminar(row);
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
        buscar
        dataInfo={listDarsenas}
      />
      <ModalCompoment
        title={estaEditando ? "Editar Dársena" : "Nueva Dársena"}
        openPopup={ModalOpen}
        setOpenPopup={setModalOpen}>
        <IntGestorDarsenasForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getDarsenas}
          estaEditando={estaEditando}
          plantaId={plantaId}
        />
      </ModalCompoment>
    </div>
  );
};
