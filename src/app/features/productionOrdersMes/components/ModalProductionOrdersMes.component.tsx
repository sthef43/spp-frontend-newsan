import { ProductionOrdersSliceRequests } from "app/Middleware/reducers/mes/productionOrdersSlice";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import { useAppDispatch } from "app/core/store/store";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { IProductionOrders } from "app/models/mes/IProductionOrders";
import { IProducts } from "app/models/mes/IProducts";
import { typeOfErrorsReactHookForms } from "app/shared/helpers/typeOfErrorsReactHookForms";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Button, MenuItem, Switch, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
interface props {
  data: IProducts;
  setOpenPopup: any;
  productionOrder: IProductionOrders;
  refresh: any;
}
export const ModalProductionOrdersMes = ({ data, productionOrder, setOpenPopup, refresh }: props) => {
  const classes = MaterialButtons();
  let initialState;
  if (productionOrder) {
    initialState = productionOrder;
  } else {
    initialState = {
      consumedQty: 0,
      totalQty: "",
      name: "",
      enabled: true,
      productId: data?.id || 1,
      factoryId: 3
    };
  }
  const dispatch = useAppDispatch();
  const { State: ListOfOps } = useFetchApi<IXXE_WIP_OT[]>(XXE_WIP_OTSliceRequests.GetAllOPsForUse);
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm({
    defaultValues: initialState,
    shouldUnregister: true,
    mode: "all"
  });
  const nameWatch = watch("name");
  const { isDirty, isValid } = formState;
  const finish = async (e) => {
    const information = _.cloneDeep(getValues());
    let result;
    console.log(information);
    try {
      if (productionOrder) {
        result = unwrapResult(await dispatch(ProductionOrdersSliceRequests.PutRequest(information)));
      } else {
        result = unwrapResult(await dispatch(ProductionOrdersSliceRequests.PostRequest(information)));
      }
    } catch (e) {
      result = null;
    }
    if (result) {
      openNotificationUI("Orden de produccion creada con exito", "success");
      refresh();
      setOpenPopup(false);
    }
  };
  React.useEffect(() => {
    if (nameWatch) {
      if (ListOfOps) {
        const OP = ListOfOps.find((x) => x.wiP_ENTITY_NAME == nameWatch);
        setValue("totalQty", OP.starT_QUANTITY);
      }
    }
  }, [nameWatch]);
  return (
    <div>
      <form onSubmit={handleSubmit(finish)} style={{ width: "60vw" }}>
        <div className="my-2 grid grid-cols-1 gap-4 ">
          <TextField fullWidth variant="outlined" placeholder="Planta" label="Planta" value={"Planta 6"} />
          <TextField fullWidth variant="outlined" placeholder="Producto" label="Producto" value={data?.name} />
        </div>
        <div className="my-2 grid grid-cols-4 gap-2 ">
          <div className="col-span-3">
            <Controller
              name="name"
              control={control}
              rules={{ required: true, minLength: 2 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  placeholder="Nombre"
                  label="Nombre"
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.type}
                  select>
                  {ListOfOps?.map((elemento, index) => (
                    <MenuItem key={elemento.wiP_ENTITY_NAME} value={elemento.wiP_ENTITY_NAME as any}>
                      {elemento.wiP_ENTITY_NAME}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <Controller
              name="enabled"
              control={control}
              render={({ field, fieldState }) => <Switch {...field} checked={field.value} color="secondary" />}
            />
            <div className="font-semibold">Activo</div>
          </div>
          <div className="col-span-2">
            <Controller
              name="totalQty"
              control={control}
              rules={{ required: true, pattern: /^[0-9]*$/ }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  type="number"
                  placeholder="Cantidad Total"
                  label="Cantidad Total"
                  error={!!fieldState?.error}
                  helperText={typeOfErrorsReactHookForms(fieldState?.error?.type)}
                />
              )}
            />
          </div>
          <div className="col-span-2">
            <Controller
              name="consumedQty"
              control={control}
              rules={{ required: true, pattern: /^[0-9]*$/ }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  variant="outlined"
                  placeholder="Cantidad Consumida"
                  label="Cantidad Consumida"
                  error={!!fieldState?.error}
                  helperText={typeOfErrorsReactHookForms(fieldState?.error?.type)}
                />
              )}
            />
          </div>
          <div className="my-2 flex justify-around ">
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
