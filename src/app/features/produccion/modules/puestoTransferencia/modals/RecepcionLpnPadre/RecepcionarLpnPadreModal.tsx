import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import FetchApi from "app/shared/helpers/FetchApi";
import {
  CLIContenedorItemsRecepcionBloqSlice,
  CLIContenedorItemsRecepcionBloqSliceRequest
} from "app/features/cli/Middlewares/CLIContenedorItemsRecepcionBloqSlice";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { IAppUser } from "app/models";
import { MensajeRechazoModal } from "./MensajeRechazoModal";
import { MotivoRechazoModal } from "./MotivoRechazoModal";
import { ICLIContenedorItemsRecepcionBloq } from "app/features/cli/Models/ICLIContenedorItemsRecepcionBloq";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const RecepcionarLpnPadreModal: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const contenedor = useAppSelector((state) => state.cliContenedorItems.object);
  const recepciones = useAppSelector(
    (state) => state.cliContenedorItemsRecepcionBloq.dataAll as ICLIContenedorItemsRecepcionBloq[]
  );
  const numeroRecepcion = useAppSelector(
    (state) => state.cliContenedorItemsRecepcionBloq.cantidadRecepciones as number
  );
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();
  const { FetchPut } = useFetchApiMultiResults();
  const dispatch = useAppDispatch();

  const [openModalMensajeRechazo, setOpenModalMensajeRechazo] = useState(false);
  const [openModalMostarMotivoRechazo, setOpenModalMostrarMotivoRechazo] = useState(false);

  FetchApi<ICLIContenedorItemsRecepcionBloq[]>(
    CLIContenedorItemsRecepcionBloqSliceRequest.GetAllReceptionByContenedorId,
    contenedor.id,
    false,
    openModal,
    null,
    true
  );

  FetchApi<number>(
    CLIContenedorItemsRecepcionBloqSliceRequest.GetLastContainerReceived,
    contenedor.id,
    false,
    openModal,
    null,
    true
  );

  const marcarComoRecepcionado = async (opcionRecepcion: string) => {
    const { clonConDelete, clonSinDelete, recepcionAnterior } = buscarLpnNoRecepcionado(opcionRecepcion);
    if (clonSinDelete.recepcion === "Inicio") {
      openNotificationUI("El contenedor no paso por fin", "warning");
    } else {
      FetchPut({
        consoleLog: false,
        sliceRequest: CLIContenedorItemsRecepcionBloqSliceRequest.PutRequest,
        modelPut: clonConDelete,
        activeConfirmation: true,
        mensajePersonalizado: true,
        titleUser: opcionRecepcion === "Recepcionado" ? "Recepcionar LPN" : "Rechzar LPN",
        messageUser:
          opcionRecepcion === "Recepcionado"
            ? "Desea marcar como recepcionado el LPN?"
            : "Desea marcar como rechazado el LPN?",
        functionAdd: async () => {
          const recepcionActualCondicional = numeroRecepcion + 1;
          if (recepciones.length !== recepcionActualCondicional) {
            console.log("Se ejecuto encontro una siguiente recepcion");
            await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.PutRequest(recepcionAnterior));
          }
          await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.GetLastContainerReceived(contenedor.id));
          await dispatch(CLIContenedorItemsRecepcionBloqSliceRequest.GetAllReceptionByContenedorId(contenedor.id));
          openNotificationUI(
            `Se actualizo el estado de la recepcion de '${clonSinDelete.cliSectores.nombreSector}' al estado de: ${opcionRecepcion}`,
            `${opcionRecepcion === "Rechazado" ? "warning" : "success"}`
          );
          if (opcionRecepcion === "Rechazado") {
            dispatch(CLIContenedorItemsRecepcionBloqSlice.actions.setObject(clonConDelete));
            setOpenModalMensajeRechazo(true);
          }
        }
      });
    }
  };

  const buscarLpnNoRecepcionado = (opcionRecepcion: string) => {
    let lpnRecepcionado: ICLIContenedorItemsRecepcionBloq;
    let lpnSinDelete: ICLIContenedorItemsRecepcionBloq;
    try {
      lpnRecepcionado = recepciones.find((elementos) => {
        return elementos.recepcion !== "";
      });
      lpnSinDelete = lpnRecepcionado;
      const indexRecepcionActual = recepciones.findIndex((elementos) => elementos.id === lpnRecepcionado.id);
      const recepcionAnterior = recepciones[indexRecepcionActual + 1];

      const recepcionAnteriorFormateado: ICLIContenedorItemsRecepcionBloq = {
        ...recepcionAnterior,
        recepcion: "Inicio"
      };
      const clonLpnRecepcionado: ICLIContenedorItemsRecepcionBloq = {
        ...lpnRecepcionado,
        recepcion: opcionRecepcion,
        operatorId: infoUser.operatorId
      };

      delete clonLpnRecepcionado.cliContenedorItems;
      delete clonLpnRecepcionado.cliSectores;
      delete recepcionAnteriorFormateado.cliSectores;
      delete recepcionAnteriorFormateado.cliContenedorItems;

      if (clonLpnRecepcionado !== null) {
        return {
          clonConDelete: clonLpnRecepcionado,
          clonSinDelete: lpnSinDelete,
          recepcionAnterior: recepcionAnteriorFormateado
        };
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`No se encontro un LPN no recepcionado: ${error}`, "error");
    }
  };

  const handleOpenModalMotivoRechazo = (recepcion: ICLIContenedorItemsRecepcionBloq) => {
    dispatch(CLIContenedorItemsRecepcionBloqSlice.actions.setObject(recepcion));
    setOpenModalMostrarMotivoRechazo(true);
  };

  return (
    <>
      {recepciones && recepciones.length > 0 && (
        <main className="w-[70vw] flex flex-col items-center">
          {recepciones && recepciones.length > 0 && (
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={numeroRecepcion} alternativeLabel>
                {recepciones.map((label, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: { error?: boolean } = {};
                  if (label.recepcion === "Recepcionado") {
                    stepProps.completed = true;
                    labelProps.error = false;
                  }
                  if (label.recepcion === "Rechazado") {
                    stepProps.completed = true;
                    labelProps.error = true;
                  }
                  return (
                    <Step key={index} {...stepProps}>
                      <StepLabel
                        sx={labelProps.error === true ? { cursor: "pointer" } : {}}
                        onClick={() => {
                          labelProps.error == true ? handleOpenModalMotivoRechazo(label) : null;
                        }}
                        {...labelProps}>
                        {label.cliSectores.nombreSector}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {numeroRecepcion !== recepciones.length && (
                <React.Fragment>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      pt: 2,
                      gap: 4,
                      justifyContent: "center",
                      marginTop: 2
                    }}>
                    <Box />
                    <Button
                      disabled={recepciones.length === numeroRecepcion}
                      className={buttonClases.greenButton}
                      onClick={() => {
                        marcarComoRecepcionado("Recepcionado");
                      }}>
                      Continuar
                    </Button>
                    <Button
                      disabled={numeroRecepcion == 0}
                      className={buttonClases.redButton}
                      onClick={() => {
                        marcarComoRecepcionado("Rechazado");
                      }}>
                      Rechazar
                    </Button>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          )}
          <div className="mt-4">
            <Button
              className={buttonClases.redButton}
              onClick={() => {
                setOpenModal(false);
              }}>
              Atras
            </Button>
          </div>
        </main>
      )}
      <ModalCompoment
        setOpenPopup={setOpenModalMensajeRechazo}
        openPopup={openModalMensajeRechazo}
        title="Ingresar Mensaje de rechazo"
        onCloseDynamic>
        <MensajeRechazoModal setOpenModal={setOpenModalMensajeRechazo} openModal={openModalMensajeRechazo} />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalMostrarMotivoRechazo}
        openPopup={openModalMostarMotivoRechazo}
        title="Motivo Rechazo Recepcion">
        <MotivoRechazoModal setOpenModal={setOpenModalMostrarMotivoRechazo} openModal={openModalMostarMotivoRechazo} />
      </ModalCompoment>
    </>
  );
};
