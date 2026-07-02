import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOperator } from "app/models";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { OQCRealizarDesignadaBody } from "app/features/oqcGeneral/modules/oqc/realizarOqc/components/OQCRealizarDesignadaBody";
import { OQCRealizarDesignadaHead } from "app/features/oqcGeneral/modules/oqc/realizarOqc/components/OQCRealizarDesignadaHead";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IOQCDesignadaResultadoImagen } from "app/models/IOQCDesignadaResultadoImagen";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IOQCModelo } from "app/models/IOQModelo";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import {
  OQCDesignadaResultadoImagenSliceRequests,
  oqcDesignadaResultadoImagenSlice
} from "app/features/oqcGeneral/slices/OQCDesignadaResultadoImagenSlice";
import {
  OQCDesignadaResultadoSliceRequests,
  oqcDesignadaResultadoSlice
} from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { oqcDesignadaSlice } from "app/features/oqcGeneral/slices/OQCDesignadaSlice";
import { oqcHallazgoResultSlice } from "app/features/oqcGeneral/slices/OQCHallazgoResultSlice";
import { oqcModeloSlice } from "app/features/oqcGeneral/slices/OQCModeloSlice";
import { oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";

export const OQCRealizarDesignadaPage = (): JSX.Element => {
  const operator = useAppSelector<IOperator>((state) => state.operator.object);
  const oqcDesignada = useAppSelector<IOQCDesignada>((state) => state.oqcDesignada.object);
  const oqcModelo = useAppSelector<IOQCModelo>((state) => state.oqcModelo.object);
  const oqcDesginadaResultado = useAppSelector<IOQCDesignadaResultado>((state) => state.oqcDesignadaResultado.object);
  const oqcHallazgoResult = useAppSelector<IOQCHallazgoResult[]>((state) => state.oqcHallazgoResult.dataAll);
  const oqcDesignadaResultadoImagenes = useAppSelector<IOQCDesignadaResultadoImagen[]>(
    (state) => state.oqcDesignadaResultadoImagen.dataAll
  );
  const oqcPalet = useAppSelector<IOQCPalet>((state) => state.oqcPalet.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const param: any = useParams();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();

  const [view, setView] = useState(false);
  const [validChecks, setvalidChecks] = useState(true);
  const [envioDatos, setEnvioDatos] = useState(false);

  const [oqcDesginadaResult, setOqcDesginadaResult] = useState<IOQCDesignadaResultado>({
    numeroOP: "",
    codigoModelo: "",
    observacion: "",
    numeroSerie: param.numSerie || "",
    imei: "",
    imei2: "",
    cajaMaster: "",
    indicePonderacion: 0,
    validate: !oqcDesignada?.oqc?.validarNumSerie ? true : false,
    oqcDesignadaId: oqcDesignada?.id,
    oqcHallazgoResult: [],
    operatorId: operator?.id,
    oqcPaletId: oqcPalet?.id
  });

  //Esta funcion sirve para poder calcular el indice de pondearcion como lo hace en el back
  const conformarIndice = (oqcRealizado: IOQCDesignadaResultado) => {
    const hallazgosEncontrados: IOQCBloqueHallazgo[] = oqcDesignada.oqc.oqcBloqueGroup.flatMap(
      (elementos) => elementos.oqcBloque.oqcBloqueHallazgo
    );
    const hallazgosFiltrados: IOQCBloqueHallazgo[] = [];

    hallazgosEncontrados.forEach((elementos) => {
      oqcRealizado.oqcHallazgoResult.map((OQCRealizado) => {
        if (elementos.id === OQCRealizado.oqcBloqueHallazgoId && OQCRealizado.state == false) {
          hallazgosFiltrados.push(elementos);
        }
      });
    });

    const hallazgosPonderacionA: IOQCBloqueHallazgo[] = [];
    const hallazgosPonderacionB: IOQCBloqueHallazgo[] = [];
    const hallazgosPonderacionC: IOQCBloqueHallazgo[] = [];

    hallazgosFiltrados.forEach((elementos) => {
      switch (elementos.oqcHallazgo.oqcPonderacion.nombre) {
        case "A":
          hallazgosPonderacionA.push(elementos);
          break;
        case "B":
          hallazgosPonderacionB.push(elementos);
          break;
        case "C":
          hallazgosPonderacionC.push(elementos);
          break;
      }
    });

    let indice = 0;
    const indiceCalculado =
      (1 -
        (hallazgosPonderacionA.length + hallazgosPonderacionB.length * 0.5 + hallazgosPonderacionC.length * 0.1) /
          oqcHallazgoResult.length) *
      100;

    if (hallazgosFiltrados.length > 0) {
      indice = indiceCalculado;
    } else {
      indice = 100;
    }
    return indice;
  };

  const actualizarPonderacion = async (actualizar: IOQCDesignadaResultado) => {
    const nuevaPonderacion = conformarIndice(actualizar);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const nuevoObjeto = { ...actualizar, indicePonderacion: nuevaPonderacion };
      delete nuevoObjeto.oqcHallazgoResult;
      await dispatch(OQCDesignadaResultadoSliceRequests.PutRequest(nuevoObjeto));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onInit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onSaveOQC = async (e) => {
    try {
      e.preventDefault();
      let submit = true;
      if (!oqcDesignada.oqc.validarNumSerie && oqcDesginadaResult.numeroSerie.length == 0) {
        openNotificationUI("Por favor ingresar un número de serie", "error");
        return;
      }
      if (!validChecks) {
        openNotificationUI("Por favor validar Manual, Ficha Técnica, Ficha de Garantía o Acceso Guiado.", "error");
        return;
      }
      if (oqcDesignada.celulares && oqcDesginadaResult.cajaMaster.length == 0) {
        openNotificationUI("Por favor ingresar un caja master valida", "error");
        return;
      }
      if (oqcDesignada.celulares && oqcDesginadaResult.imei.length == 0) {
        openNotificationUI("Por favor ingresar un número de imei", "error");
        return;
      }
      if (oqcDesignada.celulares && oqcDesginadaResult.eanCode !== oqcModelo.eanCode) {
        openNotificationUI("EANCODE no corresponde al modelo", "error");
        return;
      }
      if (oqcDesignada.imei2 && oqcDesginadaResult.imei2.length == 0) {
        openNotificationUI("Por favor ingresar un número de imei 2", "error");
        return;
      }
      if (oqcDesignada.celulares && !oqcDesginadaResult.validate) {
        openNotificationUI("OQC con campos sin validar", "error");
        return;
      }
      if (!oqcDesginadaResult.validate && !oqcDesignada.celulares) {
        openNotificationUI("Número de serie invalido", "error");
        return;
      }
      if (oqcHallazgoResult.find((oqcHR) => oqcHR.state == null)) {
        openNotificationUI("Tiene items sin validad GOOD/NG", "error");
        return;
      }
      if (oqcHallazgoResult.find((oqcHR) => oqcHR.state == false && oqcHR.comentario.trim().length == 0)) {
        openNotificationUI("Tiene hallazgos NG sin comentar", "error");
        return;
      }
      if (await getConfirmation("Guardar OQC", "Desea finalizar y guardar los datos del OQC?")) {
        if (oqcHallazgoResult.find((oqcHR) => oqcHR.state == false)) {
          submit = false;
          if (await getConfirmation("Items NG", "Tiene items NG, desea continuar?")) {
            submit = true;
          }
        }
        if (submit) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          const response = unwrapResult(
            await dispatch(OQCDesignadaResultadoSliceRequests.PostRequest(oqcDesginadaResult))
          );
          conformarIndice(response);
          if (oqcDesignadaResultadoImagenes.length > 0) {
            const newImages = oqcDesignadaResultadoImagenes.map(({ oqcBloqueGroupId, image }) => {
              return { oqcBloqueGroupId, oqcDesigResultId: response?.id, image };
            });
            await dispatch(OQCDesignadaResultadoImagenSliceRequests.uploadMultipleImageRequest(newImages));
          }
          if (oqcDesignada.oqc.email) {
            if (!oqcDesignada.oqc.emailNG) {
              await dispatch(EmailSliceRequest.SendEmailNewOQC(response));
            } else {
              if (oqcHallazgoResult.find((oqcHR) => oqcHR.state == false)) {
                const filteredData = {
                  ...response,
                  oqcHallazgoResult: response.oqcHallazgoResult.filter((item) => item.state === false)
                };
                await dispatch(EmailSliceRequest.SendEmailNewOQC(filteredData));
              }
            }
          }
          dispatch(LoadingUISlice.actions.LoadingUIClose());
          openNotificationUI("Se realizo el OQC exitosamente", "success");
          if (await getConfirmation("Realizar otro OQC", "Desea realizar otra prueba oqc?")) {
            actualizarPonderacion(response);
            setOqcDesginadaResult({
              codigoModelo: "",
              observacion: "",
              numeroSerie: "",
              imei: "",
              imei2: "",
              cajaMaster: "",
              numeroOP: "",
              indicePonderacion: 0,
              validate: !oqcDesignada?.oqc?.validarNumSerie && !oqcDesignada.celulares ? true : false,
              oqcDesignadaId: oqcDesignada?.id,
              oqcHallazgoResult: [],
              operatorId: operator?.id,
              oqcPaletId: oqcPalet?.id
            });
            setEnvioDatos((prev) => !prev);
          } else {
            actualizarPonderacion(response);
            history.replace("/main/oqc/oqc-designadas");
          }
        }
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    oqcHallazgoResult && setOqcDesginadaResult({ ...oqcDesginadaResult, oqcHallazgoResult });
  }, [oqcHallazgoResult]);

  useEffect(() => {
    oqcDesginadaResultado && !oqcDesignada.celulares && setOqcDesginadaResult(oqcDesginadaResultado);
    oqcDesginadaResultado &&
      oqcDesignada.celulares &&
      setOqcDesginadaResult({ ...oqcDesginadaResultado, validate: true });
    oqcDesginadaResultado && setView(true);
    !oqcDesginadaResultado && onInit();
  }, [oqcDesginadaResultado]);

  useEffect(() => {
    return () => {
      dispatch(oqcDesignadaSlice.actions.setObject(null));
      dispatch(oqcHallazgoResultSlice.actions.setClear());
      dispatch(oqcDesignadaResultadoImagenSlice.actions.setClear());
      dispatch(oqcDesignadaResultadoSlice.actions.setClear());
      dispatch(oqcPaletSlice.actions.setObject(null));
      dispatch(oqcModeloSlice.actions.setObject(null));
    };
  }, []);

  return (
    <div className="w-full p-5">
      <form onSubmit={onSaveOQC}>
        <OQCRealizarDesignadaHead
          oqcDesignResult={oqcDesginadaResult}
          setValue={setOqcDesginadaResult}
          view={view}
          validChecks={setvalidChecks}
        />
        <OQCRealizarDesignadaBody envioDatos={envioDatos} view={view} />
        {!view ? (
          <FormButtons onCancel={() => history.replace("/main/oqc/oqc-designadas")} />
        ) : (
          <div className="flex justify-center mt-5">
            <Button
              className={buttonClasses.blueButton}
              type="button"
              variant="contained"
              onClick={() => history.replace("/main/oqc/reporte-oqc")}>
              Atras
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
