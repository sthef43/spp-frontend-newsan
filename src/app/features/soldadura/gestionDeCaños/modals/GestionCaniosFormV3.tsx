import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { Controller, useForm } from "react-hook-form";
import { ILinea, IPlanProd, IPlant } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import {
  Button,
  ButtonBase,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { PanToolAlt, Visibility } from "@mui/icons-material";
import { DobCaniosSubSliceRequests } from "app/Middleware/reducers/DobCaniosSubSlice";
import { IDobCaniosSubDto } from "app/models/IDobCaniosSubDto";
import { DobMaestroPiezaliceRequests } from "app/Middleware/reducers/DobMaestroPiezaSlice";
interface IGestionCaniosForm {
  refresh: () => void;
  setModal: (state: boolean) => void;
}
export const GestionCaniosFormV3 = ({ refresh, setModal }: IGestionCaniosForm): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  interface initialState {
    planta: number;
    linea: number;
    dobMaestroPieza: string;
    dobMaestroPiezaId: number;
    cantDob: number;
    cantSol: number;
    diferencia: boolean;
    lpn: string;
    numeroOP?: string | null;
  }
  const initialStateVar = {
    planta: 0,
    linea: 0,
    dobMaestroPieza: "",
    dobMaestroPiezaId: 0,
    cantDob: 0,
    cantSol: 0,
    diferencia: false,
    lpn: "",
    numeroOP: ""
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  //Leer Plantas
  const [listPlantas, setListPantas] = useState<IPlant[] | null>(null);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Líneas por planta
  const [listLineas, setListLineas] = useState<ILinea[] | null>(null);
  const getLineas = async () => {
    try {
      const responses = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlanta)));
      setListLineas(responses);
      setNumeroPantalla(1);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  //Leer PlanProd por planta y linea
  const [listPlanProd, setListPlanProd] = useState<IPlanProd[] | null>(null);
  const getListPlanProd = async () => {
    if (watchPlanta != 0 && watchLinea != 0) {
      try {
        const responses = unwrapResult(await dispatch(PlanProdSliceRequests.GetPlanProdByIdLinea(watchLinea)));
        setListPlanProd(responses);
      } catch (error) {
        openNotificationUI("Error al leer Plan de Produccion.", "error");
      }
    }
  };

  //Leer DobCaniosSub por numeroOP
  const [listByNumeroOP, setListByNumeroOP] = useState<IDobCaniosSubDto[] | null>(null);
  const getListByNumeroOP = async () => {
    try {
      const responses = unwrapResult(
        await dispatch(DobCaniosSubSliceRequests.getListByNumeroOPRequest(listPlanProd[0].numeroOp))
      );
      setListByNumeroOP(responses);
    } catch (error) {
      openNotificationUI("Error al leer dobCanios.", "error");
    }
  };

  //Watch
  const watchLinea = watch("linea");
  useEffect(() => {
    if (watchLinea) {
      getListPlanProd();
      setNumeroPantalla(1);
    }
  }, [watchLinea]);
  const watchPlanta = watch("planta");
  useEffect(() => {
    if (watchPlanta) {
      setListPlanProd([]);
      watchLinea == 0;
      setNumeroPantalla(1);
      getLineas();
    }
  }, [watchPlanta]);

  //Seleccion de pantalla
  const [numeroPantalla, setNumeroPantalla] = useState<number>(1); //Para visualizar pantalla 1 o 2 o 3.
  const seleccionar = (rowData) => {
    const planProdFiltered = listPlanProd.filter((x) => x.idProduccion == rowData.idProduccion);
    setListPlanProd(planProdFiltered);
    setNumeroPantalla(2);
  };

  //Use efect genérico
  useEffect(() => {
    getPlantas();
  }, []);

  //Verificar Diferencia
  useEffect(() => {
    onValidateCant();
  }, [watch("cantDob"), watch("cantSol")]);
  const onValidateCant = () => {
    setValue("diferencia", getValues("cantDob") != getValues("cantSol"));
  };

  //** Guardar
  //Verificar LPN
  const onSubmit = async (e) => {
    try {
      const result = await dispatch(DobCaniosSubSliceRequests.getListByLpnRequest(e.lpn));
      try {
        result.payload[0].length;
        openNotificationUI("El Lpn ya existe!!!", "error");
      } catch (error) {
        onSubmitArticulo(e);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmitArticulo = async (e) => {
    try {
      const result = await dispatch(DobMaestroPiezaliceRequests.GetByArticulo(e.dobMaestroPieza));
      result.payload == "" ? openNotificationUI("El artículo es incorrecto!!!", "error") : guardar(e, result);
    } catch (error) {
      console.log(error);
    }
  };

  //Guardar
  const guardar = async (e, result) => {
    const objeto = {
      dobMaestroPiezaId: parseInt(result.payload.id, 10),
      dobMaestroPieza: null,
      cantDob: parseInt(e.cantDob, 10),
      cantSol: parseInt(e.cantSol, 10),
      diferencia: Boolean(e.diferencia),
      lpn: e.lpn.toString().toUpperCase(),
      numeroOP: listPlanProd[0].numeroOp
    };
    try {
      unwrapResult(await dispatch(DobCaniosSubSliceRequests.PostRequest(objeto)));
      openNotificationUI("Se agrego correctamente", "success");
      refresh();
      setModal(false);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Número de pantalla */}
        {numeroPantalla == 1 && (
          <div>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <div className="flex items-center flex-col ">
                  <p className="text-4xl font-semibold rounded-full border border-primaryNew px-6 py-2 mb-4 text-primaryNew">
                    1
                  </p>
                  <p className="text-primaryNew">Selección de Producción</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex items-center flex-col ">
                  <p className="text-4xl font-semibold rounded-full border border-textColor px-6 py-2 mb-4">2</p>
                  <p className="">Ingreso de Stock</p>
                </div>
              </Grid>
            </Grid>
            <div style={{ marginTop: "2%", marginBottom: "3%" }}>
              <Divider />
            </div>
          </div>
        )}
        {numeroPantalla == 2 && (
          <div>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <div className="flex items-center flex-col ">
                  <p className="text-4xl font-semibold rounded-full border border-textColor px-6 py-2 mb-4">1</p>
                  <p className="">Selección de Producción</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex items-center flex-col ">
                  <p className="text-4xl font-semibold rounded-full border border-primaryNew px-6 py-2 mb-4 text-primaryNew">
                    2
                  </p>
                  <p className="text-primaryNew">Ingreso de Stock</p>
                </div>
              </Grid>
            </Grid>
            <div style={{ marginTop: "2%", marginBottom: "3%" }}>
              <Divider />
            </div>
          </div>
        )}

        {/* Seleccion de Planta y Línea */}
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={3}>
            <div className="mt-1" style={{ width: "100%" }}>
              <Controller
                name="planta"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta" variant="standard">
                      {listPlantas &&
                        listPlantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.name}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={3}>
            <div className="mt-2" style={{ width: "100%" }}>
              <Controller
                name="linea"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Línea</InputLabel>
                    <Select {...field} placeholder="Seleccione Línea" variant="standard">
                      {listLineas &&
                        listLineas.map((x) => (
                          <MenuItem key={x.idLinea} value={x.idLinea}>
                            <div className="w-full">
                              <div>{x.descripcion}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                    {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>

        {/* Formulario visual todo el tiempo */}
        <div className="h-full" style={{ marginTop: "3%" }}>
          <TableComponent
            Dense={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Familia",
                field: "capacidad"
              },
              {
                title: "Modelo",
                field: "codigoModelo"
              },
              {
                title: "Lote",
                field: "lote"
              },
              {
                title: "OP",
                field: "numeroOp"
              },
              {
                title: "Cantidad",
                field: "cantidad"
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <Tooltip title="Seleccionar Registro">
                          <IconButton
                            onClick={() => {
                              seleccionar(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <PanToolAlt />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={listPlanProd}
          />
        </div>

        {/* Carga de Datos en TextBoxs */}
        {numeroPantalla == 2 && (
          <div>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                  <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                    <Controller
                      name="dobMaestroPieza"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error}>
                          <TextField
                            fullWidth
                            label="Artículo"
                            variant="standard"
                            type="text"
                            // inputProps={{ maxLength: 1 }}
                            {...field}
                          />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={5}>
                <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                  <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                    <Controller
                      name="lpn"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error}>
                          <TextField
                            fullWidth
                            label="LPN"
                            variant="standard"
                            type="text"
                            inputProps={{ maxLength: 10 }}
                            {...field}
                          />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                  <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                    <Controller
                      name="cantDob"
                      control={control}
                      rules={{ required: true, min: { value: 1, message: "El valor tiene que ser mayor a 0" } }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error}>
                          <TextField
                            {...field}
                            fullWidth
                            label="Cantidad Dobladora"
                            variant="standard"
                            type="number"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={5}>
                <div className=" flex-col gap-30 " style={{ height: "100%" }}>
                  <div className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew">
                    <Controller
                      name="cantSol"
                      control={control}
                      rules={{ required: true, min: { value: 1, message: "El valor tiene que ser mayor a 0" } }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error}>
                          <TextField
                            fullWidth
                            label="Cantidad Soldada"
                            variant="standard"
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <div
                  className="flex flex-col gap-30"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <div
                    className="p-5 mt-5 rounded-lg shadow-elevation-4 bg-secondaryNew"
                    style={{ alignItems: "center", alignContent: "center" }}>
                    {watch("diferencia") ? (
                      <TextField label="Diferencia?" variant="filled" color="error" focused value="Hay diferencia" />
                    ) : (
                      <TextField
                        label="Diferencia?"
                        variant="filled"
                        color="success"
                        focused
                        value="No hay diferencia"
                      />
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="mt-5">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center"
                    }}>
                    <Tooltip title="Ver Stock">
                      <span>
                        <ButtonBase
                          onClick={() => {
                            getListByNumeroOP();
                            setNumeroPantalla(3);
                          }}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <IconButton color="info" size="large">
                            <Visibility />
                          </IconButton>
                          <p style={{ margin: 0 }}>Ver Stock</p>
                        </ButtonBase>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <div style={{ display: "flex" }}>
                  <div className="pt-3 flex justify-around" style={{ flex: "1 1 30%" }}>
                    <Button
                      className={buttonClasses.greenButton}
                      type="submit"
                      variant="contained"
                      disabled={!isDirty && !isValid}>
                      Guardar
                    </Button>
                  </div>
                  <div className="pt-3 flex justify-around" style={{ flex: "1 1 30%" }}>
                    <Button
                      className={buttonClasses.redButton}
                      onClick={() => {
                        setModal(false);
                      }}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </div>
        )}

        {/* Ver Stock. Pos 3 */}
        {numeroPantalla == 3 && (
          <div>
            <div style={{ marginTop: "2%", marginBottom: "3%" }}>
              <Divider />
            </div>

            {/* Poner el form de stock de placas */}
            <div className="h-full" style={{ marginTop: "3%" }}>
              <TableComponent
                Dense={true}
                IDcolumn={"id"}
                columns={[
                  {
                    title: "Artículo",
                    field: "articulo"
                  },
                  {
                    title: "Descripción",
                    field: "descripcion"
                  },
                  {
                    title: "Cantidad Soldadura",
                    field: "cantSolTotal"
                  }
                ]}
                dataInfo={listByNumeroOP}
              />
            </div>

            <div className="pt-3 flex justify-around" style={{ flex: "1 1 30%" }}>
              <Button
                className={buttonClasses.blueButton}
                onClick={() => {
                  setNumeroPantalla(2);
                }}>
                Atrás
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
