import { FilledInput, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { TRANS_OK_DETSliceRequests } from "app/Middleware/reducers/TRANS_OK_DETSlice";
import { XXE_WIP_ITF_SERIESliceRequests } from "app/Middleware/reducers/XXE_WIP_ITF_SERIESlice";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import { useAppDispatch } from "app/core/store/store";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { formatDate } from "app/shared/helpers/date-formatter";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ConsultaPorOPPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { State: orgCods } = useFetchApi<IXXE_WIP_OT[]>(XXE_WIP_OTSliceRequests.GetAllOrgId);
  //const { State: transDetalles } = useFetchApi<ITRANS_OK_DET[]>(TRANS_OK_DETSliceRequests.getAllRequest);
  const [transDetalles, setTransDetalles] = useState([]);
  const [data, setData] = useState([]);
  const [dataAux, setDataAux] = useState([]);
  const defaultValuesVar = {
    orgCods: 0,
    OP: "",
    transDetalleFilter: 0
  };

  // ---------------TITULO---------
  React.useEffect(() => {
    console.log(data);
  }, [data]);

  React.useEffect(() => {
    TitleChanger("Consulta por OP");
    getAllTransDetalles();
  }, []);

  const { control, getValues, watch } = useForm({ defaultValues: defaultValuesVar });
  const watchFiltroTrans = watch("transDetalleFilter");

  const getAllTransDetalles = async () => {
    const result = unwrapResult(await dispatch(TRANS_OK_DETSliceRequests.getAllRequest()));
    if (result) {
      result.unshift({ id: 999, description: "Sin Filtro." });
      return setTransDetalles(result);
    }
  };

  const getAllByOp = async () => {
    try {
      const response = unwrapResult(
        await dispatch(
          XXE_WIP_ITF_SERIESliceRequests.getAllByOp({ orgId: getValues("orgCods"), ope: "OP-" + getValues("OP") })
        )
      );
      response.forEach((data) => {
        data = {
          ...data,
          transDetalles: transDetalles.find((trans) => trans.id == data.tranS_OK)?.description
        };
      });
      setDataAux(response);
      setData(response);
    } catch (e) {
      console.log(e);
      openNotificationUI(e, "error");
    }
  };
  const orgCodsWatch = watch("orgCods");
  const OPWatch = watch("OP");

  useEffect(() => {
    if (getValues("orgCods") != null && getValues("OP").length > 5) {
      getAllByOp();
    }
  }, [orgCodsWatch, OPWatch]);

  const watchDetallesFilter = watch("transDetalleFilter");

  useEffect(() => {
    if (watchDetallesFilter != null) {
      filtrarPorDetalle();
    }
  }, [watchDetallesFilter]);

  const filtrarPorDetalle = () => {
    if (watchDetallesFilter == 999) {
      setData([...dataAux]);
      return false;
    }
    const detailSelected = transDetalles.find((x) => x.id == watchDetallesFilter);
    const newArray = dataAux.filter((x) => x.transDetalles == detailSelected.description);
    setData(newArray);
  };

  return (
    <div className="shadow-elevation-4">
      <div
        className="m-2"
        style={{
          display: "flex",
          alignContent: "space-between",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          flexWrap: "wrap"
        }}>
        <div style={{ width: 400 }}>
          {orgCods && (
            <Controller
              name="orgCods"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="filled" error={!!error}>
                  <InputLabel>Seleccione una organización</InputLabel>
                  <Select {...field} variant="filled">
                    {orgCods &&
                      orgCods.map((x) => (
                        <MenuItem key={x.organizatioN_CODE} value={x.organizatioN_CODE}>
                          <div className="w-full">
                            <div>{x.organizatioN_CODE}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          )}
        </div>
        <div style={{ width: 400 }}>
          <Controller
            name="OP"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="filled" error={!!error}>
                <InputLabel> OP: </InputLabel>
                <FilledInput {...field} />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div style={{ width: 400 }}>
          {/* ----------------LINEA---------------*/}
          <FormControl fullWidth variant="outlined">
            <InputLabel variant="filled">Filtrar por Trans.</InputLabel>
            <Controller
              name="transDetalleFilter"
              control={control}
              rules={{ required: "Seleccione una línea." }}
              render={({ field }) => (
                <Select className="pt-2" {...field}>
                  {transDetalles &&
                    transDetalles.map((obj) => (
                      <MenuItem key={obj.id} value={obj.id}>
                        <div className="w-full">
                          <div>{obj.description}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>
        </div>
      </div>
      {getValues("orgCods") != null && getValues("OP").length > 5 && (
        <div className="animate__animated animate__fadeInUp">
          <TableComponent
            columns={[
              {
                title: "Nro de serie",
                field: "nrO_SERIE"
              },
              {
                title: "Código de producto",
                field: "codigO_PRODUCTO"
              },
              {
                title: "Fecha de proceso",
                field: "",
                render: (row) => {
                  return formatDate(row.fechA_PROCESO);
                }
              },
              {
                title: "Trans ok",
                field: "tranS_OK"
              },
              {
                title: "Trans ok detalle",
                field: "transDetalles"
              },
              {
                title: "EBS eror desc",
                field: "ebS_ERROR_DESC"
              },
              {
                title: "EBS eror trans",
                field: "ebS_ERROR_TRANS"
              }
            ]}
            IDcolumn="id"
            buscar
            dataInfo={data}
          />
        </div>
      )}
    </div>
  );
};
