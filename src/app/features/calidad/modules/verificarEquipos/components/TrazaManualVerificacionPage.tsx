import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { ITrazaManual } from "app/models/ITrazaManual";
import { TrazaManualVerificacionTable } from "app/features/calidad/modules/verificarEquipos/components/Tables/TrazaManualVerificacionTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { TrazaManualSliceRequests } from "app/features/calidad/slices/TrazaManualSlice";

export const TrazaManualVerificacionPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [labelTitle, setLabelTitle] = useState<string>("manual");
  const [dataTable, setDataTable] = useState<ITrazaManual[]>([]);
  const [codigo, setCodigo] = useState<string>("");
  const handleChange = (event: any) => {
    if (event.target.value) {
      setLabelTitle(event.target.value);
      const objectSubmit = { codigo: codigo, tipoDeCodigo: event.target.value };
      if (codigo?.length > 1 && labelTitle) {
        debo(objectSubmit);
      }
    }
  };
  const handleChangeCodigo = (event: any) => {
    if (event.target.value) {
      setCodigo(event.target.value);
      const objectSubmit = { codigo: event.target.value, tipoDeCodigo: labelTitle };
      debo(objectSubmit);
    }
  };
  const HandleSubmit = async (objectSubmit) => {
    let response;
    try {
      response = unwrapResult(await dispatch(TrazaManualSliceRequests.getAllByCodigo(objectSubmit)));
      response.length == 0 && openNotificationUI(`El codigo "${objectSubmit.codigo}" no tiene registro`, "warning");
      setDataTable(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const debo = useMemo(() => _.debounce(HandleSubmit, 1000), []);
  React.useEffect(() => {
    if (codigo?.length > 1 && labelTitle) {
      debo(codigo);
    }
  }, []);
  return (
    <div className="m-3 pb-3 ">
      <div className="flex justify-center">
        <FormControl fullWidth>
          <FormLabel>Tipo de código</FormLabel>
          <RadioGroup value={labelTitle} onChange={handleChange} row>
            <FormControlLabel value="manual" control={<Radio />} label="Trazabilidad de manual" />
            <FormControlLabel value="base" control={<Radio />} label="Serie etiqueta" />
          </RadioGroup>
        </FormControl>
        <TextField
          label={`Ingrese el código de ${labelTitle}`}
          value={codigo}
          onChange={handleChangeCodigo}
          fullWidth
        />
      </div>
      <TrazaManualVerificacionTable data={dataTable} />
    </div>
  );
};
