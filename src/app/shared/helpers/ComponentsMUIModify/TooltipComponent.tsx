/* eslint-disable unused-imports/no-unused-vars */
import { IconButton, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from "@mui/material";
import React, { FC, ReactNode } from "react";

interface props {
  /** El contenido (título) principal a mostrar dentro del tooltip. */
  titleTooltip: string | ReactNode;
  /** El ícono a renderizar dentro del botón (ej. <DeleteIcon />). */
  componenteIcono?: ReactNode;
  /** Contenido adicional (ej. un <p>) para mostrar *dentro* del tooltip. **Solo se usa en modo `HtmlType`**. */
  children?: ReactNode; // Corregido el typo 'chilldren'
  /** Si es `true`, el `IconButton` estará deshabilitado. */
  disabled?: boolean;
  /** El tamaño del `IconButton`. */
  sizeButton?: "small" | "medium" | "large";
  /** Estilos en línea para aplicar directamente al `IconButton`. */
  styleIconButton?: React.CSSProperties;
}

interface TypeTooltipHtml extends props {
  typeTooltip: "HtmlType";
  /** **Requerido si `typeTooltip` es `HtmlType`**. Objeto de estilos CSS para aplicar al popper del tooltip. */
  styleTooltip: React.CSSProperties;
}

interface TypeTooltipNormal extends props {
  typeTooltip: "normal";
  styleTooltip?: React.CSSProperties;
}

// Omite 'title' y 'children' de TooltipProps porque los manejamos manualmente
type ForwardedTooltipProps = Omit<TooltipProps, "title" | "children">;

// Combina los props personalizados con todos los demás props de Tooltip
type Props = (TypeTooltipNormal | TypeTooltipHtml) & ForwardedTooltipProps;

/**
 * Componente que encapsula un `IconButton` de Material-UI dentro de un `Tooltip`.
 * Simplifica la creación de botones con íconos que tienen tooltips, ofreciendo un modo
 * "normal" y un modo "HtmlType" para estilos y contenido personalizado.
 *
 * Reenvía todas las props estándar de `Tooltip` (como `placement`, `arrow`, `enterDelay`)
 * al componente `Tooltip` subyacente.
 *
 * @param {Props} props - Propiedades para configurar el botón con tooltip.
 *
 * @param {"normal" | "HtmlType"} props.typeTooltip - Define el modo de operación:
 * - `"normal"`: Renderiza un `Tooltip` estándar de MUI.
 * - `"HtmlType"`: Renderiza un `Tooltip` personalizado que permite estilos (`styleTooltip`) y contenido complejo (`children`).
 *
 * @param {ReactNode} props.componenteIcono - El componente de ícono (ej. `<DeleteIcon />`) que se mostrará dentro del botón.
 * @param {string} props.titleTooltip - El texto principal a mostrar en el tooltip.
 *
 * @param {boolean} [props.disabled=false] - Si es `true`, el `IconButton` se mostrará deshabilitado.
 * @param {"small" | "medium" | "large"} [props.sizeButton] - El tamaño del `IconButton`.
 * @param {React.CSSProperties} [props.styleIconButton] - Estilos CSS en línea para aplicar al `IconButton`.
 *
 * @param {React.CSSProperties} [props.styleTooltip] - **Requerido si `typeTooltip` es `HtmlType`**. Objeto de estilos para el popper del tooltip.
 * @param {ReactNode} [props.children] - Contenido adicional para mostrar *dentro* del tooltip, **solo en modo `HtmlType`**.
 *
 * @param {ForwardedTooltipProps} [props...rest] - Todas las demás props de `TooltipProps` de MUI (como `placement`, `arrow`, `enterDelay`, `enterNextDelay`, etc.) se pasarán automáticamente.
 *
 * @example
 * // Ejemplo de uso "normal" con 'placement' (prop reenviado)
 * <TooltipComponent
 * typeTooltip="normal"
 * titleTooltip="Eliminar registro"
 * componenteIcono={<DeleteIcon />}
 * onClickFunction={() => console.log('Eliminado')}
 * placement="top"
 * />
 *
 * @example
 * // Ejemplo de uso "HtmlType" con estilos, 'arrow' y 'enterDelay' (props reenviados)
 * <TooltipComponent
 * typeTooltip="HtmlType"
 * titleTooltip="Información Adicional"
 * componenteIcono={<InfoIcon />}
 * styleTooltip={{ backgroundColor: '#333', color: 'white' }}
 * arrow
 * enterDelay={500}
 * >
 * <Typography variant="caption">Este es un detalle extra.</Typography>
 * </TooltipComponent>
 */
export const TooltipComponent: FC<Props> = ({
  typeTooltip,
  titleTooltip,
  componenteIcono,
  disabled,
  sizeButton,
  children,
  styleIconButton,
  styleTooltip,
  ...rest // Aquí se capturan 'placement', 'arrow', 'enterDelay', etc.
}) => {
  const typeTooltipPredetermined = typeTooltip ? typeTooltip : "normal";

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: styleTooltip
  }));

  const selectTypeTooltip = (typeTooltipPredetermined: string) => {
    switch (typeTooltipPredetermined) {
      case "normal":
        return (
          <>
            <Tooltip title={titleTooltip} {...rest} PopperProps={{ sx: { zIndex: 99999 } }}>
              <span>
                <IconButton disabled={disabled} size={sizeButton} style={styleIconButton}>
                  {componenteIcono}
                </IconButton>
              </span>
            </Tooltip>
          </>
        );
      case "HtmlType":
        return (
          <>
            <HtmlTooltip
              {...rest}
              title={
                <>
                  <Typography>{titleTooltip}</Typography>
                  {children}
                </>
              }>
              <span>
                <IconButton disabled={disabled} size={sizeButton} style={styleIconButton}>
                  {componenteIcono ? componenteIcono : null}
                </IconButton>
              </span>
            </HtmlTooltip>
          </>
        );
    }
  };

  return <div className="flex flex-row items-center">{selectTypeTooltip(typeTooltipPredetermined)}</div>;
};
