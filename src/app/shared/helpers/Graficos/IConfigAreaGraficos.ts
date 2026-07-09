export interface IConfigAreaGarficos<T> {
  key: Extract<keyof T, string>;
  stroke: string; //color de la linea
  fill: string; //color del area
}
