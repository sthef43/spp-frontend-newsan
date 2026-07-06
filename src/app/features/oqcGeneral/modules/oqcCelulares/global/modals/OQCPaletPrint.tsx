import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography
} from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { OQCPaletPrintView } from "./OQCPaletPrintView";
import { unwrapResult } from "@reduxjs/toolkit";
import { IOQCPalet } from "app/models/IOQCPalet";
import { limpiarPalet } from "app/features/oqcGeneral/helpers/limpiarEntidad";
import { IOQCSupervisoresMotorola } from "app/models/IOQCSupervisoresMotorola";
import { OQCSupervisoresMotorolaSliceRequest } from "app/features/oqcGeneral/slices/OqcSupervisoresMotorola";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { NumerosNewsanDTO } from "app/models/DTO/NumerosNewsanDTO";
import { InfoRounded } from "@mui/icons-material";
import { OQCConsultaMasterBoxEBS } from "./OQCConsultaMasterBoxEBS";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCPaletPrintSliceRequests, oqcPaletPrintSlice } from "app/features/oqcGeneral/slices/OQCPaletPrintSlice";
import { OQCPaletSliceRequests } from "app/features/oqcGeneral/slices/OQCPaletSlice";

interface IOQCPaletPrintComponent {
  closeModal: (state: boolean) => void;
  refresh?: () => void;
  cerrarMuestras?: (newValue: boolean) => void;
  cerrarReprocesoZampling?: (newValue: boolean) => void;
  numeroLpn?: string;
  cerrarPaletOpcion?: boolean;
  ticketPiso?: boolean;
  reproceso?: boolean;
  reimpresion?: boolean;
  estadoReimpresion?: boolean;
  ultimaMuestraOQC?: IOQCDesignadaResultado;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9"
  }
}));

export const OQCPaletPrint = ({
  closeModal,
  refresh,
  cerrarMuestras,
  cerrarPaletOpcion,
  reproceso,
  reimpresion,
  estadoReimpresion,
  ultimaMuestraOQC,
  cerrarReprocesoZampling
}: IOQCPaletPrintComponent): JSX.Element => {
  const palet = useAppSelector((state) => state.oqcPalet.object);
  const ticketReproceso = useAppSelector((state) => state.oqcPaletPrint.object);
  const operator = useAppSelector((state) => state.operator.object);
  const planta = useAppSelector((state) => state.plant.object);
  const supervisor = useAppSelector((state) => state.oqcSupervisoresMotorola.object);

  const defaultValues = {
    observaciones: ticketReproceso != null ? ticketReproceso.observaciones : "",
    numDesde: ticketReproceso != null ? ticketReproceso.numDesde : 0,
    numHasta: ticketReproceso != null ? ticketReproceso.numHasta : 0,
    supervisor: ticketReproceso != null ? ticketReproceso.supervisor : supervisor != null ? supervisor.nombre : "",
    numOp:
      ticketReproceso != null
        ? ticketReproceso.numOp
        : ultimaMuestraOQC != null
        ? parseInt(ultimaMuestraOQC.numeroOP.substring(3, 99))
        : 0,
    masterBox: ticketReproceso != null ? ticketReproceso.masterBox : "",
    motivoRechazo: ticketReproceso != null ? ticketReproceso.motivoRechazo : "",
    turnoId: 0,
    operatorId: 0,
    canceled: false,
    oqcPaletId: palet.id,
    total: ticketReproceso != null ? ticketReproceso.masterBox : 0,
    ticketConforme: estadoReimpresion
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isValid }
  } = useForm({ defaultValues: defaultValues });

  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const componentRef = useRef(null);
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();

  const [openModalPreviewTicket, setOpenModalPreviewTicket] = useState(false);
  const [openModalConsultaEBS, setOpenModalConsultaEBS] = useState(false);

  const onSubmit = async (e) => {
    let oqcPP = null;
    if (!reimpresion) {
      try {
        if (await getConfirmation("Imprimir", "Seguro que quiere imprimir el ticket?")) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          oqcPP = unwrapResult(await dispatch(OQCPaletPrintSliceRequests.PostRequest(e)));
          dispatch(oqcPaletPrintSlice.actions.setObject(oqcPP));
          cerrarPalet();
          onReprocesar(palet);
          handleImprimir();
          cerrarMuestras(false);
          closeModal(false);
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        }
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } else {
      reimpresionTicket();
    }
    if (reproceso) {
      refresh();
    }
  };

  const reimpresionTicket = async () => {
    if (reimpresion) {
      if (await getConfirmation("Reimpresion", "Seguro que desea reimprimir el ticket")) {
        handleImprimir();
      }
    }
  };

  const handleVistaPrevia = async (data) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(await dispatch(OQCPaletPrintSliceRequests.postSimulation(data)));
      if (response) {
        dispatch(oqcPaletPrintSlice.actions.setObject(response));
        setOpenModalPreviewTicket(true);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  // const getNumeroOp = async () => {
  //   try {
  //     dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
  //     const response = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.GetByLPN(palet.lpn != undefined ? numeroLpn : palet.lpn)));
  //     if (response) {
  //       const numerosOp = response[0].nrO_OP.substring(3, 99);
  //       setValue('numOp', parseInt(numerosOp));
  //     }
  //     dispatch(LoadingUISlice.actions.LoadingUIClose());
  //   } catch (error) {
  //     console.log(error);
  //     dispatch(LoadingUISlice.actions.LoadingUIClose());
  //   }
  // }

  const cerrarPalet = async () => {
    if (cerrarPaletOpcion) {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const operator = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0)));
        const paletSubmit = limpiarPalet({ ...palet, operatorId: operator.id, cerrado: false } as IOQCPalet) as IOQCPalet;
        await dispatch(OQCPaletSliceRequests.PutRequest(paletSubmit));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
      refresh();
    }
  };

  const onReprocesar = async (palet: IOQCPalet) => {
    if (reproceso) {
      const registroGenerado = generarRegistro();
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const newPalet: IOQCPalet = {
          ...palet,
          registro: registroGenerado,
          cerrado: false,
          lpn: palet.lpn.slice(0, palet.lpn.length - 1) + "R",
          reprocesado: true,
          conforme: true,
          oqcPaletPrint: null,
          oqcDesignada: null,
          oqcDesignadaResultado: null
        };
        await dispatch(OQCPaletSliceRequests.PutRequest(newPalet));
        openNotificationUI("Se reproceso el palet con exito", "success");
        closeModal(false);
        cerrarReprocesoZampling(false);
      } catch (e) {
        openNotificationUI(e, "error");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
      refresh();
    }
  };

  const generarRegistro = () => {
    let nuevoRegistro = "";
    const año = new Date();
    nuevoRegistro = `${palet.plant.organizationCode}-NG-${año.getFullYear()}-${palet.numeroPalet.substring(4, 99)}-RP`;
    if (nuevoRegistro != "") {
      return nuevoRegistro;
    }
  };

  const [semiUltimoPalet, setSemiUltimoPalet] = useState<IOQCPalet>();
  const [numerosSerie, setNumerosSerie] = useState<NumerosNewsanDTO>();
  const [listaSupervisores, setListaSupervisores] = useState<IOQCSupervisoresMotorola[]>([]);
  const onInit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0));
      const response = unwrapResult(
        await dispatch(OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId(planta.id))
      );
      const responsePalet = unwrapResult(
        await dispatch(OQCPaletSliceRequests.getLastTwoPallets({ plantId: planta.id, modeloId: palet.oqcModeloId }))
      );
      if (response) {
        setListaSupervisores(response);
        setSemiUltimoPalet(responsePalet[1]);
        if (responsePalet) {
          const responseNumerosSerie = unwrapResult(
            await dispatch(OQCDesignadaResultadoSliceRequests.getNewsanFromAndUntil(responsePalet[1].id))
          );
          if (responsePalet) {
            setNumerosSerie(responseNumerosSerie);
          }
        }
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      console.log(e);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Palet de OQC`,
    copyStyles: true
  });

  useEffect(() => {
    if (operator) {
      setValue("operatorId", operator.id);
      setValue("turnoId", operator.turnoId);
    }
  }, [operator]);

  useEffect(() => {
    const numDesde = getValues("numDesde");
    const numHasta = getValues("numHasta");
    if (getValues("numDesde") > 0 && getValues("numHasta") > 0) {
      setValue("total", numHasta - numDesde + 1);
    }
  }, [watch("numDesde"), watch("numHasta")]);

  useEffect(() => {
    onInit();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5 w-">
      <div className="hidden bg-white">
        <OQCPaletPrintView estadoReimpresion={estadoReimpresion} reproceso={reproceso} parentRef={componentRef} />
      </div>
      {listaSupervisores && (
        <Controller
          name="supervisor"
          control={control}
          rules={{ required: { value: true, message: "Seleccione un supervisor" } }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="supervisor">Supervisor</InputLabel>
              <Select {...field} labelId="supervisor" id="supervisor" label="Supervisor">
                {listaSupervisores.map((elementos, index) => (
                  <MenuItem value={elementos.nombre} key={index}>
                    {elementos.nombre}
                  </MenuItem>
                ))}
              </Select>
              {!!error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      <Controller
        control={control}
        name="observaciones"
        rules={!palet.conforme ? { required: "Debe insgresa su observacion" } : {}}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField
              {...field}
              label={!palet.conforme ? "Observaciones" : "Observaciones(Opcional)"}
              autoComplete="off"
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      {!estadoReimpresion && !reproceso && (
        <Controller
          control={control}
          name="motivoRechazo"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField {...field} label="Motivo de rechazo" autoComplete="off" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      {!estadoReimpresion && !reproceso && (
        <Controller
          control={control}
          name="masterBox"
          rules={{ required: "El campo es requerido" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField {...field} label="Cantidad de masterbox rechazadas" type="number" autoComplete="off" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      {ultimaMuestraOQC && (
        <Controller
          control={control}
          name="numOp"
          rules={{
            required: "El campo es requerido",
            min: { value: 1, message: "El valor minimo tiene que ser mayor a 0" }
          }}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField {...field} label="Número de OP:" type="number" autoComplete="off" />
              {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      )}
      <div className="flex flex-row w-full justify-between items-center gap-x-2">
        <div className=" flex flex-col gap-y-5 items-center">
          <Controller
            control={control}
            name="numDesde"
            rules={{
              required: "El campo es requerido",
              min: { value: 1, message: "El valor minimo tiene que ser mayor a 0" }
            }}
            render={({ field, fieldState: { error } }) => (
              <FormControl>
                <TextField {...field} label="Número de serie desde:" type="number" autoComplete="off" />
                {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="numHasta"
            rules={{
              required: "El campo es requerido",
              min: { value: 1, message: "El valor minimo tiene que ser mayor a 0" }
            }}
            render={({ field, fieldState: { error } }) => (
              <FormControl>
                <TextField {...field} label="Número de serie hasta:" type="number" autoComplete="off" />
                {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        {semiUltimoPalet && numerosSerie && (
          <div>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">Informacion Pallet Anterior</Typography>
                  <p>
                    * El pallet anterior <u>{semiUltimoPalet.numeroPalet}</u> del modelo{" "}
                    <u>{semiUltimoPalet.oqcModelo.modeloNewsan}</u> termino en número de serie{" "}
                    <u>{numerosSerie.numeroNewsanHasta}</u>
                  </p>
                </React.Fragment>
              }>
              <Button>
                <InfoRounded />
              </Button>
            </HtmlTooltip>
          </div>
        )}
      </div>
      <Controller
        control={control}
        name="total"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Total" type="number" autoComplete="off" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <div className="flex flex-row items-center justify-between">
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit(handleVistaPrevia)}
            disabled={!isValid}
            className={buttonClases.purpleButton}
            variant="contained">
            Vista Previa
          </Button>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setOpenModalConsultaEBS(true);
            }}
            className={buttonClases.blueButton}
            variant="contained">
            Consulta EBS
          </Button>
        </div>
      </div>
      <FormButtons
        submitName="Imprimir"
        onCancel={() => {
          closeModal(false);
        }}
      />
      <div>
        <ModalCompoment
          setOpenPopup={setOpenModalPreviewTicket}
          openPopup={openModalPreviewTicket}
          showModalCenterPage
          titleModalStyle="Audit"
          subTitle="Vista previa del ticket"
          title="Vista Previa">
          <OQCPaletPrintView estadoReimpresion={estadoReimpresion} reproceso={reproceso} />
        </ModalCompoment>
        <ModalCompoment
          setOpenPopup={setOpenModalConsultaEBS}
          openPopup={openModalConsultaEBS}
          showModalCenterPage
          titleModalStyle="Audit"
          subTitle="Consulta de master box en EBS"
          title="Consulta EBS">
          <OQCConsultaMasterBoxEBS setOpenModal={setOpenModalConsultaEBS} />
        </ModalCompoment>
      </div>
    </form>
  );
};
