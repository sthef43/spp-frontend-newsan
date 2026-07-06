import { Typography } from "@mui/material";
import { BinariosIdentificadoresSlice } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { SelectTableroPuesto } from "app/features/tableros/components/SelectTableroPuesto";
import { TableroStockHead } from "app/features/tableros/modules/andonProduccionScrap/components/TableroStockHead";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { TableroStockTable } from "../components/TableroStockTable";

export const TableroStockPage = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const navBarState = useAppSelector((state) => state.binariosIdentificadores.ocultar);

  const [config, setConfig] = useState(true);

  const lineaPuesto = useAppSelector((state) => state.lineaPuesto.object);
  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const planta = useAppSelector((state) => state.plant.object);

  const getLinea = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaSliceRequests.GetByCodigoInicio(linea.identificadorLinea.toString()));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onLeave = () => {
    dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(!navBarState));
  };
  useEffect(() => {
    TitleChanger("Tablero de stock");
    dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(true));
    return () => {
      dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(false));
    };
  }, []);
  useEffect(() => {
    linea && getLinea();
  }, [linea]);

  return config ? (
    <ModalCompoment title="Configure el tablero" setOpenPopup={setConfig} openPopup={config}>
      <SelectTableroPuesto closeModal={setConfig} />
    </ModalCompoment>
  ) : (
    <div
      className="h-screen w-screen"
      style={{
        backgroundColor: "#141639"
      }}>
      <Typography
        align="center"
        className="cursor-pointer m-auto py-10"
        variant="h2"
        fontWeight="bold"
        color={"white"}
        onClick={onLeave}
        fontSize={"7.75rem"}>
        {planta?.name.toLocaleUpperCase()} - {linea?.alias.toLocaleUpperCase()} -{" "}
        {lineaPuesto?.puesto?.nombre.toLocaleUpperCase()}
      </Typography>
      <TableroStockHead />
      <TableroStockTable />
    </div>
  );
};
