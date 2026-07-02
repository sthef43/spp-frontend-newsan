import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import { useAppDispatch } from "app/core/store/store";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import _ from "lodash";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ConsultaEBSPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { State: orgCods } = useFetchApi<IXXE_WIP_OT[]>(XXE_WIP_OTSliceRequests.GetAllOrgId);
  const [data, setData] = useState(null);
  const defaultValuesVar = {
    orgCods: "UP6"
  };
  const { control, getValues } = useForm({ defaultValues: defaultValuesVar });
  const getAllByOrgId = async (orgId: string) => {
    try {
      const response = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.GetAllByOrgId(orgId)));
      const group = _.groupBy(response, "organizatioN_CODE");
      console.log(group);
      setData(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  // ---------------TITULO---------
  React.useEffect(() => {
    TitleChanger("Consulta a EBS Buenos Aires");
    getAllByOrgId("UP6");
  }, []);

  return (
    <div className="my-2 mx-4 bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
      {orgCods && (
        <Controller
          name="orgCods"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="filled" error={!!error}>
              <InputLabel>Seleccione una organización</InputLabel>
              <Select {...field} variant="filled" onClick={() => getAllByOrgId(getValues("orgCods"))}>
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
      {getValues("orgCods") != null && (
        <div className="animate__animated animate__fadeInUp">
          <TableComponent
            columns={[
              {
                title: "N° OP",
                field: "wiP_ENTITY_NAME"
              },
              {
                title: "Cantidad",
                field: "starT_QUANTITY"
              },
              {
                title: "Producido",
                field: "quantitY_COMPLETED"
              },
              {
                title: "Lote",
                field: "aLTERNATE_BOM_DESIGNATOR"
              },
              {
                title: "Modelo",
                field: "segmenT1"
              },
              {
                title: "Organización",
                field: "organizatioN_CODE"
              }
            ]}
            IDcolumn="wiP_ENTITY_NAME"
            buscar
            dataInfo={data}
          />
        </div>
      )}
    </div>
  );
};
