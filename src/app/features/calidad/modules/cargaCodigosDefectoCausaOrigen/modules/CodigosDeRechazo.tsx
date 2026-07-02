/* eslint-disable unused-imports/no-unused-vars */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  BottomNavigation,
  BottomNavigationAction,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import * as React from "react";
import { CodigoDeCausa } from "./causa/Causa";
import { Defecto } from "./defecto/Defecto";
import { Origen } from "./origen/Origen";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ICodigosRechazosValores } from "app/models/ICodigosRechazosValores";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const CodigosDeRechazo = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const { darkMode } = useAppSelector((state) => state.colorApp);
  const { openNotificationUI } = useNotificationUI();

  const [codigo, setCodigo] = React.useState("defecto");
  const [codRep, setCodRep] = React.useState();
  const [valores, setValores] = React.useState<ICodigosRechazosValores[]>([]);
  const [style, setStyle] = React.useState({});
  const [checkBox, setcheckBox] = React.useState(true);

  const setCodCL = React.useCallback((cod) => {
    setCodRep(cod);
  }, []);

  const onChangeCheck = (e) => {
    const check = e.target.checked;
    if (!check) {
      setCodRep(null);
    }
    setcheckBox((value) => !value);
  };

  React.useEffect(() => {
    setCodigo("defecto");
  }, []);

  React.useEffect(() => {
    darkMode
      ? setStyle({ height: "55%", width: "55%", filter: "invert(1)" })
      : setStyle({ height: "55%", width: "55%" });
  }, [darkMode]);

  return (
    <div className="my-2 h-full">
      <div className=" rounded-lg  px-2 w-full my-2 bg-secondaryNew shadow-elevation-4">
        <Accordion sx={{ marginBottom: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content">
            <Typography sx={{ textAlign: "center", justifyContent: "center", width: "100%" }}>FILTROS</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="m-4 flex justify-center gap-5 content-center">
              <FormControlLabel
                control={<Checkbox defaultChecked value={checkBox} onChange={onChangeCheck} />}
                label="Con filtros"
              />
              {checkBox && <SelectOFPlantAndProducts selectLineas setCodigoErrorProps={setCodCL} />}
            </div>
          </AccordionDetails>
        </Accordion>
        <Paper sx={{ top: 48, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={codigo}
            onChange={(event, newValue) => {
              setCodigo(newValue);
            }}>
            <BottomNavigationAction
              label="Codigo de defecto"
              value={"defecto"}
              icon={<img style={style} src={`${import.meta.env.BASE_URL}icons/defecto.svg`} alt="defecto" />}
            />
            <BottomNavigationAction
              label="Codigo de causa"
              value={"causas"}
              icon={<img style={style} src={`${import.meta.env.BASE_URL}icons/causa.svg`} alt="causa" />}
            />
            <BottomNavigationAction
              label="Codigo de origen"
              value={"origenes"}
              icon={<img style={style} src={`${import.meta.env.BASE_URL}icons/origen.svg`} alt="origen" />}
            />
          </BottomNavigation>
        </Paper>
        {codigo == "causas" && <CodigoDeCausa codRechazoId={codigo} codRep={codRep} />}
        {codigo == "origenes" && <Origen codRechazoId={codigo} codRep={codRep} />}
        {codigo == "defecto" && <Defecto codRechazoId={codigo} codRep={codRep} />}
      </div>
    </div>
  );
};
