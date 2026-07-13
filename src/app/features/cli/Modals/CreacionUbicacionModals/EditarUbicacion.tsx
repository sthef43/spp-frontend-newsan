import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useAppDispatch } from "app/core/store/store";
import { ICLIOrganizacion } from "../../Models/ICLIOrganizacion";
import { ICLITipoUBC } from "../../Models/ICLITipoUBC";
import { ICLIUbicacionSector } from "../../Models/ICLIUbicacionSector";
import { ICLISectores } from "../../Models/ICLISectores";
import { CLIOrganizacionSliceRequest } from "../../Middlewares/CLIOrganizacionSlice";
import { CLITipoUBCSliceRequests } from "../../Middlewares/CLITipoUBCSlice";
import { CLIUbicacionSectoresSliceRequest } from "../../Middlewares/CLIUbiacacionSectorSlice";
import { CLISectoresSliceRequest } from "../../Middlewares/CliSectoresSlice";
import { unwrapResult } from "@reduxjs/toolkit";

interface Props {
  refreshLista: (newvalue: ICLIUbicacionSector[]) => void;
  setOpenModal: (newValue: boolean) => void;
  ubicacionSeleccionada: ICLIUbicacionSector;
  openModal: boolean;
}

interface IFormData {
  localizador: string;
  ubc: string | number;
  organizacion: string | number;
  sector: string | number;
}

const defaultValues: IFormData = {
  localizador: "",
  ubc: "",
  organizacion: "",
  sector: ""
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const EditarUbicacion: React.FC<Props> = ({ refreshLista, setOpenModal, ubicacionSeleccionada, openModal }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid }
  } = useForm<IFormData>({ defaultValues });

  const dispatch = useAppDispatch();
  const { FetchPut } = useFetchApiMultiResults();
  const buttonClases = MaterialButtons();

  // Los valores de los selects se manejan mediante react-hook-form

  const [listaUBC, setListaUBC] = useState<ICLITipoUBC[]>([]);
  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  const [listaOrganizacion, setListaOrganizacion] = useState<ICLIOrganizacion[]>([]);

  FetchApi<ICLITipoUBC[]>(CLITipoUBCSliceRequests.getAllRequest, null, false, null, setListaUBC);

  FetchApi<ICLIOrganizacion[]>(CLIOrganizacionSliceRequest.getAllRequest, null, false, null, setListaOrganizacion);

  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, openModal, setListaSectores, true);

  const onSubmit = async (data: IFormData) => {
    const nuevoObjeto: ICLIUbicacionSector = {
      ...ubicacionSeleccionada,
      localizador: data.localizador,
      cliTipoUBCId: Number(data.ubc),
      cliOrganizacionId: Number(data.organizacion),
      cliSectoresId: Number(data.sector)
    };
    delete nuevoObjeto.cliTipoUBC;
    delete nuevoObjeto.cliOrganizacion;

    FetchPut({
      sliceRequest: CLIUbicacionSectoresSliceRequest.PutRequest,
      modelPut: nuevoObjeto,
      consoleLog: false,
      activeConfirmation: true,
      titleUser: "Actualizar ubicación",
      messageUser: "¿Está seguro de que desea actualizar esta ubicación?",
      functionAdd: async () => {
        const responseRefresh = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.getAllRequest()));
        if (responseRefresh) {
          refreshLista(responseRefresh)
          setOpenModal(false);
        }
      }
    });
  };

  return (
    <main className="w-[45vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="flex flex-row gap-x-4 w-full">
          <SelectComponentForm
            control={control}
            listItems={listaUBC}
            name="ubc"
            label="Seleccione un tipo de UBC"
            valueLabel={(items) => items.nombre}
            valueSelect={(items) => items.id}
            rules={{ required: "Este campo es obligatorio", validate: (value) => Number(value) > 0 || "Debe seleccionar una opción válida" }}
          />
          <SelectComponentForm
            control={control}
            listItems={listaOrganizacion}
            name="organizacion"
            label="Seleccione un tipo de organizacion"
            valueLabel={(items) => items.nombre}
            valueSelect={(items) => items.id}
            rules={{ required: "Este campo es obligatorio", validate: (value) => Number(value) > 0 || "Debe seleccionar una opción válida" }}
          />
          <SelectComponentForm
            control={control}
            listItems={listaSectores}
            name="sector"
            label="Seleccione un sector"
            valueLabel={(items) => items.nombreSector}
            valueSelect={(items) => items.id}
            rules={{ required: "Este campo es obligatorio", validate: (value) => Number(value) > 0 || "Debe seleccionar una opción válida" }}
          />
        </section>
        <section className="mt-4">
          <InputComponentForm
            name="localizador"
            control={control}
            rules={{ required: "Este campo es obligatorio", minLength: 3 }}
            label="Ingrese un numero de localizador"
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
