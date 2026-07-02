import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { useAppDispatch } from "app/core/store/store";
import { IRol } from "app/models/IRol";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IOperator } from "app/models";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { Autocomplete, Button, FormControl, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ITicketsColaboradoresBloque } from "../../models/ITicketsColaboradoresBloque";
import { ITickets } from "../../models/ITickets";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TicketsColaboradoresBloqueSliceRequest } from "../../reducers/TicketsColaboradoresBloqueSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  ticketSeleccionado: ITickets;
  setRefresListaColaboradores: (newValue: ITicketsColaboradoresBloque[]) => void;
}

export const AgregarColaboradoModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  ticketSeleccionado,
  setRefresListaColaboradores
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();

  const [rolSeleccionado, setRolSeleccionado] = useState(null);

  const [listaRols, setListaRols] = useState<IRol[]>([]);
  const getAllRols = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(RolSliceRequests.getAllRequest()));
      if (response) {
        setListaRols(response);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listadoOperarios, setListadoOperarios] = useState<IOperator[]>([]);
  const getAllOperarios = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getListOperatorByRol(rolSeleccionado)));
      if (response) {
        console.log(response);
        setListadoOperarios(response);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const añadirColaborador = async (data) => {
    const nuevoBloqueColaboradores: ITicketsColaboradoresBloque = {
      colaboradoresId: data.colaborador.id,
      ticketsId: ticketSeleccionado.id
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TicketsColaboradoresBloqueSliceRequest.PostRequest(nuevoBloqueColaboradores))
      );
      console.log(response);
      if (response) {
        const responseRefreshColaboradores = unwrapResult(
          await dispatch(TicketsColaboradoresBloqueSliceRequest.GetAllColabsByTicket(ticketSeleccionado.id))
        );
        if (responseRefreshColaboradores) {
          openNotificationUI("Se ingreso correctamente el colaborador", "success");
          setRefresListaColaboradores(responseRefreshColaboradores);
          setOpenModal(false);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    if (openModal) {
      getAllRols();
    }
  }, [openModal]);

  useEffect(() => {
    if (rolSeleccionado) {
      getAllOperarios();
    }
  }, [rolSeleccionado]);

  return (
    <main className="w-[45vw]">
      <form onSubmit={handleSubmit(añadirColaborador)} className="flex flex-col gap-y-4">
        <SelectComponent
          inputLabel="Selecione un rol"
          listaObjetos={listaRols}
          nameSelect="rol"
          valueLabel={(value) => value.name}
          valueSelect={(value) => value.id}
          valueKey={(value) => value}
          ValueSave={setRolSeleccionado}
          control={control}
        />
        {listadoOperarios.length > 0 && (
          <div>
            <Controller
              name="colaborador"
              control={control}
              rules={{ required: { value: true, message: "Ingrese un colaborador válido" } }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <Autocomplete
                    autoHighlight
                    autoComplete={false}
                    disablePortal={false}
                    options={listadoOperarios}
                    getOptionLabel={(option) => `${option.name} ${option.surname}`}
                    value={value || null}
                    onChange={(event, newValue) => {
                      onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        autoComplete="off"
                        label="Colaboradores"
                        error={!!error}
                        helperText={error ? error.message : ""}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new"
                        }}
                      />
                    )}
                  />
                </FormControl>
              )}
            />
          </div>
        )}
        <div className="flex flex-row justify-center gap-x-3 mt-4">
          <Button
            className={buttonClases.greenButton}
            type="submit"
            disabled={!isValid || listadoOperarios.length == 0}>
            Guardar
          </Button>
          <Button
            className={buttonClases.redButton}
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
