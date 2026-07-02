import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { MainRegSliceRequests } from "app/Middleware/reducers/MainRegSlice";
import { useAppDispatch } from "app/core/store/store";
import { IMainReg } from "app/models/IMainReg";
import { BaseCajaVerificacionTable } from "app/features/calidad/modules/verificarEquipos/components/Tables/BaseCajaVerificacionTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import React, { useMemo, useState } from "react";

export const BaseCajaVerificacionPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [labelTitle, setLabelTitle] = useState<string>("trazabilidad");
  const [dataTable, setDataTable] = useState<IMainReg[]>([]);
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
      response = unwrapResult(await dispatch(MainRegSliceRequests.getAllByCodigo(objectSubmit)));
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
            <FormControlLabel value="trazabilidad" control={<Radio />} label="Trazabilidad" />
            <FormControlLabel value="caja" control={<Radio />} label="Caja" />
            <FormControlLabel value="evaporador" control={<Radio />} label="Evaporador" />
          </RadioGroup>
        </FormControl>
        <TextField
          label={`Ingrese el código de ${labelTitle}`}
          value={codigo}
          onChange={handleChangeCodigo}
          fullWidth
        />
      </div>
      <BaseCajaVerificacionTable data={dataTable} />
    </div>
  );
};
