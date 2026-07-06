/* eslint-disable unused-imports/no-unused-vars */
import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { CodRechazoForm } from "app/features/calidad/modules/cargaCodigosDefectoCausaOrigen/modules/components/CodRechazoForm";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { OrigenesSliceRequest } from "app/Middleware/reducers/OrigenSlice";
import { IOrigenes } from "app/models/IOrigen";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

interface props {
  codRechazoId: string;
  codRep: number;
}
export const Origen = ({ codRechazoId, codRep }: props): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataOpen, setDataOpen] = useState<IOrigenes[]>([]);
  const [editState, setEditState] = useState();

  const onDelete = async (id) => {
    const yes = await getConfirmation("Borrar código", "Esta seguro que quiere eliminar este código?");
    if (yes) {
      const response = unwrapResult(await dispatch(OrigenesSliceRequest.DeleteRequest(id)));
      openNotificationUI("Se elimino correctamente", "success");
      OnGetAll();
    } else {
      openNotificationUI("Oops, ha ocurrido un error. Por favor intenta nuevamente!", "error");
    }
  };

  const onEdit = (data) => {
    setEditState(data);
    setOpenModal(true);
  };

  const OnGetAll = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OrigenesSliceRequest.GetAllRequest()));
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
      const response = unwrapResult(await dispatch(OrigenesSliceRequest.GetAllByCodRep(codRep)));
      setDataOpen(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  React.useEffect(() => {
    TitleChanger("Codigos de origen");
  }, []);

  React.useEffect(() => {
    if (codRep) {
      onGetByCodRep();
    } else {
      OnGetAll();
    }
  }, [codRep]);

  return (
    <div>
      <TableComponent
        buscar={true}
        Overflow={true}
        IDcolumn={"idOrigen"}
        columns={[
          {
            title: "Código de origen",
            field: "codigoOrigen"
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
                          onDelete(row.idOrigen);
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
                        setTitle("Editar código de origen");
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
          setTitle("Agregar código de origen");
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
          OnGetAll={OnGetAll}
          nombreCampo={"codigoOrigen"}
          codigos={dataOpen}
          codRep={codRep}
        />
      </ModalCompoment>
    </div>
  );
};
