import { Delete } from "@mui/icons-material";
import { FormControl, FormHelperText, IconButton, TextField, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectCategoriaComponent } from "../../components/SelectCategoriaComponent";
import { ITicketsMailGroup } from "../../models/ITicketsMailGroup";
import { TicketMailGroupSliceRequets } from "app/features/tickets/reducers/TicketsMailGroupSlice";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const DestinatariosNotificaciones = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid }
  } = useForm({ mode: "onBlur" });

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();

  const [categoriaSeleecionada, setCategoriaSeleccionada] = useState(null);

  const [listaEmails, setListaEmail] = useState<ITicketsMailGroup[]>([]);
  const getEmails = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TicketMailGroupSliceRequets.GetAllMailByGrupoId(categoriaSeleecionada))
      );
      if (response) {
        setListaEmail(response);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onSubmit = async (data) => {
    const nuevoEmail: ITicketsMailGroup = { email: data.inputEmail, ticketsCategoriasId: data.categoria };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TicketMailGroupSliceRequets.AddNewEmail(nuevoEmail)));
      if (response) {
        openNotificationUI("Se agrego correctamente el email", "success");
        setValue("inputEmail", "");
        const responseRefresh = unwrapResult(
          await dispatch(TicketMailGroupSliceRequets.GetAllMailByGrupoId(categoriaSeleecionada))
        );
        setListaEmail(responseRefresh);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const eliminarEmailCategoria = async (elementos: ITicketsMailGroup) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TicketMailGroupSliceRequets.DeleteEmailById(elementos.id)));
      if (response) {
        openNotificationUI("Se elimino correctamente el email", "success");
        const responseRefresh = unwrapResult(
          await dispatch(TicketMailGroupSliceRequets.GetAllMailByGrupoId(categoriaSeleecionada))
        );
        setListaEmail(responseRefresh);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    if (categoriaSeleecionada) {
      getEmails();
    }
  }, [categoriaSeleecionada]);

  // const [tipoSeleccionado, setTipoSeleccionado] = useState(null)
  // const opcionesPrincipal: string[] = ["CC", "Supervisor"]

  return (
    <main className="w-full h-full p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 bg-secondaryNew">
        <div className="border p-3 flex flex-col items-start w-full rounded-md">
          <h2 className="font-semibold">Añadir Nuevo Destinatario</h2>
          <div className="flex flex-row items-center w-full gap-x-3 my-3">
            <div className="w-full flex flex-row gap-x-4">
              <SelectCategoriaComponent
                filtroPorPlanta={true}
                plantId={infoUser.operator.plantaId}
                activeControl
                controlPadre={control}
                setCategoriaSeleciconadaId={setCategoriaSeleccionada}
              />
            </div>
            {categoriaSeleecionada !== null && (
              <>
                <div className="w-full">
                  <Controller
                    name="inputEmail"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: { value: true, message: "Ingrese un email" },
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Ingrese un email valido"
                      }
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <TextField
                          autoComplete="off"
                          fullWidth
                          {...field}
                          label="Cargar nuevo email"
                          variant="outlined"
                        />
                        {!!error && <FormHelperText>{error.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                {/* <div className="w-full">
                                    <SelectComponent
                                        listaObjetos={opcionesPrincipal}
                                        nameSelect="principal"
                                        inputLabel="Seleccione una opcion"
                                        valueLabel={(value) => value}
                                        valueSelect={(value) => value}
                                        valueKey={(value) => value}
                                        ValueSave={setTipoSeleccionado}
                                        control={control}
                                    />
                                </div> */}
              </>
            )}
          </div>
          <button
            disabled={!isValid || categoriaSeleecionada === null}
            className={`${buttonClases.blueButton} px-3 py-2 rounded-md text-white font-semibold`}>
            Añadir Destinatario
          </button>
        </div>
        <div className="my-4 w-full">
          <h2 className="text-lg font-semibold mb-3">Destinatarios Actuales</h2>
          <div className="flex flex-col gap-y-3">
            {listaEmails.map((elementos) => (
              <figure
                key={elementos.id}
                className="flex flex-row items-center w-full justify-between border border-gray-300 shadow-shadowBox p-3 rounded-md">
                <div className="flex flex-col">
                  <p className="text-sm">{elementos.email}</p>
                  <p className="text-xs text-gray-500">Rol: {elementos.permisos.rol.name}</p>
                </div>
                <Tooltip title="Continuar Pallet">
                  <span>
                    <IconButton
                      onClick={() => {
                        eliminarEmailCategoria(elementos);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
                  </span>
                </Tooltip>
              </figure>
            ))}
          </div>
        </div>
      </form>
    </main>
  );
};
