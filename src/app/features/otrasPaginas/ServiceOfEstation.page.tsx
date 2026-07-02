import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { ServiceOfEstationSliceRequests } from "app/Middleware/reducers/ServiceOfEstationSlice";
import { IServiceOfEstation } from "app/models";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
const InformationOfModelo = ({ codigo, error, repetido }: any) => {
  if (repetido) {
    return (
      <div className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan shadow-elevation-8 m-2 rounded-md text-9xl h-full flex justify-center items-center">
        <div className="text-center px-4 py-2 text-gray-50">ELEMENTO REPETIDO</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan shadow-elevation-8 m-2 rounded-md text-9xl h-full flex justify-center items-center">
        <div className="text-center px-4 py-2 text-gray-50">NO EXISTE EL ÍTEM</div>
      </div>
    );
  }

  return (
    codigo && (
      <div className="grid grid-cols-2 gap-8">
        <div className="block shadow-elevation-8 m-2 text-2xl text-gray-100 bg-gradient-to-r rounded-md from-blue-700 h-full via-blue-500 to-blue-700">
          <div className="grid grid-cols-2 gap-y-4 w-full p-6">
            <div className="font-semibold">Barcode</div>
            <div className="">{codigo.barcode}</div>
            <div className="font-semibold">Op</div>
            <div className="">{codigo.op}</div>
            <div className="font-semibold">Modelo</div>
            <div className="">{codigo.modelo}</div>
            <div className="font-semibold">Lote</div>
            <div className="">{codigo.lote}</div>
            <div className="font-semibold">Panel</div>
            <div className="">{codigo.panel}</div>
            <div className="font-semibold">Semi Elaborado</div>
            <div className="">{codigo.semielaborado}</div>
            <div className="font-semibold">Control de placas </div>
            <div className="">{codigo.controldeplacas ? "Si" : "No"}</div>
            <div className="col-span-2 font-semibold underline text-center">Estado : {codigo.estado}</div>
          </div>
        </div>

        {codigo.estado == "OK" ? (
          <div className="bg-gradient-to-r from-green-700 via-green-500 to-green-700 shadow-elevation-8 m-2 rounded-md text-9xl h-full flex justify-center items-center">
            <div className="text-center px-4 py-2 text-gray-50">GOOD</div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-newsan via-newsanLighten to-newsan shadow-elevation-8 m-2 rounded-md text-9xl h-full flex justify-center items-center">
            <div className="text-center px-4 py-2 text-gray-50">NO GOOD</div>
          </div>
        )}
      </div>
    )
  );
};
export const ServiceOfEstationPage = () => {
  const dispatch = useAppDispatch();
  const [codigoInfo, setcodigoInfo] = useState<string>("");
  const [codigo, setcodigo] = useState<IServiceOfEstation>(null);
  const [error, seterror] = useState<boolean>(false);
  const [repetido, setRepetido] = useState<boolean>(false);
  const { TitleChanger } = useTitleOfApp();
  React.useEffect(() => {
    TitleChanger("Ingreso de barcodes");
  }, []);
  const handleInformation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let result;
    if (e.target.value !== "") {
      setRepetido(false);
      try {
        result = unwrapResult(await dispatch(ServiceOfEstationSliceRequests.getInformationByNumber(e.target.value)));
      } catch {
        result = null;
      }
      if (result.error) {
        seterror(true);
        setcodigo(null);
      } else {
        try {
          result = unwrapResult(await dispatch(ServiceOfEstationSliceRequests.PostRequest(result)));
        } catch {
          result = null;
        }
        if (result) {
          seterror(false);
          setcodigo(result);
        } else {
          seterror(true);
          setcodigo(null);
          setRepetido(true);
        }
      }
      e.target.value = "";
    }
  };
  //const debo = useMemo(() => _.debounce(handleInformation, 1000), []);
  return (
    <div className="flex flex-col" style={{ height: "calc( 100vh - 48px )" }}>
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="flex items-center justify-center gap-8 w-full">
          <div className="font-semibold">Codigo</div>
          <TextField
            type="text"
            multiline
            variant="outlined"
            size="medium"
            label="Codigo"
            placeholder="Codigo"
            onChange={handleInformation}
          />
        </div>
      </div>
      <InformationOfModelo codigo={codigo} error={error} repetido={repetido} />
    </div>
  );
};
