import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAuditRegistryResult, IEmailGroup } from "app/models";
import useFetchApi from "app/shared/hooks/useFetchApi";
import produce from "immer";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AddEmails } from "../../components/reporteAuditoria/AuditNameInfoAndGroup";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import _ from "lodash";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { AuditRegistryResultSliceRequests } from "app/features/audit/slices/AuditRegistryResultSlice";
import { AuditRegistrySliceRequests } from "app/features/audit/slices/AuditRegistrySlice";
import { AuditTrackingSliceRequest } from "app/features/audit/slices/AuditTrackingSlice";
interface Props {
  setOpenModal: any;
  auditRegistryResult: IAuditRegistryResult;
  auditRegistryId: number;
}
export const AuditTrackingFormModal = ({ setOpenModal, auditRegistryResult, auditRegistryId }: Props) => {
  const Rol = useAppSelector((state) => state.appUser.data as any).permisos?.rol;
  const { openNotificationUI } = useNotificationUI();
  const roles = useAppSelector((data) => data.rol.dataAll);
  const dispatch = useAppDispatch();
  const classesButton = MaterialButtons();
  const { control, watch, formState, handleSubmit } = useForm({
    defaultValues: {
      rolId: null,
      emailsGroup: "",
      comentario: ""
    }
  });
  const { isDirty, isValid } = formState;
  const [auditTracking, setAuditTracking] = useState({
    auditRegistryResultId: auditRegistryResult?.id,
    auditRegistryId: auditRegistryId,
    auditComentario: [{ userDni: GetInfoUser().dni || 0, comentario: "" }],
    rolId: 0,
    tracking: true,
    resuelto: false,
    emailGroup: "",
    auditOfId: Rol?.id || 0,
    creatorUser: ""
  });

  const [SelectedEmailGroup, setSelectedEmailGroup] = useState<string>("");
  const { State: listOfEmailGroups } = useFetchApi<IEmailGroup[]>(EmailGroupSliceRequests.getAllRequest);
  function changeEmailsGroups(e: string) {
    setSelectedEmailGroup(
      produce((draft) => {
        return draft.concat(e);
      })
    );
  }
  function removeEmail(x: string) {
    setSelectedEmailGroup(
      produce((draft) => {
        return draft.replace(x, "");
      })
    );
  }
  const divideEmails = (SelectedEmailGroup: string) => {
    {
      return SelectedEmailGroup.split(";").map((x, index, array) => (
        <div className="flex items-center" key={index}>
          <div className="text-md sm:text-lg uppercase w-full">{x}</div>
          <IconButton
            color="secondary"
            onClick={() => {
              if (index > 0) {
                removeEmail(`;${x}`);
              }
              if (index === 0 && array?.length > 1) {
                removeEmail(`${x};`);
              }
              if (index === 0 && array?.length === 1) {
                removeEmail(`${x}`);
              }
            }}
            size="large">
            <CloseIcon />
          </IconButton>
        </div>
      ));
    }
  };

  const onSubmit = async (e) => {
    try {
      if (auditTracking.emailGroup.length > 5) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen());
        const refreshARR: IAuditRegistryResult = {
          id: auditRegistryResult.id,
          valorId: auditRegistryResult.valorId,
          auditRegistryId: auditRegistryResult.auditRegistryId,
          comentario: auditRegistryResult.comentario,
          itemBloqId: auditRegistryResult.itemBloqId,
          createdDate: auditRegistryResult.createdDate,
          deleted: false,
          tracking: true
        };
        const response = unwrapResult(await dispatch(AuditTrackingSliceRequest.NestedAddRequest(auditTracking)));
        const sendEmails2 = await dispatch(EmailSliceRequest.SendEmailAuditTrackingEmailGroup(response.id));
        if (sendEmails2) {
          console.log(sendEmails2);
        }
        const response1 = await dispatch(AuditRegistryResultSliceRequests.PutRequest(refreshARR));
        const refresh = await dispatch(AuditRegistrySliceRequests.getAllByIdAndFlag(auditRegistryId));
        openNotificationUI("Se asigno el seguimiento correctamente", "success");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        setOpenModal(false);
      } else {
        openNotificationUI("Tiene que incluir un grupo de emails", "error");
      }
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const HandleChangeComent = (coment: string, older: any) => {
    setAuditTracking({ ...older, auditComentario: [{ ...auditTracking.auditComentario[0], comentario: coment }] });
  };
  const getInfoUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0)));
      setAuditTracking({ ...auditTracking, creatorUser: response.name + " " + response.surname });
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  //   Espero que termine el comentario
  const debo = useMemo(() => _.debounce(HandleChangeComent, 1000), []);

  //   Escucho el form
  const rolWatch = watch("rolId");
  const comentarioWatch = watch("comentario");

  useEffect(() => {
    if (comentarioWatch?.length > 1) {
      debo(comentarioWatch, auditTracking);
    }
  }, [comentarioWatch]);
  useEffect(() => {
    dispatch(RolSliceRequests.getAllRequest());
    getInfoUser();
  }, []);
  useEffect(() => {
    setAuditTracking({ ...auditTracking, rolId: rolWatch });
  }, [rolWatch]);
  useEffect(() => {
    setAuditTracking({ ...auditTracking, emailGroup: SelectedEmailGroup });
  }, [SelectedEmailGroup]);
  useEffect(() => {
    console.log(auditRegistryResult);
  }, [auditRegistryResult]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        <div className="sm:col-span-2 animate__animated animate__fadeIn shadow-elevation-4 p-2 w-full rounded-md border-2 border-gray-400 dark:border-gray-500">
          <div className="text-xl text-center font-bold m-1">Grupo de emails para el seguimiento</div>
          {SelectedEmailGroup?.length < 4 && (
            <FormControl fullWidth variant="standard" className="sm:col-span-2">
              <InputLabel>Grupo de Emails</InputLabel>
              <Select
                name="emailsGroup"
                value={""}
                onChange={(e) => {
                  changeEmailsGroups(e.target.value as string);
                }}
                variant="standard">
                {listOfEmailGroups &&
                  listOfEmailGroups.map((element, index) => (
                    <MenuItem value={element.emails as any} key={element.id}>
                      <div className="text-lg">{element.name}</div>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          {SelectedEmailGroup?.length > 4 && (
            <div>
              {divideEmails(SelectedEmailGroup)}
              <AddEmails changeEmailsGroups={changeEmailsGroups} />
            </div>
          )}
        </div>
        <Controller
          name="rolId"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un rol</InputLabel>
                <Select {...field} variant="outlined">
                  {roles &&
                    roles.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div className="w-full">
                          <div>{x.name}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            );
          }}
        />
        <Controller
          name="comentario"
          control={control}
          rules={{ required: true, minLength: 2 }}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <TextField label="Comentario" multiline {...field} />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            );
          }}
        />
        <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button
            className={classesButton.greenButton}
            type="submit"
            variant="contained"
            disabled={!isDirty && !isValid}>
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
};
