import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { AuditDispositivoSliceRequests } from "app/features/audit/slices/AuditDispositivoSlice";

interface Props {
  auditTableId: number;
  codigoChanger: any;
  codigo: string;
}

export const AudithAutocomplete = ({ codigoChanger, auditTableId, codigo }: Props) => {
  const plantas = useAppSelector((p) => p.plant.dataAll);
  const vehiculos = useAppSelector((p) => p.auditDispositivo.dataAll);
  const [informationOfCode, setinformationOfCode] = useState(null);
  const [plantId, setPlantId] = useState(null);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);
  React.useEffect(() => {
    if (plantId) {
      dispatch(AuditDispositivoSliceRequests.GetAllByPlantAndTable({ table: auditTableId, plantId: plantId }));
    }
  }, [plantId]);
  React.useEffect(() => {
    console.log(informationOfCode);
  }, [informationOfCode]);
  return (
    <div>
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="py-2 grid grid-cols-2 gap-10 overflow-auto">
          <FormControl>
            <InputLabel>Seleccione la planta</InputLabel>
            <Select
              onChange={(event: any) => {
                if (event.target.value) setPlantId(event.target.value);
              }}>
              {plantas &&
                plantas.map((planta) => (
                  <MenuItem key={planta.id} value={planta.id}>
                    <div>{planta.name}</div>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Seleccione el código</InputLabel>
            <Select
              value={codigo}
              onChange={(e: any) => {
                const object = vehiculos.find((v) => v.codigo == e.target.value);
                setinformationOfCode(object);
                codigoChanger(e.target.value);
              }}>
              {vehiculos &&
                vehiculos?.map((vehiculo) => (
                  <MenuItem key={vehiculo.id} value={vehiculo.codigo}>
                    <div>{vehiculo.codigo}</div>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        {informationOfCode && (
          <div>
            <div className="p-2 hidden md:block">
              <div className="grid grid-cols-4 gap-2 md:gap-8 font-semibold text-lg text-center shadow-elevation-4 rounded-lg bg-blue-600 text-gray-100 ">
                <div>Nombre</div>
                <div>Marca</div>
                <div>Modelo</div>
                <div>año</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8 font-medium text-center">
                <div>{informationOfCode.nombre}</div>
                <div>{informationOfCode.marca}</div>
                <div>{informationOfCode.modelo}</div>
                <div>{informationOfCode.ano}</div>
              </div>
            </div>
            <div className="p-2 block md:hidden">
              <div className="grid grid-cols-4 w-full">
                <div className="font-semibold">Nombre:</div>
                <div className="col-span-3">{informationOfCode.nombre}</div>
                <div className="font-semibold">Marca: </div>
                <div className="col-span-3"> {informationOfCode.marca}</div>
                <div className="font-semibold">Modelo:</div>
                <div className="col-span-3"> {informationOfCode.modelo}</div>
                <div className="font-semibold">año: </div>
                <div className="col-span-3"> {informationOfCode.ano}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
