import { Button, IconButton, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAuditRegistry, IAuditRegistryResult } from "app/models";
// import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import TitleUIComponent from "../../../../../shared/components/helpComponents/TitleUIComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AuditTrackingFormModal } from "../../../../auditorias/modules/modals/reporteAuditoria/AuditTrackingFormModal";
import { Check, Clear, Visibility } from "@mui/icons-material";
// import { IAuditTracking } from "app/models/IAuditTracking";
import { AuditTrackerResol } from "../../../../auditorias/modules/modals/reporteAuditoria/AuditTrackerResol";
import { AuditRegistrySliceRequests } from "app/features/audit/slices/AuditRegistrySlice";
import { AuditTrackingSliceRequest } from "app/features/audit/slices/AuditTrackingSlice";

interface Props {
  auditRegistryId: number;
  auditId: number;
}
export const AuditTracking = ({ auditRegistryId, auditId }: Props) => {
  const Rol = useAppSelector((state) => state.appUser.data as any).permisos?.rol;
  // const roles = useAppSelector((data) => data.rol.dataAll);
  // const auditTraking: IAuditTracking[] = useAppSelector((data) => data.auditTracking.dataAll);
  const auditRegistry: IAuditRegistry = useAppSelector((data) => data.auditRegistry.object);
  const classesButton = MaterialButtons();
  const [openModalSeguimiento, setOpenModalSeguimiento] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<IAuditRegistryResult[]>(null);
  const [openModalTracking, setOpenModalTracking] = useState<boolean>(false);
  const [auditTracking, setAuditTracking] = useState(null);
  const [item, setItem] = useState<IAuditRegistryResult>(null);
  // const [SelectedEmailGroup, setSelectedEmailGroup] = useState<string>("");
  const dispatch = useAppDispatch();
  // const { openNotificationUI } = useNotificationUI();
  const onTracker = (row: IAuditRegistryResult) => {
    setItem(row);
    setOpenModalSeguimiento(true);
  };
  const onTracking = (row: IAuditRegistryResult) => {
    setAuditTracking(row?.auditTracking);
    setOpenModalTracking(true);
  };
  // useEffect(() => {
  //   if (!openModalSeguimiento) {
  //     dispatch(AuditRegistrySliceRequests.getAllByIdAndFlag(auditRegistryId));
  //   }
  // }, [openModalSeguimiento]);
  useEffect(() => {
    dispatch(AuditRegistrySliceRequests.getAllByIdAndFlag(auditRegistryId));
    dispatch(AuditTrackingSliceRequest.getAllByRolIdRequest(Rol?.id));
  }, []);

  useEffect(() => {
    setDataTable(auditRegistry?.auditRegistryResult);
  }, [auditRegistry]);

  return (
    <div className="flex flex-col gap-4">
      {auditRegistry?.auditRegistryResult?.length == 0 && <TitleUIComponent title="No hay items con valores N/G" />}
      {auditRegistry?.auditRegistryResult?.length > 0 && (
        <>
          <TitleUIComponent title="Items con valores N/G" />
          <TableComponent
            IDcolumn="id"
            columns={[
              {
                title: "Bloque",
                field: "itemBloq.bloq.name"
              },
              {
                title: "Item",
                field: "",
                render: (row) => <h1 className="max-w-sm">{row.itemBloq.item.name}</h1>
              },
              {
                title: "Comentario",
                field: "",
                render: (row) => <h1 className="max-w-md">{row.comentario}</h1>
              },
              {
                title: "Valor",
                field: "valor.name"
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
                title: "En seguimiento",
                field: "",
                render: (row) => {
                  return row.tracking ? (
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
                    <div className="pt-1 flex justify-around " style={{ flex: "1 1 10%" }}>
                      <Button
                        className={classesButton.blueButton}
                        type="submit"
                        variant="contained"
                        disabled={row.tracking}
                        onClick={() => onTracker(row)}>
                        Dar seguimiento
                      </Button>
                      <Tooltip title="Ver seguimiento">
                        <IconButton disabled={!row?.tracking} onClick={() => onTracking(row)}>
                          <Visibility color="info" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={dataTable}
          />
        </>
      )}
      <ModalCompoment title="Dar seguimiento" setOpenPopup={setOpenModalSeguimiento} openPopup={openModalSeguimiento}>
        <AuditTrackingFormModal
          setOpenModal={setOpenModalSeguimiento}
          auditRegistryResult={item}
          auditRegistryId={auditRegistry?.id}
        />
      </ModalCompoment>
      <ModalCompoment title="Resolución de item" setOpenPopup={setOpenModalTracking} openPopup={openModalTracking}>
        <AuditTrackerResol auditTracker={auditTracking} setOpenModal={setOpenModalTracking} rolId={Rol?.id} />
      </ModalCompoment>
    </div>
  );
};
