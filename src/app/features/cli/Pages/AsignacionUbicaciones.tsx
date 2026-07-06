import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, IconButton, Tooltip } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AgregarUbicacionesModal } from "../Modals/AsignacionUbicacionesModals/AgregarUbicacionesModal";
import { useAppDispatch } from "app/core/store/store";
import { Delete, Visibility } from "@mui/icons-material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ExaminarContenidoUbicacion } from "../Modals/AsignacionUbicacionesModals/ExaminarContenidoUbicacion";
import { CLIUbicacionesConItems } from "app/models/Stored Procdure/CLIUbicacionesConItems";
import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel";
import { ICLIUbicacionSector } from "../Models/ICLIUbicacionSector";
import { CLIContenedorItemsSliceRequest } from "../Middlewares/CLIContenedorItemsSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../Middlewares/CLIImpresionEtiquetas";
import { CLIUbicacionSectoresSliceRequest } from "../Middlewares/CLIUbiacacionSectorSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AsignacionUbicaciones = () => {
  const { TitleChanger } = useTitleOfApp();
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  const [openModalAsignar, setOpenModalAsignar] = useState(false);
  const [openModalExaminar, setOpenModalExaminar] = useState<boolean>(false);

  const [tipoAsignacion, setTipoAsignacion] = useState<string>("");

  const [ubicaciones, setUbicaciones] = useState<ICLIUbicacionSector[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<ICLIUbicacionSector>();
  const [dataExcel, setDataExcel] = useState<CLIUbicacionesConItems[]>([]);

  const ubicacionesInit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.getAllRequest()));
      const ubicacionesItems = unwrapResult(
        await dispatch(CLIUbicacionSectoresSliceRequest.getAllUbicacionesWithItems())
      );
      if (response) {
        setUbicaciones(response);
        exportarExcelConItems(ubicacionesItems);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const handeOpenModalExam = async (rowData: ICLIUbicacionSector) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(CLIUbicacionSectoresSliceRequest.getUbicacionWithItemById(rowData.id))
      );
      if (response) {
        setUbicacionSeleccionada(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    setOpenModalExaminar(true);
  };

  const buscarLocalizador = async (rowData: ICLIUbicacionSector) => {
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
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const exportarExcelConItems = (ubicacionesItems: CLIUbicacionesConItems[]) => {
    const newData = ubicacionesItems.map((elementos) => {
      const localizador = elementos.localizador;
      const lpnGenerada = elementos.lpnGenerada;
      const articulo = elementos.articulo;
      const nombreItem = elementos.nombreItem;
      const descripcion = elementos.descripcion;
      const nombreSector = elementos.nombreSector;
      return {
        ...elementos,
        localizador,
        lpnGenerada,
        articulo,
        nombreItem,
        descripcion,
        nombreSector
      };
    });
    setDataExcel(newData);
  };

  const verDisponible = (rowData) => {
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
    ubicacionesInit();
  }, []);

  return (
    <main className="p-6">
      <section className="flex flex-row justify-center gap-x-4">
        <div>
          <Button
            type="submit"
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
            data={dataExcel.length > 0 ? dataExcel : []}
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
      </section>
      <section className="mt-4">
        <TableComponent
          buscar
          IDcolumn="id"
          dataInfo={ubicaciones == null ? [] : ubicaciones}
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
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModalAsignar}
        openPopup={openModalAsignar}
        title="Agregar Ubicaciones"
        titleModalStyle="Audit"
        showModalCenterPage>
        <AgregarUbicacionesModal
          tipoAsignacion={tipoAsignacion}
          refreshLista={setUbicaciones}
          refreshExcel={exportarExcelConItems}
          setOpenModal={setOpenModalAsignar}
          openModal={openModalAsignar}
        />
      </ModalCompoment>
      {openModalExaminar && (
        <ModalCompoment
          titleModalStyle="Audit"
          showModalCenterPage
          openPopup={openModalExaminar}
          setOpenPopup={setOpenModalExaminar}
          title={
            ubicacionSeleccionada.cliImpresionEtiquetas == null
              ? "Examinar Ubicacion con LPN Padre"
              : "Examinar Ubicacion con Item"
          }>
          <ExaminarContenidoUbicacion
            setOpenModal={setOpenModalExaminar}
            ubicacionSeleccionada={ubicacionSeleccionada}
          />
        </ModalCompoment>
      )}
    </main>
  );
};
