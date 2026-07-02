import _ from "lodash";

interface sp_RechazoByFamilia {
  fecha: string;
  familia: string;
  puesto: string;
  total: number;
  hora: number;
}
const AgruparRechazoPorHora = (rechazo: sp_RechazoByFamilia[]) => { 
  const agrupado = _.chain(rechazo).groupBy('puesto').map((value, key) => ({ puesto: key, data: value, total: _.sumBy(value, 'total') })).value();  
  return agrupado
}

export {

  AgruparRechazoPorHora
 }