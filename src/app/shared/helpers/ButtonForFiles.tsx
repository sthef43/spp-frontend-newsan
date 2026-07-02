/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import { Button } from "@mui/material";
import { useRef } from "react";

interface baseProps {
  multipleFiles?: boolean;
  functionFile: (e) => void;
  children?: JSX.Element;
  textButton: string;
  disabled?: boolean;
  stylesContainer?: string;
}

interface ActiveButtonMui extends baseProps {
  buttonMui: true;
  styles?: string;
  classNameButton: string;
  variantButton: "text" | "outlined" | "contained";
}

interface OptionalButtonMui extends baseProps {
  buttonMui?: false;
  styles: string;
  classNameButton?: string;
  variantButton?: "text" | "outlined" | "contained";
}

export type Props = ActiveButtonMui | OptionalButtonMui;

/**
 * Componente reutilizable que renderiza un botón para la selección de archivos.
 * Abstrae la lógica de un `<input type="file" />` oculto, permitiendo usar un botón
 * de Material-UI o un botón HTML estándar para activar la ventana de selección de archivos.
 *
 * @param {Props} props - Las propiedades para configurar el botón.
 * @param {boolean} [props.buttonMui=false] - Si es `true`, renderiza un `<Button>` de Material-UI. Si es `false` o se omite, renderiza un `<button>` HTML estándar.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.functionFile - La función callback que se ejecuta cuando el usuario selecciona uno o más archivos.
 * @param {string} props.textButton - El texto que se mostrará dentro del botón.
 * @param {boolean} [props.multipleFiles=false] - Si es `true`, permite la selección de múltiples archivos.
 * @param {ReactNode} [props.children] - Nodos hijos opcionales para renderizar dentro del botón (ej. un ícono).
 * @param {"text" | "outlined" | "contained"} [props.variantButton] - **Requerido si `buttonMui` es `true`**. El estilo del botón de Material-UI.
 * @param {string} [props.classNameButton] - **Requerido si `buttonMui` es `true`**. Clases CSS para el botón de Material-UI.
 * @param {string} [props.styles] - **Requerido si `buttonMui` es `false`**. Clases CSS (ej. de Tailwind) para el botón HTML.
 * @example
 * // Uso con Material-UI Button
 * <ButtonForFiles
 * buttonMui={true}
 * variantButton="contained"
 * classNameButton="my-mui-class"
 * textButton="Subir Archivo"
 * functionFile={handleFileChange}
 * />
 *
 * @example
 * // Uso con botón HTML y clases de Tailwind
 * <ButtonForFiles
 * styles="bg-blue-500 text-white p-2 rounded"
 * textButton="Seleccionar"
 * functionFile={handleFileChange}
 * multipleFiles={true}
 * />
 */

export const ButtonForFiles: FC<Props> = ({
  styles,
  buttonMui,
  classNameButton,
  functionFile,
  children,
  multipleFiles,
  textButton,
  variantButton,
  disabled,
  stylesContainer
}) => {
  const ref: any = useRef(null);

  const seleccionarImagen = () => {
    ref.current.click();
  };

  return (
    <main className={stylesContainer}>
      {buttonMui ? (
        <Button
          variant={variantButton}
          type="button"
          onClick={seleccionarImagen}
          className={classNameButton}
          disabled={disabled}>
          <input
            type="file"
            accept="image/png, image/jpeg, .pdf, .xlsx, .xdoc, .doc, .csv"
            name="cargarImagen"
            onChange={functionFile}
            ref={ref}
            multiple={multipleFiles ? true : false}
            className="hidden"
          />
          {textButton}
          {children && children}
        </Button>
      ) : (
        <button type="button" onClick={seleccionarImagen} className={`${styles}`} disabled={disabled}>
          <input
            type="file"
            accept="image/png, image/jpeg, .pdf, .xlsx, .xdoc, .doc, .csv"
            name="cargarImagen"
            onChange={functionFile}
            ref={ref}
            multiple={multipleFiles ? true : false}
            className="hidden"
          />
          {textButton}
          {children && children}
        </button>
      )}
    </main>
  );
};
