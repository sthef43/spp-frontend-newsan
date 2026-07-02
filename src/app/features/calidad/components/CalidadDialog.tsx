import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IControlLote } from "app/models/IControlLote";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { IPedidoCierreLote } from "app/models/IPedidoCierreLote";
import { IPlanProdMateriales } from "app/models/IPlanProdMateriales";
import { ProduccionMateriales } from "app/features/produccion/components/ProduccionMateriales";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PedidoMaterialesCalidadSliceRequests } from "app/Middleware/reducers/PedidoMaterialesCalidadSlice";
import { ControlLoteMaterialesSliceRequests } from "app/Middleware/reducers/ControlLoteMaterialesSlice";
interface props {
  id: number;
}

export const CalidadDialog = ({ id }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { State: controlLote } = useFetchApi<IControlLote>(ControlLoteSliceRequests.getControlLoteByIdRequest, id);
  const [listaMateriales, setListaMateriales] = React.useState<IPlanProdMateriales[]>([]);
  const [datosObservaciones, setDatosObservaciones] = React.useState<IPedidoCierreLote>(null);

  const getObservacionesPedido = async () => {
    const fetchObservacionesResult = unwrapResult(
      await dispatch(PedidoMaterialesCalidadSliceRequests.getByIdRequest(controlLote?.idControlLote))
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
        await dispatch(ControlLoteMaterialesSliceRequests.getMaterialesByIdControlLote(controlLote?.idControlLote))
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

  React.useEffect(() => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    if (controlLote?.idControlLote) {
      getListaMateriales(); //trae la lista de materiales si lo abro desde administracion y si es que tiene materiales
      getObservacionesPedido(); //traigo las observaciones que le hizo al pedido de material
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, [controlLote]);

  return (
    <div>
      {controlLote && (
        <div>
          <form noValidate autoComplete="off" style={{ width: "80vw" }}>
            <div className="grid grid-cols-2 gap-4 w-full">
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                label="Supervisor"
                value={controlLote?.nombreSupervisor}
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
                value={controlLote?.codigoModelo}
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
                value={controlLote?.lote}
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
                value={controlLote?.numeroOp}
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
                label="Cantidad rechazada"
                value={controlLote?.cantidadRechazos}
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
                    label="Devolución de Administración"
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
    </div>
  );
};
