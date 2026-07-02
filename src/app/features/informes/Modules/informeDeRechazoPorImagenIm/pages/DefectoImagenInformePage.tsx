import { Group, Search } from "@mui/icons-material";
import { Button, FormControl, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { RechazoMainSliceRequests } from "app/Middleware/reducers/RechazoMainSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { DefectoImagenTableInforme } from "../components/DefectoImagenTableInforme";
import { DefectoImagenTableInformeAgrupar } from "../components/DefectoImagenTableInformeAgrupar";

export const DefectoImagenInformePage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const color = MaterialButtons();

  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const turnos = useAppSelector((state) => state.turno.dataAll);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [turnoAbre, setTurnoAbre] = useState("");
  const [error, setError] = useState(false);
  const [agrupar, setAgrupar] = useState(true);

  const onSearch = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const objecSubmit = { fechaDesde, fechaHasta, lineaId: linea.id, turno: turnoAbre };
      await dispatch(RechazoMainSliceRequests.getInforme(objecSubmit));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onGetTurnos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(TurnoSliceRequests.getAllRequest());
      const turnoAbre = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0))).turno
        .abreviatura;
      if (turnoAbre) {
        setTurnoAbre(turnoAbre);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onGetFamilia = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaProduccionFamiliaSliceRequests.getAllByLineaId(linea.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onSelectGroup = () => {
    setAgrupar(!agrupar);
  };

  useEffect(() => {
    TitleChanger("Informe del defecto imagen");
    onGetTurnos();
  }, []);
  useEffect(() => {
    if (linea) onGetFamilia();
  }, [linea]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 bg-secondaryNew px-20 py-5">
        <SelectOFPlantAndProducts selectLineas notShadow />
        <div className="gap-6 h-full flex flex-col minnotebook:flex-row">
          <SelectOfDate
            fechaDesdeHasta
            setFechaDesdeProps={setFechaDesde}
            setFechaHastaProps={setFechaHasta}
            setErrorProps={setError}
          />
          <FormControl className="min-w-min w-52">
            <InputLabel>Seleccione un turno</InputLabel>
            <Select value={turnoAbre}>
              {turnos?.map((turno) => (
                <MenuItem key={turno.id} value={turno.abreviatura} onClick={() => setTurnoAbre(turno.abreviatura)}>
                  <ListItemText>{turno.nombre}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            className={color.blueButton}
            sx={{ maxWidth: "fit-content", margin: "auto", padding: "15px" }}
            onClick={onSearch}
            disabled={error}>
            <Search />
            Buscar
          </Button>
          <Button
            className={color.yellowButton}
            sx={{ maxWidth: "fit-content", margin: "auto", padding: "15px" }}
            onClick={onSelectGroup}
            disabled={error}>
            <Group />
            {agrupar ? "Agrupar" : "Desagrupar"}
          </Button>
        </div>
      </div>
      {agrupar && <DefectoImagenTableInforme />}
      {!agrupar && <DefectoImagenTableInformeAgrupar />}
    </div>
  );
};
