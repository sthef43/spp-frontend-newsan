/* eslint-disable react/display-name */
import React, { useState } from "react";
import { SpatialTracking, ThumbDown, Visibility } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
//import { PatchedPagination } from "app/shared/components/material-ui/materialPagination";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useHistory } from "react-router";
import { IAppUser } from "app/models/IAppUser";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { IAuditRegistry } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { HistoricAuditPerformed } from "app/features/auditorias";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AuditTracking } from "app/features/audit/modules/reporteDeAuditorias/modals/AuditTracking";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { AuditComent } from "../modals/AuditComent";
import { AuditRegistrySliceRequests } from "app/features/audit/slices/AuditRegistrySlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

export const AuditTableOfPerformed = (): JSX.Element => {
  const history = useHistory();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [auditRegistryId, setAuditRegistryId] = useState(0);
  const [auditId, setAuditId] = useState(0);
  const [modalOpen, setOpenModal] = useState(false);
  const [openModalComent, setOpenModalComent] = useState(false);
  const [plantId, setPlantId] = useState(0);
  const [dataTable, setDataTable] = useState<IAuditRegistry[]>([]);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [error, setError] = useState(false);

  const { TitleChanger } = useTitleOfApp();
  React.useEffect(() => {
    TitleChanger("Auditorias Terminadas");
  }, []);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  async function onInit(): Promise<void> {
    try {
      if (!error) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen());
        const information = unwrapResult(
          await dispatch(
            AuditRegistrySliceRequests.getPaginationbyRolId({
              plantId: plantId,
              rolId: infoUser?.permisos?.rolId,
              fechaDesde: fechaDesde,
              fechaHasta: fechaHasta
            })
          )
        );
        if (information && information.length > 0) {
          setDataTable(information);
          openNotificationUI("Auditorias obtenidas con éxito", "success");
        } else {
          setDataTable([]);
          openNotificationUI("No se encontraron auditorias", "info");
        }
      }
    } catch (error) {
      openNotificationUI("Error al obtener las auditorias", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }
  const verEstado = (estado: boolean) => {
    if (estado) return "Dado de baja";
    return "Activo";
  };
  /*
   const onCanceled = async (row: IAuditRegistry) => {
    try {
      if (await getConfirmation("Dar de baja", "Esta seguro que quiere dar de baja la auditoria?")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const { name, surname } = unwrapResult(
          await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0))
        );
        await dispatch(AuditRegistrySliceRequests.canceledRequest({ id: row.id, username: name + " " + surname }));
        openNotificationUI("Se dio de baja con éxito", "success");
        onInit();
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };*/

  const [auditRegistry, setAuditRegistry] = useState<IAuditRegistry>();
  const [infoUsuario, setInfoUsuario] = useState<IAppUser>();
  const auditComment = (row: IAuditRegistry) => {
    setAuditRegistry(row);
    setInfoUsuario(infoUser);
    setOpenModalComent((prev) => !prev);
  };

  React.useEffect(() => {
    if (plantId != 0 && fechaDesde && fechaHasta) onInit();
  }, [plantId, fechaDesde, fechaHasta]);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <TitleUIComponent
        classNameTitle="text-base"
        title={"Lo siguiente es una lista de todas las auditorías realizadas ordenadas por fecha"}
      />
      <ContainerForPages optionsLayout="Selects" activeEffectVisible>
        <div className="w-full">
          <SelectOFPlant
            setPlantId={setPlantId}
            children={
              <>
                <SelectOfDate
                  fechaDesdeHasta
                  setFechaDesdeProps={setFechaDesde}
                  setFechaHastaProps={setFechaHasta}
                  setErrorProps={setError}
                />
              </>
            }
          />
        </div>
      </ContainerForPages>
      <div>
        {/* aca va el search  */}
        <TableComponent
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Nombre",
              field: "audit.name"
            },
            {
              title: "Num.Registro",
              field: "codigo"
            },
            {
              title: "Fecha",
              field: "",
              render: (row) => {
                return moment(row?.createdDate).format("L");
              }
            },
            {
              title: "Planta",
              field: "plant.name"
            },
            {
              title: "Turno",
              field: "turno.nombre"
            },
            {
              title: "Auditor",
              field: "",
              render: (row) => {
                return (
                  <div>
                    {row.operator?.name} {row.operator?.surname}
                  </div>
                );
              }
            },
            {
              title: "Usario que dio la baja",
              field: "userNameCanceled"
            },
            {
              title: "Razon de la baja",
              field: "",
              render: (rowData: IAuditRegistry) => rowData.canceled && <div>{rowData.comentarioBaja}</div>
            },
            {
              title: "Fecha de baja",
              field: "",
              render: (row: IAuditRegistry) =>
                row.createdDate != row.lastModifiedDate && (
                  <div>
                    {moment(row.lastModifiedDate).format("L")} {moment(row.lastModifiedDate).format("HH:mm:ss")}
                  </div>
                )
            },
            {
              title: "Dado de baja",
              field: "estado",
              render: (row) => {
                return verEstado(row.canceled);
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row: IAuditRegistry) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <Tooltip title="Asignar seguimiento">
                      <IconButton
                        onClick={() => {
                          setAuditRegistryId(row?.id);
                          setAuditId(row?.audit?.id);
                          setOpenModal(true);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <SpatialTracking color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        onClick={() => {
                          console.log(row);
                          history.push(`/main/auditoria/perform/${row?.audit?.id}/${row?.id}/0`);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {!row.canceled && (
                      <Tooltip title="Dar de baja">
                        <IconButton
                          onClick={() => {
                            console.log(row);
                            auditComment(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <ThumbDown color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                );
              }
            }
          ]}
          rowStyle={(rowData) => {
            switch (rowData.canceled) {
              case true:
                return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
              default:
                return { padding: 1, fontSize: 14 };
            }
          }}
          dataInfo={dataTable}
        />
        <ModalCompoment setOpenPopup={setOpenModal} title="Asignar seguimiento a la auditoria" openPopup={modalOpen}>
          <AuditTracking auditRegistryId={auditRegistryId} auditId={auditId} />
        </ModalCompoment>
        {plantId == 4 && <HistoricAuditPerformed />}
      </div>
      <ModalCompoment setOpenPopup={setOpenModalComent} title="Agregar motivo baja" openPopup={openModalComent}>
        <AuditComent
          plantaId={plantId}
          permisoId={infoUser?.permisos?.rolId}
          dataTable={setDataTable}
          infoUsuario={infoUsuario}
          audit={auditRegistry}
          setOpenModalComment={setOpenModalComent}></AuditComent>
      </ModalCompoment>
    </ContainerForPages>
  );
};
