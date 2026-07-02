import { JSPrintManager } from "jsprintmanager";
import React, { useEffect, useState } from "react";
import { jspmWSStatusFunt } from "./SelectOfPrinter";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { MaterialButtons } from "../components/material-ui/MaterialButtons";
interface initialState {
  puerto: string;
}
const initialStateVar = {
  puerto: ""
};
export const ConexionCOM = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  const [puertos, setPuertos] = useState([]);
  const [nameOfPort, setNameOfPort] = useState("");

  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const newConectionPort = () => {
    // const conection =  new SerialComm(portName: "COM%");
  };
  const startConectionJSMP = async () => {
    JSPrintManager.auto_reconnect = true;
    JSPrintManager.start();
    JSPrintManager.WS.onStatusChanged = function () {
      if (jspmWSStatusFunt()) {
        //get serial ports
        JSPrintManager.getSerialPorts().then(function (portsList) {
          let arrayOfPrinters = [];
          arrayOfPrinters = Object.values(portsList);
          setPuertos(arrayOfPrinters);
        });
      }
    };
  };

  const onSetPrint = () => {
    if (getValues("puerto") != "") {
      setNameOfPort(getValues("puerto"));
    } else {
      openNotificationUI("Seleccione una impresora", "error");
    }
  };

  useEffect(() => {
    console.log(puertos);
  }, [puertos]);
  useEffect(() => {
    console.log(nameOfPort);
  }, [nameOfPort]);
  useEffect(() => {
    startConectionJSMP();
  }, []);

  return (
    <div className="flex flex-col gap-4 justify-center my-4">
      <Controller
        name="puerto"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel>Puertos</InputLabel>
            <Select {...field} variant="standard" onClick={onSetPrint}>
              {puertos &&
                puertos.map((x) => (
                  <MenuItem key={x} value={x}>
                    <div className="w-full">
                      <div>{x}</div>
                    </div>
                  </MenuItem>
                ))}
            </Select>
            {!!error && <FormHelperText>{error.type}</FormHelperText>}
          </FormControl>
        )}
      />
      <Button className={classes.greenButton} onClick={onSetPrint}>
        Guardar
      </Button>
    </div>
  );
};
