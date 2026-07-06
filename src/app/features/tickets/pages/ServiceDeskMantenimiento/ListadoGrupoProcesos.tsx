import { Add, Delete, Edit, TouchAppRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ITicketsGrupoProcesos } from "../../models/iTicketsGrupoProcesos";
import { AgregarGrupoProcesos } from "../../modals/serviceDeskMantenimientoModal/GrupoProcesosModals/AgregarGrupoProcesos";
import { AgregarItemsGrupoModal } from "../../modals/serviceDeskMantenimientoModal/GrupoProcesosModals/AgregarItemsGrupoModal";
import { EditarGrupoProcesos } from "../../modals/serviceDeskMantenimientoModal/GrupoProcesosModals/EditarGrupoProcesos";
import { TicketsGrupoProcesosSliceRequest } from "app/features/tickets/reducers/TicketsGrupoProcesosSlice";
import { IPlant } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TicketsCategoriaSliceRequest } from "app/features/tickets/reducers/TicketsCategoriaSlice";
import { ITicketsCategoria } from "../../models/ITicketsCategorias";
import { PlantSliceRequests } from "app/Middleware/reducers";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ListadoGrupoProcesos = () => {
  const { control } = useForm();

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [categoriaSeleecionada, setCategoriaSeleccionada] = useState(null);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);

  const [openModalAgregarGrupo, setOpenModalAgregarGrupo] = useState(false);
  const [openModalEditarGrupo, setOpenModalEditarGrupo] = useState(false);

  const [listaCategorias, setListaCategorias] = useState<ITicketsCategoria[]>([]);
  FetchApi<ITicketsCategoria[]>(
    TicketsCategoriaSliceRequest.GetAllCategoriesByPlantId,
    plantaSeleccionada,
    false,
    plantaSeleccionada,
    setListaCategorias,
    true
  );

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setPlantas, false);

  const [listaGruposProcesos, setListaGruposProcesos] = useState<ITicketsGrupoProcesos[]>([]);
  FetchApi<ITicketsGrupoProcesos[]>(
    TicketsGrupoProcesosSliceRequest.GetAllGroupsByCategoriaId,
    categoriaSeleecionada,
    false,
    categoriaSeleecionada,
    setListaGruposProcesos,
    true
  );

  const deleteGrupos = async (grupoId: number) => {
    try {
      if (
        await getConfirmation("Eliminar Grupo", "Esta seguro que desea eliminar el grupo", null, "Eliminar", "Cancelar")
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const responseDelete = unwrapResult(
          await dispatch(TicketsGrupoProcesosSliceRequest.DeleteGrupoWithBlock(grupoId))
        );
        if (responseDelete) {
          openNotificationUI("Se elimino correctamente el grupo", "success");
          const response = unwrapResult(
            await dispatch(TicketsGrupoProcesosSliceRequest.GetAllGroupsByCategoriaId(categoriaSeleecionada))
          );
          setListaGruposProcesos(response);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const fechaFormateada = (fechaTickets: ITicketsGrupoProcesos) => {
    const fechaFormat = new Date(fechaTickets.createdDate);
    if (fechaFormat) {
      return `${fechaFormat.getFullYear()}-${fechaFormat.getMonth() + 1}-${fechaFormat.getDate()}`;
    } else {
      return `Sin Fecha`;
    }
  };

  // const [openModal, setOpenModal] = useState(false)
  // const [grupoSeleccionado, setGrupoSeleccionado] = useState<ITicketsGrupoProcesos>()
  // En caso de queres usar la vista del grupo, descomentar esta funcion.
  // const handelOpenModal = (grupoProceso: ITicketsGrupoProcesos) => {
  //     setGrupoSeleccionado(grupoProceso)
  //     setOpenModal(true)
  // }

  const [openModalAgregarItems, setOpenModalAgregarItems] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<ITicketsGrupoProcesos>();
  const handleOpenModalAgregarItem = (event: any, elemento: ITicketsGrupoProcesos, tipoModal: string) => {
    event.stopPropagation();
    setGrupoSeleccionado(elemento);
    switch (tipoModal) {
      case "editar":
        setOpenModalEditarGrupo(true);
        break;
      case "añadir":
        setOpenModalAgregarItems(true);
        break;
      default:
        break;
    }
  };

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 bg-secondaryNew">
        <div className="flex flex-row items-center gap-x-4">
          <>
            <SelectComponent
              control={control}
              inputLabel="Seleccione una planta"
              listaObjetos={plantas}
              nameSelect="plantas"
              valueLabel={(value) => value.name}
              valueSelect={(value) => value.id}
              ValueSave={setPlantaSeleccionada}
              valueKey={(value) => value}
            />
            {plantaSeleccionada !== 0 && (
              <SelectComponent
                control={control}
                listaObjetos={listaCategorias}
                nameSelect="categorias"
                inputLabel="Seleccione una categoria"
                valueLabel={(value) => value.nombre}
                valueSelect={(value) => value.id}
                ValueSave={setCategoriaSeleccionada}
                valueKey={(value) => value}
              />
            )}
            <div>
              {categoriaSeleecionada !== null && (
                <Tooltip title="Agregar Nuevo Grupo">
                  <span>
                    <IconButton
                      disabled={categoriaSeleecionada == null}
                      onClick={() => {
                        setOpenModalAgregarGrupo(true);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Add color={`${categoriaSeleecionada === null ? "disabled" : "primary"}`} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </div>
          </>
        </div>
        <div className="w-full h-[80%] overflow-auto mt-3">
          <div className="w-full h-full">
            <div className="flex flex-col gap-y-4 justify-center w-full">
              {listaGruposProcesos && listaGruposProcesos.length > 0 ? (
                listaGruposProcesos.map((elementos, index) => (
                  <figure
                    key={index}
                    className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                    <div className="flex flex-row w-full justify-between items-center">
                      <div>
                        <h2 className="mb-2 font-semibold">Nombre Grupo: {elementos.nombre}</h2>
                        <p className="text-xs text-gray-500">Creado: {fechaFormateada(elementos)}</p>
                        <p className="text-xs text-gray-500">Detalles: {`${elementos.detalles}`}</p>
                      </div>
                      <div className="flex flex-row items-center gap-x-4">
                        <div>
                          <Tooltip title="Añadir Items">
                            <span>
                              <IconButton
                                disabled={categoriaSeleecionada == null}
                                onClick={(event) => {
                                  handleOpenModalAgregarItem(event, elementos, "añadir");
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <TouchAppRounded color="secondary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Editar Grupo">
                            <span>
                              <IconButton
                                disabled={categoriaSeleecionada == null}
                                onClick={(event) => {
                                  handleOpenModalAgregarItem(event, elementos, "editar");
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Edit color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Eliminar Grupo">
                            <span>
                              <IconButton
                                disabled={categoriaSeleecionada == null}
                                onClick={() => {
                                  deleteGrupos(elementos.id);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Delete color="error" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </figure>
                ))
              ) : (
                <p>No se encontraron grupos de procesos</p>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title="Lista De Items">
                <DetallesGrupoProcesos openModal={openModal} setOpenModal={setOpenModal} grupoSeleccionado={grupoSeleccionado} />
            </ModalCompoment> En caso de querer activar la vista de detalles del grupo, descomentar esto y agreagr a el figure: onclick={() => { handelOpenModal(elementos) }}*/}
      <ModalCompoment
        openPopup={openModalAgregarGrupo}
        setOpenPopup={setOpenModalAgregarGrupo}
        title="Agregar Nuevo Grupo">
        <AgregarGrupoProcesos
          plantaId={plantaSeleccionada as number}
          refreshListaGrupos={setListaGruposProcesos}
          openModal={openModalAgregarGrupo}
          setOpenModal={setOpenModalAgregarGrupo}
          ticketCategoriaId={categoriaSeleecionada}
        />
      </ModalCompoment>
      {grupoSeleccionado && (
        <ModalCompoment
          openPopup={openModalAgregarItems}
          setOpenPopup={setOpenModalAgregarItems}
          title={`Agregar Items Al Grupo: ${grupoSeleccionado.nombre}`}>
          <AgregarItemsGrupoModal
            grupoProcesos={grupoSeleccionado}
            openModal={openModalAgregarItems}
            setOpenModal={setOpenModalAgregarItems}
          />
        </ModalCompoment>
      )}
      <ModalCompoment openPopup={openModalEditarGrupo} setOpenPopup={setOpenModalEditarGrupo} title="Editar Grupo">
        <EditarGrupoProcesos
          grupoSeleccionado={grupoSeleccionado}
          openModal={openModalEditarGrupo}
          setOpenModal={setOpenModalEditarGrupo}
          setListadoGrupoProcesos={setListaGruposProcesos}
        />
      </ModalCompoment>
    </main>
  );
};
