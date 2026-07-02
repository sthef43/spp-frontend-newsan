import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm, Controller } from "react-hook-form";

import { IOperator } from "app/models";

import React, { useEffect, useState } from "react";

type formSelects = {
  Supervisor: string;
  Estetica: string;
  Packing: string;
  obaTest: string;
};

interface PropsSelects {
  StyleUser?: string;
}
export const SelectSupervisor = ({ StyleUser }: PropsSelects) => {
  const { control, register } = useForm<formSelects>();

  const dispatch = useAppDispatch();

  const opciones = ["Good", "Bad"];
  const ObaTestArray = ["ASAS123", "ASSWW1133", "FFAKSJQI23", "JFKDJFJ324"];

  const [supervisor, setSupervisor] = useState("");
  const [estetica, setEstetica] = useState("");
  const [packing, setPacking] = useState("");
  const [obaTest, setObaTest] = useState("");

  //Llamar datos de la BASE DE DATOS de operarios y setear en un array los datos
  const supervisores = useAppSelector((state) => state.operator.dataAll as IOperator[]);
  const getOperarios = async () => {
    try {
      await Promise.all([dispatch(OperatorSliceRequests.getAllRequest())]);
    } catch (error) {
      console.log(error, "Error al llamar los datos");
    }
  };

  useEffect(() => {
    getOperarios();
  }, []);

  return (
    <main className={StyleUser}>
      <Controller
        name="Supervisor"
        control={control}
        defaultValue=""
        rules={{ required: "Ingrese un supervisor" }}
        render={({ field }) => (
          <select
            onChange={(e) => setSupervisor(e.target.value)}
            {...field}
            className="border-[1px] border-gray-300 p-2 rounded-sm shadow-md">
            <option value="null">SUPERVISOR</option>
            {supervisores
              .filter(
                (buscarPersona) =>
                  buscarPersona.position == "Programacion" || buscarPersona.position == "Administrativo"
              )
              .map((supervisor) => (
                <option key={supervisor.id} value={supervisor.name}>
                  {supervisor.name}
                </option>
              ))}
          </select>
        )}
      />
      <Controller
        name="obaTest"
        control={control}
        defaultValue=""
        rules={{ required: "Ingrese el test de observacion" }}
        render={({ field }) => (
          <select
            {...field}
            onChange={(e) => setObaTest(e.target.value)}
            className="border-[1px] border-gray-300 p-2 rounded-sm shadow-md">
            <option value="Null">OBA TEST</option>
            {ObaTestArray.map((elementos, index) => (
              <option value={elementos} key={index}>
                {elementos}
              </option>
            ))}
          </select>
        )}
      />
      <Controller
        name="Estetica"
        control={control}
        defaultValue=""
        rules={{ required: "Ingrese la estetica" }}
        render={({ field }) => (
          <select
            {...field}
            onChange={(e) => setEstetica(e.target.value)}
            className="border-[1px] border-gray-300 p-2 rounded-sm shadow-md">
            <option value="">ESTETICA</option>
            {opciones.map((elementos, index) => (
              <option value={elementos} key={index}>
                {elementos}
              </option>
            ))}
          </select>
        )}
      />
      <Controller
        name="Packing"
        control={control}
        defaultValue=""
        rules={{ required: "Ingrese el packing" }}
        render={({ field }) => (
          <select
            {...field}
            onChange={(e) => setPacking(e.target.value)}
            className="border-[1px] border-gray-300 p-2 rounded-sm shadow-md">
            <option value="">ESTETICA</option>
            {opciones.map((elementos, index) => (
              <option value={elementos} key={index}>
                {elementos}
              </option>
            ))}
          </select>
        )}
      />
    </main>
  );
};
