import { Delete, Edit, TouchAppRounded } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { AgregarEditarGrupoModal } from "../../modals/DotacionGrupoSectoresModals/AgregarEditarGrupoModal";
import { ExaminarContenidoGrupo } from "../../modals/DotacionGrupoSectoresModals/ExaminarContenidoGrupo";
import { IDotacionGrupoSectores } from "../../models/IDotacionGrupoSectores";
import { DotacionGrupoSectoresSliceRequest } from "../../reducers/DotacionGrupoSectoresSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const DotacionMantenimientoGrupoSectores = () => {
  const { control } = useForm();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const classes = MaterialButtons();

  const [openModalAñadirGrupo, setOpenModalAñadirGrupo] = useState(false);
  const [openModalExaminarGrupo, setOpenModalExaminarGrupo] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [grupoSeleccionado, setGrupoSeleccionado] = useState<IDotacionGrupoSectores>();

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<string | number>(0);

  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setListaPlantas);

  const [listaLineas, setListaLineas] = useState<ILineaProduccion[]>([]);
  FetchApi<ILineaProduccion[]>(
    LineaProduccionSliceRequests.getAllLinesWithOnlyAirByPlantaId,
    plantaSeleccionada,
    true,
    plantaSeleccionada,
    setListaLineas
  );

  const [listaGrupos, setListaGrupos] = useState<IDotacionGrupoSectores[]>([]);
  FetchApi<IDotacionGrupoSectores[]>(
    DotacionGrupoSectoresSliceRequest.GetGroupsByPlantAndLineId,
    { lineaProduccionId: lineaSeleccionada, plantaId: plantaSeleccionada },
    true,
    lineaSeleccionada,
    setListaGrupos
  );

  const eliminarGrupo = async (elemento) => {
    try {
      if (await getConfirmation("Eliminar grupo", "Seguro que desea eliminar el grupo", null, "Aceptar", "Cancelar")) {
        console.log(elemento);
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(DotacionGrupoSectoresSliceRequest.deleteRequest(elemento.id)));
        if (response) {
          const getGrupos = unwrapResult(
            await dispatch(
              DotacionGrupoSectoresSliceRequest.GetGroupsByPlantAndLineId({
                lineaProduccionId: lineaSeleccionada,
                plantaId: plantaSeleccionada
              })
            )
          );
          setListaGrupos(getGrupos);
          openNotificationUI("Se elimino con exito el grupo", "success");
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [datosGrupo, setDatosGrupos] = useState(null);
  const handleModalAñadirGrupo = () => {
    setModoEdicion(false);
    setDatosGrupos({
      lineaProduccionId: lineaSeleccionada,
      plantaId: plantaSeleccionada
    });
    setOpenModalAñadirGrupo(true);
  };

  return (
    <main className="w-full p-5 bg-secondaryNew shadow-lg">
      <section className="flex flex-row justify-center w-full gap-x-4 rounded-md">
        <SelectComponent
          listaObjetos={listaPlantas}
          nameSelect="planta"
          valueLabel={(value) => value.name}
          valueSelect={(value) => value.id}
          inputLabel="Seleccione una planta"
          ValueSave={setPlantaSeleccionada}
          control={control}
          valueKey={(value) => value}
        />
        {listaLineas && (
          <SelectComponent
            listaObjetos={listaLineas}
            nameSelect="linea"
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            inputLabel="Seleccione una linea"
            ValueSave={setLineaSeleccionada}
            control={control}
            valueKey={(value) => value}
          />
        )}
      </section>
      <section className="my-3">
        <Button onClick={handleModalAñadirGrupo} disabled={lineaSeleccionada == 0} className={classes.blueButton}>
          Cargar nuevo grupo
        </Button>
      </section>
      {listaGrupos && (
        <section>
          <TableComponent
            buscar
            dataInfo={listaGrupos}
            IDcolumn="id"
            columns={[
              {
                title: "Nombre",
                field: "nombre"
              },
              {
                title: "Detalles",
                field: "detalles"
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
                                eliminarGrupo(row);
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
                                setGrupoSeleccionado(row);
                                setOpenModalAñadirGrupo(true);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Edit color="primary" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                      <div>
                        <Tooltip title="Examinar Grupo">
                          <span>
                            <IconButton
                              onClick={() => {
                                setOpenModalExaminarGrupo(true);
                                setGrupoSeleccionado(row);
                                setDatosGrupos({ lineaProduccionId: lineaSeleccionada, plantaId: plantaSeleccionada });
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <TouchAppRounded color="secondary" />
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
      )}
      <ModalCompoment
        setOpenPopup={setOpenModalAñadirGrupo}
        openPopup={openModalAñadirGrupo}
        title={`${modoEdicion ? "Editar Sector" : "Agregar Grupo De Sectores"}`}>
        <AgregarEditarGrupoModal
          datosGrupo={datosGrupo}
          setOpenModal={setOpenModalAñadirGrupo}
          modoEditor={modoEdicion}
          grupoSeleccioado={grupoSeleccionado}
          setListaGrupos={setListaGrupos}></AgregarEditarGrupoModal>
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalExaminarGrupo}
        openPopup={openModalExaminarGrupo}
        title="Examinar grupo">
        <ExaminarContenidoGrupo grupoSeleccionado={grupoSeleccionado} />
      </ModalCompoment>
    </main>
  );
};
