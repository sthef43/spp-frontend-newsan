import React, { useEffect, useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { IPlanProd } from "app/models/IPlanProd";
import { useAppDispatch } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { IFamilia } from "app/models/IFamilia";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { OrganizacionSliceRequests } from "app/Middleware/reducers/OrganizacionSlice";
import { IOrganizacion } from "app/models/IOrganizacion";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { OpsTable } from "app/features/produccion/modals/OpsTable";

interface props {
  id: number;
  setModalEditOpen: (open: boolean) => void;
  callback: () => void;
}

export interface IPlanProdFormData {
  cantidad?: number | null;
  capacidad?: string | null;
  codigoModelo?: string | null;
  desde?: number | null;
  hasta?: number | null;
  idLinea?: number | null;
  lote?: string | null;
  numeroOp?: string | null;
  organizacion?: string | null;
  semiElaboradoId?: number | null;
  tipoSemiElaborado?: string;
  ultimoNewsan?: number | null;

  // Exclude opsMainDisplay from this type
}

export const ProduccionEditDialog = ({ id, setModalEditOpen, callback }: props): JSX.Element => {
  const { State: datosPlanProd } = useFetchApi<IPlanProd>(PlanProdSliceRequests.getByIdRequest, id);
  const { control, getValues, setValue, handleSubmit } = useForm<IPlanProdFormData>({
    defaultValues: datosPlanProd
  });

  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const [familia, setFamilia] = React.useState<IFamilia[]>([]); // lista de los lotes del genericos seleccionado
  const [ultimosLotes, setUltimosLotes] = React.useState<IPlanProd[]>([]); // lista de los ultimos lotes
  const [modalOpen, setModalOpen] = React.useState(false);
  const [opSeleccionada, setOpSeleccionada] = React.useState<IXXE_WIP_OT>(null);
  const [ops, setOps] = React.useState<IXXE_WIP_OT[]>([]); //lista de las OPs disponibles

  const handleCancelar = () => {
    setModalEditOpen(false);
  };

  const handleGuardar = async (data: IPlanProd) => {
    let actualizarPlanProd;
    const nuevoPlanProd: IPlanProd = JSON.parse(JSON.stringify(datosPlanProd));
    //EN CASO DE QUE EL TypeScript DE ERRRO COMENTAR ESTA PARTE
    nuevoPlanProd.codigoModelo = data.codigoModelo;
    nuevoPlanProd.lote = data.lote.trim();
    nuevoPlanProd.numeroOp = getValues("numeroOp");
    nuevoPlanProd.cantidad = getValues("cantidad");
    nuevoPlanProd.desde = getValues("desde");
    nuevoPlanProd.hasta = getValues("hasta");
    nuevoPlanProd.capacidad = getValues("capacidad");
    nuevoPlanProd.idLinea = getValues("idLinea");
    nuevoPlanProd.ultimoNewsan = getValues("ultimoNewsan");
    nuevoPlanProd.inicio = null;
    nuevoPlanProd.rechazados = null;
    nuevoPlanProd.semiElaboradoId = getValues("semiElaboradoId");
    nuevoPlanProd.tipoSemiElaborado = getValues("tipoSemiElaborado");
    nuevoPlanProd.organizacion = getValues("organizacion");
    nuevoPlanProd.idModelo = datosPlanProd.idModelo;
    // //EN CASO DE QUE EL TypeScript DE ERRRO COMENTAR ESTA PARTE
    delete nuevoPlanProd.linea;
    try {
      actualizarPlanProd = unwrapResult(await dispatch(PlanProdSliceRequests.putRequest(nuevoPlanProd)));
    } catch (error) {
      actualizarPlanProd = null;
    }
    if (actualizarPlanProd) {
      callback();
      setModalEditOpen(false);
      openNotificationUI("Datos del lote actualizados.", "success");
    } else {
      openNotificationUI("No se pudo actualizar el lote.", "error");
    }
  };

  //FETCH PARA TRAERME LOS GENERICOS DEL MODELO SELECCIONADO
  //Anterior
  // const getGenericos = async () => {
  //   const tipoUnidadQuery = datosPlanProd?.tipoUnidad;
  //   console.log("🚀 ~ file: ProduccionEditDialog.tsx ~ line 87 ~ getGenericos ~ tipoUnidadQuery", tipoUnidadQuery);

  //   if (tipoUnidadQuery) {
  //     let fetchGenericoResult: IGenerico[];
  //     try {
  //       fetchGenericoResult = unwrapResult(
  //         await dispatch(GenericoSliceRequests.getAllByTipoUnidadRequest(tipoUnidadQuery))
  //       );
  //     } catch (error) {
  //       fetchGenericoResult = null;
  //     }
  //     if (fetchGenericoResult) {
  //       setGenericos(fetchGenericoResult);
  //       console.log(
  //         "🚀 ~ file: ProduccionEditDialog.tsx ~ line 98 ~ getGenericos ~ fetchGenericoResult",
  //         fetchGenericoResult
  //       );
  //     }
  //   }
  // };
  //Nuevo que toma de familia
  const getFamilias = async () => {
    const tipoUnidadQuery = datosPlanProd?.tipoUnidad;
    if (tipoUnidadQuery) {
      try {
        const result = unwrapResult(await dispatch(FamiliaSliceRequests.getListByNombreRequest(tipoUnidadQuery)));
        setFamilia(result);
      } catch (error) {
        openNotificationUI("Error al leer familias.", "error");
      }
    }
  };

  const getUltimosLotes = async () => {
    let fetchUltimosLotesResult;
    if (datosPlanProd) {
      try {
        fetchUltimosLotesResult = unwrapResult(
          await dispatch(
            PlanProdSliceRequests.getPlanByLineaModelo({
              idLinea: datosPlanProd?.idLinea,
              modelo: datosPlanProd?.codigoModelo
            })
          )
        );
      } catch (error) {
        fetchUltimosLotesResult = null;
      }
      if (fetchUltimosLotesResult) {
        setUltimosLotes(fetchUltimosLotesResult);
      }
    }
  };

  // const getUltimoSerie = () => {
  //   const ultimosLotesAux = ultimosLotes.filter((lote) => lote.numeroOp !== "OP-SIN ASIGNAR");
  //   const resultado = ultimosLotesAux[ultimosLotesAux.length - 1]?.hasta + 1;
  //   return resultado;
  // };
  const getUltimoSerie = (): number => {
    const ultimoLote = ultimosLotes.find((lote) => lote.numeroOp !== "OP-SIN ASIGNAR");
    if (ultimoLote && ultimoLote.hasta) {
      return ultimoLote.hasta + 1;
    }
    return 1001; // Devuelve un valor por defecto o un número seguro si no se encuentra un lote.
  };

  const calcularSerieHasta = (cantidad: number, serieDesde: string) => {
    const resultado = cantidad + parseInt(serieDesde) - 1;
    return resultado;
  };

  const handleNumeroOpChange = (numeroOp: string) => {
    const op = ops.find((op) => op.wiP_ENTITY_NAME == numeroOp);
    if (op && ultimosLotes.length > 0) {
      setValue("desde", Number(getUltimoSerie()));
      setValue("hasta", calcularSerieHasta(getUltimoSerie(), op.starT_QUANTITY));
      setValue("cantidad", parseInt(op.starT_QUANTITY));
      setValue("numeroOp", numeroOp);
    } else {
      setValue("desde", 1001);
      setValue("hasta", getValues("desde") + parseInt(op.starT_QUANTITY));
      setValue("cantidad", parseInt(op.starT_QUANTITY));
      setValue("numeroOp", numeroOp);
    }
  };

  const getAllOps = async () => {
    let fetchOpResult: IXXE_WIP_OT[];
    try {
      fetchOpResult = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.getAllRequest(getValues("codigoModelo"))));
    } catch (error) {
      fetchOpResult = null;
    }
    if (fetchOpResult) {
      setOps(fetchOpResult);
    }
  };

  const handleOpSelect = () => {
    setModalOpen(true);
  };

  React.useEffect(() => {
    if (datosPlanProd !== null) {
      getFamilias();
      getAllOps();
      getUltimosLotes();
    }
  }, [datosPlanProd]);

  React.useEffect(() => {
    if (opSeleccionada !== null || opSeleccionada?.wiP_ENTITY_NAME === "") {
      handleNumeroOpChange(opSeleccionada?.wiP_ENTITY_NAME);
    }
  }, [opSeleccionada]);

  const [lineas, setLineas] = useState([]);
  const getLineas = async () => {
    const response = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    setLineas(response);
  };

  const [organizacion, setOrganizacion] = useState<IOrganizacion[] | null>(null);
  const getOrganizacion = async () => {
    const response = unwrapResult(await dispatch(OrganizacionSliceRequests.getAllRequest()));
    setOrganizacion(response);
  };

  useEffect(() => {
    getLineas();
    getOrganizacion();
  }, []);

  return (
    <div className="h-full">
      {datosPlanProd && (
        <div style={{ width: "70vw", textAlign: "center" }}>
          <form onSubmit={handleSubmit(handleGuardar)}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="inline-grid sm:inline-flex  sm:gap-x-36 gap-x-10">
                {/* ----------------MODELO---------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="codigoModelo"
                    control={control}
                    defaultValue={datosPlanProd?.codigoModelo}
                    render={({ field }) => <TextField variant="standard" label="Modelo" {...field} />}
                  />
                </div>
                {/* ----------------GENERICO---------------*/}
                {/* <div className="text-center sm:text-left p-2">
                  <FormControl style={{ minWidth: 185 }}>
                    <InputLabel>Genérico</InputLabel>
                    <Controller
                      name="capacidad"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={datosPlanProd.capacidad != null ? datosPlanProd?.capacidad.trim() : ""}
                      render={({ field }) => (
                        <Select {...field} variant="standard">
                          {genericos &&
                            genericos?.map((gen) => (
                              <MenuItem key={gen?.id} value={gen?.generico1.trim()}>
                                {gen?.codigo}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </div> */}
                {/* ---------------- FAMILIA ---------------*/}
                <div className="text-center sm:text-left p-2">
                  <FormControl style={{ minWidth: 185 }}>
                    <InputLabel>Familia</InputLabel>
                    <Controller
                      name="capacidad"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={datosPlanProd.capacidad != null ? datosPlanProd?.capacidad.trim() : ""}
                      render={({ field }) => (
                        <Select {...field} variant="standard">
                          {familia &&
                            familia?.map((gen) => (
                              <MenuItem key={gen?.id} value={gen?.nombre.trim()}>
                                {gen?.nombre}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </div>
                {/* ----------------LOTE---------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="lote"
                    control={control}
                    defaultValue={datosPlanProd?.lote}
                    render={({ field }) => <TextField variant="standard" label="Lote" {...field} />}
                  />
                </div>
              </div>
              <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
                {/* ----------------SERIE DESDE---------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="desde"
                    control={control}
                    defaultValue={datosPlanProd?.desde}
                    render={({ field }) => (
                      <TextField {...field} label="Serie Desde" type="number" variant="standard" />
                    )}
                  />
                </div>
                {/* ----------------SERIE HASTA---------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="hasta"
                    control={control}
                    defaultValue={datosPlanProd?.hasta}
                    render={({ field }) => (
                      <TextField {...field} label="Serie Hasta" type="number" variant="standard" />
                    )}
                  />
                </div>
                {/* ----------------CANTIDAD--------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="cantidad"
                    control={control}
                    defaultValue={datosPlanProd?.cantidad}
                    render={({ field }) => <TextField {...field} label="Cantidad" type="number" variant="standard" />}
                  />
                </div>
              </div>
              <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
                {/* ----------------NUMERO OP---------------*/}
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="numeroOp"
                    control={control}
                    defaultValue={datosPlanProd?.numeroOp}
                    render={({ field }) => <TextField {...field} variant="standard" label="Número de OP" />}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpSelect}
                    className={buttonClasses.blueButton}>
                    Seleccionar OP
                  </Button>
                </div>
                <div className="text-center sm:text-left p-2">
                  <Controller
                    name="ultimoNewsan"
                    control={control}
                    defaultValue={datosPlanProd?.ultimoNewsan}
                    render={({ field }) => <TextField {...field} variant="standard" label="Prefijo" />}
                  />
                </div>
              </div>
              <div className="inline-grid sm:inline-flex sm:gap-x-36 gap-x-10">
                <div className="text-center sm:text-left p-2" style={{ minWidth: 185 }}>
                  <Controller
                    name="idLinea"
                    control={control}
                    defaultValue={datosPlanProd?.idLinea}
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
                <div className="text-center sm:text-left p-2" style={{ minWidth: 185 }}>
                  <Controller
                    name="tipoSemiElaborado"
                    control={control}
                    defaultValue={datosPlanProd.tipoSemiElaborado}
                    render={({ field }) => <TextField {...field} variant="standard" label="Semielaborado IM" />}
                  />
                </div>
                <div className="text-center sm:text-left p-2" style={{ minWidth: 185 }}>
                  <Controller
                    name="organizacion"
                    control={control}
                    defaultValue={datosPlanProd?.organizacion}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth variant="outlined" error={!!error}>
                        <InputLabel variant="filled">Organización</InputLabel>
                        <Select {...field} variant="standard" className="pt-2">
                          {organizacion &&
                            organizacion.map((x) => (
                              <MenuItem key={x.id} value={x.nombre}>
                                <div className="w-full">
                                  <div>{x.nombre}</div>
                                </div>
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="inline-grid sm:inline-flex p-5">
              <div className="text-center sm:text-left p-5">
                <Button className={buttonClasses.greenButton} variant="contained" type="submit">
                  Guardar
                </Button>
              </div>
              <div className="text-center sm:text-left p-5">
                <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
      <ModalCompoment title="OPs Disponibles" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <OpsTable ops={ops} setOpenPopup={setModalOpen} setOpSeleccionada={setOpSeleccionada} />
      </ModalCompoment>
    </div>
  );
};
