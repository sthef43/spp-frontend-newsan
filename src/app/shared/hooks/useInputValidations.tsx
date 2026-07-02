/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues, UseFormTrigger } from "react-hook-form";

/**
 * Un hook personalizado de React que proporciona funciones de validación de entrada y lógica de navegación de formularios.
 * Se integra con la función `trigger` de react-hook-form para validar campos.
 *
 * @param trigger - La función `trigger` de react-hook-form, utilizada para activar manualmente la validación de un campo.
 * @returns Un objeto que contiene:
 *          - `nextInput`: Una función para manejar las pulsaciones de la tecla "Enter" para la navegación y validación del formulario.
 *          - `validators`: Un objeto que contiene varias funciones de validación de orden superior.
 */
export function useInputValidations(trigger: UseFormTrigger<FieldValues>) {
  /**
   * Maneja el evento de pulsación de la tecla "Enter" para navegar entre los campos del formulario o enviarlo.
   * Valida el campo actual antes de pasar al siguiente.
   *
   * @param event - El evento del teclado.
   * @param index - El índice del campo actual en la lista de campos del formulario.
   */
  const nextInput = async (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    let siguienteInput;
    if (event.key === "Enter") {
      event.preventDefault(); // Previene el comportamiento de envío de formulario por defecto
      const inputs = document.querySelectorAll(".MuiFormControl"); // Selecciona todos los controles de formulario
      const inputActual = inputs[index].querySelector("input") as HTMLInputElement | null; // Obtiene el elemento de entrada actual

      if (inputActual) {
        // Activa la validación para el campo actual usando su nombre
        const esValido = await trigger(inputActual.name);
        if (!esValido) {
          // Si la validación falla, vuelve a seleccionar el campo actual y detente
          inputActual.select();
          return;
        }

        // Si la validación pasa, intenta pasar al siguiente campo o enviar el formulario
        if (index < inputs.length - 1) {
          // Pasa al siguiente campo si existe
          siguienteInput = inputs[index + 1].querySelector("input") as HTMLInputElement | null;
          if (siguienteInput && siguienteInput instanceof HTMLElement) {
            siguienteInput.focus(); // Enfoca el siguiente campo
          }
        } else {
          // Si es el último campo, intenta hacer clic en el botón de envío
          const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton && submitButton instanceof HTMLElement) {
            submitButton.click(); // Hace clic programáticamente en el botón de envío
          }
        }
      }
    }
  };

  /**
   * Función de orden superior que devuelve una función de validación para verificar la longitud mínima.
   *
   * @param min - La longitud mínima permitida.
   * @param msg - Mensaje de error personalizado opcional.
   * @returns Una función de validación que toma un string `value` y devuelve `true` si es válido, o un mensaje de error si es inválido.
   */
  const minLength = (min: number, msg?: string) => (value: string) => {
    if (value.length >= min) {
      return true;
    } else {
      if (msg) {
        return msg;
      } else {
        return `Mínimo ${min} caracteres`;
      }
    }
  };

  /**
   * Función de orden superior que devuelve una función de validación para verificar la longitud máxima.
   *
   * @param max - La longitud máxima permitida.
   * @param msg - Mensaje de error personalizado opcional.
   * @returns Una función de validación que toma un string `value` y devuelve `true` si es válido, o un mensaje de error si es inválido.
   */
  const maxLength = (max: number, msg?: string) => (value: string) => {
    if (value.length <= max) {
      return true;
    } else {
      if (msg) {
        return msg;
      } else {
        return `Máximo ${max} caracteres`;
      }
    }
  };

  /**
   * Función de orden superior que devuelve una función de validación para verificar si un valor contiene solo caracteres numéricos.
   *
   * @param msg - Mensaje de error personalizado opcional.
   * @returns Una función de validación que toma un string `value` y devuelve `true` si es válido, o un mensaje de error si es inválido.
   */
  const isNumeric = (msg?: string) => (value: string) => {
    if (/^[0-9]+$/.test(value)) {
      return true;
    } else {
      if (msg) {
        return msg;
      } else {
        return "Solo se permiten números";
      }
    }
  };

  /**
   * Función de orden superior que devuelve una función de validación para verificar si un valor tiene un formato de correo electrónico válido.
   *
   * @param msg - Mensaje de error personalizado opcional.
   * @returns Una función de validación que toma un string `value` y devuelve `true` si es válido, o un mensaje de error si es inválido.
   */
  const isEmail = (msg?: string) => (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex estándar para correo electrónico
    if (regex.test(value)) {
      return true;
    } else {
      if (msg) {
        return msg;
      } else {
        return "Formato de email inválido";
      }
    }
  };

  /**
   * Función de orden superior que combina múltiples funciones de validación en una sola.
   * Procesa los validadores en orden y devuelve el primer mensaje de error encontrado.
   * Si todos los validadores pasan, devuelve `true`.
   *
   * @param validators - Un array de funciones de validación, cada una tomando un string y devolviendo `true` o un mensaje de error.
   * @returns Una única función de validación que toma un string `value` y devuelve `true` si todos los validadores pasan, o el primer mensaje de error.
   */
  const pipe =
    (...validators: Array<(val: string) => true | string>) =>
    (value: string) => {
      for (const validator of validators) {
        const result = validator(value);
        if (result !== true) {
          return result; // Devuelve el primer mensaje de error encontrado
        }
      }
      return true; // Si todos los validadores pasan, devuelve true.
    };

  return {
    nextInput,
    validators: {
      minLength,
      maxLength,
      isNumeric,
      isEmail,
      pipe
    }
  };
}
