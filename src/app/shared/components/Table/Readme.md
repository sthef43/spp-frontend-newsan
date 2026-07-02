Propiedades principales y de configuración
dataInfo: Es el array de datos que se va a mostrar en la tabla. Cada objeto en el array representa una fila.

columns: Es un array de objetos que define las columnas de la tabla. Cada objeto dentro de este array tiene:

title: El título de la columna.

field: La propiedad del objeto de datos que se mostrará en esa columna.

render: Opcional. Una función que te permite personalizar lo que se muestra en la celda de la tabla. Por ejemplo, si quieres mostrar una fecha en un formato específico o un nombre completo a partir de un nombre y un apellido.

lookup: Opcional. Un objeto que permite filtrar la columna con valores específicos.

IDcolumn: El nombre de la propiedad que contiene un identificador único para cada fila. Es crucial para que React pueda renderizar la lista de manera eficiente.

showFooter: Si se establece en true, se muestra el pie de página de la tabla. Por defecto es true.

Dense: Si se establece en true, la tabla se muestra con menos espacio entre filas, haciéndola más compacta.

Propiedades de funcionalidad
AsyncData: Una función que le dice a la tabla que obtenga los datos de forma asíncrona (generalmente desde una API). Esta propiedad es útil para tablas con muchos datos que no se pueden cargar de una sola vez.

buscar: Si es true, la tabla muestra un campo de búsqueda (TextField) para filtrar los datos.

agregar: Una función que se ejecuta cuando el usuario hace clic en el botón "Agregar".

button: Permite pasar un componente de botón personalizado para que aparezca junto al buscador.

rightButton: Un objeto que define un botón adicional a la derecha del buscador.

name: El texto del botón.

func: La función que se ejecutará al hacer clic en el botón.

setFiltroSeleccionadoProp: Una función que recibe el valor del filtro seleccionado cuando se usa un filtro de tipo lookup.

Propiedades de exportación
excel: Si se establece en true, la tabla muestra un botón para exportar los datos a un archivo de Excel.

transformExcel: Si es true, los datos se transforman antes de ser exportados. Se usa en conjunto con transformRegex.

transformRegex: Un array de objetos que contiene reglas de transformación para los datos antes de exportarlos a Excel. Cada objeto tiene key (la propiedad a transformar) y regex (la expresión regular para la transformación).

fileNameExcel: El nombre del archivo de Excel a exportar.

Propiedades para el colapsado de filas
Collapse: Si es true, permite que las filas de la tabla se puedan colapsar y expandir para mostrar información adicional.

CollapseExtraModulesBefore: Un componente que se renderizará antes del módulo de acciones al colapsar una fila.

CollapseExtraModulesAfter: Un componente que se renderizará después del módulo de acciones al colapsar una fila.

CollapseOverride: Un componente que anula el comportamiento por defecto de la fila colapsada.

Propiedades para acciones en las filas
Estas propiedades se usan con Collapse para mostrar botones de acción dentro de cada fila.

Edit: Una función que se ejecuta al hacer clic en el botón de "Editar".

Delete: Una función que se ejecuta al hacer clic en el botón de "Eliminar".

Watch: Una función que se ejecuta al hacer clic en el botón de "Ver".

rowStyle: Una función que te permite aplicar estilos CSS personalizados a una fila específica, como cambiar el color de fondo de una fila según un valor.

USO
import { TableComponent } from "./TableComponent";

// Tus datos de ejemplo
const data = [
{ id: 1, name: "Juan Perez", age: 30, city: "Buenos Aires" },
{ id: 2, name: "Maria Garcia", age: 25, city: "Cordoba" },
// ... más datos
];

// La configuración de tus columnas
const columns = [
{ title: "ID", field: "id" },
{ title: "Nombre", field: "name" },
{ title: "Edad", field: "age" },
{ title: "Ciudad", field: "city", lookup: { "Buenos Aires": "Bs. As.", "Cordoba": "Córdoba" } },
];

// Renderizar el componente
<TableComponent
  dataInfo={data}
  columns={columns}
  IDcolumn="id"
  buscar={true}
  excel={true}
/>
