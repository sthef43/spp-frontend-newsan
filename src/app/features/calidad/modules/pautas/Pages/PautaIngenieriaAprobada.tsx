/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import "animate.css";
import { Divider } from "@mui/material";
import { PautasAprobadasTable } from "../Components/PautasAprobadasTable";
import { PautasAprobadasForm } from "../Components/PautasAprobadasForm";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ILineaProduccionFamilia } from "app/models/ILineaProduccionFamilia";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { PautaIngenieriaAprobadaSliceRequest } from "app/Middleware/reducers/PautaIngenieriaAprobadaSlice";
import { IPautaIngenieriaAprobada } from "app/models/IPautaIngenieriaAprobada";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

const sxStyles = {
  formControl: {
    margin: 4,
    minWidth: 170
  },
  selectEmpty: {
    marginTop: 2
  }
};

interface initialStates {
  plantaId: number;
  lineaProduccionId: number;
  lineaProduccionFamiliaId: number;
  linea: number;
  pauta: number;
  modelo: string;
  cantidadAprobados: number;
  cantidadAprobar: number;
  lote: string;
  numeroOp: string;
  cantidadLote: number;
  producidos: number;
  diferencia: number;
}

const initialState: initialStates = {
  plantaId: 0,
  lineaProduccionId: 0,
  lineaProduccionFamiliaId: 0,
  linea: 0,
  pauta: 0,
  modelo: "",
  cantidadAprobados: 0,
  cantidadAprobar: 0,
  lote: "",
  numeroOp: "",
  cantidadLote: 0,
  producidos: 0,
  diferencia: 0
};

export const PautaIgenieriaAprobada = (): JSX.Element => {
  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [pautas, setPautas] = useState(null); //para el combo de familia.. pero el id es el de pauta.
  const [pautasAprobadas, setPautasAprobadas] = useState(null); //La grilla con las pautas aprobadas
  const [pautaSeleccionada, setPautaSeleccionada] = useState(null); //Para saber que PautaIngenieria selecicono. Sale cuando selecciona la familia.
  const [plantas, setPlantas] = useState(null); //Select2 de plantas
  const [lineasProduccion, setLineasProduccion] = useState(null); //Select2 de Lineas de Produccion
  const [lineaProduccionFamilia, setLineaProduccionFamilia] = useState([]); //Select2 de Familias.
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(""); //Para pasarle el nombre de la familia por porps al componente PautaAprobadaForm
  const [diferenciaState, setDiferenciaState] = useState(null);

  const diferenciaInput = watch("diferencia");

  const getListLineaProduccionFamiliaByLineaProduccionId = async () => {
    let fetchLineaProduccionFamiliaResult: ILineaProduccionFamilia[];
    const lineaProduccionId = getValues("lineaProduccionId");
    try {
      fetchLineaProduccionFamiliaResult = unwrapResult(
        await dispatch(LineaProduccionFamiliaSliceRequests.getAllRequest())
      );
      fetchLineaProduccionFamiliaResult = fetchLineaProduccionFamiliaResult.filter(
        (x) => x.lineaProduccionId == lineaProduccionId
      );
    } catch (error) {
      fetchLineaProduccionFamiliaResult = null;
    }
    if (fetchLineaProduccionFamiliaResult) {
      setLineaProduccionFamilia(fetchLineaProduccionFamiliaResult);
    }
  };

  const getPlantas = async () => {
    let responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    responses = JSON.parse(JSON.stringify(responses));
    setPlantas(responses);
  };

  const getLineasProduccionByPlanta = async () => {
    const plantaId = getValues("plantaId");
    if (plantaId != 0) {
      let responses = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantaId)));
      responses = JSON.parse(JSON.stringify(responses));
      setLineasProduccion(responses);
    }
  };

  const insertValores = (fetchPautasAprobadasResult, pautaIngenieria) => {
    setValue("cantidadAprobados", fetchPautasAprobadasResult.length);
    setValue("cantidadAprobar", pautaIngenieria.cantidad);
    setValue("diferencia", pautaIngenieria.cantidad - fetchPautasAprobadasResult.length);
    setDiferenciaState(pautaIngenieria.cantidad - fetchPautasAprobadasResult.length);
  };

  //FETCH PARA TRAERME LAS PAUTAS APROBADAS SEGUN LA FAMILIA.
  const getPautasAprobadasByLineaProduccionFamiliaId = async () => {
    const lineaProdFamId = getValues("lineaProduccionFamiliaId");
    const objetoLineaProduccionFamilia = lineaProduccionFamilia.find((x) => x.id == lineaProdFamId); //Obtengo la LineaProduccionFamilia Seleccionada.
    if (objetoLineaProduccionFamilia != undefined && objetoLineaProduccionFamilia.pautaIngenieria.length > 0) {
      const pautaIngenieria = objetoLineaProduccionFamilia.pautaIngenieria.find((x) => x.activado);
      setPautaSeleccionada(pautaIngenieria);
      setFamiliaSeleccionada(objetoLineaProduccionFamilia.familia.nombre);
      let fetchPautasAprobadasResult: IPautaIngenieriaAprobada[];
      try {
        fetchPautasAprobadasResult = unwrapResult(await dispatch(PautaIngenieriaAprobadaSliceRequest.getAllRequest()));
        fetchPautasAprobadasResult = fetchPautasAprobadasResult.filter(
          (x) => x.pautaIngenieriaId == pautaIngenieria.id && x.activo
        );
      } catch (error) {
        fetchPautasAprobadasResult = null;
      }
      if (fetchPautasAprobadasResult) {
        setPautasAprobadas(fetchPautasAprobadasResult);
        insertValores(fetchPautasAprobadasResult, pautaIngenieria); //Inserta el valor de cantidad a Aprobar, Aprobados y Diferencia.
      }
    } else {
      openNotificationUI("No se encuentran pautas cargadas.", "warning");
    }
  };

  // ---------------TITULO---------
  React.useEffect(() => {
    TitleChanger("Aprobación de pautas");
    getPlantas();
  }, []);

  useEffect(() => {
    console.log("useEffect de diferencia! ");
    setDiferenciaState(diferenciaInput);
  }, [diferenciaInput]);

  /*  React.useEffect(() => {
    onInit();
  }, []); */

  return (
    <div>
      <div className="m-1 sm:m-10 h-full">
        <div className="p-2 m-2 rounded-lg shadow-elevation-6 bg-secondaryNew">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
            <div className="text-center sm:text-left p-2">
              <Controller
                name="plantaId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl sx={sxStyles.formControl} variant="standard" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una Planta"
                      variant="standard"
                      onClick={() => getLineasProduccionByPlanta()}>
                      {plantas &&
                        plantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
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
            </div>
            <div className="text-center sm:text-left p-2">
              <Controller
                name="lineaProduccionId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl sx={sxStyles.formControl} variant="standard" error={!!error}>
                    <InputLabel>Linea Produccion</InputLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione una Linea de Produccion"
                      variant="standard"
                      onClick={() => getListLineaProduccionFamiliaByLineaProduccionId()}>
                      {lineasProduccion &&
                        lineasProduccion.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="text-center sm:text-left p-2">
              <FormControl sx={sxStyles.formControl} /* disabled={lineaSelect} */ variant="standard">
                <InputLabel>Familia</InputLabel>
                <Controller
                  name="lineaProduccionFamiliaId"
                  control={control}
                  rules={{ required: "Seleccione una familia." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="standard"
                      onClick={() => getPautasAprobadasByLineaProduccionFamiliaId()}>
                      {lineaProduccionFamilia &&
                        lineaProduccionFamilia.map((lineaProdFam) => (
                          <MenuItem key={lineaProdFam.id} value={lineaProdFam.id}>
                            {lineaProdFam.familia.nombre}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <div className="text-center sm:text-left p-2">
              <Controller
                name="cantidadAprobar"
                control={control}
                defaultValue={null}
                render={({ field }) => <TextField disabled label="Cantidad a Aprobar" {...field} variant="standard" />}
              />
            </div>
            {/* ----------------CANTIDAD APROBADOS---------------*/}
            <div className="text-center sm:text-left p-2">
              <Controller
                name="cantidadAprobados"
                control={control}
                defaultValue={null}
                render={({ field }) => <TextField disabled label="Aprobados" {...field} variant="standard" />}
              />
            </div>
            {/* ----------------DIFERENCIA---------------*/}
            <div className="text-center sm:text-left p-2">
              <Controller
                name="diferencia"
                control={control}
                defaultValue={null}
                render={({ field }) => <TextField disabled label="Diferencia" {...field} variant="standard" />}
              />
            </div>
          </div>
        </div>
        {pautasAprobadas && (
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
            <div className="sm:flex items-center justify-around w-full font-semibold">
              {/* ----------------CANTIDAD A APROBAR---------------*/}
              <PautasAprobadasForm
                refresh={getPautasAprobadasByLineaProduccionFamiliaId}
                pauta={pautaSeleccionada}
                diferenciaState={diferenciaState}
                familiaSeleccionada={familiaSeleccionada}></PautasAprobadasForm>
            </div>
          </div>
        )}
        <Divider />
        {pautasAprobadas && (
          <div className="animate__animated animate__fadeInUp">
            <div className="grid sm:grid-cols-1 grid-cols-1 gap-4">
              <div className="col-span-1">
                <PautasAprobadasTable pautasAprobadas={pautasAprobadas} />
              </div>
              {/*   <div className="sm:col-span-2 animate__animated animate__fadeInUpp">
                <Rechazos plan={planProd} />
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
