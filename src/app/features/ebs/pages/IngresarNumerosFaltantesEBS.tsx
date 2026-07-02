import { DesktopDatePicker } from "@mui/x-date-pickers";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { useAppDispatch } from "app/core/store/store";
import { IInicio, ILinea } from "app/models";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export const IngresarNumerosFaltantesEBS = () => {
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [lineaSelect, setLineaSelect] = React.useState<boolean>(false);
  const [linea, setLinea] = React.useState([]);
  const [inicioResult, setInicioResult] = React.useState<IInicio[]>([]);
  const [SERIEResult, setSERIEResult] = React.useState([]);
  const [dataTableInicio, setDataTableInicio] = React.useState([]);
  const [dataTableSerie, setDataTableSerie] = React.useState([]);
  const [declare, setDeclare] = React.useState(false);
  const initialState = {
    fecha: moment().toDate(),
    linea: 0
  };

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });
  const fechaWatch = watch("fecha");
  const lineaWatch = watch("linea");
  const getAllLineasByPlantaId = async () => {
    let fetchLineaResult: ILinea[];
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult);
    }
  };
  const getAllByLineaInicio = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let fetchInicioResult: IInicio[];
    try {
      fetchInicioResult = unwrapResult(
        await dispatch(
          InicioSliceRequests.getAllByLinea({
            fecha: moment(getValues("fecha")).format("yyyy-MM-DD"),
            codLinea: getValues("linea")
          })
        )
      );
      setDeclare(false);
      setInicioResult(fetchInicioResult);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const getAllSERIEByFechaAndOp = async (ope) => {
    let fetchResultSERIE: IXXE_WIP_ITF_SERIE[];
    try {
      fetchResultSERIE = unwrapResult(await dispatch(XXE_WIP_ITF_SERIESliceRequests.getAllByFechaAndOp(ope)));
      setSERIEResult(fetchResultSERIE);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      onSearchDif(fetchResultSERIE);
    } catch (e) {
      openNotificationUI(e, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  const onSearchDif = (serieResult: IXXE_WIP_ITF_SERIE[]) => {
    if (serieResult.length != inicioResult.length && !declare) {
      diferenciaDeArreglos(serieResult, inicioResult);
    } else if (inicioResult.length > 0) {
      openNotificationUI("No hay numeros faltantes", "info");
    }
  };
  const diferenciaDeArreglos = (arr1, arr2) => {
    const groupArr1 = _.groupBy(arr1, "nrO_SERIE");
    const groupArr2 = _.groupBy(arr2, "codigoNewsan");
    const serieKeys = Object.keys(groupArr1);
    const inicioKeys = Object.keys(groupArr2);
    const diferencia = _.difference(inicioKeys, serieKeys);
    const arrDiferencia = diferencia.map((ope) => {
      return arr2.find((f) => f.codigoNewsan == ope);
    });
    setDataTableSerie(arrDiferencia);
  };
  const declararFaltantes = async () => {
    try {
      const response = await getConfirmation(
        "Ingresar números faltantes a EBS?",
        "Esta seguro que quiere ingresar los números faltantes a EBS?"
      );
      if (response) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const numerosFaltantesArr = dataTableSerie.map((num) => {
          return {
            codigO_PRODUCTO: "91" + num.modeloFin,
            nrO_SERIE: num.codigoNewsan,
            nrO_OP: num.nroOp,
            cantidad: 1,
            organizatioN_CODE: num.organizacion,
            fechA_INSERCION: new Date(),
            tranS_OK: 0
          };
        });
        const resp = await dispatch(XXE_WIP_ITF_SERIESliceRequests.multiPostRequest(numerosFaltantesArr));
        openNotificationUI("Se agregaron correctamente", "success");
        setSERIEResult([]);
        setInicioResult([]);
        setDataTableInicio([]);
        setDataTableSerie([]);
        getAllByLineaInicio();
        setDeclare(true);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };
  React.useEffect(() => {
    getAllLineasByPlantaId();
    TitleChanger("Ingresar numeros faltantes a EBS");
  }, []);
  React.useEffect(() => {
    if (dataTableSerie.length != 0) {
      declararFaltantes();
    }
  }, [dataTableSerie]);
  React.useEffect(() => {
    if (lineaWatch != 0) {
      getAllByLineaInicio();
    }
  }, [lineaWatch]);
  React.useEffect(() => {
    if (lineaWatch != 0) {
      getAllByLineaInicio();
    }
  }, [fechaWatch]);

  React.useEffect(() => {
    if (inicioResult.length != 0) {
      inicioResult.length > 0 ? setDataTableInicio(inicioResult) : setDataTableInicio(null);
      const arrResponse = _.groupBy(inicioResult, "nroOp");
      const stringOPArr = Object.keys(arrResponse);
      const opes = { opes: stringOPArr, fecha: moment(getValues("fecha")).format("yyyy-MM-DD") };
      getAllSERIEByFechaAndOp(opes);
    } else if (lineaWatch != 0) {
      setDataTableInicio([]);
      setDataTableSerie([]);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, [inicioResult]);

  return (
    <div className="my-2 mx-4">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="text-center sm:text-left p-2">
          <div className="w-full flex">
            {/* ----------------LINEA---------------*/}
            <FormControl className="mr-3" fullWidth variant="outlined">
              <InputLabel variant="filled">Seleccione una linea</InputLabel>
              <Controller
                name="linea"
                control={control}
                rules={{ required: "Seleccione una línea." }}
                render={({ field }) => (
                  <Select
                    className="pt-2"
                    {...field}
                    defaultValue={0}
                    onClick={() => {
                      setLineaSelect(true);
                    }}>
                    {linea &&
                      linea.map((linea) => (
                        <MenuItem key={linea.idLinea} value={linea.codigoReparacion}>
                          <div className="w-6">
                            <div>{linea.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
            {/* -------------FECHA----------- */}
            <div className="m-3 w-auto">
              <DesktopDatePicker
                label="Fecha"
                value={fechaWatch}
                inputFormat="yyyy/MM/DD"
                onChange={(e: any) => {
                  setSERIEResult([]);
                  setDataTableSerie([]);
                  setValue("fecha", e);
                }}
                renderInput={(field) => <TextField {...field} variant="standard" />}
              />
            </div>
          </div>
          {getValues("linea") != 0 && (
            <div className="animate__animated animate__fadeInUp flex justify-around">
              <div className="mr-3">
                <TitleUIComponent classNameTitle="text-base" title={"Faltantes en EBS"} />
                <TableComponent
                  columns={[
                    {
                      title: "Nro de serie",
                      field: "codigoNewsan"
                    },
                    {
                      title: "Número de OP",
                      field: "nroOp"
                    },
                    {
                      title: "Código de producto",
                      field: "",
                      render: (row) => <div>91{row?.modeloFin}</div>
                    },
                    {
                      title: "Cantidad",
                      field: "",
                      render: () => <div>1</div>
                    },
                    {
                      title: "Código de organización",
                      field: "organizacion"
                    }
                  ]}
                  IDcolumn="idInicio"
                  buscar
                  dataInfo={dataTableSerie}
                />
              </div>
              <div>
                <TitleUIComponent classNameTitle="text-base" title={"Equipos producidos"} />
                <TableComponent
                  columns={[
                    {
                      title: "Código de trazabilidad",
                      field: "codigoTrazabilidad"
                    },
                    {
                      title: "Código Newsan",
                      field: "codigoNewsan"
                    },
                    {
                      title: "Hora",
                      field: "hora"
                    },
                    {
                      title: "Modelo",
                      field: "modeloFin"
                    },
                    {
                      title: "Nro de OP",
                      field: "nroOp"
                    },
                    {
                      title: "Lote",
                      field: "lote"
                    }
                  ]}
                  IDcolumn="idInicio"
                  buscar
                  dataInfo={dataTableInicio}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
