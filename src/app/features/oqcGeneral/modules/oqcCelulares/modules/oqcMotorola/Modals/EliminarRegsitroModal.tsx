/* eslint-disable unused-imports/no-unused-vars */
import { Button, TextField } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { ContextApp } from "../../../Context/Context";
import { IAppUser } from "app/models";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";

interface Props {
  setOpenModalEliminar: (newValue: boolean) => void;
  muestraEliminada: IOQCDesignadaResultado;
  refresh: () => void;
}

export const EliminarRegistroModal: React.FC<Props> = ({ setOpenModalEliminar, muestraEliminada, refresh }) => {
  const {
    register,
    control,
    watch,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const contextoGlobal = useContext(ContextApp);
  const classes = MaterialButtons();

  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults();

  const watchComentarioBaja = watch("mensajeBaja");

  const senForm = async () => {
    const objectSubmit = generarMuestraEliminad();
    FetchPut({
      consoleLog: false,
      modelPut: objectSubmit,
      sliceRequest: OQCDesignadaResultadoSliceRequests.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      messageUser: "Se eliminara la muestra seleccionada, ¿desea continuar?",
      titleUser: "Eliminar Muestra",
      functionAdd: () => {
        openNotificationUI("Se elimino la muestra con exito", "success");
        refresh();
        contextoGlobal.setEliminarMuestra(false);
        contextoGlobal.setModeloSeleccionadoId(0);
      }
    });
  };

  const generarMuestraEliminad = () => {
    const objectSubmit: IOQCDesignadaResultado = {
      ...muestraEliminada,
      operatorCanceledId: infoUser.operatorId,
      canceled: true,
      canceledComentario: watchComentarioBaja,
      deleted: true
    };
    delete objectSubmit.operator;
    delete objectSubmit.oqcDesignada;
    delete objectSubmit.oqcHallazgoResult;
    delete objectSubmit.oqcPalet;
    delete objectSubmit.operatorCanceled;
    return objectSubmit;
  };

  return (
    <main className="w-[30vw]">
      <form onSubmit={handleSubmit(senForm)}>
        <div>
          <Controller
            name="mensajeBaja"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="mensajeBaja"
                label="Ingrese un comentario de porque es la eliminacion"
                variant="outlined"
                {...register("mensajeBaja", {
                  required: {
                    value: true,
                    message: "Ingrese la causa de eliminacion"
                  }
                })}
              />
            )}
          />
          {errors.mensajeBaja && <p className="text-xs font-semibold text-red-600">{errors.mensajeBaja.message}</p>}
        </div>
        <div className="mt-5 flex justify-center gap-x-7">
          <Button type="submit" className={classes.greenButton}>
            Confirmar
          </Button>
          <Button
            onClick={() => {
              setOpenModalEliminar(false);
            }}
            className={classes.redButton}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
