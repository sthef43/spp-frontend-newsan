import React, { useEffect } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import CalidadTareasInspeccionTable from "../../components/tareas/CalidadTareasInspeccionTable";

const CalidadInspeccionTareasPage = () => {
  const { TitleChanger } = useTitleOfApp();
  useEffect(() => {
    TitleChanger("Inspecciones Tareas Calidad");
  }, []);

  return (
    <div className="container mx-auto my-3">
      <CalidadTareasInspeccionTable />
    </div>
  );
};
export default CalidadInspeccionTareasPage;
