import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AgregarUbicacionesModal } from "../Modals/AsignacionUbicacionesModals/AgregarUbicacionesModal";
import { useAppDispatch } from "app/core/store/store";
import { Delete, Visibility } from "@mui/icons-material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import FetchApi from "app/shared/helpers/FetchApi";
import { ExaminarContenidoUbicacion } from "../Modals/AsignacionUbicacionesModals/ExaminarContenidoUbicacion";
import { CLIUbicacionesConItems } from "app/models/Stored Procdure/CLIUbicacionesConItems";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { ICLIUbicacionSector } from "../Models/ICLIUbicacionSector";
import { CLIContenedorItemsSliceRequest } from "../Middlewares/CLIContenedorItemsSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../Middlewares/CLIImpresionEtiquetas";
import { CLIUbicacionSectoresSliceRequest } from "../Middlewares/CLIUbiacacionSectorSlice";

export const AsignacionUbicaciones: React.FC = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  const [openModalAsignar, setOpenModalAsignar] = useState(false);
  const [openModalExaminar, setOpenModalExaminar] = useState<boolean>(false);
  const [examinarId, setExaminarId] = useState<number | null>(null);

  const [tipoAsignacion, setTipoAsignacion] = useState<string>("");

  const [ubicaciones, setUbicaciones] = useState<ICLIUbicacionSector[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<ICLIUbicacionSector>();
  const [dataExcel, setDataExcel] = useState<CLIUbicacionesConItems[]>([]);

  const exportarExcelConItems = (ubicacionesItems: CLIUbicacionesConItems[]) => {
    setDataExcel(ubicacionesItems);
  };

  FetchApi<ICLIUbicacionSector[]>(
    CLIUbicacionSectoresSliceRequest.getAllRequest,
    null,
    false,
    null,
    setUbicaciones
  );

  FetchApi<CLIUbicacionesConItems[]>(
    CLIUbicacionSectoresSliceRequest.getAllUbicacionesWithItems,
    null,
    false,
    null,
    null,
    false,
    false,
    true,
    exportarExcelConItems
  );

  FetchApi<ICLIUbicacionSector>(
    CLIUbicacionSectoresSliceRequest.getUbicacionWithItemById,
    examinarId,
    false,
    examinarId,
    (data) => {
      if (data) setUbicacionSeleccionada(data);
    },
    true,
    false,
    true
  );

  const handeOpenModalExam = (rowData: ICLIUbicacionSector) => {
    setExaminarId(rowData.id);
    setOpenModalExaminar(true);
  };

  const buscarLocalizador = async (rowData: ICLIUbicacionSector) => {
    const confirm = await getConfirmation(
      "Desvincular ubicación",
      "¿Está seguro de que desea desvincular esta ubicación?"
    );
    if (!confirm) return;
    let objeto = null;
    const cambiarEstado = { ...rowData, estado: true };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseItem = unwrapResult(
        await dispatch(CLIImpresionEtiquetasSliceRequests.GetByLocalizadorId(rowData.id))
      );
      const responsePadre = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetByLocalizadorId(rowData.id)));
      if (responseItem.id != null) {
        objeto = responseItem;
        objeto.cliUbicacionesSectoresId = null;
        await dispatch(CLIImpresionEtiquetasSliceRequests.PutRequest(objeto));
      }
      if (responsePadre.id != null) {
        objeto = responsePadre;
        objeto.cliUbicacionesSectoresId = null;
        await dispatch(CLIContenedorItemsSliceRequest.PutRequest(objeto));
      }
      await dispatch(CLIUbicacionSectoresSliceRequest.PutRequest(cambiarEstado));
      const response = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.getAllRequest()));
      if (response) {
        setUbicaciones(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Ubicación desvinculada correctamente.", "success");
    } catch (error) {
      openNotificationUI("Error al desvincular ubicación.", "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const verDisponible = (rowData: boolean) => {
    if (rowData) {
      return `Disponible`;
    } else {
      return `Ocupado`;
    }
  };

  const handleOpenModal = (tipo: string) => {
    setOpenModalAsignar(true);
    setTipoAsignacion(tipo);
  };

  useEffect(() => {
    TitleChanger("Asignar Ubicaciones");
  }, []);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Selects">
        <div>
          <Button
            type="button"
            onClick={() => {
              handleOpenModal("lpnPadre");
            }}
            className={buttonClases.blueButton}>
            Asignar LPN Padre
          </Button>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => {
              handleOpenModal("item");
            }}
            className={buttonClases.blueButton}>
            Asignar Item Unitario
          </Button>
        </div>
        {dataExcel.length > 0 && (
          <ExportExcel
            title="UbicacionesConItems"
            stylesButton="m-0"
            titleButton="Exportar Ubicaciones"
            data={dataExcel}
            columns={[
              {
                title: "Localizador",
                field: "localizador"
              },
              {
                title: "LPN Articulo",
                field: "lpnGenerada"
              },
              {
                title: "Articulo",
                field: "articulo"
              },
              {
                title: "Nombre Item",
                field: "nombreItem"
              },
              {
                title: "Descripcion Item",
                field: "descripcion"
              },
              {
                title: "Nombre Sector",
                field: "nombreSector"
              }
            ]}
          />
        )}
      </ContainerForPages>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          buscar
          IDcolumn="id"
          dataInfo={ubicaciones ?? []}
          columns={[
            {
              title: "Localizador",
              field: "localizador"
            },
            {
              title: "Organizacion",
              field: "cliOrganizacion.nombre"
            },
            {
              title: "Tipo UBC",
              field: "cliTipoUBC.nombre"
            },
            {
              title: "Estado",
              field: "",
              render: (row) => verDisponible(row.estado)
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <section className="flex flex-row justify-start gap-x-2">
                    <div>
                      <Tooltip title="Desvincular ubicacion">
                        <span>
                          <IconButton
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              buscarLocalizador(row);
                            }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Examinar Contenido">
                        <span>
                          <IconButton
                            disabled={row.estado}
                            size="small"
                            style={{ position: "relative" }}
                            onClick={() => {
                              handeOpenModalExam(row);
                            }}>
                            <Visibility color={`${!row.estado ? "primary" : "disabled"}`} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </section>
                );
              }
            }
          ]}
        />
      </ContainerForPages>
      <ModalCompoment
        setOpenPopup={setOpenModalAsignar}
        openPopup={openModalAsignar}
        title="Agregar Ubicaciones"
        titleModalStyle="Audit"
        showModalCenterPage
        subTitle="Asignar nuevas ubicaciones LPN Padre o por Item unitario">
        <AgregarUbicacionesModal
          tipoAsignacion={tipoAsignacion}
          refreshLista={setUbicaciones}
          refreshExcel={exportarExcelConItems}
          setOpenModal={setOpenModalAsignar}
          openModal={openModalAsignar}
        />
      </ModalCompoment>
      <ModalCompoment
        titleModalStyle="Audit"
        showModalCenterPage
        openPopup={openModalExaminar}
        setOpenPopup={setOpenModalExaminar}
        title={
          ubicacionSeleccionada?.cliImpresionEtiquetas == null
            ? "Examinar Ubicacion con LPN Padre"
            : "Examinar Ubicacion con Item"
        }
        subTitle="Examinar el contenido de la ubicación seleccionada">
        <ExaminarContenidoUbicacion
          setOpenModal={setOpenModalExaminar}
          ubicacionSeleccionada={ubicacionSeleccionada}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
