import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { Delete } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller, useForm } from "react-hook-form";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { PeriodoLineaSliceRequest } from "app/Middleware/reducers/periodoLineaSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";

interface props {
  setModalOpenAsignarLineas: any;
  periodoId: number;
  refresh: any;
}

export const AccionAsignarLineas = ({ setModalOpenAsignarLineas, periodoId, refresh }: props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [dataSource, setDataSource] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const lineas = useAppSelector((state) => state.linea.dataAll);

  const { getConfirmation } = useConfirmationDialog();

  const deleteRow = async (row) => {
    const resp = await getConfirmation("Borrar", "Está seguro que desea borrar?");
    if (resp) {
      const response = unwrapResult(await dispatch(PeriodoLineaSliceRequest.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        getList();
      }
    }
  };
  const getList = async () => {
    const responses = unwrapResult(await dispatch(PeriodoLineaSliceRequest.getAllRequest()));
    const arrayFiltrado = responses.filter((x) => x.periodoId == periodoId); //Filtro por periodoId...
    setDataSource(JSON.parse(JSON.stringify(arrayFiltrado)));
  };

  React.useEffect(() => {
    TitleChanger("CARGA DE HORA");
    getList();
    dispatch(LineaSliceRequests.getAllRequest());
  }, []);

  interface initialState {
    periodoId: number;
    lineaId: number;
  }
  const initialStateVar = {
    periodoId: periodoId,
    lineaId: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { isDirty, isValid, errors } = formState;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const Submit = async (e) => {
    console.log(e);

    let result;
    try {
      result = await dispatch(PeriodoLineaSliceRequest.postRequest(JSON.parse(JSON.stringify(e))));
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente ", "success");
      getList();
    }
  };

  return (
    <div className="my-2 mx-4 h-full">
      <form onSubmit={handleSubmit(Submit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="lineaId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione una linea</InputLabel>
                  <Select {...field} variant="standard">
                    {lineas &&
                      lineas.map((x) => (
                        <MenuItem key={x.idLinea} value={x.idLinea}>
                          <div className="w-full">
                            <div>{x.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button type="submit" variant="contained" className={classes.greenButton} disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>

      <TableComponent
        Dense={true}
        Overflow={false}
        buscar={false}
        IDcolumn={"id"}
        columns={[
          {
            title: "Linea",
            field: "linea.descripcion"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <IconButton
                      onClick={() => {
                        deleteRow(row.id);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
                  </div>
                </div>
              );
            }
          }
        ]}
        dataInfo={dataSource}
      />
    </div>
  );
};
