import React, { useEffect, useState } from "react";
import { IModelo } from "app/models/IModelo";
import { useDispatch } from "react-redux";
import { useAppSelector } from "app/core/store/store";

import { Controller, useForm } from "react-hook-form";
import { LineaSlice, LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IModelos } from "app/models";

interface initialState {
  lineaId: number;
  modeloId: number;
}
const initialStateValue = {
  lineaId: 0,
  modeloId: 0
};

export const LineaModelo = () => {
  const { control, register, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateValue
  });

  const dispatch = useDispatch();
  const linea = useAppSelector((state) => state.lineaProduccion.dataAll as ILineaProduccion[]);
  const modelo = useAppSelector((state) => state.modelo.dataAll as IModelo[]);

  const [modelos, setModelos] = useState<IModelos[]>([]);
  const lineaIdWatch = watch("lineaId");

  const getAllLineas = async () => {
    try {
      setValue("lineaId", 0);
      await dispatch(LineaSliceRequests.getAllRequest());
    } catch (error) {
      console.log(error, "Error al llamar la base de datos");
    }
  };

  const getModelos = async () => {
    try {
      const lineaId = getValues("lineaId");
      dispatch(LineaSlice.actions.setSelectLinea(lineaId));
      const modelos = await dispatch(PlanProdSliceRequests.getAllModelosByLineaIdRequest(lineaId));
    } catch (error) {
      console.log(error, "Error al llamar la base");
    }
  };

  useEffect(() => {
    getAllLineas();
    getModelos();
  }, []);

  return (
    <main className="w-[45rem] ">
      <section className="flex items-center gap-x-3">
        <Controller
          name="lineaId"
          control={control}
          defaultValue={0}
          render={({ field }) => (
            <select
              {...field}
              className="w-1/2 p-2 text-xl font-semibold border-[1px] rounded-md border-gray-200 text-black">
              <option value="">Seleccione una linea</option>
              {linea?.map((elementos) => (
                <option value={elementos.id} key={elementos.id}>
                  {elementos.nombre}
                </option>
              ))}
            </select>
          )}
        />
        <Controller
          name="modeloId"
          control={control}
          defaultValue={0}
          render={({ field }) => (
            <select
              {...field}
              className="w-1/2 p-2 text-xl font-semibold border-[1px] rounded-md border-gray-200 text-black">
              <option value="">Seleccione un modelo</option>
              {modelos?.map((elementos) => (
                <option value={elementos.nombre} key={elementos.idModelo}>
                  {elementos.nombre}
                </option>
              ))}
            </select>
          )}
        />
      </section>
    </main>
  );
};
