import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { PermisosSliceRequests } from "app/features/manejoSistema/slices/PermisosSlice";
import { PlantSliceRequests } from "app/Middleware/reducers/PlantSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IAppUser, IPermisos, IPlant, ITurno } from "app/models";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";

const schema = yup
  .object()
  .shape({
    username: yup.string().min(4).max(32).required(),
    email: yup.string().email().required(),
    validado: yup.bool(),
    password: yup
      .string()
      .required("Ingrese una contraseña valida")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Debe contener 8 caracteres, una minuscula, una mayuscula y un numero"
      ),
    // .test("exist", "este dni existe", (value) => {
    //   return emailIsUnique(value);
    // }),
    dni: yup.number().required().positive().integer(),
    operator: yup.object().shape({
      name: yup.string().min(1).required(),
      plantaId: yup.number().min(1).required().default(4),
      surname: yup.string().min(1).required(),
      turnoId: yup.number().min(1).required().positive().integer(),
      position: yup.string().min(1).required()
    })
  })
  .required();
const defaultState = {
  username: "",
  email: "",
  password: "",
  dni: 1,
  operator: {
    name: "",
    plantaId: 4,
    surname: "",
    turnoId: 1,
    position: ""
  },
  permisosId: 1
};
const defaultLabels = {
  username: "Nombre de usuario",
  email: "Email",
  dni: "Dni",
  operator: {
    name: "Nombre",
    plantaId: "Planta",
    surname: "Apellido",
    turnoId: "Turno",
    position: "Posicion"
  },
  validado: "Validado"
};
export const PermissionsUserPage = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [state, setstate] = useState<any>();
  const { openNotificationUI } = useNotificationUI();
  const [selectedUser, setselectedUser] = useState<IAppUser>(null);
  const { State: usuarios } = useFetchApi<IAppUser[]>(AppUserSliceRequests.getAllUsers);

  const { getConfirmation } = useConfirmationDialog();

  //const [permisosList, setPermisosList] = useState<Dictionary<[IPermisos, ...IPermisos[]]>>();
  const [permisosList, setPermisosList] = useState<IPermisos[]>();
  useEffect(() => {
    TitleChanger("Cambios de permisos usuario");
    (async () => {
      const result = unwrapResult(await dispatch(PermisosSliceRequests.getAllRequest()));
      //const grouped = _.groupBy(result, (x) => x.rol.id);
      //setPermisosList(grouped);
      setPermisosList(result);
    })();
  }, []);
  const { control, reset, getValues } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  });
  const { State: Plantas } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);

  const { State: Turnos } = useFetchApi<ITurno[]>(TurnoSliceRequests.getAllRequest);
  React.useEffect(() => {
    setstate({
      Turno: { array: Turnos, id: "id", column: "nombre" },
      Planta: { array: Plantas, id: "id", column: "name" }
    });
  }, [Turnos, Plantas]);

  useEffect(() => {
    reset({ ...selectedUser });
  }, [selectedUser]);

  const CustomAutocomplete = (options, onChange, defaultValue) => {
    return (
      <Autocomplete
        options={options}
        onChange={onChange}
        defaultValue={defaultValue}
        getOptionLabel={(option) => option.operator.name + " " + option.operator.surname}
        renderInput={(props) => <TextField {...props} fullWidth label="Usuario del sistema" />}
      />
    );
  };

  const [valor, setValor] = useState();

  const handleChange = (e, value) => {
    // what to do here?
    if (value) setselectedUser(usuarios?.find((x) => x.id === value?.id));
  };

  const handleGuardar = async () => {
    const resultado = _.cloneDeep(getValues());
    unwrapResult(await dispatch(AppUserSliceRequests.PutRequest(resultado))) &&
      openNotificationUI("Usuario actualizado con exito", "success");
    unwrapResult(await dispatch(AppUserSliceRequests.getAllUsers()));
  };

  const resetearContrasenia = async () => {
    const confirma = await getConfirmation("Restablecer contraseña.", "¿ Seguro que desea restablecer la contraseña ?");
    if (confirma) {
      const reseteoOk = unwrapResult(await dispatch(AppUserSliceRequests.resetearContrasenia(selectedUser.id)));
      if (reseteoOk) {
        openNotificationUI("Contraseña reestablecida exitosamente :)", "success");
      }
    }
  };

  return (
    <div>
      <TitleUIComponent title="Selecione un usuario para modificar su información" />
      <div className="bg-secondaryNew shadow-elevation-4 rounded-md m-5 p-4">
        {CustomAutocomplete(usuarios, handleChange, valor)}
        {selectedUser && (
          <>
            <div className="grid grid-cols-3">
              <GenericFieldsGenerator
                values={selectedUser}
                control={control}
                styleDiv={"my-2"}
                styleFieldSX={{}}
                selectFields={state}
                labels={defaultLabels}
                variant="filled"
              />
            </div>
            <div>
              <Controller
                name="permisosId"
                control={control}
                defaultValue={1}
                render={({ field, fieldState: { error } }) => (
                  <TextField {...field} label="Permisos" fullWidth select>
                    {_.orderBy(permisosList, ["rol.name", "subrol.name"]).map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        {x.rol.name + "   " + x.subrol.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
          </>
        )}
        <div className="flex justify-center my-2">
          <Button variant="contained" onClick={handleGuardar} color="success">
            Guardar
          </Button>
        </div>
        {selectedUser && (
          <div className="flex justify-center my-2">
            <Button variant="contained" onClick={resetearContrasenia} color="success">
              Resetear Contraseña
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
