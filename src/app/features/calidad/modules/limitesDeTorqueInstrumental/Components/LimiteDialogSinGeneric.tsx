import React from "react";
import { useAppDispatch } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { IInstlimite, ILinea, IGenerico, IInstpuesto } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { InstlimiteSliceRequests } from "app/features/calidad/slices/InstlimiteSlice";
import { InstpuestoSliceRequests } from "app/features/calidad/slices/InstpuestoSlice";
// import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";

interface props {
  limite: IInstlimite;
  callback: any;
  refreshTable: any;
}

export const LimiteDialogSinGeneric = ({ limite, callback, refreshTable }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const [genericos, setGenericos] = React.useState<IGenerico[]>([]);
  const [puestos, setPuestos] = React.useState<IInstpuesto[]>([]);
  const [valores, setValores] = React.useState({});

  const defaultLimiteValues = {
    idInstlimite: limite?.idInstlimite,
    codigoTrazabilidad: limite?.codigoTrazabilidad || "",
    codigoPuesto: limite?.codigoPuesto || "",
    idLinea: limite?.idLinea,
    fecha: limite?.fecha || "",
    generico: limite?.generico || "",
    torqueMinimo: limite?.torqueMinimo || 0,
    torqueMaximo: limite?.torqueMaximo || 0,
    observaciones: limite?.observaciones || "",
    color: limite?.color || "",
    atornilladoraAlimen: limite?.atornilladoraAlimen || "",
    atornilladoraFormat: limite?.atornilladoraFormat || "",
    idInstpuesto: limite?.idInstpuesto,
    codigo: limite?.codigo || "",
    version: limite?.version || "",
    codigoInicio: limite?.codigoInicio || "",
    atornilladoraModelo: limite?.atornilladoraModelo || "",
    idGenerico: limite?.idGenerico,
    descripcion: limite?.descripcion || "",
    torque: limite?.torque || 0,
    tolerancia: limite?.tolerancia || 0
  };
  interface DefaultValues {
    idInstlimite: number;
    codigoTrazabilidad: string;
    codigoPuesto: string;
    idLinea: number;
    fecha: string;
    generico: string;
    torqueMinimo: number;
    torqueMaximo: number;
    observaciones: string;
    color: string;
    atornilladoraAlimen: string;
    atornilladoraFormat: string;
    idInstpuesto: number;
    codigo: string;
    version: string;
    codigoInicio: string;
    atornilladoraModelo: string;
    idGenerico: number;
    descripcion: string;
    torque: number;
    tolerancia: number;
  }

  const { control, getValues, setValue } = useForm<DefaultValues>({
    defaultValues: defaultLimiteValues
  });

  const onInit = async () => {
    let fetchLineasResult: ILinea[];
    try {
      fetchLineasResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    } catch (error) {
      fetchLineasResult = null;
    }
    if (fetchLineasResult) {
      setLineas(fetchLineasResult);
    }
  };

  const getGenericos = async () => {
    let fetchGenericoResult: IGenerico[];

    try {
      fetchGenericoResult = unwrapResult(await dispatch(GenericoSliceRequests.getAllRequest()));
    } catch (error) {
      fetchGenericoResult = null;
    }
    if (fetchGenericoResult) {
      setGenericos(fetchGenericoResult);
    }
  };
  const getPuestos = async () => {
    let fetchPuestoResult: IInstpuesto[];
    try {
      fetchPuestoResult = unwrapResult(await dispatch(InstpuestoSliceRequests.getAllRequest()));
    } catch (error) {
      fetchPuestoResult = null;
    }
    if (fetchPuestoResult) {
      setPuestos(fetchPuestoResult);
    }
  };

  React.useEffect(() => {
    onInit();
    getGenericos();
    getPuestos();
  }, []);

  const handleCancelar = () => {
    callback(false);
  };

  const borrarLimite = async () => {
    let fetchEliminarLimite;
    try {
      fetchEliminarLimite = unwrapResult(await dispatch(InstlimiteSliceRequests.deleteRequest(limite.idInstlimite)));
    } catch (error) {
      fetchEliminarLimite = null;
    }
    if (fetchEliminarLimite) {
      console.log("🚀 ~ file: LimiteDialog.tsx ~ line 50 ~ borrarLimite ~ fetchEliminarLimite", fetchEliminarLimite);
      openNotificationUI("Limite borrado correctamente.", "success");
      callback(false);
    }
  };

  const handleEliminar = async () => {
    const response = await getConfirmation("Borrar limite", "Está seguro que desea borrar el limite?");
    if (response) {
      borrarLimite();
    }
  };

  const handleGuardar = async () => {
    let result;
    try {
      console.log(getValues());
      // result = await dispatch(InstlimiteSliceRequests.UpdateInstlimite(getValues()));
    } catch (err) {
      result = null;
    }
    if (result) {
      openNotificationUI("Datos del limite actualizados.", "success");
      refreshTable(); //actualizo la tabla
      callback(false);
    }
  };

  return (
    <div>
      {limite && (
        <div>
          <div style={{ width: "80vw" }}>
            <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
              <div className="text-center sm:text-left p-2 w-full">
                <FormControl sx={{ minWidth: 170 }} variant="standard">
                  <Autocomplete
                    options={lineas?.map((lane) => lane?.idLinea)}
                    onChange={(e, newvalue: any) => setValue("idLinea", newvalue)}
                    renderInput={(params) => <TextField {...params} variant="standard" fullWidth label="Línea" />}
                  />
                </FormControl>
              </div>
              <div className="text-center sm:text-left p-2 w-full">
                <FormControl sx={{ minWidth: 170 }}>
                  <InputLabel>Genérico</InputLabel>
                  <Controller
                    name="idGenerico"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select {...field} variant="standard">
                        {genericos &&
                          genericos.map((gen: IGenerico) => (
                            <MenuItem key={gen.id} value={gen.id}>
                              {gen.codigo}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              {/* ----------------COLOR---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Controller
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <div className="sm:grid sm:grid-cols-1 ">
                          <div className="sm:col-span-1 ">
                            <FormControlLabel value="ROJO" control={<Radio />} label="Rojo" />
                            <FormControlLabel value="AMARILLO" control={<Radio />} label="Amarillo" />
                          </div>
                          <div className="sm:col-span-1">
                            <FormControlLabel value="AZUL" control={<Radio />} label="Azul" />
                            <FormControlLabel value="BLANCO" control={<Radio />} label="Blanco" />
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                    rules={{ required: true }}
                    control={control}
                    defaultValue="ROJO"
                    name="color"
                  />
                </FormControl>
              </div>
              {/* ----------------ATORNILLADORA TIPO---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="atornilladoraAlimen"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="Tipo de atornilladora"
                      {...field}
                      className="w-full"
                      autoComplete="off"
                      variant="standard"
                    />
                  )}
                />
              </div>
              {/* ----------------ATORNILLADORA FORMATO---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="atornilladoraFormat"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="Formato de atornilladora"
                      {...field}
                      className="w-full"
                      autoComplete="off"
                      variant="standard"
                    />
                  )}
                />
              </div>
              {/* ----------------ATORNILLADORA MODELO---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="atornilladoraModelo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="Modelo de atornilladora"
                      {...field}
                      className="w-full"
                      autoComplete="off"
                      variant="standard"
                    />
                  )}
                />
              </div>
              {/* ----------------PUESTOS---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <FormControl sx={{ minWidth: 170 }}>
                  <InputLabel>Puesto</InputLabel>
                  <Controller
                    name="idGenerico"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select {...field} variant="standard">
                        {puestos &&
                          puestos.map((puesto: IInstpuesto) => (
                            <MenuItem key={puesto.id} value={puesto.id}>
                              {puesto.descripcion}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              {/* ----------------SECTOR PUESTO---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="codigo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="Sector puesto"
                      {...field}
                      className="w-full"
                      autoComplete="off"
                      variant="standard"
                    />
                  )}
                />
              </div>
              {/* ----------------NUMERO PUESTO---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="codigoPuesto"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="Número de puesto"
                      {...field}
                      className="w-full"
                      autoComplete="off"
                      variant="standard"
                    />
                  )}
                />
              </div>
              {/* ----------------VERSIÓN---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="version"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="Versión" {...field} className="w-full" autoComplete="off" variant="standard" />
                  )}
                />
              </div>
              {/* ----------------OBSERVACIONES---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="observaciones"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="Versión" {...field} className="w-full" autoComplete="off" variant="standard" />
                  )}
                />
              </div>
              {/* ----------------TRAZABILIDAD---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="codigoTrazabilidad"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField label="Versión" {...field} className="w-full" autoComplete="off" variant="standard" />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
                Guardar
              </Button>
              <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button className={buttonClasses.redButton} variant="contained" onClick={handleEliminar}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
