/* eslint-disable unused-imports/no-unused-vars */
import { AttachmentOutlined, Visibility } from "@mui/icons-material";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectGrupoItemsComponent } from "../../components/SelectGrupoProcesosComponent";
import { ITickets } from "../../models/ITickets";
import { ITicketsGrupoProcesos } from "../../models/iTicketsGrupoProcesos";
import { ITicketsItemsProcesosResultados } from "../../models/ITicketsItemsProcesosResultados";
import { TicketsGrupoProcesosSliceRequest } from "app/features/tickets/reducers/TicketsGrupoProcesosSlice";
import { TicketsItemsProcesosResultadosSliceRequest } from "app/features/tickets/reducers/TicketsItemsProcesosResultadosSlice";
import { TicketsSliceRequest } from "app/features/tickets/reducers/TicketsSlice";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ListaArchivosPreCargados } from "../../modals/DetallesTicketModal/ListaArchivosPreCargados";
import { TicketsArchivosSliceRequest } from "app/features/tickets/reducers/TicketsArchivosSlice";
import { TicketsCategoriaSliceRequest } from "app/features/tickets/reducers/TicketsCategoriaSlice";
import { ITicketsCategoria } from "../../models/ITicketsCategorias";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { IAppUser } from "app/models";
import { UseGeneratorCodesForLabels } from "app/shared/hooks/useGeneratorCodesForLabels";
import FetchApi from "app/shared/helpers/FetchApi";
import { useFileChange } from "app/shared/hooks/useFileChange";
import { ButtonForFiles } from "app/shared/helpers/ButtonForFiles";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CrearTickets = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({ mode: "onBlur" });

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const { generateLpnWitPrefixCode } = UseGeneratorCodesForLabels();
  const { multiSelectFileChange } = useFileChange();
  const buttonClases = MaterialButtons();
  const ref: any = useRef(null);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [grupoProcesosSeleccionado, setGrupoProcesosSeleccionado] = useState(null);
  const [openModalImagen, setOpenModalImagen] = useState(false);

  const [listaArchivos, setListaArchivos] = useState<File[]>([]);

  const [listadoItems, setListadoItems] = useState<ITicketsGrupoProcesos>();
  FetchApi<ITicketsGrupoProcesos>(
    TicketsGrupoProcesosSliceRequest.GetGrupoProcesosWithItemsById,
    grupoProcesosSeleccionado,
    false,
    grupoProcesosSeleccionado,
    setListadoItems,
    true
  );

  const crearTicket = async (data: any) => {
    if ((grupoProcesosSeleccionado || categoriaSeleccionada) && isValid) {
      const nuevoTicket = generarObjetoNuevoTicket(data);
      try {
        const confirmar = await getConfirmation(
          "Crear Ticket",
          "¿Desea crear el ticket para que un agente lo vea?",
          null,
          "Confirmar",
          "Cancelar"
        );
        if (!confirmar) return;

        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const responseTicket: ITickets = unwrapResult(await dispatch(TicketsSliceRequest.PostRequest(nuevoTicket)));
        if (responseTicket && responseTicket.id) {
          const nuevosItemsResultados = generarItemsProcesosResultado(responseTicket.id);
          await dispatch(TicketsItemsProcesosResultadosSliceRequest.multiPostRequest(nuevosItemsResultados));
          if (listaArchivos && listaArchivos.length > 0) {
            await dispatch(
              TicketsArchivosSliceRequest.PublishNewTicketFiles({
                ticketId: responseTicket.id,
                imagenFile: listaArchivos
              })
            );
          }
          await dispatch(EmailSliceRequest.SendEmailTicket(nuevoTicket));
          openNotificationUI("Se agregó el ticket correctamente", "success");
          setListaArchivos([]);
          setCategoriaSeleccionada(null);
          setGrupoProcesosSeleccionado(null);
          resetarInputs();
        }
      } catch (error: any) {
        console.error("Error al crear el ticket:", error);
        openNotificationUI(error?.message || "Ocurrió un error en el proceso", "error");
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } else {
      openNotificationUI("Faltan campos por completar o el formulario es inválido", "warning");
    }
  };

  const [listaCategorias, setListaCategorias] = useState<ITicketsCategoria[]>();
  const getCategorias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TicketsCategoriaSliceRequest.GetAllCategoriesByPlantId(infoUser.operator.plantaId))
      );
      if (response) {
        setListaCategorias(response);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarObjetoNuevoTicket = (datosFormulario: any) => {
    const nuevoSd = generateLpnWitPrefixCode(7, "SD-");
    const nuevoTicket: ITickets = {
      titulo: datosFormulario.ticketTitulo,
      ticketsCategoriaId: categoriaSeleccionada,
      descripcion: datosFormulario.descripcionTicket,
      ticketsEstadoId: 2,
      sla: true,
      plantId: infoUser.operator.plantaId,
      operatorId: infoUser.operatorId,
      sdTicket: nuevoSd
    };
    return nuevoTicket;
  };

  const generarItemsProcesosResultado = (idTicket: number) => {
    const nuevoArrayItems = [];
    listadoItems.ticketsGrupoProcesosBloques.forEach((elementos) => {
      const nuevoItem: ITicketsItemsProcesosResultados = {
        aprobacionIntermedia: elementos.ticketsItemsProcesos.aprobacionIntermedia,
        nombre: elementos.ticketsItemsProcesos.nombre,
        estadoAprobado: false,
        comentarioAprobado: "",
        ticketsItemsProcesosId: elementos.ticketsItemsProcesosId,
        ticketsId: idTicket,
        rolId: elementos.ticketsItemsProcesos.rolId,
        position: elementos.position
      };
      nuevoArrayItems.push(nuevoItem);
    });
    try {
      if (nuevoArrayItems.length > 0) {
        return nuevoArrayItems;
      }
    } catch (error) {
      openNotificationUI("Se genero un error, contactese con el administrador", "error");
    }
  };

  const resetarInputs = () => {
    setValue("ticketTitulo", "");
    setValue("descripcionTicket", "");
    setValue("categorias", 0);
    setValue("grupos", 0);
  };

  useEffect(() => {
    getCategorias();
  }, []);

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 bg-secondaryNew">
        <form onSubmit={handleSubmit(crearTicket)} className="flex flex-col justify-center gap-y-2">
          <div>
            <p className="text-sm text-textColor font-light mb-3">Título del Ticket</p>
            <TextFieldComponent
              control={control}
              index={0}
              labelInput="Introduce un título conciso"
              valueDefault=""
              nameInput="ticketTitulo"
              errors={errors}
              requiredBool
            />
          </div>
          <div className="w-full">
            <p className="text-sm text-textColor font-light mb-3">Descripción</p>
            {/* <TextFieldComponent
                            validacionAdicionales={verLongitud}
                            control={control}
                            index={1}
                            labelInput="Describe tu problema o solicitud en detalle"
                            valueDefault=""
                            nameInput="descripcionTicket"
                            errors={errors}
                            requiredBool
                        />
                        <Controller
                            name="descripcionTicket"
                            control={control}
                            defaultValue=""
                            rules={{ required: { value: true, message: "Debe ingresar una descripcion" }, minLength: { value: 20, message: "Ingrese una mejor descripcion"}}}
                            render={({ field }) => (

                            )}
                        /> */}
            <Controller
              name="descripcionTicket"
              control={control}
              defaultValue=""
              rules={{
                required: { value: true, message: "Debe ingresar una descripcion" },
                minLength: { value: 20, message: "Ingrese una mejor descripcion" }
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:outline-blue-500 transition-colors"
                  rows={3}
                  placeholder="Describe tu problema o solicitud en detalle"></textarea>
              )}
            />
            {errors.descripcionTicket && errors.descripcionTicket.type === "required" && (
              <span className="text-xs font-semibold text-red-500">{errors.descripcionTicket.message}</span>
            )}
            {errors.descripcionTicket && errors.descripcionTicket.type === "minLength" && (
              <span className="text-xs font-semibold text-red-500">{errors.descripcionTicket.message}</span>
            )}
          </div>
          <div className="w-full">
            <p className="text-sm text-textColor font-light mb-3">Categoria</p>
            <SelectComponent
              control={control}
              listaObjetos={listaCategorias}
              nameSelect="categorias"
              inputLabel=""
              valueLabel={(value) => value.nombre}
              valueSelect={(value) => value.id}
              ValueSave={setCategoriaSeleccionada}
              valueKey={(value) => value}
            />
          </div>
          <div className="w-full">
            <p className="text-sm text-textColor font-light mb-3">Procesos</p>
            <SelectGrupoItemsComponent
              valueCategoriaId={categoriaSeleccionada}
              activeControl
              controlPadre={control}
              setGrupoSeleccionado={setGrupoProcesosSeleccionado}
            />
          </div>
          <div>
            <p className="text-sm text-textColor font-light mb-3">Adjuntar Archivos (opcional)</p>
            <div className="flex flex-row gap-x-4 items-center">
              <ButtonForFiles
                functionFile={(e) => {
                  multiSelectFileChange(e, setListaArchivos);
                }}
                textButton="Seleccionar Archivos"
                styles="bg-mensajeTicketsReceptor px-6 py-2 flex items-center rounded-md hover:bg-gray-500 transition-colors border border-gray-400"
                multipleFiles>
                <AttachmentOutlined sx={{ marginLeft: "1rem" }} />
              </ButtonForFiles>
              <div>
                {listaArchivos.length > 0 && (
                  <div className="flex flex-col items-center ">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalImagen(true);
                      }}
                      className={`${buttonClases.blueButton} px-6 py-2 flex items-center rounded-md transition-colors`}>
                      <Visibility sx={{ fill: "white" }} />
                      <p className="ml-3">Ver Archivos</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex flex-row items-center gap-x-4">
                            {urlImageView && urlImageUpload.type.includes("image") && (
                                <div className="flex flex-col items-center ">
                                    <button type="button" onClick={() => { setOpenModalImagen(true) }} className={`${buttonClases.blueButton} px-6 py-2 flex items-center rounded-md transition-colors`}>
                                        <Visibility sx={{ fill: "white" }} />
                                        <p className="ml-3">Ver Imagen</p>
                                    </button>
                                </div>
                            )}
                            {urlImageView && !urlImageUpload.type.includes("image") && (
                                <div className="flex flex-col items-center ">
                                    <p className="ml-3 bg-blue-500 rounded-md px-6 py-2">Archivo: {urlImageUpload.name}</p>
                                </div>
                            )}
                        </div> */}
          </div>
          <div className="w-full mt-2">
            <Button
              type="submit"
              sx={{ width: "100%" }}
              disabled={grupoProcesosSeleccionado === null || categoriaSeleccionada === null || !isValid}
              className={buttonClases.orangeButton}>
              Enviar Ticket
            </Button>
          </div>
        </form>
      </section>
      <ModalCompoment openPopup={openModalImagen} setOpenPopup={setOpenModalImagen} title="Archivos Seleccionados">
        <ListaArchivosPreCargados
          setopenModal={setOpenModalImagen}
          openModal={openModalImagen}
          srcImagen={listaArchivos}
          setListaArchivos={setListaArchivos}
        />
      </ModalCompoment>
    </main>
  );
};
