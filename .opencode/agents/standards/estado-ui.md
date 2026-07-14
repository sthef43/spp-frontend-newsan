# Estándares de Estado, UI y Patrones

## Estado Global

- Utilizar `useAppSelector` y `useAppDispatch` para interactuar con Redux Toolkit.
- No utilizar implementaciones alternativas para acceder al estado global.

---

## Navegación

- Utilizar `useHistory` para la navegación.
- Utilizar `useParams` para obtener parámetros de la URL.

---

## Título de la Aplicación

- Utilizar `useTitleOfApp`.
- Obtener `TitleChanger` desde dicho hook.
- Actualizar el título mediante un `useEffect` que responda a los cambios correspondientes.

---

## Confirmaciones

Para operaciones de escritura que no utilicen `FetchApi` o `useFetchApiMultiResults`:

- Utilizar `useConfirmationDialog`.
- Utilizar `getConfirmation` antes de ejecutar la operación.

---

## Notificaciones

Para funciones propias:

- Utilizar `useNotificationUI`.
- Utilizar `openNotificationUI`.

Cuando la operación se realiza mediante `FetchApi` o `useFetchApiMultiResults`, no utilizar `openNotificationUI`, ya que ambas implementaciones gestionan las notificaciones automáticamente.

---

## Layout

Las páginas principales deben estar envueltas por:

```tsx
<ContainerForPages
    optionsLayout="page"
    activeEffectVisible
>
```

---

## Tablas

`TableComponent` debe estar contenido dentro de:

```tsx
<ContainerForPages
    optionsLayout="Table"
    activeEffectVisible
>
```

---

## Formularios de Cabecera

Los campos de filtros o selección deben agruparse utilizando:

```tsx
<ContainerForPages
    optionsLayout="Selects"
>
```

---

## Estilos

- Utilizar utilidades de Tailwind CSS para la estructura visual del componente.
- Asegurar que los estilos y layouts implementados sean responsivos (diseño responsive), adaptándose correctamente a diferentes tamaños de pantalla.

---

## Modals

El archivo del componente es:

`ModalComponent.tsx`

El componente exportado es:

`ModalCompoment`

Esto es intencional.

No corregir el nombre del componente ni del archivo salvo que el usuario lo solicite explícitamente.

No modificar el nombre del componente.

Las props que debe utilizar son:

- `title` — Título del modal
- `children` — Contenido del modal (requerido)
- `openPopup` — Controla si el modal está abierto
- `setOpenPopup` — Función para cerrar/abrir el modal
- `showModalCenterPage` — Posiciona el modal centrado
- `titleModalStyle` — El estilo de cabecera siempre debe de ser (`"Audit"`)
- `subTitle` — Subtítulo (solo para estilo `"Audit"`)