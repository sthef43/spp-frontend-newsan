/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { ITransferenciaUsuariosProcesos } from "../../models/ITransferenciaUsuariosProcesos";
import FetchApi from "app/shared/helpers/FetchApi";
import { TransferenciaUsuariosProcesosSliceRequest } from "../../slices/TransferenciaUsuariosProcesosSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ITransferenciaUsuariosBloq } from "../../models/ITransferenciaUsuariosBloq";
import { ITransferenciaUsuariosPermitidos } from "../../models/ITransferenciaUsuariosPermitidos";
import { TransferenciaUsuariosBloqSliceRequest } from "../../slices/TransferenciaUsuariosBloqSlice";
import { KeyboardDoubleArrowRightRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { CLISectoresSliceRequest } from "app/features/cli/Middlewares/CliSectoresSlice";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { ICLISectores } from "app/features/cli/Models/ICLISectores";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  usuarioSeleccionado: ITransferenciaUsuariosPermitidos;
}

export const AgregarProcesosUsuarios: React.FC<Props> = ({ setOpenModal, openModal, usuarioSeleccionado }) => {
  const { control, setValue } = useForm();

  const procesoActual = useAppSelector((state) => state.transferenciaUsuariosBloq.object);

  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  const [procesoSeleccionado, setProcesoseleccionado] = useState<string | number>(0);
  const [nuevoProcesoSeleccionado, setNuevoProcesoSeleccionado] = useState<string | number>(0);
  const [sectorSeleccionado, setSectorSeleccionado] = useState<string | number>(0);

  const [procesos, setProcesos] = useState<ITransferenciaUsuariosProcesos[]>([]);
  FetchApi<ITransferenciaUsuariosProcesos[]>(
    TransferenciaUsuariosProcesosSliceRequest.GetAllProcessBySectorId,
    sectorSeleccionado,
    false,
    sectorSeleccionado,
    setProcesos,
    true
  );

  FetchApi<ITransferenciaUsuariosBloq>(
    TransferenciaUsuariosBloqSliceRequest.GetBloqByUsuarioIdAndSectorId,
    { usuarioId: usuarioSeleccionado.id, sectorId: sectorSeleccionado },
    false,
    sectorSeleccionado,
    null,
    true
  );

  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, null, setListaSectores, false);

  const asignarNuevoProceso = async () => {
    const nuevoBloque = generarNuevoProceso();
    FetchPost(TransferenciaUsuariosBloqSliceRequest.PostRequest, nuevoBloque, false, async () => {
      openNotificationUI("Se cargo al usuario el proceso con exito", "success");
      setOpenModal(false);
    });
  };

  const actualizarProcesos = async () => {
    const actualizacion = generarActualizarProcesos();
    FetchPut({
      consoleLog: false,
      modelPut: actualizacion,
      sliceRequest: TransferenciaUsuariosBloqSliceRequest.PutRequest,
      activeConfirmation: false,
      functionAdd: () => {
        openNotificationUI("Se actualizo el puesto del usuario con exito", "success");
        setOpenModal(false);
      }
    });
  };

  const generarNuevoProceso = () => {
    try {
      const nuevoBloque: ITransferenciaUsuariosBloq = {
        cliSectoresId: sectorSeleccionado as number,
        transferenciaUsuariosProcesosId: procesoSeleccionado as number,
        transferenciaUsuariosPermitidosId: usuarioSeleccionado.id
      };
      if (nuevoBloque !== null) {
        return nuevoBloque;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error generando un procesos", "error");
    }
  };

  const generarActualizarProcesos = () => {
    try {
      const actualizacion: ITransferenciaUsuariosBloq = {
        ...procesoActual,
        transferenciaUsuariosProcesosId: nuevoProcesoSeleccionado as number
      };
      delete actualizacion.transferenciaUsuariosProcesos;
      return actualizacion;
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error generando el cambio de proceso", "error");
    }
  };

  useEffect(() => {
    if (procesoActual) {
      setValue("procesoActual", procesoActual.transferenciaUsuariosProcesos.nombre);
      setNuevoProcesoSeleccionado(0);
    }
  }, [procesoActual]);

  return (
    <>
      <section className="w-[45vw]">
        <SelectComponent
          control={control}
          inputLabel="Seleccione un sector"
          listaObjetos={listaSectores}
          nameSelect="sector"
          valueLabel={(value) => value.nombreSector}
          valueSelect={(value) => value.id}
          ValueSave={setSectorSeleccionado}
          valueKey={(value) => value}
        />
        {sectorSeleccionado !== 0 && (
          <section className="mt-4">
            {!procesoActual ? (
              <>
                <SelectComponent
                  control={control}
                  inputLabel="Seleccione un proceso"
                  listaObjetos={procesos}
                  nameSelect="proceso"
                  valueLabel={(value) => value.nombre}
                  valueSelect={(value) => value.id}
                  ValueSave={setProcesoseleccionado}
                  valueKey={(value) => value}
                />
                <div className="flex flex-row items-center justify-center gap-x-4 mt-4">
                  <Button
                    onClick={asignarNuevoProceso}
                    className={buttonClasses.greenButton}
                    disabled={sectorSeleccionado === 0}
                    variant="contained">
                    Guardar
                  </Button>
                  <Button onClick={() => setOpenModal(false)} className={buttonClasses.redButton} variant="contained">
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row justify-between w-full items-center">
                  <TextFieldComponent
                    control={control}
                    index={0}
                    labelInput="Proceso Actual"
                    nameInput="procesoActual"
                    valueDefault=""
                    typeInput="standard"
                    disabled
                  />
                  <figure className="mx-4">
                    <KeyboardDoubleArrowRightRounded />
                  </figure>
                  <SelectComponent
                    control={control}
                    inputLabel="Nuevo Proceso"
                    listaObjetos={procesos}
                    nameSelect="procesoNuevi"
                    valueLabel={(value) => value.nombre}
                    valueSelect={(value) => value.id}
                    ValueSave={setNuevoProcesoSeleccionado}
                    valueKey={(value) => value}
                  />
                </div>
                <div className="flex flex-row items-center justify-center gap-x-4 mt-4">
                  <Button
                    onClick={actualizarProcesos}
                    className={buttonClasses.greenButton}
                    disabled={
                      nuevoProcesoSeleccionado === 0 ||
                      procesoActual.transferenciaUsuariosProcesosId == nuevoProcesoSeleccionado
                    }
                    variant="contained">
                    Guardar
                  </Button>
                  <Button onClick={() => setOpenModal(false)} className={buttonClasses.redButton} variant="contained">
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </section>
        )}
      </section>
    </>
  );
};
