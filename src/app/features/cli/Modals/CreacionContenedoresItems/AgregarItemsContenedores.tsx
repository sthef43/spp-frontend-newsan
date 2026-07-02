/* eslint-disable unused-imports/no-unused-vars */
import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ICLIContendorItems } from "../../Models/ICLIContenedorItems";
import { ICLIImpresionEtiquetas } from "../../Models/ICLIImpresionEtiquetas";
import { CLIContenedorItemsSliceRequest } from "../../Middlewares/CLIContenedorItemsSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../../Middlewares/CLIImpresionEtiquetas";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshLista: (newValue: ICLIContendorItems[]) => void;
  contenedorSeleccionado: ICLIContendorItems;
  openModal: boolean;
}

export const AgregarItemsContenedores: React.FC<Props> = ({
  setOpenModal,
  refreshLista,
  contenedorSeleccionado,
  openModal
}) => {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();

  const [tablaItems, setTablaItems] = useState<ICLIImpresionEtiquetas[]>([]);
  const [itemsDentroContenedor, setItemsDentroContenedor] = useState<ICLIContendorItems>();
  const [itemsParaAgregar, setItemsParaAgregar] = useState<ICLIImpresionEtiquetas>();

  const lpn: string = watch("itemLpn");

  FetchApi<ICLIContendorItems>(
    CLIContenedorItemsSliceRequest.GetAllWithItemsId,
    contenedorSeleccionado.id,
    false,
    openModal,
    setItemsDentroContenedor
  );

  const onSubmit = async () => {
    const itemsFormateados = cambiarContainerId();
    if (itemsFormateados == null) {
      openNotificationUI("No se encontraron items para añadir", "warning");
      return;
    } else {
      const actualizarContenedor = {
        ...contenedorSeleccionado,
        cantidadTotalItems:
          contenedorSeleccionado.cantidadTotalItems == 0
            ? tablaItems.length
            : contenedorSeleccionado.cantidadTotalItems + tablaItems.length
      };
      try {
        await dispatch(CLIContenedorItemsSliceRequest.PutRequest(actualizarContenedor));
        const response = unwrapResult(
          await dispatch(CLIImpresionEtiquetasSliceRequests.multiPutRequest(itemsFormateados))
        );
        const refresh = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("CLI")));
        if (response) {
          openNotificationUI("Se añadieron los items al container", "success");
          refreshLista(refresh);
          setOpenModal(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const buscarLPN = async (event) => {
    let itemDentro = false;
    if (lpn.length == 15) {
      event.preventDefault();
      console.log(itemsDentroContenedor);
      itemDentro = itemsDentroContenedor.cliImpresionEtiquetas.some((elementos) => lpn == elementos.lpnGenerada);
      if (!itemDentro) {
        try {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
          const response = unwrapResult(await dispatch(CLIImpresionEtiquetasSliceRequests.GetItemByLPN(lpn)));
          if (response.id != null) {
            setItemsParaAgregar(response);
          } else {
            setItemsParaAgregar(undefined);
            inputRef.current?.select();
            inputRef.current?.focus();
            openNotificationUI("No se encontro item con este LPN o ya tiene asigando un LPN padre", "warning");
          }
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        } catch (error) {
          console.log(error);
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        }
      } else {
        inputRef.current?.select();
        inputRef.current?.focus();
      }
    }
  };

  const cambiarContainerId = () => {
    const nuevoArray = [...tablaItems];
    nuevoArray.forEach((elementos) => {
      delete elementos.cliItems;
      delete elementos.cliSectores;
      elementos.cliContenedorItemsId = contenedorSeleccionado.id;
    });
    if (nuevoArray != null) {
      return nuevoArray;
    }
  };

  const verificarEncontrado = () => {
    let encontrado = false;
    encontrado = tablaItems.some((elementos) => {
      return elementos.lpnGenerada == itemsParaAgregar.lpnGenerada;
    });
    if (encontrado) {
      inputRef.current?.select();
      inputRef.current?.focus();
      return encontrado;
    }
    if (!encontrado) {
      agregarItems();
    }
    encontrado = false;
  };

  const agregarItems = () => {
    setTablaItems(tablaItems.concat(itemsParaAgregar));
    setItemsParaAgregar(undefined);
    setValue("itemLpn", "");
  };

  const eliminarDelListado = (rowData: ICLIImpresionEtiquetas) => {
    const nuevoArray = [...tablaItems];
    const indexEncontrado = nuevoArray.findIndex((elementos) => elementos.id == rowData.id);
    setTablaItems(tablaItems.splice(0, indexEncontrado));
  };

  useEffect(() => {
    if (openModal) {
      inputRef.current?.focus();
    }
  }, [openModal]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[55vw]">
      <section className="flex flex-row items-center gap-x-3">
        <Controller
          control={control}
          name="itemLpn"
          defaultValue=""
          render={({ field }) => (
            <TextField
              inputRef={inputRef}
              className="inputLPN"
              {...register("itemLpn")}
              onKeyUp={() => {
                buscarLPN(event);
              }}
              fullWidth
              label="Ingrese una lpn"
              error={!!errors.itemLpn}
              helperText={errors.itemLpn?.message}
              variant="outlined"
            />
          )}
        />
        <div className="hidden">
          <Tooltip title="Añadir a la lista">
            <span>
              <IconButton
                size="small"
                style={{ position: "relative" }}
                disabled={itemsParaAgregar == undefined || verificarEncontrado()}
                onClick={() => {
                  agregarItems();
                }}>
                <Add color={itemsParaAgregar == undefined || verificarEncontrado() ? "disabled" : "primary"} />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </section>
      <section className="my-4">
        <TableComponent
          IDcolumn="id"
          dataInfo={tablaItems != null ? tablaItems : []}
          columns={[
            {
              title: "Articulo",
              field: "articulo"
            },
            {
              title: "LPN Item",
              field: "lpnGenerada"
            },
            {
              title: "Nombre",
              field: "cliItems.nombreItem"
            },
            {
              title: "Descipcion",
              field: "cliItems.descripcion"
            },
            {
              title: "Cantidad",
              field: "cantidad"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => (
                <section>
                  <div>
                    <Tooltip title="Eliminar de la lista">
                      <span>
                        <IconButton
                          size="small"
                          style={{ position: "relative" }}
                          onClick={() => {
                            eliminarDelListado(row);
                          }}>
                          <Delete color="error" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </section>
              )
            }
          ]}
        />
      </section>
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button type="submit" className={buttonClases.greenButton} disabled={tablaItems.length == 0}>
            Agregar
          </Button>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}
            className={buttonClases.redButton}>
            Cancelar
          </Button>
        </div>
      </section>
    </form>
  );
};
