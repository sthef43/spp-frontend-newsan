import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import FetchApi from "app/shared/helpers/FetchApi";
import { CLISectoresSliceRequest } from "app/features/cli/Middlewares/CliSectoresSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { CLIContenedorItemsSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsSlice";
import { CLIContenedorItemsRecepcionBloqSliceRequest } from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { IBateasDTO } from "../../models/IBateasDTO";
import { CLIUbicacionSectoresSliceRequest } from "app/features/cli/Middlewares/CLIUbiacacionSectorSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICLISectores } from "app/features/cli/Models/ICLISectores";
import { ICLIContenedorItemsRecepcionBloq } from "app/features/cli/Models/ICLIContenedorItemsRecepcionBloq";
import { ICLIUbicacionSector } from "app/features/cli/Models/ICLIUbicacionSector";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const TransferirPlacasModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { control, handleSubmit } = useForm();

  const contenedor = useAppSelector((state) => state.cliContenedorItems.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPut, FetchPost } = useFetchApiMultiResults();

  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | number>(0);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string | number>(0);

  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, openModal, setListaSectores, true);

  const [cantidadPlacas, setCantidadPlacas] = useState(0);
  FetchApi(
    TrazaOperacionesSliceRequests.GetAllCountTracesByContainerId,
    contenedor.id,
    false,
    openModal,
    setCantidadPlacas
  );

  const [listaBateas, setListaBateas] = useState<IBateasDTO[]>([]);
  FetchApi<IBateasDTO[]>(
    TrazaOperacionesSliceRequests.GetAllPuntIntoContainerById,
    contenedor.id,
    false,
    openModal,
    setListaBateas,
    true
  );

  const [listaUbicaciones, setListaUbicaciones] = useState<ICLIUbicacionSector[]>([]);
  FetchApi<ICLIUbicacionSector[]>(
    CLIUbicacionSectoresSliceRequest.getAllWithIdSector,
    sectorSeleccionado,
    false,
    sectorSeleccionado,
    setListaUbicaciones,
    true
  );

  const onSubmit = () => {
    const sectorActualizado = { ...contenedor, cliUbicacionesSectoresId: ubicacionSeleccionada as number };
    delete sectorActualizado.cliSectores;
    FetchPut({
      consoleLog: false,
      sliceRequest: CLIContenedorItemsSliceRequest.PutRequest,
      modelPut: sectorActualizado,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: "Seguro que desea transferir todas las placas al sector seleccionado?",
      titleUser: "Transferir Contenedor",
      functionAdd: async () => {
        await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("PROD"));
        crearEsperaRepecion();
        actulizarBloqueActual();
        openNotificationUI("Se transfirio la lpn con exito", "success");
        setOpenModal(false);
      }
    });
  };

  const crearEsperaRepecion = async () => {
    const response = unwrapResult(await dispatch(CLISectoresSliceRequest.getByIdRequest(sectorSeleccionado as number)));
    const nuevoBlque: ICLIContenedorItemsRecepcionBloq = {
      cliContenedorItemsId: contenedor.id,
      recepcion: response.nombreSector.toLowerCase().includes("produ") ? "Sin Recepcion" : "",
      cliSectoresId: sectorSeleccionado as number
    };
    FetchPost(CLIContenedorItemsRecepcionBloqSliceRequest.PostRequest, nuevoBlque, false, null);
  };

  const actulizarBloqueActual = async () => {
    const response = unwrapResult(
      await dispatch(
        CLIContenedorItemsRecepcionBloqSliceRequest.GetContenedorBloqBySectorAndContenedorId({
          sectorId: contenedor.cliSectoresId,
          contenedorId: contenedor.id
        })
      )
    );
    const bloqueClon: ICLIContenedorItemsRecepcionBloq = {
      ...response,
      recepcion: "En Transito"
    };
    FetchPut({
      consoleLog: false,
      modelPut: bloqueClon,
      activeConfirmation: false,
      sliceRequest: CLIContenedorItemsRecepcionBloqSliceRequest.PutRequest
    });
  };

  console.log(contenedor);

  return (
    <>
      {listaBateas && listaBateas.length > 0 && (
        <main className="w-[65vw]">
          <section className="flex flex-row w-full justify-between items-center gap-x-6 mb-5">
            <TextFieldComponent
              control={control}
              index={0}
              labelInput="Cantidad Bateas"
              nameInput="bateas"
              valueDefault={listaBateas.length.toString()}
              typeInput="standard"
              disabled
            />
            <TextFieldComponent
              control={control}
              index={0}
              labelInput="Cantidad Placas"
              nameInput="placas"
              valueDefault={cantidadPlacas.toString()}
              typeInput="standard"
              disabled
            />
            <TextFieldComponent
              control={control}
              index={0}
              labelInput="Numero OP"
              nameInput="op"
              valueDefault={contenedor.numeroOp.toString()}
              typeInput="standard"
              disabled
            />
          </section>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col">
            <div className="w-full flex flex-row justify-between items-center gap-x-6">
              <TextFieldComponent
                control={control}
                index={0}
                labelInput="Sector Actual"
                nameInput="sectorActual"
                valueDefault={contenedor.cliContenedorItemsRecepcionBloq.at(-1).cliSectores.nombreSector}
                disabled
              />
              <figure>
                <KeyboardDoubleArrowRight />
              </figure>
              <SelectComponent
                inputLabel="Seleccione un sector"
                listaObjetos={listaSectores}
                nameSelect="sectorTransferir"
                valueLabel={(value) => value.nombreSector}
                valueSelect={(value) => value.id}
                control={control}
                valueKey={(value) => value}
                ValueSave={setSectorSeleccionado}
              />
              {listaUbicaciones && listaUbicaciones.length > 0 && (
                <>
                  <figure>
                    <KeyboardDoubleArrowRight />
                  </figure>
                  <SelectComponent
                    inputLabel="Ubicacion a tranferir"
                    listaObjetos={listaUbicaciones}
                    nameSelect="ubicacion"
                    valueLabel={(value) => value.localizador}
                    valueSelect={(value) => value.id}
                    control={control}
                    valueKey={(value) => value}
                    ValueSave={setUbicacionSeleccionada}
                  />
                </>
              )}
            </div>
            <FormButtons
              onCancel={() => {
                setOpenModal(false);
              }}
              disabled={ubicacionSeleccionada === 0}
            />
          </form>
        </main>
      )}
    </>
  );
};
