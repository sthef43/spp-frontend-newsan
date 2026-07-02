import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField
} from "@mui/material";
import { ILinea } from "app/models";
import { ILineasRechazoHabilitadas } from "app/models/ILineasRechazoHablitadas";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineasRechazoHabilitadasSliceRequest } from "app/Middleware/reducers/LineasRechazoHabilitadasSlice";

interface props {
  rowSelected: ILineasRechazoHabilitadas;
  lineasData: ILinea[];
  setListado: (newValue: ILineasRechazoHabilitadas[]) => void;
  setopenModal: (newValue: boolean) => void;
}

interface IFormEdit {
  lineaId: number | string;
  puesto: string;
  processorIdMin: string | number;
  processorIdMax: string | number;
}

const initialValues = {
  lineaId: "",
  puesto: "",
  processorIdMin: "",
  processorIdMax: ""
};

export const LineaRechazoHabilitasEditForm: React.FC<props> = ({
  rowSelected,
  lineasData,
  setopenModal,
  setListado
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IFormEdit>({
    mode: "onSubmit",
    defaultValues: initialValues
  });

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const onUpdate = async (data: IFormEdit) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const lineaActualizada: ILineasRechazoHabilitadas = {
        id: rowSelected.id,
        lineaId: Number(data.lineaId),
        processorIdDesde: Number(data.processorIdMin),
        processorIdHasta: Number(data.processorIdMax),
        puestoCargadora: data.puesto === "puestoCargadora",
        puestoRunTest: data.puesto === "puestoTestRun",
        puestoProTrace: data.puesto === "puestoProTrace",
        identificadorLinea: rowSelected.identificadorLinea
      };

      const response = unwrapResult(await dispatch(LineasRechazoHabilitadasSliceRequest.PutRequest(lineaActualizada)));
      if (response) {
        const responseLineas = unwrapResult(await dispatch(LineasRechazoHabilitadasSliceRequest.getAllRequest()));
        setListado(responseLineas);
        openNotificationUI("Se agrego el puesto correctamente!", "success");
        setopenModal(false);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    if (rowSelected) {
      // const idString = rowSelected.lineaId.toString();
      setValue("lineaId", rowSelected.lineaId.toString());
      setValue("processorIdMin", rowSelected.processorIdDesde);
      setValue("processorIdMax", rowSelected.processorIdHasta);

      if (rowSelected.puestoCargadora) setValue("puesto", "puestoCargadora");
      if (rowSelected.puestoRunTest) setValue("puesto", "puestoTestRun");
      if (rowSelected.puestoProTrace) setValue("puesto", "puestoProTrace");
    }
  }, [rowSelected, setValue]);

  return (
    <main className="w-[45vw] p-4">
      <form onSubmit={handleSubmit(onUpdate)}>
        <div className="mb-6">
          <FormControl variant="standard" fullWidth>
            <FormLabel className="mb-2 text-gray-600 font-semibold text-sm">Línea seleccionada</FormLabel>
            <Controller
              name="lineaId"
              control={control}
              render={({ field }) => (
                <Select {...field} disabled value={field.value?.toString() ?? ""}>
                  {lineasData.map((item) => (
                    <MenuItem key={item.idLinea} value={item.idLinea.toString()}>
                      {item.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </div>

        <div className="mb-8">
          <FormControl component="fieldset" className="w-full">
            <FormLabel className="mb-3 text-gray-600 font-semibold text-sm">Puesto habilitado</FormLabel>
            <Controller
              name="puesto"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row className="gap-6 w-full justify-center">
                  <FormControlLabel value="puestoCargadora" control={<Radio />} label="Cargadora" />
                  <FormControlLabel value="puestoTestRun" control={<Radio />} label="Test Run" />
                  <FormControlLabel value="puestoProTrace" control={<Radio />} label="ProTrace" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <Controller
            name="processorIdMin"
            control={control}
            rules={{ required: "Campo obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="ProcessorId Mínimo"
                variant="standard"
                error={!!errors.processorIdMin}
                helperText={errors.processorIdMin?.message}
                value={field.value ?? ""}
              />
            )}
          />

          <Controller
            name="processorIdMax"
            control={control}
            rules={{ required: "Campo obligatorio" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="ProcessorId Máximo"
                variant="standard"
                error={!!errors.processorIdMax}
                helperText={errors.processorIdMax?.message}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className="w-full flex flex-row justify-center items-center pt-4">
          <Button type="submit" sx={{ width: "50%", height: "30px" }}>
            Guardar Configuración
          </Button>
        </div>
      </form>
    </main>
  );
};
