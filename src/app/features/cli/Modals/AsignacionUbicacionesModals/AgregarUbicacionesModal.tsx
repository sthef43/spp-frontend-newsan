/* eslint-disable unused-imports/no-unused-vars */
import { TextField, Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { CLIUbicacionesConItems } from "app/models/Stored Procdure/CLIUbicacionesConItems";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ICLIContendorItems } from "../../Models/ICLIContenedorItems";
import { ICLIImpresionEtiquetas } from "../../Models/ICLIImpresionEtiquetas";
import { ICLIUbicacionSector } from "../../Models/ICLIUbicacionSector";
import { CLIContenedorItemsSliceRequest } from "../../Middlewares/CLIContenedorItemsSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../../Middlewares/CLIImpresionEtiquetas";
import { CLIUbicacionSectoresSliceRequest } from "../../Middlewares/CLIUbiacacionSectorSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  refreshLista: (newValue: ICLIUbicacionSector[]) => void;
  refreshExcel: (newValue: CLIUbicacionesConItems[]) => void;
  tipoAsignacion: string;
}

export const AgregarUbicacionesModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  refreshLista,
  tipoAsignacion,
  refreshExcel
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();

  const inputLocalizador = useRef<HTMLInputElement | null>(null);
  const inputLpn = useRef<HTMLInputElement | null>(null);

  const [lpnEncontrado, setLpnEncontrado] = useState(null);

  const [itemConUbicacion, setItemConUbicacion] = useState<ICLIUbicacionSector>();
  const [localizadorEncontrado, setLocalizadorEncontrado] = useState<ICLIUbicacionSector>();

  const localizadorIngresado = watch("localizador");
  const codigoLpn: string = watch("lpn");

  const buscarLPNItems = async (event) => {
    let datosLpn: ICLIImpresionEtiquetas | ICLIContendorItems = null;
    try {
      if (codigoLpn.length == 15 && tipoAsignacion == "item") {
        datosLpn = unwrapResult(await dispatch(CLIImpresionEtiquetasSliceRequests.GetItemByLPN(codigoLpn)));
        if (datosLpn.id != null) {
          setLpnEncontrado(datosLpn);
          openNotificationUI("Se encontro un item con este LPN", "success");
          if (datosLpn.cliUbicacionesSectoresId != null) {
            const response = unwrapResult(
              await dispatch(CLIUbicacionSectoresSliceRequest.getByIdRequest(datosLpn.cliUbicacionesSectoresId))
            );
            setItemConUbicacion(response);
          }
        }
        if (datosLpn.id == null) {
          setLpnEncontrado(null);
          setItemConUbicacion(null);
          inputLpn.current?.select();
          openNotificationUI("No se encontro LPN o ya esta ingresada en una ubicacion", "warning");
        }
      }
      if (codigoLpn.length == 10 && tipoAsignacion == "lpnPadre") {
        datosLpn = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetAllWithItemsLPN(codigoLpn)));
        if (datosLpn.id != null) {
          setLpnEncontrado(datosLpn);
          openNotificationUI("Se encontro un item con este LPN", "success");
          if (datosLpn.cliUbicacionesSectoresId != null) {
            const response = unwrapResult(
              await dispatch(CLIUbicacionSectoresSliceRequest.getByIdRequest(datosLpn.cliUbicacionesSectoresId))
            );
            setItemConUbicacion(response);
          }
        }
        if (datosLpn.id == null) {
          setLpnEncontrado(null);
          setItemConUbicacion(null);
          inputLpn.current?.select();
          openNotificationUI("No se encontro LPN o ya esta ingresada en una ubicacion", "warning");
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const buscarUbicacionDisponible = async (event) => {
    try {
      if (localizadorIngresado.length >= 8) {
        event.preventDefault();
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(
          await dispatch(CLIUbicacionSectoresSliceRequest.getAllLocationWithoutSector(localizadorIngresado))
        );
        if (response.id != undefined) {
          openNotificationUI("Se encontro el localizador", "success");
          setLocalizadorEncontrado(response);
        }
        if (response.id == undefined) {
          inputLocalizador.current?.select();
          setLocalizadorEncontrado(null);
          openNotificationUI("El localizador no se encuentra o estado ocupado", "warning");
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    const cambiarEstado = { ...itemConUbicacion, estado: true };
    delete cambiarEstado.cliTipoUBC;
    delete cambiarEstado.cliOrganizacion;
    const objetoNuevo = setearObjeto();
    const nuevoLocalizador = cambiarEstadoDisponible();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (cambiarEstado.id != null) {
        await dispatch(CLIUbicacionSectoresSliceRequest.PutRequest(cambiarEstado));
      }
      await dispatch(CLIUbicacionSectoresSliceRequest.PutRequest(nuevoLocalizador));
      if (tipoAsignacion == "item") {
        const response = unwrapResult(await dispatch(CLIImpresionEtiquetasSliceRequests.PutRequest(objetoNuevo)));
      }
      if (tipoAsignacion == "lpnPadre") {
        const response = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.PutRequest(objetoNuevo)));
      }
      const response = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.getAllRequest()));
      const ubicacionItems = unwrapResult(
        await dispatch(CLIUbicacionSectoresSliceRequest.getAllUbicacionesWithItems())
      );
      if (response) {
        refreshExcel(ubicacionItems);
        refreshLista(response);
        openNotificationUI("Se añadio correctamente", "success");
        setOpenModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
    }
  };

  const cambiarEstadoDisponible = () => {
    const nuevoObjeto = { ...localizadorEncontrado, estado: false };
    delete nuevoObjeto.cliTipoUBC;
    delete nuevoObjeto.cliOrganizacion;
    if (nuevoObjeto != null) {
      return nuevoObjeto;
    }
  };

  const setearObjeto = () => {
    const nuevoObjeto = { ...lpnEncontrado };
    if (itemConUbicacion == undefined) {
      nuevoObjeto.cliUbicacionesSectoresId = null;
    }
    if (tipoAsignacion == "item") {
      delete nuevoObjeto.cliItems;
      delete nuevoObjeto.cliSectores;
      delete nuevoObjeto.cliContenedorItens;
      delete nuevoObjeto.cliubicacionesSectores;
      nuevoObjeto.cliUbicacionesSectoresId = localizadorEncontrado.id;
    }
    if (tipoAsignacion == "lpnPadre") {
      delete nuevoObjeto.cliImpresionEtiquetas;
      delete nuevoObjeto.cliUbicacionesSectores;
      nuevoObjeto.cliUbicacionesSectoresId = localizadorEncontrado.id;
    }
    if (nuevoObjeto != null) {
      return nuevoObjeto;
    }
  };

  useEffect(() => {
    inputLocalizador.current?.focus();
  }, [openModal]);

  useEffect(() => {
    if (localizadorEncontrado) {
      inputLpn.current?.focus();
    }
  }, [localizadorEncontrado]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[65vw]">
      <section className="w-full">
        <div className="mt-4 w-full">
          <Controller
            control={control}
            name="localizador"
            defaultValue=""
            rules={{ required: "Debe ingresar un Localizador disponible" }}
            render={({ field }) => (
              <TextField
                inputRef={inputLocalizador}
                {...register("localizador")}
                onKeyUp={() => {
                  buscarUbicacionDisponible(event);
                }}
                fullWidth
                label={"Ingrese el localizador"}
                error={!!errors.localizador}
                helperText={errors.localizador?.message}
                variant="outlined"
              />
            )}
          />
        </div>
      </section>
      {localizadorEncontrado != undefined && (
        <section className="w-full">
          <div className="mt-4 w-full">
            <Controller
              control={control}
              name="lpn"
              defaultValue=""
              rules={{ required: "Debe ingresar un LPN" }}
              render={({ field }) => (
                <TextField
                  inputRef={inputLpn}
                  {...register("lpn")}
                  onKeyUp={() => {
                    buscarLPNItems(event);
                  }}
                  fullWidth
                  label={`${tipoAsignacion == "lpnPadre" ? "Escanne el LPN padre" : "Escanne el LPN del item"}`}
                  error={!!errors.lpn}
                  helperText={errors.lpn?.message}
                  variant="outlined"
                />
              )}
            />
          </div>
        </section>
      )}
      {/* <section className="mt-4">
                <Stack spacing={3} sx={{ width: "100%" }}>
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={listaUbicacionesDisponibles}
                        getOptionLabel={(option) => option.localizador}
                        filterSelectedOptions
                        value={watch("ubicaciones") || []}
                        onChange={(_, newValue) => setValue("ubicaciones", newValue)}
                        isOptionEqualToValue={(item, value) => item.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecion ubicaciones para añadir"
                            />
                        )}
                    />
                    <input type="hidden" {...register("ubicaciones")} />
                </Stack>
            </section> */}
      <section className="flex justify-center gap-x-4 mt-4">
        <div>
          <Button type="submit" disabled={lpnEncontrado == undefined} className={buttonClases.greenButton}>
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
