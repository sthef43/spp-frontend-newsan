// app/shared/helpers/SelectSeason.tsx
import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { DashboardService } from "app/services/Dashboard.Service";

type Props = {
  plantId?: number;
  value: number | "";
  onChange: (season: number | "") => void;
  notShadow?: boolean;
  className?: string;
};

const servicio = new DashboardService();

export const SelectSeason = ({ plantId, value, onChange, notShadow, className = "" }: Props): JSX.Element => {
  const [seasons, setSeasons] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  useEffect(() => {
    // si no hay planta, vaciamos temporadas y reseteamos selección
    if (!plantId || plantId <= 0) {
      setSeasons([]);
      if (value !== "") onChange("");
      return;
    }

    (async () => {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando temporadas..."));

        const ys = await servicio.getSeasonsByPlant(plantId);
        setSeasons(ys ?? []);

        // si la temporada seleccionada no existe en la lista, la reseteamos
        if (value !== "" && !ys.includes(Number(value))) {
          onChange("");
        }
      } catch (e: any) {
        openNotificationUI(e?.message ?? "Error obteniendo temporadas", "error");
        setSeasons([]);
        onChange("");
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    })();
  }, [plantId]); // SOLO DEPENDE DE PLANTA

  // Valor seguro para el Select de MUI
  const safeValue = value === "" || seasons.includes(Number(value)) ? value : "";

  return (
    <div className={`container m-auto bg-secondaryNew rounded-lg ${!notShadow && "shadow-elevation-4"} ${className}`}>
      <div className="p-4">
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Temporada</InputLabel>
          <Select
            label="Temporada"
            value={safeValue}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            variant="standard">
            {seasons.length === 0 && (
              <MenuItem value="" disabled>
                Sin temporadas
              </MenuItem>
            )}

            {seasons.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default SelectSeason;
