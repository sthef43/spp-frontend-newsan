**Nuevas reglas para añadir al agente "Reviewer"**

- **1\_ En caso de que estes modificando algun modal y no este usando el `<ContainerForPages>` debes usarlo, siguiendo estas reglas:**

  ```typescript
  <ContainerForPages optionsLayout="modal" activeEffectVisible></ContainerForPages>
  ```

- **2\_ Si hay una tabla dentro del modal y no esta usando el `<ContainerForPages>` debes usarlos siguiendo estas reglas:**

  ```typescript
  <ContainerForPages optionsLayout="Table" tableForModalOrPageStyle="Modal"></ContainerForPages>
  ```

- **3\_ La prop que tiene el `<ContainerForPages>` `activeEffectVisible` Solamente se debe usar en los contenedores de la paginas**

- **4\_ Cuando veas que un `FetchApi` esta llamando a una api en cada renderizado, debes cambiarlo a que solo se ejecute cuando el valor del objeto pasado como parametro cambie o cuando el estado que controle el renderizado sea `true`, en algunos casos usa un useState ya que eso tambien ayudara cuando hagas un `POST` `PUT` o `DELETE` y quieras recargar los datos en la funcion callback `functionAdd`**

- **5\_ En caso de que veas un select que no esta siendo controlado por el useForm quiero que los cambies por [SelectComponentNormal](\src\app\shared\helpers\ComponentsForForms\SelectComponentNormal.tsx) y hagas la validacion de que si no hay nada seleccionado el boton pase a estar deshabilitado, si hay un boton de guardar o editar quiero que cuando se presione primero valide el select y si es necesario muestre un el mensaje con el componente [openNotificationUI](\src\app\shared\hooks\useNotificationUI.tsx) con el mensaje de error, si el valor es correcto entonces que continue con la funcion que tenga asignada**
