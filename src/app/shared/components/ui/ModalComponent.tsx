/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MaterialButtons } from "../material-ui/MaterialButtons";

interface Props {
  title: string;
  backgroundColor?: string;
  subTitle?: string;
  children: JSX.Element;
  openPopup: boolean;
  setOpenPopup: (newValue: boolean) => void;
  theme?: string;
  onCloseDynamic?: boolean;
  showModalCenterPage?: boolean;
  hiddenButtonClose?: boolean;
  titleModalStyle?: "Classic" | "New" | "Audit";
  subTitleClassName?: string;
}

interface ActiveButtonsAction extends Props {
  showButtons: true;
  functionButtonSave: () => void;
}

interface OptionalButtonsAction extends Props {
  showButtons?: false;
  functionButtonSave?: () => void;
}

type ModalComponentProps = ActiveButtonsAction | OptionalButtonsAction;

/**
 * Componente genérico para renderizar un modal (Dialog) de Material-UI con estilos personalizados.
 * Proporciona dos estilos de cabecera y control sobre el comportamiento de cierre.
 *
 * @param {props} props - Propiedades para configurar el modal.
 * @param {string} props.title - El texto que se mostrará en la cabecera del modal.
 * @param {ReactNode} props.children - El contenido que se renderizará dentro del modal.
 * @param {boolean} props.openPopup - Estado booleano que controla si el modal está abierto o cerrado.
 * @param {(isOpen: boolean) => void} props.setOpenPopup - Función para actualizar el estado `openPopup` (generalmente un `setState`).
 * @param {"Classic" | "New"} [props.titleModalStyle="Classic"] - Define el estilo de la cabecera. "Classic" tiene un título centrado con fondo; "New" tiene un título alineado con el botón de cierre.
 * @param {boolean} [props.onCloseDynamic=false] - Controla el comportamiento de cierre.
 * - Si es `false` (default): El modal se puede cerrar haciendo clic fuera (backdrop) o presionando 'Escape'.
 * - Si es `true`: El modal **NO** se cerrará con clic en el backdrop o con 'Escape', forzando al usuario a usar una acción explícita (como el botón 'X').
 * @param {boolean} [props.showModalCenterPage=false] - Controla la posición del modal.
 * - Si es `false` (default): El modal se posiciona de forma fija en la parte superior de la pantalla.
 * - Si es `true`: El modal utiliza el posicionamiento por defecto de MUI (generalmente centrado).
 * @param {boolean} [props.hiddenButtonClose=false] - Si es `true`, oculta el botón 'X' para cerrar el modal.
 * @param {string} [props.theme] - (Prop opcional para un tema, actualmente no utilizada en la lógica del componente).
 *
 * @example
 * // Modal clásico, se cierra con clic afuera
 * <ModalCompoment
 * title="Mi Modal"
 * openPopup={isOpen}
 * setOpenPopup={setIsOpen}
 * >
 * <p>Este es el contenido del modal.</p>
 * </ModalCompoment>
 *
 * @example
 * // Modal "New" estilo "sticky" (no se cierra fácil) y centrado
 * <ModalCompoment
 * title="Confirmar Acción"
 * openPopup={isConfirmOpen}
 * setOpenPopup={setIsConfirmOpen}
 * titleModalStyle="New"
 * onCloseDynamic={true}
 * showModalCenterPage={true}
 * >
 * <p>Debe seleccionar una opción para continuar.</p>
 * </ModalCompoment>
 */

export const ModalCompoment = ({
  title,
  children,
  openPopup,
  setOpenPopup,
  theme,
  onCloseDynamic,
  showModalCenterPage,
  hiddenButtonClose,
  titleModalStyle,
  backgroundColor,
  functionButtonSave,
  showButtons,
  subTitle,
  subTitleClassName
}: ModalComponentProps): JSX.Element => {
  const buttonClasses = MaterialButtons();

  const typeStyleHeader = titleModalStyle ? titleModalStyle : "Classic";
  const backgroundColorChange = backgroundColor ? backgroundColor : "var(--secondary-color)";

  const showModalCenterPageFalse = showModalCenterPage ? showModalCenterPage : false;
  const hiddenButtonCloseFalse = hiddenButtonClose ? hiddenButtonClose : false;

  const stylesClassicModalComponent = {
    backgroundColor: backgroundColorChange,
    padding: "16px",
    position: showModalCenterPageFalse ? "" : "fixed",
    top: showModalCenterPageFalse ? 0 : "16px",
    bottom: showModalCenterPageFalse ? 0 : "16px",
    paddingBottom: 0,
    maxWidth: "unset",
    height: "fit-content"
  };

  const stylesNewModalComponent = {
    backgroundColor: backgroundColorChange,
    position: showModalCenterPageFalse ? "" : "fixed",
    top: showModalCenterPageFalse ? 0 : "16px",
    bottom: showModalCenterPageFalse ? 0 : "16px",
    paddingBottom: 0,
    maxWidth: "unset",
    height: "fit-content"
  };

  /**
   * Manejador de cierre que PREVIENE el cierre por backdrop o la tecla ESC.
   * @internal
   */
  const handleCloseModal = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    if (reason && reason === "escapeKeyDown") {
      return;
    }
    setOpenPopup(false);
  };

  /**
   * Renderiza el estilo de la cabecera del modal.
   * @internal
   */
  const selectTypeStyle = (typeStyleHeader: string) => {
    switch (typeStyleHeader) {
      case "Classic":
        return (
          <>
            {!hiddenButtonCloseFalse && (
              <button
                className="absolute right-2 top-2"
                color="secondary"
                onClick={() => {
                  setOpenPopup(false);
                }}>
                <CloseIcon />
              </button>
            )}
            <DialogTitle>
              <div className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan shadow-elevation-6 rounded-md text-gray-900 dark:text-gray-200 ">
                <div className="rounded-xl text-center px-4 py-2">
                  <h1 className="text-2xl text-gray-50 capitalize">{title}</h1>
                </div>
              </div>
            </DialogTitle>
          </>
        );
      case "New":
        return (
          <DialogTitle className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan text-white">
            <div className="flex flex-row justify-between items-end w-full">
              <div className="w-16"></div>
              <div>
                <p className="text-xl">{title}</p>
              </div>
              <div>
                <button
                  className={`${hiddenButtonClose ? "hidden" : "block"}`}
                  onClick={() => {
                    setOpenPopup(false);
                  }}>
                  <CloseIcon sx={{ fill: "white" }} />
                </button>
              </div>
            </div>
          </DialogTitle>
        );
      case "Audit": {
        const clasesSubtitulo = subTitleClassName ? subTitleClassName : "text-sm text-gray-400 mt-1";
        return (
          <DialogTitle className="bg-backgroundModalAudit text-textColor">
            <div className="flex flex-row justify-between items-center w-full">
              <div>
                <p className="text-xl font-semibold">{title}</p>
                {subTitle && <p className={clasesSubtitulo}>{subTitle}</p>}
              </div>
              <div>
                <button
                  className={`${
                    hiddenButtonClose ? "hidden" : "block"
                  } py-[.1rem] px-3 text-lg font-bold text-white bg-backgroundColorButtonCloseModal rounded-lg hover:bg-primaryNew transition-colors duration-200`}
                  onClick={() => {
                    setOpenPopup(false);
                  }}>
                  X
                </button>
              </div>
            </div>
          </DialogTitle>
        );
      }
    }
  };

  return (
    <Dialog
      PaperProps={typeStyleHeader === "Classic" ? { sx: stylesClassicModalComponent } : { sx: stylesNewModalComponent }}
      onClose={(e, reason) => {
        onCloseDynamic ? handleCloseModal(e, reason) : setOpenPopup(false);
      }}
      open={openPopup}>
      {selectTypeStyle(typeStyleHeader)}
      <DialogContent dividers sx={{ maxHeight: "none", borderBottom: "0px" }}>
        {children}
      </DialogContent>
      {showButtons && (
        <div className="flex justify-center">
          <div className="m-4">
            <Button
              className={buttonClasses.greenButton}
              type="submit"
              variant="contained"
              onClick={() => {
                functionButtonSave();
              }}>
              Aceptar
            </Button>
          </div>
          <div className=" m-4 ">
            <Button
              className={buttonClasses.redButton}
              type="button"
              variant="contained"
              onClick={() => {
                setOpenPopup(false);
              }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export const ModalComponent = ModalCompoment;
