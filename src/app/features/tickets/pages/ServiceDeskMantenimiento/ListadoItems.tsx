import { Add, Delete, Edit, MenuRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SelectRolComponent } from "../../components/SelectRolComponent";
import { ITicketsItemsProcesos } from "../../models/ITicketsItemsProcesos";
import { AgreagrItemModal } from "../../modals/serviceDeskMantenimientoModal/AgregatItemModa";
import { EditarItemModal } from "../../modals/serviceDeskMantenimientoModal/EditarItemModal";
import { TicketsItemsProcesosSliceRequest } from "app/features/tickets/reducers/TicketsItemsProcesos";
import { AñadirItemsParaCancelacionModal } from "../../modals/serviceDeskMantenimientoModal/AñadirItemsParaCancelacionModal";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ListadoItems = () => {
  const { control, watch, setValue } = useForm();

  const valueInput: string = watch("filtrarItem");

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [openModal, setOpenModal] = useState(false);
  const [openModalEditarItem, setOpenModalEditarItem] = useState(false);
  const [openModalItemCancelacion, setOpenModalItemCancelacion] = useState(false);

  const [listadoItemsFiltrado, setListadoItemsFiltrado] = useState<ITicketsItemsProcesos[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);

  const [listaItems, setListaItems] = useState<ITicketsItemsProcesos[]>([]);
  const getItems = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TicketsItemsProcesosSliceRequest.GetAllItemsByRolId(rolSeleccionado))
      );
      if (response) {
        setListaItems(response);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const deleteItem = async (itemId) => {
    try {
      if (await getConfirmation("Eliminar Item", "Seguro que desea eliminar el item", null, "Aceptar", "Cancelar")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(await dispatch(TicketsItemsProcesosSliceRequest.deleteRequest(itemId)));
        if (response) {
          const responseGetAll = unwrapResult(
            await dispatch(TicketsItemsProcesosSliceRequest.GetAllItemsByRolId(rolSeleccionado))
          );
          if (responseGetAll) {
            openNotificationUI("Se elimino el item correctamente", "success");
            setListaItems(responseGetAll);
          }
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const fechaFormateada = (fechaTickets: ITicketsItemsProcesos) => {
    const fechaFormat = new Date(fechaTickets.createdDate);
    if (fechaFormat) {
      return `${fechaFormat.getFullYear()}-${fechaFormat.getMonth() + 1}-${fechaFormat.getDate()}`;
    } else {
      return `Sin Fecha`;
    }
  };

  const [itemSeleccionado, setItemSeleccionado] = useState<ITicketsItemsProcesos>();
  const handleModalEditarItem = (elemento: ITicketsItemsProcesos) => {
    setItemSeleccionado(elemento);
    setOpenModalEditarItem(true);
  };

  const handleOpenModalAgregarItems = (elemento: ITicketsItemsProcesos) => {
    setItemSeleccionado(elemento);
    setOpenModalItemCancelacion(true);
  };

  useEffect(() => {
    if (!valueInput) {
      setListadoItemsFiltrado(listaItems);
    } else {
      const filtrados = listaItems.filter((elementos) =>
        elementos.nombre.toLowerCase().includes(valueInput.toLowerCase())
      );
      setListadoItemsFiltrado(filtrados);
    }
  }, [valueInput, listaItems]);

  useEffect(() => {
    if (rolSeleccionado) {
      getItems();
      if (valueInput != "") {
        setValue("filtrarItem", "");
      }
    }
  }, [rolSeleccionado]);

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 bg-secondaryNew">
        <div className="flex flex-row items-center gap-x-4">
          <SelectRolComponent activeControl controlPadre={control} setRolSeleccionadoId={setRolSeleccionado} />
          {rolSeleccionado !== null && (
            <>
              <TextFieldComponent
                control={control}
                index={0}
                labelInput="Buscar Item"
                valueDefault=""
                nameInput="filtrarItem"
              />
              <div>
                <Tooltip title="Agregar Nuevo Item">
                  <span>
                    <IconButton
                      onClick={() => {
                        setOpenModal(true);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Add color="primary" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </>
          )}
        </div>
        <div className="w-full h-[80%] overflow-auto mt-3">
          <div className="w-full h-full">
            <div className="flex flex-col gap-y-4 justify-center w-full">
              {listadoItemsFiltrado && listadoItemsFiltrado.length > 0 ? (
                listadoItemsFiltrado.map((elementos, index) => (
                  <figure
                    key={index}
                    className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center hover:bg-gray-300/35 transition-colors">
                    <div className="flex flex-row justify-between w-full items-center">
                      <div>
                        <h2 className="mb-2 font-semibold">{elementos.nombre}</h2>
                        <p className="text-xs text-gray-500">Creado: {fechaFormateada(elementos)}</p>
                        <p className="text-xs text-gray-500">Detalles: {`${elementos.detalles}`}</p>
                      </div>
                      <div className="flex flex-row justify-center gap-x-4">
                        <div>
                          <Tooltip title="Editar Item">
                            <span>
                              <IconButton
                                onClick={() => {
                                  handleModalEditarItem(elementos);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Edit color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Asignar Item de Desaprobacion">
                            <span>
                              <IconButton
                                onClick={() => {
                                  handleOpenModalAgregarItems(elementos);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <MenuRounded color="secondary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                        <div>
                          <Tooltip title="Eliminar Item">
                            <span>
                              <IconButton
                                onClick={() => {
                                  deleteItem(elementos.id);
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
                <p>No se encontraron items</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <ModalCompoment title="Agregar Nuevo Item" openPopup={openModal} setOpenPopup={setOpenModal}>
        <AgreagrItemModal
          refreshListaItems={setListaItems}
          rolSeleccionado={rolSeleccionado}
          setOpenModal={setOpenModal}
          openModal={openModal}
        />
      </ModalCompoment>
      <ModalCompoment title="Editar item" openPopup={openModalEditarItem} setOpenPopup={setOpenModalEditarItem}>
        <EditarItemModal
          setListadoItems={setListaItems}
          rolSeleccionado={rolSeleccionado}
          openModal={openModalEditarItem}
          setOpenModal={setOpenModalEditarItem}
          itemSeleccionado={itemSeleccionado}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalItemCancelacion}
        openPopup={openModalItemCancelacion}
        title="Agregar Items Para Desaprobar">
        <AñadirItemsParaCancelacionModal
          listaItems={listaItems}
          itemSeleccionado={itemSeleccionado}
          setOpenModal={setOpenModalItemCancelacion}
          openModal={openModalItemCancelacion}
        />
      </ModalCompoment>
    </main>
  );
};
