import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ICLIOrganizacion } from "../../Models/ICLIOrganizacion";
import { ICLITipoUBC } from "../../Models/ICLITipoUBC";
import { ICLIUbicacionSector } from "../../Models/ICLIUbicacionSector";
import { CLIOrganizacionSliceRequest } from "../../Middlewares/CLIOrganizacionSlice";
import { CLITipoUBCSliceRequests } from "../../Middlewares/CLITipoUBCSlice";
import { CLIUbicacionSectoresSliceRequest } from "../../Middlewares/CLIUbiacacionSectorSlice";
import { unwrapResult } from "@reduxjs/toolkit";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshList: (newValue: ICLIUbicacionSector[]) => void;
}

interface IFormData {
  localizador: string;
  UBC: string | number;
  Organizacion: string | number;
  estado: string | number;
}

const defaultValues: IFormData = {
  localizador: "",
  UBC: "",
  Organizacion: "",
  estado: ""
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AgregarUbicacion: React.FC<Props> = ({ setOpenModal, refreshList }) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { isValid }
  } = useForm<IFormData>({ defaultValues });

  const ubicaciones = useAppSelector((state) => state.cliUbicacionSectores.dataAll as ICLIUbicacionSector[]);

  const localizadorValue = watch("localizador");

  const dispatch = useAppDispatch();
  const { FetchPost } = useFetchApiMultiResults();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const estado = [
    { id: 1, estado: "Activo" },
    { id: 0, estado: "Inactivo" }
  ];

  const [listaUBC, setListaUBC] = useState<ICLITipoUBC[]>([]);
  const [listaOrganizacion, setListaOrganizacion] = useState<ICLIOrganizacion[]>([]);

  FetchApi<ICLITipoUBC[]>(CLITipoUBCSliceRequests.getAllRequest, null, false, null, setListaUBC);

  FetchApi<ICLIOrganizacion[]>(CLIOrganizacionSliceRequest.getAllRequest, null, false, null, setListaOrganizacion);

  const onSubmit = async (data: IFormData) => {
    const buscarLocalizador = localizadorEncontrado();
    if (buscarLocalizador) {
      openNotificationUI("El localizador ingresado ya se encuentra", "error");
    } else {
      const nuevoObjeto: ICLIUbicacionSector = {
        localizador: data.localizador,
        cliTipoUBCId: Number(data.UBC),
        cliOrganizacionId: Number(data.Organizacion),
        estado: data.estado === 1 ? true : false
      };

      if (
        await getConfirmation(
          "Agregar ubicación",
          "¿Está seguro de que desea agregar esta ubicación?",
          null,
          "Agregar",
          "Cancelar"
        )
      ) {
        FetchPost(
          CLIUbicacionSectoresSliceRequest.PostRequest,
          nuevoObjeto,
          false,
          async () => {
            const responseRefresh = unwrapResult(await dispatch(CLIUbicacionSectoresSliceRequest.getAllRequest()));
            if (responseRefresh) {
              openNotificationUI("Se agrego la ubicacion correctamente", "success");
              refreshList(responseRefresh);
              setOpenModal(false);
            }
          }
        );
      }
    }
  };

  const localizadorEncontrado = () => {
    const buscarLocalizador = ubicaciones.some((elementos) => {
      return localizadorValue == elementos.localizador;
    });
    if (buscarLocalizador != null) {
      return buscarLocalizador;
    }
  };

  return (
    <main className="w-[45vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="flex flex-row gap-x-4">
          <SelectComponentForm
            control={control}
            listItems={listaUBC}
            name="UBC"
            label="Seleccione un tipo de UBC"
            valueLabel={(item) => item.nombre}
            valueSelect={(item) => item.id}
            rules={{ required: "Este campo es obligatorio", validate: (value) => Number(value) > 0 || "Debe seleccionar una opción válida" }}
          />
          <SelectComponentForm
            control={control}
            listItems={listaOrganizacion}
            name="Organizacion"
            label="Seleccione una organizacion"
            valueLabel={(item) => item.nombre}
            valueSelect={(item) => item.id}
            rules={{ required: "Este campo es obligatorio", validate: (value) => Number(value) > 0 || "Debe seleccionar una opción válida" }}
          />
        </section>
        <section className="flex flex-row gap-x-4 mt-4">
          <InputComponentForm
            name="localizador"
            control={control}
            rules={{ required: "Este campo es obligatorio", minLength: 3 }}
            label="Ingrese el numero de localizador"
          />
        </section>
        <section className="mt-4">
          <SelectComponentForm
            control={control}
            listItems={estado}
            name="estado"
            label="Seleccione un estado"
            valueLabel={(item) => item.estado}
            valueSelect={(item) => item.id}
            rules={{ required: "Este campo es obligatorio", validate: (value) => Number(value) > 0 || "Debe seleccionar una opción válida" }}
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
