import { BinariosIdentificadoresSliceRequest } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { useAppDispatch } from "app/core/store/store";
import { BinariosTable } from "app/features/trazabilidad/modules/binariosHeladera/components/BinariosTable";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect } from "react";

export const BinariosPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  useEffect(() => {
    TitleChanger("Binarios identificadores");
    dispatch(BinariosIdentificadoresSliceRequest.getAllRequest());
  }, []);
  return (
    <div>
      <BinariosTable />
    </div>
  );
};
