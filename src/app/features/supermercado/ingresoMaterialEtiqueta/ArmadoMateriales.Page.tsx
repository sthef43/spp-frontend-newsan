import { SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISuperCargalinea } from "app/models/ISuperCargalinea";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import useFetchApi from "app/shared/hooks/useFetchApi";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Autocomplete, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ArmadoMaterialesPage = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  useEffect(() => {
    TitleChanger("Armado de materiales");
  }, []);
  const initialState = {
    material: "",
    op: "",
    cantidad: "",
    modelo: "",
    codigoWip: ""
  };

  const { State: ListGroupedByModeloOp } = useFetchApi<ISuperCargalinea[]>(
    SuperCargalineaSliceRequests.getGroupedByModeloOp
  );
  const [informationOfOP, setinformationOfOP] = useState<ISuperCargalinea[]>(null);
  const { handleSubmit, control, watch, getValues, setValue } = useForm({ defaultValues: initialState, mode: "all" });
  //const opValor = watch("op");
  const { op: opValor, modelo: modeloValor, material: materialValor, codigoWip: codigoWipValor } = watch();
  const setInfoMaterial = async (buscar) => {
    let info;
    try {
      info = unwrapResult(await dispatch(SuperCargalineaSliceRequests.getByNumeroOp(buscar)));
    } catch (e) {
      info = null;
    }
    setinformationOfOP(info);
  };
  useEffect(() => {
    if (opValor?.length > 2) {
      setInfoMaterial(opValor);
    }
  }, [opValor]);
  useEffect(() => {
    if (materialValor?.length > 2) {
      console.log(materialValor);
      const buscar = informationOfOP.find((x) => x.descripcion == materialValor).codigoWip;
      setValue("codigoWip", buscar);
    }
  }, [materialValor]);
  const cambiarInfo = (option: ISuperCargalinea) => {
    if (option) {
      setValue("op", option.numeroOp);
      setValue("modelo", option.codigoModelo);
    }
  };
  return (
    <div>
      <TitleUIComponent title="Ingreso " />
      <div className="mx-5">
        <div className="grid grid-cols-2 justify-center gap-4 my-5">
          <div className="grid grid-cols-1">
            <div>
              {ListGroupedByModeloOp?.length > 0 && (
                <Autocomplete
                  id="alguno"
                  options={ListGroupedByModeloOp}
                  onChange={(e, newvalue: any) => cambiarInfo(newvalue)}
                  getOptionLabel={(option) => `${option.codigoModelo}  ${option.numeroOp}`}
                  // renderOption={(props, option: ISuperCargalinea) => (
                  //   <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                  //     {`${option.codigoModelo}  ${option.numeroOp}`}
                  //   </Box>
                  // )}
                  renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Modelos" />}
                />
              )}
            </div>
            <div>
              <Autocomplete
                id="alguno"
                disabled={!informationOfOP}
                options={
                  informationOfOP ? _.uniqBy(informationOfOP, (x) => x.descripcion).map((x) => x.descripcion) : []
                }
                onChange={(e, newvalue: any) => setValue("material", newvalue)}
                renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Materiales" />}
              />
            </div>
            <div>
              <TextField
                value={codigoWipValor}
                disabled={true}
                fullWidth
                className="text-black"
                placeholder="codigoWip"
                label="codigoWip"
                variant="outlined"
              />
            </div>
            <div>
              <Controller
                name="cantidad"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Cantidad"
                    label="Cantidad"
                    type="number"
                    variant="outlined"
                  />
                )}
              />
            </div>
          </div>
          <div className="col-span-1 items-center flex text-2xl justify-center">
            <div className="flex text-2xl justify-center items-center flex-col overflow-hidden bg-blue-600 rounded-lg border-2 border-blue-600">
              <div className=" p-2 text-gray-200">Material</div>
              <div className="">
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL}/images/Tornillos.webp`}
                  style={{ height: "50vh", width: "auto" }}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
