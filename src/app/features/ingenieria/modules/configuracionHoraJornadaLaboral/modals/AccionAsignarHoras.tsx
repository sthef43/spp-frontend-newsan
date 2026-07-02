import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { Delete } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller, useForm } from "react-hook-form";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { PeriodoHoraSliceRequests } from "app/Middleware/reducers/periodoHoraSlice";
import { HoraSliceRequests } from "app/Middleware/reducers/HoraSlice";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { PeriodoSliceRequests } from "app/Middleware/reducers/periodoSlice";

interface props {
  setModalOpenAsignarHora: any;
  periodoId: number;
  refresh: any;
  turno: string;
}

export const AccionAsignarHoras = ({ setModalOpenAsignarHora, periodoId, refresh, turno }: props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [dataSource, setDataSource] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [horas, setHoras] = useState([]);

  const { getConfirmation } = useConfirmationDialog();

  console.log(turno);

  const deleteRow = async (row) => {
    const resp = await getConfirmation("Borrar", "Está seguro que desea borrar?");
    if (resp) {
      const response = unwrapResult(await dispatch(PeriodoSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino correctamente", "success");
        getList();
      }
    }
  };
  const getList = async () => {
    const responses = unwrapResult(await dispatch(PeriodoHoraSliceRequests.getListByPeriodoId(periodoId)));
    setDataSource(JSON.parse(JSON.stringify(responses)));
  };

  const getHoras = async () => {
    const responses = unwrapResult(await dispatch(HoraSliceRequests.getAll()));
    console.log(responses);
    turno = turno + " "; //Hago esto por que en la bdd la el turno de la hora tiene un espacio -.-
    if (responses) {
      const newArray = responses.filter((x) => x.turno == turno);
      setHoras(newArray);
    }
  };

  React.useEffect(() => {
    TitleChanger("CARGA DE HORA");
    getList();
    getHoras(); //Para el select2 de horas
  }, []);

  interface initialState {
    horaId: number;
    periodoId: number;
  }
  const initialStateVar = {
    horaId: 0,
    periodoId: periodoId
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { isDirty, isValid, errors } = formState;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const Submit = async (e) => {
    let result;
    try {
      result = await dispatch(PeriodoHoraSliceRequests.postRequest(JSON.parse(JSON.stringify(e))));
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
              name="horaId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Seleccione una hora</InputLabel>
                  <Select {...field} variant="standard">
                    {horas &&
                      horas.map((x) => (
                        <MenuItem key={x.idHora} value={x.idHora}>
                          <div className="w-full">
                            <div>
                              {x.desdeHora +
                                " - " +
                                x.hastaHora +
                                " - " +
                                x.turno +
                                " - " +
                                (x.minutos != null ? x.minutos : 0) +
                                " - " +
                                "Min."}
                            </div>
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
            title: "Desde",
            field: "hora.desdeHora"
          },
          {
            title: "Hasta",
            field: "hora.hastaHora"
          },
          {
            title: "Turno",
            field: "hora.turno"
          },
          {
            title: "Minutos",
            field: "hora.minutos"
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
