/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useNotificationUI } from "./useNotificationUI";

/**
 * @typedef {object} GeneratorCodes
 * @property {(longitudEtiqueta: number) => string | undefined} triggerLpnLabel - Función para generar una etiqueta LPN numérica.
 * @property {(longitudCodigo: number, prefijo: string) => string | undefined} triggerLpnWitPrefixCode - Función para generar un código con prefijo.
 * @property {(listaLetras: string[], longitud: number, cantidadLetras: number) => string | undefined} triggerArticleCode - Función para generar un código de artículo complejo.
 */

/**
 * Hook que provee funciones para generar diferentes tipos de códigos y etiquetas.
 * Utiliza `useNotificationUI` para mostrar errores al usuario.
 * @returns {GeneratorCodes} Un objeto con las funciones generadoras de códigos.
 */

export function UseGeneratorCodesForLabels() {
  const { openNotificationUI } = useNotificationUI();

  /**
   * Genera una etiqueta LPN (License Plate Number) puramente numérica de una longitud específica.
   * @param {number} longitudEtiqueta - La longitud deseada para la etiqueta. Si es 0, se usará 10 por defecto.
   * @returns {string | undefined} El LPN generado como una cadena de texto, o `undefined` si ocurre un error.
   */
  const generateLpnLabel = (longitudEtiqueta: number): string => {
    try {
      const longitud = longitudEtiqueta == 0 ? 10 : longitudEtiqueta;
      let lpnGenerado = "";
      for (let index = 0; index < longitud; index++) {
        const j = Math.floor(Math.random() * 10);
        lpnGenerado += j;
      }
      return lpnGenerado;
    } catch (error) {
      console.log(error);
      openNotificationUI(`Ocurrio un error generando el numero LPN: ${error}`, "error");
    }
  };

  /**
   * Genera un código que comienza con un prefijo seguido de una cadena numérica aleatoria.
   * @param {number} longitudCodigo - La longitud de la parte numérica del código. Si es 0, se usará 7 por defecto.
   * @param {string} prefijo - El prefijo que se añadirá al inicio del código.
   * @returns {string | undefined} El código generado con el prefijo, o `undefined` si ocurre un error.
   */
  const generateLpnWitPrefixCode = (longitudCodigo: number, prefijo: string): string => {
    try {
      let codigoPrefijo = `${prefijo}`;
      const longitud = longitudCodigo == 0 ? 7 : longitudCodigo;
      for (let index = 0; index < longitud; index++) {
        const j = Math.floor(Math.random() * 10);
        codigoPrefijo += j;
      }
      return codigoPrefijo;
    } catch (error) {
      console.log(error);
      openNotificationUI(`Ocurrio un error generando el nuevo codigo de articulo: ${error}`, "error");
    }
  };

  /**
   * Genera un código de artículo complejo, combinando letras aleatorias de una lista dada y una secuencia numérica.
   * @param {string[]} listaLetras - Un arreglo de letras a partir de las cuales se generará la parte inicial del código.
   * @param {number} longitud - La longitud de la parte numérica del código.
   * @param {number} cantidadLetras - La cantidad de letras que se usarán al inicio del código. Si es 0, se usarán 3 por defecto.
   * @returns {string | undefined} El código de artículo generado, o `undefined` si ocurre un error.
   */
  const generateArticleCode = (listaLetras: string[], longitud: number, cantidadLetras: number): string => {
    const setCantidadLetras = cantidadLetras === 0 ? 3 : cantidadLetras;
    const setLongitud = longitud === 0 ? 7 : longitud;
    let primerasLetrasCode = "";
    const letrasEnComun = [];
    const listaLetrasArgumento = new Set(listaLetras);
    const abecedario = triggerAlphabetList();
    let lpnGenerado = "";
    try {
      for (const elementos of abecedario) {
        if (listaLetrasArgumento.has(elementos.toUpperCase())) letrasEnComun.push(elementos);
      }
      for (let index = 0; index < letrasEnComun.length; index++) {
        const j = Math.floor(Math.random() * letrasEnComun.length);
        primerasLetrasCode = primerasLetrasCode += letrasEnComun[j];
      }
      for (let index = 0; index < setLongitud; index++) {
        const j = Math.floor(Math.random() * 10);
        lpnGenerado += j;
      }
      const articuloGenerado = primerasLetrasCode.substring(0, setCantidadLetras) + lpnGenerado;
      return articuloGenerado;
    } catch (error) {
      openNotificationUI(`Ocurrio un error queriendo generar el codigo del articulo`, "error");
    }
  };

  /**
   * Genera una cadena de texto aleatoria basada en una plantilla.
   * Los caracteres especiales en la plantilla son reemplazados de la siguiente manera:
   * - `#`: Se reemplaza por un dígito aleatorio (0-9).
   * - `L`: Se reemplaza por una letra mayúscula aleatoria (A-Z).
   * - `l`: Se reemplaza por una letra minúscula aleatoria (a-z).
   * - `X`: Se reemplaza por un carácter alfanumérico aleatorio (A-Z o 0-9).
   *
   * @param {string} template - La cadena de texto que sirve como plantilla (ej. "FACTURA-L##-XXX").
   * @returns {string} La cadena de texto final con los caracteres de la plantilla reemplazados.
   * @example
   * // Generaría algo como: "ID-A4B-K9"
   * generateLabelFromTemplate("ID-LLL-X#");
   */
  const generateLabelFromTemplate = (template: string) => {
    const templateConvertido = template.split("");
    const templateFinal = [];
    const abecedario = triggerAlphabetList();
    templateConvertido.forEach((elementos) => {
      let remplazoGeneral = elementos;
      let indexAbecedario;
      let opcionGenerar;
      switch (elementos) {
        case "#":
          remplazoGeneral = elementos.replace(elementos, String(Math.floor(Math.random() * 10)));
          break;
        case "L":
          indexAbecedario = Math.floor(Math.random() * 26);
          remplazoGeneral = abecedario[indexAbecedario].toUpperCase();
          break;
        case "l":
          indexAbecedario = Math.floor(Math.random() * 26);
          remplazoGeneral = abecedario[indexAbecedario].toLowerCase();
          break;
        case "X":
          opcionGenerar = Math.floor(Math.random() * 2) + 1;
          remplazoGeneral = generateWordByNumber(opcionGenerar);
      }
      templateFinal.push(remplazoGeneral);
    });
    return templateFinal.join("");
  };

  /**
   * Función auxiliar que genera una letra mayúscula o un número de forma aleatoria.
   * Está diseñada para ser utilizada por `generateLabelFromTemplate` en el caso 'X'.
   * @param {number} opcion - Un número que define qué generar: 1 para letra, 2 para número.
   * @returns {string | undefined} Una cadena con el carácter generado o `undefined` si la opción no es válida.
   */
  const generateWordByNumber = (opcion: number) => {
    const abecedario = triggerAlphabetList();
    let valorGenerado: string;
    let indexAbecedario: number;
    switch (opcion) {
      case 1:
        indexAbecedario = Math.floor(Math.random() * 26);
        valorGenerado = abecedario[indexAbecedario].toUpperCase();
        break;
      case 2:
        valorGenerado = String(Math.floor(Math.random() * 10));
        break;
    }
    return valorGenerado;
  };

  /**
   * Función interna que genera una lista con todas las letras del abecedario en mayúsculas.
   * @returns {string[]} Un arreglo con las letras del abecedario.
   */
  const triggerAlphabetList = (): string[] => {
    const abecedario = [];
    for (let i = 97; i <= 122; i++) {
      abecedario.push(String.fromCharCode(i).toUpperCase());
    }
    return abecedario;
  };

  return { generateLpnLabel, generateArticleCode, generateLpnWitPrefixCode, generateLabelFromTemplate };
}
