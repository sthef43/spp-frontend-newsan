/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { WhatsappMsgTiempoSliceRequests } from "app/features/admin/slices/WhatsappMsgTiempoSlice";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { WhatsappMsgTiempoForm } from "./WhatsappMsgTiempoForm";
import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AccionAsignarPlanta } from "./AccionAsignarPlanta";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

export const WhatsappMsgTiempoPage = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [dataInfo, setDataInfo] = useState([]);
  const [rowSelected, setRowSelected] = useState<IWhatsappMsgTiempo>();
  const [openModal, setOpenModal] = useState(false);

  const getData = async () => {
    let result = [];
    result = unwrapResult(await dispatch(WhatsappMsgTiempoSliceRequests.getAllRequest()));
    if (result) {
      setDataInfo(result);
    }
  };

  const eliminar = async (row) => {
    const respuesta = await getConfirmation("Eliminar", "¿ Seguro que desea eliminar ?");
    if (!respuesta) {
      return false;
    }
    const result = unwrapResult(await dispatch(WhatsappMsgTiempoSliceRequests.deleteRequest(row.id)));
    if (result) {
      openNotificationUI("Eliminado exitosamente :)", "success");
      getData();
    } else {
      openNotificationUI("Error al eliminar :(", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <WhatsappMsgTiempoForm refresh={getData}></WhatsappMsgTiempoForm>
      <ContainerForPages optionsLayout="Table" tableForModalOrPageStyle="Modal">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "hora",
              field: "hora"
            },
            {
              title: "Turno",
              field: "turno"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <IconButton
                        onClick={() => {
                          eliminar(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </div>
                    <div>
                      <IconButton
                        onClick={() => {
                          setRowSelected(row);
                          setOpenModal(true);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </div>
                  </div>
                );
              }
            }
          ]}
          dataInfo={dataInfo}
        />
      </ContainerForPages>
      <ModalCompoment
        title={"Asignacion de planta a hora de envio de mensaje."}
        openPopup={openModal}
        setOpenPopup={setOpenModal}>
        <AccionAsignarPlanta whatsappMsgTiempo={rowSelected}></AccionAsignarPlanta>
      </ModalCompoment>
    </div>
  );
};
