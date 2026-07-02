import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";

import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { EncabezadoParametrosImpresion } from "app/features/etiquetas/impresionEtiquetas/components/EncabezadoParametrosImpresion";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import { Print } from "@mui/icons-material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import moment from "moment";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { TableImpresiones } from "app/features/etiquetas/impresionEtiquetas/components/TableImpresiones";
import { JSPrintManager, WSStatus, ClientPrintJob, InstalledPrinter } from "jsprintmanager";
import { ZPL_ReimpresionesSliceRequests } from "app/Middleware/reducers/ZPL_ReimpresionesSlice";

export const ReImpresion = (): JSX.Element => {
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [printers, setPrinters] = useState([]);
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [ascendente, setAscendente] = useState(false);
  const [busquedaCorrecta, setBusquedaCorrecta] = useState(false);
  const [ultimoNumeroImpresoDefinitivo, setUltimoNumeroImpresoDefinitivo] = useState(0);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(null);

  interface initialState {
    ultimoNumeroImpreso: number;
    numeroDesde: string;
    numeroHasta: string;
    cantidadImprimir: number;
    impresora: string;
    motivo: string;
  }
  const initialStateVar = {
    ultimoNumeroImpreso: 0,
    numeroDesde: "",
    numeroHasta: "",
    cantidadImprimir: 0,
    impresora: "",
    motivo: ""
  };

  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    strartPrint();
  }, []);

  const watchNumeroHasta = watch("numeroHasta");
  const watchNumeroDesde = watch("numeroDesde");

  //OnChange de input "NumeroHasta" para setear input "CantidadImprimir"
  useEffect(() => {
    const numeroDesde = parseInt(getValues("numeroDesde"));
    const numeroHasta = parseInt(getValues("numeroHasta"));
    const total = numeroHasta - numeroDesde + 1;
    if (total >= 0) setValue("cantidadImprimir", total);
    else setValue("cantidadImprimir", 0);
  }, [watchNumeroHasta]);

  //OnChange de input "NumeroDesde" para setear input "CantidadImprimir"
  useEffect(() => {
    const numeroDesde = getValues("numeroDesde");
    const numeroHasta = getValues("numeroHasta");
    const total = parseInt(numeroHasta) - parseInt(numeroDesde) + 1;
    if (total >= 0) setValue("cantidadImprimir", total);
    else setValue("cantidadImprimir", 0);
  }, [watchNumeroDesde]);

  const blanquearInputs = () => {
    setValue("ultimoNumeroImpreso", 0);
    setValue("numeroDesde", "");
    setValue("numeroHasta", "");
    setValue("cantidadImprimir", 0);
    setValue("motivo", "");
    setValue("impresora", "");
  };

  function savePrintersList(printers) {
    let arrayOfPrinters = [];
    arrayOfPrinters = Object.values(printers);
    setPrinters(arrayOfPrinters);
  }

  const strartPrint = async () => {
    JSPrintManager.auto_reconnect = true;
    JSPrintManager.start();
  };

  function errorCallback() {
    openNotificationUI("Hubo un problema al obtener las impresoras.", "error");
  }

  const getPrints = async () => {
    JSPrintManager.getPrinters().then(savePrintersList, errorCallback);
  };

  const buscoCorrecto = (busquedaOk) => {
    setBusquedaCorrecta(busquedaOk);
    if (busquedaOk == false) {
      blanquearInputs();
    } else getPrints();
  };

  //Si el tipo de etiqueta, el inicioEBS = true, y no se encontraron impresiones, tiene q empezar de 1000. Pero si es false, arranca de 1.
  const verificarComienzoNumeracion = async (num) => {
    const result = unwrapResult(await dispatch(ZPL_TipoEtiquetasSliceRequests.getAllRequest()));
    const tipoEtiqueta = result.find((x) => x.id == etiquetaSeleccionada.tipoEtiqueta);
    if (tipoEtiqueta.inicioEBS == true) {
      setUltimoNumeroImpresoDefinitivo(1000);
    } else setUltimoNumeroImpresoDefinitivo(num);
  };

  const setUltNumImpreso = (num) => {
    if (num == 0) verificarComienzoNumeracion(num);
    else setUltimoNumeroImpresoDefinitivo(num);
    setValue("ultimoNumeroImpreso", num);
  };

  //State para tener el objeto de la etiqueta seleccionada.
  const setEtiquetaSeleccionadaFuncion = (objetoEtiqueta) => {
    setEtiquetaSeleccionada(objetoEtiqueta);
  };

  //State para tener el objeto del producto seleccionado
  const setProductoSeleccionadoFuncion = (objetoProducto) => {
    setProductoSeleccionado(objetoProducto);
  };

  //State para tener el objeto de la familia seleccionada.
  const setFamiliaSeleccionadaFuncion = (objetoFamilia) => {
    setFamiliaSeleccionada(objetoFamilia);
  };

  const completoCampos = () => {
    if (
      getValues("impresora") &&
      getValues("cantidadImprimir") &&
      getValues("numeroDesde") &&
      getValues("numeroHasta") &&
      getValues("motivo")
    ) {
      console.log("Primer validacion ok");
    } else {
      openNotificationUI("Elija Numeración, Impresora,  Cantidad a Imprimir y Motivo.", "warning");
      return false;
    }
    if (getValues("numeroDesde") > getValues("numeroHasta")) {
      openNotificationUI("El numero desde no puede ser mayor al hasta.", "warning");
      return false;
    }
    if (
      parseInt(getValues("numeroDesde")) > getValues("ultimoNumeroImpreso") ||
      parseInt(getValues("numeroHasta")) > getValues("ultimoNumeroImpreso")
    ) {
      openNotificationUI(
        "Verifique el rango a imprimir ingresado. Solo se pueden ingresar rangos que ya han sido impresos",
        "warning"
      );
      return false;
    } else return true;
  };

  const emergenteConfirmacion = async () => {
    return await getConfirmation(
      "Impresion de etiquetas",
      "Se imprimiran " +
        getValues("cantidadImprimir") +
        " (x " +
        etiquetaSeleccionada.cantidadPosiciones +
        " c/u) etiquetas " +
        etiquetaSeleccionada.descripcionEtiqueta +
        " para el modelo " +
        productoSeleccionado.codigoEBS +
        ". ¿Desea Continuar ? "
    );
  };

  const armarCodigoZpl = async () => {
    const desdeNumero: number = parseInt(getValues("numeroDesde"));
    const hastaNumero: number = parseInt(getValues("numeroHasta"));
    let preFijoOk: string = etiquetaSeleccionada.prefijo != null ? etiquetaSeleccionada.prefijo : "";
    const month = moment().month() + 1;
    preFijoOk = preFijoOk.replace("xx", month.toString().padStart(2, "0"));

    const acepta = await emergenteConfirmacion();
    if (!acepta) return;

    let zpl: string = etiquetaSeleccionada.zpl;
    const fechaSerieOk: string =
      moment().year().toString().substring(2, 3) + month * 4 + moment().year().toString().substring(2, 3);
    const familiaOk: string = productoSeleccionado.tipoEquipo + familiaSeleccionada.codigoFamilia;
    const fecha = moment().day() + "/" + month + "/" + moment().year();
    zpl = zpl
      .replace("&&fecha&&", fecha)
      .replace("&&hora&&", moment().format("hh:mm"))
      .replace("&&producto&&", productoSeleccionado.codigoEBS)
      .replace("&&prefijo&&", preFijoOk)
      .replace("&&fechaSerie&&", fechaSerieOk)
      .replace("&&familia&&", familiaOk);
    let zplDefinitivo = "";
    let zplAux = "";
    //Recorro las cantidades y voy insertando
    if (ascendente) {
      for (let i = desdeNumero; i <= hastaNumero; i++) {
        for (let j = 0; j < etiquetaSeleccionada.cantidadPosiciones; j++) {
          zplAux = zpl
            .replace("&&serieBarras&&", productoSeleccionado.prefijoEBS + i.toString().padStart(10, "0"))
            .replace("&&serieShort&&", i.toString().padStart(5, "0"))
            .replace("&&rfidTexto&&", "AA6000001" + productoSeleccionado.prefijoEBS + i.toString().padStart(10, "0"))
            .replace("&&rfid&&", "AA6000001" + productoSeleccionado.prefijoEBS + i.toString().padStart(10, "0"));
          zplDefinitivo = zplDefinitivo + "\n" + zplAux;
        }
      }
    } else {
      for (let i = hastaNumero; i >= desdeNumero; i--) {
        for (let j = 0; j < etiquetaSeleccionada.cantidadPosiciones; j++) {
          zplAux = zpl
            .replace("&&serieBarras&&", productoSeleccionado.prefijoEBS + i.toString().padStart(10, "0"))
            .replace("&&serieShort&&", i.toString().padStart(5, "0"))
            .replace("&&rfidTexto&&", "AA6000001" + productoSeleccionado.prefijoEBS + i.toString().padStart(10, "0"))
            .replace("&&rfid&&", "AA6000001" + productoSeleccionado.prefijoEBS + i.toString().padStart(10, "0"));
          zplDefinitivo = zplDefinitivo + "\n" + zplAux;
        }
      }
    }

    return zplDefinitivo;
  };

  const armarObjetoReImpresion = () => {
    const user = GetInfoUser();

    const reImpresion = {
      idEtiqueta: etiquetaSeleccionada.id,
      numeradorDesde: parseInt(getValues("numeroDesde")),
      numeradorHasta: parseInt(getValues("numeroHasta")),
      impresoFecha: moment().format(),
      idUsuario: user.id,
      idProducto: productoSeleccionado.id,
      idFamilia: familiaSeleccionada.id,
      tipoEtiqueta: etiquetaSeleccionada.tipoEtiqueta,
      motivo: getValues("motivo")
    };
    return reImpresion;
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

  //Do printing...
  function printOk(namePrinter: string, codeZpl: string) {
    try {
      if (jspmWSStatus()) {
        //Create a ClientPrintJob
        const cpj = new ClientPrintJob();
        //Set Printer type (Refer to the help, there many of them!)
        cpj.clientPrinter = new InstalledPrinter(namePrinter);
        //Set content to print...
        //Create Zebra ZPL commands for sample label
        cpj.printerCommands = codeZpl;
        console.log("codigo zpl");
        console.log(codeZpl);

        //Send print job to printer!
        cpj.sendToClient();
        console.log("imprimi correctamente! ");
        return true;
      }
    } catch {
      openNotificationUI("Hubo un problema al enviar la impresion", "error");
      return false;
    }
  }

  const registrarReImpresion = async () => {
    const objetoReImpresion = armarObjetoReImpresion();
    console.log("objeto reimpresion a guardar");
    console.log(objetoReImpresion);
    let result;
    try {
      result = unwrapResult(await dispatch(ZPL_ReimpresionesSliceRequests.postRequest(objetoReImpresion)));
    } catch {
      result = null;
    }
    if (result) {
      openNotificationUI("Reimpresion registrada con exito :)", "success");
      setBusquedaCorrecta(false); // Para que tenga que volver a presionar buscar y actualize los datos.
      blanquearInputs();
    } else openNotificationUI("Hubo un problema al guardar la reimpresion", "error");
  };

  const print = async () => {
    if (completoCampos()) {
      const codiZpl: string = await armarCodigoZpl();
      const imprimioOk = printOk(getValues("impresora"), codiZpl);
      if (imprimioOk) {
        registrarReImpresion();
      } else openNotificationUI("Hubo un problema al guardar la reimpresion", "error");
    }
  };

  return (
    <div className="p-2">
      <EncabezadoParametrosImpresion
        setUltNumImpreso={setUltNumImpreso}
        setEtiquetaSeleccionadaFuncion={setEtiquetaSeleccionadaFuncion}
        setProductoSeleccionadoFuncion={setProductoSeleccionadoFuncion}
        setFamiliaSeleccionadaFuncion={setFamiliaSeleccionadaFuncion}
        buscoCorrecto={buscoCorrecto}></EncabezadoParametrosImpresion>
      <div>
        {busquedaCorrecta && (
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
            <div className="sm:flex items-center justify-around w-full font-semibold">
              {/* ----------------NUMERO OP---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="ultimoNumeroImpreso"
                  control={control}
                  //defaultValue={null}
                  render={({ field }) => (
                    <TextField type="number" disabled label="Último número impreso" {...field} variant="standard" />
                  )}
                />
              </div>
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="numeroDesde"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputProps={{ inputMode: "numeric" }}
                      label="Número desde"
                      {...field}
                      variant="standard"
                      type="number"
                    />
                  )}
                />
              </div>
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="numeroHasta"
                  control={control}
                  render={({ field }) => <TextField type="number" label="Número hasta" {...field} variant="standard" />}
                />
              </div>
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="cantidadImprimir"
                  control={control}
                  //defaultValue={null}
                  render={({ field }) => (
                    <TextField type="number" disabled label="Cantidad a imprimir" {...field} variant="standard" />
                  )}
                />
              </div>
            </div>
            <div className="grid col-span-1 sm:grid-cols-2 gap-8 text-center bg-secondaryNew rounded-md p-2 items-center">
              <div>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" className="text-center">
                    Numeración
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={"descendente"}
                    onChange={(e, val) => (val == "ascendente" ? setAscendente(true) : setAscendente(false))}>
                    <FormControlLabel value="ascendente" control={<Radio />} label="Ascendente" />
                    <FormControlLabel value="descendente" control={<Radio />} label="Descendente" />
                  </RadioGroup>
                </FormControl>
              </div>
              <div>
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
              </div>
            </div>
            <div className="grid col-span-1 sm:grid-cols-2 gap-8 text-center bg-secondaryNew rounded-md p-2 items-center">
              <div>
                <Controller
                  name="motivo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField id="outlined-multiline-flexible" {...field} label="Motivo" multiline />
                    </FormControl>
                  )}
                />
              </div>
              <div>
                <Button
                  onClick={() => {
                    print();
                  }}
                  variant="outlined"
                  startIcon={<Print />}>
                  Imprimir
                </Button>
              </div>
            </div>
          </div>
        )}
        <Divider></Divider>
        {busquedaCorrecta && (
          <TableImpresiones etiqueta={etiquetaSeleccionada} producto={productoSeleccionado}></TableImpresiones>
        )}
      </div>
    </div>
  );
};
