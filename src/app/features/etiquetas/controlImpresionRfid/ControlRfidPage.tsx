import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ClientPrintJob, InstalledPrinter, JSPrintManager, WSStatus } from "jsprintmanager";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ControlRfidPage = (): JSX.Element => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const [rfid, setRfid] = useState("");
  const [oldRfid, setOldRfid] = useState<number>(0);
  const [selectPrint, setSelectPrint] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const [printers, setPrinters] = useState([]);
  const [data, setData] = useState<Array<{ previousRfid: number; lastRfid: number }>>([]);

  interface initialState {
    impresora: string;
  }
  const initialStateVar = {
    impresora: ""
  };
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const strartPrint = async () => {
    JSPrintManager.auto_reconnect = true;
    JSPrintManager.start().then(getPrints);
  };

  const savePrintersList = (printers) => {
    let arrayOfPrinters = [];
    arrayOfPrinters = Object.values(printers);
    setPrinters(arrayOfPrinters);
  };
  const errorCallback = () => {
    openNotificationUI("Hubo un problema al obtener las impresoras.", "error");
  };

  const getPrints = async () => {
    JSPrintManager.getPrinters().then(savePrintersList, errorCallback);
  };

  const onReset = () => {
    setOldRfid(0);
    setRfid("");
    setData([]);
  };
  const onSetPrint = () => {
    if (getValues("impresora") != "") {
      setOpenModal(false);
      setSelectPrint(true);
    } else {
      openNotificationUI("Seleccione una impresora", "error");
    }
  };
  //Check JSPM WebSocket status
  function jspmWSStatus() {
    if (JSPrintManager.websocket_status == WSStatus.Open) return true;
    else if (JSPrintManager.websocket_status == WSStatus.Closed) {
      alert(
        "JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm"
      );
      return false;
    } else if (JSPrintManager.websocket_status == WSStatus.Blocked) {
      alert("JSPM has blocked this website!");
      return false;
    }
  }
  const onEnterKey = (e: ChangeEvent<HTMLInputElement>) => {
    setRfid(e.target.value);
  };
  const sendEmail = async (previousRfid: string, lastRfid: string, missingRfid: string) => {
    try {
      const response = await dispatch(
        EmailSliceRequest.SendEmailPausePrinterRfid({
          previousRfid,
          lastRfid,
          missingRfid,
          namePrinter: getValues("impresora")
        })
      );
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const handleKeyDown = (event): void => {
    const newRfid = event.target.value;
    if (event.key === "Enter") {
      // 👇 Get input value
      if (oldRfid != 0) {
        if (newRfid == oldRfid) {
          event.target.select();
          return;
        }
        setOldRfid(parseInt(newRfid));
        setRfid("");
        if (oldRfid != parseInt(newRfid) + 1) {
          if (jspmWSStatus()) {
            //Create a ClientPrintJob
            const cpj = new ClientPrintJob();
            //Set Printer type (Refer to the help, there many of them!)
            cpj.clientPrinter = new InstalledPrinter(getValues("impresora"));
            //Set content to print...
            //Create Zebra ZPL commands for sample label
            cpj.printerCommands = "^XA ~PP ^XZ";
            //Send print job to printer!
            cpj.sendToClient();
          }
          setData([...data, { previousRfid: oldRfid, lastRfid: newRfid }]);
          sendEmail(oldRfid.toString(), newRfid, calcularDiferencia(oldRfid, parseInt(newRfid)));
          openNotificationUI("No es consecutivo", "warning");
        }
      } else {
        setOldRfid(parseInt(newRfid));
        setRfid("");
      }
    }
  };

  const EnhancedTableToolbar = () => {
    return (
      <Toolbar sx={{ width: "100%" }}>
        <Typography sx={{ textAlign: "center", width: "100%" }} variant="h6" id="tableTitle" component="div">
          Pausas enviadas
        </Typography>
      </Toolbar>
    );
  };
  const calcularDiferencia = (inicial, final) => {
    const diferencia = Math.abs(inicial - final);
    let resultado = "";
    for (let i = 1; i < diferencia; i++) {
      const numero = Math.max(inicial, final) - i;
      resultado += numero.toString().slice(-5) + "-";
    }
    return resultado.slice(0, -1);
  };
  useEffect(() => {
    TitleChanger("Control de RFID");
    strartPrint();
  }, []);

  return selectPrint ? (
    <div className="m-4 shadow-elevation-4 flex flex-col justify-center items-center pb-5">
      <TitleUIComponent title="RFID" />
      <div className="flex gap-4 justify-center mb-14 mt-7">
        <TextField
          type="number"
          variant="filled"
          focused
          autoFocus
          value={rfid}
          onChange={onEnterKey}
          onKeyDown={handleKeyDown}
          sx={{ width: "400px" }}
        />
        <Button className={classes.yellowButton} onClick={onReset}>
          Reiniciar
        </Button>
      </div>

      <TextField
        variant="filled"
        disabled
        value={"Ultimo RFID leido: " + oldRfid.toString().slice(-5)}
        InputProps={{
          endAdornment: <InputAdornment position="end">Escanear el numero siguente</InputAdornment>
        }}
        sx={{ width: "500px", padding: "auto" }}
      />
      {data.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table aria-label="a dense table">
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <EnhancedTableToolbar />
                </TableCell>
              </TableRow>
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  Pausa número
                </TableCell>
                <TableCell align="right">RFID anterior</TableCell>
                <TableCell align="right">Ultimo RFID leído</TableCell>
                <TableCell align="center">Números faltantes</TableCell>
              </TableRow>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, backgroundColor: "red" }}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="right">{row.previousRfid}</TableCell>
                  <TableCell align="right">{row.lastRfid}</TableCell>
                  <TableCell align="center">{calcularDiferencia(row.previousRfid, row.lastRfid)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  ) : (
    <ModalCompoment
      title="Seleccione una impresora para mandar la pausa."
      setOpenPopup={setOpenModal}
      openPopup={openModal}>
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
    </ModalCompoment>
  );
};
