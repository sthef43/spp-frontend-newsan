/* eslint-disable unused-imports/no-unused-vars */
import { ReprocesoLoteTable } from "app/features/calidad/modules/noConformes/Components/ReprocesoLoteTable";
import { EstadoLoteSliceRequests } from "app/Middleware/reducers/EstadoLoteSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IControlLote } from "app/models/IControlLote";
import { IEstadoLote } from "app/models/IEstadoLote";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PrintIcon from "@mui/icons-material/Print";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography
} from "@mui/material";

import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { IReprocesoLote } from "app/models/IReprocesoLote";
import { ReprocesoLoteSliceRequests } from "app/Middleware/reducers/ReprocesoLoteSlice";
import { useReactToPrint } from "react-to-print";
import { Impresion } from "app/features/calidad/modules/noConformes/Components/Impresion";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { ILinea } from "app/models/ILinea";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { IPlanProd } from "app/models/IPlanProd";
import { existeRechazoExcluido } from "app/shared/helpers/existeRechazoExluido";
import { ControlLoteMaterialesSliceRequests } from "app/Middleware/reducers/ControlLoteMaterialesSlice";
import { IAppUser, IControlLoteMateriales, ISuperCargalinea } from "app/models";
import { MateriablesTable } from "../Components/MateriablesTable";
import { MaterialesDialog } from "../../../components/MaterialesDialog";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { ReprocesadosModal } from "./ReprocesadosModal";
import { IReprocesoLinea } from "app/models/IReprocesoLinea";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";

interface props {
  controlLote: IControlLote;
  setOpenPopup: any;
  actualizarTabla: any;
  planProd: IPlanProd;
}

export const NoConformesDialog = ({ controlLote, setOpenPopup, actualizarTabla, planProd }: props): JSX.Element => {
  const { darkMode } = useAppSelector((state) => state.colorApp);
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const sxStyles = {
    edit: {
      width: "70vw",
      textAlign: "center" as const
    },
    formControl: {
      minWidth: 170
    },
    selectEmpty: {
      marginTop: 2
    },
    responsive: {
      display: "flex",
      flexDirection: "column" as const,
      width: "100%",
      padding: "0"
    },
    textColor: {
      color: darkMode ? "rgba(250, 250, 250, 0.9)" : "#c80f4d"
    }
  };
  const dispatch = useAppDispatch();
  const initialState: IControlLote = controlLote;
  const { control, getValues, handleSubmit, watch } = useForm({
    defaultValues: initialState
  });

  const [editable, setEditable] = React.useState<boolean>(true);
  const [causaList, setCausaList] = React.useState<IEstadoLote[]>([]);
  const [causa, setCausa] = React.useState<IEstadoLote>(null);
  const [linea, setLinea] = React.useState<ILinea>(null);
  const [reprocesos, setReprocesos] = React.useState<IReprocesoLote[]>([]);
  const [errRechazados, setErrRechazados] = React.useState<string>("");
  const [errReprocesados, setErrReprocesados] = React.useState<string>("");
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [errorIzq, setErrorIzq] = React.useState<string>("");
  const [errorDerecha, setErrorDerecha] = React.useState<string>("");
  const [rechazados, setRechazados] = React.useState<IControlLote[]>([]);
  const [materiales, setMateriales] = useState<IControlLoteMateriales[]>([]);
  const [modalCargaMaterialesOpen, setModalCargaMaterialesOpen] = React.useState(false);
  const [modalReprocesadosOpen, setModalReprocesadosOpen] = React.useState(false);
  const [selectedMaterial, setSelectedMaterial] = React.useState<ISuperCargalinea[]>([]);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const [listadoReprocesadoLinea, setListadoReprocesadoLinea] = useState([]);
  const [mostrarBotonReprocesados, setMostrarBotonReprocesados] = useState(false);
  const [planProduccion, setPlanProduccion] = useState<IPlanProd>();
  const [mostrarMensajeReprocesados, setMostrarMensajeReprocesados] = useState(false);

  const watchCausa = watch("idEstadoLote");
  const watchNroHasta = watch("serieHasta");
  const watchNroDesde = watch("serieDesde");

  const onInit = async () => {
    let fetchEstadoLoteResult: IEstadoLote[];
    try {
      fetchEstadoLoteResult = unwrapResult(await dispatch(EstadoLoteSliceRequests.getAllRequest()));
    } catch (error) {
      fetchEstadoLoteResult = null;
    }
    if (fetchEstadoLoteResult) {
      setCausaList(fetchEstadoLoteResult);
    }
  };

  const getLinea = async () => {
    let fetchLineaResult: ILinea;
    try {
      fetchLineaResult = unwrapResult(await dispatch(LineaSliceRequests.getByIdRequest(controlLote.idLinea)));
    } catch (error) {
      fetchLineaResult = null;
    }
    if (fetchLineaResult) {
      setLinea(fetchLineaResult);
    }
  };

  const getRechazos = async () => {
    const fetchResult = unwrapResult(
      await dispatch(
        ControlLoteSliceRequests.getAllRechazosRequest({
          modeloA: planProd?.numeroOp,
          modeloB: planProd?.lote
        })
      )
    );

    if (fetchResult) {
      // console.log("🚀 ~ file: NoConformesDialog.tsx ~ line 152 ~ getRechazos ~ fetchResult", fetchResult);
      setRechazados(fetchResult);
    }
  };

  const getMateriales = async () => {
    const fetchResult = unwrapResult(
      await dispatch(ControlLoteMaterialesSliceRequests.getMaterialesByIdControlLote(initialState.idControlLote))
    );

    if (fetchResult) {
      // console.log("🚀 ~ file: NoConformesDialog.tsx ~ line 152 ~ getRechazos ~ fetchResult", fetchResult);
      setMateriales(fetchResult);
    }
  };

  React.useEffect(() => {
    onInit();
    buscarReprocesos();
    getLinea();
    getRechazos();
    getMateriales();
    getReprocesoLineaByControlLoteId();
  }, []);

  const handleCancelar = () => {
    setOpenPopup(false);
  };

  const componentRef = React.useRef(null);

  const handleImprimir = useReactToPrint({
    content: () => componentRef.current
  });

  const handlePrint = () => {
    // console.log(componentRef.current);
    handleImprimir();
  };

  const handleEditar = () => {
    setEditable(!editable);
  };

  const handleGuardar = async () => {
    let result;
    const controlLoteEditado: IControlLote = getValues();
    if (controlLoteEditado.cantidadRechazos == controlLoteEditado.cantidadReprocesos) {
      controlLoteEditado.estadoReproceso = "S";
    }

    try {
      result = await dispatch(ControlLoteSliceRequests.putRequest(controlLoteEditado));
    } catch (err) {
      result = null;
    }
    if (result) {
      openNotificationUI("Datos del rechazo actualizados.", "success");
      //onInit(); //actualizo los datos de cada rechazo
      actualizarTabla(); //actualizo la tabla
      setOpenPopup(false);
    }
  };

  //BUSCA SI HAY REPROCESOS HECHOS DEL RECHAZO SELECCIONADO
  const buscarReprocesos = async () => {
    let fetchResult: IReprocesoLote[];
    try {
      fetchResult = unwrapResult(
        await dispatch(ReprocesoLoteSliceRequests.getAllByIdControlLoteRequest(controlLote?.idControlLote))
      );
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult) {
      setReprocesos(fetchResult);
    }
  };

  //COMPRUEBA SI EL NÚMERO INGRESADO ES IGUAL AL NUMERO DE RECHAZOS QUE DEBERÍA HABER
  const handleRechazoChange = (numero: number) => {
    const cantidadEsperada = getValues("serieHasta") - getValues("serieDesde") + 1;
    if (numero === cantidadEsperada) {
      setErrRechazados("");
      return numero;
    } else {
      setErrRechazados("Ingrese una cantidad de rechazos válida");
      return numero;
    }
  };

  //COMPRUEBA SI EL NÚMERO INGRESADO ES IGUAL AL NUMERO DE RECHAZOS QUE DEBERÍA HABER
  const handleReprocesosChange = (numero: number) => {
    const cantidadEsperada = getValues("cantidadRechazos");
    if (numero <= cantidadEsperada) {
      setErrReprocesados("");
      return numero;
    } else {
      setErrReprocesados("Ingrese una cantidad de reprocesos válida");
      return numero;
    }
  };

  const getDescripcionCausa = (idCausa: number): IEstadoLote => {
    const resultado = causaList.find((causa) => causa.idEstadoLote == idCausa);
    return resultado;
  };

  const handleNroDesdeChange = (numero: number, der: boolean) => {
    let rechazado = false;
    if (der) {
      if (numero >= planProd?.desde && numero <= planProd?.hasta && numero >= getValues("serieDesde") && der === true) {
        rechazado = existeRechazoExcluido(numero, rechazados, controlLote?.idControlLote);
        // console.log("🚀 ~ file: NoConformesDialog.tsx ~ line 254 ~ handleNroDesdeChange ~ rechazado", rechazado);
        if (rechazado) {
          setErrorDerecha("Número de serie inválido");
          return numero;
        }
        setErrorDerecha("");
        return numero;
      }
      setErrorDerecha("Número de serie inválido");
    } else {
      if (watchNroHasta === 0) {
        if (numero >= planProd?.desde && numero <= planProd?.hasta) {
          rechazado = existeRechazoExcluido(numero, rechazados, controlLote?.idControlLote);
          // console.log("🚀 ~ file: NoConformesDialog.tsx ~ line 269 ~ handleNroDesdeChange ~ rechazado", rechazado);
          if (rechazado) {
            setErrorIzq("Número de serie inválido");
            return numero;
          }
          setErrorIzq("");
          return numero;
        }
      } else {
        if (numero >= planProd?.desde && numero <= planProd?.hasta && numero <= getValues("serieHasta")) {
          rechazado = existeRechazoExcluido(numero, rechazados, controlLote?.idControlLote);
          if (rechazado) {
            setErrorIzq("Número de serie inválido");
            return numero;
          }
          setErrorIzq("");
          return numero;
        }
      }
      setErrorIzq("Número de serie inválido");
    }

    return numero;
  };

  React.useEffect(() => {
    if (watchCausa && causaList.length > 0) {
      setCausa(getDescripcionCausa(getValues("idEstadoLote")));
    }
  }, [watchCausa, causaList]);

  const puedeGuardar = () => {
    if (watchNroDesde !== 0 && watchNroHasta !== 0) {
      return true;
    }
    return false;
  };

  const validarCampos = () => {
    const desactivado = puedeGuardar() && errorIzq.length === 0 && errorDerecha.length === 0;
    setDisabled(!desactivado);
  };

  React.useEffect(() => {
    validarCampos();
  }, [errorIzq, errorDerecha]);

  //creo todos los materiales que se van a guardar en la base de datos
  const crearMaterialesList = (): IControlLoteMateriales[] => {
    const materialesAux: IControlLoteMateriales[] = [];
    selectedMaterial.map((mat: ISuperCargalinea) => {
      const guardarListaMateriales: IControlLoteMateriales = {
        codigoModelo: mat.codigoModelo,
        codigoPautas: mat.codigoPautas,
        numeroOp: mat.numeroOp,
        cantidad: mat.cantidadMaterial,
        nombreSupervisor: infoUser.operator.name + " " + infoUser.operator.surname,
        descripcion: mat.descripcion,
        idControlLote: initialState.idControlLote
      };
      materialesAux.push(guardarListaMateriales);
    });

    return materialesAux;
  };

  const guardarMateriales = async () => {
    let result;
    let listMateriales: IControlLoteMateriales[] = [];
    listMateriales = crearMaterialesList();
    if (listMateriales && listMateriales.length > 0) {
      try {
        result = unwrapResult(await dispatch(ControlLoteMaterialesSliceRequests.multiPostRequest(listMateriales)));
      } catch (e) {
        console.log(e);
      }
      if (result) {
        openNotificationUI("Datos guardados exitosamente :)", "success");
        getMateriales();
      }
    }
  };

  useEffect(() => {
    guardarMateriales();
  }, [selectedMaterial]);

  const verReprocesados = () => {
    setModalReprocesadosOpen(true);
  };

  const getReprocesoLineaByControlLoteId = async () => {
    let result: IReprocesoLinea[] = [];
    let planDeProduccion: IPlanProd;
    if (initialState.idControlLote == 0 || initialState.idControlLote == undefined) return false;
    try {
      result = unwrapResult(
        await dispatch(ReprocesoLineaSliceRequests.getListByControlLoteId(initialState.idControlLote))
      );
      planDeProduccion = unwrapResult(
        await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(initialState.numeroOp))
      );
      if (planDeProduccion) {
        setPlanProduccion(planDeProduccion);
        setMostrarBotonReprocesados(true);
      } else {
        setMostrarBotonReprocesados(false);
      }
    } catch (e) {
      console.log(e);
    }
    if (result) {
      if (result.length > 0) {
        setListadoReprocesadoLinea(result);
      } else {
        if (getValues("cantidadReprocesos") > 0) {
          setMostrarMensajeReprocesados(true);
        } else setMostrarMensajeReprocesados(false);
      }
    }
  };

  return (
    <div style={sxStyles.edit}>
      {rechazados && (
        <div>
          <div className="hidden">
            <Impresion parentRef={componentRef} causa={causa} linea={linea} controlLote={controlLote} />
          </div>
          <div className="text-right space-x-3">
            {/* {mostrarMensajeReprocesados && (
              <Button size="small" variant="text" disabled>
                Fue aprobado manualmente por calidad.
              </Button>
            )} */}
            {mostrarBotonReprocesados && (
              <Button size="small" sx={sxStyles.textColor} variant="text" onClick={verReprocesados}>
                <RemoveRedEyeIcon />
                Reprocesados
              </Button>
            )}
            <Button size="small" sx={sxStyles.textColor} variant="text" onClick={handleEditar}>
              <EditIcon />
              Editar
            </Button>
            <Button size="small" variant="text" sx={sxStyles.textColor} onClick={handlePrint}>
              <PrintIcon />
              Imprimir
            </Button>
          </div>
          <form onSubmit={handleSubmit(handleGuardar)}>
            <div className="inline-grid sm:inline-flex  sm:gap-x-36 gap-x-10">
              {/* ----------------MODELO---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="codigoModelo"
                  control={control}
                  defaultValue={controlLote?.codigoModelo}
                  render={({ field }) => <TextField {...field} disabled variant="standard" label="Modelo" />}
                />
              </div>
              {/* ----------------NUMERO OP---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="numeroOp"
                  control={control}
                  defaultValue={controlLote?.numeroOp}
                  render={({ field }) => <TextField {...field} disabled variant="standard" label="Número de OP" />}
                />
              </div>
            </div>
            <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
              {/* ----------------SERIE DESDE---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="serieDesde"
                  control={control}
                  defaultValue={controlLote?.serieDesde}
                  render={({ field }) => (
                    <TextField
                      label="Nro Desde"
                      variant="standard"
                      {...field}
                      type="number"
                      inputProps={{ inputMode: "numeric", pattern: "[1-9]*" }}
                      disabled={editable}
                      error={errorIzq.length > 0}
                      helperText={errorIzq}
                      onChange={(e: any) => {
                        field.onChange(handleNroDesdeChange(parseInt(e.target.value, 10), false)); //acá teiene que devolver un string
                      }}
                    />
                  )}
                />
              </div>
              {/* ----------------SERIE HASTA---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="serieHasta"
                  control={control}
                  defaultValue={controlLote?.serieHasta}
                  render={({ field }) => (
                    <TextField
                      label="Nro Hasta"
                      variant="standard"
                      {...field}
                      type="number"
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      disabled={editable}
                      error={errorDerecha.length > 0}
                      helperText={errorDerecha}
                      onChange={(e: any) => {
                        field.onChange(handleNroDesdeChange(parseInt(e.target.value, 10), true)); //acá teiene que devolver un string
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
              {/* ----------------CANTIDAD RECHAZADOS---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="cantidadRechazos"
                  control={control}
                  defaultValue={controlLote?.cantidadRechazos}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      variant="standard"
                      inputProps={{ inputMode: "numeric", pattern: "[1-9]*" }}
                      disabled={editable}
                      label="Cantidad Rechazados"
                      error={errRechazados.length > 0}
                      helperText={errRechazados}
                      onChange={(e: any) => {
                        field.onChange(handleRechazoChange(parseInt(e.target.value, 10)));
                      }}
                    />
                  )}
                />
              </div>
              {/* ----------------CANTIDAD REPROCESADOS---------------*/}
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="cantidadReprocesos"
                  control={control}
                  defaultValue={controlLote?.cantidadReprocesos}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      variant="standard"
                      inputProps={{ inputMode: "numeric", pattern: "[1-9]*" }}
                      disabled={editable}
                      label="Cantidad Reprocesados"
                      error={errReprocesados.length > 0}
                      helperText={errReprocesados}
                      onChange={(e: any) => {
                        field.onChange(handleReprocesosChange(parseInt(e.target.value, 10)));
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="content-center mt-4 ">
              {/* ----------------CAUSA---------------*/}
              <FormControl sx={sxStyles.formControl} disabled={editable}>
                <InputLabel>Causa</InputLabel>
                <Controller
                  name="idEstadoLote"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={null}
                  render={({ field }) => (
                    <Select {...field} variant="standard">
                      {causaList &&
                        causaList.map((lote) => (
                          <MenuItem key={lote.idEstadoLote} value={lote.idEstadoLote}>
                            {lote.descripcion}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <div className=" sm:p-8">
              {/* ----------------CONTENIDO DEFECTUOSO---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="contenidoDefectuoso"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={controlLote?.contenidoDefectuoso}
                  render={({ field }) => (
                    <TextField
                      label="Contenido Defectuoso"
                      variant="standard"
                      {...field}
                      disabled={editable}
                      className="w-full"
                      autoComplete="off"
                    />
                  )}
                />
              </div>
              {/* ----------------ACCIÓN CORRECTIVA---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="accioncorrectiva"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={controlLote?.accioncorrectiva}
                  render={({ field }) => (
                    <TextField
                      label="Acción Correctiva"
                      variant="standard"
                      {...field}
                      disabled={editable}
                      className="w-full"
                      autoComplete="off"
                    />
                  )}
                />
              </div>
              {/* ----------------CAUSA RAÍZ---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="planmejora"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={controlLote?.planmejora}
                  render={({ field }) => (
                    <TextField
                      label="Contenido Defectuoso"
                      variant="standard"
                      {...field}
                      disabled={editable}
                      className="w-full"
                      autoComplete="off"
                    />
                  )}
                />
              </div>
              {/* ----------------OBSERVACIONES---------------*/}
              <div className="text-center sm:text-left p-2 w-full">
                <Controller
                  name="observaciones"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={controlLote?.observaciones}
                  render={({ field }) => (
                    <TextField
                      label="Observaciones"
                      variant="standard"
                      {...field}
                      disabled={editable}
                      className="w-full"
                      autoComplete="off"
                    />
                  )}
                />
              </div>
            </div>
          </form>

          <div className="w-full sm:mb-2">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className="text-base ">Reprocesos</Typography>
              </AccordionSummary>
              <AccordionDetails className="flex flex-col w-full p-0">
                {reprocesos?.length > 0 ? (
                  <ReprocesoLoteTable reprocesos={reprocesos} />
                ) : (
                  <AccordionDetails sx={sxStyles.responsive}>
                    <Typography className="text-base ">Sin reprocesos</Typography>
                  </AccordionDetails>
                )}
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="mt-3 space-x-10 sm:space-x-10">
            <Button
              disabled={disabled}
              className={buttonClasses.greenButton}
              variant="contained"
              onClick={handleGuardar}>
              Guardar
            </Button>
            <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={9}></Grid>
            <Grid item xs={3}>
              <Button
                className={buttonClasses.greenButton}
                variant="contained"
                onClick={(e) => {
                  setModalCargaMaterialesOpen(true);
                }}>
                Agregar Material
              </Button>
            </Grid>
          </Grid>
          {materiales && (
            <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew animate__animated animate__fadeInUp">
              <MateriablesTable materiales={materiales} refresh={getMateriales} />
            </div>
          )}
          {
            <ModalCompoment
              title="Agregar Material"
              openPopup={modalCargaMaterialesOpen}
              setOpenPopup={setModalCargaMaterialesOpen}>
              <MaterialesDialog
                numeroOp={getValues("numeroOp")}
                cantidadEquipos={getValues("serieHasta") - getValues("serieDesde") + 1}
                setSelectedMaterial={setSelectedMaterial}
                setOpenPopup={setModalCargaMaterialesOpen}
              />
            </ModalCompoment>
          }
          {planProduccion && (
            <ModalCompoment
              title="Reprocesados"
              openPopup={modalReprocesadosOpen}
              setOpenPopup={setModalReprocesadosOpen}>
              <ReprocesadosModal
                listado={listadoReprocesadoLinea}
                getValuesProp={getValues}
                prefijoPlanProd={planProduccion.ultimoNewsan}
                refreshList={getReprocesoLineaByControlLoteId}
                idControlLote={initialState.idControlLote}
              />
            </ModalCompoment>
          )}
        </div>
      )}
    </div>
  );
};
