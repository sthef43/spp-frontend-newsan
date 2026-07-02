import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { IDotacion } from "../../models/IDotacion";
import { Button } from "@mui/material";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { DotacionModeloSliceRequests } from "app/Middleware/reducers/DotacionModeloSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { IDotacionModelo } from "../../models/IDotacionModelo";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { DotacionSliceRequests } from "app/Middleware/reducers/DotacionSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  dotacionSeleccionada: IDotacion;
  refreshTable: (newValue: IDotacion[]) => void;
  datosDates: any;
}

export const EditarDotacionModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  dotacionSeleccionada,
  refreshTable,
  datosDates
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [modeloSeleccionado, setModeloSeleccionado] = useState<string | number>(dotacionSeleccionada.dotacionModeloId);

  const [listaModelo, setListaModelo] = useState<IDotacionModelo[]>([]);
  FetchApi<IDotacionModelo[]>(DotacionModeloSliceRequests.getAllRequest, null, false, openModal, setListaModelo);

  const editarDotacion = async (data) => {
    const nuevaDotacion = generarNuevaDotacion(data);

    delete nuevaDotacion.dotacionModelo;
    delete nuevaDotacion.dotacionTotales;
    delete nuevaDotacion.lineaProduccion;
    delete nuevaDotacion.proveedores;

    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(DotacionSliceRequests.PutRequest(nuevaDotacion)));
      if (response) {
        const refreshTableDotacion = unwrapResult(await dispatch(DotacionSliceRequests.GetAllByDates(datosDates)));
        refreshTable(refreshTableDotacion);
        openNotificationUI("Se edito correctamente la dotacion", "success");
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarNuevaDotacion = (formData: any) => {
    try {
      const nuevaDotacion: IDotacion = {
        ...dotacionSeleccionada,
        dotacionModeloId: modeloSeleccionado as number,
        ritmoPauta: formData.ritmoPauta,
        ritmoPlan: formData.ritmoPlan,
        eficiencia: formData.eficiencia,
        turnoMontaje: formData.turnoMontaje
      };

      if (nuevaDotacion != null) {
        return nuevaDotacion;
      }
    } catch (error) {
      openNotificationUI(`Se genero un error: ${error}`, "error");
    }
  };

  return (
    <main className="w-[85vw]">
      <form onSubmit={handleSubmit(editarDotacion)} className="flex flex-col gap-y-4 w-full">
        <div className="flex flex-row gap-x-4 justify-between w-full">
          <SelectComponent
            inputLabel="Seleccione un modelo"
            listaObjetos={listaModelo}
            nameSelect="modelo"
            control={control}
            valueKey={(value) => value}
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            defaultValue={dotacionSeleccionada.dotacionModelo.id.toString()}
            ValueSave={setModeloSeleccionado}
          />
        </div>
        <div className="flex flex-row justify-center gap-x-4 w-full">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Ingrese el ritmo de pauta"
            nameInput="ritmoPauta"
            valueDefault={dotacionSeleccionada.ritmoPauta.toString()}
            typeDate="text"
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Ingrese el ritmo de plan"
            nameInput="ritmoPlan"
            valueDefault={dotacionSeleccionada.ritmoPlan.toString()}
            typeDate="text"
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={2}
            labelInput="Ingrese los turnos de montaje"
            nameInput="turnoMontaje"
            valueDefault={
              dotacionSeleccionada.turnoMontaje !== null ? dotacionSeleccionada.turnoMontaje.toString() : "0"
            }
            typeDate="text"
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={3}
            labelInput="Ingrese la eficiencia de montaje"
            nameInput="eficiencia"
            valueDefault={dotacionSeleccionada.eficiencia !== null ? dotacionSeleccionada.eficiencia.toString() : "0"}
            typeDate="text"
            requiredBool
            errors={errors}
          />
        </div>
        <div className="flex flex-row w-full justify-center mt-4 gap-x-2">
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
      </form>
    </main>
  );
};
