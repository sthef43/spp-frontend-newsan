import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioHistorySliceRequests } from "app/Middleware/reducers/InicioHistorySlice";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPlanProd } from "app/models";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ReasigNumSeriePage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const inicioHistory = useAppSelector((state) => state.inicioHistory.dataAll);
  const [fechaDesde, setFechaDesde] = React.useState("");
  const [fechaHasta, setFechaHasta] = React.useState("");
  // const [lineaProduccionId, setLineaProduccionId] = React.useState<number>(0);
  const [codigoError, setCodigoError] = React.useState<string>("");
  const [modelos, setModelos] = useState<IPlanProd[]>([]);

  const { control, getValues, setValue, watch } = useForm({
    defaultValues: { modelo: "" }
  });

  const getHistory = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(
        InicioHistorySliceRequests.getAllByFechaAndModelo({
          fechaDesde,
          fechaHasta,
          modelo: getValues("modelo")
        })
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const handleModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      setValue("modelo", "");
      const lineas = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      const lineaId = lineas.find((l) => l.codigoReparacion == codigoError).idLinea;
      const response = unwrapResult(await dispatch(PlanProdSliceRequests.getAllModelosByLineaIdRequest(lineaId)));
      setModelos(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getModeloProducido = async () => {
    try {
      const response = unwrapResult(await dispatch(InicioSliceRequests.getModeloProducidoByCN(codigoError)));
      setValue("modelo", response || "");
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  const { TitleChanger } = useTitleOfApp();
  useEffect(() => {
    TitleChanger("INFORME DE REASIGNACIÓN DE NUM. SERIES");
  }, []);

  React.useEffect(() => {
    modelos?.length > 0 && getModeloProducido();
  }, [modelos]);

  React.useEffect(() => {
    codigoError?.length > 0 && handleModelos();
  }, [codigoError]);

  return (
    <div className="py-3 m-3 flex flex-col w-full justify-center max-w-full">
      <div className="p-3 w-full m-auto  flex flex-col items-center shadow-elevation-4 bg-secondaryNew">
        <SelectOFPlantAndProducts
          selectLineas
          // setLineaProduccionId={setLineaProduccionId}
          setCodigoErrorProps={setCodigoError}
          notShadow
        />
        {codigoError?.length > 0 && (
          <div className="m-auto">
            <div className="grid grid-cols-3 gap-5 w-full">
              <Controller
                control={control}
                name="modelo"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Seleccione un modelo</InputLabel>
                    <Select {...field}>
                      {modelos &&
                        modelos.map((modelo, index) => (
                          <MenuItem key={index} value={modelo.nombre}>
                            {modelo.nombre}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
              <SelectOfDate fechaDesdeHasta setFechaDesdeProps={setFechaDesde} setFechaHastaProps={setFechaHasta} />
              <div className="flex justify-center m-auto">
                <Button
                  className={classes.blueButton + " h-min"}
                  onClick={getHistory}
                  disabled={getValues("modelo")?.length == 0}>
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {watch("modelo") != "" && (
        <TableComponent
          columns={[
            {
              title: "Número de trazabilidad original",
              field: "codigoTrazabilidadOriginal"
            },
            {
              title: "Número de trazabilidad destino",
              field: "codigoTrazabilidad"
            },
            {
              title: "Número de serie",
              field: "codigoNewsan"
            },
            {
              title: "Turno",
              field: "turno"
            },
            {
              title: "Fecha y hora",
              field: "",
              render: (row) => moment(row.createdDate).format("L HH:mm:ss")
            },
            {
              title: "Usuario",
              field: "userName"
            }
          ]}
          dataInfo={inicioHistory}
          IDcolumn="id"
          buscar
          excel
          fileNameExcel="Informe de reasginacion de numeros de serie"
        />
      )}
    </div>
  );
};
