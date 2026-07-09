/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { IHoraExtra } from "app/models/IHoraExtra";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { IAppUser, IEmailGroup, ITurno } from "app/models";
import { Button, FormControl, FormControlLabel, Switch, Tooltip } from "@mui/material";
import { ITurnoExtras } from "app/models/ITurnoExtras";
import { IHoraExtraTurnoExtras } from "app/models/IHoraExtraTurnoExtras";
import FetchApi from "app/shared/helpers/FetchApi";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { CloseRounded, DirectionsBus, EditRounded, RestaurantMenuRounded } from "@mui/icons-material";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import moment from "moment";
import { ITurnoExtrasLineaProduccion } from "app/models/ITurnoExtrasLineaProduccion";
import { useInputValidations } from "app/shared/hooks/useInputValidations";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { HoraExtraSliceRequests } from "app/Middleware/reducers/HoraExtraSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import _ from "lodash";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { HorasExtrasCargaEmails } from "./HorasExtrasCargaEmails";

interface IHorasExtrasForm {
  data?: IHoraExtra;
  edicionActiva: boolean;
  productoId: number;
  refresh: () => void;
  openModal: (state: boolean) => void;
}

export const HorasExtrasForm = ({
  data,
  refresh,
  openModal,
  edicionActiva,
  productoId
}: IHorasExtrasForm): JSX.Element => {
  const {
    handleSubmit,
    control,
    formState,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { errors, isValid }
  } = useForm();

  const turnos: ITurno[] = useAppSelector((state) => state.turno.dataAll);
  const appUser: IAppUser = useAppSelector((state) => state.appUser.data as IAppUser);

  const momento = moment();
  const fecha = momento.format("YYYY-MM-DD HH:mm:ss");
  const dispatch = useAppDispatch();
  const {
    validators: { isNumeric }
  } = useInputValidations(trigger);
  const { getConfirmation } = useConfirmationDialog();
  const { FetchPost } = useFetchApiMultiResults<IHoraExtra>();
  const { openNotificationUI } = useNotificationUI();

  const [openModalCargaEmails, setOpenModalCargaEmails] = useState<boolean>(false);

  const [turnosState, setTurnosState] = useState<ITurno[]>([]);

  const [listaLineasProduccion, setListaLineasProduccion] = useState<ILineaProduccion[]>([]);
  const [listaMailGroups, setListaMailGroups] = useState<IEmailGroup[]>([]);
  const [listaHorasExtras, setListaHorasExtras] = useState<ITurnoExtras[]>([]);

  const [listaHorasExtrasSeleccionadas, setListaHorasExtrasSeleccionadas] = useState<ITurnoExtras[]>([]);

  const [turno, setTurno] = useState<string | number>(
    edicionActiva ? data?.horaExtraTurnoExtras[0].turnoExtras.turnoId : 0
  );
  const [listaEmails, setListaEmails] = useState<string | number>("");

  FetchApi<IEmailGroup[]>(
    EmailGroupSliceRequests.getAllRequest,
    null,
    false,
    openModal,
    setListaMailGroups,
    true,
    false,
    false
  );

  FetchApi<ITurno[]>(
    TurnoSliceRequests.getAllWithRelationsRequest,
    null,
    false,
    null,
    setTurnosState,
    false,
    false,
    false
  );

  FetchApi<ILineaProduccion[]>(
    LineaProduccionSliceRequests.getAllByProductId,
    productoId,
    false,
    null,
    setListaLineasProduccion,
    false,
    false,
    false
  );

  const onSubmit = async (e) => {
    const horasExtras = generarHorasExtras(e);
    if (
      await getConfirmation(
        "Crear Horas Extras",
        "Se crearan las horas para el turno y se enviara un mail de aviso, ¿Desea continuar?"
      )
    ) {
      FetchPost(HoraExtraSliceRequests.PostRequest, horasExtras, false, async (response) => {
        const sendEmail = unwrapResult(await dispatch(EmailSliceRequest.SendMailHoraExtra(response)));
        if (sendEmail) {
          openNotificationUI("Horas extras agregadas correctamente", "success");
          refresh();
          openModal(false);
        } else {
          openNotificationUI("Horas extras agregadas correctamente pero no se pudo enviar el mail", "error");
        }
      });
    }
  };

  const setFecha = (fecha: string) => {
    setValue("fecha", fecha);
  };

  const filtarListaHorasExtras = () => {
    if (!edicionActiva) {
      const filtarTurnoSeleccionado = turnosState.find((elementos) => elementos.id == turno);
      setListaHorasExtras(filtarTurnoSeleccionado.turnoExtras);
    }
  };

  const seleccionarHorasExtras = (horaExtra: ITurnoExtras) => {
    if (!edicionActiva) {
      setListaHorasExtrasSeleccionadas((prev) => [...prev, horaExtra]);
    }
  };

  const eliminarHorasExtras = (indexToRemove: number) => {
    if (!edicionActiva) {
      for (let i = indexToRemove; i < listaHorasExtrasSeleccionadas.length - 1; i++) {
        setValue(`lineaProduccion-${i}`, getValues(`lineaProduccion-${i + 1}`));
        setValue(`cantidadPersonal-${i}`, getValues(`cantidadPersonal-${i + 1}`));
        setValue(`comedor-${i}`, getValues(`comedor-${i + 1}`));
        setValue(`transporte-${i}`, getValues(`transporte-${i + 1}`));
        setValue(`observaciones-${i}`, getValues(`observaciones-${i + 1}`));
      }
      const lastIndex = listaHorasExtrasSeleccionadas.length - 1;
      setValue(`lineaProduccion-${lastIndex}`, undefined);
      setValue(`cantidadPersonal-${lastIndex}`, "");
      setValue(`comedor-${lastIndex}`, false);
      setValue(`transporte-${lastIndex}`, false);
      setValue(`observaciones-${lastIndex}`, "");
      setListaHorasExtrasSeleccionadas((prev) => {
        return prev.filter((_, index) => index !== indexToRemove);
      });
    }
  };

  const setearValoresModoEdicion = () => {
    const horaTurnoExtras = data.horaExtraTurnoExtras;
    const listaTurnosExtras = data.horaExtraTurnoExtras.flatMap((elementos) => elementos.turnoExtras);

    setListaHorasExtras(_.uniqBy(listaTurnosExtras, "id"));
    setListaHorasExtrasSeleccionadas(listaTurnosExtras);

    const lineasAgrupadas = _.groupBy(data.horaExtraTurnoExtras, "horaExtraId");
    const listaGrupos = Object.values(lineasAgrupadas).flatMap((lineas) =>
      lineas.flatMap((item) => item.turnoExtrasLineaProduccion)
    );
    listaGrupos.forEach((item, index) => {
      const horaTurnoExtra = horaTurnoExtras.find((elementos) => elementos.id == item.horaExtraTurnoExtrasId);
      setValue(`lineaProduccion-${index}`, item.lineaProduccionId);
      setValue(`cantidadPersonal-${index}`, item.cantidad);
      setValue(`observaciones-${index}`, item.detalle);
      setValue(`comedor-${index}`, horaTurnoExtra?.comedor);
      setValue(`transporte-${index}`, horaTurnoExtra?.transporte);
    });
  };

  const generarHorasExtras = (data: any) => {
    const horas: IHoraExtra = {
      emailGroup: listaEmails as string,
      observacion: data.observacionGeneral,
      productoId: productoId,
      userName: `${appUser.operator.name} ${appUser.operator.surname}`,
      horaExtraTurnoExtras: generarListaTurnosExtras(data)
    };
    return horas;
  };

  const generarListaTurnosExtras = (data: any) => {
    const lineasProduccion = generarListaTurnosExtrasLineaProduccion(data);
    const nuevaListaExtras: IHoraExtraTurnoExtras[] = listaHorasExtrasSeleccionadas.map((horaExtra, index) => {
      const lineaCorrespondiente = lineasProduccion[index];
      return {
        comedor: data[`comedor-${index}`],
        transporte: data[`transporte-${index}`],
        turnoExtrasId: horaExtra.id as number,
        fecha: fecha,
        id: 0,
        turnoExtrasLineaProduccion: lineaCorrespondiente ? [lineaCorrespondiente] : []
      };
    });

    return nuevaListaExtras;
  };

  const generarListaTurnosExtrasLineaProduccion = (data: any): ITurnoExtrasLineaProduccion[] => {
    const nuevaListaExtras: ITurnoExtrasLineaProduccion[] = listaHorasExtrasSeleccionadas.map((_, index) => {
      return {
        lineaProduccionId: data[`lineaProduccion-${index}`],
        detalle: data[`observaciones-${index}`],
        horaExtraTurnoExtrasId: 0,
        cantidad: data[`cantidadPersonal-${index}`],
        id: 0
      };
    });
    return nuevaListaExtras;
  };

  useEffect(() => {
    setValue("comedor", false);
    setValue("transporte", false);
    if (edicionActiva) {
      setearValoresModoEdicion();
    }
  }, []);

  useEffect(() => {
    if (turno) {
      filtarListaHorasExtras();
    }
  }, [turno]);

  useEffect(() => {
    if (formState.errors?.observacion?.type == "required") {
      openNotificationUI("El formulario tiene errores, por favor verificar", "error");
    }
  }, [formState.errors]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90vw]">
        <section className="w-full flex flex-row">
          <div className="w-[70%] flex flex-col px-4 my-4">
            <p className="text-xl text-primaryNewOpacity font-semibold mb-3">INFORMACION GENERAL</p>
            <div className="flex flex-col">
              <p className="text-sm text-gray-400">Seleccionar grupo de emails</p>
              <div className="flex flex-row gap-x-4">
                <SelectComponent
                  disabled={edicionActiva}
                  control={control}
                  nameSelect="emailGroup"
                  listaObjetos={listaMailGroups}
                  activeRequired
                  inputLabel=""
                  valueLabel={(e) => e.name}
                  valueSelect={(e) => e.emails}
                  valueKey={(e) => e}
                  ValueSave={setListaEmails}
                />
                {listaEmails && (
                  <TooltipComponent
                    titleTooltip="Agregar Emails"
                    typeTooltip="normal"
                    componenteIcono={<EditRounded color="primary" />}
                    onClick={() => setOpenModalCargaEmails(true)}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex flex-col my-2">
              <p className="text-sm text-gray-400">Fecha solicitada</p>
              <SelectOfDate stylesForSelects="outlined" pickFecha setFechaProps={setFecha} deactivateLabel />
            </div>
            <p className="text-sm text-gray-400 text-start w-full">Turno</p>
            <SelectComponent
              control={control}
              nameSelect="turno"
              listaObjetos={turnosState}
              activeRequired
              inputLabel=""
              defaultValue={edicionActiva ? data?.horaExtraTurnoExtras[0].turnoExtras.turnoId : 0}
              disabled={edicionActiva}
              valueLabel={(e) => e.nombre}
              valueSelect={(e) => e.id}
              valueKey={(e) => e}
              ValueSave={setTurno}
            />
            <div className="w-full flex flex-col my-2">
              <p className="text-sm text-gray-400 text-start w-full">Observaciones</p>
              <TextFieldComponent
                index={0}
                control={control}
                labelInput=""
                nameInput={`observacionGeneral`}
                valueDefault={edicionActiva ? data.observacion : ""}
                disabled={edicionActiva}
                requiredBool
                errors={errors}
              />
            </div>
          </div>
          <ContainerForPages
            optionsLayout="personalized"
            activeEffectVisible
            classNamePersonalized="w-full flex flex-col gap-y-2 px-4 my-4">
            <p className="text-xl text-primaryNewOpacity font-semibold mb-3">HORARIOS Y SELECCION DE TURNOS</p>
            {listaHorasExtras && listaHorasExtras.length > 0 && (
              <ContainerForPages
                optionsLayout="personalized"
                activeEffectVisible
                classNamePersonalized="flex flex-col items-center">
                <div className="flex flex-row bg-backgroundModalAudit p-6 rounded-2xl flex-wrap mt-2 w-full justify-between">
                  {listaHorasExtras.map((elementos, index) => {
                    const clickCount = listaHorasExtrasSeleccionadas.filter((item) => item.id === elementos.id).length;
                    return (
                      <div
                        onClick={() => seleccionarHorasExtras(elementos)}
                        key={index}
                        className={`relative flex flex-row group transition-all duration-100 cursor-pointer ${
                          listaHorasExtrasSeleccionadas.some((item) => item.id === elementos.id)
                            ? "bg-primaryNewOpacity rounded-2xl text-white border-[3px] border-blue-600/55"
                            : "border-[3px] border-gray-400 rounded-2xl"
                        }`}>
                        <p className="text-base text-gray-900 w-full rounded-xl px-6 py-2 group-hover:bg-primaryNewOpacity group-hover:text-white group-hover:border-primaryNewOpacity transition-all duration-300">
                          {elementos.desdeHora.slice(0, 5)} - {elementos.hastaHora.slice(0, 5)}
                        </p>
                        {clickCount > 1 && (
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold border border-white shadow z-10">
                            {clickCount}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ContainerForPages>
            )}
          </ContainerForPages>
        </section>
        <section className="w-full flex flex-col px-4 my-4">
          <p className="text-xl text-primaryNewOpacity font-semibold mb-3">DETALLE DE PRODUCCION POR TURNOS</p>
          <div className="flex flex-col gap-y-4">
            {listaHorasExtrasSeleccionadas.map((elementos, index) => {
              const turno = turnosState.find((turno) => turno.id === elementos.turnoId);
              return (
                <div key={index} className="w-full">
                  <header className="flex flex-row items-center justify-between gap-x-2 bg-backgroundModalAudit rounded-t-2xl p-3">
                    <div className="flex flex-row gap-x-2">
                      <p>TURNO {turno?.nombre}:</p>
                      <p>
                        {elementos.desdeHora.slice(0, 5)} - {elementos.hastaHora.slice(0, 5)}
                      </p>
                    </div>
                    <Button onClick={() => eliminarHorasExtras(index)}>
                      <CloseRounded color="error" />
                    </Button>
                  </header>
                  <div className="w-full flex flex-row justify-between p-4 bg-backgroundHorasExtrasSelect rounded-b-2xl border-b-2 border-x-2 border-[#D2F2E7] gap-x-4">
                    <div className="w-full flex flex-col">
                      <p className="text-sm text-gray-400 mb-2">Linea de produccion</p>
                      <SelectComponent
                        listaObjetos={listaLineasProduccion}
                        control={control}
                        inputLabel=""
                        nameSelect={`lineaProduccion-${index}`}
                        disabled={edicionActiva}
                        valueKey={(e) => e}
                        valueLabel={(e) => e.nombre}
                        valueSelect={(e) => e.id}
                        activeRequired
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <p className="text-sm text-gray-400 mb-2">Cant. Personal</p>
                      <TextFieldComponent
                        index={index}
                        control={control}
                        labelInput=""
                        disabled={edicionActiva}
                        validacionAdicionales={isNumeric("Solo se deben ingresar numeros")}
                        nameInput={`cantidadPersonal-${index}`}
                        valueDefault=""
                        requiredBool
                        errors={errors}
                      />
                    </div>
                    <div className="w-[75%] flex flex-col justify-start">
                      <p className="text-sm text-gray-400 mb-4">Servicios Requeridos</p>
                      <div className="w-full flex">
                        <div className="flex flex-row items-center gap-x-4">
                          <Tooltip title="Comedor">
                            <RestaurantMenuRounded
                              fontSize="large"
                              sx={{
                                backgroundColor: watch(`comedor-${index}`)
                                  ? "var(--primary-color)"
                                  : "var(--background-modal-audit)",
                                fill: watch(`comedor-${index}`)
                                  ? "var(--background-modal-audit)"
                                  : "var(--primary-color)",
                                transition: "all 0.3s ease",
                                borderRadius: "6px",
                                padding: "2px"
                              }}
                            />
                          </Tooltip>
                          <Controller
                            name={`comedor-${index}`}
                            control={control}
                            defaultValue={false}
                            disabled={edicionActiva}
                            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                              <FormControl>
                                <FormControlLabel
                                  label=""
                                  control={
                                    <Switch
                                      size="medium"
                                      {...field}
                                      checked={!!value}
                                      onChange={(e) => onChange(e.target.checked)}
                                    />
                                  }
                                />
                                {!!error && <p className="text-red-500 text-sm">{error.message}</p>}
                              </FormControl>
                            )}
                          />
                        </div>
                        <div className="flex flex-row items-center gap-x-4">
                          <Tooltip title="Transporte">
                            <DirectionsBus
                              fontSize="large"
                              sx={{
                                backgroundColor: watch(`transporte-${index}`)
                                  ? "var(--primary-color)"
                                  : "var(--background-modal-audit)",
                                fill: watch(`transporte-${index}`)
                                  ? "var(--background-modal-audit)"
                                  : "var(--primary-color)",
                                transition: "all 0.3s ease",
                                borderRadius: "6px",
                                padding: "2px"
                              }}
                            />
                          </Tooltip>
                          <Controller
                            name={`transporte-${index}`}
                            control={control}
                            defaultValue={false}
                            disabled={edicionActiva}
                            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                              <FormControl>
                                <FormControlLabel
                                  label=""
                                  control={
                                    <Switch
                                      size="medium"
                                      {...field}
                                      checked={!!value}
                                      onChange={(e) => onChange(e.target.checked)}
                                    />
                                  }
                                />
                                {!!error && <p className="text-red-500 text-sm">{error.message}</p>}
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-col">
                      <p className="text-sm text-gray-400 mb-2">Observaciones</p>
                      <TextFieldComponent
                        index={index}
                        control={control}
                        labelInput=""
                        disabled={edicionActiva}
                        nameInput={`observaciones-${index}`}
                        valueDefault=""
                        requiredBool
                        errors={errors}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <div className="w-full flex justify-end mt-4">
          <FormButtons
            onCancel={() => openModal(false)}
            disabled={!isValid || listaHorasExtrasSeleccionadas.length === 0 || edicionActiva}
            submitName="Enviar Mail"
          />
        </div>
      </form>
      <ModalCompoment
        openPopup={openModalCargaEmails}
        setOpenPopup={setOpenModalCargaEmails}
        title="Carga de emails"
        titleModalStyle="Audit"
        subTitle="Agregar nuevos mails aparte de la lista"
        showModalCenterPage>
        <HorasExtrasCargaEmails
          openModal={openModalCargaEmails}
          setOpenModal={setOpenModalCargaEmails}
          grupoSeleccionado={listaEmails as string}
          setGrupoSeleccionado={setListaEmails}
        />
      </ModalCompoment>
    </>
  );
};
