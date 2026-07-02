import { PermisosRoutesSliceRequests } from "app/features/manejoSistema/slices/PermisosRoutesSlice";
import { PermisosSliceRequests } from "app/features/manejoSistema/slices/PermisosSlice";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { RoutesSliceRequests } from "app/features/manejoSistema/slices/RoutesSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPermisos, IRol } from "app/models";
import { IPermisosRoutes } from "app/models/IPermisosRoutes";
import { IRoutes } from "app/models/IRoutes";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Button, MenuItem, Switch, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import produce from "immer";
import _, { Dictionary } from "lodash";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

export const PermissionsRoutesPage = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();
  const [permisoId, setpermisoId] = useState(0);
  const permisosUser = useAppSelector((state) => state.authentification.data.permisos as IPermisos);
  const [permisosList, setPermisosList] = useState<IPermisos[]>();
  const [groupedPermissions, setgroupedPermissions] = useState<Dictionary<any>>({});
  const [permisos_rutas, setPermisos_rutas] = useState<IPermisosRoutes[]>();
  const { State: routesList, setState: setRoutesList } = useFetchApi<IRoutes[]>(RoutesSliceRequests.getAllRequest);
  const [roles, setroles] = useState<IRol[]>();
  const [selectedRol, setselectedRol] = useState<IRol>(permisosUser.rol);
  useEffect(() => {
    TitleChanger("Manejo de rutas");
    (async () => {
      if (permisosUser.rolId !== 2) {
        setPermisosList(unwrapResult(await dispatch(PermisosSliceRequests.getByRolId(permisosUser.rolId))));
      } else {
        // setPermisosList(unwrapResult(await dispatch(PermisosSliceRequests.getByRolId(permisosUser.rolId))));
        getInformation();
      }
    })();
  }, []);
  const getInformation = async () => {
    const result = unwrapResult(await dispatch(RolSliceRequests.getAllRequest()));
    setroles(result);
  };
  useEffect(() => {
    if (permisoId > 0) {
      // console.log(permisoId);
      (async () => {
        setPermisos_rutas(unwrapResult(await dispatch(PermisosRoutesSliceRequests.getAllByIdRequest(permisoId))));
      })();
    }
  }, [permisoId]);

  useEffect(() => {
    selectedRol && getInformationRoles(selectedRol);
  }, [selectedRol]);
  //una vez que la lista de permisos esta lista me fijo que permisos puede ver

  //una vez selecionado el persmiso me traigo las rutas que corresponden a ese permiso
  const { openNotificationUI } = useNotificationUI();

  useEffect(() => {
    if (permisoId > 0) {
      (async () => {
        setPermisos_rutas(unwrapResult(await dispatch(PermisosRoutesSliceRequests.getAllByIdRequest(permisoId))));
      })();
    }
  }, [permisoId]);
  useEffect(() => {
    if (routesList?.length > 0) {
      setgroupedPermissions(_.groupBy(routesList, (x) => x.padre));
    }
  }, [routesList]);
  const handleChange = (elemento: IRoutes) => {
    const infoId = permisos_rutas.findIndex((x) => x.routeId == elemento.id);
    setPermisos_rutas(
      produce((draft) => {
        if (infoId >= 0) {
          if (draft[infoId].id) {
            draft[infoId].deleted = !draft[infoId].deleted;
          } else {
            _.remove(draft, (x) => x.routeId == elemento.id);
          }
        } else {
          draft.push({
            permisoId: permisoId,
            routeId: elemento.id,
            deleted: false
          });
        }
      })
    );
  };
  const getInformationRoles = async (rol) => {
    setPermisosList(unwrapResult(await dispatch(PermisosSliceRequests.getByRolId(rol.id))));
  };
  const guardar = async () => {
    const envio = _.cloneDeep(permisos_rutas);
    envio.map((x) => (x.permiso = undefined));
    unwrapResult(await dispatch(PermisosRoutesSliceRequests.multiPutRequest(envio))) &&
      openNotificationUI("rutas actualizadas con exito actualizado con éxito", "success");
  };
  return (
    <div>
      <TitleUIComponent title="Selecione las rutas que veran los usuarios con su subrol" />
      <div className="bg-secondaryNew shadow-elevation-8 rounded-md my-2 p-4">
        {permisosUser.rolId != 2 ? (
          <TextField fullWidth value={selectedRol.name} />
        ) : (
          <TextField
            fullWidth
            select
            value={selectedRol.id}
            defaultValue={0}
            onChange={(e: any) => {
              const rol = roles.find((x) => x.id == e.target.value);
              setselectedRol(rol as any);
              setPermisos_rutas(null);
              // getInformationRoles(rol);
            }}>
            {roles?.map((x) => (
              <MenuItem key={x.id} value={x.id}>
                {x.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          fullWidth
          value={permisoId}
          onChange={(e) => {
            if (e.target.value) {
              setpermisoId(Number(e.target.value));
            }
          }}>
          {permisosList?.map((x) => (
            <MenuItem key={x.id} value={x.id}>
              {x.subrol.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {permisos_rutas && (
        <div className="h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew w-full">
          <div className="h-full">
            {Object.keys(groupedPermissions)?.map((key, index) => (
              <div key={key} className="grid grid-cols-2 border">
                <div>{key}</div>
                <div className="grid grid-cols-1">
                  {groupedPermissions[key].map((elemento, indexEl) => (
                    <div key={elemento.id}>
                      <Switch
                        checked={permisos_rutas.some((x) => x.routeId == elemento.id && x.deleted == false)}
                        onChange={() => handleChange(elemento)}
                      />
                      <span>{elemento.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button
              variant="contained"
              className={classes.greenButton}
              onClick={() => {
                guardar();
              }}>
              Guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
