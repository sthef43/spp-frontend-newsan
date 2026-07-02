import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { IOperator, IPlant, ITurno } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  operatorSeleccionado: IOperator;
  refreshList: (newValue: IOperator[]) => void;
}

export const EditarOperatorModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  operatorSeleccionado,
  refreshList
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();

  const [turnos, setTurnos] = useState<ITurno[]>([]);
  FetchApi<ITurno[]>(TurnoSliceRequests.getAllRequest, null, false, openModal, setTurnos, true);

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, openModal, setPlantas, true);

  const actualizarOperator = async (data) => {
    const operatorActualizado = generarNuevosDatosOperator(data);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OperatorSliceRequests.PutRequest(operatorActualizado)));
      if (response) {
        const refreshOperators = unwrapResult(await dispatch(OperatorSliceRequests.getListOperator()));
        refreshList(refreshOperators);
        openNotificationUI("Se actualizaron los datos del operario", "success");
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarNuevosDatosOperator = (data) => {
    try {
      const nuevosDatosOperator: IOperator = {
        ...operatorSeleccionado,
        name: data.nombre,
        surname: data.apellido,
        turnoId: data.turno,
        plantaId: data.planta
      };

      delete nuevosDatosOperator.planta;
      delete nuevosDatosOperator.turno;
      delete nuevosDatosOperator.appUser;

      if (nuevosDatosOperator != null) {
        return nuevosDatosOperator;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Ocurrio el error: ${error}`, "error");
    }
  };

  return (
    <main className="w-[70vw] flex flex-col justify-between">
      <form onSubmit={handleSubmit(actualizarOperator)} className="flex flex-col w-full">
        <div className="flex flex-row w-full justify-between gap-x-4">
          <TextFieldComponent
            nameInput="nombre"
            control={control}
            index={0}
            labelInput="Nombre"
            valueDefault={operatorSeleccionado.name}
            requiredBool
            errors={errors}
            typeInput="standard"
          />
          <TextFieldComponent
            nameInput="apellido"
            control={control}
            index={1}
            labelInput="Apellido"
            valueDefault={operatorSeleccionado.surname}
            requiredBool
            errors={errors}
            typeInput="standard"
          />
          <TextFieldComponent
            nameInput="position"
            control={control}
            index={2}
            labelInput="Posicion"
            valueDefault={operatorSeleccionado.position}
            requiredBool
            errors={errors}
            typeInput="standard"
          />
          <SelectComponent
            nameSelect="turno"
            inputLabel="Turno"
            listaObjetos={turnos}
            control={control}
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            defaultValue={operatorSeleccionado.turno.id.toString()}
            valueKey={(value) => value}
            varianteEstilo="standard"
          />
          <SelectComponent
            nameSelect="planta"
            inputLabel="Planta"
            listaObjetos={plantas}
            control={control}
            valueLabel={(value) => value.name}
            valueSelect={(value) => value.id}
            defaultValue={operatorSeleccionado.planta.id.toString()}
            valueKey={(value) => value}
            varianteEstilo="standard"
          />
        </div>
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
