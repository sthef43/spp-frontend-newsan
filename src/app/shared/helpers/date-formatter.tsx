import moment from "moment";

export const formatDate = (fecha: Date): string => {
  const fechaNueva = moment(fecha).format("DD/MM/YYYY");

  return fechaNueva;
};
