import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect } from "react";
import CalidadInspectorTable from "../../components/inspector/CalidadInspectorTable";

const CalidadInspectorPage = () => {
  const data = [];
  const { TitleChanger } = useTitleOfApp();
  useEffect(() => {
    TitleChanger("Inspecciones Tareas Calidad");
  }, []);

  return (
    <div className="container mx-auto my-3">
      <CalidadInspectorTable />
    </div>
  );
};

export default CalidadInspectorPage;
