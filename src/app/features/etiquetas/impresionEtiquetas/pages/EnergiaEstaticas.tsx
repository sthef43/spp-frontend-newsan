import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Controller, useForm } from "react-hook-form";
import { ZPL_TipoEtiquetasSliceRequests } from "app/Middleware/reducers/ZPL_TipoEtiquetasSlice";
import { ZPL_EtiquetaFijaSliceRequests } from "app/Middleware/reducers/ZPL_EtiquetaFijaSlice";
import { ClientPrintJob, InstalledPrinter, JSPrintManager, WSStatus } from "jsprintmanager";
import { ZPL_ImpresionesSliceRequests } from "app/Middleware/reducers/ZPL_ImpresionesSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { IAppUser } from "app/models";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { CargaEtiquetasFijaForm } from "app/features/etiquetas/impresionEtiquetas/modals/CargaEtiquetasFijaForm";
import { ZPL_ImpresionesEtiquetaFijaSliceRequests } from "app/Middleware/reducers/ZPL_ImpresionesEtiquetaFijaSlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Print } from "@mui/icons-material";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

/* interface props {}
 */
/* export const EnergiaEstaticas = ({}: props) => { */
export const EnergiaEstaticas = () => {
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
        //Create a ClientPrintJob
        const cpj = new ClientPrintJob();
        //Set Printer type (Refer to the help, there many of them!)
        cpj.clientPrinter = new InstalledPrinter(namePrinter);
        //Set content to print...
        //Create Zebra ZPL commands for sample label
        cpj.printerCommands = codeZpl;
        //Send print job to printer!
        cpj.sendToClient();
        console.log("El codigo que recibo en el printok");

        console.log(codeZpl);
        return true;
      }
    } catch {
      openNotificationUI("Hubo un problema al enviar la impresion", "error");
      return false;
    }
  }

  useEffect(() => {
    TitleChanger("Energia Estaticas");
  }, []);

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [tipoEtiquetas, setTipoEtiquetas] = useState([]);
  const [productos, setProductos] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [etiquetas, setEtiquetas] = useState([]);
  const [printers, setPrinters] = useState(null);
  const [listImpresionesEtiquetasFijas, setListImpresionesEtiquetasFijas] = useState([]);
  const [modalOpenCargaEtiquetaFija, setModalOpenCargaEtiquetaFija] = useState(false);

  interface initialState {
    tipoEtiquetaId: number;
    tipoUnidad: number;
    etiquetaFijaId: number;
    impresora: string;
    cantidadImprimir: number;
  }
  const initialStateVar = {
    tipoEtiquetaId: 0,
    tipoUnidad: 0,
    etiquetaFijaId: 0,
    impresora: "",
    cantidadImprimir: 0
  };
  const { control, getValues, watch, setValue } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const watchEtiquetaFijaId = watch("etiquetaFijaId");
  const watchTipoEtiquetaId = watch("tipoEtiquetaId");

  useEffect(() => {
    TitleChanger("Impresion de etiquetas");
    getListGeneric(ZPL_TipoEtiquetasSliceRequests.getListByEstadoRequest("estatico"), setTipoEtiquetas);
    getAppUsers();
    strartPrint();
  }, []);

  useEffect(() => {
    setBuscoCorrecto(false);
    setListImpresionesEtiquetasFijas([]); //nulleo el listado para que no se muestre info ya que cambio el tipo de etiqueta.
  }, [watchTipoEtiquetaId]);

  useEffect(() => {
    setBuscoCorrecto(false);
    setListImpresionesEtiquetasFijas([]);
  }, [watchEtiquetaFijaId]);

  useEffect(() => {
    if (watchEtiquetaFijaId > 0) {
      if (!printers) {
        getPrints();
      }
    }
  }, [watchEtiquetaFijaId]);

  const getListGeneric = async (funcionSlice, set) => {
    const responses = unwrapResult(await dispatch(funcionSlice));
    set(JSON.parse(JSON.stringify(responses)));
  };

  //Traigo las etiquetasFijas que las uso en el select2 de Modelo.
  const getEtiquetasFijas = async () => {
    const tipoEtiquetaId = getValues("tipoEtiquetaId");
    const result = unwrapResult(await dispatch(ZPL_EtiquetaFijaSliceRequests.getListByTipoEtiquetaId(tipoEtiquetaId)));
    if (result) {
      setEtiquetas(result);
    }
  };

  const armarObjetoImpresion = () => {
    const user = GetInfoUser();

    const impresion = {
      idEtiqueta: null, //No va. los q estan null se usan cuando imprimis una etiqueta dinamica
      numeradorDesde: 1,
      numeradorHasta: getValues("cantidadImprimir"),
      impresoFecha: moment().format(),
      idUsuario: user.id,
      idProducto: null, //no va.
      idFamilia: null, //No va,
      prefijo: null,
      tipoEtiqueta: getValues("tipoEtiquetaId")
    };
    return impresion;
  };

  //Registra la impresion en la tabla intermedia de imprsiones y etiqueta fija.
  const registrarImpresionEtiquetaFija = async (objetoImpresion) => {
    console.log(objetoImpresion);

    const objetoImpresionEtiquetaFija = {
      ZPL_ImpresionesId: objetoImpresion.id,
      ZPL_EtiquetaFijaId: getValues("etiquetaFijaId")
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
      handleSearch(); //Para que se refresque el listadode impresiones
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
    if (getValues("cantidadImprimir") == 0) {
      openNotificationUI("Elija Cantidad mayor a 0.", "warning");
      return false;
    }
    return true;
  };

  const armarCodigoZpl = (zpl) => {
    const cantidadImpresion = getValues("cantidadImprimir");
    let zplDefinitivo = "";
    for (let i = 1; i <= cantidadImpresion; i++) {
      zplDefinitivo = zplDefinitivo + "\n" + zpl;
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

  const print = async () => {
    if (!completoCampos()) return false;
    const etiquetaFija = etiquetas.find((x) => x.id == watchEtiquetaFijaId);
    const acepta = await emergenteConfirmacion(etiquetaFija.modelo);
    if (!acepta) return false;
    const codiZpl = armarCodigoZpl(etiquetaFija.zpl);
    const imprimioOk = printOk(getValues("impresora"), codiZpl);
    if (imprimioOk) {
      registrarImpresion();
    } else {
      openNotificationUI("Hubo un problema al imprimir", "error");
    }
  };

  const [buscoCorrecto, setBuscoCorrecto] = useState(false);

  const handleSearch = async () => {
    if (!watchEtiquetaFijaId) {
      openNotificationUI("Debe seleccionar una etiqueta fija.", "warning");
      setBuscoCorrecto(false);
      return false;
    }
    const result = unwrapResult(
      await dispatch(ZPL_ImpresionesEtiquetaFijaSliceRequests.getListByEtiquetaFijaId(watchEtiquetaFijaId))
    );
    if (result.length > 0) {
      setBuscoCorrecto(true);
      setListImpresionesEtiquetasFijas(result);
    } else {
      setBuscoCorrecto(false);
      setListImpresionesEtiquetasFijas([]);
    }
  };

  const [appUsers, setAppUsers] = useState([]);
  const getAppUsers = async () => {
    let result: Array<IAppUser> = [];
    result = unwrapResult(await dispatch(AppUserSliceRequests.getAllRequest()));
    if (result) {
      setAppUsers(result);
    } else setAppUsers([]);
  };

  const getUser = (row) => {
    const userSelected = appUsers.find((x) => x.id == row.zpL_Impresiones.idUsuario);
    if (userSelected) return userSelected.operator.name + " " + userSelected.operator.surname;
  };
  const setTipoEtiqueta = () => {
    const idEtiqueta = tipoEtiquetas.find((etiqueta) => etiqueta.descripcionTipoEtiqueta == "Eficiencia estaticas")?.id;
    if (idEtiqueta) {
      setValue("tipoEtiquetaId", idEtiqueta);
      getEtiquetasFijas();
    }
  };

  useEffect(() => {
    tipoEtiquetas.length > 0 && setTipoEtiqueta();
  }, [tipoEtiquetas]);

  return (
    <div className="p-2">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-4 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          <div>
            {tipoEtiquetas && (
              <Controller
                name="tipoEtiquetaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Tipo Etiqueta</InputLabel>
                    <Select {...field} variant="standard" onClick={getEtiquetasFijas} disabled>
                      {tipoEtiquetas &&
                        tipoEtiquetas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.descripcionTipoEtiqueta}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
          <div>
            {etiquetas && (
              <Controller
                name="etiquetaFijaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Modelo</InputLabel>
                    <Select {...field} variant="standard">
                      {etiquetas &&
                        etiquetas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.modelo}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
          <div>
            <Button color="success" className={classes.blueButton} variant="contained" onClick={handleSearch}>
              Buscar
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setModalOpenCargaEtiquetaFija(true);
              }}
              className={classes.purpleButton}>
              Cargar Modelo
            </Button>
          </div>
        </div>

        <div className="grid col-span-1 sm:grid-cols-3 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
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
            <Controller
              name="cantidadImprimir"
              control={control}
              defaultValue={0}
              render={({ field }) => <TextField label="Cantidad a imprimir" {...field} variant="standard" />}
            />
          </div>
          <div>
            <Button onClick={print} className={classes.redButton} startIcon={<Print />}>
              Imprimir
            </Button>
          </div>
        </div>
      </form>
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
        dataInfo={listImpresionesEtiquetasFijas}
      />
      <ModalCompoment
        title={"Carga de Etiquetas Fijas"}
        openPopup={modalOpenCargaEtiquetaFija}
        setOpenPopup={setModalOpenCargaEtiquetaFija}>
        <CargaEtiquetasFijaForm setOpenPopup={setModalOpenCargaEtiquetaFija} callback={getEtiquetasFijas} />
      </ModalCompoment>
    </div>
  );
};
