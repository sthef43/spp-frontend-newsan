import { authenticationSlice } from "../reducers/AuthenticationSlice";
import { NotificationSlice } from "../reducers/notificationUISlice";
import { mensajeDeErrorHttp } from "./statusErrors";

export async function errorNotification(
  func: () => Promise<any>,
  { rejectWithValue, dispatch }: any,
  succesMessage?: string
) {
  try {
    const response = await func();
    if (succesMessage?.length > 0) {
      dispatch(
        NotificationSlice.actions.notificationUIopen({
          Mensaje: succesMessage,
          type: "success"
        })
      );
    }
    return response;
  } catch (e: any) {
    let mensaje = "Error en la conexión con el servidor";
    if (e.response) {
      mensaje = mensajeDeErrorHttp(e);
      dispatch(
        NotificationSlice.actions.notificationUIopen({
          Mensaje: mensaje,
          type: "error"
        })
      );
      if (e.response.status == 401) {
        dispatch(authenticationSlice.actions.ForceLogOut());
      }
    } else {
      dispatch(
        NotificationSlice.actions.notificationUIopen({
          Mensaje: mensaje,
          type: "error"
        })
      );
    }
    return rejectWithValue(mensaje);
  }
}
////
