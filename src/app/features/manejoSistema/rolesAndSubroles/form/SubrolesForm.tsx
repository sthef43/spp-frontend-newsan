import { PermisosSliceRequests } from "app/features/manejoSistema/slices/PermisosSlice";
import { SubRolSliceRequests } from "app/features/manejoSistema/slices/SubRolSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPermisos, IRol, ISubRol } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { SubrolesTable } from "../components/SubrolesTable";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { Button } from "@mui/material";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
interface ISubrolesForm {
  rol: IRol;
  closeForm: (state: boolean) => void;
}
export const SubrolesForm = ({ closeForm, rol }: ISubrolesForm): JSX.Element => {
  const subroles = useAppSelector((state) => state.subrol.dataAll as ISubRol[]);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClasses = MaterialButtons();

  const [rolSubroles, setRolSubroles] = useState([] as IPermisos[]);

  const onGetSubrolesByRol = async () => {
    try {
      const response = await dispatch(PermisosSliceRequests.getByRolId(rol.id));
    } catch (err) {
      openNotificationUI(err, "error");
    }
  };

  const onGetSubroles = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(SubRolSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const onSubmit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await Promise.all(rolSubroles.map((p) => onSaveSubrolAndRol(p)));
      openNotificationUI("Se agregaron/quitaron con éxito", "success");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      closeForm(false);
    } catch (err) {
      openNotificationUI(err, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  const onSaveSubrolAndRol = async (permiso: IPermisos) => {
    try {
      if (permiso.deleted == true && permiso.id == 0) return;
      if (permiso.id == 0) {
        await dispatch(PermisosSliceRequests.PostRequest(permiso));
      } else if (permiso.deleted == true) {
        await dispatch(PermisosSliceRequests.PutRequest(permiso));
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const checkSubroles = () => {
    const oldPermisos: IPermisos[] = subroles.flatMap(
      (subrol) => subrol.permisos.find((p) => p.rolId === rol.id) || []
    );
    oldPermisos.length > 0 && setRolSubroles(oldPermisos);
  };
  // Un subrol puede tener una relacion con el rol asique lo busco y agrego o pongo el deleted en true para sacarlo
  const onChangePermisos = (subrolId: number, state: boolean) => {
    const oldPermiso = rolSubroles.find((rs) => rs.subrolId == subrolId);
    if (oldPermiso) {
      const newPermiso = { ...oldPermiso, deleted: !state };
      const newPermisos = rolSubroles.filter((rs) => rs.subrolId !== subrolId);
      setRolSubroles([...newPermisos, newPermiso]);
    } else {
      const newPermiso: IPermisos = { id: 0, deleted: false, rolId: rol.id, subrolId };
      setRolSubroles([...rolSubroles, newPermiso]);
    }
  };

  useEffect(() => {
    onGetSubrolesByRol();
    onGetSubroles();
  }, []);
  useEffect(() => {
    if (subroles?.length > 0) {
      checkSubroles();
    }
  }, [subroles]);
  return (
    <div>
      <SubrolesTable changeSubroles={onChangePermisos} permisos={rolSubroles} />
      <div className="flex justify-center">
        <div className=" m-4">
          <Button className={buttonClasses.greenButton} onClick={onSubmit} type="submit" variant="contained">
            Guardar
          </Button>
        </div>
        <div className=" m-4 ">
          <Button
            className={buttonClasses.redButton}
            type="button"
            variant="contained"
            onClick={() => closeForm(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
