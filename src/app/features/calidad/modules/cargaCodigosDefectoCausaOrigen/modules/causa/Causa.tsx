/* eslint-disable unused-imports/no-unused-vars */
import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ICausa } from "app/models/ICausa";
import { CodRechazoForm } from "app/features/calidad/modules/cargaCodigosDefectoCausaOrigen/modules/components/CodRechazoForm";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useState } from "react";
import { CausaSliceRequest } from "app/features/calidad/slices/CausaSlice";

interface props {
  codRechazoId: string;
  codRep: number;
}
export const CodigoDeCausa = ({ codRechazoId, codRep }: props): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editState, setEditState] = useState();

  const [dataOpen, setDataOpen] = useState<ICausa[]>([]);

  const onDelete = async (id) => {
    const yes = await getConfirmation("Borrar código", "Esta seguro que quiere eliminar este código?");
    if (yes) {
      const response = unwrapResult(await dispatch(CausaSliceRequest.DeleteRequest(id)));
      openNotificationUI("Se elimino correctamente", "success");
      onGetAll();
    } else {
      openNotificationUI("Oops, ha ocurrido un error. Por favor intenta nuevamente!", "error");
    }
  };

  const onGetAll = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CausaSliceRequest.GetAllRequest()));
      setDataOpen(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onGetByCodRep = async (): Promise<void> => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CausaSliceRequest.GetAllByCodRep(codRep)));
      setDataOpen(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onEdit = (data) => {
    setEditState(data);
    setOpenModal(true);
  };

  React.useEffect(() => {
    TitleChanger("Codigos de reparación");
  }, []);

  React.useEffect(() => {
    if (codRep) {
      onGetByCodRep();
    } else {
      onGetAll();
    }
  }, [codRep]);

  return (
    <div>
      <TableComponent
        buscar={true}
        Overflow={true}
        IDcolumn={"idCausa"}
        columns={[
          {
            title: "Código de causa ",
            field: "codigoCausa"
          },
          {
            title: "Descripción ",
            field: "descripcion"
          },
          {
            title: "Puesto ",
            field: "puesto"
          },
          {
            title: "Linea ",
            field: "linea.descripcion"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          onDelete(row.idCausa);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => {
                        setTitle("Editar código de causa");
                        onEdit(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <div></div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          setTitle("Agregar código de causa");
          setEditState(null);
          setOpenModal(true);
        }}
        dataInfo={dataOpen}
      />
      <ModalCompoment setOpenPopup={setOpenModal} title={title} openPopup={openModal}>
        <CodRechazoForm
          setOpenPopup={setOpenModal}
          editState={editState}
          rechazo={codRechazoId}
          OnGetAll={onGetAll}
          nombreCampo={"codigoCausa"}
          codigos={dataOpen}
          codRep={codRep}
        />
      </ModalCompoment>
    </div>
  );
};
