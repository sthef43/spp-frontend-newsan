/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, IconButton } from "@mui/material";
import useFetchApi from "app/shared/hooks/useFetchApi";
import produce from "immer";
import { IEmailGroup } from "app/models/IEmailGroup";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { IconButtons } from "../../../../../shared/components/material-ui/MaterialButtons";

export const AddEmails = (props: { changeEmailsGroups: (e: string) => void }) => {
  const classes = IconButtons();
  const [x, setx] = useState("");

  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return (
    <div className="flex ">
      <TextField
        fullWidth
        variant="outlined"
        name="name"
        type="email"
        value={x}
        placeholder="Email"
        label="Email"
        onChange={(e) => {
          setx(e.target.value);
        }}
      />
      <IconButton
        onClick={() => {
          props.changeEmailsGroups(`;${x}`);
          setx("");
        }}
        className={classes.greenIcon}
        disabled={!x.match(regexEmail)}
        size="large">
        <DoneIcon />
      </IconButton>
    </div>
  );
};

const initialState = { name: "", numberRegistry: "" };
export const AuditNameAndInfo = (props: {
  callback: (ArrAuditBloq: { name: string; numberRegistry: string }, groupEmails: string) => void;
  showButton: boolean;
  info: { name: string; numberRegistry: string };
  selectedGroupOfEmails: string;
}): JSX.Element => {
  const { State: listOfEmailGroups } = useFetchApi<IEmailGroup[]>(EmailGroupSliceRequests.getAllRequest);
  const [SelectedEmailGroup, setSelectedEmailGroup] = useState<string>(props.selectedGroupOfEmails || "");
  const [state, setState] = useState(props.info || initialState);

  const change = (e: any) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

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

  useEffect(() => {
    if (state.name.length > 1 && state.numberRegistry.length > 1 && SelectedEmailGroup) {
      props.callback(state, SelectedEmailGroup);
    }
  }, [state, SelectedEmailGroup]);

  return (
    <div>
      <div style={{ position: "relative" }} className="my-2 bg-secondaryNew shadow-elevation-4 rounded-lg">
        <div className="pb-3 text-xl text-center font-bold m-1">
          Seleccione el nombre y numero de registro de la auditoría
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
          <div className="p-2">
            <TextField
              fullWidth
              variant="outlined"
              name="name"
              placeholder="Nombre de la auditoria"
              label="Nombre de la auditoria"
              value={state.name}
              onChange={change}
            />
          </div>
          <div className="p-2">
            <TextField
              fullWidth
              variant="outlined"
              name="numberRegistry"
              placeholder="numero registro"
              label="numero registro"
              value={state.numberRegistry}
              onChange={change}
            />
          </div>
          {typeof SelectedEmailGroup === "string" && (
            <div className="sm:col-span-2 animate__animated animate__fadeIn shadow-elevation-4 p-2 w-full rounded-md border-2 border-gray-400 dark:border-gray-500">
              <div className="text-xl text-center font-bold m-1">Grupo de emails para la auditoría</div>
              {SelectedEmailGroup?.length < 4 && (
                <FormControl fullWidth variant="standard" className="sm:col-span-2">
                  <InputLabel>Grupo de Emails</InputLabel>
                  <Select
                    name="valorId"
                    value={""}
                    onChange={(e) => {
                      changeEmailsGroups(e.target.value as string);
                    }}
                    variant="standard">
                    {listOfEmailGroups &&
                      listOfEmailGroups.map((element, _index) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
