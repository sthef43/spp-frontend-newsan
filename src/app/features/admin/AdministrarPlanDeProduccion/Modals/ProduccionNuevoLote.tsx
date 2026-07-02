/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { IPlanProd } from "app/models/IPlanProd";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { Controller, useForm } from "react-hook-form";
import {
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stepper,
  StepLabel,
  TextField,
  Step,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  FormHelperText,
  FormLabel,
  Switch
} from "@mui/material";
import moment from "moment";
import { ILinea } from "app/models/ILinea";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ProveedorSliceRequests } from "app/Middleware/reducers/ProveedorSlice";
import { IProveedor } from "app/models/IProveedor";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import { TargetsSliceRequests } from "app/Middleware/reducers/TargetsSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { IModelos } from "app/models/IModelos";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { XXE_WIP_CONTROL_SERIALESSliceRequests } from "app/Middleware/reducers/XXE_WIP_CONTROL_SERIALESSlice";
import { IOrganizacion } from "app/models/IOrganizacion";
import { OrganizacionSliceRequests } from "app/Middleware/reducers/OrganizacionSlice";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { IFamilia } from "app/models/IFamilia";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { UltimosLotesTable } from "app/features/produccion/components/UltimosLotesTable";
import { ModeloCRUDAndList } from "app/features/produccion/modals/ModeloCRUDAndList";
import { OpsTable } from "app/features/produccion/modals/OpsTable";

const initialState = {
  idModelo: 0,
  lote: "",
  cantidad: "",
  producido: "", //va a ser E??
  fecha: moment().format("DD-MM-YYYY"), //siempre va a ser la fecha de creacion
  desde: "", //esto se calcula si hay lotes anteriores es: el valor de hasta (del lote anterior) + 1
  hasta: "", //esto se calcula, es: el valor de desde + la cantidad - 1
  tipoUnidad: "", //se setea dependiendo la linea
  target: 0, //se setea por defecto dependiendo la linea y el generico
  mes: moment().toDate().getMonth(), //preguntar que es este atributo, el mes literal
  ultimoNewsan: 0, //codigo unico de cada modelo
  codigoModelo: "", //lo saco del select
  estado: "", //va a ser siempre sin iniciar
  capacidad: "", //generico
  organizacion: "", //UP6 siempre
  numeroOp: "", //me lo traigo de la tabla XXE_WIP_OT
  idLinea: 0, //me las traigo de la bd
  rutaLogo: "", //no se carga
  loteCerrado: "S", //ponerle el valor que corresponda, es un char
  codigoModeloPar: "",
  idPauta: 0, //null
  idProveedor: 0, //lo traigo del select
  tipoSemiElaborado: "MON", //Por defecto MON o lo que cargue el user.
  sync: false
};
interface initialStateI {
  idModelo: number | null; //este lo tengo que setear por la temporada, codigo modelo y tipo unidad, lo traigo de la tabla modelos, lo seteo desde la lista que traigo
  lote: string; //se setea a mano
  cantidad: string; //se setea a mano
  producido: string;
  fecha: string;
  desde: string;
  hasta: string;
  tipoUnidad: string;
  target: number;
  mes: number;
  ultimoNewsan: number;
  codigoModelo: string;
  estado: string;
  capacidad: string;
  organizacion: string;
  numeroOp: string;
  idLinea: number;
  rutaLogo: string;
  loteCerrado: string;
  codigoModeloPar: string;
  idPauta: number;
  idProveedor: number;
  tipoSemiElaborado: string;
  sync: boolean;
}

const sxStyles = {
  formControl: {
    marginLeft: 6,
    margin: 1,
    alignContent: "center",
    minWidth: 220
  },
  stepperRoot: {
    width: "100%"
  },
  backButton: {
    marginRight: 1
  },
  instructions: {
    marginTop: 1,
    marginBottom: 1
  }
};

function getSteps() {
  return ["Datos de la línea y modelo", "Datos del Lote"];
}

interface props {
  setOpenPopup: (open: boolean) => void;
  callback: () => void;
}

export const ProduccionNuevoLote = ({ setOpenPopup, callback }: props): JSX.Element => {
  const { handleSubmit, control, watch, getValues, setValue } = useForm<initialStateI>({ defaultValues: initialState });

  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();
  const steps = getSteps();
  const dispatch = useAppDispatch();

  // const [genericos, setGenericos] = React.useState<IGenerico[]>([]); // lista de los lotes del genericos seleccionado
  const [activeStep, setActiveStep] = React.useState(0);
  const [lineaSelect, setLineaSelect] = React.useState(true);
  const [modeloSelect, setModeloSelect] = React.useState(true);
  const [genericoSelect, setGenericoSelect] = React.useState(true);
  const [proveedorSelect, setProveedorSelect] = React.useState(true);
  const [openModeloCrud, setOpenModeloCrud] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [linea, setLinea] = React.useState<ILinea[]>([]); //lista de las lineas
  const [modelos, setModelos] = React.useState<IModelos[]>([]); //lista de los modelos de la linea seleccionada
  const [opSeleccionada, setOpSeleccionada] = React.useState<IXXE_WIP_OT>(null);
  const [genericos, setGenericos] = React.useState<IFamilia[]>([]); // lista de los lotes del genericos seleccionado
  const [proveedores, setProveedores] = React.useState<IProveedor[]>([]); // lista de los lotes del proveedores
  const [ultimosLotes, setUltimosLotes] = React.useState<IPlanProd[]>([]); // lista de los ultimos lotes
  const [ops, setOps] = React.useState<IXXE_WIP_OT[]>([]); //lista de las OPs disponibles
  const [organizacionList, setOrganizacionList] = useState<IOrganizacion[]>([]);

  const watchLinea = watch("idLinea");
  const watchLote = watch("lote");
  const watchGenerico = watch("capacidad");
  const watchProveedor = watch("idProveedor");
  const watchModelo = watch("codigoModelo");
  const watchNumeroOP = watch("numeroOp");
  const watchCantidad = watch("cantidad");
  const watchDesde = watch("desde");
  const watchHasta = watch("hasta");
  const watchOrganizacion = watch("organizacion");
  const watchTarget = watch("target");

  const getUltimoSerie = () => {
    const resultado = ultimosLotes[ultimosLotes.length - 1]?.hasta + 1;

    return resultado.toString();
  };

  const calcularSerieHasta = (cantidad: string, serieDesde: string) => {
    const resultado = parseInt(cantidad) + parseInt(serieDesde) - 1;

    return resultado.toString();
  };

  const handleNumeroOpChange = (numeroOp: string) => {
    const op = ops.find((op) => op.wiP_ENTITY_NAME == numeroOp);
    if (op && ultimosLotes.length > 0) {
      setValue("desde", getUltimoSerie());
      setValue("hasta", calcularSerieHasta(getUltimoSerie(), op.starT_QUANTITY));
      setValue("cantidad", op.starT_QUANTITY);
      setValue("numeroOp", numeroOp);
    } else {
      setValue("desde", "1001");
      setValue("hasta", (parseInt(getValues("desde")) + parseInt(op.starT_QUANTITY) - 1).toString());
      setValue("cantidad", op.starT_QUANTITY);
      setValue("numeroOp", numeroOp);
    }
  };

  const limpiarCampos = () => {
    setValue("desde", "");
    setValue("hasta", "");
    setValue("cantidad", "");
    setValue("numeroOp", "OP-");
  };

  const handleOpSelect = () => {
    setModalOpen(true);
  };
  const handleAddModelo = () => {
    setOpenModeloCrud(true);
  };
  //Comento esto por que nunca trae nada codigoSGS. Asi ellos lo completan manualmente.
  /*  React.useEffect(() => {
    if (watchModelo) {
      setValue(
        "ultimoNewsan",
        parseInt(modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.codigoSGS)
      );
    }
  }, [watchModelo]); */

  const getOrganizaciones = async () => {
    const result = unwrapResult(await dispatch(OrganizacionSliceRequests.getAllRequest()));

    if (result) setOrganizacionList(result);
  };

  useEffect(() => {
    if (watchCantidad && watchDesde) {
      setValue("hasta", (parseInt(watchCantidad) + parseInt(watchDesde) - 1).toString());
    }
  }, [watchCantidad, watchDesde]);

  //-----------------------FUNC DEL STEPPER----------------------

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div className="grid grid-cols-1 text-center justify-center sm:grid-cols-2 gap-y-5">
              {/* ---------PRIMER DIV-------- */}
              {/* ----------------LINEA---------------*/}
              <div>
                <FormControl sx={sxStyles.formControl} variant="standard" disabled={lineaSelect}>
                  <InputLabel>Linea</InputLabel>
                  <Controller
                    name="idLinea"
                    control={control}
                    rules={{ required: "Seleccione una línea." }}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select {...field}>
                        {linea?.map((lane) => {
                          return (
                            <MenuItem key={lane?.idLinea} value={lane?.idLinea}>
                              {lane?.descripcion}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              {/* ----------------MODELOS---------------*/}
              <div>
                <Controller
                  name="codigoModelo"
                  control={control}
                  rules={{ required: "Seleccione una línea." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <FormControl sx={sxStyles.formControl} variant="standard" disabled={modeloSelect}>
                      <Autocomplete
                        options={modelos?.map((plan) => plan?.codigoModelo)}
                        onChange={(e, value) => {
                          field.onChange(value);
                        }}
                        defaultValue={modelos?.find((plan) => plan?.codigoModelo == watchModelo)?.codigoModelo}
                        renderInput={(params) => (
                          <TextField {...params} value={watchModelo} variant="standard" fullWidth />
                        )}
                      />
                    </FormControl>
                  )}
                />
                <div style={sxStyles.formControl}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddModelo}
                    className={buttonClasses.blueButton}>
                    Crear un modelo
                  </Button>
                </div>
                <ModalCompoment
                  title="Crear un nuevo modelo"
                  setOpenPopup={setOpenModeloCrud}
                  openPopup={openModeloCrud}>
                  <ModeloCRUDAndList setOpenPopup={setOpenModeloCrud} getModelos={handleLineaChange} />
                </ModalCompoment>
              </div>

              {/* ----------------GENERICO---------------*/}
              <div>
                {/* <FormControl className={classes.formControl} variant="standard" disabled={genericoSelect}>
                  <Autocomplete
                    onChange={(e, newvalue: any) => setValue("capacidad", newvalue)}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" value={watchGenerico} fullWidth label="Genérico" />
                    )}
                  />
                </FormControl> */}
                <Controller
                  name="capacidad"
                  control={control}
                  rules={{ required: "Seleccione una línea." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <FormControl sx={sxStyles.formControl} variant="standard" disabled={modeloSelect}>
                      <Autocomplete
                        options={genericos?.map((gen, index) => gen?.nombre)}
                        onChange={(e, value) => {
                          field.onChange(value);
                        }}
                        defaultValue={genericos?.find((gen) => gen?.nombre == watchGenerico)?.nombre}
                        renderInput={(params) => (
                          <TextField {...params} value={watchGenerico} variant="standard" fullWidth />
                        )}
                      />
                    </FormControl>
                  )}
                />
              </div>
              {/* ----------------PROVEEDOR---------------*/}
              <div>
                <FormControl sx={sxStyles.formControl} variant="standard" disabled={proveedorSelect}>
                  <InputLabel>Proveedor</InputLabel>
                  <Controller
                    name="idProveedor"
                    control={control}
                    rules={{ required: "El proveedor es necesario." }}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select {...field}>
                        {proveedores?.map((prov) => (
                          <MenuItem key={prov?.idProveedor} value={prov?.idProveedor}>
                            {prov?.descripcion}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div>
              <div className="w-full sm:mb-2">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography component={"span"} className="text-base ">
                      Últimos Lotes
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="flex flex-col w-full p-0">
                    {ultimosLotes?.length > 0 ? (
                      <UltimosLotesTable ultimosLotes={ultimosLotes} />
                    ) : (
                      <AccordionDetails>
                        <Typography component={"span"} className="text-base ">
                          Sin lotes anteriores
                        </Typography>
                      </AccordionDetails>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
            <div className="grid grid-cols-1 text-center justify-center sm:grid-cols-3 gap-y-5">
              {/* -------------TERCER DIV---------- */}
              {/* ----------------LOTE---------------*/}
              <div>
                <Controller
                  name="lote"
                  control={control}
                  rules={{ required: "El lote es necesario." }}
                  render={({ field }) => (
                    <TextField sx={sxStyles.formControl} label="Lote" {...field} variant="standard" />
                  )}
                />
              </div>
              {/* ----------------NUMERO DE OP---------------*/}
              <div className="flex justify-around">
                <Controller
                  name="numeroOp"
                  control={control}
                  rules={{ required: "El número de op es necesario." }}
                  defaultValue={opSeleccionada?.wiP_ENTITY_NAME}
                  render={({ field }) => (
                    <TextField {...field} sx={sxStyles.formControl} label="Número de OP" variant="standard" />
                  )}
                />
                <div className="flex justify-center items-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpSelect}
                    className={buttonClasses.blueButton}>
                    Seleccionar OP
                  </Button>
                </div>
              </div>
              <div>
                <Controller
                  name="ultimoNewsan"
                  control={control}
                  rules={{ required: "El número de ultimo es necesario." }}
                  render={({ field }) => (
                    <TextField {...field} sx={sxStyles.formControl} label="Prefijo" variant="standard" />
                  )}
                />
              </div>
              {/* ----------------CANTIDAD LOTE---------------*/}
              <div>
                <Controller
                  name="cantidad"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      style={sxStyles.formControl}
                      label="Cantidad del Lote"
                      variant="standard"
                    />
                  )}
                />
              </div>

              {/* ----------------SERIE DESDE---------------*/}
              <div>
                <Controller
                  name="desde"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      style={sxStyles.formControl}
                      label="Serie Desde"
                      variant="standard"
                    />
                  )}
                />
              </div>
              {/* ----------------SERIE HASTA---------------*/}
              <div>
                <Controller
                  name="hasta"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      style={sxStyles.formControl}
                      label="Serie Hasta"
                      variant="standard"
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="tipoSemiElaborado"
                  control={control}
                  rules={{ required: "El Tipo Semi Elaborado es necesario." }}
                  render={({ field }) => (
                    <TextField {...field} sx={sxStyles.formControl} label="Tipo Semi Elaborado" variant="standard" />
                  )}
                />
              </div>
              <div>
                <FormControl sx={sxStyles.formControl} variant="standard" disabled={lineaSelect}>
                  <InputLabel>Target</InputLabel>
                  <Controller
                    name="target"
                    control={control}
                    rules={{ required: "Seleccione target." }}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select {...field}>
                        {targets?.map((target) => {
                          return (
                            <MenuItem key={target?.idTarget} value={target?.idTarget}>
                              {target?.target}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              <div>
                {/* <FormControl className={classes.formControl} variant="standard" disabled={lineaSelect}>
                  <InputLabel>Organizacion</InputLabel>
                  <Controller
                    name="organizacion"
                    control={control}
                    rules={{ required: "Seleccione una organizacion." }}
                    // defaultValue={null}
                    render={({ field }) => (
                      <Select {...field}>
                        {organizacionList && organizacionList.map((organizacion) => {
                          return (
                            <MenuItem key={organizacion.id} value={organizacion.nombre}>
                              {organizacion.nombre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl> */}

                <Controller
                  name="organizacion"
                  control={control}
                  rules={{ required: "Seleccione una organizacion.", min: 1 }}
                  // defaultValue={null}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl sx={sxStyles.formControl} variant="standard" disabled={lineaSelect}>
                      <InputLabel>Organizacion</InputLabel>
                      <Select {...field}>
                        {organizacionList &&
                          organizacionList.map((organizacion) => {
                            return (
                              <MenuItem key={organizacion.id} value={organizacion.nombre}>
                                {organizacion.nombre}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                      {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
              {/* --------------CUARTO DIV---------------- */}
              <div className="col-span-3">
                <Controller
                  name="sync"
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={sxStyles.formControl} variant="standard" disabled={lineaSelect}>
                      <FormLabel component="legend">Sincronizar</FormLabel>
                      <Switch
                        {...field}
                        className="m-auto"
                        checked={field.value}
                        onChange={field.onChange}
                        name="Sync"
                      />
                      <FormHelperText className=" font-semibold">
                        Sincroniza el plan de produccion con una base de datos externa.
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </div>
        );
        {
          /* ------------FINAL CUARTO DIV-------------- */
        }
      default:
        return "Unknown stepIndex";
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    console.log(watchModelo);
    console.log(getValues("codigoModelo"));
  };

  //-----------------------FIN STEPPER------------------

  const guardarNuevoPlanProd = async (planProd: IPlanProd) => {
    if (planProd) {
      let fecthPostPlanProd: IPlanProd;
      try {
        fecthPostPlanProd = unwrapResult(await dispatch(PlanProdSliceRequests.postRequest(planProd)));
      } catch (error) {
        fecthPostPlanProd = null;
      }
      if (fecthPostPlanProd) {
        console.log("Guardado correctamente");
        return true;
      }
    }
  };

  /*   const getTarget = async (idLinea: number, generico: string) => {
    if (idLinea && generico) {
      let fetchTargetResult: ITargets;
      try {
        fetchTargetResult = unwrapResult(
          await dispatch(
            TargetsSliceRequests.getTargetByIdLineaGenericoRequest({ idLinea: idLinea, generico: generico })
          )
        );
      } catch (error) {
        fetchTargetResult = null;
      }
      if (fetchTargetResult) {
        return fetchTargetResult;
      }
    }
    return null;
  }; */

  const puedeGuardar = () => {
    const op = getValues("numeroOp");
    if (!op.includes("OP-")) {
      openNotificationUI("El numero de op no contiene OP- ", "warning");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    const puedeGuardarAux = puedeGuardar();
    if (!puedeGuardarAux) return false;
    //const targetAux = await getTarget(getValues("idLinea"), getValues("capacidad"));
    /*  if (targetAux) { */
    const nuevoPlanprod: IPlanProd = {
      idModelo: modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.idModelo,
      lote: getValues("lote"),
      cantidad: getValues("cantidad").length > 0 ? parseInt(getValues("cantidad")) : 0,
      producido: "E", //va a ser E??
      fecha: moment().toDate(), //siempre va a ser la fecha de creacion
      desde: getValues("desde").length > 0 ? parseInt(getValues("desde")) : 0,
      hasta: getValues("hasta").length > 0 ? parseInt(getValues("hasta")) : 0,
      tipoUnidad: linea.find((lane) => lane.idLinea === getValues("idLinea"))?.tipoUnidad, //se setea dependiendo la linea
      target: targets.find((x) => x.idTarget == getValues("target"))?.target, //se setea dependiendo la linea y el generico
      mes: moment().toDate().getMonth(), //preguntar que es este atributo, el mes literal
      // ultimoNewsan: parseInt(modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.codigoSGS), //codigo unico de cada modelo
      ultimoNewsan: getValues("ultimoNewsan"), //codigo unico de cada modelo
      codigoModelo: getValues("codigoModelo"), //lo saco del select
      estado: "F", //va a ser siempre sin iniciar
      capacidad: getValues("capacidad").trim(), //generico
      organizacion: getValues("organizacion"), //UP6 siempre
      numeroOp: getValues("numeroOp").length > 0 ? getValues("numeroOp") : "OP-SIN ASIGNAR", //me lo traigo de la tabla XXE_WIP_OT
      idLinea: getValues("idLinea"), //me las traigo de la bd
      rutaLogo: "UP6", //no se carga
      loteCerrado: null, //ponerle el valor que corresponda, es un char
      codigoModeloPar: "", //no se, preguntar
      idPauta: 0, //null
      idProveedor: getValues("idProveedor"), //lo traigo del select
      tipoSemiElaborado: getValues("tipoSemiElaborado") != "" ? getValues("tipoSemiElaborado") : "MON",
      sync: getValues("sync")
    };

    console.log(nuevoPlanprod);
    // return;
    if (guardarNuevoPlanProd(nuevoPlanprod)) {
      openNotificationUI("Lote creado con éxito", "success");
      callback();
    } else {
      openNotificationUI("No se pudo crear el lote", "error");
    }
    setOpenPopup(false);
    /*  } else {
      openNotificationUI("El genérico no corresponde a la línea seleccionada.", "error");
    } */
  };

  //SE EJECUTA AL RENDERIZAR
  const onInit = async () => {
    setValue("numeroOp", "OP-");
    let fetchLineaResult: ILinea[];
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.GetListByTipoProduccion("Montaje")));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult);
      setLineaSelect(false); //si el fetch es correcto cargo los modelos de esa linea
    }
  };

  const getAllOps = async () => {
    let fetchOpResult: IXXE_WIP_OT[];
    try {
      fetchOpResult = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.getAllRequest(getValues("codigoModelo"))));
      // fetchOpResult = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.getAllTestRequest()));
    } catch (error) {
      fetchOpResult = null;
    }
    if (fetchOpResult) {
      console.log("🚀 ~ file: ProduccionNuevoLote.tsx ~ line 502 ~ getAllOps ~ fetchOpResult", fetchOpResult);
      setOps(fetchOpResult);
    }
  };

  const getUltimosLotes = async () => {
    let fetchUltimosLotesResult;
    const idmod = modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.idModelo;
    try {
      fetchUltimosLotesResult = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getListByLineaAndModeloAndTipoSemielaborado({
            idLinea: getValues("idLinea"),
            idModelo: modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.idModelo,
            tipoSemielaborado: "MON"
          })
        )
      );
    } catch (error) {
      fetchUltimosLotesResult = null;
    }
    if (fetchUltimosLotesResult) {
      if (fetchUltimosLotesResult.length == 0) {
        setValue("lote", "101");
        setValue("desde", "1001");
      } else {
        //Si existen lotes, se setean varios datos solos.
        console.log(fetchUltimosLotesResult);
        const ultimoLote = fetchUltimosLotesResult[fetchUltimosLotesResult.length - 1];
        setValue("lote", (parseInt(ultimoLote.lote) + 1).toString());
        setValue("desde", (parseInt(ultimoLote.hasta) + 1).toString());
        setValue("ultimoNewsan", ultimoLote.ultimoNewsan);
      }
      setUltimosLotes(fetchUltimosLotesResult);
    }
  };

  //FETCH PARA TRAERME LOS MODELOS DE ESA LINEA
  const handleLineaChange = async () => {
    const lineSelected = linea.find((line) => line.idLinea === getValues("idLinea"));
    const tipoUnidadQuery = lineSelected?.tipoUnidad;
    setTitleLineModel({ ...titleLineModel, line: lineSelected.descripcion });
    const tipoUnidadLinea = tipoUnidadQuery;
    const temporadaQuery = moment().toDate().getFullYear(); //para la temporada actual
    // const temporadaQuery = 2015;
    // if (tipoUnidadQuery === "E" || tipoUnidadQuery === "I") {
    //   tipoUnidadQuery = "S"; //esto es porque en la tabla de la bd los de exterior e interior se guardan como S
    // }

    setModeloSelect(true);
    if (tipoUnidadQuery && temporadaQuery) {
      let fetchModelosResult;
      try {
        fetchModelosResult = unwrapResult(await dispatch(ModelosSliceRequests.getModelosByTemporada(temporadaQuery)));
      } catch (error) {
        fetchModelosResult = null;
      }
      if (fetchModelosResult) {
        fetchModelosResult = fetchModelosResult.filter((x) => x.tipoUnidad == tipoUnidadQuery);
        const newArrayModels = [];
        //Insertor en newArrayModels los codigoModelo sin repetir.
        for (let index = 0; index < fetchModelosResult.length; index++) {
          const element = fetchModelosResult[index];
          if (!newArrayModels.includes(element.codigoModelo)) {
            newArrayModels.push(element.codigoModelo);
          }
        }
        //Inserto en modelosReturn los codigoModelo con su info, sin repetir ningun codigoModelo.
        const modelosReturn = [];
        for (let index = 0; index < newArrayModels.length; index++) {
          const element = newArrayModels[index];
          const modelo = fetchModelosResult.find((x) => x.codigoModelo == element);
          modelosReturn.push(modelo);
        }
        setModelos(modelosReturn);
        setModeloSelect(false);
      }
    }
  };

  //FETCH PARA TRAERME LOS GENERICOS DEL MODELO SELECCIONADO
  const handleModeloChange = async () => {
    const tipoUnidadQuery = linea.find((line) => line.idLinea === getValues("idLinea"))?.tipoUnidad;
    setTitleLineModel({ ...titleLineModel, model: getValues("codigoModelo") });
    setGenericoSelect(true);
    console.log(tipoUnidadQuery);
    if (tipoUnidadQuery) {
      // let fetchGenericoResult: IGenerico[];
      let fetchGenericoResult: IFamilia[];
      try {
        // fetchGenericoResult = unwrapResult(
        //   await dispatch(GenericoSliceRequests.getAllByTipoUnidadRequest(tipoUnidadQuery))
        // );
        fetchGenericoResult = unwrapResult(await dispatch(FamiliaSliceRequests.getAllRequest()));
      } catch (error) {
        fetchGenericoResult = null;
      }
      if (fetchGenericoResult) {
        setGenericos(fetchGenericoResult);
        setGenericoSelect(false);
      }
    }
  };

  //FETCH PARA TRAERME LOS PROVEEDORES
  const handleGenericoChange = async () => {
    const tipoUnidadQuery = linea.find((line) => line.idLinea === getValues("idLinea"))?.tipoUnidad;
    setProveedorSelect(true);
    if (tipoUnidadQuery) {
      let fetchProveedorResult;
      try {
        fetchProveedorResult = unwrapResult(
          await dispatch(ProveedorSliceRequests.getAllByTipoUnidadRequest(tipoUnidadQuery))
        );
      } catch (error) {
        fetchProveedorResult = null;
      }
      if (fetchProveedorResult) {
        setProveedores(fetchProveedorResult);
        setProveedorSelect(false);
      }
    }
  };

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UNA LINEA
  React.useEffect(() => {
    if (watchLinea) {
      handleLineaChange();
      getTargets();
    }
    handleGenericoChange();
  }, [watchLinea]);

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UN MODELO
  React.useEffect(() => {
    if (watchModelo && modelos.length > 0) {
      handleModeloChange();
      getUltimosLotes();
      getAllOps();
    }
  }, [watchModelo]);

  useEffect(() => {
    if (ultimosLotes.length == 0 && watchModelo != "") {
      getPrefijo();
    }
  }, [ultimosLotes]);

  const getPrefijo = async () => {
    let result;
    try {
      result = unwrapResult(await dispatch(XXE_WIP_CONTROL_SERIALESSliceRequests.getByCodigoModelo(watchModelo)));
    } catch (error) {
      console.log(error);
    }
    if (result) {
      const prefijo = result.seriaL_NUMBER.substr(1, 4);
      setValue("ultimoNewsan", prefijo);
    } else {
      setValue("ultimoNewsan", 0);
    }
  };

  React.useEffect(() => {
    if (opSeleccionada !== null || opSeleccionada?.wiP_ENTITY_NAME === "") {
      handleNumeroOpChange(opSeleccionada?.wiP_ENTITY_NAME);
    }
  }, [opSeleccionada]);

  const getTargets = async () => {
    const result = unwrapResult(await dispatch(TargetsSliceRequests.getListByIdLineaRequest(getValues("idLinea"))));
    setTargets(result);
  };

  const [targets, setTargets] = useState([]);

  React.useEffect(() => {
    onInit();
    getOrganizaciones();
  }, []);

  const [titleLineModel, setTitleLineModel] = useState({ line: "", model: "" });

  return (
    <>
      <div>
        <form autoComplete="off" style={{ width: "80vw" }} onSubmit={handleSubmit(handleGuardar)}>
          <div style={sxStyles.stepperRoot}>
            <div style={{ textAlign: "center" }}>
              <Typography variant="h4">{titleLineModel.line + " - " + titleLineModel.model}</Typography>
            </div>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              <div>
                <Typography component={"span"} sx={sxStyles.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
                <div className="py-8">
                  <Button disabled={activeStep === 0} onClick={handleBack} sx={sxStyles.backButton}>
                    Atras
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    watchNumeroOP.length > 3 &&
                    watchCantidad.length > 0 &&
                    watchHasta.length > 0 &&
                    watchOrganizacion && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGuardar}
                        disabled={watchNumeroOP == "" && watchLote == ""}>
                        Guardar
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={buttonClasses.blueButton}
                      onClick={handleNext}
                      disabled={watchProveedor <= 0}>
                      Siguiente
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        <ModalCompoment title="OPs Disponibles" openPopup={modalOpen} setOpenPopup={setModalOpen}>
          <OpsTable
            ops={ops}
            setOpenPopup={setModalOpen}
            limpiarCampos={limpiarCampos}
            setOpSeleccionada={setOpSeleccionada}
          />
        </ModalCompoment>
      </div>
    </>
  );
};
