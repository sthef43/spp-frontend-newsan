import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPlanProdMateriales } from "app/models/IPlanProdMateriales";
import { PlanProdMaterialesSliceRequests } from "app/Middleware/reducers/PlanProdMaterialesSlice";
import { IAppUser, ILinea, IPlanProd, ISuperCargalinea } from "app/models";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { IPedidoMaterialesProduccion } from "app/models/IPedidoMaterialesProduccion";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { useForm } from "react-hook-form";
import { ProduccionMateriales } from "../../../produccion/components/ProduccionMateriales";
import moment from "moment";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PedidoMaterialesProduccionSliceRequests } from "app/Middleware/reducers/PedidoMaterialesProduccionSlice";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "../../../../shared/components/ModalComponent";
import { MaterialesDialog } from "../../../calidad/components/MaterialesDialog";

interface props {
  selectedPedidoMateriales: IPedidoMaterialesProduccion;
  setModalEditOpen: any;
  callback: any;
}

export const PedidoMaterialDialog = ({ selectedPedidoMateriales, setModalEditOpen, callback }: props): JSX.Element => {
  const classesButton = MaterialButtons();
  const dispatch = useAppDispatch();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const { State: datosPlanProd } = useFetchApi<IPlanProd>(
    PlanProdSliceRequests.getByIdRequest,
    selectedPedidoMateriales?.idPlanProdNavigation.idProduccion
  );

  const [modalCargaMaterialesOpen, setModalCargaMaterialesOpen] = React.useState(false);
  const [selectedMaterial, setSelectedMaterial] = React.useState<ISuperCargalinea[]>([]);

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
    idPlanProd: selectedPedidoMateriales?.idPlanProd,
    observaciones: selectedPedidoMateriales?.observaciones || "",
    devolucion: selectedPedidoMateriales?.devolucion || "",
    nroSi: selectedPedidoMateriales?.nroSi || "",
    nroPo: selectedPedidoMateriales?.nroPo || "",
    nroEmbarque: selectedPedidoMateriales?.nroEmbarque || "",
    eta: selectedPedidoMateriales?.eta || moment().toISOString(),
    fechaLibEmbarque: selectedPedidoMateriales?.fechaLibEmbarque || moment().toISOString(),
    estadoOpReparacion: selectedPedidoMateriales?.estadoOpReparacion || moment().toISOString()
  };
  const [listaMateriales, setListaMateriales] = React.useState<IPlanProdMateriales[]>([]);
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
          PlanProdMaterialesSliceRequests.getMaterialesByIdPlanProd(
            selectedPedidoMateriales?.idPlanProdNavigation.idProduccion
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
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getByIdRequest(datosPlanProd?.idLinea)));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult);
    }
  };

  React.useEffect(() => {
    console.log(selectedPedidoMateriales?.idPlanProdNavigation);
    getListaMateriales(); //trae la lista de materiales si lo abro desde administracion y si es que tiene materiales
  }, []);

  React.useEffect(() => {
    if (datosPlanProd !== null) {
      getLinea();
    }
  }, [datosPlanProd]);

  const handleCancelar = () => {
    setModalEditOpen(false);
  };

  const refreshMateriales = () => {
    getListaMateriales();
  };

  const sendEmailMateriales = async (datosPlanprod: IPlanProd) => {
    await dispatch(
      EmailSliceRequest.EmailPedidoMaterialesAdministracion({
        planProd: datosPlanprod?.idProduccion,
        infoSupervisor: GetInfoUser().username,
        observaciones: selectedPedidoMateriales?.observaciones,
        descripLinea: datosLinea?.idLinea
      })
    );
  };

  const handleActualizarPedido = async () => {
    console.log("llego?");
    const nuevoObjeto: IPedidoMaterialesProduccion = {
      ...selectedPedidoMateriales,
      ...getValues(),
      estadoPedido: "P"
    };

    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result;
    try {
      result = await dispatch(PedidoMaterialesProduccionSliceRequests.putRequest(nuevoObjeto));
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
    const nuevoObjeto: IPedidoMaterialesProduccion = getValues();
    if (!rechazado) {
      nuevoObjeto.estadoPedido = "A"; //APROBADO
    } else {
      nuevoObjeto.estadoPedido = "R"; //RECHAZADO
    }
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result;
    try {
      result = await dispatch(PedidoMaterialesProduccionSliceRequests.putRequest(nuevoObjeto));
    } catch (err) {
      result = null;
    }
    if (result) {
      await sendEmailMateriales(datosPlanProd);
      openNotificationUI("Datos del pedido de materiales actualizados.", "success");
    } else {
      openNotificationUI("No se pudieron actualizar los datos del pedido.", "error");
    }
    callback(); //actualizo la tabla
    setModalEditOpen(false);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const handleGuardarMateriales = async (material) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

      const materialesAux: IPlanProdMateriales[] = [];
      material.map((mat: ISuperCargalinea) => {
        const guardarListaMateriales: IPlanProdMateriales = {
          codigoModelo: mat.codigoModelo,
          codigoPautas: mat.codigoPautas,
          numeroOp: mat.numeroOp,
          cantidad: mat.cantidadMaterial,
          nombreSupervisor: infoUser.operator.name + " " + infoUser.operator.surname,
          descripcion: mat.descripcion,
          idPlanProd: selectedPedidoMateriales?.idPlanProdNavigation.idProduccion
        };
        materialesAux.push(guardarListaMateriales);
      });

      console.log(materialesAux);

      const response = unwrapResult(await dispatch(PlanProdMaterialesSliceRequests.multiPostRequest(materialesAux)));
      if (!response) {
        throw new Error("Ha OPcrruido un error");
      }
      openNotificationUI("Datos Guardados correctamente.", "success");
      setSelectedMaterial([]);
      refreshMateriales();
    } catch (error) {
      console.error(error);
      openNotificationUI("No se agregar los materiales.", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  React.useEffect(() => {
    console.log(selectedMaterial);
    if (selectedMaterial && selectedMaterial.length > 0) {
      handleGuardarMateriales(selectedMaterial);
    }
  }, [selectedMaterial]);

  return (
    <div>
      {datosPlanProd && (
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
                  <ProduccionMateriales materiales={listaMateriales} refresh={refreshMateriales} />
                </AccordionDetails>
              </Accordion>
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Button
          className={classesButton.greenButton}
          variant="contained"
          onClick={(e) => {
            setModalCargaMaterialesOpen(true);
          }}>
          Agregar Material
        </Button>
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
      <ModalCompoment
        title="Agregar Material"
        openPopup={modalCargaMaterialesOpen}
        setOpenPopup={setModalCargaMaterialesOpen}>
        <MaterialesDialog
          numeroOp={selectedPedidoMateriales?.idPlanProdNavigation.numeroOp}
          cantidadEquipos={
            +selectedPedidoMateriales?.idPlanProdNavigation.cantidad -
            +selectedPedidoMateriales?.idPlanProdNavigation.cantidadProducida
          }
          setSelectedMaterial={setSelectedMaterial}
          setOpenPopup={setModalCargaMaterialesOpen}
        />
      </ModalCompoment>
    </div>
  );
};
