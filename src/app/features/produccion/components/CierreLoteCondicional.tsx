import React from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IPlanProd } from "app/models/IPlanProd";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { IControlLote } from "app/models/IControlLote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { MaterialesDialog } from "app/features/calidad/components/MaterialesDialog";
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
import { ProduccionRechazados } from "./ProduccionRechazados";
import { ILinea } from "app/models/ILinea";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { ISuperCargalinea } from "app/models";
import { PedidoCierreLoteSliceRequests } from "app/Middleware/reducers/PedidoCierreLoteSlice";
import { IPedidoCierreLote } from "app/models/IPedidoCierreLote";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
interface props {
  id: number;
  setModalCierreCondicionalOpen: any;
  callback: any;
}

const defaultValues = {
  turnoRadioButton: "M",
  observaciones: ""
};

export const CierreLoteCondicional = ({ id, setModalCierreCondicionalOpen, callback }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { State: datosPlanProd } = useFetchApi<IPlanProd>(PlanProdSliceRequests.getByIdRequest, id);
  const [datosControlLote, setdatosControlLote] = React.useState<IControlLote[]>([]);
  const [modalRechazoOpen, setModalRechazoOpen] = React.useState(false);
  const [datosLinea, setLinea] = React.useState<ILinea>();
  const [selectedMaterial, setSelectedMaterial] = React.useState<ISuperCargalinea[]>([]);
  const { handleSubmit, control, formState, watch, getValues } = useForm({ defaultValues });
  const { isDirty, isValid, errors } = formState;

  const radio = watch("turnoRadioButton");

  const onInit = async () => {
    const fetchResult = unwrapResult(
      await dispatch(
        ControlLoteSliceRequests.getAllRechazosRequest({
          modeloA: datosPlanProd?.numeroOp,
          modeloB: datosPlanProd.lote
        })
      )
    );

    const fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getByIdRequest(datosPlanProd?.idLinea)));
    setLinea(fetchLineaResult);
    setdatosControlLote(fetchResult);
  };

  React.useEffect(() => {
    if (datosPlanProd?.idProduccion) {
      onInit();
    }
  }, [datosPlanProd]);

  const calcularCantidad = () => {
    let cantidad = 0;
    datosPlanProd &&
      datosPlanProd.inicio.map((prodDia: IInicio) => {
        cantidad += prodDia.producido;
      });
    return datosPlanProd.cantidad - cantidad;
  };

  const calcularCantidadRechazos = (): number => {
    let rechazados = 0;
    datosControlLote.map((acc) => {
      rechazados += acc.cantidadRechazos;
    });
    return rechazados;
  };

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
      await dispatch(
        EmailSliceRequest.EmailCierreLoteCondicional({
          planProd: datosPlanProd?.idProduccion,
          infoSupervisor: GetInfoUser().username,
          observaciones: observaciones,
          descripLinea: datosLinea.idLinea
        })
      );
      openNotificationUI("Solicitud enviada con éxito", "success");
    } else {
      openNotificationUI("No se pudo enviar la solicitud", "error");
    }
    setModalCierreCondicionalOpen(false);
    callback();
  };

  const handleGuardar = async ({ observaciones }) => {
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

  const handleAgregarMaterial = () => {
    console.log(calcularCantidad());
    setModalRechazoOpen(true);
  };

  return (
    <>
      {datosPlanProd && (
        <div>
          <form noValidate autoComplete="off" style={{ width: "80vw" }} onSubmit={handleSubmit(handleGuardar)}>
            <div className="grid grid-cols-2 gap-4 w-full">
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
            <div className="grid grid-cols-2 gap-4 w-full">
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
            <div className="grid grid-cols-2 gap-4 w-full">
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
                    error={!!errors.observaciones}
                    helperText={errors?.observaciones?.type}
                    {...field}
                    variant="standard"
                  />
                )}
              />
            </div>
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
          </form>
          <div className="sm:flex sm:justify-around sm:space-y-0 text-center space-y-2">
            {datosPlanProd?.cantidad - parseInt(datosPlanProd?.cantidadProducida) > 0 &&
              datosPlanProd?.cantidadRechazos === 0 && (
                <div
                  onClick={() => {
                    handleGuardar(getValues());
                  }}>
                  <Button color="primary" variant="contained" disabled={!isDirty && !isValid}>
                    Pedido de Cierre
                  </Button>
                </div>
              )}
            <Button className={classes.greenButton} variant="contained" onClick={handleAgregarMaterial}>
              Agregar material
            </Button>
            {/* <Button color="warning" variant="contained" onClick={() => console.log(selectedMaterial)}>
              Mostrar material
            </Button> */}
          </div>
          <ModalCompoment title="Agregar Material" openPopup={modalRechazoOpen} setOpenPopup={setModalRechazoOpen}>
            <MaterialesDialog
              numeroOp={datosPlanProd.numeroOp}
              cantidadEquipos={calcularCantidad()}
              setSelectedMaterial={setSelectedMaterial}
              setOpenPopup={setModalRechazoOpen}
            />
          </ModalCompoment>
        </div>
      )}
    </>
  );
};
