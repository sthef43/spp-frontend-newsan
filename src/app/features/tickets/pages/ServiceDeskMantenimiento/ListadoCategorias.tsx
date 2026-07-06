/* eslint-disable unused-imports/no-unused-vars */
import { Add, Delete, Edit, TouchAppRounded } from "@mui/icons-material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { ITicketsCategoria } from "../../models/ITicketsCategorias";
import { AgregarNuevasCategoriasModal } from "../../modals/serviceDeskMantenimientoModal/CategoriaModals/AgregarNuevasCategoriasModal";
import { AgregarRolCategoriaModal } from "../../modals/serviceDeskMantenimientoModal/CategoriaModals/AgregarRolCategoriaModal";
import { EditarCategoriaModal } from "../../modals/serviceDeskMantenimientoModal/CategoriaModals/EditarCategoriaModal";
import { TicketsCategoriaSliceRequest } from "app/features/tickets/reducers/TicketsCategoriaSlice";
import { useForm } from "react-hook-form";
import { IPlant } from "app/models";
import { IconButton, Tooltip } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { PlantSliceRequests } from "app/Middleware/reducers";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ListadoCategorias = () => {
  const { control } = useForm();

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [openModal, setOpenModal] = useState(false);
  const [openModalExaminar, setOpenModalExaminar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setPlantas, false);

  const [listadoCategorias, setListadoCategorias] = useState<ITicketsCategoria[]>([]);
  FetchApi<ITicketsCategoria[]>(
    TicketsCategoriaSliceRequest.GetAllCategoriesByPlantId,
    plantaSeleccionada,
    false,
    plantaSeleccionada,
    setListadoCategorias,
    true
  );

  const deleteCategoria = async (categoriaId: number) => {
    try {
      if (
        await getConfirmation(
          "Eliminar Categoria",
          "Esta seguro que desea eliminar la categoria",
          null,
          "Eliminar",
          "Cancelar"
        )
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const responseDelete = unwrapResult(
          await dispatch(TicketsCategoriaSliceRequest.DeleteCategoriaWithBlocks(categoriaId))
        );
        if (responseDelete) {
          openNotificationUI("Se elimino correctamente la categoria", "success");
          const response = unwrapResult(
            await dispatch(TicketsCategoriaSliceRequest.GetAllCategoriesByPlantId(plantaSeleccionada as number))
          );
          setListadoCategorias(response);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const fechaFormateada = (fechaTickets: ITicketsCategoria) => {
    const fechaFormat = new Date(fechaTickets.createdDate);
    if (fechaFormat) {
      return `${fechaFormat.getFullYear()}-${fechaFormat.getMonth() + 1}-${fechaFormat.getDate()}`;
    } else {
      return `Sin Fecha`;
    }
  };

  const [categoriaSeleccionada, setCategoriaSeleccionado] = useState<ITicketsCategoria>();
  const handleEditarCategoria = (categoria: ITicketsCategoria, tipoModal: string) => {
    setCategoriaSeleccionado(categoria);
    switch (tipoModal) {
      case "rolesAsignados":
        setOpenModalExaminar(true);
        break;
      case "editar":
        setOpenModalEditar(true);
        break;
    }
  };

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 bg-secondaryNew">
        <div className="flex flex-col gap-y-2 items-start">
          <SelectComponent
            control={control}
            inputLabel="Seleccione una planta"
            listaObjetos={plantas}
            nameSelect="planta"
            valueLabel={(value) => value.name}
            valueSelect={(value) => value.id}
            ValueSave={setPlantaSeleccionada}
            valueKey={(value) => value}
          />
          <div>
            {plantaSeleccionada !== 0 && (
              <Tooltip title="Agregar Nueva categoria">
                <button
                  className={`${buttonClases.blueButton} p-2 flex items-center gap-x-4 rounded-md`}
                  onClick={() => {
                    setOpenModal(true);
                  }}>
                  Añadir Categorias
                  <Add />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="w-full h-[80%] overflow-auto mt-3">
          <div className="w-full h-full">
            <div className="flex flex-col gap-y-4 justify-center w-full">
              {listadoCategorias && listadoCategorias.length > 0 ? (
                listadoCategorias.map((elementos, index) => (
                  <figure
                    key={index}
                    className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center hover:bg-gray-300/35 transition-colors cursor-pointer">
                    <div className="flex flex-row items-center w-full justify-between">
                      <div>
                        <h2 className="mb-2 font-semibold">
                          #{index} - {elementos.nombre}
                        </h2>
                        <p className="text-xs text-gray-500">Creado: {fechaFormateada(elementos)}</p>
                        <p className="text-xs text-gray-500">Descripcion: {`${elementos.descripcion}`}</p>
                      </div>
                      <div className="flex flex-row justify-center">
                        <div>
                          <Tooltip title="Examinar Categoria">
                            <span>
                              <IconButton
                                onClick={() => {
                                  handleEditarCategoria(elementos, "rolesAsignados");
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <TouchAppRounded color="secondary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Editar Categoria">
                            <span>
                              <IconButton
                                onClick={() => {
                                  handleEditarCategoria(elementos, "editar");
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Edit color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Eliminar Categoria">
                            <span>
                              <IconButton
                                onClick={() => {
                                  deleteCategoria(elementos.id);
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
                <p>No se encontraron categorias</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title="Crear Nuevas Categorias">
        <AgregarNuevasCategoriasModal
          plantaId={plantaSeleccionada as number}
          openModal={openModal}
          setOpenModal={setOpenModal}
          setListadoCategorias={setListadoCategorias}
        />
      </ModalCompoment>
      <ModalCompoment openPopup={openModalExaminar} setOpenPopup={setOpenModalExaminar} title="Examinar Categoria">
        <AgregarRolCategoriaModal
          setOpenModal={setOpenModalExaminar}
          openModal={openModalExaminar}
          categoriaSeleccionada={categoriaSeleccionada}
        />
      </ModalCompoment>
      <ModalCompoment openPopup={openModalEditar} setOpenPopup={setOpenModalEditar} title="Editar Categoria">
        <EditarCategoriaModal
          plantaId={plantaSeleccionada as number}
          categoriaSeleccionada={categoriaSeleccionada}
          setListadoCategorias={setListadoCategorias}
          openModal={openModalEditar}
          setOpenModal={setOpenModalEditar}
        />
      </ModalCompoment>
    </main>
  );
};
