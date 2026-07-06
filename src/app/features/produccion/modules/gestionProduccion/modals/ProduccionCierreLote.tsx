import React from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IPlanProd } from "app/models/IPlanProd";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { IControlLote } from "app/models/IControlLote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import {
  Accordion,
  AccordionSummary,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { IInicio } from "app/models/IInicio";
import { AccordionDetails } from "@mui/material";
import { ProduccionRechazados } from "../../../components/ProduccionRechazados";
import { ILinea } from "app/models/ILinea";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { IPedidoCierreLote } from "app/models/IPedidoCierreLote";
import { PedidoCierreLoteSliceRequests } from "app/Middleware/reducers/PedidoCierreLoteSlice";
import { IAppUser, ISuperCargalinea } from "app/models";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { IPedidoMaterialesProduccion } from "app/models/IPedidoMaterialesProduccion";
import { PedidoMaterialesProduccionSliceRequests } from "app/Middleware/reducers/PedidoMaterialesProduccionSlice";
import { IPlanProdMateriales } from "app/models/IPlanProdMateriales";
import { PlanProdMaterialesSliceRequests } from "app/Middleware/reducers/PlanProdMaterialesSlice";
import _ from "lodash";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { MaterialesDialog } from "app/features/calidad/components/MaterialesDialog";

interface props {
  id: number;
  setOpenPopup: any;
  callback: any;
  devolucion?: string;
  cierreCondicional?: boolean;
  esGerencia?: boolean;
  selectedPedidoCierre?: IPedidoCierreLote;
  declarado?: number;
  estado?: number;
}

const defaultValues = {
  turnoRadioButton: "M",
  solicitudRadioButton: "C",
  observaciones: "",
  devolucion: ""
};

export const ProduccionCierreLote = ({
  id,
  setOpenPopup,
  callback,
  devolucion = "",
  cierreCondicional = false,
  esGerencia = false,
  selectedPedidoCierre,
  declarado,
  estado
}: props): JSX.Element => {
  console.log(estado);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const { State: datosPlanProd } = useFetchApi<IPlanProd>(PlanProdSliceRequests.getByIdRequest, id);
  const [datosControlLote, setdatosControlLote] = React.useState<IControlLote[]>([]);
  const [modalMateriales, setModalMateriales] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [addMatDisable, setAddMatDisable] = React.useState(false);
  const [errorDevolucion, setErrorDevolucion] = React.useState("");
  const [errorObservacion, setErrorObservacion] = React.useState("");
  const [selectedMaterial, setSelectedMaterial] = React.useState<ISuperCargalinea[]>([]);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const [datosLinea, setLinea] = React.useState<ILinea>();
  const { control, watch, getValues, setValue } = useForm({ defaultValues });

  const solicitud = watch("solicitudRadioButton");
  const watchDevolucion = watch("devolucion");
  const watchObservacion = watch("observaciones");

  const onInit = async () => {
    const fetchResult = unwrapResult(
      await dispatch(
        ControlLoteSliceRequests.getAllRechazosRequest({
          modeloA: datosPlanProd?.numeroOp,
          modeloB: datosPlanProd?.lote
        })
      )
    );
    // console.log("🚀 ~ file: ProduccionCierreLote.tsx ~ line 96 ~ onInit ~ fetchResult", fetchResult);

    if (fetchResult) {
      const fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getByIdRequest(datosPlanProd?.idLinea)));
      // console.log("🚀 ~ file: ProduccionCierreLote.tsx ~ line 99 ~ onInit ~ fetchLineaResult", fetchLineaResult);
      setLinea(fetchLineaResult);
      setdatosControlLote(fetchResult);
    }
  };

  // console.log("datosPlanProd", datosPlanProd);
  cierreCondicional && datosPlanProd?.cantidadRechazos;

  React.useEffect(() => {
    if (datosPlanProd?.idProduccion) {
      onInit();
    }
  }, [datosPlanProd]);

  React.useEffect(() => {
    if (datosPlanProd?.cantidadRechazos > 0) {
      setValue("solicitudRadioButton", "M");

      setAddMatDisable(false);
    } else if (datosPlanProd?.cantidadRechazos === 0) {
      setAddMatDisable(solicitud === "C");
    }
  }, [datosPlanProd, solicitud]);

  // React.useEffect(() => {
  //   console.log("es gerencia", esGerencia);
  // }, []);

  const calcularCantidad = () => {
    let cantidad = 0;
    let total = 0;
    if (datosPlanProd.tipoSemiElaborado == "MON") {
      // console.log("es Montaje");
      datosPlanProd &&
        datosPlanProd.inicio.map((prodDia: IInicio) => {
          cantidad += prodDia.producido;
        });
      total = datosPlanProd.cantidad - cantidad;
    } else {
      // console.log("es PLACAS");
      total = datosPlanProd.cantidad - declarado;
    }
    return total;
  };

  const calcularCantidadRechazos = (): number => {
    let rechazados = 0;
    datosControlLote.map((acc) => {
      rechazados += acc.cantidadRechazos;
    });
    return rechazados;
  };

  // Envío de Correos
  const sendEmailGerencia = async (nuevoPlanProd: IPlanProd): Promise<void> => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    await dispatch(
      EmailSliceRequest.EmailCierreLoteGerencia({
        planProd: nuevoPlanProd.idProduccion,
        infoSupervisor: GetInfoUser().username,
        observaciones: selectedPedidoCierre?.observaciones,
        descripLinea: datosLinea.idLinea
      })
    ); //si es el gerente mando un correo distinto al cierre normal
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const sendEmailCierreNormal = async (guardarControlLote: IControlLote): Promise<void> => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    await dispatch(EmailSliceRequest.EmailCierreLote(guardarControlLote.idControlLote)); //acá mando el correo con los datos
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };
  //Fin Cierre de correos

  const cerrarLote = async (nuevoPlanProd: IPlanProd, nuevoControlLote, rechazado?: boolean) => {
    console.log(nuevoPlanProd);
    console.log(nuevoControlLote);
    // return;

    let guardarControlLote: IControlLote = null;
    let actualizarPlanProd = null;
    if (!rechazado) {
      try {
        actualizarPlanProd = unwrapResult(await dispatch(PlanProdSliceRequests.putRequest(nuevoPlanProd)));
        guardarControlLote = unwrapResult(await dispatch(ControlLoteSliceRequests.postRequest(nuevoControlLote)));
      } catch (error) {
        guardarControlLote = null;
        actualizarPlanProd = null;
      }
    }
    //pull
    if ((guardarControlLote && actualizarPlanProd) || rechazado) {
      if (esGerencia) {
        await sendEmailGerencia(nuevoPlanProd);
      } else {
        await sendEmailCierreNormal(guardarControlLote);
      }
      openNotificationUI("Cerrado con éxito", "success");
    } else {
      openNotificationUI("No se pudo cerrar", "error");
    }
    setOpenPopup(false);
    callback();
  };

  const actualizarPedidoCierreLote = async (nuevoPedidoCierreLote) => {
    let actualizarPedido;
    try {
      actualizarPedido = unwrapResult(await dispatch(PedidoCierreLoteSliceRequests.putRequest(nuevoPedidoCierreLote)));
    } catch (error) {
      actualizarPedido = null;
    }
    if (actualizarPedido) {
      openNotificationUI("Pedido de cierre actualizado con éxito", "success");
    } else {
      openNotificationUI("No se pudo actualizar el pedido", "error");
    }
  };

  const sendEmailSolicitudCierre = async (observaciones: string): Promise<void> => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    await dispatch(
      EmailSliceRequest.EmailCierreLoteCondicional({
        planProd: datosPlanProd?.idProduccion,
        infoSupervisor: GetInfoUser().username,
        observaciones: observaciones,
        descripLinea: datosLinea?.idLinea
      })
    );
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };
  //-----------------------MAIL PEDIDO DE MATERIALES-------------------------
  const sendEmailPedidoMateriales = async (observaciones: string): Promise<void> => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    await dispatch(
      EmailSliceRequest.EmailPedidoMaterial({
        planProd: datosPlanProd?.idProduccion,
        infoSupervisor: GetInfoUser().username,
        observaciones: observaciones,
        descripLinea: datosLinea?.idLinea
      })
    );
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };
  //------------------PEDIDO DE CIERRE DE LOTE-----------------------
  const enviarSolicitudCierre = async (
    observaciones,
    nuevoPedidoCierreLote: IPedidoCierreLote,
    nuevoPlanProd: IPlanProd
  ) => {
    let cierreCondicionalResult;
    let actualizarPlanProd;
    try {
      cierreCondicionalResult = unwrapResult(
        await dispatch(PedidoCierreLoteSliceRequests.postRequest(nuevoPedidoCierreLote))
      );
      actualizarPlanProd = unwrapResult(await dispatch(PlanProdSliceRequests.putRequest(nuevoPlanProd)));
    } catch (error) {
      cierreCondicionalResult = null;
      actualizarPlanProd = null;
    }

    if (cierreCondicionalResult && actualizarPlanProd) {
      await sendEmailSolicitudCierre(observaciones);
      openNotificationUI("Solicitud enviada con éxito", "success");
    } else {
      openNotificationUI("No se pudo enviar la solicitud", "error");
    }
    setOpenPopup(false);
    callback();
  };
  //Hago el multiPost con la lista de PlanProdMateriales
  const guardarPlanProdMateriales = async (material: IPlanProdMateriales[]): Promise<boolean> => {
    let guardarListaMateriales;
    try {
      return (guardarListaMateriales = unwrapResult(
        await dispatch(PlanProdMaterialesSliceRequests.multiPostRequest(_.cloneDeep(material)))
      ));
    } catch (error) {
      return (guardarListaMateriales = false);
    }
  };

  //creo todos los materiales que se van a guardar en la base de datos
  const crearMaterialesList = (data: IPlanProd): IPlanProdMateriales[] => {
    const materialesAux: IPlanProdMateriales[] = [];
    selectedMaterial.map((mat: ISuperCargalinea) => {
      const guardarListaMateriales: IPlanProdMateriales = {
        codigoModelo: mat.codigoModelo,
        codigoPautas: mat.codigoPautas,
        numeroOp: mat.numeroOp,
        cantidad: mat.cantidadMaterial,
        nombreSupervisor: infoUser.operator.name + " " + infoUser.operator.surname,
        descripcion: mat.descripcion,
        idPlanProd: data.idProduccion
      };
      materialesAux.push(guardarListaMateriales);
    });

    return materialesAux;
  };
  //------------------PEDIDO DE MATERIAL------------------
  const enviarSolicitudPedido = async (
    observaciones,
    nuevoPedidoMateriales: IPedidoMaterialesProduccion,
    nuevoPlanProd: IPlanProd
  ) => {
    let pedidoMaterialesResult;
    let actualizarPlanProd;
    try {
      pedidoMaterialesResult = unwrapResult(
        await dispatch(PedidoMaterialesProduccionSliceRequests.postRequest(nuevoPedidoMateriales))
      );
      actualizarPlanProd = unwrapResult(await dispatch(PlanProdSliceRequests.putRequest(nuevoPlanProd)));
    } catch (error) {
      pedidoMaterialesResult = null;
      actualizarPlanProd = null;
    }

    if (pedidoMaterialesResult && actualizarPlanProd) {
      const materiales = crearMaterialesList(nuevoPlanProd);
      if (guardarPlanProdMateriales(materiales)) {
        await sendEmailPedidoMateriales(observaciones);
        openNotificationUI("Solicitud enviada con éxito", "success");
      } else {
        openNotificationUI("No se pudo enviar la solicitud", "error");
      }
    } else {
      openNotificationUI("No se pudo enviar la solicitud", "error");
    }
    setOpenPopup(false);
    callback();
  };

  //--------------------------PEDIDO DE MATERIALES----------------------------
  const enviarSolicitudPedidoMaterial = async (observaciones: string) => {
    const nuevoPlanProd: IPlanProd = JSON.parse(JSON.stringify(datosPlanProd));

    nuevoPlanProd.loteCerrado = "M"; // PENDIENTE= P,PEDIDO DE MATERIAL = M, RECHAZADO = R, APROBADO = A
    delete nuevoPlanProd.inicio;
    //post
    const nuevoPedidoMateriales: IPedidoMaterialesProduccion = {
      idPlanProd: datosPlanProd?.idProduccion,
      estadoPedido: "P", //PENDIENTE = P, RECHAZADO = R, APROBADO = A
      observaciones: observaciones,
      devolucion: ""
    };
    await enviarSolicitudPedido(observaciones, nuevoPedidoMateriales, nuevoPlanProd); //creo el nuevo pedido de materiales
  };

  const enviarSolicitudCierreCondicional = async (observaciones: string) => {
    const nuevoPlanProd: IPlanProd = JSON.parse(JSON.stringify(datosPlanProd));

    nuevoPlanProd.loteCerrado = "P"; // PENDIENTE= P, RECHAZADO = R, APROBADO = A
    delete nuevoPlanProd.inicio;
    //post
    const nuevoPedidoCierreLote: IPedidoCierreLote = {
      idPlanProd: datosPlanProd?.idProduccion,
      estadoPedido: "P", //PENDIENTE = P, RECHAZADO = R, APROBADO = A
      observaciones: observaciones,
      devolucion: ""
    };
    await enviarSolicitudCierre(observaciones, nuevoPedidoCierreLote, nuevoPlanProd);
  };

  const handleGuardar = async (rechazado: boolean) => {
    const { solicitudRadioButton, turnoRadioButton, observaciones } = getValues();
    if (solicitudRadioButton === "M") {
      await enviarSolicitudPedidoMaterial(observaciones);
    } else {
      if (cierreCondicional) {
        await enviarSolicitudCierreCondicional(observaciones);
      } else {
        const nuevoPlanProd: IPlanProd = JSON.parse(JSON.stringify(datosPlanProd));

        nuevoPlanProd.loteCerrado = "S";
        delete nuevoPlanProd.inicio;
        //delete nuevoPlanProd.producidos;
        // Ahora tengo que crear el nuevo objeto de ControlLote
        const nuevoControlLote: IControlLote = {
          idLinea: nuevoPlanProd.idLinea,
          turno: turnoRadioButton,
          nombreSupervisor: GetInfoUser().username,
          codigoModelo: nuevoPlanProd.codigoModelo,
          lote: nuevoPlanProd.lote,
          cantidadLote: nuevoPlanProd.cantidad,
          numeroOp: nuevoPlanProd.numeroOp,
          cantidadRechazos: calcularCantidadRechazos(),
          cantidadProducido: datosPlanProd?.cantidad - calcularCantidad(),
          cantidadFaltante: calcularCantidad(),
          idEstadoLote: 1, //lote cerrado
          observaciones: observaciones,
          tipoControl: "C", //cerrado
          serieDesde: datosPlanProd.desde || 0,
          serieHasta: datosPlanProd.hasta || 0,
          idProveedor: datosPlanProd.idProveedor || null
        };
        if (esGerencia) {
          const nuevoPedidoCierreLote: IPedidoCierreLote = JSON.parse(JSON.stringify(selectedPedidoCierre));
          nuevoPedidoCierreLote.estadoPedido = rechazado ? "R" : "C";
          nuevoPedidoCierreLote.devolucion = getValues("devolucion");
          actualizarPedidoCierreLote(nuevoPedidoCierreLote);
          await cerrarLote(nuevoPlanProd, nuevoControlLote, rechazado);
        } else {
          //post
          await cerrarLote(nuevoPlanProd, nuevoControlLote); //hago el cierre normal
        }
      }
    }
  };

  const handleAgregarMaterial = () => {
    // console.log(calcularCantidad());
    setModalMateriales(true);
  };

  const habilitaGuardar = () => {
    if (esGerencia) {
      setIsDisabled(watchDevolucion.length === 0);
    }
    if (cierreCondicional && datosPlanProd?.cantidadRechazos === 0) {
      console.log(datosPlanProd?.cantidadRechazos);
      if (solicitud === "C") {
        setIsDisabled(watchObservacion.length === 0);
      } else if (solicitud === "M") {
        setIsDisabled(selectedMaterial.length === 0);
      }
    } else if (cierreCondicional && datosPlanProd?.cantidadRechazos > 0) {
      setValue("solicitudRadioButton", "M");
      setIsDisabled(selectedMaterial.length === 0);
      console.log("valor del radio", getValues("solicitudRadioButton"));
    }
  };

  React.useEffect(() => {
    habilitaGuardar();
  }, [watchDevolucion, watchObservacion, solicitud, selectedMaterial]);

  const handleDevolucionChange = (devolucion: string) => {
    if (devolucion === "") {
      setErrorDevolucion("Este campo es obligatorio.");
    }
  };
  const handleObservacionChange = (observacion: string) => {
    if (observacion === "") {
      setErrorObservacion("Este campo es obligatorio.");
    }
  };

  return (
    <>
      {datosPlanProd && (
        <div>
          <div style={{ width: "80vw" }}>
            <div className="grid sm:grid-cols-2 gap-4 w-full">
              <TextField
                id="usuarioTextField"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Linea"
                value={datosLinea?.descripcion}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
              <FormControl variant="standard">
                <FormLabel>Turno</FormLabel>
                <Controller
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <FormControlLabel value="M" control={<Radio />} label="Mañana" />
                      <FormControlLabel value="T" control={<Radio />} label="Tarde" />
                      <FormControlLabel value="N" control={<Radio />} label="Noche" />
                    </RadioGroup>
                  )}
                  rules={{ required: true }}
                  control={control}
                  defaultValue="M"
                  name="turnoRadioButton"
                />
              </FormControl>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 w-full">
              <TextField
                id="usuarioTextField"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Supervisor"
                value={GetInfoUser().username}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Modelo"
                value={datosPlanProd?.codigoModelo}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Lote"
                value={datosPlanProd?.lote}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Numero de OP"
                value={datosPlanProd?.numeroOp}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Cantidad del lote"
                value={datosPlanProd?.cantidad}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Producidos"
                value={datosPlanProd?.cantidad - calcularCantidad()}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Restante"
                value={calcularCantidad()}
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                variant="standard"
              />
            </div>

            {/* SI LO ESTOY CERRANDO DESDE GERENCIA RENDERIZO LA POSIBILIDAD DE HACER UNA DEVOLUCION */}
            {esGerencia === true ? (
              <div className="grid sm:grid-cols-2 gap-4 w-full">
                <Controller
                  name="devolucion"
                  control={control}
                  rules={{ required: false, minLength: 2 }}
                  render={({ field }) => (
                    <TextField
                      style={{ margin: 8 }}
                      fullWidth
                      margin="normal"
                      label="Devolución"
                      multiline
                      maxRows={10}
                      InputLabelProps={{
                        shrink: true
                      }}
                      error={errorDevolucion.length > 0}
                      helperText={errorDevolucion}
                      onChange={(e: any) => {
                        field.onChange(handleDevolucionChange(e.target.value));
                      }}
                      {...field}
                      variant="standard"
                    />
                  )}
                />
                <TextField
                  id="standard-full-width"
                  style={{ margin: 8 }}
                  fullWidth
                  margin="normal"
                  label="Observaciones"
                  value={selectedPedidoCierre?.observaciones}
                  InputLabelProps={{
                    shrink: true
                  }}
                  disabled
                  variant="standard"
                />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 w-full">
                <Controller
                  name="observaciones"
                  control={control}
                  rules={{ required: false, minLength: 2 }}
                  render={({ field }) => (
                    <TextField
                      style={{ margin: 8 }}
                      fullWidth
                      margin="normal"
                      label="Observaciones"
                      multiline
                      maxRows={10}
                      InputLabelProps={{
                        shrink: true
                      }}
                      error={errorObservacion.length > 0}
                      helperText={errorObservacion}
                      onChange={(e: any) => {
                        field.onChange(handleObservacionChange(e.target.value));
                      }}
                      {...field}
                      variant="standard"
                    />
                  )}
                />
                {/* {cierreCondicional && datosPlanProd?.cantidadRechazos === 0 && ( */}
                {datosPlanProd?.cantidadRechazos === 0 && estado != 4 && (
                  <FormControl variant="standard" className="mx-10">
                    <FormLabel>Tipo de Solicitud</FormLabel>
                    <Controller
                      render={({ field }) => (
                        <RadioGroup {...field}>
                          <FormControlLabel value="C" control={<Radio />} label="Pedido de cierre" />
                          <FormControlLabel value="M" control={<Radio />} label="Pedido de material" />
                        </RadioGroup>
                      )}
                      rules={{ required: true }}
                      control={control}
                      defaultValue="C"
                      name="solicitudRadioButton"
                    />
                  </FormControl>
                )}
              </div>
            )}

            <br />
            <div className="w-full mb-2">
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography className="text-base ">Listado de No Conformes</Typography>
                </AccordionSummary>
                <AccordionDetails className="w-full flex flex-col">
                  {datosControlLote?.length > 0 ? (
                    <ProduccionRechazados rechazados={datosControlLote} />
                  ) : (
                    <AccordionDetails className="w-full flex flex-col">
                      <Typography className="text-base ">Sin equipos no conforme</Typography>
                    </AccordionDetails>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Button
                disabled={isDisabled}
                variant="contained"
                color="primary"
                onClick={() => {
                  handleGuardar(false);
                }}>
                Guardar..
              </Button>
              <Button
                variant="contained"
                disabled={isDisabled}
                hidden={!esGerencia}
                color="error"
                onClick={() => {
                  handleGuardar(true);
                }}>
                Rechazar Solicitud
              </Button>
              <Button
                color="success"
                disabled={addMatDisable}
                hidden={!cierreCondicional}
                variant="contained"
                onClick={handleAgregarMaterial}>
                Agregar material
              </Button>
            </div>
          </div>
          <ModalCompoment title="Agregar Material" openPopup={modalMateriales} setOpenPopup={setModalMateriales}>
            <MaterialesDialog
              numeroOp={datosPlanProd?.numeroOp}
              cantidadEquipos={calcularCantidad()}
              setSelectedMaterial={setSelectedMaterial}
              setOpenPopup={setModalMateriales}
            />
          </ModalCompoment>
        </div>
      )}
    </>
  );
};
