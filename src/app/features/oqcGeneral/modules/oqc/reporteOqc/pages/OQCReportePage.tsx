import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { OQCDesignadasResultTable } from "../components/OQCDesignadasResultTable";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { Button } from "@mui/material";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { Search } from "@mui/icons-material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { unwrapResult } from "@reduxjs/toolkit";
import { OQCOpcionExportacionReporte } from "../components/OQCOpcionExportacionReportes";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { useForm } from "react-hook-form";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";

export const OQCReportePage = (): JSX.Element => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const color = MaterialButtons();

  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const turnos = useAppSelector((state) => state.turno.dataAll);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [turnoAbre, setTurnoAbre] = useState<string | number>("");
  const [lineaProduccionId, setLineaProduccionId] = useState(0);
  const [productoId, setProductoId] = useState(0);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string | number>(0);
  const [error, setError] = useState(false);

  const opcionesHallazgos = [
    { id: 1, nombre: "Filtar muestras con hallazgos" },
    { id: 2, nombre: "Filtrar muestas sin hallazgos" },
    { id: 3, nombre: "Sin filtros" }
  ];

  const onGetTurnos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(TurnoSliceRequests.getAllRequest());
      const turnoAbre = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0))).turno
        .abreviatura;
      if (turnoAbre) {
        setTurnoAbre(turnoAbre);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const [reportesBuscados, setReporteBuscados] = useState<IOQCDesignadaResultado[]>([]);
  const onSearch2 = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          OQCDesignadaResultadoSliceRequests.getReportOQCByDatesAndLine({
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            lineaId: linea.id,
            turnoAbreviatura: turnoAbre,
            opcionHallazgo: filtroSeleccionado
          })
        )
      );
      if (response) {
        setReporteBuscados(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const [reportesPorPlantas, setReportesPorPlantas] = useState<IOQCDesignadaResultado[]>([]);
  const getReportsPlant = async () => {
    const plantaId = localStorage.getItem("plantId");
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          OQCDesignadaResultadoSliceRequests.getReportOQCByDatesAndPlant({
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            plantaId: plantaId
          })
        )
      );
      if (response) {
        setReportesPorPlantas(response);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    TitleChanger("Reporte de OQC");
    onGetTurnos();
  }, []);

  return (
    <div className="h-screen w-screen p-6">
      <div className="flex flex-col gap-5 bg-secondaryNew px-20 py-5">
        <SelectOFPlantAndProducts
          setLineaProduccionId={setLineaProduccionId}
          setProductoId={setProductoId}
          selectLineas
          notShadow
        />
        <div className="gap-6 h-full w-full flex flex-col minnotebook:flex-row">
          <SelectOfDate
            estilosPredeterminados
            fechaDesdeHasta
            setFechaDesdeProps={setFechaDesde}
            setFechaHastaProps={setFechaHasta}
            setErrorProps={setError}
          />
          <div className="flex flex-row justify-between w-full gap-x-4 items-center">
            <SelectComponent
              listaObjetos={opcionesHallazgos}
              inputLabel="Seleccione un filtro"
              nameSelect="filtroHallazgo"
              valueLabel={(value) => value.nombre}
              valueSelect={(value) => value.id}
              control={control}
              valueKey={(item) => item}
              ValueSave={setFiltroSeleccionado}
              varianteEstilo="standard"
            />
            <div className="flex flex-row justify-between items-center gap-x-4 w-full">
              <SelectComponent
                listaObjetos={turnos}
                inputLabel="Seleccione un turno"
                nameSelect="turnos"
                valueLabel={(value) => value.nombre}
                valueSelect={(value) => value.abreviatura}
                ValueSave={setTurnoAbre}
                control={control}
                valueKey={(value) => value}
                varianteEstilo="standard"
              />
              <Button
                className={color.blueButton}
                sx={{ maxWidth: "fit-content", margin: "auto", padding: "15px" }}
                onClick={() => {
                  onSearch2();
                  getReportsPlant();
                }}
                disabled={error}>
                <Search />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>
      {reportesBuscados.length > 0 && (
        <div>
          <OQCOpcionExportacionReporte
            reporteDiario={reportesBuscados}
            reporteCSV={reportesBuscados}
            reportePorPlanta={reportesPorPlantas}
          />
        </div>
      )}
      {linea && <OQCDesignadasResultTable refresh={onSearch2} />}
    </div>
  );
};
