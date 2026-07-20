/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button, Collapse, List, ListItem, ListItemText } from "@mui/material";
import { AddCircleRounded, DeleteRounded, ListAltRounded, PlaylistAddCheckOutlined } from "@mui/icons-material";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAuditoriaNivelItem } from "../../../models/IAuditoriaNivelItem";
import FetchApi from "app/shared/helpers/FetchApi";
import { AuditoriaNivelItemSliceRequest } from "../../../slices/AuditoriaNivelItemSlice";
import { IAuditoriaItems } from "../../../models/IAuditoriaItems";
import { AuditoriaItemsSliceRequest } from "../../../slices/AuditoriaItemsSlice";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { IAuditoriaGrupoItems } from "../../../models/IAuditoriaGrupoItems";
import { AuditoriaGrupoItemsSliceRequest } from "../../../slices/AuditoriaGrupoItemsSlice";
import { IAuditoriaGrupoItemsBloq } from "../../../models/IAuditoriaGrupoItemsBloq";
import { AuditoriaGrupoItemsBloqSliceRequest } from "../../../slices/AuditoriaGrupoItemsBloqSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { TransitionGroup } from "react-transition-group";
import { IAuditoriaGrupoItemsResult } from "../../../models/IAuditoriaGrupoItemsResult";
import { auditoriasUISlice } from "../../../slices/auditoriasUISlice";
import { AuditoriaItemsResultSliceRequest } from "../../../slices/AuditoriaItemsResultSlice";
import { AuditoriaAsignadaSliceRequest } from "../../../slices/AuditoriaAsignadaSlice";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import { IAuditoriaItemsResult } from "../../../models/IAuditoriaItemsResult";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  grupoItemsSeleccionado?: IAuditoriaGrupoItemsResult;
}

interface RenderItemOptions {
  item: JSX.Element;
}

function renderItem({ item }: RenderItemOptions) {
  return (
    <ListItem>
      <ListItemText primary={item} />
    </ListItem>
  );
}

export const AgregarNuevoBloque: React.FC<Props> = ({ setOpenModal, openModal, grupoItemsSeleccionado }) => {
  const {
    control,
    handleSubmit,
    setValue,
    unregister,
    formState: { isValid, errors }
  } = useForm();

  const edicionActiva = useAppSelector((state) => state.auditoriasUI.edicionActiva);
  const auditoria = useAppSelector((state) => state.auditoriaAsignada.data as IAuditoriaAsignada);
  const modoEdicionGlobal = useAppSelector((state) => state.auditoriasUI.modoEdicionGlobal);

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { FetchPost, FetchDelete, FetchPut } = useFetchApiMultiResults<
    IAuditoriaGrupoItems | IAuditoriaItems[] | IAuditoriaGrupoItemsBloq[]
  >();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const { TitleChanger } = useTitleOfApp();

  const [tipoItem, setTipoItem] = useState<number[]>(
    edicionActiva ? grupoItemsSeleccionado?.auditoriaItemsResult.map((_) => 1) : []
  );
  const [nivelRiesgo, setNivelRiesgo] = useState<string | number>(0);

  const [listaDePeligro, setListaDePeligro] = useState<IAuditoriaNivelItem[]>([]);
  const [listaDeItems, setListaDeItems] = useState<IAuditoriaItems[]>([]);

  FetchApi<IAuditoriaNivelItem[]>(
    AuditoriaNivelItemSliceRequest.getAllRequest,
    null,
    false,
    openModal,
    setListaDePeligro,
    true,
    false,
    false
  );

  FetchApi<IAuditoriaItems[]>(
    AuditoriaItemsSliceRequest.getAllRequest,
    null,
    false,
    openModal,
    setListaDeItems,
    true,
    false,
    false
  );

  const onSubmit = async (data: any) => {
    const nuevosItems = filterItems(data);

    const itemsExistentes = nuevosItems.filter((item) => item.itemExistente);
    const itemsNuevos = nuevosItems.filter((item) => !item.itemExistente);

    if (await getConfirmation(edicionActiva ? "Edicion De Bloque" : "Creacion De Bloque", "¿Desea crear el bloque?")) {
      if (!edicionActiva) {
        FetchPost(AuditoriaGrupoItemsSliceRequest.PostRequest, nuevoGrupoItems(data), false, (responseGrupo) => {
          FetchPost(AuditoriaItemsSliceRequest.MultiPostReturnList, itemsNuevos, false, (responseItems) => {
            if (responseGrupo && responseItems) {
              generateBloq(
                (responseGrupo as IAuditoriaGrupoItems).id,
                (responseItems as IAuditoriaItems[]).map((item) => item.id),
                itemsExistentes.map((item) => item.id)
              );
            }
          });
        });
      } else {
        actualizarListadoItems(nuevosItems as IAuditoriaItemsResult[]);
      }
    }
  };

  const generateBloq = async (grupoId: number, itemsId: number[], itemsExistentes: number[]) => {
    itemsId.push(...itemsExistentes);
    const listaBloques: IAuditoriaGrupoItemsBloq[] = Array.from({ length: itemsId.length }, (_, index) => {
      return {
        auditoriaGrupoItemsId: grupoId,
        auditoriaItemsId: itemsId[index]
      };
    });
    FetchPost(AuditoriaGrupoItemsBloqSliceRequest.multiPostRequest, listaBloques, false, (response) => {
      if (response) {
        openNotificationUI("Lista de valores creada exitosamente", "success");
        dispatch(auditoriasUISlice.actions.setActiveBloqItems(true));
        setOpenModal(false);
      }
    });
  };

  const refetchAfterEdit = async () => {
    await dispatch(AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById(auditoria.auditoriaId));
    if (modoEdicionGlobal && auditoria.auditoriaId) {
      const todasLasAsignaciones = unwrapResult(
        await dispatch(AuditoriaAsignadaSliceRequest.getAllAuditAsignedByAuditId(auditoria.auditoriaId))
      );
      dispatch(auditoriasUISlice.actions.setListaAuditoriasAsignadasGlobal(todasLasAsignaciones));
    }
  };

  const actualizarListadoItems = (items: IAuditoriaItemsResult[]) => {
    FetchPut({
      consoleLog: false,
      modelPut: items,
      sliceRequest: AuditoriaItemsResultSliceRequest.MultiPutItemsResult,
      activeConfirmation: false,
      functionAdd: async () => {
        openNotificationUI("Se actualizaron los items con exito", "success");
        await refetchAfterEdit();
        setOpenModal(false);
      }
    });
  };

  const deleteItemEdicion = (idEliminacion: number, index: number) => {
    FetchDelete({
      consoleLog: false,
      deleteId: idEliminacion,
      sliceRequest: AuditoriaItemsResultSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      messageUser: "Se eliminara el item seleccionado del bloque, ¿Desea continuar?",
      titleUser: "Eliminar item",
      functionAdd: async () => {
        openNotificationUI("Se elimino el item con exito", "success");
        await refetchAfterEdit();
        handleDeleteItem(index);
      }
    });
  };

  // Funcion para eliminar un item
  const handleDeleteItem = (index: number) => {
    const newTipoItem = [...tipoItem];
    newTipoItem.splice(index, 1);
    unregister(`nombreItem${index}`);
    unregister(`nivelRiesgo${index}`);
    unregister(`itemExistente${index}`);
    setTipoItem(newTipoItem);
  };

  const filterItems = (data: any): IAuditoriaItems[] | IAuditoriaItemsResult[] => {
    const itemsMapeados = tipoItem.map((_, index) => {
      const itemExistId = data[`itemExistente${index}`];
      const existingItem = edicionActiva ? grupoItemsSeleccionado?.auditoriaItemsResult[index] : undefined;
      const item = {
        nombre:
          itemExistId !== undefined && itemExistId !== null
            ? listaDeItems.find((item) => item.id === itemExistId)?.nombre
            : data[`nombreItem${index}`],
        auditoriaNivelItemId:
          itemExistId !== undefined && itemExistId !== null
            ? listaDeItems.find((item) => item.id === itemExistId)?.auditoriaNivelItemId
            : Number(data[`nivelRiesgo${index}`]),
        itemExistente: itemExistId !== undefined && itemExistId !== null ? true : false,
        id: edicionActiva ? (existingItem ? existingItem.id : undefined) : itemExistId ?? 0
      };
      return item;
    });
    return edicionActiva ? (itemsMapeados as IAuditoriaItemsResult[]) : (itemsMapeados as IAuditoriaItems[]);
  };

  const nuevoGrupoItems = (data: any): IAuditoriaGrupoItems => {
    const { descripcionBloque, nombreBloque } = data;
    return {
      descripcion: descripcionBloque,
      nombre: nombreBloque
    };
  };

  // Renderizado de los items dependiendo del tipo
  const renderItemNuevo = (index: number): JSX.Element => {
    const item = grupoItemsSeleccionado?.auditoriaItemsResult[index];
    const nivelItem = item?.auditoriaNivelItemId;
    return (
      <ContainerForPages
        optionsLayout="personalized"
        classNamePersonalized="w-full h-full bg-background p-6 rounded-md border flex flex-row items-center gap-x-4 border-gray-400/30 relative">
        <div className="flex flex-col gap-y-4 w-full">
          <TextFieldComponent
            control={control}
            index={index}
            labelInput="Nombre del item"
            nameInput={`nombreItem${index}`}
            requiredBool
            errors={errors}
            valueDefault={item ? item?.nombre : ""}
          />
        </div>
        <div className="w-1/3">
          <SelectComponent
            control={control}
            valueKey={(e) => e}
            inputLabel="Nivel de riesgo"
            listaObjetos={listaDePeligro}
            activeRequired
            nameSelect={`nivelRiesgo${index}`}
            valueLabel={(e) => e.nombre}
            valueSelect={(e) => e.id}
            ValueSave={(e) => setNivelRiesgo(e)}
            defaultValue={nivelItem ? nivelItem : ""}
          />
        </div>
        <p className="absolute bottom-[5.7rem] left-5 bg-blue-500 text-white px-3 py-[2px] rounded-full text-sm">
          Nuevo
        </p>
        <DeleteRounded
          className="cursor-pointer"
          color="error"
          onClick={() => {
            edicionActiva ? deleteItemEdicion(item?.id, index) : handleDeleteItem(index);
          }}
        />
      </ContainerForPages>
    );
  };

  const renderItemExistente = (index: number): JSX.Element => {
    return (
      <ContainerForPages
        optionsLayout="personalized"
        classNamePersonalized="w-full h-full bg-background p-6 rounded-md border border-gray-400/30 flex flex-row items-center gap-x-4 relative">
        <SelectComponent
          control={control}
          valueKey={(e) => e}
          inputLabel="Item existente"
          listaObjetos={listaDeItems}
          nameSelect={`itemExistente${index}`}
          valueLabel={(e) => e.nombre}
          valueSelect={(e) => e.id}
          ValueSave={(e) => console.log(e)}
        />
        <p className="absolute bottom-[5.7rem] left-5 bg-blue-500 text-white px-3 py-[2px] rounded-full text-sm">
          Existente
        </p>
        <DeleteRounded className="cursor-pointer" color="error" onClick={() => handleDeleteItem(index)} />
        {/* <SettingsRounded className="cursor-pointer" color="secondary" /> */}
      </ContainerForPages>
    );
  };

  return (
    <main className="w-[65vw]">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row items-center gap-x-4">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Nombre del bloque"
            nameInput="nombreBloque"
            requiredBool
            errors={errors}
            valueDefault={edicionActiva ? grupoItemsSeleccionado?.nombre : ""}
          />
          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Descripcion del bloque"
            nameInput="descripcionBloque"
            requiredBool
            errors={errors}
            valueDefault={edicionActiva ? grupoItemsSeleccionado?.descripcion : ""}
          />
        </div>
        <div className="flex flex-row w-full justify-between items-center border-b border-gray-200 pb-2">
          <div className="flex flex-row items-center gap-2">
            <ListAltRounded />
            <p className="font-semibold text-lg">Items del bloque</p>
          </div>
          <p className="text-xs font-semibold text-gray-500">CONFIGURACION DE ITEMS</p>
        </div>
        <section className="flex flex-col">
          {/* {tipoItem.map((item, index) => {
            return (
              <div key={index}>
                {item === 1 && renderItemNuevo(index)}
                {item === 2 && renderItemExistente(index)}
              </div>
            );
          })} */}
          <List className="mt-1">
            <TransitionGroup>
              {tipoItem.map((item, index) => (
                <Collapse key={index}>
                  {renderItem({
                    item: item === 1 ? renderItemNuevo(index) : renderItemExistente(index)
                  })}
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
        </section>
        <section className="flex flex-row items-center w-full justify-between gap-x-4">
          <div
            onClick={() => setTipoItem([...tipoItem, 1])}
            className="flex flex-row items-center justify-center gap-x-2 cursor-pointer p-2 bg-secondaryNew rounded-md border-dashed border-2 w-full border-primaryNew hover:bg-primaryNewOpacity group transition-colors duration-150">
            <AddCircleRounded
              className="group-hover:fill-white"
              sx={{ fill: "var(--primary-color)" }}
              fontSize="medium"
            />
            <p className="text-primaryNew text-sm font-semibold group-hover:text-white">AGREGAR NUEVO ITEM</p>
          </div>
          <div
            onClick={() => setTipoItem([...tipoItem, 2])}
            className="flex flex-row items-center justify-center gap-x-2 cursor-pointer p-2 bg-secondaryNew rounded-md border-dashed border-2 w-full border-primaryNew hover:bg-primaryNewOpacity group transition-colors duration-150">
            <PlaylistAddCheckOutlined
              className="group-hover:fill-white"
              sx={{ fill: "var(--primary-color)" }}
              fontSize="medium"
            />
            <p className="text-primaryNew text-sm font-semibold group-hover:text-white">AGREGAR ITEM EXISTENTE</p>
          </div>
        </section>
        <div className="flex flex-row justify-center items-center">
          <Button
            variant="contained"
            type="button"
            className={`${buttonClases.blueButton}`}
            disabled={!isValid || tipoItem.length === 0}
            onClick={handleSubmit(onSubmit)}>
            Guardar
          </Button>
        </div>
      </form>
    </main>
  );
};
