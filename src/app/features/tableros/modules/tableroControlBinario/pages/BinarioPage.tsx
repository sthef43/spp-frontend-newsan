/* eslint-disable unused-imports/no-unused-vars */
import { unwrapResult } from "@reduxjs/toolkit";
import {
  BinariosIdentificadoresSlice,
  BinariosIdentificadoresSliceRequest
} from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IBinariosIdentificadores } from "app/models/IBinariosIdentificadores";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { BinarioCard } from "app/features/tableros/modules/tableroControlBinario/components/BinarioCard";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _, { Dictionary } from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
import { Tooltip } from "@mui/material";
import { BinarioTableroModalForm } from "../modals/BinarioTableroModalForm";

export const BinarioPage = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const navBarState = useAppSelector((state) => state.binariosIdentificadores.ocultar);
  const [binarios, setBinarios] = React.useState<Dictionary<TrazaOperaciones[]>>(null);
  const [binariosAcum, setBinariosAcum] = React.useState<Dictionary<TrazaOperaciones[]>>(null);
  const [binariosToday, setBinariosToday] = React.useState<Dictionary<TrazaOperaciones[]>>(null);
  const [binariosIden, setBinariosIden] = React.useState<IBinariosIdentificadores[]>([]);
  const [cambioFecha, setCambioFecha] = React.useState<boolean>(false);
  const [fecha, setFecha] = React.useState<string>(moment().format("DD-MM-YYYY"));
  const [nuevaFecha, setNuevaFecha] = React.useState<string>(moment().format("DD-MM-YYYY"));
  //Configuraciones del andon
  const [puestoLineaSeleccionada, setPuestoLineaSeleccionada] = React.useState(null);

  // Me traigo lo producido del dia y lo agrupo por binario, tmb saco las key rey
  const getAllByDate = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TrazaOperacionesSliceRequests.getAllByDateAndIden(moment().format("YYYY-MM-DD")))
      );
      setBinarios(_.groupBy(response, "identificador"));
      console.log(binarios);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  // Me traigo lo todo el acumulado desde el principio de los tiempos
  const getAllAcumulado = async () => {
    // try {
    //   dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    //   const response = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.getAllByIden()));
    //   setBinariosAcum(_.groupBy(response, "identificador"));
    //   if (response?.length) {
    //     getAllByDate();
    //   } else {
    //     openNotificationUI("Ha ocurrido un error en el servidor", "error");
    //   }
    //   dispatch(LoadingUISlice.actions.LoadingUIClose());
    // } catch (e) {
    //   dispatch(LoadingUISlice.actions.LoadingUIClose());
    //   openNotificationUI(e, "error");
    // }
  };
  // Me traigo los binarios
  const getAllBinariosIden = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(BinariosIdentificadoresSliceRequest.getAllNotMapped(puestoLineaSeleccionada))
      );
      setBinariosIden(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const getNuevaFecha = async () => {
    setNuevaFecha(moment().format("DD-MM-YYYY"));
  };
  // Si cambia la fecha resetea todo
  const onChangeFecha = (): void => {
    if (fecha !== nuevaFecha) {
      setFecha(nuevaFecha);
      setCambioFecha(true);
      setBinariosAcum(null);
      setBinariosToday(null);
      setBinarios(null);
    }
  };
  // Trae por fecha y hora los cambios
  const getByFechaAndHours = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await getAllBinariosIden();
      const response = unwrapResult(
        await dispatch(
          TrazaOperacionesSliceRequests.getByFechaAndHours({
            fecha: moment().format("YYYY-MM-DD"),
            hours: moment().format("HH:mm:ss")
          })
        )
      );
      const group = _.groupBy(response, "identificador");
      setBinariosToday(group);

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  useEffect(() => {
    TitleChanger("Tablero binario");
    if (puestoLineaSeleccionada) {
      getAllBinariosIden();

      getAllAcumulado();
    }
  }, [puestoLineaSeleccionada]);
  // Uso dos states para la fecha porque sino el interval toma el scope del cuando empezo y no el actualizado
  useEffect(() => {
    onChangeFecha();
  }, [nuevaFecha]);
  // Cambio de nuevo el state booleano para poder avisar que cambie el dia
  useEffect(() => {
    if (cambioFecha) {
      const timeoutId2 = setTimeout(() => {
        setCambioFecha(false);
      }, 10000);
    }
  }, [cambioFecha]);
  // State para sacar el navbar
  useEffect(() => {
    dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(true));
    return () => {
      dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(false));
    };
  }, []);
  // Consulta cada 5 mins los ultimos registros de 5mins anteriores a la hora actual en la que consulta
  useEffect(() => {
    if (!puestoLineaSeleccionada) return;
    console.log("se inicio el intervalo");
    const intervalId = setInterval(() => {
      void getByFechaAndHours();
      getNuevaFecha();
    }, 1 * 60 * 1000); // 5 minutos en milisegundos
    // }, 10000); // 5 minutos en milisegundos
    return () => {
      clearInterval(intervalId);
    };
  }, [puestoLineaSeleccionada]);
  return (
    <>
      {puestoLineaSeleccionada ? (
        <div
          className="h-screen w-screen overflow-hidden"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}/imagenes/fondos/fondo-tablero.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
          }}>
          <div className="grid grid-cols-3 border-b items-center">
            <div className="w-24 ml-5 cursor-pointer">
              <Tooltip title="Show/hidden navbar">
                <img
                  src={`${import.meta.env.BASE_URL}/imagenes/newsan/LogoNewsanBlanco.svg`}
                  onClick={() => dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(!navBarState))}></img>
              </Tooltip>
            </div>
            <div className="w-full text-center p-8  col-start-2">
              <h1 style={{ fontFamily: "Montserrat" }} className="w-full text-5xl font-bold ">
                TABLERO BINARIO
              </h1>
            </div>
            <div className="w-full text-end p-4 text-3xl">
              <h1>{fecha}</h1>
            </div>
          </div>
          <div className="grid grid-cols-5 h-4/5 mx-10 pt-5 gap-14">
            {binariosIden?.map((bin) => (
              <BinarioCard
                binariosAcum={binariosAcum}
                binario={bin}
                binarios={binarios}
                binariosToday={binariosToday}
                keyBin={bin?.id}
                key={bin?.id}
                cambioFecha={cambioFecha}
              />
            ))}
          </div>
        </div>
      ) : (
        <BinarioTableroModalForm setPuestoLineaSeleccionada={setPuestoLineaSeleccionada}></BinarioTableroModalForm>
      )}
    </>
  );
};
