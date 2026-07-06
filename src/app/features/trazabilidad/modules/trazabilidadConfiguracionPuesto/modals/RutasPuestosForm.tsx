/* eslint-disable no-useless-escape */
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { MapasRutasCamposSliceRequest } from "app/Middleware/reducers/MapasRutasCamposSlice";
import { TipoMaterialSliceRequests } from "app/features/trazabilidad/slices/TipoMaterialSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IMapasRutas } from "app/models/IMapasRutas";
import { IMapasRutasCampos } from "app/models/IMapasRutasCampos";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface props {
  setOpenPopup: any;
  refresh: any;
  mapaRuta: IMapasRutas | null;
  editState: IMapasRutasCampos | null;
  productoId: number;
}
export const RutasPuestosForm = ({ productoId, setOpenPopup, refresh, mapaRuta, editState }: props) => {
  interface initialState {
    nombre: string;
    orden: number;
    validarCalidad: boolean;
    validarBatea: boolean;
    persiste: boolean;
    serie: boolean;
    identificador: boolean;
    validarMaterial: boolean;
    tipoMaterialId: number;
    expRegular: string;
    expRegularVista: string;
    ejemplo: string;
    cantCaracteres: number;
    prefijo: string;
    formatoVariable: string;
    infijo: string;
    cantCaracteresPrefijo: number;
    cantCaracteresSufijo: number;
    autoGenerado: boolean;
  }
  const campos = useAppSelector<IMapasRutasCampos[]>((state) => state.mapasRutasCampos.dataAll);
  const initialStateVar = {
    mapasRutasId: 0,
    nombre: "",
    orden: campos.length,
    validarCalidad: editState?.validarCalidad || false,
    validarBatea: editState?.validarBatea || false,
    persiste: editState?.persiste || false,
    serie: editState?.serie || false,
    validarMaterial: editState?.serie || false,
    tipoMaterialId: 0,
    expRegular: "",
    expRegularVista: "",
    ejemplo: "",
    cantCaracteres: 10,
    prefijo: "Ejemplo",
    infijo: "Ejemplo",
    formatoVariable: "",
    cantCaracteresPrefijo: 10,
    cantCaracteresSufijo: 10,
    identificador: false,
    autoGenerado: editState?.autoGenerado || false
  };
  console.log(editState, "Edit");
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const [persiste, setPersiste] = useState(false);
  const [validarCalidad, setvalidarCalidad] = useState(false);
  const [serie, setSerie] = useState(false);
  const [autogenerado, setAutogenerado] = useState(false);
  const [Identificador, setIdentificador] = useState(false);
  const [validarMaterial, setValidarMaterial] = useState(false);
  const [validarBatea, setValidarBatea] = useState(false);
  const [tipoMateriales, setTipoMateriales] = useState([]);
  const dispatch = useAppDispatch();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const onAddPuesto = async (e) => {
    let result;
    let nombre;

    let expRegular;
    let noRepiteOrden;
    if (!editState) {
      noRepiteOrden = campos.find((campo) => campo.orden == getValues("orden"));
    }
    if (!noRepiteOrden) {
      if (getValues("expRegular") == "prefijo") {
        nombre = getValues("prefijo");
      } else if (getValues("expRegular") == "infijo") {
        nombre = getValues("infijo");
      } else {
        nombre = "";
      }
      if (getValues("expRegularVista") == "^S+$") {
        expRegular = "";
      } else {
        expRegular = getValues("expRegularVista");
      }
      try {
        if (editState) {
          const RutaCampoEdit = {
            id: editState.id,
            mapasRutasId: editState.mapasRutasId,
            autoGenerado: getValues("autoGenerado"),
            nombre: getValues("nombre"),
            orden: getValues("orden"),
            persiste: getValues("persiste"),
            validarCalidad: getValues("validarCalidad"),
            validarBatea: getValues("validarBatea"),
            identificador: getValues("identificador"),
            expRegular: expRegular,
            serie: getValues("serie"),
            tipoMaterialId: getValues("tipoMaterialId"),
            expRegularValores: {
              id: editState.expRegularValores.id,
              expRegularNombre: getValues("expRegular"),
              valor: nombre,
              formatoVariable: getValues("formatoVariable"),
              caracteres: getValues("cantCaracteres"),
              caracteresPrefijo: getValues("cantCaracteresPrefijo"),
              caracteresSufijo: getValues("cantCaracteresSufijo")
            }
          };
          result = await dispatch(MapasRutasCamposSliceRequest.NestedUpdateRequest(RutaCampoEdit));
        } else {
          const rutaCampo = {
            expRegularValores: {
              expRegularNombre: getValues("expRegular"),
              valor: nombre,
              formatoVariable: getValues("formatoVariable"),
              caracteres: getValues("cantCaracteres"),
              caracteresPrefijo: getValues("cantCaracteresPrefijo"),
              caracteresSufijo: getValues("cantCaracteresSufijo")
            },
            tipoMaterialId: getValues("tipoMaterialId"),
            mapasRutasId: mapaRuta.id,
            nombre: getValues("nombre"),
            orden: getValues("orden"),
            persiste: getValues("persiste"),
            validarCalidad: getValues("validarCalidad"),
            validarBatea: getValues("validarBatea"),
            identificador: getValues("identificador"),
            expRegular: expRegular,
            serie: getValues("serie"),
            autoGenerado: getValues("autoGenerado")
          };
          result = await dispatch(MapasRutasCamposSliceRequest.NestedAddRequest(rutaCampo));
        }
      } catch (x) {
        result = null;
        console.log(x);
        openNotificationUI("Occurrio un error", "error");
      }
    } else {
      openNotificationUI("El orden del campo esta en uso", "error");
    }
    if (result) {
      editState
        ? openNotificationUI("Se edito el campo correctamente", "success")
        : openNotificationUI("Se agrego el campo correctamente", "success");
      setOpenPopup(false);
      refresh();
    }
  };
  const tipoDeExpRegular = () => {
    const expRegular = getValues("expRegular");
    switch (expRegular) {
      case "libre":
        // eslint-disable-next-line prettier/prettier
        return { tipo: "libre", valor: "^S+$", ejemplo: "Zjr=)B6vY.`/U&^Bp>0i#.@!" };
      case "digitos":
        return { tipo: "digitos", valor: `^[0-9]`, ejemplo: "7995169426" };
      case "alfa numerico":
        return { tipo: "alfa numerico", valor: `^[0-9A-Za-z]`, ejemplo: "ixM8qEHE7p" };
      case "prefijo":
        return { tipo: "prefijo", valor: `[0-9]`, ejemplo: "7995169426" };
      case "infijo":
        return {
          tipo: "infijo",
          valor: "[0-9]",
          ejemplo: "9969394298ejemplo5463044650"
        };
    }
  };
  const getExpRegular = () => {
    const expRegular = tipoDeExpRegular();
    setValue("ejemplo", expRegular.ejemplo);
    if (getValues("expRegular") == "libre") {
      setValue("expRegularVista", expRegular.valor);
    } else if (getValues("expRegular") == "digitos") {
      setValue("expRegularVista", `${expRegular.valor}{${getValues("cantCaracteres")}}$`);
    } else if (getValues("expRegular") == "alfa numerico") {
      setValue("expRegularVista", `${expRegular.valor}{${getValues("cantCaracteres")}}$`);
    } else if (getValues("expRegular") == "prefijo") {
      if (!editState) {
        setValue("formatoVariable", "digitos");
      }
      setValue("expRegularVista", `^${getValues("prefijo")}${expRegular.valor}{${getValues("cantCaracteres")}}$`);
      setCantCaracteres();
    } else {
      if (!editState) {
        setValue("formatoVariable", "digitos");
      }
      setValue(
        "expRegularVista",
        `^${expRegular.valor}{${getValues("cantCaracteres")}}${getValues("infijo")}${expRegular.valor}{${getValues(
          "cantCaracteres"
        )}}$`
      );
    }
  };
  const random = (max) => {
    let sumaEj = "";
    for (let i = 0; i < max; i++) {
      const contador = Math.floor(Math.random() * (9 - 0) + 0);
      sumaEj = sumaEj + contador.toString();
    }
    return sumaEj.toString();
  };
  const getMaterial = async () => {
    try {
      const response = unwrapResult(await dispatch(TipoMaterialSliceRequests.getAllByProductId(productoId)));
      setTipoMateriales(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const generateRandomString = (num) => {
    let result1 = "";
    if (getValues("formatoVariable") == "alfabetico") {
      const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const abcLentgth = abc.length;
      for (let i = 0; i < num; i++) {
        result1 += abc.charAt(Math.floor(Math.random() * abcLentgth));
      }
    } else {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    }

    return result1;
  };
  const setCantCaracteres = () => {
    const valorExp = tipoDeExpRegular();
    if (valorExp.tipo == "digitos") {
      setValue("expRegularVista", `${valorExp.valor}{${getValues("cantCaracteres")}}$`);
      const ej = random(getValues("cantCaracteres"));
      setValue("ejemplo", ej);
    } else if (valorExp.tipo == "alfa numerico") {
      setValue("expRegularVista", `${valorExp.valor}{${getValues("cantCaracteres")}}$`);
      const stringRandom = generateRandomString(getValues("cantCaracteres"));
      setValue("ejemplo", stringRandom);
    } else if (valorExp.tipo == "prefijo") {
      if (getValues("formatoVariable") == "digitos") {
        setValue("expRegularVista", `^${getValues("prefijo")}${valorExp.valor}{${getValues("cantCaracteres")}}$`);
        const preFijoEj = random(getValues("cantCaracteres"));
        setValue("ejemplo", `${getValues("prefijo")}${preFijoEj}`);
      } else {
        setFormatoVariables();
      }
    }
  };
  const setFormatoVariables = () => {
    if (getValues("expRegular") == "prefijo") {
      const formatoVar = getValues("formatoVariable");
      if (formatoVar == "alfabetico") {
        setValue("expRegularVista", `^${getValues("prefijo")}[A-Za-z]{${getValues("cantCaracteres")}}$`);
        setValue("ejemplo", `${getValues("prefijo")}${generateRandomString(getValues("cantCaracteres"))}`);
      } else if (formatoVar == "alfa numerico") {
        setValue("expRegularVista", `^${getValues("prefijo")}[0-9A-Za-z]{${getValues("cantCaracteres")}}$`);
        setValue("ejemplo", `${getValues("prefijo")}${generateRandomString(getValues("cantCaracteres"))}`);
      } else {
        setCantCaracteres();
      }
    } else {
      const formatoVar = getValues("formatoVariable");
      if (formatoVar == "alfabetico") {
        setValue(
          "expRegularVista",
          `^[A-Za-z]${getValues("cantCaracteresPrefijo")}${getValues("infijo")}[A-Za-z]${getValues(
            "cantCaracteresSufijo"
          )}$`
        );
        setValue(
          "ejemplo",
          `${generateRandomString(getValues("cantCaracteresPrefijo"))}${getValues("infijo")}${generateRandomString(
            getValues("cantCaracteresSufijo")
          )}`
        );
      } else if (formatoVar == "alfa numerico") {
        setValue(
          "expRegularVista",
          `^[0-9A-Za-z]${getValues("cantCaracteresPrefijo")}${getValues("infijo")}[0-9A-Za-z]${getValues(
            "cantCaracteresSufijo"
          )}$`
        );
        setValue(
          "ejemplo",
          `${generateRandomString(getValues("cantCaracteresPrefijo"))}${getValues("infijo")}${generateRandomString(
            getValues("cantCaracteresSufijo")
          )}`
        );
      } else {
        setValue(
          "expRegularVista",
          `^[0-9]{${getValues("cantCaracteresPrefijo")}}${getValues("infijo")}[0-9]{${getValues(
            "cantCaracteresSufijo"
          )}}$`
        );
        setValue(
          "ejemplo",
          `${random(getValues("cantCaracteresPrefijo"))}${getValues("infijo")}${random(
            getValues("cantCaracteresSufijo")
          )}`
        );
      }
    }
  };
  const setCantCaracteresInfijo = () => {
    if (getValues("formatoVariable") == "digitos") {
      setValue(
        "ejemplo",
        `${random(getValues("cantCaracteresPrefijo"))}${getValues("infijo")}${random(
          getValues("cantCaracteresSufijo")
        )}`
      );
    } else {
      setValue(
        "ejemplo",
        `${generateRandomString(getValues("cantCaracteresPrefijo"))}${getValues("infijo")}${generateRandomString(
          getValues("cantCaracteresSufijo")
        )}`
      );
    }
  };
  const watchExpRegular = watch("expRegular");
  const watchCantCaracteres = watch("cantCaracteres");
  const watchFormatosVar = watch("formatoVariable");
  const watchPrefijo = watch("prefijo");
  const watchInfijo = watch("infijo");
  const watchCantPrefijo = watch("cantCaracteresPrefijo");
  const watchCantSufijo = watch("cantCaracteresSufijo");
  const watchValidarCalida = watch("validarCalidad");
  const watchSerie = watch("serie");

  console.log(watchValidarCalida);

  useEffect(() => {
    console.log(serie);
    if (!serie) {
      setValue("autoGenerado", false);
      setAutogenerado(false);
    }
  }, [watchSerie]);

  useEffect(() => {
    if (!editState) {
      setValue("expRegular", "libre");
    }
    getMaterial();
  }, []);
  useEffect(() => {
    if (getValues("expRegular") != "") {
      getExpRegular();
    }
  }, [watchExpRegular]);

  // useEffect(() => {
  //   if (!validarMaterial) setValue("validarCalidad", null);
  // }, [validarMaterial]);

  useEffect(() => {
    if (getValues("expRegular") != "") {
      setCantCaracteres();
    }
  }, [watchCantCaracteres]);
  useEffect(() => {
    setFormatoVariables();
  }, [watchPrefijo, watchInfijo, watchFormatosVar]);

  useEffect(() => {
    if (getValues("expRegular") == "infijo") {
      setCantCaracteresInfijo();
      setFormatoVariables();
    }
  }, [watchCantPrefijo, watchCantSufijo]);
  useEffect(() => {
    if (editState != null) {
      setValue("nombre", editState.nombre);
      setValue("orden", editState.orden);
      setPersiste(editState.persiste);
      setvalidarCalidad(editState.persiste);
      setSerie(editState.serie);
      setAutogenerado(editState.autoGenerado);
      setIdentificador(editState.identificador);
      if (editState.tipoMaterialId != null) {
        setValidarMaterial(true);
        setValue("tipoMaterialId", editState.tipoMaterialId);
      }
      setValue("expRegular", editState.expRegularValores.expRegularNombre);
      const nombreExp = editState.expRegularValores.expRegularNombre;
      if (nombreExp == "infijo") {
        setValue("infijo", editState.expRegularValores.valor);
        setValue("expRegularVista", editState.expRegular);
        setValue("cantCaracteresPrefijo", editState.expRegularValores.caracteresPrefijo);
        setValue("cantCaracteresSufijo", editState.expRegularValores.caracteresSufijo);
        setValue("formatoVariable", editState.expRegularValores.formatoVariable);
      } else if (nombreExp == "prefijo") {
        setValue("prefijo", editState.expRegularValores.valor);
        setValue("expRegularVista", editState.expRegular);
        setValue("cantCaracteres", editState.expRegularValores.caracteres);
        setValue("formatoVariable", editState.expRegularValores.formatoVariable);
      } else {
        setValue("expRegularVista", editState.expRegular);
        setValue("cantCaracteres", editState.expRegularValores.caracteres);
      }
    }
  }, [editState]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(onAddPuesto)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          {/* ---------------- Nombre y Orden del Campo  --------------- */}
          <div className="flex flex-row justify-between gap-2">
            <div className="w-full p-5">
              <Controller
                name="nombre"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Nombre en pantalla</InputLabel>
                    <Input {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="w-full p-5">
              <Controller
                name="orden"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Orden</InputLabel>
                    <Input {...field} type="number" />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <div>
              <FormControlLabel
                label="Validar Inspeccion Calidad?*"
                control={
                  <Controller
                    name={"validarCalidad"}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onClick={() => {
                          setvalidarCalidad(!validarCalidad);
                        }}
                        {...field}
                      />
                    )}
                  />
                }
              />
            </div>
            <div>
              <FormControlLabel
                label="Persiste?*"
                control={
                  <Controller
                    name={"persiste"}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={persiste}
                        onClick={() => {
                          setPersiste(!persiste);
                        }}
                        {...field}
                      />
                    )}
                  />
                }
              />
            </div>
            <div>
              <FormControlLabel
                label="Serie?"
                control={
                  <Controller
                    name={"serie"}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={serie}
                        onClick={() => {
                          setSerie(!serie);
                        }}
                        {...field}
                      />
                    )}
                  />
                }
              />
              {serie && (
                <div>
                  <FormControlLabel
                    label="Autogenerado?"
                    control={
                      <Controller
                        name={"autoGenerado"}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={autogenerado}
                            onClick={() => {
                              setAutogenerado(!autogenerado);
                            }}
                            {...field}
                          />
                        )}
                      />
                    }
                  />
                </div>
              )}
            </div>
            <div>
              <FormControlLabel
                label="Es identificador?"
                control={
                  <Controller
                    name={"identificador"}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={Identificador}
                        onClick={() => {
                          setIdentificador(!Identificador);
                        }}
                        {...field}
                      />
                    )}
                  />
                }
              />
            </div>
            <div>
              <FormControlLabel
                label="Validar material?"
                control={
                  <Controller
                    name={"validarMaterial"}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onClick={() => {
                          setValidarMaterial(!validarMaterial);
                        }}
                        {...field}
                      />
                    )}
                  />
                }
              />
            </div>
            <div>
              <FormControlLabel
                label="Validar Batea?"
                control={
                  <Controller
                    name={"validarBatea"}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onClick={() => {
                          setValidarBatea(!validarBatea);
                          // setValidarMaterial(!validarMaterial);
                        }}
                        {...field}
                      />
                    )}
                  />
                }
              />
            </div>
          </div>
          <div className="flex justify-around m-3">
            {validarMaterial && tipoMateriales && (
              <Controller
                name="tipoMaterialId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione un tipo de material</InputLabel>
                    <Select {...field} variant="standard">
                      {tipoMateriales &&
                        tipoMateriales.map((x) => (
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
            )}
          </div>
          <div className="sm:col-span-2 animate__animated animate__fadeIn shadow-elevation-4 p-5 w-full rounded-md border-2 border-gray-400 dark:border-gray-500 ">
            <div className="text-xl text-center font-bold m-1">Seleccione una expresión regular: </div>
            <div className="w-full flex justify-center mt-5">
              <FormControl>
                <Controller
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel value="libre" control={<Radio />} label="Libre" />
                      <FormControlLabel value="digitos" control={<Radio />} label="Dígitos" />
                      <FormControlLabel value="alfa numerico" control={<Radio />} label="Alfa numérico" />
                      <FormControlLabel value="prefijo" control={<Radio />} label="Prefijo" />
                      <FormControlLabel value="infijo" control={<Radio />} label="Infijo" />
                    </RadioGroup>
                  )}
                  rules={{ required: true }}
                  control={control}
                  name="expRegular"
                />
              </FormControl>
            </div>
            {(getValues("expRegular") == "prefijo" || getValues("expRegular") == "infijo") &&
              getValues("expRegular") != "" && (
                <div className="my-5">
                  {getValues("expRegular") == "prefijo" ? (
                    <Controller
                      name="prefijo"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error}>
                          <InputLabel>Prefijo</InputLabel>
                          <Input {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  ) : (
                    <Controller
                      name="infijo"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth variant="outlined" error={!!error}>
                          <InputLabel>Parte central fija</InputLabel>
                          <Input {...field} />
                          {!!error && <FormHelperText>{error.type}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  )}
                  <div className="text-xl text-start font-bold m-1">Seleccione un formato para la variable: </div>
                  <FormControl className="mt-4">
                    <Controller
                      render={({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel value="digitos" control={<Radio />} label="Dígitos" />
                          <FormControlLabel value="alfabetico" control={<Radio />} label="Alfabético" />
                          <FormControlLabel value="alfa numerico" control={<Radio />} label="Alfa numérico" />
                        </RadioGroup>
                      )}
                      rules={{ required: true }}
                      control={control}
                      name="formatoVariable"
                    />
                  </FormControl>
                </div>
              )}
            {getValues("expRegular") == "infijo" ? (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <div style={{ width: "50%" }}>
                  <Controller
                    name="cantCaracteresPrefijo"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Cantidad de caracteres prefijo</InputLabel>
                        <Input {...field} type="number" />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <Controller
                    name="cantCaracteresSufijo"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel> Cantidad de caracteres sufijo</InputLabel>
                        <Input {...field} type="number" />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            ) : (
              getValues("expRegular") != "libre" && (
                <Controller
                  name="cantCaracteres"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Cantidad de caracteres</InputLabel>
                      <Input {...field} type="number" />
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              )
            )}
            {getValues("expRegular") != "" && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <div style={{ width: "50%" }}>
                  <Controller
                    name="expRegularVista"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="standard" error={!!error}>
                        <InputLabel>Expresión regular</InputLabel>
                        <Input {...field} readOnly />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <Controller
                    name="ejemplo"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel>Ejemplo:</InputLabel>
                        <Input {...field} readOnly />
                        {!!error && <FormHelperText>{error.type}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <footer>*Aclaración ej: El equipo ya paso por un proceso anterior donde quedo registrado?</footer>
        <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
