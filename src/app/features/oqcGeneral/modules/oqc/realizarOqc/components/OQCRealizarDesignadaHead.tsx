import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IInicio, IOperator } from "app/models";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { IOQCModeloPrefijo } from "app/models/IOQCModeloPrefijo";
import { useHistory } from "react-router-dom";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { TrazaOperacionWithOpAndLoteDTO } from "app/models/DTO/TrazaOperacionWithOpAndLoteDTO";
import { OQCModeloPrefijoSliceRequests } from "app/features/oqcGeneral/slices/OQCModeloPrefijoSlice";

interface IValidateNumSerie {
  modelo?: string;
  fecha?: string;
  numOp?: string;
  lote?: string;
  cantidadLote?: string;
}

interface IOQCRealizarDesignadaHead {
  setValue: (value) => void;
  view: boolean;
  validChecks: any;
  oqcDesignResult: IOQCDesignadaResultado;
}

export const OQCRealizarDesignadaHead = ({
  setValue,
  oqcDesignResult,
  view,
  validChecks
}: IOQCRealizarDesignadaHead): JSX.Element => {
  const operator = useAppSelector<IOperator>((state) => state.operator.object);
  const oqcDesignada = useAppSelector<IOQCDesignada>((state) => state.oqcDesignada.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const color = MaterialButtons();
  const history = useHistory();

  const [validateNumSerie, setValidateNumSerie] = useState<IValidateNumSerie>(null);

  const onChangeObs = ({ target }) => {
    const { value, name } = target;
    let validate: boolean = oqcDesignResult.validate;
    if (name == "numeroSerie" && oqcDesignada.oqc.validarNumSerie) validate = false;
    setValue({ ...oqcDesignResult, [name]: value, validate });
  };

  //Validar Serie SPP
  const [getValidate, setValidate] = useState<TrazaOperacionWithOpAndLoteDTO | IInicio>(null);
  const onValidate = async () => {
    let response: TrazaOperacionWithOpAndLoteDTO | IInicio;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (oqcDesignada.oqc.producto.nombre.toLowerCase().includes("autopartes")) {
        response = unwrapResult(
          await dispatch(TrazaOperacionesSliceRequests.GetDatesOfPlateWithTrace(oqcDesignResult.numeroSerie))
        );
      } else {
        response = unwrapResult(await dispatch(InicioSliceRequests.getByCodigoNewsan(oqcDesignResult.numeroSerie)));
      }
      setValidate(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      console.log(e);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onValidateAccept = () => {
    let tipoIntefaz;
    if (getValidate) {
      if (!oqcDesignada.oqc.producto.nombre.toLowerCase().includes("autopartes")) {
        tipoIntefaz = getValidate as IInicio;
        setValidateNumSerie({
          modelo: tipoIntefaz.modeloFin,
          fecha: tipoIntefaz.fechaFin,
          numOp: tipoIntefaz.nroOp
        });
        setValue({ ...oqcDesignResult, validate: true, codigoModelo: tipoIntefaz.modeloFin });
        openNotificationUI("El numero de serie existe en SPP", "success");
      } else {
        tipoIntefaz = getValidate as TrazaOperacionWithOpAndLoteDTO;
        setValidateNumSerie(tipoIntefaz);
        setValue({
          ...oqcDesignResult,
          validate: true,
          codigoModelo: tipoIntefaz.modelo,
          numeroOP: tipoIntefaz.numOp
        });
        openNotificationUI("El codigo de placa existe en SPP", "success");
      }
    } else {
      setValue({ ...oqcDesignResult, validate: false });
      setValidate(null);
      onValidatePrefijo();
    }
  };

  //Validar por prefijo
  const [getValidatePrefijo, setValidatePrefijo] = useState(null);
  const onValidatePrefijo = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(OQCModeloPrefijoSliceRequests.getListByPrefijoRequest(oqcDesignResult.numeroSerie.slice(0, 5)))
      );
      if (response) {
        setValidatePrefijo(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onValidatePrefijoAccept = () => {
    if (!oqcDesignada.oqc.producto.nombre.toLowerCase().includes("autopartes")) {
      if (getValidatePrefijo.length > 0) {
        setValidateNumSerie({
          modelo: getValidatePrefijo[0].modelo,
          fecha: "",
          numOp: ""
        });
        setValue({ ...oqcDesignResult, validate: true, codigoModelo: getValidatePrefijo[0].modelo });
        openNotificationUI("El serie existe en Prefijo", "success");
      } else {
        setValue({ ...oqcDesignResult, validate: false });
        openNotificationUI("El Serie o Prefijo no se encuentra.", "error");
      }
    }
  };

  //Validar al presionar enter
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  //Cargar valores de los chk
  const [formValues, setFormValues] = useState({
    chkManual: "",
    chkFichaTecnica: "",
    chkFichaGarantia: "",
    chkAccesoGuiado: "",
    chkEtiquetaEE: "",
    chkEtiquetaCNC: "",
    chkEtiquetaEAN: "",
    chkFeDeErratas: "",
    chkGuiaMagicControl: "",
    chkEtiquetaFuenteAlimentacion: "",
    chkEtiquetaCableUsb: "",
    chkEtiquetaFilmProtector: "",
    chkEtiquetaQr: ""
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  //Validar los chk
  const [validadoCheck, setValidadoCheck] = useState(false); //Si esta validado ok se pone en true.
  const [prefijoDesign, setprefijoDesign] = useState<IOQCModeloPrefijo[]>([]); //Cargo de la tabla OQCModeloPrefijo.
  const onValidateMFTFGDR = async () => {
    if (oqcDesignResult.numeroSerie.slice(0, 5)) {
      try {
        const response = unwrapResult(
          await dispatch(OQCModeloPrefijoSliceRequests.getListByPrefijoRequest(oqcDesignResult.numeroSerie.slice(0, 5)))
        );
        if (response) {
          setprefijoDesign(response);
        }
      } catch (e) {
        openNotificationUI(e, "error");
      }
    } else {
      openNotificationUI("Debe validar previamente el número de serie", "error");
    }
  };

  const onValidateMFTFGDRAccept = async () => {
    const {
      chkManual,
      chkFichaTecnica,
      chkFichaGarantia,
      chkAccesoGuiado,
      chkEtiquetaEE,
      chkEtiquetaCNC,
      chkEtiquetaEAN,
      chkFeDeErratas,
      chkGuiaMagicControl,
      chkEtiquetaFuenteAlimentacion,
      chkEtiquetaCableUsb,
      chkEtiquetaFilmProtector,
      chkEtiquetaQr
    } = formValues;
    let verfCheckOk = true;
    if (oqcDesignada.chkAccesoGuiado && chkAccesoGuiado != prefijoDesign[0].accesoGuiado) {
      openNotificationUI("El Acceso Guiado no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkFichaGarantia && chkFichaGarantia != prefijoDesign[0].fichaGarantia) {
      openNotificationUI("La Ficha de Garantía no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkFichaTecnica && chkFichaTecnica != prefijoDesign[0].fichaTecnica) {
      openNotificationUI("La Ficha Técnica no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkManual && chkManual != prefijoDesign[0].manual) {
      openNotificationUI("El manual no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkEtiquetaEE && chkEtiquetaEE != prefijoDesign[0].etiquetaEE) {
      openNotificationUI("La etiqueta EE no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkEtiquetaCNC && chkEtiquetaCNC != prefijoDesign[0].etiquetaCNC) {
      openNotificationUI("La etiqueta CNC corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkEtiquetaEAN && chkEtiquetaEAN != prefijoDesign[0].etiquetaEAN) {
      openNotificationUI("La etiqueta EAN no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkFeDeErratas && chkFeDeErratas != prefijoDesign[0].feDeErratas) {
      openNotificationUI("El fe de erratas no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkGuiaMagicControl && chkGuiaMagicControl != prefijoDesign[0].guiaMagicControl) {
      openNotificationUI("La guia de magic control no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (
      oqcDesignada.chkEtiquetaFuenteAlimentacion &&
      chkEtiquetaFuenteAlimentacion != prefijoDesign[0].etiquetaFuenteAlimentacion
    ) {
      openNotificationUI("La etiqueta de fuente de alimentacion no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkEtiquetaCableUSB && chkEtiquetaCableUsb != prefijoDesign[0].etiquetaCableUSB) {
      openNotificationUI("La etiqueta del cable USB  no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkEtiquetaFilmProtector && chkEtiquetaFilmProtector != prefijoDesign[0].etiquetaFilmProtector) {
      openNotificationUI("La etiqueta del film protector no corresponde!!!", "error");
      verfCheckOk = false;
    }
    if (oqcDesignada.chkEtiquetaQr && chkEtiquetaQr != prefijoDesign[0].etiquetaQr) {
      openNotificationUI("La etiqueta QR no corresponde!!!", "error");
      verfCheckOk = false;
    }
    setValidadoCheck(verfCheckOk);
    validChecks(verfCheckOk);
  };

  useEffect(() => {
    if (getValidatePrefijo !== null) {
      onValidatePrefijoAccept();
    }
  }, [getValidatePrefijo]);

  useEffect(() => {
    if (getValidate !== null) {
      onValidateAccept();
    }
  }, [getValidate]);

  useEffect(() => {
    view && onValidate();
  }, [view]);

  useEffect(() => {
    if (!oqcDesignada) {
      history.push("/main/oqc/oqc-designadas");
    }
  }, [oqcDesignada]);

  return (
    <div>
      <div className="w-full bg-secondaryNew shadow-elevation-4 text-center p-2 flex flex-col gap-5 ">
        <div className="flex flex-row gap-5 xl:flex-col">
          {oqcDesignada && oqcDesignada.lineaProduccion && (
            <TextField label={`Linea de producción: ${oqcDesignada.lineaProduccion?.nombre} `} fullWidth disabled />
          )}
          {operator && <TextField label={`Auditor: ${operator?.name} ${operator?.surname} `} fullWidth disabled />}
          {oqcDesignada && oqcDesignada.oqc && (
            <TextField label={`OQC: ${oqcDesignada.oqc?.nombre} `} fullWidth disabled />
          )}
          {oqcDesignada && oqcDesignada.oqc && (
            <>
              <TextField label={`Registro: ${oqcDesignada.oqc?.numeroRegistro} `} fullWidth disabled />
              <TextField label={`Versión: ${oqcDesignada.oqc?.versionado} `} fullWidth disabled />
            </>
          )}
        </div>
        <TextField
          label="Observación:"
          name="observacion"
          fullWidth
          multiline
          value={oqcDesignResult.observacion}
          onChange={onChangeObs}
          disabled={view}
        />
        <div className="flex gap-5 justify-between pr-5">
          <div className=" flex gap-5 w-full">
            <TextField
              label={`Número de serie:`}
              name="numeroSerie"
              type="number"
              fullWidth
              value={oqcDesignResult.numeroSerie}
              onChange={onChangeObs}
              // onKeyDown={onKeyDownValidar}
              onKeyDown={onKeyDown}
              disabled={view}
            />
            <Tooltip title="Validar">
              <span>
                <Button
                  className={color.blueButton}
                  onClick={() => {
                    onValidate();
                    onValidateMFTFGDR();
                  }}
                  disabled={oqcDesignResult?.numeroSerie == "" || view || !oqcDesignada.oqc.validarNumSerie}>
                  VALIDAR
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
        {oqcDesignResult.validate && oqcDesignada.oqc.validarNumSerie && (
          <div className="flex xl:flex-row flex-col gap-5">
            <TextField label={`Modelo: ${validateNumSerie.modelo} `} fullWidth disabled />
            <TextField label={`Numero OP: ${validateNumSerie.numOp} `} fullWidth disabled />
            <TextField label={`Fecha: ${moment(validateNumSerie.fecha).format("L")} `} fullWidth disabled />
            <>
              {oqcDesignada.oqc.producto.nombre.toLowerCase().includes("autopartes") && (
                <>
                  <TextField label={`Lote: ${validateNumSerie.lote} `} fullWidth disabled />
                  <TextField label={`Cantidad: ${validateNumSerie.cantidadLote} `} fullWidth disabled />
                </>
              )}
            </>
          </div>
        )}
      </div>

      {((oqcDesignResult.validate && oqcDesignada.oqc.validarNumSerie) ||
        ((oqcDesignResult.validate || view) && oqcDesignada.celulares)) &&
        (oqcDesignada.chkManual ||
          oqcDesignada.chkFichaTecnica ||
          oqcDesignada.chkFichaGarantia ||
          oqcDesignada.chkAccesoGuiado ||
          oqcDesignada.chkEtiquetaEE ||
          oqcDesignada.chkEtiquetaCNC ||
          oqcDesignada.chkEtiquetaEAN ||
          oqcDesignada.chkFeDeErratas ||
          oqcDesignada.chkGuiaMagicControl ||
          oqcDesignada.chkEtiquetaFuenteAlimentacion ||
          oqcDesignada.chkEtiquetaCableUSB ||
          oqcDesignada.chkEtiquetaFilmProtector ||
          oqcDesignada.chkEtiquetaQr) && (
          <div className="p-2 mt-4 mb-4 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="flex minnotebook:flex-row flex-col gap-5">
              {oqcDesignada.chkManual && (
                <TextField
                  label="Validar Manual"
                  name="chkManual"
                  fullWidth
                  required
                  value={formValues.chkManual}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkFichaTecnica && (
                <TextField
                  label="Validar Ficha Técnica"
                  name="chkFichaTecnica"
                  fullWidth
                  required
                  value={formValues.chkFichaTecnica}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkFichaGarantia && (
                <TextField
                  label="Validar Ficha de Garantía"
                  name="chkFichaGarantia"
                  fullWidth
                  required
                  value={formValues.chkFichaGarantia}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkAccesoGuiado && (
                <TextField
                  label="Validar Acceso Guiado"
                  name="chkAccesoGuiado"
                  fullWidth
                  required
                  value={formValues.chkAccesoGuiado}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkEtiquetaEE && (
                <TextField
                  label="Validar Etiqueta EE"
                  name="chkEtiquetaEE"
                  fullWidth
                  required
                  value={formValues.chkEtiquetaEE}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkEtiquetaCNC && (
                <TextField
                  label="Validar Etiqueta CNC"
                  name="chkEtiquetaCNC"
                  fullWidth
                  required
                  value={formValues.chkEtiquetaCNC}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkEtiquetaEAN && (
                <TextField
                  label="Validar Etiqueta EAN"
                  name="chkEtiquetaEAN"
                  fullWidth
                  required
                  value={formValues.chkEtiquetaEAN}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkFeDeErratas && (
                <TextField
                  label="Validar Fe De Erratas"
                  name="chkFeDeErratas"
                  fullWidth
                  required
                  value={formValues.chkFeDeErratas}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkGuiaMagicControl && (
                <TextField
                  label="Validar Guia Magic Control"
                  name="chkGuiaMagicControl"
                  fullWidth
                  required
                  value={formValues.chkGuiaMagicControl}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkEtiquetaFuenteAlimentacion && (
                <TextField
                  label="Validar Etiqueta Fuente Alimentacion"
                  name="chkEtiquetaFuenteAlimentacion"
                  fullWidth
                  required
                  value={formValues.chkEtiquetaFuenteAlimentacion}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkEtiquetaCableUSB && (
                <TextField
                  label="Validar Etiqueta Cable USB"
                  name="chkEtiquetaCableUsb"
                  fullWidth
                  required
                  value={formValues.chkEtiquetaCableUsb}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkEtiquetaFilmProtector && (
                <TextField
                  label="Validar Etiqueta Film Protector"
                  name="chkEtiquetaFilmProtector"
                  fullWidth
                  required
                  value={formValues.chkEtiquetaFilmProtector}
                  onChange={handleInputChange}
                />
              )}
              {oqcDesignada.chkEtiquetaQr && (
                <TextField
                  label="Validar Etiqueta QR"
                  name="chkEtiquetaQr"
                  fullWidth
                  required
                  value={formValues.chkEtiquetaQr}
                  onChange={handleInputChange}
                />
              )}
              <div className="p-2 flex justify-around" style={{ flex: "1 1 10%" }}>
                <Tooltip title="Validar checks">
                  <span>
                    <Button className={color.blueButton} variant="contained" onClick={onValidateMFTFGDRAccept}>
                      Validar
                    </Button>
                  </span>
                </Tooltip>
                {validadoCheck ? (
                  <Tooltip title="Validación OK">
                    <IconButton size="small" color="success" style={{ position: "relative" }}>
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Falta Validación">
                    <IconButton size="small" color="error" style={{ position: "relative" }}>
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
