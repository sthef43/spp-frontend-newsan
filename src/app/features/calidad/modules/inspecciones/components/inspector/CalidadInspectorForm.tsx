import { FormControl, TextField, FormHelperText, Autocomplete, IconButton, Chip, Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { CalidadInspeccionTareaSliceRequest } from "app/Middleware/reducers/CalidadInspeccionTareaSlice";
import { CalidadInspectorSliceRequest } from "app/Middleware/reducers/CalidadInspectorSlice";
import { CalidadInspectorTareasSliceRequest } from "app/Middleware/reducers/CalidadInspectorTareasSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";

interface CalidadInspeccionTareaFormProps {
  refresh: () => void;
  existingtasks?: string[];
  setModal: (state: boolean) => void;
  editState?: any | null;
  edit: boolean;
}

const CalidadInspectorForm = ({ edit, editState, refresh, setModal }: CalidadInspeccionTareaFormProps) => {
  const classes = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid }
  } = useForm<any>({
    defaultValues: {
      appUserId: edit ? editState.appUserId : null,
      categoria: edit ? editState.categoria : "",
      codigo: edit ? editState.codigo : ""
    }
  });

  // const [value, setValue] = useState<number | null>();

  const dispatch = useAppDispatch();
  const [usuarios, setUsuarios] = useState<any[]>();
  const [tareas, setTareas] = useState<any[]>();
  const [filteredTareas, setfilteredTareas] = useState<any[]>();
  const [tareaSelected, setTareaSelected] = useState<number | null>();
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  const watchedAppUserId = watch("appUserId");
  console.log(watchedAppUserId);

  const init = async () => {
    try {
      const [usuarios, tareas] = await Promise.all([getAllUser(), getAllTareas()]);
      setUsuarios(usuarios);
      const tareasInspector = tareas.map((tarea: any) => {
        const temp: any = {
          calidadInspeccionTareaId: tarea.id,
          inspeccionTarea: tarea,
          deleted: false
        };
        return temp;
      });
      setTareas(tareasInspector);
      setfilteredTareas(tareasInspector);
      if (edit) {
        const response = await getAllTareasByInspector(editState.id);
        setTareasSeleccionadas(response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getAllUser = async () => {
    try {
      const response = unwrapResult(await dispatch(AppUserSliceRequests.getAllUsers()));
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  const getAllTareas = async () => {
    try {
      const response = unwrapResult(await dispatch(CalidadInspeccionTareaSliceRequest.getAllRequest()));
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  const getAllTareasByInspector = async (inspectorId) => {
    try {
      const response = unwrapResult(
        await dispatch(CalidadInspectorTareasSliceRequest.GetTareasByInspectorId(inspectorId))
      );
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  const onAddTarea = () => {
    const tempTareas = JSON.parse(JSON.stringify(tareasSeleccionadas));
    const existe = tempTareas.find((tarea) => tarea.calidadInspeccionTareaId === tareaSelected);
    if (existe && existe.deleted) {
      existe.deleted = false;
      setTareasSeleccionadas((prvState) => [...tempTareas]);
    } else {
      const tareaSeleccionada = tareas.find((d) => d.calidadInspeccionTareaId === tareaSelected);
      setTareasSeleccionadas((prvState) => [...prvState, tareaSeleccionada]);
    }
    setTareaSelected(null);
    setInputValue("");
  };

  const onDeleteTarea = async (id) => {
    try {
      const tempTareas = JSON.parse(JSON.stringify(tareasSeleccionadas));
      const deleteTask = tempTareas.find((t) => t.calidadInspeccionTareaId === id);
      if (!deleteTask) {
        throw Error("No se encontro la tarea");
      }
      if (deleteTask?.id > 0) {
        const resp = await getConfirmation("Borrar Tarea de inspeccion", "¿Esta seguro que quiere eliminar la tarea?");
        if (!resp) return;
      }
      deleteTask.deleted = true;
      const tempTareasSeleccionadas = tempTareas;
      console.log(tempTareasSeleccionadas);
      setTareasSeleccionadas((prvstate) => [...tempTareasSeleccionadas]);
    } catch (e) {
      console.error(e);
      openNotificationUI("Ocurrio Un error al intentar elimnar el registro", "error");
    }
  };

  const onSubmit = async (data) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const inspector: any = data;
      if (edit) {
        editState.codigo = data.codigo;
        editState.categoria = data.categoria;
        editState.appUser = null;
        if (tareasSeleccionadas.length > 0) {
          const tempTareas = JSON.parse(JSON.stringify(tareasSeleccionadas));
          editState.tareas = tempTareas
            .filter((d) => !d.deleted || d?.id)
            .map((d) => {
              console.log(d);
              d.inspeccionTarea = null;
              d.inspector = null;
              return d;
            });
        }
      } else {
        if (tareasSeleccionadas.length > 0) {
          const tempTareas = JSON.parse(JSON.stringify(tareasSeleccionadas));
          inspector.tareas = tempTareas
            .filter((d) => !d.deleted || d?.id)
            .map((d) => {
              d.inspeccionTarea = null;
              return d;
            });
        }
      }
      const response = edit
        ? unwrapResult(await dispatch(CalidadInspectorSliceRequest.NestedUpdateRequest(editState)))
        : unwrapResult(await dispatch(CalidadInspectorSliceRequest.TransactionNestedAddRequest(inspector)));

      if (response) {
        openNotificationUI(`Registro ${edit ? "Actualizado" : "Agregado"} Correctamente`, "success");
        refresh();
        setModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      console.error(e);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Ocurrio Un error al intentar guardar el registro", "error");
    }
  };
  useEffect(() => {
    const diferencia = _.differenceBy(
      tareas,
      tareasSeleccionadas.filter((d) => !d.deleted),
      "calidadInspeccionTareaId"
    );
    setfilteredTareas(diferencia);
  }, [tareasSeleccionadas]);

  useEffect(() => {
    init();
  }, []);

  return (
    <form className="w-full flex flex-col gap-4 justify-center align-middle" onSubmit={handleSubmit(onSubmit)}>
      {usuarios && (
        <Controller
          control={control}
          name="appUserId"
          rules={{
            required: "Debe colocar un usuario"
          }}
          render={({ field, ...props }) => {
            return (
              <Autocomplete
                disabled={edit}
                value={
                  watchedAppUserId && usuarios ? usuarios.find((user) => watchedAppUserId === user.id) ?? null : null
                }
                onChange={(_event: any, newValue: any) => {
                  console.log(watchedAppUserId);
                  field.onChange(newValue ? newValue.id : null);
                }}
                getOptionLabel={(opt: any) => {
                  return (opt as any).username;
                }}
                options={usuarios as any}
                renderInput={(params) => <TextField {...params} label="Usuario del Sistema" inputRef={field.ref} />}
                {...props}
              />
            );
          }}
        />
      )}

      <Controller
        control={control}
        name="codigo"
        rules={{
          required: "Debe Colocar un Codigo"
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <TextField {...field} label="Codigo" />
            {!!error && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="categoria"
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl error={!!error}>
              <TextField {...field} label="Categoria" />
              {!!error && <FormHelperText>{error?.message}</FormHelperText>}
            </FormControl>
          );
        }}
      />
      {filteredTareas && tareas && (
        <FormControl className="flex flex-row ">
          <Autocomplete
            disabled={filteredTareas.length == 0}
            className="flex-1"
            clearOnBlur={false}
            value={
              watchedAppUserId
                ? tareas.find((tarea) => watchedAppUserId === tarea.calidadInspeccionTareaId) ?? null
                : null
            }
            onChange={(event: any, newValue: any, reason) => {
              console.log(newValue);
              if (newValue) {
                setTareaSelected(newValue.calidadInspeccionTareaId);
              } else {
                setTareaSelected(null);
              }
            }}
            getOptionLabel={(opt: any) => {
              return opt.inspeccionTarea?.tarea;
            }}
            options={filteredTareas}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setTareaSelected(null);
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label={`${filteredTareas.length == 0 ? "Sin Inspecciones" : "Inspeccion"}`} />
            )}
          />
          <IconButton aria-label="add" disabled={!tareaSelected} color="primary" onClick={onAddTarea}>
            <AddIcon />
          </IconButton>
        </FormControl>
      )}

      {tareasSeleccionadas && tareasSeleccionadas.filter((d) => !d.deleted).length > 0 && (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-lg tracking-wide font-semibold">Inspeccion Permitidas</h1>
          <div className="max-h-[150px] overflow-auto grid grid-cols-3 gap-2 p-2 rounded border  dark:border-white shadow-sm">
            {tareasSeleccionadas.map((tarea) => {
              return (
                !tarea.deleted && (
                  <Chip
                    key={tarea.calidadInspeccionTareaId}
                    label={tarea.inspeccionTarea?.tarea}
                    variant="outlined"
                    onDelete={() => onDeleteTarea(tarea.calidadInspeccionTareaId)}
                  />
                )
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-1 flex justify-around border-t-2 mb-1" style={{ flex: "1 1 10%" }}>
        <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isValid}>
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default CalidadInspectorForm;
