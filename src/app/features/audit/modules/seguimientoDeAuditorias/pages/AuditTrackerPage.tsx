import { Check, Clear, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAuditTracking } from "app/models/IAuditTracking";
import { AuditTrackerResol } from "app/features/auditorias/modules/modals/reporteAuditoria/AuditTrackerResol";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AuditRegistryResultSliceRequests } from "app/features/audit/slices/AuditRegistryResultSlice";
import { AuditTrackingSliceRequest } from "app/features/audit/slices/AuditTrackingSlice";

export const AuditTrackerPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const Rol = useAppSelector((state) => state.appUser.data as any).permisos?.rol;
  const auditTrackers: IAuditTracking[] = useAppSelector((state) => state.auditTracking.dataAll);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const [openModal, setOpenModal] = useState(false);
  const [auditTracking, setAuditTracking] = useState<IAuditTracking>(null);
  const getAll = async () => {
    try {
      const response = await dispatch(AuditTrackingSliceRequest.getAllByRolIdRequest(Rol?.id));
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onResolver = async (row) => {
    try {
      const confirm = await getConfirmation(
        "Marcar como resuelto",
        "Esta seguro que quiere marcar como resuelto el item?"
      );
      if (confirm) {
        const auditTracker = {
          ...row,
          auditComentario: null,
          auditOf: null,
          auditRegistryResult: null,
          rol: null,
          resuelto: true
        };
        const response = await dispatch(AuditTrackingSliceRequest.PutRequest(auditTracker));
        const ARRRefresh = await dispatch(
          AuditRegistryResultSliceRequests.setResolverRequest(auditTracker?.auditRegistryResultId)
        );
        openNotificationUI("Se marco como resuelto correctamente", "success");
        getAll();
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onOpenModal = (row: IAuditTracking) => {
    setAuditTracking(row);
    setOpenModal(true);
  };

  useEffect(() => {
    TitleChanger("Seguimiento de auditorias");
    getAll();
    return () => {
      TitleChanger("");
    };
  }, []);

  return (
    <div className="my-2 mt-5 mx-4 bg-secondaryNew shadow-elevation-4 border-t-2 md:border-0 border-gray-600 rounded-lg animate__animated animated__fadeIn">
      <TitleUIComponent title="Items asignados al sector" />
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Asignado por",
            field: "creatorUser"
          },
          {
            title: "Area responsable",
            field: "auditOf.name"
          },
          {
            title: "Item",
            field: "auditRegistryResult.itemBloq.item.name"
          },
          {
            title: "Mensaje",
            field: "auditComentario[0].comentario"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => {
              return moment(row?.createdDate).format("L");
            }
          },
          {
            title: "Resuelto",
            field: "",
            render: (row) => {
              return row.resuelto ? (
                <IconButton disabled>
                  <Check color="success" />
                </IconButton>
              ) : (
                <IconButton disabled>
                  <Clear color="error" />
                </IconButton>
              );
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <>
                  <Tooltip title="Ver seguimiento">
                    <IconButton onClick={() => onOpenModal(row)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Marcar como resuelto">
                    <IconButton disabled={row?.resuelto} onClick={() => onResolver(row)}>
                      <Check color="warning" />
                    </IconButton>
                  </Tooltip>
                </>
              );
            }
          }
        ]}
        dataInfo={auditTrackers}
      />
      <ModalCompoment title="Resolución de item" setOpenPopup={setOpenModal} openPopup={openModal}>
        <AuditTrackerResol auditTracker={auditTracking} setOpenModal={setOpenModal} rolId={Rol?.id} />
      </ModalCompoment>
    </div>
  );
};
