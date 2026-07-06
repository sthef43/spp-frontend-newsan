/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, IconButton } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { CtrlPlacasHallazgosSliceRequests } from "app/Middleware/reducers/CtrlPlacasHallazgosSlice";
import { TrazaOperacionesSliceRequests, TrazaOperacionSlice } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { RegistrarHallazgoForm } from "app/features/calidad/modules/registroMuestrasPlacas/Modal/RegistrarHallazgoForm";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { IAppUser, IPlant } from "app/models";
import { CtrlPlacasSliceRequests } from "app/Middleware/reducers/CtrlPlacasSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { ICtrlPlacasTipoMuestra } from "app/models/ICtrlPlacasTipoMuestra";
import { CtrlPlacasTipoMuestraSliceRequest } from "app/Middleware/reducers/CtrlPlacasTipoMuestraSlice";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { ICtrlPlacasHallazgos } from "app/models/ICtrlPlacasHallazgos";
import { Tooltip } from "@mui/material";
import { AddRounded, KeyboardArrowDownRounded } from "@mui/icons-material";
import {
  TrazaUnit_History2Slice,
  TrazaUnit_History2SliceRequests
} from "app/Middleware/reducers/TrazaUnit_History2Slice";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { TrazaUnit_History } from "app/models/ITrazaUnit_History";
import { ICtrlPlacas } from "app/models/ICtrlPlacas";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { RegistrarTipoMuestraForm } from "./RegistrarTipoMuestraForm";

interface props {
  setOpenPopup?: any;
  editState?: any;
  refresh?: any;
  openModal?: boolean;
}

export const RegistrarMuestraPlacaForm = ({ setOpenPopup, editState, refresh, openModal }: props) => {
  const { control, setValue, getValues, handleSubmit, watch, formState, setFocus, resetField, trigger } = useForm();
  const { isDirty, isValid, errors } = formState;

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const listaMuestras = useAppSelector((state) => state.ctrlPlacasTipoMuestra.dataAll);
  const listaHallazgos = useAppSelector((state) => state.ctrlPlacasHallazgo.dataAll);
  const trazaPlaca = useAppSelector((state) => state.trazaOperacion.object as TrazaOperaciones);
  const trazaHunitaria = useAppSelector((state) => state.trazaUnitHistory.dataAll as TrazaUnit_History[]);
  const planta = useAppSelector((state) => state.plant.object as IPlant);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { getConfirmation } = useConfirmationDialog();

  //Nuevo Hallazgo
  const [nuevoHallazgo, setNuevoHallazgo] = useState(false);
  //Nuevo Tipo Muestra
  const [nuevoTipoMuestra, setNuevoTipoMuestra] = useState(false);

  const [muestraSeleccionado, setMuestraSeleccionada] = useState<string | number>(0);
  const [hallazgoSeleccionado, setHallazgoSeleccionado] = useState<string | number>(0);

  FetchApi<ICtrlPlacasTipoMuestra[]>(
    CtrlPlacasTipoMuestraSliceRequest.getAllRequest,
    null,
    false,
    openModal,
    null,
    true
  );

  FetchApi<ICtrlPlacasHallazgos[]>(CtrlPlacasHallazgosSliceRequests.getAllRequest, null, false, openModal, null, true);

  //Guardar
  const [despuesGuardar, setdespuesGuardar] = useState(false);
  const onSubmit = async (e) => {
    const nuevoMuestreo = generarMuestreo(e);
    let result;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      result = unwrapResult(await dispatch(CtrlPlacasSliceRequests.PostRequest(nuevoMuestreo)));
      if (result) {
        openNotificationUI("Se registro el muestreo con exito!", "success");
        refresh();
        dispatch(TrazaOperacionSlice.actions.setTrazaPlaca(null));
        dispatch(TrazaUnit_History2Slice.actions.setRecorridoPlaca(null));
        setdespuesGuardar(true);
        setOpenPopup(false);
      }
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      result = null;
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //Buscar código
  const [listTrazaOperaciones, setListTrazaOperaciones] = useState([]);
  const getListTrazaOperaciones = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll(".MuiFormControl");
      const inputActual = inputs[index]?.querySelector("input") as HTMLInputElement | null;
      if (inputActual) {
        try {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          const esValido = await trigger(inputActual.name);
          if (!esValido) {
            inputActual.select();
            openNotificationUI("Codigo invalido", "error");
            return;
          } else {
            const response = unwrapResult(
              await dispatch(TrazaOperacionesSliceRequests.GetByCodigoAllDatesOfTrace(inputActual.value))
            );
            if (response) {
              const responseRecorrido = unwrapResult(
                await dispatch(TrazaUnit_History2SliceRequests.GetAllRouteOfTraceWithId(response.id))
              );
              if (responseRecorrido) {
                dispatch(TrazaOperacionSlice.actions.setTrazaPlaca(response));
                dispatch(TrazaUnit_History2Slice.actions.setRecorridoPlaca(responseRecorrido));
              }
            } else {
              inputActual.select();
              openNotificationUI("No se encontro un registro con este codigo", "error");
              return;
            }
          }
        } catch (error) {
          console.log(error);
          openNotificationUI("Se genero un error intentando buscar el codigo de traza", "error");
        } finally {
          dispatch(LoadingUISlice.actions.LoadingUIClose());
        }
      }
    }
  };

  const visualizate = async () => {
    if (listTrazaOperaciones && listTrazaOperaciones.length > 0) {
      console.log(listTrazaOperaciones[0].semiElaborado);
      setValue("semiElaborado", listTrazaOperaciones[0].semiElaborado);
      setValue("modelo", listTrazaOperaciones[0].modelo);
    } else {
      setValue("semiElaborado", "");
      setValue("modelo", "");
      setFocus("codigoInit");
    }
  };

  const generarMuestreo = (e) => {
    const objectSubmit: ICtrlPlacas = {
      plantId: planta.id,
      lineaProduccionId: trazaPlaca.lineaProduccionId,
      appUserId: infoUser.id,
      ctrlPlacasHallazgosId: hallazgoSeleccionado == 0 ? null : (hallazgoSeleccionado as number),
      semiElaborado: trazaPlaca.semiElaborado,
      modelo: trazaPlaca.modelo,
      codigoInit: trazaPlaca.codigoInit,
      estado: hallazgoSeleccionado == 0 ? true : false,
      detalle: e.detallePlaca ? e.detallePlaca : "-",
      ctrlPlacasTipoMuestraId: muestraSeleccionado as number
    };
    return objectSubmit;
  };

  //Propiedades de la tabla
  const renderModelo = () => {
    if (trazaPlaca) {
      return `${trazaPlaca.modelo}`;
    } else {
      return `mal`;
    }
  };

  const renderFamilia = () => {
    if (trazaPlaca) {
      return `${trazaPlaca.familia}`;
    } else {
      return `mal`;
    }
  };

  const renderSemielaborado = () => {
    if (trazaPlaca) {
      return `${trazaPlaca.semiElaborado}`;
    } else {
      return `mal`;
    }
  };

  const renderFechaHora = (row: TrazaOperaciones) => {
    return `${formatDateHourOrMinutes({
      optionDate: "fullDate",
      optionHour: "fechaBaseDatos",
      fechaIngresada: row.createdDate
    })}`;
  };

  //Visualizar para agregar
  const [verHallazgo, setVerHallazgo] = useState(true);
  const getVerHallazgo = () => {
    setVerHallazgo(!verHallazgo);
  };

  useEffect(() => {
    if (despuesGuardar) {
      resetField("codigoInit");
      resetField("semiElaborado");
      resetField("modelo");
      resetField("detalle");
      setVerHallazgo(true);
      setFocus("codigoInit");
      setdespuesGuardar(false);
    }
  }, [despuesGuardar]);

  useEffect(() => {
    visualizate();
  }, [listTrazaOperaciones]);

  //Watch
  const watchCodigoInit = watch("codigoInit");
  useEffect(() => {
    if (watchCodigoInit) {
      setValue("semiElaborado", "");
      setValue("modelo", "");
    }
  }, [watchCodigoInit]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form style={{ width: "100%", height: "100%" }}>
        {/* <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", height: "100%" }}> */}
        <div className="flex flex-row items-center gap-x-4">
          <SelectComponent
            inputLabel="Seleccione el tipo de muestra"
            listaObjetos={listaMuestras}
            nameSelect="tipoMuestra"
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            control={control}
            ValueSave={setMuestraSeleccionada}
            defaultValue={editState ? editState.tipoMuestraId : muestraSeleccionado}
            valueKey={(value) => value}
            estilosPersonalizados={{
              backgroundColor: "var(--background-color)",
              boxShadow: "var(--shadow-box)",
              borderRadius: "0px"
            }}
            iconoPerzonlizado={KeyboardArrowDownRounded}
          />
          <div>
            <Button className={`${classes.purpleButton} size-10 rounded-full min-w-[40px]`}>
              <Tooltip title="Agregar nueva muestra">
                <IconButton
                  onClick={() => {
                    setNuevoTipoMuestra(true);
                  }}
                  size="small"
                  style={{ position: "relative" }}>
                  <AddRounded sx={{ fill: "white", fontSize: "2rem" }} />
                </IconButton>
              </Tooltip>
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-start w-full justify-start gap-x-40 mt-6">
          <div className="flex flex-col items-start w-[35%]">
            <p className="mb-4">Escaenar código de placa</p>
            <TextFieldComponent
              control={control}
              index={0}
              nameInput="codigoPlaca"
              labelInput=""
              valueDefault=""
              requiredBool
              errors={errors}
              typeDate="text"
              typeInput="standard"
              onKeyUpFunction
              onKeyUp={getListTrazaOperaciones}
            />
          </div>
          <div className="flex flex-col items-start">
            <p className="mb-2">Estado de placa</p>
            <div className="flex flex-row items-center gap-x-4">
              <div className="flex flex-row gap-x-2 items-center">
                {trazaPlaca && trazaPlaca ? (
                  <span
                    className={`${
                      trazaPlaca.unidades.find((elementos) => elementos.rechazado === true)
                        ? "bg-gray-400/70"
                        : "bg-green-400"
                    } block size-10 rounded-full`}></span>
                ) : (
                  <span className="bg-gray-400/70 block size-10 rounded-full"></span>
                )}
                <p>GOOD</p>
              </div>
              <div className="flex flex-row gap-x-2 items-center">
                {trazaPlaca && trazaPlaca ? (
                  <span
                    className={`${
                      trazaPlaca.unidades.some((elementos) => elementos.rechazado === true)
                        ? "bg-red-400"
                        : "bg-gray-400/70"
                    } block size-10 rounded-full`}></span>
                ) : (
                  <span className="bg-gray-400/70 block size-10 rounded-full"></span>
                )}
                <p>NO GOOD</p>
              </div>
            </div>
          </div>
        </div>
        {trazaHunitaria && trazaHunitaria.length > 0 && (
          <div className="mt-6 bg-background p-4">
            <p className="mb-4">Recorrido</p>
            <div>
              <TableComponent
                IDcolumn="id"
                dataInfo={trazaHunitaria}
                columns={[
                  {
                    title: "Puesto",
                    field: "lineaPuesto.puesto.nombre"
                  },
                  {
                    title: "Modelo",
                    field: "",
                    render: () => renderModelo()
                  },
                  {
                    title: "Familia",
                    field: "",
                    render: () => renderFamilia()
                  },
                  {
                    title: "Semielaborado",
                    field: "",
                    render: () => renderSemielaborado()
                  },
                  {
                    title: "Fecha y Hora",
                    field: "",
                    render: (row: TrazaOperaciones) => renderFechaHora(row)
                  }
                ]}
              />
            </div>
          </div>
        )}
        <div className="flex flex-row items-end justify-between w-full mt-4">
          <div className="flex flex-col items-start w-[40%]">
            <p className="mb-1">Agregar detalle</p>
            <TextFieldComponent
              control={control}
              index={1}
              labelInput=""
              nameInput="detallePlaca"
              valueDefault=""
              estilosPersonalizados={{
                backgroundColor: "var(--background-color)",
                boxShadow: "var(--shadow-box)",
                borderRadius: "0px"
              }}
            />
          </div>
          <div className="flex flex-row items-center gap-x-4 w-[40%]">
            <SelectComponent
              inputLabel="Agregar hallazgo"
              listaObjetos={listaHallazgos}
              nameSelect="hallazgo"
              valueLabel={(value) => value.descripcion}
              valueSelect={(value) => value.id}
              control={control}
              valueKey={(value) => value}
              ValueSave={setHallazgoSeleccionado}
              estilosPersonalizados={{
                backgroundColor: "var(--background-color)",
                boxShadow: "var(--shadow-box)",
                borderRadius: "0px"
              }}
              iconoPerzonlizado={KeyboardArrowDownRounded}
            />
            <Button className={`${classes.purpleButton} size-10 rounded-full min-w-[42px]`}>
              <Tooltip title="Agregar nuevo hallazgo">
                <IconButton
                  onClick={() => {
                    setNuevoHallazgo(true);
                  }}
                  size="small"
                  style={{ position: "relative" }}>
                  <AddRounded sx={{ fill: "white", fontSize: "2rem" }} />
                </IconButton>
              </Tooltip>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="mt-4">
            <Button
              disabled={!isValid || muestraSeleccionado == 0}
              className={classes.greenButton}
              onClick={handleSubmit(onSubmit)}
              type="button"
              variant="contained">
              Guardar
            </Button>
          </div>
          <div className=" m-4 ">
            <Button
              className={classes.redButton}
              type="button"
              variant="contained"
              onClick={() => {
                dispatch(TrazaOperacionSlice.actions.setTrazaPlaca(null));
                dispatch(TrazaUnit_History2Slice.actions.setRecorridoPlaca(null));
                setOpenPopup(false);
              }}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
      <ModalCompoment title="Nuevo Hallazgo" openPopup={nuevoHallazgo} setOpenPopup={setNuevoHallazgo}>
        <RegistrarHallazgoForm setOpenPopup={setNuevoHallazgo} />
      </ModalCompoment>
      <ModalCompoment
        title="Nuevo Tipo De Muestra"
        openPopup={nuevoTipoMuestra}
        setOpenPopup={setNuevoTipoMuestra}
        showButtons
        functionButtonSave={() => {
          setNuevoTipoMuestra(false);
        }}>
        <RegistrarTipoMuestraForm openModal={nuevoTipoMuestra} setOpenModal={setNuevoTipoMuestra} />
      </ModalCompoment>
    </div>
  );
};
