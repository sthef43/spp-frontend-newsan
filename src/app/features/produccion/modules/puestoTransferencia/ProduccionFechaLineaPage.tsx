import React from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TextField } from "@mui/material";
import moment from "moment";
export const ProduccionFechaLineaPage = () => {
  const { TitleChanger } = useTitleOfApp();
  React.useEffect(() => {
    TitleChanger("Produccíon por fecha");
  }, []);
  console.log(moment().format("DD-MM-YYYY"));
  return (
    <div>
      <div className="grid sm:grid-cols-3 grid-col-1 px-2 gap-4 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div>
          <TextField variant="standard" />
        </div>
        <div>
          <TextField
            id="date"
            label="Birthday"
            type="date"
            defaultValue={moment().format("DD-MM-YYYY")}
            InputLabelProps={{
              shrink: true
            }}
            variant="standard"
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};
