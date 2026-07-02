/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { Autocomplete, Collapse, FormControl, TextField } from "@mui/material";
import { IRechazoDobladora } from "../Models/IRechazoDobladora";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { RechazoDobladoraSliceRequest } from "../Middleware/RechazoDobladoraSlice";
import { IAppUser, IEmailGroup, ILinea } from "app/models";
import { UseGeneratorCodesForLabels } from "app/shared/hooks/useGeneratorCodesForLabels";
import { IDobladora } from "app/models/IDobladora";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { DobladoraSliceRequest } from "app/Middleware/reducers/DobladoraSlice";
import { DobMaestroPiezaliceRequests } from "app/Middleware/reducers/DobMaestroPiezaSlice";
import { IDobMaestroPieza } from "app/models/IDobMaestroPieza";
import { InputsForm } from "../Components/InputsForm";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ListaArchivosModal } from "./ListaArchivosModal";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  edicionActiva: boolean;
  rechazoSeleccionado: IRechazoDobladora;
  refreshList: () => void;
}

interface IFormInputs {
  lineaId: number;
  dobladoraId: number;
  cantidadRechazada: number;
  emailGroupId: number;
  familia: string;
  articulo: string;
  descripcionRechazoSupervisor: string;
  lpn: string;
  multiplesCausas: string[];
  multiplesDescripcionRechazo: string[];
  accionContencion: string;
  accionCorrectiva: string;
  descripcionRechazoOperador: string;
}

const defaultValues: IFormInputs = {
  lineaId: 0,
  dobladoraId: 0,
  emailGroupId: 0,
  cantidadRechazada: 0,
  familia: "",
  articulo: "",
  lpn: "",
  multiplesCausas: [],
  multiplesDescripcionRechazo: [],
  accionContencion: "",
  accionCorrectiva: "",
  descripcionRechazoOperador: "",
  descripcionRechazoSupervisor: ""
};

/**
 * Modal que orquesta la creación y edición de rechazos.
 * Contiene la lógica para seleccionar línea, dobladora, familia, artículo y luego mostrar el formulario de inputs.
 */
export const RangoRechazosModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  edicionActiva,
  rechazoSeleccionado,
  refreshList
}) => {
  const methods = useForm<IFormInputs>({
    defaultValues: edicionActiva
      ? {
          ...defaultValues,
          ...rechazoSeleccionado,
          multiplesDescripcionRechazo: rechazoSeleccionado.multiplesDescripcionRechazo.split(","),
          multiplesCausas: rechazoSeleccionado.multiplesCausas.split(","),
          descripcionRechazoSupervisor: rechazoSeleccionado.descripcionRechazoOperador
        }
      : defaultValues
  });
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid }
  } = methods;

  /**
   * Información del usuario
   * Usamos el selector de useAppSelector para obtener la información del usuario que inicio sesión
   */
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  /**
   * Dispatch
   */
  const dispatch = useAppDispatch();

  /**
   * Hooks
   */
  const { openNotificationUI } = useNotificationUI();
  const { generateLpnWitPrefixCode } = UseGeneratorCodesForLabels();
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  /**
   * Listas de datos
   */
  const [listaLineas, setListaLineas] = useState<ILinea[]>([]);
  const [listaDobladoras, setListaDobladoras] = useState<IDobladora[]>([]);
  const [listaFamilias, setListaFamilias] = useState<string[]>([]);
  const [listaArticulos, setListaArticulos] = useState<string[]>([]);
  const [descripcionCanio, setDescripcionCanio] = useState<IDobMaestroPieza>();
  const [listaGrupoMails, setListaGrupoMails] = useState<IEmailGroup[]>([]);

  const watchLinea = watch("lineaId");

  /**
   * Archivo seleccionado
   */
  const [file, setFile] = useState<File[]>([]);

  /**
   * Estados
   */
  const [openModalExaminarImagen, setOpenModalExaminarImagen] = useState<boolean>(false);

  /**
   * Familia seleccionada
   */
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<string | number>(
    edicionActiva ? rechazoSeleccionado.familia : ""
  );

  /**
   * Artículo seleccionado
   */
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<string | number>(
    edicionActiva ? rechazoSeleccionado.articulo : ""
  );

  /**
   * Obtiene la lista de líneas.
   */
  FetchApi<ILinea[]>(
    LineaSliceRequests.GetListByTipoProduccion,
    "Canios",
    false,
    openModal,
    setListaLineas,
    true,
    false,
    false
  );

  /**
   * Obtiene la lista de dobladoras.
   */
  FetchApi<IDobladora[]>(
    DobladoraSliceRequest.getAllRequest,
    null,
    false,
    openModal,
    setListaDobladoras,
    true,
    false,
    false
  );

  /**
   * Obtiene la lista de familias.
   */
  FetchApi<string[]>(
    DobMaestroPiezaliceRequests.GetAllGenericList,
    null,
    false,
    openModal,
    setListaFamilias,
    true,
    false,
    false
  );

  /**
   * Obtiene la lista de artículos por familia.
   * @param familiaSeleccionada Familia seleccionada
   */
  FetchApi<IDobMaestroPieza[]>(
    DobMaestroPiezaliceRequests.GetListByGenerico,
    familiaSeleccionada,
    false,
    familiaSeleccionada as string,
    null,
    true,
    false,
    false,
    (response) => {
      const listaArticulos: string[] = response.map((item) => item.articulo);
      setListaArticulos(listaArticulos);
    }
  );

  /**
   * Obtiene la descripción del canio seleccionado.
   * @param articuloSeleccionado Artículo seleccionado
   */
  FetchApi<IDobMaestroPieza>(
    DobMaestroPiezaliceRequests.GetByArticulo,
    articuloSeleccionado,
    false,
    articuloSeleccionado as string,
    setDescripcionCanio,
    true,
    false,
    false
  );

  /**
   * Obtiene la lista de grupos de correo.
   */
  FetchApi<IEmailGroup[]>(
    EmailGroupSliceRequests.getAllRequest,
    null,
    false,
    openModal,
    setListaGrupoMails,
    true,
    false,
    false
  );

  /**
   * Envía los datos del formulario al servidor tanto para creación como para edición.
   * @param data Datos recolectados por React Hook Form
   */
  const onSubmit = (data: IFormInputs) => {
    const rechazoGeneral: IRechazoDobladora = edicionActiva ? actualizarRechazo(data) : generarRechazo(data);
    if (!edicionActiva) {
      FetchPost(
        RechazoDobladoraSliceRequest.PostNewRegister,
        { entidad: rechazoGeneral, file: file },
        true,
        async (response) => {
          const rechazoGeneral = response as IRechazoDobladora;
          const responseMail = unwrapResult(await dispatch(EmailSliceRequest.SendEmailRechazoCanios(rechazoGeneral)));
          if (responseMail) {
            openNotificationUI("Rechazo guardado correctamente", "success");
            refreshList();
            setOpenModal(false);
          }
        }
      );
    } else {
      FetchPut({
        consoleLog: false,
        modelPut: rechazoGeneral,
        sliceRequest: RechazoDobladoraSliceRequest.PutRequest,
        activeConfirmation: true,
        mensajePersonalizado: true,
        messageUser: "Desea actualizar el rechazo?",
        titleUser: "Actualizar rechazo",
        functionAdd: () => {
          refreshList();
          setOpenModal(false);
          openNotificationUI("Rechazo actualizado correctamente", "success");
        }
      });
    }
  };

  /**
   * Genera un nuevo rechazo con los datos del formulario.
   * @param data Datos recolectados por React Hook Form
   * @returns Objeto IRechazoDobladora con los datos del rechazo
   */
  const generarRechazo = (data: IFormInputs): IRechazoDobladora => {
    const lpn = generateLpnWitPrefixCode(7, "NCDP");
    const rechazo: IRechazoDobladora = {
      cantidadRechazada: data.cantidadRechazada,
      multiplesCausas: data.multiplesCausas.join(","),
      accionContencion: data.accionContencion,
      accionCorrectiva: data.accionCorrectiva,
      multiplesDescripcionRechazo: data.multiplesDescripcionRechazo.join(","),
      lpn: data.lpn,
      codigoQr: lpn,
      emailGroupId: data.emailGroupId,
      operatorId: infoUser.operatorId,
      familia: data.familia,
      articulo: data.articulo,
      descripcionCanio: data.descripcionRechazoSupervisor,
      lineaId: data.lineaId,
      dobladoraId: data.dobladoraId,
      descripcionRechazoOperador: data.descripcionRechazoOperador,
      causaRaizId: 0,
      descripcionRechazoId: 0
    };
    return rechazo;
  };

  /**
   * Actualiza un rechazo existente con los datos del formulario.
   * @param data Datos recolectados por React Hook Form
   * @returns Objeto IRechazoDobladora con los datos del rechazo actualizado
   */
  const actualizarRechazo = (data: IFormInputs): IRechazoDobladora => {
    const actualizacion: IRechazoDobladora = {
      ...rechazoSeleccionado,
      cantidadRechazada: data.cantidadRechazada,
      multiplesCausas: data.multiplesCausas.join(","),
      accionContencion: data.accionContencion,
      accionCorrectiva: data.accionCorrectiva,
      multiplesDescripcionRechazo: data.multiplesDescripcionRechazo.join(","),
      operatorId: infoUser.operatorId,
      lineaId: data.lineaId,
      dobladoraId: data.dobladoraId,
      articulo: data.articulo,
      descripcionCanio: data.descripcionRechazoOperador,
      familia: data.familia,
      lpn: data.lpn,
      emailGroupId: data.emailGroupId,
      descripcionRechazoOperador: data.descripcionRechazoOperador
    };
    return actualizacion;
  };

  const filtradoMaquinas = (): IDobladora[] => {
    if (watchLinea == 0) {
      return listaDobladoras;
    }

    const lineaFinded = listaLineas.find((elemento) => elemento.idLinea == watchLinea);

    if (lineaFinded?.descripcion?.toLowerCase() == "soldadura") {
      setValue("dobladoraId", 43);
      return listaDobladoras.filter((dobladora) => dobladora.codigoDobladora.includes("NO Conforme"));
    } else {
      return listaDobladoras.filter((dobladora) => !dobladora.codigoDobladora.includes("NO Conforme"));
    }
  };

  return (
    <ContainerForPages activeEffectVisible optionsLayout="personalized" classNamePersonalized="w-[85vw] flex flex-col">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <header className="flex flex-row gap-x-4 items-start">
            <SelectComponentForm
              control={control}
              name="lineaId"
              label="Seleccione una linea"
              activeMultiple={false}
              listItems={listaLineas}
              valueLabel={(value) => value.descripcion}
              valueSelect={(value) => value.idLinea}
              rules={{ required: "La línea es obligatoria" }}
              defaultValue={edicionActiva ? rechazoSeleccionado.lineaId.toString() : ""}
              variant="standard"
            />
            <SelectComponentForm
              control={control}
              label="Seleccione una maquina"
              listItems={filtradoMaquinas()}
              name="dobladoraId"
              valueLabel={(value) => `${value.codigoDobladora} - ${value.nombreDobladora}`}
              valueSelect={(value) => value.id}
              rules={{ required: "La dobladora es obligatoria" }}
              defaultValue={edicionActiva ? rechazoSeleccionado.dobladoraId.toString() : ""}
              activeMultiple={false}
              variant="standard"
            />
            <div className="w-full">
              <Controller
                name="familia"
                control={control}
                defaultValue={edicionActiva ? rechazoSeleccionado.familia : ""}
                rules={{ required: { value: true, message: "Ingrese una familia válido" } }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <Autocomplete
                      autoHighlight
                      autoComplete={false}
                      disablePortal={false}
                      options={listaFamilias}
                      getOptionLabel={(option) => `${option}`}
                      value={value || null}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                        setFamiliaSeleccionada(newValue);
                        setArticuloSeleccionado("");
                      }}
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          autoComplete="off"
                          {...params}
                          label="Seleccione una familia"
                          error={!!error}
                          helperText={error ? error.message : ""}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new"
                          }}
                        />
                      )}
                    />
                  </FormControl>
                )}
              />
            </div>
            <SelectComponentForm
              control={control}
              label="Seleccione el caño"
              listItems={listaArticulos}
              name="articulo"
              valueLabel={(value) => value}
              valueSelect={(value) => value}
              rules={{ required: "El articullo es obligatorio" }}
              defaultValue={edicionActiva ? rechazoSeleccionado.articulo : ""}
              activeMultiple={false}
              variant="standard"
            />
            <SelectComponentForm
              control={control}
              label="Seleccione el grupo de correo"
              listItems={listaGrupoMails}
              name="emailGroupId"
              valueLabel={(value) => value.name}
              valueSelect={(value) => value.id}
              rules={{
                required: "El grupo de correo es obligatorio",
                validate: (value) => value != 0 || "Debe seleccionar un grupo de correo válido"
              }}
              activeMultiple={false}
              variant="standard"
            />
          </header>
          <Collapse in={isValid} timeout={200}>
            <InputsForm
              setOpenModalExaminarImagen={setOpenModalExaminarImagen}
              edicionActiva={edicionActiva}
              openModal={openModal}
              rechazoSeleccionado={rechazoSeleccionado}
              setFile={setFile}
              file={file}
            />
            <div className="flex flex-col gap-y-4">
              <InputComponentForm
                control={control}
                name="descripcionRechazoSupervisor"
                label="Descripción del Rechazo Supervisor"
                defaultValue={edicionActiva ? rechazoSeleccionado.descripcionRechazoOperador : ""}
                variant="standard"
              />
              <InputComponentForm
                control={control}
                name="lpn"
                label="Etiqueta LPN (opcional)"
                defaultValue={edicionActiva ? rechazoSeleccionado.lpn : ""}
                variant="standard"
              />
            </div>
          </Collapse>
          <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid} submitName="Guardar Cambios" />
        </form>
      </FormProvider>
      <ModalCompoment
        openPopup={openModalExaminarImagen}
        setOpenPopup={setOpenModalExaminarImagen}
        title="Lista Archivos"
        subTitle="Examinar lista de archivos adjuntados"
        showModalCenterPage
        titleModalStyle="Audit">
        <ListaArchivosModal
          archivosSeparados={
            edicionActiva && rechazoSeleccionado?.urlImagen ? rechazoSeleccionado.urlImagen.split("\n") : []
          }
          setFile={setFile}
          edicionActiva={edicionActiva}
          rechazoSeleccionado={rechazoSeleccionado}
          setOpenModal={setOpenModalExaminarImagen}
          openModal={openModalExaminarImagen}
          file={file}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
