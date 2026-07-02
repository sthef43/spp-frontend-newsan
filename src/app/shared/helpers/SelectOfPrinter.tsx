import { ClientPrintJob, InstalledPrinter, JSPrintManager, WSStatus } from "jsprintmanager";
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { MaterialButtons } from "../components/material-ui/MaterialButtons";
interface ISelectOfPrinter {
  setNameOfPrinter: (name: string) => void;
  closeModal: (state: boolean) => void;
}
interface initialState {
  impresora: string;
}
const initialStateVar = {
  impresora: ""
};
export const SelectOfPrinter = ({ setNameOfPrinter, closeModal }: ISelectOfPrinter): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();

  const [printers, setPrinters] = useState([]);

  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const startPrint = async () => {
    JSPrintManager.auto_reconnect = true;
    JSPrintManager.start().then(getPrints).catch(errorCallback);
    jspmWSStatusFunt();
  };

  const savePrintersList = (printers) => {
    let arrayOfPrinters = [];
    arrayOfPrinters = Object.values(printers);
    setPrinters(arrayOfPrinters);
  };
  const errorCallback = () => {
    openNotificationUI("Hubo un problema al obtener las impresoras.", "error");
    jspmWSStatusFunt();
  };

  const getPrints = async () => {
    JSPrintManager.getPrinters().then(savePrintersList, errorCallback);
  };
  const onSetPrint = () => {
    if (getValues("impresora") != "") {
      setNameOfPrinter(getValues("impresora"));
      closeModal(false);
    } else {
      openNotificationUI("Seleccione una impresora", "error");
    }
  };
  useEffect(() => {
    startPrint();
    //setPrinters(["impresora", "otra impr"]);
  }, []);
  useEffect(() => {
    const timeoutId2 = setTimeout(() => {
      jspmWSStatusFunt();
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col gap-4 justify-center my-4">
      <Controller
        name="impresora"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel>Impresora</InputLabel>
            <Select {...field} variant="standard">
              {printers &&
                printers.map((x) => (
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
export const jspmWSStatusFunt = (): boolean => {
  if (JSPrintManager.websocket_status == WSStatus.Open) return true;
  else if (JSPrintManager.websocket_status == WSStatus.Closed) {
    alert(
      "JSPrintManager (JSPM) no esta iniciado o instalado y es necesario para acceder a las impresoras! Por favor descarfar JSPM Client App desde https://neodynamic.com/downloads/jspm"
    );
    return false;
  } else if (JSPrintManager.websocket_status == WSStatus.Blocked) {
    alert("JSPM fue bloqueado por la websitet!");
    return false;
  }
};
export const sendToPrint = (codigoZPL: string): void => {
  const { openNotificationUI } = useNotificationUI();
  if (jspmWSStatusFunt()) {
    //Create a ClientPrintJob
    const cpj = new ClientPrintJob();
    //Set Printer type (Refer to the help, there many of them!)
    cpj.clientPrinter = new InstalledPrinter(codigoZPL);
    //Set content to print...
    //Create Zebra ZPL commands for sample label
    cpj.printerCommands = "^XA ~PP ^XZ";
    //Send print job to printer!
    cpj.sendToClient();
    cpj.onFinished(openNotificationUI("Se envio con éxito", "success"));
  }
};
