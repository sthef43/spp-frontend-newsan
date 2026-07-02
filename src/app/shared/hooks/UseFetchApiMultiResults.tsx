/* eslint-disable unused-imports/no-unused-vars */
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { useConfirmationDialog } from "./useConfirmationDialog";
import { useNotificationUI } from "./useNotificationUI";

/**
 *  useFetchApiMultiResults => Es un custoom hook que lo que hace es ahorrar de escribir todo el bloque del try dentro del componente padre para ahorrar espacio
 *
 * @alias FetchPost => LO QUE HACES ES UN POST DENTRO DEL SLICE QUE LE PASAMOS COMO ARGUMENTO Y LUEGO LE PASAMOS LA ENTIDAD QUE DESEAMOS CREAR EN LA BASE DE DATOS
 * @param sliceRequets => ES EL SliceRequets QUE LE PASAMOS PARA QUE SEPA A QUE ENTIDAD DEBE APUNTAR EL POST
 * @param postModel => ES LA ENTIDAD YA CREADA PARA QUE SE SUBA A LA TABLA DONDE ESTA APUNTANDO EL SliceRequest
 * @param consoleLog => ES PARA MOSTRAR EL RESULTADO QUE NOS DIO EL POSTEO PARA SABER SI FUNCIONA O ESTA DANDO ALGUN ERROR
 * @param functionAdd => ES PARA QUE LE PODAMOS PASAR UNA FUNCION ADICIONAL CUANDO EL POST SE ALLA REALIZADO CON EXITO
 *
 * @alias FetchDelete => LO QUE HACE ES CAMBIAR EL BORRADO LOGICO DENTRO DE LA TABLA QUE ESTA EN LA BASE DE DATOS ELIMINANDO EL REGISTRO QUE LE PASAMOS
 * @param sliceRequest => ES EL SliceRequest QUE LE PASAMOS PARA QUE SEPA A QUE ENTIDAD DEBE APUNTAR EL DELETE
 * @param deleteId => ES EL ID DEL MODELO QUE DESEAMOS CAMBIAR EN LA BASE DE DATOS PARA QUE EL BORRADO LOGICO SE ACTIVE
 * @param consoleLog => ES PARA MOSTRAR EL RESULTADO QUE NOS DIO EL DELETED PARA SABER SI FUNCIONA O ESTA DANDO ALGUN ERROR
 * @param mensajePredeterminado => CUANDO ESTE ARGUMENTO ESTE EN TRUE SE LE TIENE QUE PASAR UN TITULO Y UN MENSAJE PARA EL MODAL DE CONFIRMACION
 * @param messageAndTitle => EN ESTE ARGUMENTO SE LE TIENE QUE PASAR UN OBJETO CON UN TITLE Y UN MESSAGE PARA QUE SE APLIQUE EN EL MODAL DE CONFIRMACION
 * @param functionAdd => ES PARA QUE LE PODAMOS PASAR UNA FUNCION ADICIONAL CUANDO EL BORRADO SE ALLA REALIZADO CON EXITO
 *
 * @alias GeneratetitleAndMessage => Lo que hace es generar el mensaje personalizado o dejar uno predeterminado para el GetConfirmation del delete
 */

interface TextosConfirmation {
  title: string;
  message: string;
}

interface PropsFetchDelete<T> {
  sliceRequest: any;
  deleteId: number;
  consoleLog: boolean;
  functionAdd: (response: T) => void;
}

interface PropsFetchPut<T> {
  sliceRequest: any;
  modelPut: T | null;
  consoleLog: boolean;
  functionAdd?: (response: T) => void;
  activeConfirmation?: boolean;
  functionReject?: (response: T) => void;
}

interface ActiveTitleAndMessageByUser<T> extends PropsFetchDelete<T> {
  mensajePersonalizado: true;
  messageUser: string;
  titleUser: string;
}
interface OptionalTitleAndMessageByUser<T> extends PropsFetchDelete<T> {
  mensajePersonalizado?: false;
  messageUser?: string;
  titleUser?: string;
}

interface ActiveTitleAndMessageByUserPost<T> extends PropsFetchPut<T> {
  mensajePersonalizado: true;
  messageUser: string;
  titleUser: string;
}
interface OptionalTitleAndMessageByUserPost<T> extends PropsFetchPut<T> {
  mensajePersonalizado?: false;
  messageUser?: string;
  titleUser?: string;
}

export type PropsDelete<T> = ActiveTitleAndMessageByUser<T> | OptionalTitleAndMessageByUser<T>;
export type PropsPut<T> = ActiveTitleAndMessageByUserPost<T> | OptionalTitleAndMessageByUserPost<T>;

/**
 * @typedef {object} FetchApiResults
 * @property {(sliceRequest: any, postModel: T, consoleLog?: boolean, functionAdd?: (response: T) => void) => Promise<T | null>} FetchPost - Realiza una petición POST.
 * @property {(props: PropsDelete<T>) => Promise<T | null>} FetchDelete - Realiza un borrado lógico con confirmación.
 * @property {(props: PropsPut<T>) => Promise<T | null>} FetchPut - Realiza una actualización con confirmación opcional.
 */

/**
 * Custom Hook para abstraer y simplificar las peticiones a la API (POST, PUT, DELETE).
 * Gestiona automáticamente los estados de carga (LoadingUI), las notificaciones de error
 * y los diálogos de confirmación para operaciones críticas.
 * @template T - El tipo de la entidad o modelo con el que se está trabajando (ej. IProducto, IUsuario).
 * @returns {FetchApiResults<T>} Un objeto que contiene las funciones para interactuar con la API.
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useFetchApiMultiResults<T>() {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  /**
   * Ejecuta una petición POST para crear un nuevo registro.
   * @param {any} sliceRequest - La acción async thunk del slice de Redux para crear la entidad.
   * @param {T} postModel - El objeto (entidad) a ser creado en la base de datos.
   * @param {boolean} [consoleLog=false] - Si es true, imprime la respuesta de la API en la consola.
   * @param {(response: T) => void} [functionAdd] - Una función callback opcional que se ejecuta si la petición tiene éxito.
   * @returns {Promise<T | null>} Una promesa que resuelve con la entidad creada o null si hubo un error.
   */
  const FetchPost = async (
    sliceRequest: any,
    postModel: T,
    consoleLog = false,
    functionAdd?: (response: T) => void,
    activeMessageException?: boolean
  ): Promise<T | null> => {
    const adicionarFuncion = functionAdd ? functionAdd : false;
    const activarMensajeExepcion = activeMessageException ? activeMessageException : false;
    let response: T | null = null;

    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      response = unwrapResult(await dispatch(sliceRequest(postModel)));
      if (response) {
        if (consoleLog) {
          console.log(response);
        }
        if (adicionarFuncion) {
          functionAdd(response);
        }
      }
    } catch (error) {
      console.error(error);
      openNotificationUI(
        `${activarMensajeExepcion ? error : "Ocurrio un error al intentar agregar el elemento"}`,
        "error"
      );
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    return response;
  };

  /**
   * Ejecuta un borrado lógico de un registro, mostrando siempre un diálogo de confirmación previo.
   * @param {PropsDelete<T>} props - Objeto de configuración para la operación de borrado.
   * @returns {Promise<T | null>} Una promesa que resuelve con la respuesta de la API tras el borrado o null si se cancela o falla.
   * @param {any} props.sliceRequest - La acción async thunk del slice para el borrado.
   * @param {number} props.deleteId - El ID del registro a eliminar.
   * @param {boolean} [props.consoleLog=false] - Si es true, imprime la respuesta en consola.
   * @param {(response: T) => void} [props.functionAdd] - Callback opcional a ejecutar tras el éxito.
   * @param {boolean} [props.mensajePersonalizado=false] - Si es true, usa los siguientes `titleUser` y `messageUser`.
   * @param {string} [props.titleUser] - Título personalizado para el diálogo de confirmación.
   * @param {string} [props.messageUser] - Mensaje personalizado para el diálogo de confirmación.
   */
  const FetchDelete = async ({
    consoleLog,
    deleteId,
    functionAdd,
    sliceRequest,
    mensajePersonalizado,
    messageUser,
    titleUser
  }: PropsDelete<T>): Promise<T | null> => {
    const nuevoTitleAndMessage = !mensajePersonalizado
      ? GeneratetitleAndMessage("Esta seguro de querer eliminar el registro?", "Eliminar Registro")
      : GeneratetitleAndMessage(messageUser, titleUser);
    const adicionarFuncion = functionAdd ? functionAdd : false;

    let response: T | null = null;
    try {
      if (
        await getConfirmation(nuevoTitleAndMessage.title, nuevoTitleAndMessage.message, null, "Eliminar", "Cancelar")
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        response = unwrapResult(await dispatch(sliceRequest(deleteId)));
        if (response) {
          if (consoleLog) {
            console.log(response);
          }
          if (adicionarFuncion) {
            functionAdd(response);
          }
        }
      }
    } catch (erorr) {
      console.log(erorr);
      openNotificationUI("Ocurrio un error al intentar eliminar el elemento", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    return response;
  };

  /**
   * Ejecuta una petición PUT para actualizar un registro existente.
   * Puede mostrar un diálogo de confirmación si se activa.
   * @param {PropsPut<T>} props - Objeto de configuración para la operación de actualización.
   * @returns {Promise<T | null>} Una promesa que resuelve con la entidad actualizada o null si se cancela o falla.
   * @param {any} props.sliceRequest - La acción async thunk del slice para el borrado.
   * @param {number} props.modelPut - El objeto que recibe para poder actualizar el registro en la base.
   * @param {boolean} [props.consoleLog=false] - Si es true, imprime la respuesta en consola.
   * @param {(response: T) => void} [props.functionAdd] - Callback opcional a ejecutar tras el éxito.
   * @param {boolean} [props.activarConfirmacion=false] - Si es true, se activa que el usuario deba confirmar la actualizacion
   * @param {boolean} [props.mensajePersonalizado=false] - Si es true, usa los siguientes `titleUser` y `messageUser`.
   * @param {string} [props.titleUser] - Título personalizado para el diálogo de confirmación.
   * @param {string} [props.messageUser] - Mensaje personalizado para el diálogo de confirmación.
   */
  const FetchPut = async ({
    sliceRequest,
    functionAdd,
    modelPut,
    consoleLog,
    mensajePersonalizado,
    messageUser,
    titleUser,
    activeConfirmation,
    functionReject
  }: PropsPut<T>): Promise<T | null> => {
    const newTitleAndMessage = !mensajePersonalizado
      ? GeneratetitleAndMessage("Esta seguro de querer actualizar este registro", "Actualzar Registro")
      : GeneratetitleAndMessage(messageUser, titleUser);
    const adicionarFuncion = functionAdd ? functionAdd : false;
    const funcionReject = functionReject ? functionReject : false;
    const activarConfirmacion = activeConfirmation ? activeConfirmation : false;

    let response: T | null = null;
    try {
      if (activarConfirmacion) {
        if (
          await getConfirmation(newTitleAndMessage.title, newTitleAndMessage.message, null, "Actualizar", "Cancelar")
        ) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          response = unwrapResult(await dispatch(sliceRequest(modelPut)));
          if (response) {
            if (consoleLog) {
              console.log(response);
            }
            if (adicionarFuncion) {
              functionAdd(response);
            }
          }
        }
      } else {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        response = unwrapResult(await dispatch(sliceRequest(modelPut)));
        if (response) {
          if (consoleLog) {
            console.log(response);
          }
          if (adicionarFuncion) {
            functionAdd(response);
          }
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Ocurrio un error al intentar actualizar el elemento", "error");
      if (funcionReject) {
        functionReject(error as T);
      }
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    return response;
  };

  /**
   * @internal
   * Función auxiliar para generar el objeto de título y mensaje para los diálogos de confirmación.
   * @param {string} message - El texto principal del diálogo.
   * @param {string} title - El título del diálogo.
   * @returns {TextosConfirmation | undefined} El objeto con los textos o undefined si hay un error.
   */
  const GeneratetitleAndMessage = (message: string, title: string) => {
    try {
      const nuevoMensaje: TextosConfirmation = {
        message: message,
        title: title
      };

      if (nuevoMensaje !== null) {
        return nuevoMensaje;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(
        "Ocurrio un error queriendo generar el mensaje y el titlo, comuniquese con un admministrador",
        "error"
      );
    }
  };

  return { FetchPost, FetchDelete, FetchPut };
}
