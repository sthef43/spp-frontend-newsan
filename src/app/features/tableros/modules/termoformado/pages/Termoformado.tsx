import { SeleccionarLineas } from "app/features/tableros/modules/termoformado/components/SeleccionarLineas";
import { TablaTermoformado } from "app/features/tableros/modules/termoformado/components/TablaTermoformado";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { TablaAcumulado } from "app/features/tableros/modules/termoformado/components/TablaAcumulado";
import moment from "moment";
import { Tooltip } from "@mui/material";
import { BinariosIdentificadoresSlice } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";

export const Termoformado = (): JSX.Element => {
  const [lineasSeleccionadas, setLineasSeleccionadas] = useState(null);
  const [cambioFecha, setCambioFecha] = useState<boolean>(false);
  const [lineaId, setLineaId] = useState(0);
  const [fecha, setFecha] = useState<string>(moment().format("DD-MM-YYYY"));
  const [nuevaFecha] = useState<string>(moment().format("DD-MM-YYYY"));
  const [openModal, setOpenModal] = useState(true);
  const { TitleChanger } = useTitleOfApp();
  const navBarState = useAppSelector((state) => state.binariosIdentificadores.ocultar);
  const dispatch = useAppDispatch();

  const setearLineasFuncion = (lineas) => {
    setLineasSeleccionadas(lineas);
  };

  TitleChanger("Termoformado");
  // Si cambia la fecha resetea todo
  const onChangeFecha = (): void => {
    if (fecha !== nuevaFecha) {
      setFecha(nuevaFecha);
      setCambioFecha(true);
    }
  };
  // Uso dos states para la fecha porque sino el interval toma el scope del cuando empezo y no el actualizado
  useEffect(() => {
    onChangeFecha();
  }, [nuevaFecha]);
  // Cambio de nuevo el state booleano para poder avisar que cambie el dia
  useEffect(() => {
    if (cambioFecha) {
      setTimeout(() => {
        setCambioFecha(false);
      }, 10000);
    }
  }, [cambioFecha]);
  useEffect(() => {
    if (lineasSeleccionadas) {
      setInterval(() => {
        setLineaId((value) => (value == 0 ? 1 : 0));
      }, 60000);
    }
  }, [lineasSeleccionadas]);
  // State para sacar el navbar
  useEffect(() => {
    dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(true));
    return () => {
      dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(false));
    };
  }, []);
  return !lineasSeleccionadas ? (
    <ModalCompoment title="Seleccion de lineas" setOpenPopup={setOpenModal} openPopup={openModal}>
      <SeleccionarLineas setearLineasFuncion={setearLineasFuncion} setOpenModal={setOpenModal}></SeleccionarLineas>
    </ModalCompoment>
  ) : (
    <div
      className=" w-screen  overflow-hidden"
      style={{
        backgroundImage: `url(${import.meta.env.VITE_PUBLIC_URL}/imagenes/fondos/fondo-tablero.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh"
      }}>
      <div className="grid grid-cols-6 border-b items-center  max-h-20">
        <div className="w-12 ml-5 cursor-pointer">
          <Tooltip title="Show/hidden navbar">
            <img
              src={`${import.meta.env.VITE_PUBLIC_URL}/imagenes/newsan/LogoNewsanBlanco.svg`}
              onClick={() => dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(!navBarState))}></img>
          </Tooltip>
        </div>
        <div className="w-full text-center p-8 col-start-2 col-span-4">
          <h1 style={{ fontFamily: "Montserrat" }} className="w-full text-5xl font-bold ">
            TABLERO CONTROL DE STOCK
          </h1>
        </div>
        <div className="w-full text-end p-4 text-3xl">
          <h1>{fecha}</h1>
        </div>
      </div>

      <div className="flex flex-col  mt-1 p-5 w-full">
        <TablaTermoformado cambioFecha={cambioFecha} termoformado={lineasSeleccionadas[lineaId]} />
        <TablaAcumulado cambioFecha={cambioFecha} termoformado={lineasSeleccionadas[lineaId]} />
      </div>
    </div>
  );
};
