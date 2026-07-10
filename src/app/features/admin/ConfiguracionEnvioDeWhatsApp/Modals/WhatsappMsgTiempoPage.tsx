import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { WhatsappMsgTiempoSliceRequests } from "app/features/admin/slices/WhatsappMsgTiempoSlice";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { WhatsappMsgTiempoForm } from "./WhatsappMsgTiempoForm";
import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AccionAsignarPlanta } from "./AccionAsignarPlanta";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import FetchApi from "app/shared/helpers/FetchApi";

export const WhatsappMsgTiempoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { FetchDelete } = useFetchApiMultiResults();

  const [dataInfo, setDataInfo] = useState<IWhatsappMsgTiempo[]>([]);
  const [rowSelected, setRowSelected] = useState<IWhatsappMsgTiempo>();
  const [openModal, setOpenModal] = useState(false);

  FetchApi<IWhatsappMsgTiempo[]>(WhatsappMsgTiempoSliceRequests.getAllRequest, null, false, null, setDataInfo, false, false, false);

  const eliminar = async (row: IWhatsappMsgTiempo) => {
    FetchDelete({
      sliceRequest: WhatsappMsgTiempoSliceRequests.deleteRequest,
      deleteId: row.id,
      consoleLog: false,
      mensajePersonalizado: true,
      messageUser: "¿Está seguro de eliminar este horario de WhatsApp?",
      titleUser: "Eliminar Horario",
      functionAdd: async () => {
        const result = await dispatch(WhatsappMsgTiempoSliceRequests.getAllRequest());
        if (result.payload) setDataInfo(result.payload as IWhatsappMsgTiempo[]);
      }
    });
  };

  return (
    <div>
      <WhatsappMsgTiempoForm refresh={() => {
        dispatch(WhatsappMsgTiempoSliceRequests.getAllRequest()).then((res) => {
          if (res.payload) setDataInfo(res.payload as IWhatsappMsgTiempo[]);
        });
      }}></WhatsappMsgTiempoForm>
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
              render: (row: IWhatsappMsgTiempo) => {
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
        setOpenPopup={setOpenModal}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Asigne una planta al horario de envío seleccionado">
        <AccionAsignarPlanta whatsappMsgTiempo={rowSelected}></AccionAsignarPlanta>
      </ModalCompoment>
    </div>
  );
};
