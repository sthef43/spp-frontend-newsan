/* eslint-disable react/display-name */
import React from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { PedidoMaterialProduccion } from "app/features/gerencia/pedidoMateriales/components/PedidoMaterialProduccion";
import { Controller, useForm } from "react-hook-form";
import { PedidoMaterialCalidad } from "app/features/gerencia/pedidoMateriales/components/PedidoMaterialCalidad";
import { ReporteExcel } from "../components/ReporteExcel";

export const PedidoMaterialesPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const initialState = {
    origenRadioButton: "P"
  };

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });
  const watchOrigen = watch("origenRadioButton");

  React.useEffect(() => {
    TitleChanger(`PEDIDOS DE MATERIALES ${watchOrigen === "P" ? "PRODUCCIÓN" : "CALIDAD"} `);
  }, [watchOrigen]);

  return (
    <div className="my-2 mx-4">
      <div className="text-center sm:text-left p-2">
        <FormControl>
          <FormLabel>Origen del pedido</FormLabel>
          <Controller
            render={({ field }) => (
              <RadioGroup {...field}>
                <div className="sm:grid sm:grid-cols-1 ">
                  <div className="sm:col-span-1 ">
                    <FormControlLabel value="P" control={<Radio />} label="Producción" />
                    <FormControlLabel value="C" control={<Radio />} label="Calidad" />
                  </div>
                </div>
              </RadioGroup>
            )}
            rules={{ required: true }}
            control={control}
            defaultValue="P"
            name="origenRadioButton"
          />
        </FormControl>
      </div>
      <div className="text-center sm:text-left p-2">{watchOrigen === "P" ? "" : <ReporteExcel></ReporteExcel>}</div>
      {watchOrigen === "P" ? <PedidoMaterialProduccion /> : <PedidoMaterialCalidad />}
    </div>
  );
};
