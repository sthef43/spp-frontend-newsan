import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectComponent } from "../../Components/SelectComponent";
import { Button, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ICLIOrganizacion } from "../../Models/ICLIOrganizacion";
import { ICLITipoUBC } from "../../Models/ICLITipoUBC";
import { ICLIUbicacionSector } from "../../Models/ICLIUbicacionSector";
import { CLIOrganizacionSliceRequest } from "../../Middlewares/CLIOrganizacionSlice";
import { CLITipoUBCSliceRequests } from "../../Middlewares/CLITipoUBCSlice";
import { CLIUbicacionSectoresSliceRequest } from "../../Middlewares/CLIUbiacacionSectorSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshList: (newValue: ICLIUbicacionSector[]) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AgregarUbicacion: React.FC<Props> = ({ setOpenModal, refreshList }) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid }
  } = useForm();

  const ubicaciones = useAppSelector((state) => state.cliUbicacionSectores.dataAll as ICLIUbicacionSector[]);

  const [tipoUbc, setTipoUbc] = useState(null);
  const [tipoOrganizacion, setTipoOrganizacion] = useState(null);
  const [tipoEstado, setTipoEstado] = useState(null);

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const estado = [
    { id: 1, estado: "Activo" },
    { id: 0, estado: "Inactivo" }
  ];

  const [listaUBC, setListaUBC] = useState<ICLITipoUBC[]>([]);
  const [listaOrganizacion, setListaOrganizacion] = useState<ICLIOrganizacion[]>([]);

  FetchApi<ICLITipoUBC[]>(CLITipoUBCSliceRequests.getAllRequest, null, false, null, setListaUBC);

  FetchApi<ICLIOrganizacion[]>(CLIOrganizacionSliceRequest.getAllRequest, null, false, null, setListaOrganizacion);

  const onSubmit = async (data) => {
    const buscarLocalizador = localizadorEncontrado();
    if (buscarLocalizador) {
      openNotificationUI("El localizador ingresado ya se encuentra", "error");
    } else {
      const nuevoObjeto: ICLIUbicacionSector = {
        localizador: data.localizador,
        cliTipoUBCId: tipoUbc,
        cliOrganizacionId: tipoOrganizacion,
        estado: tipoEstado
      };
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const responseAniadirObjeto = unwrapResult(
          await dispatch(CLIUbicacionSectoresSliceRequest.PostRequest(nuevoObjeto))
        );
        const responseRefresh = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.getAllRequest()));
        if (responseAniadirObjeto) {
          openNotificationUI("Se agrego la ubicacion correctamente", "success");
          refreshList(responseRefresh);
          setOpenModal(false);
          setTipoEstado(null);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        openNotificationUI(`El error ${error} no dejo añadir la ubicacion`, "error");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  const localizadorEncontrado = () => {
    const numeroLocalizadorInput = watch("localizador");
    const buscarLocalizador = ubicaciones.some((elementos) => {
      return numeroLocalizadorInput == elementos.localizador;
    });
    if (buscarLocalizador != null) {
      return buscarLocalizador;
    }
  };

  return (
    <main className="w-[45vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="flex flex-row gap-x-4">
          <SelectComponent
            control={control}
            listaObjetos={listaUBC}
            nameSelect="UBC"
            inputLabel="Seleccione un tipo de UBC"
            valueLabel={(item) => item.nombre}
            valueSelect={(item) => item.id}
            ValueSave={setTipoUbc}
            valueKey={(item) => item}
          />
          <SelectComponent
            control={control}
            listaObjetos={listaOrganizacion}
            nameSelect="Organizacion"
            inputLabel="Seleccione una organizacion"
            valueLabel={(item) => item.nombre}
            valueSelect={(item) => item.id}
            ValueSave={setTipoOrganizacion}
            valueKey={(item) => item}
          />
        </section>
        <section className="flex flex-row gap-x-4 mt-4">
          <Controller
            name="localizador"
            control={control}
            rules={{ required: "Este campo es obligatorio", minLength: 3 }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                autoComplete="false"
                fullWidth
                {...field}
                label="Ingrese el numero de localizador"
                error={!!errors.nombreJefe}
                helperText={errors.localizador?.message}
                variant="outlined"
              />
            )}
          />
        </section>
        <section className="mt-4">
          <SelectComponent
            control={control}
            listaObjetos={estado}
            nameSelect="estado"
            inputLabel="Seleccione un estado"
            valueLabel={(item) => item.estado}
            valueSelect={(item) => item.id}
            ValueSave={setTipoEstado}
            valueKey={(item) => item}
          />
        </section>
        <div className="flex flex-row justify-center gap-x-3 mt-4">
          <Button className={buttonClases.greenButton} type="submit" disabled={!isValid}>
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
