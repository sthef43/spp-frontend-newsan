import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobComentarioSliceRequests } from "app/Middleware/reducers/DobComentarioSlice";
import { useAppDispatch } from "app/core/store/store";
import moment from "moment";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
interface props {
  dobPlanoId: number;
}

export default function AprobacionPlanosComentarios({ dobPlanoId }: props): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  // const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const [messages, setMessages] = React.useState(null);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const getMessages = async () => {
    let fetchResult = [];
    try {
      fetchResult = unwrapResult(await dispatch(DobComentarioSliceRequests.getListByDobPlanoIdRequest(dobPlanoId)));
      setMessages(fetchResult);
    } catch (error) {
      openNotificationUI("Error al leer mensajes.", "error");
    }
  };

  React.useEffect(() => {
    if (dobPlanoId != 0) getMessages();
  }, []);

  return (
    <div style={{ width: "1000px" }}>
      <Box sx={{ pb: 7 }} ref={ref}>
        <CssBaseline />
        {messages && (
          <List>
            {messages.map(({ appUser, comentario, id, imagen, createdDate }, index) => (
              <ListItem key={id}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture">
                    {appUser && appUser?.operator?.name[0] + " " + appUser?.operator?.surname[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    appUser?.operator?.name + " " + appUser?.operator?.surname + " - " + moment(createdDate).format("L")
                  }
                  secondary={comentario}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </div>
  );
}
