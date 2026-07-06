/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Control, FieldErrors, FieldValues, UseFormReset, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { AddCircleRounded, DeleteRounded, SettingsRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AgregarNuevoBloque } from "../../modals/creacionAuditorias/AgregarNuevoBloque";
import { IAuditoriaGrupoItems } from "../../../models/IAuditoriaGrupoItems";
import FetchApi from "app/shared/helpers/FetchApi";
import { AuditoriaGrupoItemsSliceRequest } from "../../../slices/AuditoriaGrupoItemsSlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { auditoriasUISlice } from "../../../slices/auditoriasUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import { useParams } from "react-router-dom";
import { IAuditoriaGrupoItemsResult } from "../../../models/IAuditoriaGrupoItemsResult";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { AuditoriaGrupoItemsResultSliceRequest } from "../../../slices/AuditoriaGrupoItemsResultSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";

//Se renderiza fuera del componente para evitar renderizados innecesarios
const coloresBorder = (nivelCriticidad: string) => {
  let color = "";
  switch (nivelCriticidad) {
    case "Menor":
      color = "border-green-500";
      break;
    case "Critico":
      color = "border-yellow-400";
      break;
    case "Mayor":
      color = "border-red-500";
      break;
    default:
      color = "border-gray-500";
  }

  return color;
};

const renderListaItems = (
  idBloqueSeleccionado: string | number,
  listaGruposItems: any,
  eliminarBloque: () => void,
  auditoriaEdicion: IAuditoriaAsignada
) => {
  const bloque = listaGruposItems.find((item) => item.id === idBloqueSeleccionado);
  if (!bloque) return null;

  const esEdicion = !!bloque.auditoriaItemsResult;

  const listadoItems = esEdicion
    ? bloque.auditoriaItemsResult.flatMap((items: any) => items.auditoriaItemsResult || items)
    : bloque.auditoriaGrupoItemsBloq?.flatMap((items: any) => items.auditoriaItems) || [];

  return (
    <div className="w-full">
      <header className="flex flex-row items-center justify-between bg-primaryNewOpacity px-4 py-2">
        <p className="w-full text-xl font-semibold text-start">{bloque.nombre}</p>
        {!esEdicion && (
          <button onClick={eliminarBloque} className="bg-gray-500/55 px-2 py-[2px] rounded-md text-white font-semibold">
            X
          </button>
        )}
      </header>
      <section className="flex flex-col p-4 bg-secondaryNew">
        {listadoItems && listadoItems.length > 0 ? (
          listadoItems.map((item) => (
            <>
              <section className="flex flex-row items-center gap-x-2 gap-y-4">
                <div key={item.id} className="flex flex-row py-1 items-center gap-x-2 w-5/6">
                  <p className="w-full">{item.nombre}</p>
                </div>
                <div className="flex flex-row py-1 items-center">
                  <p className={`${coloresBorder(item.auditoriaNivelItem.nombre)} w-full border-l-4 pl-3`}>
                    {item.auditoriaNivelItem.nombre}
                  </p>
                </div>
              </section>
            </>
          ))
        ) : (
          <p>El bloque no tiene asignado items</p>
        )}
      </section>
    </div>
  );
};

interface Params {
  id: string;
}

interface Props {
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  resetFather: UseFormReset<FieldValues>;
  errosFather: FieldErrors<FieldValues>;
  triggerFather: UseFormTrigger<FieldValues>;
}

export const CreacionAuditoriaTercerPaso: React.FC<Props> = ({
  controlFather,
  setValuesFather,
  resetFather,
  errosFather
}) => {
  const auditoriaEdicion = useAppSelector((state) => state.auditoriaAsignada.data as IAuditoriaAsignada);
  const { bloques } = useAppSelector((state) => state.auditoriasUI);
  const { activeBloqItems } = useAppSelector((state) => state.auditoriasUI);
  const { cantidadBloques, bloqueSeleccionado } = useAppSelector((state) => state.auditoriasUI);
  const listaGruposItems = useAppSelector((state) => state.auditoriaGrupoItems.dataAll);

  const params = useParams<Params>();
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { FetchDelete } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();

  const [openModalAgregarBloque, setOpenModalAgregarBloque] = useState<boolean>(false);
  const [openModalEditarBloque, setOpenModalEditarBloque] = useState<boolean>(false);

  const [listaItems, setListaItems] = useState<IAuditoriaGrupoItemsResult>();

  FetchApi<IAuditoriaGrupoItems[]>(
    AuditoriaGrupoItemsSliceRequest.GetAllGroupsByItems,
    null,
    false,
    activeBloqItems,
    null,
    true,
    false,
    false,
    () => {
      dispatch(auditoriasUISlice.actions.setActiveBloqItems(false));
    }
  );

  const handleSelect = (index: number, value: string | number) => {
    const bloquesParaMostrar = obtenerBloquesDisponibles();
    const buscarBloque = bloquesParaMostrar.find((item) => item.id === value);
    const idsIngresados = Object.values(bloqueSeleccionado);
    if (!buscarBloque) {
      return;
    }
    if (idsIngresados.includes(value)) {
      openNotificationUI("El bloque ya se encuentra ingresado", "error");
      setValuesFather(`bloque${index}`, "");
      return;
    }
    dispatch(auditoriasUISlice.actions.setBloques(buscarBloque));
    dispatch(
      auditoriasUISlice.actions.setBloqueSeleccionado({
        ...bloqueSeleccionado,
        [index]: value
      })
    );
    setValuesFather(`bloque${index}`, "");
  };

  const handleRemoveBlock = (index: number, eliminarBloque: boolean) => {
    const nuevoBloqueSeleccionado = { ...bloqueSeleccionado };
    const idAEliminar = nuevoBloqueSeleccionado[index];
    if (eliminarBloque) {
      delete nuevoBloqueSeleccionado[index];
      const reindexado: { [key: number]: string | number } = {};
      Object.keys(nuevoBloqueSeleccionado).forEach((key) => {
        const k = parseInt(key);
        if (k > index) {
          reindexado[k - 1] = nuevoBloqueSeleccionado[k];
        } else {
          reindexado[k] = nuevoBloqueSeleccionado[k];
        }
      });
      dispatch(auditoriasUISlice.actions.setBloqueSeleccionado(reindexado));
      if (idAEliminar) {
        dispatch(auditoriasUISlice.actions.deleteBloques(Number(idAEliminar)));
      }
      setValuesFather(`bloque${index}`, "");
      dispatch(auditoriasUISlice.actions.setCantidadBloques(cantidadBloques - 1));
    } else {
      dispatch(
        auditoriasUISlice.actions.setBloqueSeleccionado({
          ...bloqueSeleccionado,
          [index]: 0
        })
      );
      if (idAEliminar) {
        dispatch(auditoriasUISlice.actions.deleteBloques(Number(idAEliminar)));
      }
    }
  };

  const handleDeleteBlockFromDatabase = (index: number) => {
    const idAEliminar = bloqueSeleccionado[index];
    FetchDelete({
      consoleLog: false,
      deleteId: idAEliminar as number,
      sliceRequest: AuditoriaGrupoItemsResultSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      messageUser: "El bloque seleccionado se eliminara de la auditoria, ¿desea continuar?",
      titleUser: "Eliminar Bloque",
      functionAdd: () => {
        handleRemoveBlock(index, true);
        openNotificationUI("El bloque se ha eliminado correctamente", "success");
      }
    });
  };

  const obtenerBloquesDisponibles = () => {
    const mapaBloques = new Map<string | string, any>();
    listaGruposItems?.forEach((b) => mapaBloques.set(b.nombre, b));
    if (auditoriaEdicion?.auditoriaGrupoItemsResult) {
      auditoriaEdicion.auditoriaGrupoItemsResult.forEach((b) => {
        const buscarBloque = listaGruposItems.find((item) => item.nombre === b.nombre);
        if (buscarBloque) {
          mapaBloques.set(b.nombre, b);
        }
      });
    }
    return Array.from(mapaBloques.values());
  };

  const handleOpenModalEditItems = (items: IAuditoriaGrupoItemsResult) => {
    setListaItems(items);
    setOpenModalEditarBloque(true);
    dispatch(auditoriasUISlice.actions.setEdicionActiva(true));
  };

  const handleOpenModalAddItems = () => {
    setOpenModalAgregarBloque(true);
    dispatch(auditoriasUISlice.actions.setEdicionActiva(false));
  };

  useEffect(() => {
    if (auditoriaEdicion && auditoriaEdicion.auditoriaGrupoItemsResult) {
      const total = auditoriaEdicion.auditoriaGrupoItemsResult.length;
      dispatch(auditoriasUISlice.actions.setCantidadBloques(total));
      const mapeoEdicion: { [key: number]: number } = {};
      auditoriaEdicion.auditoriaGrupoItemsResult.forEach((bloque, idx) => {
        mapeoEdicion[idx] = bloque.id;
      });
      dispatch(auditoriasUISlice.actions.setBloqueSeleccionado(mapeoEdicion));
    }
  }, [auditoriaEdicion, dispatch]);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="personalized" classNamePersonalized="">
      <section className="flex flex-row items-center gap-x-6">
        <Button
          onClick={() => dispatch(auditoriasUISlice.actions.setCantidadBloques(cantidadBloques + 1))}
          variant="contained"
          className={`${buttonClases.blueButton} w-full p-4`}>
          <AddCircleRounded sx={{ margin: "0 1rem" }} fontSize="small" />
          Agregar Bloque
        </Button>
        <div
          onClick={() => handleOpenModalAddItems()}
          className="flex flex-row items-center justify-center gap-x-6 cursor-pointer p-2 bg-secondaryNew rounded-md border-dashed border-2 w-full border-primaryNew hover:bg-primaryNewOpacity group transition-colors duration-150">
          <AddCircleRounded className="group-hover:fill-white" sx={{ fill: "var(--primary-color)" }} fontSize="large" />
          <p className="text-primaryNew text-xl group-hover:text-white">Agregar nuevo bloque</p>
        </div>
      </section>
      <ContainerForPages optionsLayout="personalized" classNamePersonalized="flex flex-col gap-y-6 mt-6">
        {cantidadBloques > 0 &&
          Array.from({ length: cantidadBloques }, (_, index) => index).map((index) => {
            const idSeleccionado = (bloqueSeleccionado || {})[index];
            const estaSeleccionado = idSeleccionado !== undefined && idSeleccionado !== 0;
            return (
              <>
                <div className="flex flex-row items-stretch gap-x-2 w-full">
                  <div className="flex flex-col bg-secondaryNew shadow-md rounded-lg w-full">
                    <div key={index} className="flex flex-row items-center">
                      <span className="bg-[#008000] text-white text-4xl h-full flex items-center px-6 py-6 font-bold rounded-l-lg">
                        B{index + 1}
                      </span>
                      <div className={`${estaSeleccionado ? "" : "px-4"} flex flex-col items-center w-full gap-y-4`}>
                        {!estaSeleccionado ? (
                          <SelectComponent
                            control={controlFather}
                            inputLabel=""
                            listaObjetos={obtenerBloquesDisponibles()}
                            nameSelect={`bloque${index}`}
                            valueLabel={(value) => value.nombre}
                            valueSelect={(value) => value.id}
                            valueKey={(value) => value}
                            ValueSave={(val) => handleSelect(index, val)}
                          />
                        ) : (
                          renderListaItems(
                            idSeleccionado,
                            obtenerBloquesDisponibles(),
                            () => handleRemoveBlock(index, false),
                            auditoriaEdicion
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start gap-y-2 h-full">
                    <Button
                      variant="contained"
                      className={`${buttonClases.redButton} !min-h-[50px] !h-full`}
                      onClick={() =>
                        auditoriaEdicion ? handleDeleteBlockFromDatabase(index) : handleRemoveBlock(index, true)
                      }>
                      <DeleteRounded />
                    </Button>
                    {obtenerBloquesDisponibles().find((elements) => elements.id === idSeleccionado)
                      ?.auditoriaAsignadaId && (
                      <Button
                        variant="contained"
                        className={`${buttonClases.purpleButtonTickets} !min-h-[50px] !h-full`}
                        onClick={() =>
                          handleOpenModalEditItems(
                            obtenerBloquesDisponibles().find((elements) => elements.id === idSeleccionado)
                          )
                        }>
                        <SettingsRounded />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            );
          })}
      </ContainerForPages>
      <ModalCompoment
        openPopup={openModalAgregarBloque}
        setOpenPopup={setOpenModalAgregarBloque}
        title="Agregar nuevo bloque"
        showModalCenterPage
        titleModalStyle="Audit">
        <AgregarNuevoBloque setOpenModal={setOpenModalAgregarBloque} openModal={openModalAgregarBloque} />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalEditarBloque}
        setOpenPopup={setOpenModalEditarBloque}
        title="Editar bloque"
        subTitle="Editar bloques ya asignados a la auditoria"
        showModalCenterPage
        titleModalStyle="Audit">
        <AgregarNuevoBloque
          setOpenModal={setOpenModalEditarBloque}
          grupoItemsSeleccionado={listaItems}
          openModal={openModalEditarBloque}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
