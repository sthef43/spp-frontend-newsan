# Documentación del Módulo Principal (Main / Inicio)

Este módulo representa la página de inicio de la aplicación, diseñada para proporcionar a los usuarios un acceso rápido a sus módulos favoritos y una forma eficiente de navegar por todas las funciones disponibles del sistema.

## 🏛️ Estructura de la Carpeta

La carpeta `src/app/shared/components/main` está organizada de la siguiente manera:

- **`Components/`**: Contiene los subcomponentes principales de la vista.
- **`Modals/`**: Ventanas emergentes para la gestión de favoritos y prioridades.
- **`Models/`**: Definiciones de tipos y DTOs específicos del módulo.
- **`Utils/`**: Funciones de utilidad para visualización.
- **`MainView.component.tsx`**: El componente raíz que orquestra la vista.

---

## 🧩 Componentes Principales

### 1. MainViewComponent (`MainView.component.tsx`)

Es el contenedor principal. Se encarga de:

- Recuperar la información del usuario desde Redux.
- Realizar las peticiones iniciales para obtener las rutas favoritas y todos los módulos permitidos.
- Gestionar el estado de los filtros (búsqueda por texto y filtro por categoría/padre).
- Renderizar la estructura general usando `ContainerForPages`.

### 2. ListaRoutesFavoritesComponent (`Components/ListaRoutesFavoritesComponent.tsx`)

Muestra los módulos marcados como favoritos por el usuario.

- **Prioridad**: Permite destacar un módulo (se muestra con un gradiente azul y ocupa más espacio).
- **Gestión**: Permite eliminar módulos de la lista de favoritos.
- **Límite**: El sistema está configurado para mostrar un número limitado de favoritos (generalmente hasta 11-12 según el dispositivo).

### 3. ListaRoutesComponent (`Components/ListaRoutesComponent.tsx`)

Muestra el listado completo de módulos o los resultados filtrados.

- **Comportamiento Aleatorio**: Si no hay filtros aplicados, muestra una selección aleatoria de módulos para dinamismo.
- **Búsqueda**: Filtra en tiempo real por nombre del módulo y por su "padre" (categoría).
- **Acción**: Permite añadir módulos a la lista de favoritos directamente desde el listado.

---

## 🛠️ Utilidades y Modales

### AsignarImagenSegunPadre (`Utils/AsignarImagenSegunPadre.tsx`)

Una función utilitaria que devuelve un icono de Material-UI basado en la categoría "Padre" del módulo. Esto proporciona una identidad visual consistente según el área (Calidad, Producción, Administración, etc.).

### Modales de Gestión

- **CambiarModuloPrioridadModal**: Permite al usuario seleccionar cuál de sus favoritos debe ser el módulo de "Prioridad".
- **AgregarRutasFavoritasModal**: Una interfaz alternativa (usando Sliders) para ver todos los módulos disponibles organizados por categoría y gestionarlos como favoritos.

---

## ⚙️ Funcionamiento Técnico

### Flujo de Datos

- **Redux**: Utiliza `useAppSelector` para obtener `infoUser` y `useAppDispatch` para acciones de favoritos.
- **Peticiones**: Utiliza el helper `FetchApi` y el hook `useFetchApiMultiResults` para interactuar con los endpoints de:
  - `RoutesFavoritesOperatorBloqSliceRequest`: Gestión de favoritos.
  - `PermisosRoutesSliceRequests`: Obtención de rutas según permisos.

### Lógica de Filtros

La búsqueda combina:

1. `filtradoInput`: Texto ingresado en el buscador.
2. `filtradoSelect`: Categoría seleccionada en el dropdown.

```typescript
listaRoutesFiltrada = listaRoutes.filter((ruta) => {
  return (
    ruta.nombre.toLowerCase().includes(filtradoInput.toLowerCase()) &&
    ruta.padre.toLowerCase().includes(filtradoSelect.toLowerCase())
  );
});
```

---

## 🚀 Cómo usar este módulo

Para integrar o modificar la página de inicio:

1. **Añadir un nuevo icono**: Si se crea una nueva categoría de módulos, debe actualizarse el switch en `AsignarImagenSegunPadre.tsx`.
2. **Modificar Estilos**: La mayoría de los estilos usan Tailwind CSS. El archivo `MainView.css` se utiliza para estilos muy específicos de la vista.
3. **Límites de Favoritos**: El control de la cantidad máxima de favoritos se encuentra en `ListaRoutesComponent.tsx` (función `verificarCantidadAgregadas`).
