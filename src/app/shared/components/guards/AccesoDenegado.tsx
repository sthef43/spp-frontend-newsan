import React from "react";
import { FestividadesComponent } from "../ui/FestividadesComponent";
import error404 from "../../../../assets/animated/pagina_en_mantenimiento.json";
import { Button } from "@mui/material";
import { MaterialButtons } from "../material-ui/MaterialButtons";
import { useHistory } from "react-router";

export const AccesoDenegado = () => {
  const buttonClases = MaterialButtons();
  const history = useHistory();

  return (
    <div className="flex flex-col justify-center h-[95vh] items-center">
      <FestividadesComponent active gifOrImage={error404} width={500} height={500} />
      <div>
        <h4 className="text-2xl font-semibold text-center">Acceso denegado</h4>
        <Button
          onClick={() => {
            history.push(`/main`);
          }}
          className={`${buttonClases.blueButton} mt-4`}
          variant="contained">
          Volver a la página de inicio
        </Button>
      </div>
    </div>
  );
};
