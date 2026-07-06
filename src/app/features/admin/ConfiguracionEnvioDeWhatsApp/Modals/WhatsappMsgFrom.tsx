/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import Switch from "@mui/material/Switch";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { ILinea, IPlant } from "app/models";
import { WhatsappMsgSliceRequests } from "app/features/admin/slices/WhatsappMsgSlice";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";

interface props {
  setOpenPopup: (newValue: boolean) => void;
  editState: boolean;
  refresh?: (newValue: IWhatsappMsg[]) => void;
  lineas: ILinea[];
  rowSelected: IWhatsappMsg;
  opcionSeleccionada: number;
}

interface initialState {
  idLinea: number;
  m: boolean;
  t: boolean;
  n: boolean;
  plantId: number;
  whatsappMsgOpcionAsignacionId: number;
}
const initialStateVar = {
  idLinea: 0,
  m: false,
  t: false,
  n: false,
  plantId: 0
};

export const WhatsappMsgForm: React.FC<props> = ({
  setOpenPopup,
  editState,
  refresh,
  lineas,
  rowSelected,
  opcionSeleccionada
}) => {
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues:
      rowSelected != null ? rowSelected : { ...initialStateVar, whatsappMsgOpcionAsignacionId: opcionSeleccionada }
  });

  const plantaSeleccionada = useAppSelector((state) => state.plant.object);

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  const [listLineas, setListLineas] = useState<ILinea[]>();

  const getLineas = async () => {
    let response = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    if (response) {
      response = response.filter((x) => x.plantId == watch("plantId")); //Filtro las lineas por la planta.
      setListLineas(response);
    }
  };

  const loginSubmit = async (e) => {
    let result;
    try {
      if (rowSelected) {
        result = await dispatch(WhatsappMsgSliceRequests.PutRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(WhatsappMsgSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
      }
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente :)", "success");
      setOpenPopup(false);
      const response = unwrapResult(
        await dispatch(WhatsappMsgSliceRequests.GetAllByWhatsapAsignacionId(opcionSeleccionada))
      );
      if (response) {
        refresh(response);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, turno: string) => {
    switch (turno) {
      case "m":
        setValue("m", event.target.checked);
        break;
      case "t":
        setValue("t", event.target.checked);
        break;
      case "n":
        setValue("n", event.target.checked);
        break;
    }
  };

  const watchTurnom = watch("m");
  const watchTurnot = watch("t");
  const watchTurnon = watch("n");
  const watchLinea = watch("idLinea");
  const watchPlantId = watch("plantId");

  const { isDirty, isValid } = formState;

  const getPlantas = async () => {
    const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    if (result) setPlantas(result);
  };

  useEffect(() => {
    getPlantas();
  }, []);

  useEffect(() => {
    if (watchPlantId > 0) {
      getLineas();
    }
  }, [watchPlantId]);

  return (
    <div className="flex flex-col h-full w-[55vw]">
      <form onSubmit={handleSubmit(loginSubmit)} className="flex flex-col h-full w-full">
        <div className="flex items-center justify-around">
          <div>
            <div style={{ width: "180px" }}>
              {plantas && (
                <Controller
                  name="plantId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Planta</InputLabel>
                      <Select {...field} placeholder="Seleccione una planta" variant="standard">
                        {plantas &&
                          plantas.map((x) => (
                            <MenuItem key={x.id} value={x.id} style={{ display: "block" }}>
                              <div className="w-full">
                                <div>{x.name}</div>
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
          </div>
          <div>
            <div style={{ width: "180px" }}>
              {listLineas && (
                <Controller
                  name="idLinea"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Linea Produccion</InputLabel>
                      <Select {...field} placeholder="Seleccione una Linea de Produccion" variant="standard">
                        {listLineas &&
                          listLineas.map((x) => (
                            <MenuItem key={x.idLinea} value={x.idLinea} style={{ display: "block" }}>
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
              )}
            </div>
          </div>
          <div>
            <Typography variant="h6">Mañana</Typography>
            <Switch
              checked={watchTurnom}
              onChange={(e) => {
                handleChange(e, "m");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
          </div>
          <div>
            <Typography variant="h6">Tarde</Typography>
            <Switch
              checked={watchTurnot}
              onChange={(e) => {
                handleChange(e, "t");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
          </div>
          <div>
            <Typography variant="h6">Noche</Typography>
            <Switch
              checked={watchTurnon}
              onChange={(e) => {
                handleChange(e, "n");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />{" "}
          </div>
        </div>
        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
