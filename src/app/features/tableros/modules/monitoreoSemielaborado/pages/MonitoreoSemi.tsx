import { Memory, Storm, Update } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea, IPlanProd, IPlant } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MonitorSemiDashBoard } from "app/features/tableros/modules/monitoreoSemielaborado/components/MonitorSemiDashBoard";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const MonitoreoSemi = () => {
  const classes = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();

  interface initialState {
    plantId: number;
    lineaId: number;
  }
  const initialStateVar = {
    plantId: 0,
    lineaId: 0
  };
  const { control, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //General
  useEffect(() => {
    TitleChanger("Monitoreo Semielaborado");
    getPlantas();
  }, []);

  //Cambiar Título
  const cambiarTítulo = () => {
    const filter = lineas.filter((x) => x.idLinea === watchLineaId);
    TitleChanger("Monitoreo Semielaborado " + filter[0].alias);
  };

  //Leer
  const [plantas, setPlantas] = useState<IPlant[] | null>(null);
  const getPlantas = async () => {
    try {
      const result = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setPlantas(result);
    } catch (error) {
      console.log(error);
    }
  };
  const [lineas, setLineas] = useState<ILinea[] | null>(null);
  const getLineas = async () => {
    try {
      const result = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlantId)));
      // console.log(result);
      setLineas(result);
    } catch (error) {
      console.log(error);
    }
  };

  //** Leer Montaje y Placas **

  //Montaje
  const [planProdPT, setPlanProdPT] = useState<IPlanProd[] | null>(null); //Producto Terminado
  const getPlanProdPT = async () => {
    const filter = lineas.filter((x) => x.idLinea === watchLineaId);
    const param = {
      lineaId: watchLineaId,
      codigoNewsan2: filter[0].codigoInicio
    };
    try {
      // console.log(param);
      const result = unwrapResult(await dispatch(PlanProdSliceRequests.getUtimasByLineaRequest(param)));
      // console.log(result);
      setPlanProdPT(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (planProdPT) {
      getPlanProdMain(); //Placas
    }
  }, [planProdPT]);

  //Placas
  const [planProdMain, setPlanProdMain] = useState<IPlanProd[] | null>(null); //Main
  const [planProdDisplay, setPlanProdDisplay] = useState<IPlanProd[] | null>(null); //Display
  const [planProdDobladora, setPlanProdDobladora] = useState<IPlanProd[] | null>(null); //Display
  const getPlanProdMain = async () => {
    try {
      // console.log(planProdPT);
      const arrMain = [];
      const arrDis = [];
      planProdPT.map((x) => {
        if (x.opsMainDisplay.length > 1) {
          if (x.opsMainDisplay[0].tipoSemiElaborado.startsWith("4-651-PTM")) {
            arrMain.push(x.opsMainDisplay[0]);
            arrDis.push(x.opsMainDisplay[1]);
          } else {
            arrMain.push(x.opsMainDisplay[1]);
            arrDis.push(x.opsMainDisplay[0]);
          }
        }
      });
      // console.log(arrMain);
      // console.log(arrDis);
      setPlanProdMain(arrMain);
      setPlanProdDisplay(arrDis);
      setPlanProdDobladora(null);
    } catch (error) {
      console.log(error);
    }
  };

  //Watch
  const watchPlantId = watch("plantId");
  const watchLineaId = watch("lineaId");

  const resetPlan = () => {
    setPlanProdPT(null);
    setPlanProdMain(null);
    setPlanProdDisplay(null);
    setPlanProdDobladora(null);
  };
  useEffect(() => {
    if (watchPlantId != 0) {
      resetPlan();
      getLineas();
    }
  }, [watchPlantId]);

  useEffect(() => {
    if (watchLineaId != 0) {
      resetPlan();
      getPlanProdPT();
      cambiarTítulo();
    }
  }, [watchLineaId]);

  return (
    <div className="my-2 mx-4">
      {/* ************** FILTROS ************** */}
      <div
        style={{
          display: "flex",
          alignContent: "center",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "space-around"
        }}>
        <div style={{ width: "300px" }}>
          <Controller
            name="plantId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel variant="filled">Planta</InputLabel>
                <Select {...field} variant="standard" className="pt-2">
                  {plantas &&
                    plantas.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div className="w-full">
                          <div>{x.name}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "300px", marginRight: "5%" }}>
            <Controller
              name="lineaId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel variant="filled">Linea</InputLabel>
                  <Select {...field} variant="standard" className="pt-2">
                    {lineas &&
                      lineas.map((x) => (
                        <MenuItem key={x.idLinea} value={x.idLinea}>
                          <div className="w-full">
                            <div>{x.descripcion}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          <div style={{ alignContent: "center" }}>
            <Tooltip title="Refrescar">
              <IconButton
                color="success"
                onClick={() => {
                  getPlanProdPT();
                }}
                size="large"
                style={{ position: "relative" }}>
                <Update />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* ************** MONTAJE ************** */}
      <div style={{ marginTop: "1%" }}>
        <Divider />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          width: "100vw",
          fontSize: "20px",
          fontFamily: "roboto"
        }}>
        <div>Montaje</div>
        <div>Status Placas</div>
      </div>

      <div style={{ flexGrow: 1 }}>
        {" "}
        <TableComponent
          IDcolumn={"idProduccion"}
          Dense={true}
          dataInfo={planProdPT}
          columns={[
            {
              title: "OP",
              field: "numeroOp"
            },
            {
              title: "FAMILIA",
              field: "capacidad"
            },
            {
              title: "MODELO",
              field: "codigoModelo"
            },
            {
              title: "LOTE",
              field: "lote"
            },
            {
              title: "CANTIDAD",
              field: "cantidad"
            },
            {
              title: "DECLARADO",
              field: "cantidadProducida"
            },
            {
              title: "RESTA",
              field: "",
              render: (row) => {
                // return <div className="p-2">{row.cantidad - row.cantidadProducida}</div>;
                return row.cantidad - row.cantidadProducida;
              }
            },
            {
              title: "MAIN",
              field: "",
              render: (row) => {
                if (row.opsMainDisplay.length < 2) {
                  return "-";
                } else {
                  let i = 0;
                  if (!row.opsMainDisplay[i].tipoSemiElaborado.startsWith("4-651-PTM")) {
                    i = 1;
                  }
                  const diferencia = parseInt(row.opsMainDisplay[i].cantidadProducida) - row.opsMainDisplay[i].cantidad;
                  return (
                    <div className="flex justify-left">
                      <Tooltip title={row.opsMainDisplay[i].cantidad + " - " + row.opsMainDisplay[i].cantidadProducida}>
                        <div>
                          <Button
                            className={diferencia >= 0 ? classes.greenButton : classes.redButton}
                            size="small"
                            type="submit"
                            variant="contained"
                            disabled={!isDirty && !isValid}>
                            {diferencia >= 0 ? "OK" : diferencia}
                          </Button>
                        </div>
                      </Tooltip>
                    </div>
                  );
                }
              }
            },
            {
              title: "DISPLAY",
              field: "",
              render: (row) => {
                if (row.opsMainDisplay.length < 2) {
                  return "-";
                } else {
                  let i = 0;
                  if (row.opsMainDisplay[i].tipoSemiElaborado.startsWith("4-651-PTM")) {
                    i = 1;
                  }
                  const diferencia = parseInt(row.opsMainDisplay[i].cantidadProducida) - row.opsMainDisplay[i].cantidad;
                  return (
                    <div className="flex justify-left">
                      <Tooltip title={row.opsMainDisplay[i].cantidad + " - " + row.opsMainDisplay[i].cantidadProducida}>
                        <div>
                          <Button
                            className={diferencia >= 0 ? classes.greenButton : classes.redButton}
                            size="small"
                            type="submit"
                            variant="contained"
                            disabled={!isDirty && !isValid}>
                            {diferencia >= 0 ? "OK" : diferencia}
                          </Button>
                        </div>
                      </Tooltip>
                    </div>
                  );
                }
              }
            },
            {
              title: "DOBLADORA",
              field: "",
              render: (row) => {
                return "-";
              }
            }
          ]}
        />
      </div>
      {/* </div> */}

      {/* ************** INSERCION MANUAL ************** */}
      <div style={{ marginTop: "1%" }}>
        <Divider />
      </div>
      <div style={{ marginLeft: "5px", fontSize: "20px", fontFamily: "roboto" }}> Inserción Manual</div>
      {planProdMain && planProdDisplay && (
        <Grid container style={{ textAlign: "end", fontSize: "20px", fontFamily: "roboto" }}>
          <Grid item xs={4}>
            <div style={{ marginRight: "30px" }}>
              <Memory />
              Main
            </div>
            <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
              <MonitorSemiDashBoard planProdMain={planProdMain} />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <div style={{ marginRight: "30px" }}>
              <Memory />
              Display
            </div>
            <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
              <MonitorSemiDashBoard planProdMain={planProdDisplay} />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <div style={{ marginRight: "30px" }}>
              <Storm />
              Dobladora
            </div>
            <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
              <MonitorSemiDashBoard planProdMain={planProdDobladora} />
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};
