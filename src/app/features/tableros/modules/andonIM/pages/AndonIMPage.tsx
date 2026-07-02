/* eslint-disable unused-imports/no-unused-vars */
import { unwrapResult } from "@reduxjs/toolkit";
import { BinariosIdentificadoresSlice } from "app/Middleware/reducers/BinariosIdentificadoresSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect } from "react";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ILineaPuesto } from "app/models/ILineaPuesto";
import { AndonIMModal } from "app/features/tableros/modules/andonIM/modals/AndonIMModal";
import { AndonIMTable } from "app/features/tableros/modules/andonIM/components/AndonIMTable";

export const AndonIMPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const navBarState = useAppSelector((state) => state.binariosIdentificadores.ocultar);
  const lineaPuesto = useAppSelector((state) => state.lineaPuesto.object);
  const lineaPuestos = useAppSelector((state) => state.lineaPuesto.dataAll);
  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const lineas = useAppSelector((state) => state.linea.dataAll);
  const turnos = useAppSelector((state) => state.turno.dataAll);
  const [cambioFecha, setCambioFecha] = React.useState<boolean>(false);
  const [fecha, setFecha] = React.useState<string>(moment().format("DD-MM-YYYY"));
  const [nuevaFecha, setNuevaFecha] = React.useState<string>(moment().format("DD-MM-YYYY"));
  //Configuraciones del andon
  const [puestoLineaSeleccionada, setPuestoLineaSeleccionada] = React.useState(null);
  const [puestoLineaSeleccionada2, setPuestoLineaSeleccionada2] = React.useState(0);
  const [puestoLinea2, setPuestoLinea2] = React.useState({} as ILineaPuesto);

  // Me traigo lo producido del dia y lo agrupo por binario, tmb saco las key rey
  const getAll = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const hora = moment().format("hh:mm:ss");
      const fecha = moment().format("YYYY-MM-DD");
      const { desdeHora, hastaHora } = turnos.find((t) => t.desdeHora <= hora && t.hastaHora >= hora);
      const { idLinea } = lineas.find((l) => l.codigoReparacion == linea.identificadorLinea.toString());

      console.log(typeof hastaHora);

      if (puestoLineaSeleccionada2 == 0) {
        const response = unwrapResult(
          await dispatch(
            RechazoSliceRequests.GetAllByLineaIdFechaAndPuesto({
              fecha,
              horaDesde: desdeHora,
              horaHasta: hastaHora,
              idLinea,
              puestoNombre: lineaPuesto.puesto.nombre
            })
          )
        );
      } else {
        const puestoNombre2 = lineaPuestos.find((lp) => lp.id == puestoLineaSeleccionada2)?.puesto?.nombre;
        const response = unwrapResult(
          await dispatch(
            RechazoSliceRequests.GetAllByLineaIdFechaAndPuestosNombres({
              fecha,
              horaDesde: desdeHora,
              horaHasta: hastaHora,
              idLinea,
              puestoNombre: lineaPuesto.puesto.nombre,
              puestoNombre2
            })
          )
        );
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const getAllTurnosAndLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TurnoSliceRequests.getAllRequest()));
      const response2 = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
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
    }
  };
  useEffect(() => {
    if (puestoLineaSeleccionada) {
      getAll();
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
  useEffect(() => {
    getAllTurnosAndLineas();
  }, []);
  useEffect(() => {
    if (puestoLineaSeleccionada2 != 0) {
      setPuestoLinea2(lineaPuestos.find((lp) => lp.id == puestoLineaSeleccionada2));
    }
  }, [puestoLineaSeleccionada2]);
  // Consulta cada 10 mins los rechazos
  useEffect(() => {
    if (!puestoLineaSeleccionada) return;
    console.log("se inicio el intervalo");
    const intervalId = setInterval(() => {
      void getAll();
      getNuevaFecha();
    }, 10 * 60 * 1000); // 5 minutos en milisegundos
    // }, 30000); // 1/2 minutos en milisegundos
    return () => {
      clearInterval(intervalId);
    };
  }, [puestoLineaSeleccionada]);

  return (
    <>
      {puestoLineaSeleccionada ? (
        <main className="w-full bg-blue-950 h-screen overflow-hidden text-white" style={{ fontFamily: "Roboto" }}>
          <header className="w-full flex h-32 justify-between items-center px-6 bg-linearGradientHaderPage">
            <figure>
              <img
                className="cursor-pointer"
                src={`${import.meta.env.BASE_URL}/imagenes/newsan/LogoNewsanBlanco.svg`}
                width="120px"
                alt="logo newsan"
                onClick={() => dispatch(BinariosIdentificadoresSlice.actions.hiddenNavBar(!navBarState))}
              />
            </figure>
            <figure>
              <img src={`${import.meta.env.BASE_URL}/icons/LOGO-NUEVO-SPP.svg`} width="150px" alt="logo newsan" />
            </figure>
          </header>
          <section className="px-6 mt-12">
            <h2 className="text-5xl font-semibold tracking-wider">Tablero de rechazos - {linea.nombre}</h2>
            <div className="mt-14 w-full">
              <p className="text-right text-4xl font-semibold tracking-widest">{lineaPuesto.puesto.nombre}</p>
              <AndonIMTable cambioFecha={cambioFecha} />
            </div>
          </section>
        </main>
      ) : (
        <AndonIMModal
          setPuestoLineaSeleccionada={setPuestoLineaSeleccionada}
          setPuestoLineaSeleccionada2={setPuestoLineaSeleccionada2}
        />
      )}
    </>
  );
};

/* ANTIGUO HTML QUE SE USABA
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
                {puestoLineaSeleccionada2 == 0
                  ? lineaPuesto?.puesto?.nombre.toUpperCase()
                  : lineaPuesto?.puesto?.nombre.toUpperCase() + " - " + puestoLinea2?.puesto?.nombre}
              </h1>
            </div>
            <div className="w-full text-end p-4 text-3xl">
              <h1> {linea.nombre}</h1>
              <h1>{fecha}</h1>
            </div>
          </div>
          <AndonIMTable cambioFecha={cambioFecha} />
        </div>
      ) : (
        <AndonIMModal
          setPuestoLineaSeleccionada={setPuestoLineaSeleccionada}
          setPuestoLineaSeleccionada2={setPuestoLineaSeleccionada2}
        />
      )}
*/
