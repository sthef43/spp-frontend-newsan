import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ILinea, ITurno } from "app/models";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { ResponsableInicioLineaSliceRequests } from "app/Middleware/reducers/ResponsableInicioLineaSlice";
import { IResponsableInicioLinea } from "app/models/IResponsableInicioLinea";
import { ValidaSliceRequests } from "app/Middleware/reducers/ValidaSlice";
import { IValida } from "app/models/IValida";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { ParadaSliceRequests } from "app/Middleware/reducers/ParadaSlice";
import moment from "moment";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import FetchApi from "app/shared/helpers/FetchApi";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";

interface initialState {
  fecha: string;
  turno: string;
  target: number;
  producidos: number;
  observacion: string;
  minutosPerdidos: number;
  lineaString: string;
  planta: string;
  motivoId: number;
  validaId: number;
  responsableInicioLineaId: number;
  lineaId: number;
}

const defaultFormValues: initialState = {
  fecha: "",
  turno: "",
  target: 0,
  producidos: 0,
  observacion: "",
  minutosPerdidos: 0,
  lineaString: "",
  planta: "",
  motivoId: 0,
  validaId: 0,
  responsableInicioLineaId: 0,
  lineaId: 0
};

interface props {
  setOpenPopup: any;
  editState?: any;
  refresh?: any;
}

export const ParadasEditForm = ({ setOpenPopup, editState, refresh }: props) => {
  // console.log(editState);
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults();

  const { control, setValue, handleSubmit, formState } = useForm<initialState>({
    defaultValues: defaultFormValues
  });
  const { isDirty, isValid } = formState;

  //Leer
  const [lineasProduccion, setLineasProduccion] = useState<ILinea[] | null>([]);
  const [turnos, setTurnos] = useState<ITurno[] | null>(null);
  const [listResponsablesInicioLinea, setListResponsablesInicioLinea] = useState<IResponsableInicioLinea[] | null>([]);
  const [listValida, setListValida] = useState<IValida[] | null>([]);

  // GET LineasProduccion
  FetchApi<any[]>(
    LineaSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) setLineasProduccion(data);
    },
    false,
    false,
    true
  );

  // GET Turnos
  FetchApi<any[]>(
    TurnoSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) setTurnos(data);
    },
    false,
    false,
    true
  );

  // GET ResponsablesInicioLinea
  FetchApi<any[]>(
    ResponsableInicioLineaSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) setListResponsablesInicioLinea(data);
    },
    false,
    false,
    true
  );

  // GET Valida
  FetchApi<any[]>(
    ValidaSliceRequests.getAllRequest,
    null,
    false,
    null,
    (data) => {
      if (data) setListValida(data);
    },
    false,
    false,
    true
  );

  useEffect(() => {
    if (editState) {
      Object.keys(defaultFormValues).forEach((key) => {
        if (editState[key] !== undefined) {
          setValue(key as keyof initialState, editState[key]);
        }
      });
    }
  }, [editState]);

  //Guardar
  const loginSubmit = async (e) => {
    delete e.motivo;
    delete e.valida;
    delete e.responsableInicioLinea;
    delete e.linea;
    const date = moment(e.fecha, "DD-MM-YYYY");
    const objeto = { ...e, fecha: date.format("YYYY-MM-DD") };
    const result = await FetchPut({
      sliceRequest: ParadaSliceRequests.putRequest,
      modelPut: objeto,
      consoleLog: false,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Actualizar Parada",
      messageUser: "¿Está seguro que desea actualizar esta parada?",
      functionAdd: () => {
        openNotificationUI("Guardado exitosamente :)", "success");
        setOpenPopup(false);
        refresh();
      }
    });
  };

  //Fecha
  const onChangeFechaE = (fecha: string) => {
    setValue("fecha", fecha);
  };

  return (
    <div className="h-full w-[80vw] relative">
      <form onSubmit={handleSubmit(loginSubmit)} className="w-full h-full">
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div>
            <SelectOfDate pickFecha setFechaProps={onChangeFechaE} fechaEdit={editState?.fecha} />
            {/* <Controller
              name="fecha"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DesktopDatePicker
                  label="Fecha"
                  value={watchFecha}
                  inputFormat="DD/MM/yyyy"
                  onChange={(e: any) => {
                    setValue("fecha", e);
                  }}
                  renderInput={(field) => <TextField {...field} variant="standard" />}
                />
              )}
            /> */}
          </div>
          <div style={{ minWidth: "176px" }}>
            <SelectComponentForm
              control={control}
              name="lineaId"
              label="Linea Produccion"
              listItems={lineasProduccion || []}
              valueLabel={(item) => item.descripcion}
              valueSelect={(item) => item.idLinea}
              variant="standard"
              rules={{ required: "Seleccionar una línea", validate: (value) => value > 0 || "Seleccionar una línea" }}
            />
          </div>
          <div style={{ minWidth: "176px" }}>
            <SelectComponentForm
              control={control}
              name="turno"
              label="Turno"
              listItems={turnos || []}
              valueLabel={(item) => item.abreviatura}
              valueSelect={(item) => item.id}
              variant="standard"
              rules={{ required: "Seleccionar un turno", validate: (value) => value > 0 || "Seleccionar un turno" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div>
            <InputComponentForm
              control={control}
              name="target"
              label="Target"
              typeDate="number"
              variant="outlined"
            />
            {/* <Button
              className={classes.purpleButton}
              onClick={(e) => {
                if (watchLinea && watchTurno) {
                  setEditarTarget(!editarTarget);
                } else {
                  openNotificationUI("Seleccionar línea y turno!", "warning");
                }
              }}>
              {editarTarget == true ? "No Editar Target" : "Editar Target"}
            </Button> */}
            {/* <Button className={classes.blueButton} onClick={calcularInfoFL}>
              Calcular Info
            </Button> */}
          </div>

          <div>
            <InputComponentForm
              control={control}
              name="producidos"
              label="Producidos"
              typeDate="number"
              variant="outlined"
            />
          </div>
          {/* <div>
            <Controller
              name="minutosDeLinea"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Minutos de Línea"
                  variant="outlined"
                  type="number"
                  // disabled={!editarTarget}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                />
              )}
            />
          </div> */}
          <div>
            <InputComponentForm
              control={control}
              name="minutosPerdidos"
              label="Minutos Perdidos"
              typeDate="number"
              variant="outlined"
            />
          </div>
          {/* <div>
            <Controller
              name="minutosParados"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  // disabled
                  label="Minutos Parados"
                  variant="outlined"
                  type="number"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div> */}
          {/* <div>
            <Button
              className={classes.yellowButton}
              onClick={(e) => {
                setOpenCargaMotivos(true);
                setMinutosPerdidosState(watchMinutosPerdidos);
              }}>
              Cargar Motivos
            </Button>
          </div> */}
        </div>
        <div style={{ padding: "20px" }}>
          <InputComponentForm
            control={control}
            name="observacion"
            label="Observacion"
            variant="outlined"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
          <div style={{ minWidth: "176px" }}>
            <SelectComponentForm
              control={control}
              name="responsableInicioLineaId"
              label="Seleccione un Responsable de linea"
              listItems={listResponsablesInicioLinea || []}
              valueLabel={(item) => item.nombre}
              valueSelect={(item) => item.id}
              variant="standard"
              rules={{ required: true, validate: (value) => value > 0 || "Seleccionar un responsable" }}
            />
          </div>
          <div style={{ minWidth: "176px" }}>
            <SelectComponentForm
              control={control}
              name="validaId"
              label="Valida"
              listItems={listValida || []}
              valueLabel={(item) => item.nombre}
              valueSelect={(item) => item.id}
              variant="standard"
              rules={{ required: true, validate: (value) => value > 0 || "Seleccionar quien valida" }}
            />
          </div>
        </div>

        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isValid}>
            Guardar
          </Button>
        </div>
      </form>

      {/* <ModalCompoment
        title={"Carga de Motivos. Minutos perdidos: " + minutosPerdidosState.toString()}
        openPopup={openCargaMotivos}
        setOpenPopup={setOpenCargaMotivos}>
        <CargaMotivosForm
          setOpenPopup={setOpenCargaMotivos}
          minutosPerdidos={minutosPerdidosState}
          setObjetoMotivo={setObjetoMotivo}
          defaultValues={defaultValues}
        />
      </ModalCompoment> */}
    </div>
  );
};
