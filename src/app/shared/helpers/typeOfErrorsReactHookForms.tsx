export const typeOfErrorsReactHookForms = (error) => {
  if (error) {
    switch (error) {
      case "pattern":
        return "se ha introducido un numero o un letra donde no debía";
      case "disabled":
        return "deshabilitado";
      case "required":
        return "Este campo es requerido";
      case "min":
        return "Este numero no alcanza el minimo requerido";
      case "max":
        return "Este numero no alcanza el maximo requerido";
      default:
        return "Error generico";
    }
  } else {
    return "";
  }
};
