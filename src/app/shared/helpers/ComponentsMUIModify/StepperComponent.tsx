/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { AdjustRounded, Check } from "@mui/icons-material";
import { keyframes, styled } from "@mui/material/styles";

//En esta interfaz si necesito añadir algun estado al ownerState lo declaro aca y luego lo paso en el "QuontoStepIcon" asi funcionan los estilos
interface QontoStepIconPropsCustom extends StepIconProps {
  active?: boolean;
  completed?: boolean;
  direction: "next" | "back";
  shouldAnimate?: boolean;
}

interface props<T> {
  orientationStepper: "vertical" | "horizontal";
  itemList: T[];
  labelStepper: (item: T) => string;
  elementComplete: (item: T) => boolean;
  activeOptionalMessage?: boolean;
  activeStepNumber: number;
  itemFinishedFunction?: (item: T) => void;
}

interface ActiveButtonsNextAndBefore<T> extends props<T> {
  activeButtonsNextAndBefore: true;
  functionButtonNext: () => void;
  functionButtonBack: () => void;
}

interface OptionalButtonsNextAndBefore<T> extends props<T> {
  activeButtonsNextAndBefore?: false;
  functionButtonNext?: () => void;
  functionButtonBack?: () => void;
}

interface ActiveToolTipVisualizer<T> extends props<T> {
  activeTooltipItem: true;
  arrayItemsVisualizer: string[];
  stylesForToolTip: React.CSSProperties;
}

interface OptionalToolTipVisualizer<T> extends props<T> {
  activeTooltipItem?: false;
  arrayItemsVisualizer?: string[];
  stylesForToolTip?: React.CSSProperties;
}

//SEGUIR CON EL TEMA DE PODER RECHAZAR UN ITEM DEL RECORRIDO
// interface ActiveRejectionMode<T> extends props<T> {
//   activeRejectionMode: true;
// }

type Props<T> = (ActiveButtonsNextAndBefore<T> | OptionalButtonsNextAndBefore<T>) &
  (ActiveToolTipVisualizer<T> | OptionalToolTipVisualizer<T>);

/**
 * Componente Stepper avanzado y **Genérico** con estilo visual "Qonto" (animaciones de check y conectores).
 * Permite iterar sobre cualquier array de objetos (`T[]`) y visualizar el progreso.
 *
 * **Características principales:**
 * 1. **Navegación:** Puede incluir botones "Atrás" y "Siguiente" integrados o ser controlado externamente.
 * 2. **Tooltips de Información:** Puede mostrar un tooltip personalizado al pasar el mouse sobre pasos completados, renderizando propiedades específicas del objeto `T`.
 *
 * @template T - El tipo de dato (interfaz/objeto) de los elementos en la lista.
 * @param {Props<T>} props - Las propiedades del componente.
 *
 * --- PROPS GENERALES ---
 * @param {"vertical" | "horizontal"} props.orientationStepper - Orientación visual del stepper.
 * @param {T[]} props.itemList - Array de datos genéricos que conforman los pasos.
 * @param {number} props.activeStepNumber - Índice del paso actual activo.
 * @param {(item: T) => string} props.labelStepper - Función para extraer el texto de la etiqueta del paso desde el objeto `T`.
 * @param {(item: T) => boolean} props.elementComplete - Función lógica para determinar si un paso está completado.
 * @param {(item: T) => void} [props.itemFinishedFunction] - Callback al hacer clic en un paso completado (útil para navegación histórica).
 * @param {boolean} [props.activeOptionalMessage=false] - Muestra "Ultimo Elemento" bajo el último paso.
 *
 * --- PROPS DE NAVEGACIÓN (Condicionales) ---
 * @param {boolean} [props.activeButtonsNextAndBefore=false] - Activa los botones internos de navegación.
 * @param {() => void} [props.functionButtonNext] - **Requerido si `activeButtonsNextAndBefore` es `true`**. Acción del botón Siguiente.
 * @param {() => void} [props.functionButtonBack] - **Requerido si `activeButtonsNextAndBefore` es `true`**. Acción del botón Atrás.
 *
 * --- PROPS DE TOOLTIPS (Condicionales) ---
 * @param {boolean} [props.activeTooltipItem=false] - Activa la visualización de información detallada en tooltip para los pasos completados.
 * @param {string[]} [props.arrayItemsVisualizer] - **Requerido si `activeTooltipItem` es `true`**. Array de strings que corresponden a las **claves (keys)** del objeto `T` que se desean mostrar en el tooltip.
 * @param {React.CSSProperties} [props.stylesForToolTip] - **Requerido si `activeTooltipItem` es `true`**. Estilos CSS para personalizar la apariencia del tooltip.
 *
 * @example
 * // Ejemplo 1: Stepper Básico (Sin botones internos, sin tooltips)
 * <StepperComponent
 * orientationStepper="horizontal"
 * activeStepNumber={0}
 * itemList={[{id: 1, name: 'Paso 1'}]}
 * labelStepper={(item) => item.name}
 * elementComplete={(item) => item.id < 1}
 * />
 *
 * @example
 * // Ejemplo 2: Stepper Completo (Botones y Tooltips activados)
 * // Supongamos T = { id: number, nombre: string, detalle: string, fecha: string }
 * <StepperComponent
 * orientationStepper="vertical"
 * itemList={misDatos}
 * activeStepNumber={currentStep}
 * labelStepper={(item) => item.nombre}
 * elementComplete={(item) => item.completed}
 *
 * // Configuración de Botones
 * activeButtonsNextAndBefore={true}
 * functionButtonNext={nextHandler}
 * functionButtonBack={backHandler}
 *
 * // Configuración de Tooltips
 * activeTooltipItem={true}
 * arrayItemsVisualizer={["detalle", "fecha"]} // Solo mostrará estas propiedades en el tooltip
 * stylesForToolTip={{ backgroundColor: '#333', color: 'white', fontSize: '12px' }}
 * />
 */

//Keyframe para que cuando el item sea aprobado se genere el efecto de rebote.
const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

//Keyframe para generar la barra de progeso (MEJORAR) cuando esta llendo de un item a otro.
const processBarCompletes = keyframes`
  0% { border-color: rgba(0, 128, 0, 0.5); }
  50% { border-color: rgba(0, 128, 0, 0.75); }
  100% { border-color: rgba(0, 128, 0, 1); }
`;

//Estilos personalizados para la barra del tiempo con la que se conectan los items.
//Agregando la animacion de la barra de progreso
const QuontoConnector = styled(StepConnector)(({ theme }) => ({
  //ESTO ES POR SI SE QUIERE MODIFICAR LA LINEA DEL TIEMPO YA SEA TAMAÑANO O POSICION.
  // [`&.${stepConnectorClasses.alternativeLabel}`]: {
  //   top: 10,
  //   left: "calc(15% + -43px)",
  //   right: "calc(15% + 50px)"
  // },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      transition: "all .5s ease",
      borderColor: "#2264f99e"
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      animation: `${processBarCompletes} .5s ease`,
      borderColor: "green"
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1
  }
}));

//Estilos personalizados tanto para la raiz del componente y tambien para cuando el item fue completado o esta marcado como en progreso.
const QontoStepIconRoot = styled("div")<{ ownerState: QontoStepIconPropsCustom }>(({ theme, ownerState }) => ({
  transition: "none",
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    fill: "#784af4",
    transition: "fill 0.4s ease"
  }),
  ...(ownerState.completed && {
    transition: "color 0.4s ease, background-color 0.4s ease, fill 0.4s ease"
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#ffffff",
    zIndex: 1,
    fontSize: 30,
    backgroundColor: "green",
    padding: "0.2rem",
    borderRadius: "100%"
  },
  ...(ownerState.shouldAnimate && {
    "& .QontoStepIcon-completedIcon": {
      animation: `${bounce} .5s ease`,
      color: "#ffffff",
      zIndex: 1,
      fontSize: 30,
      backgroundColor: "green",
      padding: "0.2rem",
      borderRadius: "100%"
    }
  }),
  "& .QontoStepIcon-IncompletedIcon": {
    color: "#ffffff",
    zIndex: 1,
    fontSize: 40,
    padding: "0.2rem",
    borderRadius: "100%",
    fill: "#2264f99e"
  }
}));

//Estructura para que se pase por base de el prop "stylesForToolTip" los estilos para el ToolTip.
//Estos son los estilos predeterminados que tiene el Tooltip, si se deben añadir otros estilos añadirlos desde el componente donde se esta usando el "StepperComponent"
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "var(--secondary-color)",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid var(--background-color)",
    padding: "0",
    color: "var(--text-color)"
  }
}));

//Funcion interna que la funcionalidad es que pueda acceder a objetos dentro de item.
//Por ejemplo: operator.name, operator.plant.name, etc.
const getPropertyWithin = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

//Condicional para que si el item este completo se ponga el icon de check de lo contrario el circulo.
const QontoStepIcon = (props: QontoStepIconPropsCustom, direction: "next" | "back") => {
  const { active, completed, className, icon, shouldAnimate } = props;
  return (
    <QontoStepIconRoot ownerState={{ active, direction, icon, shouldAnimate }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <AdjustRounded className="QontoStepIcon-IncompletedIcon" />
      )}
    </QontoStepIconRoot>
  );
};

export const StepperComponent = <T,>({
  orientationStepper,
  itemList,
  elementComplete,
  labelStepper,
  activeOptionalMessage,
  activeButtonsNextAndBefore,
  functionButtonBack,
  functionButtonNext,
  activeStepNumber,
  itemFinishedFunction,
  activeTooltipItem,
  arrayItemsVisualizer,
  stylesForToolTip
}: Props<T>) => {
  const [direction, setDirection] = useState<"next" | "back">("next");

  //Estilos para los botones de "atras" y "siguiente".
  const buttonClases = MaterialButtons();

  //Condicionales que son para que no se generen errores por si no llamo los props cuando uso el componente.
  const optionalContentStepsDefault = activeButtonsNextAndBefore ? activeButtonsNextAndBefore : false;
  const optionalMessageDefault = activeOptionalMessage ? activeOptionalMessage : false;

  //Esta es la funcion donde segun el array que se pasa como prop "arrayItemsVisualizer" se muestren solamente esos datos.
  //Se pueden pasar valores que estan en el objeto principal como objetos que estan dentro del principal.
  //Por ejemplo: operator.dni, operator.plant.name, etc
  const showInfoElement = useCallback(
    (elemento: T) => {
      if (!arrayItemsVisualizer) {
        return null;
      }
      return (
        <>
          {arrayItemsVisualizer.map((pathKey, index) => {
            const value = getPropertyWithin(elemento, pathKey);
            if (value === undefined || value === null) {
              return null;
            }
            return (
              <div className="flex flex-row gap-x-1 items-center py-1 px-2" key={index}>
                <p className="font-bold">{pathKey.toUpperCase()}:</p>
                <p>{String(value)}</p>
              </div>
            );
          })}
        </>
      );
    },
    [arrayItemsVisualizer]
  );

  //Componente en general.
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        activeStep={activeStepNumber}
        orientation={orientationStepper}
        alternativeLabel={orientationStepper == "horizontal" ? true : false}
        connector={<QuontoConnector />}>
        {itemList.map((elementos, index) => {
          let completo = false;
          const stepProps: { completed?: boolean } = {};
          const labelProps: { error?: boolean } = {};
          if (elementComplete(elementos)) {
            stepProps.completed = true;
            completo = true;
          }
          const shouldAnimateItem = completo && direction === "next" && index === activeStepNumber - 1;
          const labelContent = labelStepper(elementos);
          const stepLabelComponent = (
            <StepLabel
              StepIconComponent={(props) => (
                <QontoStepIcon {...props} direction={direction} shouldAnimate={shouldAnimateItem} />
              )}
              {...labelProps}
              onClick={() => {
                itemFinishedFunction && itemFinishedFunction(elementos);
              }}
              className={`${
                completo ? "hover:underline cursor-pointer hover:text-blue-500 transition-all duration-300" : ""
              }`}
              optional={
                optionalMessageDefault &&
                (index === itemList.length - 1 ? <Typography variant="caption">Ultimo Elemento</Typography> : null)
              }>
              {labelContent}
            </StepLabel>
          );
          return (
            <Step key={index} {...stepProps}>
              {activeTooltipItem && completo ? (
                <>
                  <HtmlTooltip
                    componentsProps={{ tooltip: { style: stylesForToolTip } }}
                    title={
                      <>
                        <Typography
                          sx={{
                            backgroundColor: "var(--newsanLighten-color)",
                            textAlign: "center",
                            marginBottom: "8px",
                            color: "white",
                            padding: ".3rem"
                          }}>
                          Informacion sobre el item
                        </Typography>
                        {showInfoElement(elementos)}
                      </>
                    }>
                    <div className="w-full">{stepLabelComponent}</div>
                  </HtmlTooltip>
                </>
              ) : (
                <>{stepLabelComponent}</>
              )}
            </Step>
          );
        })}
      </Stepper>
      <>
        {optionalContentStepsDefault && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              justifyContent: "center",
              padding: "0 1.5rem",
              marginTop: "1rem"
            }}>
            <Button
              onClick={() => {
                functionButtonBack();
                setDirection("back");
              }}
              disabled={activeStepNumber == 0}
              className={buttonClases.redButton}
              variant="contained">
              Atras
            </Button>
            <Button
              disabled={itemList.length == activeStepNumber}
              onClick={() => {
                functionButtonNext();
                setDirection("next");
              }}
              className={buttonClases.blueButton}
              variant="contained">
              Siguiente
            </Button>
          </Box>
        )}
      </>
    </Box>
  );
};

// const TooltipHelperItemEnded = () => {
//   return(

//   )
// }

//MEJORAS PARA IMPLEMENTAR EN UN FUTURO
//1)_ Que se le permita poder cambiar los iconos de cuando esta aprobado y cuando esta en espera,
//2)_ Añadir el modo para que se puedan rechazar los pasos que se siguieron.
