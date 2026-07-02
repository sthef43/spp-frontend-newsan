import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { ClientPrintJob, InstalledPrinter, JSPrintManager, WSStatus } from "jsprintmanager";
import { ZPL_ImpresionesSliceRequests } from "app/Middleware/reducers/ZPL_ImpresionesSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { IAppUser } from "app/models";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ZPL_ImpresionesEtiquetaFijaSliceRequests } from "app/Middleware/reducers/ZPL_ImpresionesEtiquetaFijaSlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Print } from "@mui/icons-material";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { CargaEtiquetasHibridasForm } from "app/features/etiquetas/impresionEtiquetas/modals/CargaEtiquetasHibridasForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IZPL_EtiquetaFija } from "app/models/IZPL_EtiquetaFija";
import { EncabezadoParametrosImpresionEstaticaHibrida } from "app/features/etiquetas/impresionEtiquetas/components/EncabezadoParametrosImpresionEstaticaHibrida";
import { IZPL_TipoEtiquetas } from "app/models/IZPL_TipoEtiquetas";

/* interface props {}
 */
/* export const EnergiaEstaticas = ({}: props) => { */
export const Hibridas = () => {
  const strartPrint = async () => {
    JSPrintManager.auto_reconnect = true;
    JSPrintManager.start();
  };

  function savePrintersList(printers) {
    let arrayOfPrinters = [];
    arrayOfPrinters = Object.values(printers);
    setPrinters(arrayOfPrinters);
  }

  function errorCallback() {
    openNotificationUI("Hubo un problema al obtener las impresoras.", "error");
  }

  const getPrints = async () => {
    JSPrintManager.getPrinters().then(savePrintersList, errorCallback);
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
        const cpj = new ClientPrintJob();
        cpj.clientPrinter = new InstalledPrinter(namePrinter);
        cpj.printerCommands = codeZpl;
        cpj.sendToClient();
        return true;
      }
    } catch {
      openNotificationUI("Hubo un problema al enviar la impresion", "error");
      return false;
    }
  }

  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger("Etiquetas de Modelo");
  }, []);

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const [tipoEtiquetas, setTipoEtiquetas] = useState<IZPL_TipoEtiquetas>(null);
  const [productos, setProductos] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [printers, setPrinters] = useState(null);
  const [listImpresionesEtiquetasFijas, setListImpresionesEtiquetasFijas] = useState([]);
  const [modalOpenCargaEtiqueta, setModalOpenCargaEtiqueta] = useState(false);
  const [ultimoNumImpreso, setUltimoNumImpreso] = useState(0);

  interface initialState {
    tipoEtiquetaId: number;
    tipoUnidad: number;
    etiquetaFijaId: number;
    impresora: string;
    desde: number;
    hasta: number;
    cantidadImprimir: string;
    ultimoNumeroImprimir: number;
    ultimoNumeroImpreso: number;
  }
  const initialStateVar = {
    tipoEtiquetaId: 0,
    tipoUnidad: 0,
    etiquetaFijaId: 0,
    impresora: "",
    desde: 0,
    hasta: 0,
    cantidadImprimir: "",
    ultimoNumeroImprimir: 0,
    ultimoNumeroImpreso: 0
  };
  const { control, getValues, watch, setValue } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    setValue("ultimoNumeroImpreso", ultimoNumImpreso);
  }, [ultimoNumImpreso]);

  const watchEtiquetaFijaId = watch("etiquetaFijaId");
  const watchTipoEtiquetaId = watch("tipoEtiquetaId");
  const watchCantidadImprimir = watch("cantidadImprimir");

  //OnChange de input "CantidadImprimir" para setear input "ultimoNumeroImprimir"
  useEffect(() => {
    const cantidadImprimir = getValues("cantidadImprimir");
    const cantidadImprimirAux = cantidadImprimir ? cantidadImprimir : "0";
    setValue("ultimoNumeroImprimir", ultimoNumImpreso + parseInt(cantidadImprimirAux));
  }, [watchCantidadImprimir]);

  useEffect(() => {
    getAppUsers();
    strartPrint();
  }, []);

  useEffect(() => {
    setListImpresionesEtiquetasFijas([]); //nulleo el listado para que no se muestre info ya que cambio el tipo de etiqueta.
  }, [watchTipoEtiquetaId]);

  useEffect(() => {
    setListImpresionesEtiquetasFijas([]);
  }, [watchEtiquetaFijaId]);

  useEffect(() => {
    if (watchEtiquetaFijaId > 0) {
      if (!printers) {
        getPrints();
      }
    }
  }, [watchEtiquetaFijaId]);

  const armarObjetoImpresion = () => {
    const user = GetInfoUser();

    const impresion = {
      idEtiqueta: null, //No va. los q estan null se usan cuando imprimis una etiqueta dinamica
      numeradorDesde: ultimoNumImpreso + 1,
      numeradorHasta: getValues("ultimoNumeroImprimir"),
      impresoFecha: moment().format(),
      idUsuario: user.id,
      idProducto: null, //no va.
      idFamilia: null, //No va,
      prefijo: null,
      tipoEtiqueta: tipoEtiquetas.id
    };
    return impresion;
  };

  //Registra la impresion en la tabla intermedia de imprsiones y etiqueta fija.
  const registrarImpresionEtiquetaFija = async (objetoImpresion) => {
    const objetoImpresionEtiquetaFija = {
      ZPL_ImpresionesId: objetoImpresion.id,
      ZPL_EtiquetaFijaId: etiquetaFija.id
    };
    let result;
    try {
      result = unwrapResult(
        await dispatch(ZPL_ImpresionesEtiquetaFijaSliceRequests.postRequest(objetoImpresionEtiquetaFija))
      );
    } catch {
      result = null;
    }
    if (result) {
      openNotificationUI("Impresion registrada con exito :)", "success");
      getListImpresiones();
    } else openNotificationUI("Hubo un problema al guardar la impresion", "error");
  };

  //Registro la impresion en ZPL_Impresiones
  const registrarImpresion = async () => {
    const objetoImpresion = armarObjetoImpresion();
    let result;
    try {
      result = unwrapResult(await dispatch(ZPL_ImpresionesSliceRequests.postRequest(objetoImpresion)));
    } catch {
      result = null;
    }
    if (result) {
      registrarImpresionEtiquetaFija(result);
    } else openNotificationUI("Hubo un problema al guardar la impresion", "error");
  };

  const completoCampos = () => {
    if (getValues("impresora") == "") {
      openNotificationUI("Elija Impresora", "warning");
      return false;
    }

    if (parseInt(getValues("cantidadImprimir")) == 0 || !getValues("cantidadImprimir")) {
      openNotificationUI("Elija Cantidad a imprimir.", "warning");
      return false;
    }
    return true;
  };

  const getPrefijo = async () => {
    return "29384";
  };

  const armarCodigoZpl = async (etiquetaFija: IZPL_EtiquetaFija) => {
    const desdeNumero: number = ultimoNumImpreso + 1;
    const hastaNumero: number = getValues("ultimoNumeroImprimir");
    let zplDefinitivo = "";
    const preFijoOk = etiquetaFija.preFijo != null ? etiquetaFija.preFijo : await getPrefijo();
    let zpl = etiquetaFija.zpl;
    zpl = zpl.replace("&&preFijo&&", preFijoOk); //Lo hago 2 veces, por que 1 reemplaza el codigo interno y el otro es para el codigo que se muestra
    zpl = zpl.replace("&&preFijo&&", preFijoOk);
    let zplAux = "";
    for (let i = hastaNumero; i >= desdeNumero; i = i - 1) {
      zplAux = zpl.replace("&&serieShort&&", i.toString().padStart(10, "0"));
      zplAux = zplAux.replace("&&serieShort&&", i.toString().padStart(10, "0"));
      //zplAux = zpl.replace("&&serieShort&&", "101010101010");
      zplDefinitivo = zplDefinitivo + "\n" + zplAux;
    }
    return zplDefinitivo;
  };

  const { getConfirmation } = useConfirmationDialog();

  const emergenteConfirmacion = async (modelo) => {
    return await getConfirmation(
      "Impresion de etiquetas",
      "Se imprimiran " + getValues("cantidadImprimir") + " etiquetas para el modelo " + modelo + ". ¿Desea Continuar ? "
    );
  };

  //State para tener el objeto de la etiqueta fija (Modelo Select2) seleccionada.
  const setEtiquetaFijaSeleccionadaFuncion = (objetoEtiqueta) => {
    setEtiquetaFija(objetoEtiqueta);
  };

  //State para tener el objeto de la etiqueta fija (Modelo Select2) seleccionada.
  const setTipoEtiquetaSeleccionadaFuncion = (objetoTipoEtiqueta: IZPL_TipoEtiquetas) => {
    setTipoEtiquetas(objetoTipoEtiqueta);
  };

  const print = async () => {
    if (!completoCampos()) return false;
    const acepta = await emergenteConfirmacion(etiquetaFija.modelo);
    if (!acepta || acepta != true) return false;
    const codiZpl = await armarCodigoZpl(etiquetaFija);
    console.log(codiZpl);
    /* const imprimioOk = printOk(getValues("impresora"), codiZpl);
    if (imprimioOk) {
      registrarImpresion();
    } */
  };

  const [appUsers, setAppUsers] = useState([]);
  const getAppUsers = async () => {
    let result: Array<IAppUser> = [];
    result = unwrapResult(await dispatch(AppUserSliceRequests.getAllRequest()));
    if (result) {
      setAppUsers(result);
    } else setAppUsers([]);
  };

  //Para ver el nombre d ela persona que imprimio
  const getUser = (row) => {
    const userSelected = appUsers.find((x) => x.id == row.zpL_Impresiones.idUsuario);
    if (userSelected) return userSelected.operator.name + " " + userSelected.operator.surname;
  };

  const [etiquetaFija, setEtiquetaFija] = useState(null);

  const blanquearInputs = () => {
    setValue("cantidadImprimir", "");
    setValue("ultimoNumeroImprimir", 0);
    setValue("impresora", "");
  };

  const [busquedaCorrecta, setBusquedaCorrecta] = useState(false);
  const buscoCorrecto = (busquedaOk) => {
    setBusquedaCorrecta(busquedaOk);
    if (busquedaOk == false) {
      blanquearInputs();
    } else getPrints();
  };
  const [listEtiquetasFijas, setListEtiquetasFijas] = useState(null);

  const getListImpresiones = async () => {
    let result = [];
    result = unwrapResult(
      await dispatch(ZPL_ImpresionesEtiquetaFijaSliceRequests.getListByEtiquetaFijaId(etiquetaFija.id))
    );
    if (result) {
      //Si hay impresiones, obtengo el ultimo numero impreso.
      setListEtiquetasFijas(result);
      if (result.length > 0) {
        const ultimoRegistroImpreso = result[0].zpL_Impresiones?.numeradorHasta;
        setUltimoNumImpreso(ultimoRegistroImpreso);
      } else setUltimoNumImpreso(0);
    } else setUltimoNumImpreso(0);
    blanquearInputs();
  };

  const [refreshModelos, setRefreshModelos] = useState(false);

  const funcitonRefreshModelos = (bool) => {
    setRefreshModelos(bool);
  };

  return (
    <div className="p-2">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "space-around",
          justifyContent: "space-around",
          alignItems: "baseline"
        }}>
        <div style={{ width: "2000px" }}>
          <EncabezadoParametrosImpresionEstaticaHibrida
            setUltimoNumImpreso={setUltimoNumImpreso}
            setEtiquetaFijaSeleccionadaFuncion={setEtiquetaFijaSeleccionadaFuncion}
            setTipoEtiquetaSeleccionadaFuncion={setTipoEtiquetaSeleccionadaFuncion}
            buscoCorrecto={buscoCorrecto}
            setListEtiquetasFijas={setListEtiquetasFijas}
            refreshModelos={refreshModelos}></EncabezadoParametrosImpresionEstaticaHibrida>
        </div>
        <div>
          <Button
            onClick={() => {
              setModalOpenCargaEtiqueta(true);
            }}
            className={classes.purpleButton}>
            Cargar Modelo
          </Button>
        </div>
      </div>
      {busquedaCorrecta && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
          <div className="sm:flex items-center justify-around w-full font-semibold">
            <div className="text-center sm:text-left p-2">
              <Controller
                name="ultimoNumeroImpreso"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <TextField disabled label="Último número impreso" {...field} variant="standard" />
                )}
              />
            </div>
            <div className="text-center sm:text-left p-2">
              <Controller
                name="cantidadImprimir"
                control={control}
                render={({ field }) => <TextField label="Cantidad a imprimir" {...field} variant="standard" />}
              />
            </div>
            <div className="text-center sm:text-left p-2">
              <Controller
                name="ultimoNumeroImprimir"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <TextField disabled label="Ultimo numero a imprimir" {...field} variant="standard" />
                )}
              />
            </div>
          </div>
          <div className="grid col-span-1 sm:grid-cols-3 gap-8 text-center bg-secondaryNew rounded-md p-2 items-center">
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
      {listImpresionesEtiquetasFijas != null ? (
        <TitleUIComponent title="IMPRESIONES HISTORICAS" classNameDiv="" classNameTitle="" />
      ) : (
        ""
      )}
      <TableComponent
        Dense={true}
        Overflow={false}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Modelo",
            field: "zpL_EtiquetaFija.modelo"
          },
          {
            title: "Tipo Unidad",
            field: "zpL_EtiquetaFija.tipoUnidad"
          },
          {
            title: "Numero Desde",
            field: "zpL_Impresiones.numeradorDesde"
          },
          {
            title: "Numero Hasta",
            field: "zpL_Impresiones.numeradorHasta"
          },
          {
            title: "Cantidad",
            field: "",
            render: (row) => {
              return parseInt(row.zpL_Impresiones.numeradorHasta) - parseInt(row.zpL_Impresiones.numeradorDesde) + 1;
            }
          },
          {
            title: "Usuario",
            field: "",
            render: (row) => {
              return getUser(row);
            }
          },
          {
            title: "Fecha Impresion",
            field: "",
            render: (row) => {
              return moment(row?.zpL_Impresiones.impresoFecha).format("L");
            }
          }
        ]}
        dataInfo={listEtiquetasFijas}
      />
      <ModalCompoment
        title={"Carga de Etiquetas Hibridas"}
        openPopup={modalOpenCargaEtiqueta}
        setOpenPopup={setModalOpenCargaEtiqueta}>
        <CargaEtiquetasHibridasForm setOpenPopup={setModalOpenCargaEtiqueta} callback={funcitonRefreshModelos} />
      </ModalCompoment>
    </div>
  );
};
