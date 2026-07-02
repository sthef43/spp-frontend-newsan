/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionRutasSliceRequest } from "app/Middleware/reducers/LineaProduccionRutasSlice";
import { LineaPuestoSliceRequest } from "app/Middleware/reducers/LineaPuestoSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { MapasRutasSliceRequest } from "app/Middleware/reducers/MapasRutasSlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { TrazaUnit_History2SliceRequests } from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ITurno } from "app/models";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
const defaultValues = {
  turnoId: 1,
  fecha: "",
  lineaId: 0
};
interface IDefaultValues {
  turnoId: number;
  fecha: string;
  lineaId: number;
}
export const ProduccionPorHoraPage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { handleSubmit, control, formState, watch, getValues, setValue } = useForm({ defaultValues });
  const turnos = useAppSelector((state) => state.turno.dataAll);
  const [total, setTotal] = useState(0);
  const [produccionFamilia, setProduccionFamilia] =
    useState<Array<{ total: number; familia: string; modelo: string }>>(null);
  const [produccionxHora, setProduccionxHora] =
    useState<Array<{ horaDesde: number; horaHasta: number; produccion: number }>>(null);
  const onGetTurnos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(TurnoSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const getCantidadProducion = async (horaDesde, horaHasta, lineaPuestoId, fecha) => {
    return unwrapResult(
      await dispatch(
        TrazaUnit_History2SliceRequests.getListByLineaPuestoAndFechaAndHora({
          lineaPuestoId,
          fecha: fecha,
          horaDesde,
          horaHasta
        })
      )
    );
  };

  const onSubmit = async (e: IDefaultValues) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const lineaProduccionRuta = unwrapResult(
        await dispatch(LineaProduccionRutasSliceRequest.getRutaActivaByLineaId(e.lineaId))
      );
      if (!lineaProduccionRuta) {
        openNotificationUI("Error al obtener la lineaProduccionRuta", "error");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        return;
      }
      const mapaRuta = unwrapResult(
        await dispatch(MapasRutasSliceRequest.getByRutaIdAndEsUltimo(lineaProduccionRuta.rutasId))
      );
      if (!mapaRuta) {
        openNotificationUI("Error al obtener el mapaRuta", "error");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        return;
      }
      const arrayLineaPuesto = unwrapResult(await dispatch(LineaPuestoSliceRequest.getAllByLineaId(e.lineaId)));
      if (!arrayLineaPuesto || arrayLineaPuesto.length == 0) {
        openNotificationUI("Error al obtener LineaPuesto", "error");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        return;
      }
      const turno = turnos.find((t) => t.id == e.turnoId);
      const history = unwrapResult(
        await dispatch(
          TrazaOperacionesSliceRequests.getListByLineaPuestoAndFechaAndHora({
            lineaPuestoId: arrayLineaPuesto[arrayLineaPuesto.length - 2].id,
            fecha: e.fecha,
            horaDesde: parseInt(turno.desdeHora),
            horaHasta: parseInt(turno.hastaHora)
          })
        )
      );
      console.log(arrayLineaPuesto[arrayLineaPuesto.length - 2].id);
      console.log(arrayLineaPuesto[arrayLineaPuesto.length - 1].id);

      if (!history || history.length == 0) {
        openNotificationUI("Sin historial", "warning");
        setTotal(0);
        setProduccionFamilia(null);
        setProduccionxHora(null);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        return;
      }
      setTotal(
        history.reduce((prevValue, value) => {
          return prevValue + value.id;
        }, 0)
      );
      setProduccionFamilia(
        history?.map((h) => {
          return { total: h.id, familia: h.familia, modelo: h.modelo };
        })
      );
      const arrayFinal = [];
      let cantidadTotal = 0;
      for (let index = parseInt(turno.desdeHora.slice(0, 2)); index < parseInt(turno.hastaHora.slice(0, 2)); index++) {
        const cantidad = await getCantidadProducion(
          index,
          index + 1,
          arrayLineaPuesto[arrayLineaPuesto.length - 2].id,
          e.fecha
        );
        const placasSinSemiElaborado = cantidad.filter((prod) => !prod.isSemiElaborado);
        const objeto = {
          horaDesde: index + ":00 HS",
          horaHasta: index + 1 + ":00 HS",
          produccion: placasSinSemiElaborado != null ? placasSinSemiElaborado.length : 0
        };
        arrayFinal.push(objeto);
        cantidadTotal = cantidadTotal + (placasSinSemiElaborado != null ? placasSinSemiElaborado.length : 0);
      }
      setProduccionxHora(arrayFinal);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const setLineaId = (lineaId: number) => {
    setValue("lineaId", lineaId);
  };
  const setFecha = (fecha: string) => {
    setValue("fecha", fecha);
  };
  useEffect(() => {
    onGetTurnos();
    TitleChanger("Produccion diaria");
  }, []);

  return (
    <div className="shadow-elevation-4 bg-secondaryNew m-5">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex justify-around gap-4">
        <div className="w-full flex gap-5">
          <SelectOFPlantAndProducts notShadow selectLineas setLineaProduccionId={setLineaId}>
            <FormControl variant="standard">
              <FormLabel>Turno</FormLabel>
              <Controller
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    {turnos.length > 0 &&
                      turnos?.map((t: ITurno) => (
                        <FormControlLabel key={t.id} value={t.id} control={<Radio />} label={t.nombre} />
                      ))}
                  </RadioGroup>
                )}
                rules={{ required: true }}
                control={control}
                name="turnoId"
              />
            </FormControl>
          </SelectOFPlantAndProducts>
          <div className="w-1/5 m-auto">
            <SelectOfDate pickFecha setFechaProps={setFecha} />
          </div>
        </div>
        <div className="pt-1 flex justify-around h-min m-auto" style={{ flex: "1 1 10%" }}>
          <Button
            className={classes.blueButton}
            type="submit"
            variant="contained"
            disabled={!formState.isDirty && !formState.isValid}>
            Buscar
          </Button>
        </div>
      </form>
      {total != 0 && watch("lineaId") != 0 && (
        <div className="animate__animated animate__fadeInUp">
          <Typography variant="h2" align="center">
            Total Producido: {total}
          </Typography>
        </div>
      )}
      {produccionFamilia?.length > 0 && watch("lineaId") != 0 && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
          <div className="w-full flex justify-center ">
            <TitleUIComponent title={"Modelos y Familias"} classNameDiv="w-full whitespace-wrap mx-0" />
          </div>
          <div>
            <TableComponent
              Dense={true}
              IDcolumn={"total"}
              columns={[
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Familia",
                  field: "familia"
                },
                {
                  title: "Produccion",
                  field: "total"
                }
              ]}
              dataInfo={produccionFamilia}
            />
          </div>
        </div>
      )}
      {produccionxHora?.length > 0 && watch("lineaId") != 0 && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
          <div className="w-full flex justify-center">
            <TitleUIComponent title={"Producción"} classNameDiv="w-full whitespace-wrap mx-0" />
          </div>
          <div>
            <TableComponent
              Dense={true}
              IDcolumn={"horaDesde"}
              columns={[
                {
                  title: "Hora Desde",
                  field: "horaDesde"
                },
                {
                  title: "Hora Hasta",
                  field: "horaHasta"
                },
                {
                  title: "Produccion",
                  field: "produccion"
                }
              ]}
              dataInfo={produccionxHora}
            />
          </div>
        </div>
      )}
    </div>
  );
};
