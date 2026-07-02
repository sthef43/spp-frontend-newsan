/* eslint-disable unused-imports/no-unused-vars */
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { BinariosIdentificadoresSlice } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { IDU1200ensayosSliceRequests } from "app/Middleware/reducers/IDU1200ensayosSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea } from "app/models";
import { IFamilia } from "app/models/IFamilia";
import { IIDU1200ensayos } from "app/models/IIDU1200ensayos";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "../styles/styleGrafico.module.css";
import moment from "moment";

export const TestingIDU = () => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const navBarState = useAppSelector((state) => state.binariosIdentificadores.ocultar);

  //Toma la fecha actual
  const fechaActual = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
  interface initialState {
    linea: number;
    familia: number;
  }
  const initialStateVar = {
    linea: 0,
    familia: 0
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Watch
  const watchLinea = watch("linea"); //Debe devolver el TipoUnidad
  const watchFamilia = watch("familia"); //Debe devolver el Nombre

  //Leer Lineas
  const [lineas, setLineas] = useState<ILinea[] | null>(null);
  const getLineas = async () => {
    try {
      const responses = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      setLineas(responses);
    } catch (error) {
      console.error("Error al leer lineas: ", error);
    }
  };

  //Leer Familias
  const [familia, setFamilias] = useState<IFamilia[] | null>(null);
  const getFamilias = async () => {
    const filtroLinea = lineas.find((x) => x.idLinea === watchLinea);
    try {
      const responses = unwrapResult(
        await dispatch(FamiliaSliceRequests.getListByNombreRequest(filtroLinea.tipoUnidad))
      );
      setFamilias(responses);
    } catch (error) {
      console.error("Error al leer familias: ", error);
    }
  };

  //Leer Ensayos
  const [listEnsayos, setListEnsayos] = useState<IIDU1200ensayos[] | null>(null);
  const [filtroFamilia, setfiltroFamilia] = useState<IFamilia | null>(null);

  const getEnsayos = async () => {
    console.log("leyendo...");
    try {
      const responses = unwrapResult(
        await dispatch(IDU1200ensayosSliceRequests.getLastByFamilia(filtroFamilia.nombre))
      );
      // console.log(responses);
      setListEnsayos(responses);
    } catch (error) {
      console.error("Error fetching ensayos:", error);
    }
  };

  //General
  useEffect(() => {
    getLineas();
    // State para sacar el navbar
    dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(true));
    return () => {
      dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(false));
    };
  }, []);
  useEffect(() => {
    if (lineas) {
      getFamilias();
    }
  }, [watchLinea]);

  //Contador
  useEffect(() => {
    if (watchFamilia) {
      getEnsayos();
    }
  }, [filtroFamilia]);

  useEffect(() => {
    if (watchFamilia) {
      const intervalId = setInterval(() => {
        getEnsayos();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [filtroFamilia]);

  useEffect(() => {
    if (watchFamilia) {
      setfiltroFamilia(familia.find((x) => x.id === watchFamilia));
    }
  }, [watchFamilia]);

  return (
    <>
      <main className="w-full bg-blue-950 h-screen text-white" style={{ fontFamily: "Roboto" }}>
        <header className="w-full flex h-32 justify-between items-center px-6 bg-linearGradientHaderPage">
          <figure>
            <img
              className="cursor-pointer"
              src={`${import.meta.env.BASE_URL}/imagenes/newsan/LogoNewsanBlanco.svg`}
              width="120px"
              alt="logo newsan"
              onClick={() => dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(!navBarState))}
            />
          </figure>
          <figure>
            <img src={`${import.meta.env.BASE_URL}/icons/sppIcon.svg`} width="150px" alt="logo newsan" />
          </figure>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid black",
            padding: "5px",
            fontSize: "25px",
            fontWeight: "normal",
            fontFamily: "roboto",
            color: "white",
            backgroundColor: "black"
          }}>
          <div
            style={{
              textAlign: "left",
              paddingLeft: "15px"
            }}>
            Monitoreo Testing IDU
          </div>
          <div
            style={{
              textAlign: "right",
              paddingRight: "15px"
            }}>
            {fechaActual}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr"
          }}>
          {/* Cuadro 1 */}
          <div
            style={{
              margin: "10px",
              background: "linear-gradient(180deg, #5C79C8, #3AA4D3)", //Color Azul Gradiente
              color: "#121833",
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: "roboto"
            }}>
            {/* LINEA */}
            <div
              style={{
                margin: "50px",
                marginTop: "50px",
                textAlign: "center",
                color: "#121833",
                fontSize: "15px"
              }}>
              {/* <div>INTERIOR HR</div> */}
              <Controller
                name="linea"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel>Línea</InputLabel>
                    <Select {...field} placeholder="Seleccione Línea" variant="standard">
                      {lineas &&
                        lineas.map((x) => (
                          <MenuItem key={x.idLinea} value={x.idLinea}>
                            <div
                              className="w-full"
                              style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "roboto" }}>
                              {x.descripcion}
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

            {/* FAMILIA */}
            <div
              style={{
                margin: "50px",
                textAlign: "center"
              }}>
              <Controller
                name="familia"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel>Familia</InputLabel>
                    <Select {...field} placeholder="Seleccione Familia" variant="standard">
                      {familia &&
                        familia.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "roboto" }}>
                                {x.nombre}
                              </div>
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

            {/* Recuadro azul Producido */}
            <div className={styles["boton"]}>
              <div>Producido</div>
              <div className={styles["boton-interior"]}>{listEnsayos ? listEnsayos[0]?.declaradoPorDia : "-"}</div>
            </div>

            {/* Recuadro azul Good */}
            <div className={styles["boton"]}>
              <div>Good</div>
              <div className={styles["boton-interior"]}>{listEnsayos ? listEnsayos[0]?.aprobadoPorDia : "-"}</div>
            </div>

            {/* Recuadro azul No Good */}
            <div className={styles["boton"]}>
              <div>No Good</div>
              <div className={styles["boton-interior"]}>
                {listEnsayos ? listEnsayos[0]?.declaradoPorDia - listEnsayos[0]?.aprobadoPorDia : "-"}
              </div>
            </div>
          </div>

          {/* Cuadro 2 */}
          <div
            style={{
              marginLeft: "0px",
              margin: "10px",
              backgroundColor: "#263268"
            }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead
                  style={{
                    background: "linear-gradient(90deg, #5C79C8, #3AA4D3)"
                  }}>
                  <TableRow>
                    <TableCell className={styles["table-cell-encabezado"]}>Hora</TableCell>
                    <TableCell className={styles["table-cell-encabezado"]}>Módulo</TableCell>
                    <TableCell className={styles["table-cell-encabezado"]}>Trazabilidad</TableCell>
                    <TableCell className={styles["table-cell-encabezado"]}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ backgroundColor: "#263268" }}>
                  {listEnsayos &&
                    listEnsayos.map((row) => (
                      <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell className={styles["table-cell"]}>{moment(row.fecha).format("h:mm:ss")}</TableCell>
                        <TableCell className={styles["table-cell"]}>{row.dcf}</TableCell>
                        <TableCell className={styles["table-cell"]}>{row.serie}</TableCell>
                        {row.aprobado ? (
                          <TableCell className={styles["table-cell-good"]}>Good</TableCell>
                        ) : (
                          <TableCell className={styles["table-cell-nogood"]}>No Good</TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </main>
    </>
  );
};
