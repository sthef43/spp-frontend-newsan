import { TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { IDU1200ensayosSliceRequests } from "app/Middleware/reducers/IDU1200ensayosSlice";
import { useAppDispatch } from "app/core/store/store";
import { IIDU1200ensayos } from "app/models/IIDU1200ensayos";
import { TestingNwVerificacionTable } from "app/features/calidad/modules/verificarEquipos/components/Tables/TestingNwVerificacionTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const TestingNwVerificacionPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [dataTable, setDataTable] = useState<IIDU1200ensayos[]>([]);
  const [codigo, setCodigo] = useState<string>("");
  const handleChangeCodigo = (event: any) => {
    if (event.target.value) {
      setCodigo(event.target.value);
      debo(event.target.value);
    }
  };
  const HandleSubmit = async (e: string) => {
    let response;
    try {
      response = unwrapResult(await dispatch(IDU1200ensayosSliceRequests.getAllByCodigo(e)));
      response.length == 0 && openNotificationUI(`El codigo "${e}" no tiene registro`, "warning");
      setDataTable(response);
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const debo = useMemo(() => _.debounce(HandleSubmit, 1000), []);
  useEffect(() => {
    if (codigo?.length > 1) {
      debo(codigo);
    }
  }, []);
  return (
    <div className="m-3 pb-3 ">
      <div className="flex justify-center">
        <TextField
          label={`Ingrese el código de caja electrica`}
          value={codigo}
          onChange={handleChangeCodigo}
          fullWidth
        />
      </div>
      <TestingNwVerificacionTable data={dataTable} />
    </div>
  );
};
