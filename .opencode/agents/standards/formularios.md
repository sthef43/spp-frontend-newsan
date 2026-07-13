# Estándares de Formularios

## Gestión del Formulario

- Todos los formularios deben utilizar `useForm` de `react-hook-form`.
- El formulario debe estar correctamente tipado mediante una interfaz o type.
- Los `defaultValues` deben declararse fuera del cuerpo del componente.

---

## Componentes de Formulario

Todos los campos de entrada deben utilizar los componentes estandarizados del proyecto:

- `InputComponentForm`
- `SelectComponentForm`

El objeto `control` obtenido desde `useForm` debe enviarse a dichos componentes.

---

## Componentes Deprecados

No utilizar:

- `TextFieldComponent`
- `SelectComponent`

Estos componentes deben reemplazarse por:

- `InputComponentForm`
- `SelectComponentForm`

---

## Validaciones

Todos los campos obligatorios deben definir la regla `required`.
Todos los `SelectComponentForm` que tienen tipado tipo `int` se debe agregar el validate, para que el numero seleccionado sea mayor a 0
---

## Botón Submit

El botón de envío debe permanecer deshabilitado mientras el formulario no sea válido.

Utilizar `formState.isValid` o el mecanismo estándar definido por el proyecto.

---

## Tipado

Todos los formularios deben contar con:

- interfaz o type
- `defaultValues`
- tipado correcto de `useForm`