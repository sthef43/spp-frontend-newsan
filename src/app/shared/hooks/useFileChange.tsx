/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable unused-imports/no-unused-vars */
import { ChangeEvent } from "react";

/**
 * @typedef {object} FileChangeHandlers
 * @property {(event: React.ChangeEvent<HTMLInputElement>, setFileChange: (updater: (prev: File[]) => File[]) => void) => void} multiListSelectFile - Maneja la selección de un archivo y lo añade a una lista existente.
 * @property {(event: React.ChangeEvent<HTMLInputElement>, setFileChange: (updater: (prev: any[]) => any[]) => void) => void} multiSelectFileChange - Maneja la selección de múltiples archivos y los añade a una lista.
 * @property {(event: React.ChangeEvent<HTMLInputElement>, setFileChange: (file: File) => void, setUrlImage: (url: string | ArrayBuffer | null) => void) => void} selectFileChange - Maneja la selección de un único archivo.
 */

/**
 * Custom Hook que proporciona funciones para manejar eventos de cambio en inputs de tipo archivo (`<input type="file">`).
 * Facilita la lectura de archivos usando FileReader y la actualización del estado de React con los archivos seleccionados y sus URLs en Base64.
 * @returns {FileChangeHandlers} Un objeto con funciones para manejar la selección de archivos.
 */

/**
 *
 * Aclaracion sobre el tipado
 * El tipado de las primeras 2 funcion estan en any, por que meto la url del File dentro del objeto para despues poder dar una visualiacion mejor
 * del objeto y poder mostrar la imagen con la informacion mas facil.
 */

export function useFileChange() {
  /**
   * Procesa la selección de un archivo y lo añade a un estado que es un array de archivos.
   * Ideal para listas donde se añaden archivos de uno en uno.
   * @param {React.ChangeEvent<HTMLInputElement>} event - El evento del input de archivo.
   * @param {(updater: (prev: File[]) => File[]) => void} setFileChange - La función `setState` para actualizar la lista de archivos.
   */
  const multiListSelectFile = (event: any, setFileChange: (newValue: any) => void) => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.addEventListener("load", () => {
        file.url = reader.result;
        setFileChange((prev) => {
          return [...prev, file];
        });
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  /**
   * Procesa la selección de múltiples archivos a la vez (usando el atributo `multiple` en el input)
   * y los añade a un estado que es un array.
   * @param {React.ChangeEvent<HTMLInputElement>} event - El evento del input de archivo.
   * @param {(updater: (prev: any[]) => any[]) => void} setFileChange - La función `setState` para actualizar la lista de archivos.
   */
  const multiSelectFileChange = (event: any, setFileChange: (newValue: any) => void) => {
    if (event.target.files) {
      const files = event.target.files;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile = { file };
          newFile.file.url = reader.result;
          setFileChange((prev: any[]) => {
            return [...prev, newFile];
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * Procesa la selección de un único archivo. Actualiza un estado con el objeto File
   * y otro estado con la URL en Base64 del archivo, ideal para previsualizar imágenes.
   * @param {React.ChangeEvent<HTMLInputElement>} event - El evento del input de archivo.
   * @param {(file: File) => void} setFileChange - La función `setState` para el archivo seleccionado.
   * @param {(url: string | ArrayBuffer | null) => void} setUrlImage - La función `setState` para la URL de previsualización.
   */
  const selectFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFileChange: (newValue: File) => void,
    seturlImage: (newValue: string | ArrayBuffer | null) => void
  ) => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.addEventListener("load", () => {
        setFileChange(file);
        seturlImage(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  /**
   * Procesa la selección de un único archivo. Actualiza un estado con el objeto File
   * y otro estado con la URL en Base64 del archivo, ideal para previsualizar imágenes.
   * Ademas ejecuta una funcion que recibe la url del archivo para poder hacer algo con ella.
   * @param {React.ChangeEvent<HTMLInputElement>} event - El evento del input de archivo.
   * @param {(file: File) => void} setFileChange - La función `setState` para el archivo seleccionado.
   * @param {(url: string | ArrayBuffer | null) => void} setUrlImage - La función `setState` para la URL de previsualización.
   * @param {(file: string | ArrayBuffer | null) => void} functionAdd - La función que se ejecuta al seleccionar el archivo.
   */
  const selectFileChangeWitFunctionAdd = (
    event: ChangeEvent<HTMLInputElement>,
    setFileChange: (newValue: File) => void,
    seturlImage: (newValue: string | ArrayBuffer | null) => void,
    functionAdd: (url: string | ArrayBuffer | null, file: File) => void
  ) => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.addEventListener("load", () => {
        setFileChange(file);
        seturlImage(reader.result);
        functionAdd(reader.result, file);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return { multiListSelectFile, selectFileChange, multiSelectFileChange, selectFileChangeWitFunctionAdd };
}
