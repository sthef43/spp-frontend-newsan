import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  FormControl,
  TextField,
  Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { HistoricoPanel } from "../components/HistoricoPanel";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ITrazaUnit } from "app/models/ITrazaUnit";
import { TrazaCambiosSliceRequest } from "app/Middleware/reducers/TrazaCambiosSlice";
import { ITrazaCambios } from "app/models/ITrazaCambios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import classNames from "classnames";
import moment from "moment";

export const HistoricoPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const [showExpanded, setshowExpanded] = React.useState<boolean>(false);
  const [operacion, setOperacion] = React.useState<TrazaOperaciones>();
  const [operaciones, setOperaciones] = React.useState<TrazaOperaciones[]>([]);
  const [cargando, setCargando] = React.useState(true);
  const [unidades, setUnidades] = React.useState<ITrazaUnit[]>([]);
  const [cambios, setCambios] = React.useState<ITrazaCambios[]>([]);
  const [expanded, setExpanded] = React.useState<string | false>("");
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() => {
    TitleChanger("Trazabilidad Historico");
  }, []);
  const initialDefaultVar = {
    codigo: ""
  };
  const { control, getValues, handleSubmit, formState, reset } = useForm({ defaultValues: initialDefaultVar });
  const dispatch = useAppDispatch();

  const getHistorialByCodigo = async (data) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      setOperaciones([]);
      setCambios([]);
      setUnidades([]);
      const operacionPrincipal = unwrapResult(
        await dispatch(TrazaOperacionesSliceRequests.getHistorialByCodigo(data?.codigo))
      );
      if (!operacionPrincipal) {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        openNotificationUI("No se encontro una Operacion para el codigo", "error");
        return;
      }
      const operaciones = [operacionPrincipal];
      getUnidades(operacionPrincipal.id);
      setOperaciones((current) => [...current, operacionPrincipal]);
      const mutableOperacionPrincipal = { ...operacionPrincipal };
      const opSemis = await buildOperacionesSemiElaborado(mutableOperacionPrincipal);
      operaciones.push(...opSemis);
      console.log(operaciones);
      // const haveSemiElaborado = operacionPrincipal.historial.find((d) => d.isSemiElaborado);

      setOperaciones((current) => [...current, ...opSemis]);

      setOperacion(operacionPrincipal);
      setshowExpanded(true);
    } catch (e) {
      console.error(e);
      openNotificationUI("Ha Ocurrido un error", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const buildOperacionesSemiElaborado = async (operacionPrincipal: TrazaOperaciones) => {
    const semisElaborados = operacionPrincipal.historial.filter((t) => t.isSemiElaborado);
    const operacionesSemiElaborados: TrazaOperaciones[] = [];
    const promises = [];
    semisElaborados.forEach((obj) => {
      obj.codigo != operacionPrincipal.codigoInit
        ? promises.push(getHistorialSemiElaboradoByCodigo(obj.codigo))
        : promises.push(getHistorialSemiElaboradoByOperacionId(obj.trazaOperaciones2Id));
    });
    const responses = await Promise.all(promises); // operaciones de los semielaborados
    if (responses.length >= 1) {
      responses.forEach((element) => {
        if (element.id != operacionPrincipal.id) {
          const principal = operacionPrincipal.historial.filter((d) => d.lineaPuestoId == element.lineaPuestoId);
          const semi = element.historial.filter((d) => d.lineaPuestoId == element.lineaPuestoId);
          if (principal.length > semi.length) {
            element.historial = element.historial.filter((d) => d.lineaPuestoId != element.lineaPuestoId);
            element.historial = [...element.historial, ...principal];
          } else {
            operacionPrincipal.historial = operacionPrincipal.historial.filter(
              (d) => d.lineaPuestoId != element.lineaPuestoId
            );
            operacionPrincipal.historial = [...operacionPrincipal.historial, ...semi];
          }
          operacionesSemiElaborados.push(element);
        }
      });
    }
    return operacionesSemiElaborados;
  };

  const getHistorialSemiElaboradoByCodigo = async (data) => {
    const elaboradoResponse = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.getHistorialByCodigo(data)));
    return elaboradoResponse;
  };

  const getHistorialSemiElaboradoByOperacionId = async (data) => {
    const elaboradoResponse = unwrapResult(
      await dispatch(TrazaOperacionesSliceRequests.getHistorialByOperacionId(data))
    );
    return elaboradoResponse;
  };

  const getUnidades = async (operacionId) => {
    const unidades = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.getPiezasByOperacion(operacionId)));

    if (unidades && unidades.length > 0) {
      const promises = [];
      unidades.forEach((u) => {
        promises.push(dispatch(TrazaCambiosSliceRequest.getHistorialByCodigo(u.codigo)));
      });
      let r = await Promise.all(promises);
      r = r.map((d) => unwrapResult(d)).filter((d) => d.length >= 1);
      let newArray = [];
      for (let index = 0; index < r.length; index++) {
        const element = r[index];
        newArray = [...newArray, ...element];
      }
      console.log(newArray);
      setCambios(newArray);
      setUnidades(unidades);
    }
  };

  return (
    <div className="my-2 mx-4">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew ">
        <div className="text-center text-xl">Escanee Codigo</div>
        <div className="mt-4">
          <form onSubmit={handleSubmit(getHistorialByCodigo)}>
            <Controller
              name="codigo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="filled" error={!!error}>
                  <TextField {...field} autoFocus variant="outlined" />
                </FormControl>
              )}
            />
          </form>
        </div>
      </div>
      <Divider />
      {showExpanded && (
        <>
          {operaciones.map((operacion) => (
            <HistoricoPanel key={operacion.id} operacion={operacion} refresh={handleSubmit(getHistorialByCodigo)} />
          ))}
        </>
      )}
      <Divider />
      {cambios.length > 0 && (
        <>
          <Accordion expanded={expanded === "root"} onChange={handleChange("root")} sx={{ margin: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
              <Typography sx={{ width: "50%", flexShrink: 0 }}>Historial De Cambios</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableComponent
                Dense={true}
                Overflow={false}
                buscar={false}
                IDcolumn={"id"}
                columns={[
                  {
                    title: "Pieza Nueva",
                    field: "piezaNueva"
                  },
                  {
                    title: "Pieza Anterior",
                    field: "piezaAnterior"
                  },
                  {
                    title: "Fecha",
                    field: "createdDate",
                    render: (row) => {
                      return (
                        <div className={classNames("w-full grid grid-cols-3 sm:grid-cols-2 gap-4", "py-0")}>
                          <div className="sm:hidden font-bold">Fecha:</div>
                          <div className={classNames("col-span-2 text-right  sm:text-left", "text-xs")}>
                            {moment(row.createdDate).format("DD-MM-YYYY HH:mm:ss")}
                          </div>
                        </div>
                      );
                    }
                  }
                ]}
                agregar={() => {
                  // openModal();
                }}
                dataInfo={cambios}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
};
