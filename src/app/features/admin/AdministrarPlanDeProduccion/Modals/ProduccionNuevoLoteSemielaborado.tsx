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
  Autocomplete
} from "@mui/material";
import moment from "moment";
import { ILinea } from "app/models/ILinea";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { IGenerico } from "app/models/IGenerico";
// import { IProveedor } from "app/models/IProveedor";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { IModelos } from "app/models/IModelos";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { SemielaboradoModelosSliceRequests } from "app/Middleware/reducers/SemielaboradoModelosSlice";
import { SemielaboradoTipoSliceRequests } from "app/Middleware/reducers/SemielaboradoTipoSlice";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { UltimosLotesTable } from "app/features/produccion/components/UltimosLotesTable";
import { ModeloCRUDAndList } from "app/features/produccion/modals/ModeloCRUDAndList";
import { OpsTable } from "app/features/produccion/modals/OpsTable";
import { SemielaboradoForm } from "app/features/trazabilidad/modules/agregarSemielaboradImParaDeclarar/modal/SemielaboradoForm";
// import { IModelo } from "app/models/IModelo";

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

export const ProduccionNuevoLoteSemielaborado = ({ setOpenPopup, callback }: props): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const [activeStep, setActiveStep] = React.useState(0);
  const buttonClasses = MaterialButtons();
  const steps = getSteps();
  const dispatch = useAppDispatch();
  const [lineaSelect, setLineaSelect] = React.useState(true);
  const [modeloSelect, setModeloSelect] = React.useState(true);
  const [genericoSelect, setGenericoSelect] = React.useState(true);
  // const [proveedorSelect, setProveedorSelect] = React.useState(true);
  const [linea, setLinea] = React.useState<ILinea[]>([]); //lista de las lineas
  const [modelos, setModelos] = React.useState<IModelos[]>([]); //lista de los modelos de la linea seleccionada
  const [genericos, setGenericos] = React.useState<IGenerico[]>([]); // lista de los lotes del genericos seleccionado
  // const [proveedores, setProveedores] = React.useState<IProveedor[]>([]); // lista de los lotes del proveedores
  const [ultimosLotes, setUltimosLotes] = React.useState<IPlanProd[]>([]); // lista de los ultimos lotes
  const [ops, setOps] = React.useState<IXXE_WIP_OT[]>([]); //lista de las OPs disponibles
  const [modalOpen, setModalOpen] = React.useState(false);
  const [opSeleccionada, setOpSeleccionada] = React.useState<IXXE_WIP_OT>(null);
  const [openModeloCrud, setOpenModeloCrud] = React.useState(false);
  const initialState = {
    idModelo: 0,
    lote: "",
    cantidad: "",
    producido: "", //va a ser E??
    fecha: moment().format("DD-MM-YYYY"), //siempre va a ser la fecha de creacion
    tipoUnidad: "", //se setea dependiendo la linea
    mes: moment().toDate().getMonth(), //preguntar que es este atributo, el mes literal
    codigoModelo: "", //lo saco del select
    estado: "", //va a ser siempre sin iniciar
    organizacion: "", //UP6 siempre
    numeroOp: "", //me lo traigo de la tabla XXE_WIP_OT
    idLinea: 0, //me las traigo de la bd
    semielaborado: "", //lo que cargue el user.
    semielaboradoTipoId: 0,
    semielaboradoId: 0,
    familia: ""
  };
  interface initialStateI {
    idModelo: number | null; //este lo tengo que setear por la temporada, codigo modelo y tipo unidad, lo traigo de la tabla modelos, lo seteo desde la lista que traigo
    lote: string; //se setea a mano
    cantidad: string; //se setea a mano
    producido: string;
    fecha: string;
    tipoUnidad: string;
    mes: number;
    codigoModelo: string;
    estado: string;
    organizacion: string;
    numeroOp: string;
    idLinea: number;
    semielaborado: string;
    semielaboradoTipoId: number;
    semielaboradoId: number;
    familia: string;
  }
  const { handleSubmit, control, watch, getValues, setValue } = useForm<initialStateI>({ defaultValues: initialState });
  const watchLinea = watch("idLinea");
  const watchModelo = watch("codigoModelo");
  const watchNumeroOP = watch("numeroOp");
  const watchLote = watch("lote");
  const watchTiposemielaborado = watch("semielaboradoTipoId");
  const watchSemielaborado = watch("semielaborado");

  const handleNumeroOpChange = (numeroOp: string) => {
    const op = ops.find((op) => op.wiP_ENTITY_NAME == numeroOp);
    if (op && ultimosLotes.length > 0) {
      setValue("cantidad", op.starT_QUANTITY);
      setValue("numeroOp", numeroOp);
    } else {
      setValue("cantidad", op.starT_QUANTITY);
      setValue("numeroOp", numeroOp);
    }
  };

  useEffect(() => {
    console.log(watchTiposemielaborado);
  }, [watchTiposemielaborado]);

  const limpiarCampos = () => {
    setValue("cantidad", "");
    setValue("numeroOp", "OP-");
  };

  const handleOpSelect = () => {
    setModalOpen(true);
  };
  const handleAddModelo = () => {
    setOpenModeloCrud(true);
  };

  const getSemielaborado = async () => {
    const modelo = modelos.find((x) => x.codigoModelo == getValues("codigoModelo"));
    const result = unwrapResult(
      await dispatch(
        SemielaboradoModelosSliceRequests.getByModeloAndSemielaboradoTipoIdRequest({
          modeloId: modelo.idModelo,
          semielaboradoTipoId: getValues("semielaboradoTipoId")
        })
      )
    );
    if (result) {
      setValue("semielaborado", result.semielaborado.nombre);
      setValue("semielaboradoId", result.semielaborado.id);
    } else {
      openNotificationUI("No existe semielaborado para el modelo y Tipo Semielaborado seleccionado", "warning");
      setValue("semielaborado", "");
      setValue("semielaboradoId", 0);
    }
  };

  React.useEffect(() => {
    if (watchModelo && watchTiposemielaborado > 0) {
      getSemielaborado();
    }
  }, [watchModelo, watchTiposemielaborado]);

  const [listSemielaboradoTipos, setListSemielaboradoTipos] = useState(null);

  const getTipoSemielaborados = async () => {
    const result = unwrapResult(await dispatch(SemielaboradoTipoSliceRequests.getAllRequest()));
    setListSemielaboradoTipos(result);
  };

  const [openModalSemielaboradoIMForm, setOpenModalSemielaboradoIMForm] = useState(false);

  //-----------------------FUNC DEL STEPPER----------------------

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div className="grid grid-cols-3 text-center justify-center sm:grid-cols-3 gap-y-5">
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
                  rules={{ required: "Seleccione un modelo." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <FormControl sx={sxStyles.formControl} variant="standard" disabled={modeloSelect}>
                      <Autocomplete
                        options={modelos?.map((plan) => plan?.codigoModelo)}
                        onChange={(e, value: string) => {
                          field.onChange(value);
                        }}
                        value={modelos?.find((plan) => plan?.codigoModelo == watchModelo)?.codigoModelo}
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

              <div>
                <Controller
                  name="familia"
                  control={control}
                  rules={{ required: "La familia es necesaria para continuar" }}
                  // value={familia}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={true}
                      sx={sxStyles.formControl}
                      label="Familia"
                      variant="standard"
                    />
                  )}
                />
              </div>

              <div>
                <FormControl sx={sxStyles.formControl} variant="standard" disabled={lineaSelect}>
                  <InputLabel>Tipo Semielaborado</InputLabel>
                  <Controller
                    name="semielaboradoTipoId"
                    control={control}
                    rules={{ required: "Seleccione un tipo semielaborado." }}
                    defaultValue={null}
                    render={({ field }) => (
                      <Select {...field}>
                        {listSemielaboradoTipos?.map((semielaboradoTipo) => {
                          return (
                            <MenuItem key={semielaboradoTipo?.id} value={semielaboradoTipo?.id}>
                              {semielaboradoTipo.nombre}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </div>
              <div>
                <Controller
                  name="semielaborado"
                  control={control}
                  rules={{ required: "El tipo semielaborado es necesario." }}
                  defaultValue={watchSemielaborado}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={true}
                      sx={sxStyles.formControl}
                      label="Semielaborado"
                      variant="standard"
                    />
                  )}
                />
                <div style={sxStyles.formControl}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      setOpenModalSemielaboradoIMForm(true);
                    }}
                    className={buttonClasses.blueButton}>
                    Crear un SemielaboraIM
                  </Button>
                </div>
                <ModalCompoment
                  title="Crear un nuevo modelo"
                  setOpenPopup={setOpenModalSemielaboradoIMForm}
                  openPopup={openModalSemielaboradoIMForm}>
                  <SemielaboradoForm
                    refresh={null}
                    dataEdit={null}
                    setOpenModal={setOpenModalSemielaboradoIMForm}
                    lineaId={null}
                    apareceTable={true}
                  />
                </ModalCompoment>
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
              {/* ----------------CANTIDAD LOTE---------------*/}
              <div>
                <Controller
                  name="cantidad"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      sx={sxStyles.formControl}
                      label="Cantidad del Lote"
                      variant="standard"
                    />
                  )}
                />
              </div>
              {/* --------------CUARTO DIV---------------- */}
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
    const nuevoPlanprod: IPlanProd = {
      idModelo: modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.idModelo,
      lote: getValues("lote"),
      cantidad: getValues("cantidad").length > 0 ? parseInt(getValues("cantidad")) : 0,
      producido: "E", //va a ser E??
      fecha: moment().toDate(), //siempre va a ser la fecha de creacion
      tipoUnidad: linea.find((lane) => lane.idLinea === getValues("idLinea"))?.tipoUnidad, //se setea dependiendo la linea
      mes: moment().toDate().getMonth(), //preguntar que es este atributo, el mes literal
      // ultimoNewsan: parseInt(modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.codigoSGS), //codigo unico de cada modelo
      //ultimoNewsan: getValues("ultimoNewsan"), //codigo unico de cada modelo
      codigoModelo: getValues("codigoModelo"), //lo saco del select
      estado: "F", //va a ser siempre sin iniciar
      organizacion: "UP6", //UP6 siempre
      numeroOp: getValues("numeroOp").length > 0 ? getValues("numeroOp") : "OP-SIN ASIGNAR", //me lo traigo de la tabla XXE_WIP_OT
      idLinea: getValues("idLinea"), //me las traigo de la bd
      rutaLogo: "UP6", //no se carga
      tipoSemiElaborado: getValues("semielaborado"),
      semiElaboradoId: getValues("semielaboradoId"),

      //Este es el que tengo que cambiar
      // capacidad: modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.capacidadTipo
      // capacidad: modeloFamilia[0]?.familia.nombre,
      capacidad: getValues("familia")
    };

    console.log(nuevoPlanprod);

    if (guardarNuevoPlanProd(nuevoPlanprod)) {
      openNotificationUI("Lote creado con éxito", "success");
      // callback();
    } else {
      openNotificationUI("No se pudo crear el lote", "error");
    }
    setOpenPopup(false);
  };

  //SE EJECUTA AL RENDERIZAR
  const onInit = async () => {
    setValue("numeroOp", "OP-");
    let fetchLineaResult: ILinea[];
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.GetListByTipoProduccion("Semielaborado")));
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
      fetchOpResult = unwrapResult(
        await dispatch(XXE_WIP_OTSliceRequests.getListBySemielaboradoRequest(watchSemielaborado))
      );
    } catch (error) {
      fetchOpResult = null;
    }
    if (fetchOpResult) {
      console.log("🚀 ~ file: ProduccionNuevoLote.tsx ~ line 524 ~ getAllOps ~ fetchOpResult", fetchOpResult);
      setOps(fetchOpResult);
    } else {
      setOps([]); //Para no generar inconsistencias
    }
  };

  const getUltimosLotes = async () => {
    let fetchUltimosLotesResult;
    // const idmod = modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.idModelo;
    try {
      fetchUltimosLotesResult = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getListByLineaAndModeloAndTipoSemielaborado({
            idLinea: getValues("idLinea"),
            idModelo: modelos.find((mod) => mod.codigoModelo === getValues("codigoModelo"))?.idModelo,
            tipoSemielaborado: "SEMI"
          })
        )
      );
    } catch (error) {
      fetchUltimosLotesResult = null;
    }
    if (fetchUltimosLotesResult) {
      if (fetchUltimosLotesResult.length == 0) {
        setValue("lote", "101");
      } else {
        //Si existen lotes, se setean varios datos solos.
        const ultimoLote = fetchUltimosLotesResult[fetchUltimosLotesResult.length - 1];
        setValue("lote", (parseInt(ultimoLote.lote) + 1).toString());
      }
      setUltimosLotes(fetchUltimosLotesResult);
    }
  };

  //FETCH PARA TRAERME LOS MODELOS DE ESA LINEA
  const handleLineaChange = async () => {
    const lineSelected = linea.find((line) => line.idLinea === getValues("idLinea"));
    let tipoUnidadQuery = lineSelected?.tipoUnidad;
    setTitleLineModel({ ...titleLineModel, line: lineSelected.descripcion });
    const temporadaQuery = moment().toDate().getFullYear(); //para la temporada actual
    // const temporadaQuery = 2015;
    if (tipoUnidadQuery === "E" || tipoUnidadQuery === "I") {
      tipoUnidadQuery = "S"; //esto es porque en la tabla de la bd los de exterior e interior se guardan como S
    }
    setModeloSelect(true);
    if (tipoUnidadQuery && temporadaQuery) {
      let fetchModelosResult;
      try {
        fetchModelosResult = unwrapResult(await dispatch(ModelosSliceRequests.getModelosByTemporada(temporadaQuery)));
      } catch (error) {
        fetchModelosResult = null;
      }
      if (fetchModelosResult) {
        //No filtro por unidad ya q tiene q traer todas las unidades.
        //fetchModelosResult = fetchModelosResult.filter((x) => x.tipoUnidad == tipoUnidadQuery);
        const newArrayModels = [];
        //Hago esta logica por que hay modelos con el mismo name...
        //Inserto en newArrayModels los codigoModelo sin repetir.
        for (let index = 0; index < fetchModelosResult.length; index++) {
          const element = fetchModelosResult[index];
          if (!newArrayModels.includes(element.codigoModelo)) {
            newArrayModels.push(element.codigoModelo);
          }
        }
        //Inserto en modelosReturn los codigoModelo con su info, sin repetir ningun codigoModelo.
        const modelosReturn: IModelos[] = [];
        for (let index = 0; index < newArrayModels.length; index++) {
          const element = newArrayModels[index];
          const modelo = fetchModelosResult.find((x) => x.codigoModelo == element);
          modelosReturn.push(modelo);
        }
        // Filtro porque tengan 5 letras al menos para que no muestre modelos viejos no validos
        const newModelos = modelosReturn.filter((model) => model.capacidadTipo?.trim()?.length >= 5);
        setModelos(newModelos);
        setModeloSelect(false);
      }
    }
  };

  //FETCH PARA TRAERME LOS GENERICOS DEL MODELO SELECCIONADO
  const handleModeloChange = async () => {
    console.log("entre al change de modelosss");
    handleFamiliaChange();
    const tipoUnidadQuery = linea.find((line) => line.idLinea === getValues("idLinea"))?.tipoUnidad;
    setTitleLineModel({ ...titleLineModel, model: getValues("codigoModelo") });
    setGenericoSelect(true);
    if (tipoUnidadQuery) {
      let fetchGenericoResult: IGenerico[];
      try {
        fetchGenericoResult = unwrapResult(
          await dispatch(GenericoSliceRequests.getAllByTipoUnidadRequest(tipoUnidadQuery))
        );
      } catch (error) {
        fetchGenericoResult = null;
      }
      if (fetchGenericoResult) {
        setGenericos(fetchGenericoResult);
        setGenericoSelect(false);
      }
    }
  };

  //FETCH PARA TRAERME MODELO Y FAMILIA
  // const [modeloFamilia, setModeloFamilia] = useState<IModelo[] | []>([]);
  const handleFamiliaChange = async () => {
    try {
      const result = unwrapResult(await dispatch(ModeloSliceRequest.getAllByNombre(watchModelo)));
      if (result.length > 0) {
        // setModeloFamilia(result);
        setValue("familia", result[0].familia.nombre);
      } else {
        // setModeloFamilia([]);
        setValue("familia", "");
        openNotificationUI("Falta asignar Modelo a Familia en Trazabilidad-Familia", "error");
      }
    } catch (error) {
      openNotificationUI("Error leer Familia de Modelo", "error");
    }
  };
  // useEffect(() => {
  //   if (modeloFamilia) {
  //     console.log(modeloFamilia);
  //   }
  // }, [modeloFamilia]);

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UNA LINEA
  React.useEffect(() => {
    if (watchLinea) {
      handleLineaChange();
    }
  }, [watchLinea]);

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UN MODELO
  React.useEffect(() => {
    if (watchModelo && modelos.length > 0) {
      console.log(modelos);
      handleModeloChange();
      getUltimosLotes();
    }
  }, [watchModelo]);

  useEffect(() => {
    if (watchSemielaborado != "") getAllOps();
  }, [watchSemielaborado]);

  React.useEffect(() => {
    if (opSeleccionada !== null || opSeleccionada?.wiP_ENTITY_NAME === "") {
      handleNumeroOpChange(opSeleccionada?.wiP_ENTITY_NAME);
    }
  }, [opSeleccionada]);

  React.useEffect(() => {
    onInit();
    getTipoSemielaborados();
  }, []);

  const [titleLineModel, setTitleLineModel] = useState({ line: "", model: "", tipoSemi: "" });

  useEffect(() => {
    if (watchTiposemielaborado) {
      const tipoSemielaborado = listSemielaboradoTipos.find((x) => x.id == watchTiposemielaborado);
      setTitleLineModel({ ...titleLineModel, tipoSemi: tipoSemielaborado.nombre });
    }
  }, [watchTiposemielaborado]);

  return (
    <>
      <div>
        <form noValidate autoComplete="off" style={{ width: "80vw" }} onSubmit={handleSubmit(handleGuardar)}>
          <div style={sxStyles.stepperRoot}>
            <div style={{ textAlign: "center" }}>
              <Typography variant="h4">
                {titleLineModel.line + " - " + titleLineModel.model + " - " + titleLineModel.tipoSemi}
              </Typography>
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleGuardar}
                      disabled={watchNumeroOP == "" && watchLote == ""}>
                      Guardar
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={buttonClasses.blueButton}
                      onClick={handleNext}
                      // disabled={!(watchSemielaborado != "" && modeloFamilia.length > 0)}>
                      disabled={!(watchSemielaborado != "" && getValues("familia") != "")}>
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
