/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Button } from "@mui/material";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { WhatsappMsgTiempoSliceRequests } from "app/Middleware/reducers/WhatsappMsgTiempoSlice";

interface props {
  refresh: any;
}

interface initialState {
  turno: string;
  hora: string;
}
const initialStateVar = {
  turno: "M",
  hora: ""
};

export const WhatsappMsgTiempoForm = ({ refresh }: props) => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [valor, setValor] = useState(null);

  const watchHora = watch("hora");

  const loginSubmit = async (e) => {
    let result;
    console.log(e);
    const datosCorrectos = validarDatos();
    if (!datosCorrectos) {
      openNotificationUI("Completar los campos", "info");
      return false;
    }
    try {
      result = await dispatch(WhatsappMsgTiempoSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      refresh();
    }
  };

  const validarDatos = () => {
    if (getValues("turno") != "" && watchHora != "") return true;
    else return false;
  };

  const handleChange = (newValue) => {
    setValor(newValue);
    setValue("hora", newValue.format("HH:mm"));
  };

  return (
    <div className="h-full w-[55vw]">
      <form onSubmit={handleSubmit(loginSubmit)} className="h-full w-full">
        <div className="flex items-baseline justify-around">
          <div className="text-center sm:text-left p-2">
            <FormControl>
              <FormLabel>Turno</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <div className="sm:grid sm:grid-cols-1 ">
                      <div className="sm:col-span-1 ">
                        <FormControlLabel value="M" control={<Radio />} label="Mañana" />
                        <FormControlLabel value="T" control={<Radio />} label="Tarde" />
                        <FormControlLabel value="N" control={<Radio />} label="Noche" />
                      </div>
                    </div>
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                defaultValue="M"
                name="turno"
              />
            </FormControl>
          </div>
          <div>
            <TimePicker
              label="Time"
              value={valor}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </div>
        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
