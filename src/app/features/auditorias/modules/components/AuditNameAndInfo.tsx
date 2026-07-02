import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
const initialState = { name: "", numberRegistry: "" };
export const AuditNameAndInfo = (props: {
  callback: (ArrAuditBloq: { name: string; numberRegistry: string }) => void;
  showButton: boolean;
  info: { name: string; numberRegistry: string };
}): JSX.Element => {
  const [state, setState] = useState(props.info || initialState);
  const change = (e: any) => {
    console.log(e.target.name);
    setState({ ...state, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (state.name.length > 1 && state.numberRegistry.length > 1) {
      props.callback(state);
      console.log(state);
    }
  }, [state]);
  return (
    <div>
      <div style={{ position: "relative" }}>
        <div className="pb-3 font-bold text-center">Seleccione el nombre y numero de registro de la auditoría</div>
        <div className="flex gap-8">
          <TextField
            fullWidth
            variant="outlined"
            name="name"
            placeholder="Nombre de la auditoria"
            label="Nombre de la auditoria"
            value={state.name}
            onChange={change}
          />

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
      </div>
    </div>
  );
};
