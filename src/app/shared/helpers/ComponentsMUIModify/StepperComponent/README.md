# Documentación: StepperComponent

> **Ruta:** `src/app/shared/helpers/ComponentsMUIModify/StepperComponent.tsx`  
> **Tipo:** Componente React funcional genérico `<T>`  
> **Líneas:** ~420  
> **Fecha de documentación:** 14/07/2026

---

## Resumen

**StepperComponent** es un stepper visual avanzado y **genérico** con estilo "Qonto" (ícono de check animado, conectores con transición de color). Permite iterar sobre cualquier array de objetos (`T[]`) y visualizar el progreso paso a paso.

**Características principales:**

1. **Navegación:** Puede incluir botones "Atrás" y "Siguiente" integrados (control interno), o ser controlado externamente con `activeStepNumber`.
2. **Tooltips informativos:** Al hacer hover sobre pasos completados, puede mostrar un tooltip con propiedades específicas del objeto `T` (soporta path anidado, ej. `operator.name`).
3. **Animaciones:** El ícono de completado tiene un efecto `bounce` (escala) y el conector tiene una animación de progreso `processBarCompletes` (transición de color a verde).
4. **Tema oscuro:** El conector se adapta al modo del tema MUI.
5. **Botones estilizados:** Usa clases CSS globales generadas por `MaterialButtons` (azul para "Siguiente", rojo para "Atrás").

---

## Props

El componente utiliza un sistema de **discriminated unions** para definir grupos de props condicionales.

### Props base (`props<T>`)

| Prop                    | Tipo                     | Requerida | Descripción                                                    |
| ----------------------- | ------------------------ | --------- | -------------------------------------------------------------- |
| `orientationStepper`    | `"vertical" \| "horizontal"` | ✅    | Orientación del stepper.                                       |
| `itemList`              | `T[]`                    | ✅        | Array de objetos genéricos que representan cada paso.          |
| `labelStepper`          | `(item: T) => string`    | ✅        | Función para extraer el texto de la etiqueta del paso.         |
| `elementComplete`       | `(item: T) => boolean`   | ✅        | Función que determina si un paso está completado.              |
| `activeOptionalMessage` | `boolean`                | ❌        | Si es `true`, muestra "Ultimo Elemento" bajo la etiqueta del último paso. |
| `activeStepNumber`      | `number`                 | ✅        | Índice del paso activo actual (0-indexed).                     |
| `itemFinishedFunction`  | `(item: T) => void`      | ❌        | Callback al hacer clic en un paso completado (navegación histórica). |

### Props de navegación (condicionales)

**Si `activeButtonsNextAndBefore` es `true`:**

| Prop                    | Tipo                 | Requerida | Descripción                                  |
| ----------------------- | -------------------- | --------- | -------------------------------------------- |
| `activeButtonsNextAndBefore` | `true`         | ✅        | Activa botones "Atrás" y "Siguiente" internos. |
| `functionButtonNext`    | `() => void`         | ✅        | Callback al hacer clic en "Siguiente".       |
| `functionButtonBack`    | `() => void`         | ✅        | Callback al hacer clic en "Atrás".           |

**Si `activeButtonsNextAndBefore` es `false` u omitido:**

| Prop                    | Tipo                 | Requerida | Descripción                                  |
| ----------------------- | -------------------- | --------- | -------------------------------------------- |
| `activeButtonsNextAndBefore` | `false` (opcional) | ❌     | Botones desactivados.                        |
| `functionButtonNext`    | `() => void`         | ❌        | No requerido si no se activan los botones.   |
| `functionButtonBack`    | `() => void`         | ❌        | No requerido si no se activan los botones.   |

### Props de tooltips (condicionales)

**Si `activeTooltipItem` es `true`:**

| Prop                    | Tipo                     | Requerida | Descripción                                                    |
| ----------------------- | ------------------------ | --------- | -------------------------------------------------------------- |
| `activeTooltipItem`     | `true`                   | ✅        | Activa tooltips informativos en pasos completados.             |
| `arrayItemsVisualizer`  | `string[]`               | ✅        | Array de keys (paths) del objeto `T` a mostrar en el tooltip. |
| `stylesForToolTip`      | `React.CSSProperties`    | ✅        | Estilos CSS personalizados para el tooltip.                    |

**Si `activeTooltipItem` es `false` u omitido:**

| Prop                    | Tipo                     | Requerida | Descripción                                                    |
| ----------------------- | ------------------------ | --------- | -------------------------------------------------------------- |
| `activeTooltipItem`     | `false` (opcional)       | ❌        | Tooltips desactivados.                                         |
| `arrayItemsVisualizer`  | `string[]`               | ❌        | No requerido.                                                  |
| `stylesForToolTip`      | `React.CSSProperties`    | ❌        | No requerido.                                                  |

---

## Estado Local

| Variable       | Tipo               | Valor Inicial | Uso                                                           |
| -------------- | ------------------ | ------------- | ------------------------------------------------------------- |
| `direction`    | `"next" \| "back"` | `"next"`      | Determina la dirección de la navegación para activar/desactivar animaciones. |

---

## Hooks Utilizados

| Hook             | Origen    | Descripción                                                |
| ---------------- | --------- | ---------------------------------------------------------- |
| `useState`       | React     | Maneja `direction` para animar los pasos según la dirección. |
| `useCallback`    | React     | Memoiza `showInfoElement` para evitar recreación en cada render. Dependencia: `arrayItemsVisualizer`. |
| `MaterialButtons`| Interno (ver dependencias) | Retorna nombres de clases CSS para botones (`.mui-btn-blueButton`, `.mui-btn-redButton`). |

---

## Estado Redux

Ninguno. El componente no consume Redux.

---

## Formularios (React Hook Form)

Ninguno. El componente no usa formularios.

---

## Llamadas a API

Ninguna directa. El componente es puramente visual y de control de estado.

---

## Modelos / Interfaces

```typescript
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

type Props<T> = (ActiveButtonsNextAndBefore<T> | OptionalButtonsNextAndBefore<T>) &
  (ActiveToolTipVisualizer<T> | OptionalToolTipVisualizer<T>);
```

---

## Componentes MUI Utilizados

| Componente         | Paquete               | Uso                                                 |
| ------------------ | --------------------- | --------------------------------------------------- |
| `Box`              | `@mui/material`       | Contenedor principal y contenedor de botones.       |
| `Button`           | `@mui/material`       | Botones "Atrás" y "Siguiente".                      |
| `Step`             | `@mui/material`       | Cada paso del stepper.                              |
| `StepConnector`    | `@mui/material`       | Conector entre pasos (personalizado como `QuontoConnector`). |
| `StepIconProps`    | `@mui/material`       | Tipo para el icono personalizado del step.          |
| `StepLabel`        | `@mui/material`       | Etiqueta de cada paso.                              |
| `Stepper`          | `@mui/material`       | Componente stepper de MUI.                          |
| `Tooltip`          | `@mui/material`       | Tooltip en pasos completados (modo `HtmlTooltip`).  |
| `TooltipProps`     | `@mui/material`       | Tipo para las props del tooltip.                    |
| `Typography`       | `@mui/material`       | Texto "Ultimo Elemento" y encabezado del tooltip.   |
| `AdjustRounded`    | `@mui/icons-material` | Ícono de paso incompleto (círculo).                  |
| `Check`            | `@mui/icons-material` | Ícono de paso completado (check).                    |
| `keyframes`        | `@mui/material/styles` | Animaciones `bounce` y `processBarCompletes`.        |
| `styled`           | `@mui/material/styles` | Componentes estilizados: `QuontoConnector`, `QontoStepIconRoot`, `HtmlTooltip`. |

---

## Estilos Aplicados

### MUI `styled` Components

**QuontoConnector** (StepConnector personalizado):
- Línea activa: `borderColor: "#2264f99e"` con transición de 0.5s.
- Línea completada: `borderColor: "green"` con animación `processBarCompletes` (0.5s).
- Línea por defecto: `borderColor` según modo del tema (oscuro: `grey[800]`, claro: `#eaeaf0`).

**QontoStepIconRoot** (icono del step):
- Check completado: fondo verde, texto blanco, `fontSize: 30`, `borderRadius: "100%"`, padding.
- Círculo incompleto: `fill: "#2264f99e"`, `fontSize: 40`.
- Cuando `shouldAnimate` es `true`: animación `bounce` de 0.5s en el check.

**HtmlTooltip** (tooltip para pasos completados):
- `backgroundColor: "var(--secondary-color)"`.
- `border: "1px solid var(--background-color)"`.
- `padding: 0`.
- `color: "var(--text-color)"`.

### Tailwind CSS

| Clase                                                | Dónde se aplica                          |
| ---------------------------------------------------- | ---------------------------------------- |
| `hover:underline cursor-pointer hover:text-blue-500 transition-all duration-300` | Label de paso completado (clickeable).   |
| `flex flex-row gap-x-1 items-center py-1 px-2`       | Items dentro del tooltip.                |
| `font-bold`                                          | Key del campo en el tooltip.             |

### Variables CSS Utilizadas

| Variable                    | Uso                                          |
| --------------------------- | -------------------------------------------- |
| `var(--secondary-color)`    | Fondo del tooltip.                           |
| `var(--background-color)`   | Borde del tooltip.                           |
| `var(--text-color)`         | Color de texto del tooltip.                  |
| `var(--newsanLighten-color)`| Fondo del encabezado del tooltip.            |

### MUI `sx`

```tsx
// Contenedor principal
sx={{ width: "100%" }}

// Contenedor de botones de navegación
sx={{
  display: "flex",
  flexDirection: "row",
  gap: 4,
  justifyContent: "center",
  padding: "0 1.5rem",
  marginTop: "1rem"
}}
```

---

## Dependencias Internas

| Import              | Ruta                                                    | Propósito                               |
| ------------------- | ------------------------------------------------------- | --------------------------------------- |
| `MaterialButtons`   | `app/shared/components/material-ui/MaterialButtons`     | Clases CSS para botones (`.mui-btn-blueButton`, `.mui-btn-redButton`). |

---

## Funciones Auxiliares Internas

### `getPropertyWithin(obj: any, path: string)`
Divide el path por `.` y accede anidamente al objeto. Ej: `getPropertyWithin(item, "operator.plant.name")`.

**Ubicación:** Líneas 236-238 (dentro del archivo, no exportada).

### `QontoStepIcon(props, direction)`
Renderiza el ícono del paso: un check verde si `completed` es `true`, o un círculo azul si no. Usa `QontoStepIconRoot` para los estilos.

### `showInfoElement(elemento: T)`
Memoizada con `useCallback`. Renderiza los valores del objeto `T` según las keys indicadas en `arrayItemsVisualizer`. Soporta paths anidados.

---

## Notas y Consideraciones

- **Animación direccional:** El componente detecta la dirección del movimiento (`next`/`back`). Solo se anima el check (`bounce`) cuando se avanza (`direction === "next"`). Esto evita animaciones extrañas al retroceder.
- **Manejo de condicionales:** Se usan variables intermedias (`optionalContentStepsDefault`, `optionalMessageDefault`) para evitar errores si las props condicionales no están presentes.
- **Tooltip en completados:** El tooltip solo se muestra en **pasos completados** y cuando `activeTooltipItem` es `true`.
- **Último paso:** Si `activeOptionalMessage` es `true`, el último paso muestra "Ultimo Elemento" como texto opcional bajo la etiqueta.
- **Navegación histórica:** `itemFinishedFunction` permite al padre navegar a un paso completado cuando se hace clic en él.
- **TODO en código:** El archivo contiene comentarios sobre mejoras futuras (líneas 66-68, 412-420):
  - Poder rechazar items del recorrido.
  - Permitir cambiar los iconos de aprobado/espera.
  - Añadir modo para rechazar pasos.

---

## Ejemplo de Uso

```tsx
import { StepperComponent } from "app/shared/helpers/ComponentsMUIModify/StepperComponent";

interface IEtapa {
  id: number;
  nombre: string;
  detalle: string;
  fecha: string;
  finalizado: boolean;
}

const etapas: IEtapa[] = [
  { id: 1, nombre: "Recepción", detalle: "Material recibido", fecha: "10/07", finalizado: true },
  { id: 2, nombre: "Inspección", detalle: "En proceso", fecha: "11/07", finalizado: false },
  { id: 3, nombre: "Aprobación", detalle: "Pendiente", fecha: "", finalizado: false },
];

const [activeStep, setActiveStep] = useState(0);

// Ejemplo 1: Stepper básico (solo visual, control externo)
<StepperComponent
  orientationStepper="horizontal"
  activeStepNumber={activeStep}
  itemList={etapas}
  labelStepper={(item) => item.nombre}
  elementComplete={(item) => item.finalizado}
/>

// Ejemplo 2: Stepper completo con botones y tooltips
<StepperComponent
  orientationStepper="vertical"
  activeStepNumber={activeStep}
  itemList={etapas}
  labelStepper={(item) => item.nombre}
  elementComplete={(item) => item.finalizado}
  itemFinishedFunction={(item) => setActiveStep(etapas.indexOf(item))}

  // Botones de navegación
  activeButtonsNextAndBefore={true}
  functionButtonNext={() => setActiveStep((prev) => Math.min(prev + 1, etapas.length))}
  functionButtonBack={() => setActiveStep((prev) => Math.max(prev - 1, 0))}

  // Tooltips en completados
  activeTooltipItem={true}
  arrayItemsVisualizer={["detalle", "fecha"]}
  stylesForToolTip={{ backgroundColor: '#333', color: '#fff', fontSize: '12px' }}
/>
```

---

## Mejoras / Observaciones del Revisor

### StepperComponent

- **Tipado:** Uso extensivo de `any` inhabilitado con `/* eslint-disable @typescript-eslint/no-explicit-any */` (línea 1). La función `getPropertyWithin` usa `obj: any` y `path: string` sin restricciones. Podría tiparse mejor con genéricos o al menos `Record<string, unknown>`.

- **Tipado:** Los `eslint-disable` para `no-unused-vars` (líneas 2-3) están presentes pero no hay variables sin usar evidentes; podrían eliminarse.

- **Rendimiento:** `HtmlTooltip` (styled component) se define fuera del componente (líneas 222-232), lo cual es correcto. Sin embargo, `QontoStepIcon` (línea 241) se define fuera y recibe `direction` como segundo parámetro en lugar de accederlo desde el state/props, lo que es correcto pero inusual.

- **Rendimiento:** El `StepIconComponent` en `StepLabel` (línea 326) se define como una arrow function inline en cada render, lo que podría causar re-renderizados innecesarios. Debería memoizarse con `useCallback`.

- **Mantenibilidad:** El componente tiene **420 líneas**, lo que excede el tamaño recomendado. Podría dividirse en subcomponentes:
  - `StepperStep` (cada paso individual)
  - `StepperNavigation` (botones Atrás/Siguiente)
  - `StepperTooltip` (tooltip de información)

- **Mantenibilidad:** Hay **código comentado extenso** (líneas 66-68, 153-157, 412-420). El bloque comentado sobre "activeRejectionMode" y "TooltipHelperItemEnded" debería eliminarse o implementarse.

- **Mantenibilidad:** Variables como `optionalContentStepsDefault` y `optionalMessageDefault` son redundantes. Podría usarse directamente `activeButtonsNextAndBefore` y `activeOptionalMessage` (ya son booleans y están tipados).

- **Accesibilidad:** Los botones "Atrás" y "Siguiente" usan clases CSS globales (`buttonClases.redButton`, `buttonClases.blueButton`) sin `aria-label`. Sería bueno añadir descripciones para lectores de pantalla.

- **Accesibilidad:** El tooltip informativo (`HtmlTooltip`) aparece en hover pero no tiene soporte para enfoque por teclado. Los lectores de pantalla podrían no acceder al contenido del tooltip.

- **Accesibilidad:** El `StepLabel` completo es clickeable (si está completado), pero no tiene `role="button"` ni `tabIndex` explícito, lo que dificulta la navegación por teclado.

- **Bugs potenciales:** `alternativeLabel` se fuerza a `true` cuando la orientación es horizontal. Sin embargo, si `orientationStepper` es `"vertical"`, `alternativeLabel` es `false`. Esto es correcto, pero MUI desaconseja `alternativeLabel` con orientación vertical y podría causar warnings.

- **Bugs potenciales:** La animación `shouldAnimateItem` se activa cuando `direction === "next"` e `index === activeStepNumber - 1`. Si `activeStepNumber` es `0` (primer paso), la condición `index === -1` nunca se cumple, por lo que el primer paso completado nunca se anima. Esto es un bug.

- **Bugs potenciales:** `QontoStepIcon` se usa como `StepIconComponent` en `StepLabel`, pero el componente espera recibir las props de `StepIconProps` (que incluyen `active`, `completed`, `icon`, etc.). Se está pasando `direction` y `shouldAnimate` como props adicionales, lo que es correcto pero no está explícitamente documentado.

- **UX:** Cuando `activeButtonsNextAndBefore` es `true`, los botones se renderizan aunque no haya elementos en `itemList`. Podría ocultarse si `itemList.length === 0`.

- **UX:** El mensaje "Ultimo Elemento" tiene una errata ortográfica: debería ser "Último Elemento" con tilde.

- **Estándares SPP:** La interfaz `props<T>` no sigue la convención de prefijar con `I` (`IProps`). El proyecto SPP utiliza el prefijo `I` para interfaces.

- **Seguridad:** `getPropertyWithin` usa `reduce` para acceder a propiedades anidadas. Si el path contiene `__proto__`, `constructor` o `prototype`, podría haber un riesgo de **Prototype Pollution**. Aunque es bajo en este contexto, sería recomendable sanitizar o limitar los paths permitidos.

- **Deuda técnica:** Los comments de mejora (líneas 418-420) indican funcionalidades planificadas que nunca se implementaron. Sería bueno crear tickets/tareas en lugar de dejarlos en el código.
