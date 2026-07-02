import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { IControlLote, ILinea } from "app/models";
import { IPedidoMaterialesCalidad } from "app/models/IPedidoMaterialesCalidad";
import { IControlLoteMateriales } from "app/models/IControlLoteMateriales";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useForm } from "react-hook-form";
import { ProduccionMateriales } from "../../../produccion/components/ProduccionMateriales";
import moment from "moment";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { ControlLoteMaterialesSliceRequests } from "app/Middleware/reducers/ControlLoteMaterialesSlice";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { PedidoMaterialesCalidadSliceRequests } from "app/Middleware/reducers/PedidoMaterialesCalidadSlice";

interface props {
  selectedPedidoMateriales: IPedidoMaterialesCalidad;
  setModalEditOpen: any;
  callback: any;
}

export const PedidoMaterialCalidadDialog = ({
  selectedPedidoMateriales,
  setModalEditOpen,
  callback
}: props): JSX.Element => {
  const classesButton = MaterialButtons();
  const dispatch = useAppDispatch();
  const { State: datosControlLote } = useFetchApi<IControlLote>(
    ControlLoteSliceRequests.getControlLoteByIdRequest,
    selectedPedidoMateriales?.idControlLote
  );
  const defaultPedidoMaterialesLabels = {
    observaciones: "Observaciones",
    devolucion: "Devolucion",
    nroSi: "Número SI",
    nroPo: "Número PO",
    nroEmbarque: "Número de embarque",
    eta: "Tiempo estimado de arribo",
    fechaLibEmbarque: "Fecha de lib. embarque",
    estadoOpReparacion: "Estado OP reparacion"
  };
  const defaultPedidoMaterialesValues = {
    id: selectedPedidoMateriales?.id,
    idPlanProd: selectedPedidoMateriales?.idControlLote,
    observaciones: selectedPedidoMateriales?.observaciones || "",
    devolucion: selectedPedidoMateriales?.devolucion || "",
    nroSi: selectedPedidoMateriales?.nroSi || "",
    nroPo: selectedPedidoMateriales?.nroPo || "",
    nroEmbarque: selectedPedidoMateriales?.nroEmbarque || "",
    eta: selectedPedidoMateriales?.eta || moment().toISOString(),
    fechaLibEmbarque: selectedPedidoMateriales?.fechaLibEmbarque || moment().toISOString(),
    estadoOpReparacion: selectedPedidoMateriales?.estadoOpReparacion || moment().toISOString()
  };
  const [listaMateriales, setListaMateriales] = React.useState<IControlLoteMateriales[]>([]);
  const [datosLinea, setLinea] = React.useState<ILinea>();
  const { openNotificationUI } = useNotificationUI();
  const { control, getValues } = useForm({
    defaultValues: defaultPedidoMaterialesValues,
    mode: "onChange"
  });

  const getListaMateriales = async () => {
    let fetchListaMaterialesResult;
    try {
      fetchListaMaterialesResult = unwrapResult(
        await dispatch(
          ControlLoteMaterialesSliceRequests.getMaterialesByIdControlLote(
            selectedPedidoMateriales?.idControlLoteNavigation.idControlLote
          )
        )
      );
    } catch (error) {
      fetchListaMaterialesResult = null;
    }
    if (fetchListaMaterialesResult) {
      console.log(
        "🚀 ~ file: ProduccionDialog.tsx ~ line 78 ~ getListaMateriales ~ fetchListaMaterialesResult",
        fetchListaMaterialesResult
      );
      setListaMateriales(fetchListaMaterialesResult);
    }
  };

  const getLinea = async () => {
    let fetchLineaResult;
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getByIdRequest(datosControlLote?.idLinea)));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult);
    }
  };

  React.useEffect(() => {
    getListaMateriales(); //trae la lista de materiales si lo abro desde administracion y si es que tiene materiales
  }, []);

  React.useEffect(() => {
    if (datosControlLote !== null) {
      getLinea();
    }
  }, [datosControlLote]);

  const handleCancelar = () => {
    setModalEditOpen(false);
  };

  const sendEmailMateriales = async (datosControlLote: IControlLote) => {
    await dispatch(
      EmailSliceRequest.PedidoMaterialesCalidadAdministracionEmail({
        controlLote: datosControlLote?.idControlLote,
        infoSupervisor: GetInfoUser().username,
        observaciones: selectedPedidoMateriales?.observaciones,
        descripLinea: datosLinea?.idLinea
      })
    );
  };

  const handleActualizarPedido = async () => {
    console.log("llego?");
    const nuevoObjeto: IPedidoMaterialesCalidad = {
      ...selectedPedidoMateriales,
      ...getValues(),
      estadoPedido: "P"
    };

    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result;
    try {
      result = await dispatch(PedidoMaterialesCalidadSliceRequests.putRequest(nuevoObjeto));
    } catch (err) {
      result = null;
    }
    if (result) {
      openNotificationUI("Datos del pedido de materiales actualizados.", "success");
    } else {
      openNotificationUI("No se pudieron actualizar los datos del pedido.", "error");
    }
    callback(); //actualizo la tabla
    setModalEditOpen(false);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const handleGuardar = async (rechazado?: boolean) => {
    const nuevoObjeto: IPedidoMaterialesCalidad = {
      ...selectedPedidoMateriales,
      ...getValues()
    };
    if (!rechazado) {
      nuevoObjeto.estadoPedido = "A"; //APROBADO
    } else {
      nuevoObjeto.estadoPedido = "R"; //RECHAZADO
    }
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result;
    try {
      result = await dispatch(PedidoMaterialesCalidadSliceRequests.putRequest(nuevoObjeto));
    } catch (err) {
      result = null;
    }
    if (result) {
      await sendEmailMateriales(datosControlLote);
      openNotificationUI("Datos del pedido de materiales actualizados.", "success");
    } else {
      openNotificationUI("No se pudieron actualizar los datos del pedido.", "error");
    }
    callback(); //actualizo la tabla
    setModalEditOpen(false);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  return (
    <div>
      {datosControlLote && (
        <div>
          <div style={{ width: "80vw" }}>
            <div className="grid grid-cols-2 gap-4 w-full">
              <GenericFieldsGenerator
                values={defaultPedidoMaterialesValues}
                control={control}
                styleDiv={"text-center mb-5"}
                styleFieldSX={{ width: "100%" }}
                labels={defaultPedidoMaterialesLabels}
                // selectFields={state}
                variant="standard"
              />
            </div>
          </div>

          {listaMateriales.length > 0 && (
            <div className="w-full mb-2">
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography className="text-base ">Materiales Solicitados</Typography>
                </AccordionSummary>
                <AccordionDetails className="w-full flex flex-col">
                  <ProduccionMateriales materiales={listaMateriales} />
                </AccordionDetails>
              </Accordion>
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Button
          className={classesButton.blueButton}
          variant="contained"
          color="primary"
          onClick={handleActualizarPedido}>
          Guardar
        </Button>
        <Button
          className={classesButton.purpleButton}
          variant="contained"
          color="primary"
          onClick={() => {
            handleGuardar(false);
          }}>
          Liberar para Reproceso
        </Button>
        <Button className={classesButton.redButton} color="error" variant="contained" onClick={handleCancelar}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
