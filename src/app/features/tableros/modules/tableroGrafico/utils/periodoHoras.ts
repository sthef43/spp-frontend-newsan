import moment from "moment"

const periodoMañana = [6,7,8,9,10,11,12,13,14]
const periodoTarde = [15, 16, 17, 18, 19, 20, 21, 22, 23] 
const periodoNoche = [24,1,2,3,4,5]
const periodoAll = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]


interface RechazoResponse {
  fecha: string,
  color: string,
  data:RechazyByHour[]
}

interface RechazyByHour  {
  fecha: string,
  hora: number,
  cantidad:number
}

export interface Series<T> {
  name: string,
  data: T[],
  color:string
}

export interface RechazoData {
  hora: number,
  cantidad:number
}

const formatPeridoHora = (periodo:number[], rechazo: RechazoResponse | null, turno:string):Series<RechazoData> => { 
  if (!periodo) {
    periodo = turno == 'M' ? periodoMañana : periodoTarde
    switch (turno) {
      case 'T':
        periodo = periodoTarde
        break;
      case 'A':
        periodo = periodoAll
        break;
      case 'N':
        periodo = periodoNoche
        break;
      default:
        periodo = periodoMañana
        break;
    }
  }

  const newSerie: Series<RechazoData> = {
    name: rechazo?.fecha || moment().format() ,
    color:rechazo?.color || '#B2EA1B',
    data:[]
  }  

  const isToday = rechazo  ? moment().startOf('day').isSame(moment(rechazo.fecha).startOf('day')) : moment().startOf('day')
  const currentHour = moment().hour()  
  
  if (isToday) {
    const temp = periodo.filter(d => d <= currentHour)
    if (temp.length > 0 ) periodo = temp
  }
  
  const data = periodo.map(d => {         
    const f = rechazo?.data.find(e => e.hora == d)?.cantidad || 0
    return { hora:d , cantidad : f }
  })
    
  newSerie.data = data

  return newSerie;

}


const getDefaultPeriodo = (turno) => {
  switch (turno) {
    case 'T':
      return periodoTarde      
    case 'A':
      return periodoAll      
    case 'N':
      return periodoNoche      
    default:
      return periodoMañana
      
  }
}
export { 
  formatPeridoHora,
  getDefaultPeriodo
}