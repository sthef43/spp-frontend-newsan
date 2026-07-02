import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SemielaboradoTipoSliceRequests } from "app/Middleware/reducers/SemielaboradoTipoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea } from "app/models";
import { ISemielaborado } from "app/models/ISemielaborado";
import { ISemielaboradoTipo } from "app/models/ISemielaboradoTipo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { SemielaboradoSliceRequests } from "app/Middleware/reducers/SemielaboradoSlice";
import { SemielaboradosTable } from "../components/SemielaboradosTable";
interface Props {
  dataEdit: ISemielaborado;
  refresh: any;
  setOpenModal: any;
  lineaId: number;
  apareceTable: boolean;
}
export const SemielaboradoForm = ({ lineaId, dataEdit, refresh, setOpenModal, apareceTable }: Props) => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const lineas = useAppSelector<ILinea[]>((state) => state.linea.dataAll);
  const lineas2 = useAppSelector((state) => state.linea.dataAll);
  const semielaboradosTipo = useAppSelector<ISemielaboradoTipo[]>((state) => state.semielaboradoTipo.dataAll);
  const semielaborados = useAppSelector<ISemielaborado[]>((state) => state.semielaborado.dataAll);

  console.log(lineas2);

  const onSubmit = async (e) => {
    console.log(e);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const editSubmit = { ...e, semielaboradoTipo: null, semielaboradoModelos: null };
      const response = dataEdit
        ? await dispatch(SemielaboradoSliceRequests.PutRequest(editSubmit))
        : await dispatch(SemielaboradoSliceRequests.PostRequest(e));
      openNotificationUI("Se agrego el semielaborado correctamente", "success");
      if (refresh != null) refresh();
      if (setOpenModal != null) setOpenModal(false);
      getAllSemielaboradosByLinea();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const getAllSemielaboradosTipo = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(SemielaboradoTipoSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const defaultValues = {
    nombre: "",
    lineaId: lineaId != null ? lineaId : 0,
    semielaboradoTipoId: 0
  };
  const { control, formState, handleSubmit, reset, watch } = useForm({
    defaultValues: defaultValues
  });
  useEffect(() => {
    getAllSemielaboradosTipo();
  }, []);
  useEffect(() => {
    dataEdit && reset(dataEdit);
  }, [dataEdit]);

  const lineaWatch = watch("lineaId");

  const getAllSemielaboradosByLinea = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(SemielaboradoSliceRequests.getAllByLineaIdRequest(lineaWatch));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };

  useEffect(() => {
    if (lineaWatch != 0) {
      getAllSemielaboradosByLinea();
    }
  }, [lineaWatch]);

  return (
    <div>
      <form className="m-4 py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-row-3 sm:gap-4 w-full">
          <Controller
            name="lineaId"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Linea de producción</InputLabel>
                <Select {...field} variant="standard">
                  {lineas &&
                    lineas.map((x) => (
                      <MenuItem key={x.idLinea} value={x.idLinea}>
                        <div>{x.descripcion}</div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="nombre"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Nombre</InputLabel>
                <Input {...field} />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="semielaboradoTipoId"
            control={control}
            rules={{ required: true, min: 1 }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un tipo de semielaborado</InputLabel>
                <Select {...field} variant="standard">
                  {semielaboradosTipo &&
                    semielaboradosTipo.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div>{x.nombre}</div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="pt-1 flex justify-around border-t-2">
          <Button
            className={buttonClasses.blueButton}
            disabled={!formState.isValid && !formState.isDirty}
            variant="contained"
            type="submit">
            Guardar
          </Button>
          <Button className={buttonClasses.redButton} variant="contained" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </div>
      </form>
      {dataEdit == null
        ? lineaWatch != 0 &&
          apareceTable && (
            <SemielaboradosTable
              dataTable={semielaborados}
              onAddProps={null}
              lineaId={lineaWatch}
              refresh={getAllSemielaboradosByLinea}
              setEditForm={null}
            />
          )
        : ""}
    </div>
  );
};
