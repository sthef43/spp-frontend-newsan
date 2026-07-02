import { Autocomplete, TextField } from "@mui/material";
import React from "react";
interface Props {
  options: any;
  setValue: any;
  getOptionLabel: string[];
  getOptionAttributes: string[];
  label: string;
}
/** Este componente puede generar un autocomplete con un objeto pasandole las siguentes props
 *
 * `option`:`arry` es el array de objectos necesarios para hacer el autocomplete
 *
 * `getOptionLabel`: `string` tiene como variable "option" y se pasa el string que queres mostrar. Ej: "option.nombre + option.descripcion"
 *
 * `setValue`:`any` es la funcion para setear el valor del autcomplete y recibe el value
 *
 * `label`: `string` el string que queres mostrar en el input
 */
export const CustomAutocomplete = ({ options, getOptionLabel, setValue, label, getOptionAttributes }: Props) => {
  const [valor, setValor] = React.useState();
  const handleChange = (e, value) => {
    if (value) setValue(e, value);
  };
  const handleOptions = (option) => {
    const text = getOptionAttributes.map((op) => {
      return option.op;
    });
    return text.join(" ");
  };
  return (
    <Autocomplete
      options={options}
      onChange={handleChange}
      defaultValue={valor}
      getOptionLabel={(option) => handleOptions(option)}
      renderInput={(props) => <TextField {...props} fullWidth label={label} />}
    />
  );
};
