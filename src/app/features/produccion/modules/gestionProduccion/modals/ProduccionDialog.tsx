import React from "react";

import { Accordion, AccordionDetails, AccordionSummary, Button, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IPlanProd } from "app/models/IPlanProd";
import { IInicio } from "app/models/IInicio";
import { ProduccionDiaria } from "app/features/produccion/modules/gestionProduccion/components/ProduccionDiaria";
import { ProduccionRechazados } from "app/features/produccion/components/ProduccionRechazados";
import { IControlLote } from "app/models/IControlLote";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPedidoCierreLote } from "app/models/IPedidoCierreLote";
import { PedidoCierreLoteSliceRequests } from "app/Middleware/reducers/PedidoCierreLoteSlice";
import { IPlanProdMateriales } from "app/models/IPlanProdMateriales";
import { PlanProdMaterialesSliceRequests } from "app/Middleware/reducers/PlanProdMaterialesSlice";
import { ProduccionMateriales } from "../../../components/ProduccionMateriales";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PedidoMaterialesProduccionSliceRequests } from "app/Middleware/reducers/PedidoMaterialesProduccionSlice";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { MaterialesDialog } from "../../../../calidad/components/MaterialesDialog";
import { IAppUser, ISuperCargalinea } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface props {
  id: number;
  esAdministracion?: boolean;
  loteSelect?: IPlanProd | null;
}

export const ProduccionDialog = ({ id, esAdministracion = false, loteSelect }: props): JSX.Element => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const [datosControlLote, setdatosControlLote] = React.useState<IControlLote[]>([]);
  const [listaMateriales, setListaMateriales] = React.useState<IPlanProdMateriales[]>([]);
  const [datosObservaciones, setDatosObservaciones] = React.useState<IPedidoCierreLote>(null);
  const [modalCargaMaterialesOpen, setModalCargaMaterialesOpen] = React.useState(false);
  const [selectedMaterial, setSelectedMaterial] = React.useState<ISuperCargalinea[]>([]);

  const { openNotificationUI } = useNotificationUI();
  const classesButton = MaterialButtons();
  const dispatch = useAppDispatch();

  const onInit = async () => {
    const fetchResult = unwrapResult(
      await dispatch(
        ControlLoteSliceRequests.getAllRechazosRequest({
          modeloA: datosPlanProd?.numeroOp,
          modeloB: datosPlanProd?.lote
        })
      )
    );
    setdatosControlLote(fetchResult);
  };

  const { State: datosPlanProd } = useFetchApi<IPlanProd>(PlanProdSliceRequests.getByIdRequest, id);

  const getObservaciones = async () => {
    const fetchObservacionesResult = unwrapResult(
      await dispatch(PedidoCierreLoteSliceRequests.getByIdRequest(datosPlanProd?.idProduccion))
    );
    setDatosObservaciones(fetchObservacionesResult);
  };
  const getObservacionesPedido = async () => {
    const fetchObservacionesResult = unwrapResult(
      await dispatch(PedidoMaterialesProduccionSliceRequests.getByIdRequest(datosPlanProd?.idProduccion))
    );
    console.log(
      "🚀 ~ file: ProduccionDialog.tsx ~ line 58 ~ getObservaciones ~ fetchObservacionesResult",
      fetchObservacionesResult
    );
    setDatosObservaciones(fetchObservacionesResult);
  };

  const getListaMateriales = async () => {
    let fetchListaMaterialesResult;
    try {
      fetchListaMaterialesResult = unwrapResult(
        await dispatch(PlanProdMaterialesSliceRequests.getMaterialesByIdPlanProd(datosPlanProd?.idProduccion))
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
          idPlanProd: id
        };
        materialesAux.push(guardarListaMateriales);
      });
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

  const refreshMateriales = () => {
    getListaMateriales();
  };

  React.useEffect(() => {
    if (selectedMaterial && selectedMaterial.length > 0) {
      handleGuardarMateriales(selectedMaterial);
    }
  }, [selectedMaterial]);

  React.useEffect(() => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    if (datosPlanProd?.idProduccion) {
      onInit();
      if (esAdministracion) {
        getListaMateriales(); //trae la lista de materiales si lo abro desde administracion y si es que tiene materiales
        getObservacionesPedido(); //traigo las observaciones que le hizo al pedido de material
      } else {
        getObservaciones();
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, [datosPlanProd]);

  //Calcular Cantidad Producido
  const calcularCantidad = () => {
    console.log(loteSelect);
    let cantidad = 0;
    let cantidadTotal = 0;
    console.log(datosPlanProd);
    if (
      datosPlanProd.linea.descripcion.toLowerCase().includes("nsercion") ||
      datosPlanProd.linea.descripcion.toLowerCase().includes("im")
    ) {
      const cantidadLote = loteSelect.cantidad;
      const cantidadProducida = parseInt(loteSelect.cantidadProducida);
      console.log(cantidadLote);
      console.log(cantidadProducida);
      cantidadTotal = cantidadLote - cantidadProducida;
    } else {
      datosPlanProd.inicio.map((prodDia: IInicio) => {
        cantidad += prodDia.producido;
      });
      cantidadTotal = datosPlanProd.cantidad - cantidad;
    }
    console.log(cantidadTotal);
    return cantidadTotal;
  };

  // const calcularCantidad = () => {
  //   let cantidad = 0;
  //   datosPlanProd &&
  //     datosPlanProd.inicio.map((prodDia: IInicio) => {
  //       cantidad += prodDia.producido;
  //     });
  //   return datosPlanProd.cantidad - cantidad;
  // };

  return (
    <div>
      {datosPlanProd && (
        <div>
          <form noValidate autoComplete="off" style={{ width: "80vw" }}>
            <div className="grid grid-cols-2 gap-4 w-full">
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
            {datosObservaciones && (
              <div className="my-10">
                <hr />
                <TextField
                  id="standard-full-width"
                  style={{ margin: 8 }}
                  fullWidth
                  margin="normal"
                  label="Observaciones"
                  value={datosObservaciones?.observaciones}
                  InputLabelProps={{
                    shrink: true
                  }}
                  disabled
                  variant="standard"
                />
                {datosObservaciones?.devolucion && (
                  <TextField
                    id="standard-full-width"
                    style={{ margin: 8 }}
                    fullWidth
                    margin="normal"
                    label="Devolución de Gerencia"
                    value={datosObservaciones?.devolucion}
                    InputLabelProps={{
                      shrink: true
                    }}
                    disabled
                    variant="standard"
                  />
                )}
              </div>
            )}
          </form>

          <div className="w-full mb-2">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className="text-base ">Produccion diaria</Typography>
              </AccordionSummary>
              <AccordionDetails className="w-full flex flex-col">
                {datosPlanProd?.inicio?.length > 0 ? (
                  <ProduccionDiaria inicio={datosPlanProd?.inicio} />
                ) : (
                  <AccordionDetails className="w-full flex flex-col">
                    <Typography className="text-base ">Sin equipos producidos</Typography>
                  </AccordionDetails>
                )}
              </AccordionDetails>
            </Accordion>
          </div>
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
          <Button
            className={classesButton.greenButton + "w-full"}
            variant="contained"
            onClick={(e) => {
              setModalCargaMaterialesOpen(true);
            }}>
            Agregar Material
          </Button>
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

          <ModalCompoment
            title="Agregar Material"
            openPopup={modalCargaMaterialesOpen}
            setOpenPopup={setModalCargaMaterialesOpen}>
            <MaterialesDialog
              numeroOp={datosPlanProd?.numeroOp}
              cantidadEquipos={calcularCantidad()}
              setSelectedMaterial={setSelectedMaterial}
              setOpenPopup={setModalCargaMaterialesOpen}
            />
          </ModalCompoment>
        </div>
      )}
    </div>
  );
};
