/* eslint-disable unused-imports/no-unused-vars */
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { DotacionModeloSliceRequests } from "app/Middleware/reducers/DotacionModeloSlice";
import { DotacionSliceRequests } from "app/Middleware/reducers/DotacionSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { DatePickerComponent } from "app/features/tickets/components/DatePickerComponent";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IDotacion } from "../../models/IDotacion";
import { IDotacionModelo } from "../../models/IDotacionModelo";
import { IDotacionTotales } from "../../models/IDotacionTotales";
import { DotacionTotalesSliceRequest } from "../../reducers/DotacionTotalesSlice";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  datosDates: any;
  refreshTable: (newValue: IDotacion[]) => void;
}

export const CrearNuevaDotacionModal: React.FC<Props> = ({ openModal, setOpenModal, datosDates, refreshTable }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [modeloSeleccionado, setModeloSeleccionado] = useState<string | number>(0);
  const [potenciaSeleccionada, setPotenciaSeleccionada] = useState<string | number>(0);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);
  const [fechaDotacion, setFechaDotacion] = useState("");

  const [listaModelo, setListaModelo] = useState<IDotacionModelo[]>([]);
  FetchApi<IDotacionModelo[]>(DotacionModeloSliceRequests.getAllRequest, null, false, openModal, setListaModelo);

  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, openModal, setListaPlantas);

  const agregarDotacion = async (data) => {
    const nuevaDotacion = generarNuevaDotacion(data);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(DotacionSliceRequests.PostNewDotacionWithNotExist(nuevaDotacion)));
      if (response) {
        const totales = generarNuevosTotales(response);
        const responseTotales = unwrapResult(await dispatch(DotacionTotalesSliceRequest.PostRequest(totales)));
        if (responseTotales) {
          const refreshTableDotacion = unwrapResult(await dispatch(DotacionSliceRequests.GetAllByDates(datosDates)));
          refreshTable(refreshTableDotacion);
          setOpenModal(false);
          openNotificationUI("Se genero una nueva dotacion", "success");
        }
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
        dotacionModeloId: modeloSeleccionado as number,
        ritmoPauta: formData.ritmoPauta,
        ritmoPlan: formData.ritmoPlan,
        dotacionGrupoSectoresId: 7,
        createdDate: fechaDotacion,
        turnoMontaje: formData.turnosMontaje,
        eficiencia: formData.eficienciaMontaje,
        sumatoriaTotal: 0
      };
      if (nuevaDotacion != null) {
        return nuevaDotacion;
      }
    } catch (error) {
      openNotificationUI(`Se genero un error: ${error}`, "error");
    }
  };

  const generarNuevosTotales = (responseDotacion: IDotacion) => {
    try {
      const nuevosTotales: IDotacionTotales = {
        dotacionId: responseDotacion.id,
        hrUeMañana: 0,
        hrUeTarde: 0,
        hrUiMañana: 0,
        hrUiTarde: 0,
        lrUeFlexMañana: 0,
        lrUeFlexTarde: 0,
        lrUiMañana: 0,
        lrUiTarde: 0,
        piso: "",
        turno: ""
      };

      if (nuevosTotales != null) {
        return nuevosTotales;
      }
    } catch (error) {
      openNotificationUI(`Se genero un error ${error}`, "warning");
    }
  };

  return (
    <main className="w-[85vw]">
      <form onSubmit={handleSubmit(agregarDotacion)} className="flex flex-col gap-y-4 w-full">
        <div className="flex flex-row gap-x-4 justify-between w-full">
          <SelectComponent
            inputLabel="Seleccione una planta"
            listaObjetos={listaPlantas}
            nameSelect="planta"
            control={control}
            valueKey={(value) => value}
            valueLabel={(value) => value.name}
            valueSelect={(value) => value.id}
            ValueSave={setPlantaSeleccionada}
          />
          <SelectComponent
            inputLabel="Seleccione un modelo"
            listaObjetos={listaModelo}
            nameSelect="modelo"
            control={control}
            valueKey={(value) => value}
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            ValueSave={setModeloSeleccionado}
          />
        </div>
        <div className="flex flex-row justify-center gap-x-4 w-full">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Ingrese el ritmo de pauta"
            nameInput="ritmoPauta"
            valueDefault=""
            typeDate="text"
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Ingrese el ritmo de plan"
            nameInput="ritmoPlan"
            valueDefault=""
            typeDate="text"
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={2}
            labelInput="Ingrese los turnos de montaje"
            nameInput="turnosMontaje"
            valueDefault=""
            typeDate="text"
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            control={control}
            index={3}
            labelInput="Ingrese la eficiencia de montaje"
            nameInput="eficienciaMontaje"
            valueDefault=""
            typeDate="text"
            requiredBool
            errors={errors}
          />
        </div>
        <DatePickerComponent setDatePickerValue={setFechaDotacion} />
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
