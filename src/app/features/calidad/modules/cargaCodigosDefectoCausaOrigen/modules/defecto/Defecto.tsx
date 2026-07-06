/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IDefecto } from "app/models/IDefecto";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { DefectoSliceRequest } from "app/features/calidad/slices/DefectoSlice";

interface props {
  codRechazoId: string;
  codRep: number;
}
export const Defecto = ({ codRechazoId, codRep }: props): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataOpen, setDataOpen] = useState<IDefecto[]>([]);
  const [editState, setEditState] = useState();

  const onDelete = async (id) => {
    const yes = await getConfirmation("Borrar código", "Esta seguro que quiere eliminar este código?");
    if (yes) {
      const response = unwrapResult(await dispatch(DefectoSliceRequest.DeleteRequest(id)));
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

  const OnGetAll = async (): Promise<void> => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(DefectoSliceRequest.GetAllRequest()));
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
      const response = unwrapResult(await dispatch(DefectoSliceRequest.GetAllByCodRep(codRep)));
      setDataOpen(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  React.useEffect(() => {
    TitleChanger("Codigos de defectos");
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
        excel={true}
        Overflow={true}
        IDcolumn={"idDefecto"}
        columns={[
          {
            title: "Código de defecto",
            field: "codigoDefecto"
          },
          {
            title: "Descripción ",
            field: "descripcion"
          },
          {
            title: "Puesto ",
            field: "tipoDefecto"
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
                          onDelete(row.idDefecto);
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
                        setTitle("Editar código de defecto");
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
          setTitle("Agregar código de defecto");
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
          nombreCampo={"codigoDefecto"}
          codigos={dataOpen}
          codRep={codRep}
        />
      </ModalCompoment>
    </div>
  );
};
