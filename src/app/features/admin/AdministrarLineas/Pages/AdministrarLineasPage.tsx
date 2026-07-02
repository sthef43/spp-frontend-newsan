import { ILinea, IPlant } from "app/models";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useGetAllPlants } from "app/shared/hooks/hooksServices/usePlantApi";
import { SelectComponentNormal } from "app/shared/helpers/ComponentsForForms/SelectComponentNormal";
import { useAppSelector } from "app/core/store/store";
import { useDispatch } from "react-redux";
import { plantSlice } from "app/Middleware/reducers";
import { AdminLineasTable } from "../Components/AdminLineasTable";

export const AdministrarLineasPage = (): JSX.Element => {
  const lineas = useAppSelector((state) => state.linea.dataAll as ILinea[]);

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<number | string>();

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useDispatch();

  const { response: plantas } = useGetAllPlants<IPlant[]>();

  useEffect(() => {
    TitleChanger("Administrar líneas");
  }, []);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <h2 className="text-3xl font-bold">Administrar Líneas</h2>
      <div className="w-1/4 mt-4 p-2">
        <SelectComponentNormal
          label="Seleccionar Planta"
          listItems={plantas}
          value={plantaSeleccionada}
          onChange={(item) => {
            setPlantaSeleccionada(item as string);
            dispatch(plantSlice.actions.setSelectPlant(item as number));
          }}
          valueLabel={(item) => item.name}
          valueSelect={(item) => item.id}
        />
      </div>
      <AdminLineasTable lineas={lineas} />
    </ContainerForPages>
  );
};
