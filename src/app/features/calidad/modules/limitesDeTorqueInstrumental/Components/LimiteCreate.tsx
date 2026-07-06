/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useAppDispatch } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IAtornilladoraAlim, IAtornilladoraFormato, IColor, IGenerico, IInstpuesto, ILinea } from "app/models";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import { PuestoCreate } from "../../puestoDeTorqueInstrumental/PuestoCreate";
import { Add } from "@mui/icons-material";
import { AtornilladoraAlimSliceRequests } from "app/features/calidad/slices/AtornilladoraAlimSlice";
import { AtornilladoraFormatoSliceRequests } from "app/features/calidad/slices/AtornilladoraFormatoSlice";
import { ColorSliceRequests } from "app/features/calidad/slices/ColorSlice";
import { InstpuestoSliceRequests } from "app/features/calidad/slices/InstpuestoSlice";
import { LimitesSliceRequests } from "app/features/calidad/slices/LimitesSlice";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";

interface props {
  callback: any;
  refreshTable: any;
  indetidicadorL: number;
  productoId: number;
}

const sxStyles = {
  formControl: {
    marginLeft: 6,
    margin: 1,
    alignContent: "center",
    minWidth: 220
  },
  selectEmpty: {
    marginTop: 2
  }
};

export const LimiteCreate = ({ callback, refreshTable, indetidicadorL, productoId }: props): JSX.Element => {
  const initialState = {
    identificadorLinea: indetidicadorL,
    idGenerico: 0,
    torque: "",
    idColor: 0,
    idAtornilladoraAlim: 0,
    idAtornilladoraFormato: 0,
    instpuestoId: 0,
    idInstpuestoDesc: "",
    atornilladoraModelo: "",
    // descripPuesto: "",
    codigoPuesto: "",
    numeroPuesto: "01",
    version: "001",
    observaciones: "",
    descripcion: "",
    codigoTraazbilidad: ""
  };
  const dispatch = useAppDispatch();

  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const [genericos, setGenericos] = React.useState<IGenerico[]>([]);
  const [puestos, setPuestos] = React.useState<IInstpuesto[]>([]);
  const [colores, setColores] = React.useState<IColor[]>([]);
  const [alims, setAlims] = React.useState<IAtornilladoraAlim[]>([]);
  const [formatos, setFormatos] = React.useState<IAtornilladoraFormato[]>([]);
  const [openPuestoCrud, setOpenPuestoCrud] = React.useState<boolean>(false);

  const { control, getValues, watch, setValue } = useForm({ defaultValues: initialState });

  const idLwatch = watch("identificadorLinea");
  const handleCancelar = () => {
    callback(false);
  };

  //  1. "Observamos" el valor del torque en tiempo real
  const torqueValue = watch("torque");
  React.useEffect(() => {
    console.log("Torque detectado:", torqueValue);
    console.log("Lista de colores:", colores);
    if (torqueValue && colores && colores.length > 0) {
      const valor = Number(torqueValue);
      // Si el valor no es un número válido (ej. está vacío o tiene letras), salimos
      if (isNaN(valor)) return;
      const colorCoincidente = colores.find((col) => {
        // Forzamos a que los límites también sean números para evitar errores de JS
        const d = Number(col.desde);
        const h = Number(col.hasta);
        return valor >= d && valor <= h;
      });
      console.log("¿Encontré coincidencia?:", colorCoincidente);
      if (colorCoincidente) {
        // 2. Seteamos el valor. Importante: idColor debe ser del mismo tipo que en el Select (String o Number)
        setValue("idColor", colorCoincidente.idColor, {
          shouldValidate: true,
          shouldDirty: true
        });
      }
    }
  }, [torqueValue, colores, setValue]);

  const onInit = async () => {
    let fetchLineasResult;

    try {
      fetchLineasResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      setLineas(fetchLineasResult);
    } catch (error) {
      fetchLineasResult = null;
    }
  };
  const getColores = async () => {
    let fetchColorResult;
    try {
      fetchColorResult = unwrapResult(await dispatch(ColorSliceRequests.getAllRequest()));
    } catch (error) {
      fetchColorResult = null;
    }
    if (fetchColorResult) {
      setColores(fetchColorResult);
    }
  };
  const getAlims = async () => {
    let fetchAlimResult;
    try {
      fetchAlimResult = unwrapResult(await dispatch(AtornilladoraAlimSliceRequests.getAllRequest()));
    } catch (error) {
      fetchAlimResult = null;
    }
    if (fetchAlimResult) {
      setAlims(fetchAlimResult);
    }
  };
  const getFormatos = async () => {
    let fetchFormatoResult;
    try {
      fetchFormatoResult = unwrapResult(await dispatch(AtornilladoraFormatoSliceRequests.getAllRequest()));
    } catch (error) {
      fetchFormatoResult = null;
    }
    if (fetchFormatoResult) {
      setFormatos(fetchFormatoResult);
    }
  };

  const getPuestosByProductoId = async () => {
    let result;
    try {
      result = unwrapResult(await dispatch(InstpuestoSliceRequests.GetAllByProductoIdRequest(productoId)));
    } catch (err) {
      result = null;
    }
    if (result) {
      setPuestos(result);
    }
  };

  const getGenericos = async () => {
    const tipoUnidadQuery = lineas.find(
      (line) => line.codigoReparacion === getValues("identificadorLinea").toString()
    )?.tipoUnidad;
    let fetchGenericoResult;
    try {
      fetchGenericoResult = unwrapResult(
        await dispatch(GenericoSliceRequests.getAllByTipoUnidadRequest(tipoUnidadQuery))
      );
    } catch (err) {
      fetchGenericoResult = null;
    }
    if (fetchGenericoResult) {
      setGenericos(fetchGenericoResult);
    }
  };

  const getMaximo = (): number => {
    const torque: number = parseFloat(getValues("torque"));
    const tolerancia: number = colores.find((col) => col.idColor === getValues("idColor")).tolerancia;
    return torque + tolerancia;
  };
  const getMinimo = (): number => {
    const torque: number = parseFloat(getValues("torque"));
    const tolerancia: number = colores.find((col) => col.idColor === getValues("idColor")).tolerancia;
    return torque - tolerancia;
  };

  const handleGuardar = async () => {
    try {
      if (!getValues("instpuestoId")) {
        openNotificationUI("Tiene que seleccionar un puesto ", "warning");
        return;
      }
      const nuevoLimite = {
        codigoTrazabilidad: "",
        numeroPuesto: parseInt(getValues("numeroPuesto")),
        identificadorLinea: getValues("identificadorLinea"),
        idGenerico: getValues("idGenerico"),
        instpuestoId: getValues("instpuestoId"),
        torque: parseInt(getValues("torque")),
        torqueMinimo: getMinimo(),
        torqueMaximo: getMaximo(),
        tolerancia: colores.find((col) => col.idColor === getValues("idColor")).tolerancia,
        idColor: getValues("idColor"),
        idAtornilladoraAlim: getValues("idAtornilladoraAlim"),
        idAtornilladoraFormato: getValues("idAtornilladoraFormato"),
        atornilladoraModelo: getValues("atornilladoraModelo"),
        codigoPuesto: getValues("codigoPuesto"),
        version: parseInt(getValues("version")),
        descripcion: getValues("descripcion"),
        observaciones: getValues("observaciones")
      };
      const fetchLimiteResult = unwrapResult(await dispatch(LimitesSliceRequests.CreateLimites(nuevoLimite)));
      refreshTable();
      callback(false);
    } catch (err) {
      openNotificationUI(err, "error");
    }
  };
  const codPuestoWatch = watch("codigoPuesto");
  const onChangeCodPuesto = () => {
    const codPuesto = getValues("codigoPuesto");
    const newPuesto = puestos?.find((p: IInstpuesto) => p?.codigoPuesto == codPuesto.trim());
    newPuesto && setValue("instpuestoId", newPuesto.id);
  };
  const onSetPuesto = (newValue: string) => {
    const inicio = newValue.indexOf("COD PUESTO:") + 12; // Sumamos 12 para ignorar "COD PUESTO:"
    const subcadena = newValue.substring(inicio);
    const fin = subcadena.indexOf("CRITICO");
    const resultado = subcadena.substring(0, fin).trim();
    const puesto = puestos.find((puesto) => puesto.codigoPuesto == resultado);
    setValue("instpuestoId", puesto?.id);
    setValue("codigoPuesto", puesto?.codigoPuesto);
  };
  const memorizePuesto = React.useCallback(_.debounce(onSetPuesto, 1000), [onSetPuesto]);

  React.useEffect(() => {
    if (getValues("codigoPuesto") != "") {
      onChangeCodPuesto();
    }
  }, [codPuestoWatch]);

  React.useEffect(() => {
    getPuestosByProductoId();
  }, [productoId]);
  React.useEffect(() => {
    onInit();
    getColores();
    getAlims();
    getFormatos();
  }, []);
  React.useEffect(() => {
    if (puestos) {
      const value = puestos.find((x) => x.id == getValues("instpuestoId"))?.id;
      setValue("instpuestoId", value);
    }
  }, [puestos]);

  React.useEffect(() => {
    if (idLwatch !== 0) {
      getGenericos();
    }
  }, [lineas]);

  return (
    <div>
      <div style={{ width: "50vw" }}>
        <div className="flex flex-col justify-center gap-5 sm:gap-4 w-full">
          <div className="grid grid-cols-2 gap-5 justify-items-center ">
            {/* ----------------GENERICO---------------*/}
            <div>
              <FormControl sx={sxStyles.formControl} variant="standard">
                <InputLabel>Genérico</InputLabel>
                <Controller
                  name="idGenerico"
                  control={control}
                  rules={{ required: "El genérico es necesario." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <Select {...field} variant="standard">
                      {genericos &&
                        genericos.map((gen) => (
                          <MenuItem key={gen.id} value={gen.id}>
                            {gen.codigo}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* ----------------TORQUE ATORNILLADORA---------------*/}
            <div>
              <Controller
                name="torque"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={sxStyles.formControl}
                    type="number"
                    label="Torque Atornilladora"
                    {...field}
                    variant="standard"
                  />
                )}
              />
            </div>
            {/* ----------------COLOR---------------*/}
            <div>
              <FormControl sx={sxStyles.formControl} variant="standard">
                <InputLabel>Color</InputLabel>
                <Controller
                  name="idColor"
                  control={control}
                  rules={{ required: "El color es necesario." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <Select {...field} variant="standard">
                      {colores &&
                        colores.map((col) => (
                          <MenuItem key={col.idColor} value={col.idColor}>
                            {col.color1}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* ----------------ALIMENTACION---------------*/}
            <div>
              <FormControl sx={sxStyles.formControl} variant="standard">
                <InputLabel>Alimentación Atornilladora</InputLabel>
                <Controller
                  name="idAtornilladoraAlim"
                  control={control}
                  rules={{ required: "El color es necesario." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <Select {...field} variant="standard">
                      {alims &&
                        alims.map((al) => (
                          <MenuItem key={al.idAtornilladoraAlim} value={al.idAtornilladoraAlim}>
                            {al.tipoAlimentacion}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* ----------------FORMATO---------------*/}
            <div>
              <FormControl sx={sxStyles.formControl} variant="standard">
                <InputLabel>Formato Atornilladora</InputLabel>
                <Controller
                  name="idAtornilladoraFormato"
                  control={control}
                  rules={{ required: "El color es necesario." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <Select {...field} variant="standard">
                      {formatos &&
                        formatos.map((form) => (
                          <MenuItem key={form.idAtornilladoraFormato} value={form.idAtornilladoraFormato}>
                            {form.formato}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* ----------------MODELO---------------*/}
            {/* <div>
              <Controller
                name="atornilladoraModelo"
                control={control}
                render={({ field }) => (
                  <TextField
                    className={classes.formControl}
                    label="Modelo Atornilladora"
                    {...field}
                    variant="standard"
                  />
                )}
              />
            </div> */}
            {/* ----------------VERSION---------------*/}
            <div>
              <Controller
                name="version"
                control={control}
                render={({ field }) => (
                  <TextField sx={sxStyles.formControl} label="Versión" {...field} variant="standard" />
                )}
              />
            </div>

            {/* ----------------PUESTO---------------*/}
            <div className="w-full flex gap-4">
              <FormControl sx={sxStyles.formControl} variant="standard" fullWidth>
                <Autocomplete
                  fullWidth
                  options={puestos?.map(
                    (puesto) =>
                      "DESC: " +
                      puesto?.descripcion +
                      " COD PUESTO: " +
                      puesto?.codigoPuesto +
                      " CRITICO: " +
                      (puesto?.critico ? "SI" : "NO")
                  )}
                  onChange={(e, newvalue: any) => memorizePuesto(newvalue)}
                  renderInput={(params) => <TextField {...params} variant="standard" fullWidth label="Puestos" />}
                />
              </FormControl>
              <Tooltip title="Agregar puesto">
                <IconButton onClick={() => setOpenPuestoCrud(true)}>
                  <Add />
                </IconButton>
              </Tooltip>
            </div>

            <ModalCompoment setOpenPopup={setOpenPuestoCrud} openPopup={openPuestoCrud} title="Agregar puesto limite">
              <PuestoCreate
                callback={setOpenPuestoCrud}
                productoId={productoId}
                refreshTable={getPuestosByProductoId}
              />
            </ModalCompoment>
            {/* ----------------codigoPuesto---------------*/}
            <div>
              <Controller
                name="codigoPuesto"
                control={control}
                render={({ field }) => (
                  <TextField disabled sx={sxStyles.formControl} label="Codigo puesto" {...field} variant="standard" />
                )}
              />
            </div>
            {/* ----------------NUMERO PUESTO---------------*/}
            <div>
              <Controller
                name="numeroPuesto"
                control={control}
                render={({ field }) => (
                  <TextField sx={sxStyles.formControl} label="Número puesto" {...field} variant="standard" />
                )}
              />
            </div>

            {/* ----------------OBSERVACIONES---------------*/}
            <div>
              <Controller
                name="observaciones"
                control={control}
                render={({ field }) => (
                  <TextField sx={sxStyles.formControl} label="Observaciones" {...field} variant="standard" />
                )}
              />
            </div>

            {/* ----------------DESCRIPCION---------------*/}
            {/* <div>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField className={classes.formControl} label="Descripción" {...field} variant="standard" />
                )}
              />
            </div> */}
          </div>
        </div>
        <div className="flex justify-center gap-5 text-center mt-6">
          <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
            Guardar
          </Button>
          <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
