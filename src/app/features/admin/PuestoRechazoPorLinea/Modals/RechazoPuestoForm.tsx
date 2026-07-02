/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { Add, Delete, PlaylistAdd } from "@mui/icons-material";
import { IRechazoPuestoFila } from "app/models/IRechazoPuestoFilas";
import { RechazoPuestoFilasSliceRequests } from "app/Middleware/reducers/RechazoPuestoFilas";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RechazoPuestoSliceRequests } from "app/Middleware/reducers/RechazoPuestoSlice";
import { useAppSelector, useAppDispatch } from "app/core/store/store";
import { IRechazoPuesto } from "app/models/IRechazoPuesto";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface IRPuestoFormProps {
  refresh: () => void;
  editState: IRechazoPuesto;
  productoId: number;
  closeModal: (state) => void;
}

const initialStateVar = {
  productoId: 0,
  nombre: "",
  codigoOrigen: "",
  fila: "",
  placas: false,
  rechazoPuestoFilaId: 0,
  rechazoPuestoFila: { nombre: "", filas: "" }
};

interface initialState {
  productoId: number;
  nombre: string;
  codigoOrigen: string;
  fila: string;
  rechazoPuestoFilaId: number;
  rechazoPuestoFila: { nombre: string; filas: string };
}

const formLabel = {
  nombre: "Nombre",
  codigoOrigen: "Código de origen",
  placas: "Rechazo de placas?"
};

export const RechazoPuestoForm = ({ refresh, editState, productoId, closeModal }: IRPuestoFormProps): JSX.Element => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty, isValid }
  } = useForm<initialState>({
    defaultValues: editState ? editState : { ...initialStateVar, productoId: productoId }
  });

  const filasArray = useAppSelector<IRechazoPuestoFila[]>((state) => state.rechazoPuestoFilas.dataAll);

  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [addFilas, setAddFilas] = useState(false);
  const [filas, setFilas] = useState<string[]>([]);
  const [filaSelect, setFilaSelect] = useState<IRechazoPuestoFila>(null);

  const watchNameFila = watch("fila");
  const filasWacth = watch("rechazoPuestoFilaId");

  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const filasString = filas.join("-");
      const objectSubmit = {
        ...e,
        rechazoPuestoFila: { nombre: getValues("rechazoPuestoFila.nombre"), filas: filasString }
      };
      filaSelect != null && delete e.rechazoPuestoFila;

      const response = editState
        ? await dispatch(RechazoPuestoSliceRequests.PutRequest(filaSelect == null ? objectSubmit : e))
        : await dispatch(RechazoPuestoSliceRequests.NestedAddRequest(filaSelect == null ? objectSubmit : e));
      editState
        ? openNotificationUI("Se edito correctamente", "success")
        : openNotificationUI("Se agrego correctamente", "success");
      closeModal(false);
      refresh();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getAllFilas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(RechazoPuestoFilasSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onAddFila = () => {
    const filaValue = getValues("fila").trimEnd();
    if (filaValue.length === 0) return;
    setFilas([...filas, filaValue]);
    setValue("fila", "");
  };

  const onAddFilaAction = () => {
    setAddFilas(!addFilas);
  };

  const onDeleteFila = (index: number) => {
    const filasFilter = filas.filter((fila, i) => i != index);
    setFilas(filasFilter);
  };

  useEffect(() => {
    getAllFilas();
  }, []);

  useEffect(() => {
    if (getValues("rechazoPuestoFilaId") != 0) {
      setFilaSelect(filasArray.find((fila) => fila.id == getValues("rechazoPuestoFilaId")));
    } else {
      setFilaSelect(null);
    }
  }, [filasWacth]);

  return (
    <div className="flex justify-center w-[35vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
        <GenericFieldsGenerator
          control={control}
          labels={formLabel}
          values={editState ? editState : initialStateVar}
          styleDiv={"text-center mb-5"}
          variant="standard"
          styleFieldSX={{ width: "100%" }}
        />
        <Controller
          name="rechazoPuestoFilaId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth variant="standard" className="flex flex-row">
              <InputLabel>Seleccionar tipo de filas</InputLabel>
              <Select {...field} disabled={addFilas} variant="standard" fullWidth>
                <MenuItem key="ninguna" value={0}>
                  Ninguna
                </MenuItem>
                {filasArray?.map((fila) => (
                  <MenuItem key={fila.id} value={fila.id}>
                    {fila.nombre}
                  </MenuItem>
                ))}
              </Select>
              <IconButton aria-label="agregar" onClick={onAddFilaAction} disabled={filasWacth != 0}>
                <PlaylistAdd color={filasWacth == 0 ? "success" : "inherit"} />
              </IconButton>
            </FormControl>
          )}
        />

        {addFilas && (
          <List className="w-full p-6 mb-2 rounded-md shadow-lg border border-gray-200">
            <div className="flex flex-col gap-y-4 w-full">
              <div>
                <Controller
                  name="rechazoPuestoFila.nombre"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Nombre de tipo de filas</InputLabel>
                      <Input {...field} />
                    </FormControl>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="fila"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Ingresar fila</InputLabel>
                      <Input
                        {...field}
                        endAdornment={
                          <Tooltip title="Agregar fila">
                            <IconButton
                              aria-label="agregar"
                              onClick={onAddFila}
                              disabled={watchNameFila.trim().length == 0}>
                              <Add color={watchNameFila.trim().length == 0 ? "inherit" : "primary"} />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </FormControl>
                  )}
                />
              </div>
            </div>
            {filas.map((value, index) => (
              <div key={index} className="mt-4">
                <ListItem
                  key={value}
                  disableGutters
                  secondaryAction={
                    <Tooltip title="Eliminar fila">
                      <IconButton aria-label="comment" onClick={() => onDeleteFila(index)}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  }>
                  <ListItemText primary={`Fila: ${value}`} />
                </ListItem>
              </div>
            ))}
          </List>
        )}
        {filasWacth != 0 && (
          <List className="w-full rounded-md border border-gray-200 p-0">
            <ListItem>
              <ListItemText primary={`Nombre: ${filaSelect?.nombre}`} />
            </ListItem>
            <Divider />
            {filaSelect?.filas.split("-").map((fila, index) => (
              <>
                <ListItem className="p-4 border-b border-gray-200 odd:bg-background" key={index}>
                  <ListItemText primary={`Fila: ${fila}`} />
                </ListItem>
              </>
            ))}
          </List>
        )}
        <div className="pt-1 flex justify-around">
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
