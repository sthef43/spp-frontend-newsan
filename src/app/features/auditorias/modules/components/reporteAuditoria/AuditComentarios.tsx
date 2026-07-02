import { Avatar, Box, SnackbarContent } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { useAppDispatch } from "app/core/store/store";
import { IOperator } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
interface Props {
  mensaje: string;
  userDni: number;
}
export const AuditComentarios = ({ mensaje = "Hola como estas12321312", userDni }: Props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [infoUser, setInfoUser] = useState<IOperator>(null);

  const getInfoUser = async () => {
    try {
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(userDni || 0)));
      setInfoUser(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    getInfoUser();

    return () => {
      setInfoUser(null);
    };
  }, []);

  return (
    <div className="flex w-full m-2 items-center min-w-min ">
      <Box
        className="text-2xl font-sans px-4 py-2"
        textAlign="center"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ maxWidth: "50px" }}>
          {infoUser && (
            <Avatar alt={infoUser?.name} className="col-span-1 w-full">
              {infoUser?.name + " " + infoUser.surname}
            </Avatar>
          )}
        </div>
        <div className=" text-gray-50 text-xs font-medium text-left">
          {infoUser && <div className="text-center">{infoUser?.name + " " + infoUser?.surname}</div>}
        </div>
      </Box>
      <div className="rounded-lg border-rose-900 bg-red-400  w-full">
        <SnackbarContent
          message={mensaje}
          style={{ backgroundColor: "InfoBackground", color: "black" }}
          color="success"
        />
      </div>
    </div>
  );
};
