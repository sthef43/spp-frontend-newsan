import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectComponent } from "../../Components/SelectComponent";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICLIOrganizacion } from "../../Models/ICLIOrganizacion";
import { ICLITipoUBC } from "../../Models/ICLITipoUBC";
import { ICLIUbicacionSector } from "../../Models/ICLIUbicacionSector";
import { ICLISectores } from "../../Models/ICLISectores";
import { CLIOrganizacionSliceRequest } from "../../Middlewares/CLIOrganizacionSlice";
import { CLITipoUBCSliceRequests } from "../../Middlewares/CLITipoUBCSlice";
import { CLIUbicacionSectoresSliceRequest } from "../../Middlewares/CLIUbiacacionSectorSlice";
import { CLISectoresSliceRequest } from "../../Middlewares/CliSectoresSlice";

interface Props {
  refreshLista: (newvalue: ICLIUbicacionSector[]) => void;
  setOpenModal: (newValue: boolean) => void;
  ubicacionSeleccionada: ICLIUbicacionSector;
  openModal: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const EditarUbicacion: React.FC<Props> = ({ refreshLista, setOpenModal, ubicacionSeleccionada, openModal }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();

  const [tipoUBCSeleccionado, setTipoUBCSeleccionado] = useState<string | number>(0);
  const [organizacionSeleccionada, setOrganizacionSeleccionada] = useState<string | number>(0);
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | number>();

  const [listaUBC, setListaUBC] = useState<ICLITipoUBC[]>([]);
  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  const [listaOrganizacion, setListaOrganizacion] = useState<ICLIOrganizacion[]>([]);

  FetchApi<ICLITipoUBC[]>(CLITipoUBCSliceRequests.getAllRequest, null, false, null, setListaUBC);

  FetchApi<ICLIOrganizacion[]>(CLIOrganizacionSliceRequest.getAllRequest, null, false, null, setListaOrganizacion);

  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, openModal, setListaSectores, true);

  const onSubmit = async (data) => {
    const nuevoObjeto: ICLIUbicacionSector = {
      ...ubicacionSeleccionada,
      localizador: data.localizador,
      cliTipoUBCId: Number(tipoUBCSeleccionado),
      cliOrganizacionId: Number(organizacionSeleccionada),
      cliSectoresId: Number(sectorSeleccionado)
    };
    delete nuevoObjeto.cliTipoUBC;
    delete nuevoObjeto.cliOrganizacion;
    try {
      const response = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.PutRequest(nuevoObjeto)));
      const responseRefresh = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.getAllRequest()));
      if (response) {
        refreshLista(responseRefresh);
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="w-[45vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="flex flex-row gap-x-4 w-full">
          <SelectComponent
            control={control}
            listaObjetos={listaUBC}
            nameSelect="ubc"
            inputLabel="Seleccione un tipo de UBC"
            valueLabel={(items) => items.nombre}
            valueSelect={(items) => items.id}
            valueKey={(item) => item}
            ValueSave={setTipoUBCSeleccionado}
          />
          <SelectComponent
            control={control}
            listaObjetos={listaOrganizacion}
            nameSelect="organizacion"
            inputLabel="Seleccione un tipo de organizacion"
            valueLabel={(items) => items.nombre}
            valueSelect={(items) => items.id}
            valueKey={(item) => item}
            ValueSave={setOrganizacionSeleccionada}
          />
          <SelectComponent
            control={control}
            listaObjetos={listaSectores}
            nameSelect="sector"
            inputLabel="Seleccione un sector"
            valueLabel={(items) => items.nombreSector}
            valueSelect={(items) => items.id}
            valueKey={(item) => item}
            ValueSave={setSectorSeleccionado}
          />
        </section>
        <section className="mt-4">
          <Controller
            name="localizador"
            control={control}
            rules={{ required: "Este campo es obligatorio", minLength: 3 }}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                defaultValue={ubicacionSeleccionada.localizador}
                label="Ingrese un numero de localizador"
                error={!!errors.nombreJefe}
                helperText={errors.localizador?.message}
                variant="outlined"
              />
            )}
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
