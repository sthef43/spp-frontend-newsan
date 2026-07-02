import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { OQCPaletTable } from "app/features/oqcGeneral/modules/oqcCelulares/modules/oqcPalet/Components/OQCPaletTable";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { SelectLineaAndPlant } from "app/shared/helpers/SelectLineaAndPlant";
import FetchApi from "app/shared/helpers/FetchApi";
import { lineaProduccionSlice, LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { useForm } from "react-hook-form";
import { IOQCModelo } from "app/models/IOQModelo";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { OQCModeloSliceRequests, oqcModeloSlice } from "app/features/oqcGeneral/slices/OQCModeloSlice";
import { OQCPaletSliceRequests, oqcPaletSlice } from "app/features/oqcGeneral/slices/OQCPaletSlice";

export const OQCPaletPage = (): JSX.Element => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [lineaSeleccionada, setLineaSeleccionada] = useState<string | number>(0);

  const [plantaSeleccionada, setPlantaSeleccionada] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(0);
  const [modeloId, setModeloId] = useState<string | number>(0);

  const [listaLineas, setListaLineas] = useState<ILineaProduccion[]>([]);
  const [listaModelos, setListaModelos] = useState<IOQCModelo[]>([]);

  FetchApi<ILineaProduccion[]>(
    LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId,
    { plantaId: plantaSeleccionada, productoId: productoSeleccionado },
    false,
    productoSeleccionado,
    setListaLineas,
    productoSeleccionado != 0
  );

  const onGetModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(OQCModeloSliceRequests.getAllByLineaIdRequest(lineaSeleccionada as number))
      );
      if (response) {
        setListaModelos(response);
        const linea = listaLineas.find((elementos) => {
          return elementos.id === lineaSeleccionada;
        });
        dispatch(lineaProduccionSlice.actions.setSelectLinea(linea.id));
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onGetPalets = async () => {
    try {
      const response = unwrapResult(await dispatch(OQCPaletSliceRequests.getAllPaletsByModel(modeloId as number)));
      if (!response || response.length === 0) {
        openNotificationUI("No se encontraron palets para el modelo seleccionado", "info");
      }
      dispatch(oqcModeloSlice.actions.finModelo(modeloId as number));
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    TitleChanger("Administración de palets para OQC");
    return () => {
      dispatch(oqcPaletSlice.actions.setDataAll([]));
    };
  }, []);

  useEffect(() => {
    lineaSeleccionada != 0 && onGetModelos();
  }, [lineaSeleccionada]);

  useEffect(() => {
    modeloId != 0 && onGetPalets();
  }, [modeloId]);

  return (
    <ContainerForPages optionsLayout="page">
      <SelectLineaAndPlant
        varianteEstilo="standard"
        activarEstilosPersonalizados
        estilos="w-full mt-4 bg-secondaryNew p-5 flex flex-row gap-x-4 rounded-md"
        setPlantaId={setPlantaSeleccionada}
        setProductoId={setProductoSeleccionado}
        aniadirCodigoHtml={
          <>
            {listaLineas && (
              <SelectComponent
                listaObjetos={listaLineas}
                nameSelect="lineaProduccion"
                inputLabel="Seleccione una linea"
                valueLabel={(value) => value.nombre}
                valueSelect={(value) => value.id}
                valueKey={(value) => value}
                control={control}
                ValueSave={setLineaSeleccionada}
                varianteEstilo="standard"
              />
            )}
            {listaModelos && (
              <SelectComponent
                listaObjetos={listaModelos}
                nameSelect="oqcModelo"
                inputLabel="Seleccione un modelo"
                valueLabel={(value) => value.modeloMoto}
                valueSelect={(value) => value.id}
                valueKey={(value) => value}
                control={control}
                ValueSave={setModeloId}
                varianteEstilo="standard"
              />
            )}
          </>
        }
      />
      {modeloId != 0 && (
        <ContainerForPages optionsLayout="Table" activeEffectVisible>
          <OQCPaletTable refresh={onGetPalets} />
        </ContainerForPages>
      )}
    </ContainerForPages>
  );
};
