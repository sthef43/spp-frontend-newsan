/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import { OptionFormSlice } from "../../reducers/OptionFormReducers";
import { IPlanProdSppEstadoEmbarque } from "../../models/IPlanProdSppEstadoEmbarque";
import FetchApi from "app/shared/helpers/FetchApi";
import { PlanProdSppEstadoEmbarquesSliceRequest } from "../../reducers/PlanProdSppEstadoEmbarquesSlice";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { IPlanProdSpp } from "../../models/IPlanProdSpp";
import { PlanProdSppEmbarqueSlice } from "../../reducers/PlanProdSppEmbarqueSlice";
import { IPlanProdSppEmbarque } from "../../models/IPlanProdSppEmbarque";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { StatesFormModalsSlice } from "../../reducers/StatesForModalsSlice";

interface Props {
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  resetFather: UseFormReset<FieldValues>;
  errosFather: FieldErrors<FieldValues>;
  watchFather?: UseFormWatch<FieldValues>;
  setOpenNuevoEmbarque: (newValue: boolean) => void;
  setOpenModalAsignarEmbarque: (newValue: boolean) => void;
  setValueEstado: (newValue: string | number) => void;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const DatosExtrasComponent: React.FC<Props> = ({
  controlFather,
  setValuesFather,
  watchFather,
  resetFather,
  errosFather,
  setOpenNuevoEmbarque,
  setOpenModalAsignarEmbarque,
  setValueEstado
}) => {
  const dispatch = useAppDispatch();
  const fechaActual = moment().toDate();

  const listaEstadosParaPlan = ["Liberado", "En Aduana", "Sin Liberar"];

  const estadoFormularios = useAppSelector((state) => state.optionForm.dataAll);
  const listaEmbarques = useAppSelector((state) => state.planProdSppEmbarques.preCarga);
  const planProduccionEdit = useAppSelector((state) => state.planProdSpp.object as IPlanProdSpp);
  const edicionState = useAppSelector((state) => state.optionForm.estadoEdicion);

  const [fechaSeleccionadaSelect, setFechaSeleccionadaSelect] = useState(null);
  const [fechaSeleccionadaMesNombre, setFechaSeleccionadaMesNombre] = useState(null);

  //HAGO LA PETICION PARA TODOS LOS ESTADOS DE LOS EMBARQUES
  const [estadosEmbarques, setEstadosEmbarques] = useState<IPlanProdSppEstadoEmbarque[]>([]);
  FetchApi<IPlanProdSppEstadoEmbarque[]>(
    PlanProdSppEstadoEmbarquesSliceRequest.getAllRequest,
    null,
    false,
    null,
    setEstadosEmbarques,
    false
  );

  const handleEditEmbarque = (embarque: IPlanProdSppEmbarque) => {
    setOpenNuevoEmbarque(true);
    dispatch(OptionFormSlice.actions.setModeEditionEmbarque(true));
    dispatch(PlanProdSppEmbarqueSlice.actions.setEmbarque(embarque));
  };

  const handleMesChange = (e) => {
    const mesFormat = moment(e).format("MMMM");
    setFechaSeleccionadaSelect(e);
    setFechaSeleccionadaMesNombre(mesFormat.toUpperCase());
    console.log(mesFormat);
    dispatch(StatesFormModalsSlice.actions.setMesEditPlan(mesFormat.toUpperCase()));
  };

  //EJECUTO ESTE UseEffect PARA QUE CUANDO EL FORMULARIO SE MONTE EN EL LAYOUT ME CAMBIE EL ESTADO DEL FORMULARIO A EN PROGRESO
  useEffect(() => {
    const aprobarFormulario = estadoFormularios.map((elementos) => {
      const nuevoObjeto = { ...elementos };
      const mesActual = moment().startOf("month");
      const formatMes = mesActual.format("MMMM").toUpperCase();
      dispatch(StatesFormModalsSlice.actions.setMesEditPlan(formatMes));
      setFechaSeleccionadaSelect(mesActual);
      setFechaSeleccionadaMesNombre(mesActual);
      if (nuevoObjeto.idForm == 3) {
        nuevoObjeto.estadoForm = 1;
      }
      return nuevoObjeto;
    });
    dispatch(OptionFormSlice.actions.setNewPlanAll(aprobarFormulario));
  }, []);

  return (
    <>
      {estadoFormularios && (
        <main>
          <section className="flex w-full flex-row justify-around gap-x-28">
            <SelectComponent
              control={controlFather}
              inputLabel="Estado del plan"
              listaObjetos={listaEstadosParaPlan}
              nameSelect="estados"
              valueLabel={(value) => value}
              valueSelect={(value) => value}
              defaultValue={edicionState ? planProduccionEdit.estado : ""}
              ValueSave={setValueEstado}
              valueKey={(value) => value}
              varianteEstilo="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={0}
              labelInput="Observacion"
              nameInput="observacion"
              valueDefault={edicionState ? planProduccionEdit.observaciones : ""}
              typeInput="standard"
            />
            <TextFieldComponent
              control={controlFather}
              index={1}
              labelInput="Ritmo"
              nameInput="ritmo"
              valueDefault={edicionState ? planProduccionEdit.ritmo.toString() : ""}
              typeInput="standard"
              requiredBool
              errors={errosFather}
            />
            <div className="w-full">
              <Controller
                name="mes"
                control={controlFather}
                render={({ field }) => (
                  <DesktopDatePicker
                    label="Seleccione el mes"
                    views={["month"]}
                    value={fechaSeleccionadaSelect}
                    inputFormat="MMMM"
                    maxDate={fechaActual}
                    renderInput={(field) => <TextField {...field} variant="standard" fullWidth />}
                    onChange={handleMesChange}
                  />
                )}
              />
            </div>
          </section>
          <hr className="h-0.5 bg-gray-500 my-6" />
          <section className="w-full justify-start my-4">
            <div className="flex flex-row gap-x-10 items-center">
              <div className="flex flex-row items-center gap-x-4">
                <p>Nuevo Embarque</p>
                <Tooltip title="Crear un nuevo embarque">
                  <IconButton
                    onClick={() => {
                      setOpenNuevoEmbarque(true);
                    }}
                    style={{ position: "relative", backgroundColor: "#59B7F7" }}
                    size="small">
                    <Add />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="flex flex-row items-center gap-x-4">
                <p>Embarque Existente</p>
                <Tooltip title="Agregar al lote un embarque existente">
                  <IconButton
                    onClick={() => {
                      setOpenModalAsignarEmbarque(true);
                    }}
                    style={{ position: "relative", backgroundColor: "#59B7F7" }}
                    size="small">
                    <Add />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </section>
          <section className="my-2 overflow-y-scroll h-44 flex flex-col gap-y-4 w-[100%]">
            {listaEmbarques.map((elementos, index) => (
              <div className="bg-background p-2 flex flex-col" key={index}>
                <ul
                  className={`${
                    edicionState ? "grid-cols-4" : "grid-cols-3"
                  } grid justify-items-center w-full items-center`}>
                  <li>Nombre: {elementos.nombreEmbarque}</li>
                  <li>N°: {elementos.numeroEmbarque}</li>
                  <li>Estado: {elementos.estadoEmbarque.nombre}</li>
                  {edicionState && (
                    <li>
                      <Tooltip title="Editar Embarque">
                        <IconButton
                          onClick={() => {
                            handleEditEmbarque(elementos);
                          }}
                          style={{ position: "relative" }}
                          size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </section>
        </main>
      )}
    </>
  );
};
