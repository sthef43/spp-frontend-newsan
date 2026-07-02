import React from "react";
import { Divider, IconButton, Typography } from "@mui/material";
import { ILimites } from "app/models";
import { Check, Clear } from "@mui/icons-material";

interface props {
  limiteFull: ILimites;
}

export const InfoVerificacion = ({ limiteFull }: props): JSX.Element => {
  return (
    <div>
      <div>
        <div className="grid grid-cols-1 text-lg font-semibold gap-2">
          <div className="underline underline-offset-1">Codigo Trazabilidad: </div>
        </div>
        <div className="grid grid-cols-1 text-center sm:text-5xl text-3xl font-semibold gap-2 p-3">
          <div>{limiteFull?.codigoTrazabilidad} </div>
        </div>
      </div>

      {/* -------------------DATOS DEL EQUIPO-------------------- */}
      <Divider />

      <div className="grid grid-cols-1 text-lg font-semibold gap-2">
        <div className="underline underline-offset-1">Datos del Equipo: </div>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 p-3">
        <div className="flex">
          <Typography className=" font-semibold mr-3">Tipo de Equipo: </Typography>
          <Typography> {limiteFull?.idGenericoNavigation?.codigo}</Typography>
        </div>
        <div className="flex">
          <Typography className=" font-semibold mr-3">Versión:</Typography>
          <Typography>{limiteFull?.version}</Typography>
        </div>
      </div>

      {/* -------------------DATOS DEL PUESTO-------------------- */}
      <Divider />
      <div className="grid grid-cols-1 text-lg font-semibold gap-2 items-center">
        <div className="underline underline-offset-1">Sector y Puesto: </div>
      </div>
      <div className="grid sm:grid-cols-4 grid-cols-1 gap-2 p-3">
        <div className="flex">
          <Typography className=" font-semibold mr-3">Sector:</Typography>
          <Typography>{limiteFull?.instpuesto?.sector}</Typography>
        </div>
        <div className="flex">
          <Typography className=" font-semibold mr-3">Descripción:</Typography>
          <Typography>{limiteFull?.instpuesto?.descripcion}</Typography>
        </div>
        <div className="flex">
          <Typography className=" font-semibold mr-3">Número de Puesto:</Typography>
          <Typography>{limiteFull?.numeroPuesto}</Typography>
        </div>
        <div className="flex items-center">
          <Typography className=" font-semibold mr-3">Crítico:</Typography>
          {limiteFull?.instpuesto?.critico ? (
            <IconButton disabled>
              <Check color="success" />
            </IconButton>
          ) : (
            <IconButton disabled>
              <Clear color="error" />
            </IconButton>
          )}
        </div>
      </div>
      {/* -------------------TORQUES-------------------- */}
      <Divider />
      <div className="grid grid-cols-1 text-lg font-semibold gap-2">
        <div className="underline underline-offset-1">Torques: </div>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 p-3">
        <div className="flex">
          <Typography className=" font-semibold mr-3">Torque Mínimo:</Typography>
          <Typography>{limiteFull?.torqueMinimo}</Typography>
        </div>
        <div className="flex">
          <Typography className=" font-semibold mr-3">Torque Máximo:</Typography>
          <Typography>{limiteFull?.torqueMaximo}</Typography>
        </div>
      </div>
      {/* -------------------DATOS DE LAS ATORNILLADORAS-------------------- */}
      <Divider />
      <div className="grid grid-cols-1 text-lg font-semibold gap-2">
        <div className="underline underline-offset-1">Atornilladoras: </div>
      </div>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-2 p-3">
        <div className="flex">
          <Typography className=" font-semibold mr-3">Alimentación:</Typography>
          <Typography>{limiteFull?.idAtornilladoraAlimNavigation?.tipoAlimentacion}</Typography>
        </div>
        <div className="flex">
          <Typography className=" font-semibold mr-3">Formato:</Typography>
          <Typography>{limiteFull?.idAtornilladoraFormatoNavigation?.formato}</Typography>
        </div>
        <div className="flex">
          <Typography className=" font-semibold mr-3">Modelo:</Typography>
          <Typography>
            {limiteFull?.atornilladoraModelo.length > 0 ? limiteFull?.atornilladoraModelo : "Sin modelo asignado"}
          </Typography>
        </div>
      </div>
    </div>
  );
};
