import { FormControlLabel, Switch } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContContenedorSliceRequests } from "app/Middleware/reducers/ContContenedorSlice";
import { useAppDispatch } from "app/core/store/store";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const Planilla = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //Leer datos de ContPedido cuando cambia FechaSelect de ahi en adelante
  const [pedidos, setPedidos] = useState(null);
  const [pedidosHasta, setPedidosHasta] = useState(null);

  const getContenedoresHasta = async () => {
    if (fechaSelect) {
      try {
        const result = unwrapResult(
          await dispatch(ContContenedorSliceRequests.getListByFechaHastaProgramadoRequest(fechaSelect))
        );
        const objectSubmit = result.map((elem) => {
          return {
            ...elem,
            fechaProgramado: moment(elem.fechaProgramado).format("L")
          };
        });
        setPedidosHasta(objectSubmit);
        setPedidos(objectSubmit);
      } catch (error) {
        openNotificationUI("Error al leer.", "error");
      }
    }
  };

  //Fecha
  const [fechaSelect, setfechaSelect] = useState(null);
  //Selecciona una fecha
  const onChangeFecha = (fecha: string) => {
    setfechaSelect(moment(fecha).format("YYYY-MM-DD"));
    setCheckedOrigen(true);
    setCheckedOrigenNombre("7 Días");
  };
  useEffect(() => {
    getContenedoresHasta();
  }, [fechaSelect]);

  useEffect(() => {
    TitleChanger("Planilla de Planificación");
    const today = new Date();
    setfechaSelect(moment(today).format("YYYY-MM-DD"));
  }, []);

  const filtrarFechaActual = () => {
    const pedidosHastaFiltrado = pedidos.filter((objeto) => objeto.fechaProgramado === moment(fechaSelect).format("L"));
    setPedidosHasta(pedidosHastaFiltrado);
  };

  //SWITCH Origen
  const [checkedOrigen, setCheckedOrigen] = useState(true);
  const [checkedOrigenNombre, setCheckedOrigenNombre] = useState("7 Días");
  const handleChangeOrigen = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedOrigen(event.target.checked);
    event.target.checked ? setCheckedOrigenNombre("7 Días") : setCheckedOrigenNombre("1 Día");
  };
  useEffect(() => {
    if (!checkedOrigen) {
      filtrarFechaActual();
    } else {
      setPedidosHasta(pedidos);
    }
  }, [checkedOrigenNombre]);

  return (
    <div>
      <div className=" flex-col grid grid-cols-3 gap-30 " style={{ height: "100%" }}>
        {/* <h1>Fecha Entregado</h1> */}
        <SelectOfDate pickFecha setFechaProps={onChangeFecha} />
        <FormControlLabel
          control={
            <Switch checked={checkedOrigen} onChange={handleChangeOrigen} inputProps={{ "aria-label": "controlled" }} />
          }
          label={checkedOrigenNombre}
        />
      </div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        {pedidosHasta && (
          <div className="my-2 mx-4 h-full">
            <TableComponent
              Dense={true}
              // Overflow={true}
              buscar={true}
              IDcolumn={"id"}
              excel={true}
              columns={[
                {
                  title: "Fecha Programado",
                  field: "fechaProgramado"
                },
                {
                  title: "Prioridad",
                  field: "prioridad"
                },
                {
                  title: "Planta",
                  field: "contEmbarque.contPlanProduccion.contPlanta.nombre"
                },
                {
                  title: "Contenedor",
                  field: "lpn"
                }
              ]}
              dataInfo={pedidosHasta}
            />
          </div>
        )}
      </div>
    </div>
  );
};
