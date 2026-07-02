import { TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { CajaElectricaLGSliceRequests } from "app/Middleware/reducers/CajaElectricaLGSlice";
import { useAppDispatch } from "app/core/store/store";
import { IcajaElectricaLG } from "app/models/IcajaElectricaLG";
import { TestingLGVerificacionTable } from "app/features/calidad/modules/verificarEquipos/components/Tables/TestingLGVerificacionTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const TestingLGVerificacionPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [dataTable, setDataTable] = useState<IcajaElectricaLG[]>([]);
  const [codigo, setCodigo] = useState<string>("");
  const handleChangeCodigo = (event: any) => {
    if (event.target.value) {
      setCodigo(event.target.value);
      debo(event.target.value);
    }
  };
  const HandleSubmit = async (e: string) => {
    try {
      const response = unwrapResult(await dispatch(CajaElectricaLGSliceRequests.getAllByCodigo(e)));
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
      <TestingLGVerificacionTable data={dataTable} />
    </div>
  );
};
