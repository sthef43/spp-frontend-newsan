import { InputProps, SxProps, Theme } from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface BaseProps {
  nameInput: string;
  control: Control;
  labelInput: string;
  valueDefault: string;
  autoFocus?: boolean;
  index: number;
  disabled?: boolean;
  validacionAdicionales?: (value: string, index: number) => boolean | string;
  typeInput?: "standard" | "outlined" | "filled";
  typeDate?: "number" | "password" | "text";
  estilosPersonalizados?: SxProps<Theme>;
}

interface ActivarRequired extends BaseProps {
  requiredBool: true;
  errors: FieldErrors;
}

interface RequiredOpcional extends BaseProps {
  requiredBool?: false;
  errors?: FieldErrors;
}

interface ActiveInputProps extends BaseProps {
  activePropsInput: true;
  inputProps: InputProps;
}

interface InactiveInputProps extends BaseProps {
  activePropsInput?: false;
  inputProps?: InputProps;
}

interface functionRequiered extends BaseProps {
  onKeyUpFunction: true;
  onKeyUp: (event: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
}
interface functionOptional extends BaseProps {
  onKeyUpFunction?: false;
  onKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
}

type Props = (ActivarRequired | RequiredOpcional) &
  (functionRequiered | functionOptional) &
  (ActiveInputProps | InactiveInputProps);

/**
 * Componente de campo de texto reutilizable, integrado con React Hook Form y Material-UI.
 * Abstrae la lógica del `Controller` y maneja validaciones, errores y estilos de forma centralizada.
 *
 * @param {Props} props - Las propiedades para configurar el campo de texto.
 * @param {string} props.nameInput - Nombre único para el input, usado por React Hook Form.
 * @param {Control} props.control - El objeto `control` de `useForm` del formulario padre.
 * @param {string} props.labelInput - El texto que se mostrará como label del campo.
 * @param {string} props.valueDefault - El valor inicial del campo.
 * @param {number} props.index - El índice del campo, útil para listas de inputs dinámicos y la función `onKeyUp`.
 * @param {boolean} [props.requiredBool=false] - Si es `true`, el campo será obligatorio y mostrará errores de validación.
 * @param {FieldErrors} [props.errors] - **Requerido si `requiredBool` es `true`**. El objeto `errors` de `useForm` para mostrar los mensajes de error.
 * @param {boolean} [props.onKeyUpFunction=false] - Si es `true`, activa el manejo del evento `onKeyUp`.
 * @param {(event: React.KeyboardEvent<HTMLDivElement>, index: number) => void} [props.onKeyUp] - **Requerido si `onKeyUpFunction` es `true`**. La función a ejecutar en el evento `onKeyUp` (ej. para cambiar el foco al presionar Enter).
 * @param {(value: string, index: number) => boolean | string} [props.validacionAdicionales] - Una función para validaciones personalizadas. Debe devolver `true` si es válido, o un `string` con el mensaje de error si no lo es.
 * @param {boolean} [props.autoFocus=false] - Si es `true`, el campo recibirá el foco automáticamente al renderizarse.
 * @param {boolean} [props.disabled=false] - Si es `true`, el campo estará deshabilitado.
 * @param {"standard" | "outlined" | "filled"} [props.typeInput="outlined"] - El estilo del `TextField` de Material-UI.
 * @param {"number" | "password" | "text"} [props.typeDate="text"] - El tipo de dato del input.
 *
 * @example
 * // Ejemplo de una validacionAdicional
 * const verLongitud = (value: string) => {
 * return value.length > 5 || "El código debe tener más de 5 caracteres";
 * }
 * @example
 * Ejemplo de una validacionAdicional
 * const verLongitud = (value: string, index:number) => {
        if (value.length > 5 && index == 0 || value.length == 0) {
            return true
        } else {
            return "El codigo es incorrecto"
        }
    }
 * @example 
 * Ejemplo de una funcion para la opcion de onKeyUp
 * const handleKey = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
        if (event.key === "Enter") {
            event.preventDefault()
            const inputs = document.querySelectorAll('.MuiFormControl')
            const inputActual = inputs[index]?.querySelector('input') as HTMLInputElement | null
            if (inputActual) {
                const esValido = await trigger(inputActual.name)
                if (!esValido) {
                    inputActual.select()
                    return
                }
                const siguienteInput = inputs[index + 1]?.querySelector('input') as HTMLInputElement | null
                if (siguienteInput && siguienteInput instanceof HTMLElement) {
                    siguienteInput.focus()
                }
            }
        }
    }
 */

export const TextFieldComponent: React.FC<Props> = ({
  nameInput,
  control,
  labelInput,
  valueDefault,
  requiredBool,
  errors,
  autoFocus,
  activePropsInput,
  inputProps,
  index,
  onKeyUp,
  validacionAdicionales,
  onKeyUpFunction,
  typeInput,
  typeDate,
  disabled,
  estilosPersonalizados
}) => {
  const activarEstilosPerzonalizados = estilosPersonalizados ? estilosPersonalizados : {};

  return (
    <div className="w-full">
      <Controller
        name={nameInput}
        control={control}
        defaultValue={valueDefault}
        rules={
          requiredBool
            ? {
                required: "Ingrese un valor",
                validate: (value) => (validacionAdicionales ? validacionAdicionales(value, index) : true)
              }
            : {}
        }
        render={({ field }) => (
          <TextField
            onKeyUp={onKeyUpFunction ? (event) => onKeyUp(event, index) : null}
            autoComplete="off"
            autoFocus={!!autoFocus}
            InputProps={activePropsInput ? inputProps : {}}
            fullWidth
            sx={activarEstilosPerzonalizados}
            disabled={disabled ? true : false}
            type={typeDate ? typeDate : "text"}
            {...field}
            className="MuiFormControl"
            id="input-componente"
            label={labelInput}
            error={requiredBool ? !!errors[nameInput] : false}
            helperText={requiredBool ? errors[nameInput]?.message : ""}
            variant={typeInput ? typeInput : "outlined"}
          />
        )}
      />
    </div>
  );
};
