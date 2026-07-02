export function mensajeDeErrorHttp(e: any): string {
  switch (e.response.status) {
    case 400:
      if (typeof e.response.data === "string") {
        return `Error: ${e.response.data}`;
      } else if (e.response.data?.message) {
        return `Error: ${e.response.data.message}`;
      } else {
        return `Error 400: solicitud incorrecta`;
      }
    case 401:
      return `Error ${e.response.status} sin autorización`;
    case 403:
      return `Error ${e.response.status} permisos incorrectos`;
    case 404:
      return `Error ${e.response.status} petición no encontrada`;
    case 500:
      return `Error ${e.response.status} error de servidor no controlado`;
    case 501:
      return `Error ${e.response.status} petición no implementada`;
    default:
      return `Error ${e.response.status} desconocido`;
  }
}
