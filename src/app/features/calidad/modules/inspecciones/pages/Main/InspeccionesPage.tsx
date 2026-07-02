import { Button } from "@mui/material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import InspeccionesTable from "../../components/inspecciones/InspeccionesTable";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import moment from "moment";

const InspeccionesPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const buttonClasses = MaterialButtons();

  const [fechaDesde, setFechaDesde] = useState(moment().format("MM-DD-YYYY"));
  const [fechaHasta, setFechaHasta] = useState(moment().format("MM-DD-YYYY"));
  const [error, setError] = useState(false);

  const onSearch = () => {
    console.log(fechaDesde);
    console.log(fechaHasta);
  };

  useEffect(() => {
    TitleChanger("Inspecciones Calidad");
  }, []);

  return (
    <div className="container mx-auto my-3">
      <div className="sm:flex md:flex items-center justify-around w-full font-semibold rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="p-2 overflow-auto m-2" style={{ flex: "1 1 100%" }}>
          <SelectOfDate
            fechaDesdeHasta
            setFechaDesdeProps={setFechaDesde}
            setFechaHastaProps={setFechaHasta}
            setErrorProps={setError}
          />
        </div>
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Button sx={{ marginLeft: 3 }} className={buttonClasses.greenButton} variant="contained" onClick={onSearch}>
            Buscar
          </Button>
        </div>
      </div>
      {/* <div className="flex w-full gap-1">
        <Button variant="contained" href="">
          Link
        </Button>
        <Button>Tareas</Button>
        <Button>Ranking</Button>
      </div> */}
      {/* Agregar Inspecctor */}
      {/* Agregar Tarea */}
      {/* Ver Ranking */}
      {/*  Tabla InspecctoresTarea  */}
      <InspeccionesTable from={fechaDesde} to={fechaHasta} />
    </div>
  );
};

export default InspeccionesPage;
