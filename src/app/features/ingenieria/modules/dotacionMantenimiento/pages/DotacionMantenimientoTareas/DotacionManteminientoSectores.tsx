import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotacionSliceRequests } from "app/Middleware/reducers/DotacionSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { AgregarEditarSectorModal } from "../../modals/DotacionMantenimientoSectoresModals/AgregarEditarSectorModal";
import { IDotacionSector } from "../../models/IDotacionSector";
import { DotacionSectorSliceRequest } from "../../reducers/DotacionSectorSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const DotacionManteminientoSectores = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const classes = MaterialButtons();

  const [openModalEditarAñadirSector, setOpenModalEditarAñadirSector] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sectorSeleccionado, setSectorSeleccionado] = useState<IDotacionSector>();

  const [listaSectores, setListaSectores] = useState<IDotacionSector[]>([]);
  FetchApi<IDotacionSector[]>(DotacionSectorSliceRequest.getAllRequest, null, false, null, setListaSectores);

  const eliminarPuesto = async (elementos: IDotacionSector) => {
    try {
      if (
        await getConfirmation(
          "ELiminar sector",
          "Esta seguro de querer eliminar el sector",
          null,
          "Aceptar",
          "Cancelar"
        )
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(DotacionSliceRequests.deleteRequest(elementos.id)));
        if (response) {
          const refreshSectores = unwrapResult(await dispatch(DotacionSectorSliceRequest.getAllRequest()));
          setListaSectores(refreshSectores);
          openNotificationUI("Se elimino con exito el sector", "success");
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const handleModalAñadirEditarSector = () => {
    setModoEdicion(false);
    setOpenModalEditarAñadirSector(true);
  };

  return (
    <main className="w-full p-5 bg-secondaryNew shadow-lg">
      <section className="my-2">
        <Button
          onClick={() => {
            handleModalAñadirEditarSector();
          }}
          className={classes.blueButton}>
          Cargar nuevo puesto
        </Button>
      </section>
      <section className="flex flex-row justify-center w-full gap-x-4 rounded-md">
        {listaSectores && (
          <section className="w-full">
            <TableComponent
              buscar
              dataInfo={listaSectores}
              IDcolumn="id"
              columns={[
                {
                  title: "Nombre",
                  field: "nombre"
                },
                {
                  title: "Descripcion",
                  field: "descripcion"
                },
                {
                  title: "Acciones",
                  field: "",
                  render: (row) => {
                    return (
                      <section className="flex flex-row items-center">
                        <div>
                          <Tooltip title="Eliminar Grupo">
                            <span>
                              <IconButton
                                onClick={() => {
                                  eliminarPuesto(row);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Delete color="error" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Editar Grupo">
                            <span>
                              <IconButton
                                onClick={() => {
                                  setModoEdicion(true);
                                  setSectorSeleccionado(row);
                                  setOpenModalEditarAñadirSector(true);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Edit color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        {/* <div>
                                                    <Tooltip title="Examinar Grupo">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => { console.log("sasa") }}
                                                                size="small"
                                                                style={{ position: "relative" }}>
                                                                <TouchAppRounded color="secondary" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </div> */}
                      </section>
                    );
                  }
                }
              ]}
            />
          </section>
        )}
      </section>
      <ModalCompoment
        openPopup={openModalEditarAñadirSector}
        setOpenPopup={setOpenModalEditarAñadirSector}
        title={`${modoEdicion ? "Editar" : "Agregar"} Sector`}>
        <AgregarEditarSectorModal
          setOpenModal={setOpenModalEditarAñadirSector}
          sectorSeleccionado={sectorSeleccionado}
          modoEditor={modoEdicion}
          setListaSectores={setListaSectores}
        />
      </ModalCompoment>
    </main>
  );
};
