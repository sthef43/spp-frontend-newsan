import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import moment from "moment";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { HojaPComentarioSliceRequests } from "app/Middleware/reducers/HojaPComentarioSlice";

interface props {
  hojaParametrosId: number;
}

export default function HojaParametrosComentarios({ hojaParametrosId }: props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState(null);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //Leer mensajes
  const getMessages = async () => {
    let fetchResult = [];
    try {
      fetchResult = unwrapResult(
        await dispatch(HojaPComentarioSliceRequests.getListByHojaParametroIdRequest(hojaParametrosId))
      );
      setMessages(fetchResult);
    } catch (error) {
      openNotificationUI("Error al leer mensajes.", "error");
    }
  };

  React.useEffect(() => {
    if (hojaParametrosId != 0) getMessages();
  }, []);

  return (
    <div style={{ width: "1000px" }}>
      <Box sx={{ pb: 7 }} ref={ref}>
        <CssBaseline />
        {messages && (
          <List>
            {messages.map(({ appUser, comentario, id, createdDate }, index) => (
              <ListItem key={id}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture">{appUser?.operator?.name + " " + appUser?.operator?.surname}</Avatar>
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
