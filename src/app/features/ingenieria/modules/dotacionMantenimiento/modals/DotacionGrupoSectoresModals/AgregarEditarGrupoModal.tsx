import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React from "react";
import { useForm } from "react-hook-form";
import { IDotacionGrupoSectores } from "../../models/IDotacionGrupoSectores";
import { DotacionGrupoSectoresSliceRequest } from "../../reducers/DotacionGrupoSectoresSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  datosGrupo: any;
  modoEditor: boolean;
  grupoSeleccioado: IDotacionGrupoSectores;
  setListaGrupos: (newValue: IDotacionGrupoSectores[]) => void;
}

export const AgregarEditarGrupoModal: React.FC<Props> = ({
  setOpenModal,
  datosGrupo,
  grupoSeleccioado,
  modoEditor,
  setListaGrupos
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    let response: IDotacionGrupoSectores;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (modoEditor) {
        const nuevoGrupo = { ...grupoSeleccioado, nombre: data.nombreGrupo, detalles: data.detallesGrupo };
        delete nuevoGrupo.plant;
        delete nuevoGrupo.lineaProduccion;
        response = unwrapResult(await dispatch(DotacionGrupoSectoresSliceRequest.PutRequest(nuevoGrupo)));
      }
      if (!modoEditor) {
        const nuevoGrupo = generarNuevoGrupo(data);
        response = unwrapResult(await dispatch(DotacionGrupoSectoresSliceRequest.PostRequest(nuevoGrupo)));
      }
      if (response) {
        const responseGrupos = unwrapResult(
          await dispatch(
            DotacionGrupoSectoresSliceRequest.GetGroupsByPlantAndLineId({
              lineaProduccionId: datosGrupo.lineaProduccionId,
              plantaId: datosGrupo.plantaId
            })
          )
        );
        setListaGrupos(responseGrupos);
        openNotificationUI(`Se ${modoEditor ? "edito" : "añadio"} correctamente el grupo`, "success");
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarNuevoGrupo = (data) => {
    try {
      const nuevoGrupo: IDotacionGrupoSectores = {
        detalles: data.detallesGrupo,
        lineaProduccionId: datosGrupo.lineaProduccionId,
        nombre: data.nombreGrupo,
        plantId: datosGrupo.plantaId
      };

      if (nuevoGrupo != null) {
        return nuevoGrupo;
      }
    } catch (error) {
      openNotificationUI(`Ocurrio un error ${error}`, "error");
    }
  };

  return (
    <main className="w-[60vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-y-4">
        {!modoEditor ? (
          <>
            <TextFieldComponent
              control={control}
              nameInput="nombreGrupo"
              index={0}
              labelInput="Ingrese un nombre"
              valueDefault=""
              requiredBool
              errors={errors}
            />
            <TextFieldComponent
              control={control}
              nameInput="detallesGrupo"
              index={1}
              labelInput="Ingrese los detalles"
              valueDefault=""
              requiredBool
              errors={errors}
            />
            <div className="flex flex-row w-full justify-center mt-2 gap-x-2">
              <div>
                <Button type="submit" disabled={!isValid} className={buttonClases.greenButton}>
                  Guardar
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  className={buttonClases.redButton}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <TextFieldComponent
              control={control}
              nameInput="nombreGrupo"
              index={0}
              labelInput="Ingrese un nombre"
              valueDefault={grupoSeleccioado.nombre}
              requiredBool
              errors={errors}
            />
            <TextFieldComponent
              control={control}
              nameInput="detallesGrupo"
              index={1}
              labelInput="Ingrese los detalles"
              valueDefault={grupoSeleccioado.detalles}
              requiredBool
              errors={errors}
            />
            <div className="flex flex-row w-full justify-center mt-2 gap-x-2">
              <div>
                <Button type="submit" disabled={!isValid} className={buttonClases.greenButton}>
                  Guardar
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  className={buttonClases.redButton}>
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </main>
  );
};
