import { IPlant } from "app/models";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useGetAllPlants } from "app/shared/hooks/hooksServices/usePlantApi";
import { SelectComponentNormal } from "app/shared/helpers/ComponentsForForms/SelectComponentNormal";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { plantSlice } from "app/Middleware/reducers";
import { AdminLineasTable } from "../Components/AdminLineasTable";

export const AdministrarLineasPage = (): JSX.Element => {
  const lineas = useAppSelector((state) => state.linea.dataAll ?? []);
  const loadingLineas = useAppSelector((state) => state.linea.loading);

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<number>();

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();

  const { response: plantas } = useGetAllPlants<IPlant[]>();

  useEffect(() => {
    TitleChanger("Administrar líneas");
    dispatch(LineaSliceRequests.getAllRequest());
  }, [TitleChanger, dispatch]);

  useEffect(() => {
    if (plantaSeleccionada) {
      dispatch(LineaSliceRequests.GetListByPlantId(plantaSeleccionada));
    }
  }, [plantaSeleccionada, dispatch]);

  if (!plantas) {
    return (
      <ContainerForPages activeEffectVisible optionsLayout="page">
        <div className="flex justify-center items-center h-[400px]">
          <span className="text-textNew text-[14px]">Cargando plantas...</span>
        </div>
      </ContainerForPages>
    );
  }

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <h2 className="text-3xl font-bold">Administrar Líneas</h2>
      <div className="w-1/4 mt-4 p-2">
        <SelectComponentNormal
          label="Seleccionar Planta"
          listItems={plantas}
          value={plantaSeleccionada}
          onChange={(item) => {
            setPlantaSeleccionada(item as number);
            dispatch(plantSlice.actions.setSelectPlant(item as number));
          }}
          valueLabel={(item) => item.name}
          valueSelect={(item) => item.id}
        />
      </div>
      {loadingLineas === "pending" ? (
        <div className="flex justify-center items-center h-[200px]">
          <span className="text-textNew text-[14px]">Cargando líneas...</span>
        </div>
      ) : (
        <AdminLineasTable lineas={lineas} />
      )}
    </ContainerForPages>
  );
};
