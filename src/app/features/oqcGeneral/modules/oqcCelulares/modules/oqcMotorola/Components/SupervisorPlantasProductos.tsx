/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { lineaProduccionSlice, LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ContextApp } from "app/features/oqcGeneral/modules/oqcCelulares/Context/Context";
import { IOQC } from "app/models/IOQC";
import { ArrowDropDown } from "@mui/icons-material";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { plantSlice, PlantSliceRequests } from "app/Middleware/reducers";
import { IPlant } from "app/models";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OQCSupervisoresMotorolaSliceRequest } from "app/features/oqcGeneral/slices/OqcSupervisoresMotorola";
import { IOQCModelo } from "app/models/IOQModelo";
import { oqcSlice, OQCSliceRequests } from "app/features/oqcGeneral/slices/OQCSlice";
import { OQCModeloSliceRequests, oqcModeloSlice } from "app/features/oqcGeneral/slices/OQCModeloSlice";

interface initialState {
  productoId: number;
  lineaId: number;
  plantaId: number;
  userName: string;
  nombrePlanta: string;
  plantaUsuario: number;
  modeloID: number;
  familiaId: number;
}
const initialStateValue = {
  lineaId: 0,
  plantaUsuario: 0,
  plantaId: 0,
  userName: "",
  nombrePlanta: "",
  modeloID: 0,
  productoId: 0,
  familiaId: 0
};

interface props {
  palletsCerrados: boolean;
}

export const SupervisorPlantaProducto: React.FC<props> = ({ palletsCerrados }) => {
  const contextoGlobal = useContext(ContextApp);

  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateValue
  });

  const dispatch = useAppDispatch();
  const lineaIdWatch = watch("lineaId");
  const watchPlantaId = watch("plantaId");

  //Funcion que setea los valores del usuario ingresado
  const getOperarios = async () => {
    const usuario = GetInfoUser();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(usuario.dni)));
      if (response) {
        setValue("userName", response.name + " " + response.surname);
        setValue("nombrePlanta", response.planta.name);
        setValue("plantaId", response.plantaId);
        contextoGlobal.setNombreAuditor(response.name + " " + response.surname);
        contextoGlobal.setOrganizationCode(response.planta.organizationCode);
        contextoGlobal.setAuditorId(response.id);
        contextoGlobal.setPlantaIdAuditor(response.plantaId);
        contextoGlobal.setAuditor({
          name: response.name,
          surname: response.surname,
          turnoId: response.turnoId
        });
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error, "Error al llamar los datos");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //Funcion que llama a las lineas que le pertenecen al producto seleccionado
  const [lineas, setLineas] = useState(null);
  const getAllLinea = async () => {
    const watchPlantaId = watch("plantaId");
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      //Cambiar Producto ID a 3 cuando este la base de produccion en uso
      //Cambiar Producto ID a 2 cuando este la base de prueba en uso
      const response = unwrapResult(
        await dispatch(
          LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId({ plantaId: watchPlantaId, productoId: 3 })
        )
      );
      if (response) {
        contextoGlobal.setOqcDesigandaId(93);
        const buscarCelulares = response.filter(
          (elementos) => elementos.producto.nombre.toLowerCase().includes("cel") && elementos.plantId == watchPlantaId
        );
        const nombreLineas = buscarCelulares.map((elementos) => {
          setValue("productoId", elementos.productoId);
          contextoGlobal.setProductoId(elementos.productoId);
          return elementos;
        });
        setLineas(nombreLineas);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const [Oqc, setOqc] = useState<IOQC>();
  const getOqcDesignada = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      //Cuando este en uso la base de datos de produccion usar el id 3
      //Cuando este en uso la base de datos de prueba usar el id 2
      const oqc = unwrapResult(await dispatch(OQCSliceRequests.getAllByProductoIdRequest(3)));
      if (oqc) {
        const oqcCelulares = oqc.find((elementos) => elementos.nombre.toLowerCase() == "oqc celulares");
        dispatch(oqcSlice.actions.setObject(oqcCelulares));
        oqc.forEach((elementos) => {
          if (elementos.nombre.toLowerCase() == "oqc celulares") {
            //contextGlobal.setBloquesGroup(elementos.oqcBloqueGroup[0].oqcBloque.oqcBloqueHallazgo)
            contextoGlobal.setBloquesGroup(elementos.oqcBloqueGroup);
            setOqc(elementos);
          }
        });
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
    }
  };

  //Funcion que trae los modelos segun la familia que allamos seleccionado
  const [modelo, setModelo] = useState<IOQCModelo[]>([]);
  const getModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCModeloSliceRequests.GetAllModelsActivate(lineaIdWatch)));
      if (response) {
        setModelo(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log("Surgio un error", error);
    }
  };

  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      if (response) {
        setListaPlantas(response);
        contextoGlobal.setListaPlantas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const oqcDesignada = () => {
    try {
      Oqc.oqcDesignada.map((elementos) => {
        if (elementos.lineaProduccionId == lineaIdWatch) {
          contextoGlobal.setOqcDesigandaId(elementos.id);
        } else {
          contextoGlobal.setOqcDesigandaId(93);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getListaOperarios = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(OQCSupervisoresMotorolaSliceRequest.getAllSupervisoresByPlantId(watchPlantaId))
      );
      if (response) {
        contextoGlobal.setListaOperarios(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buscarPlantaSeleccionada = () => {
    const plantaSeleccionada = listaPlantas.find((elementos) => elementos.id == watchPlantaId);
    contextoGlobal.setPlanta(plantaSeleccionada);
  };

  //En esta funcion vemos los datos que nos llegan de los selects
  const onSubmit = (data) => {
    contextoGlobal.setModeloSeleccionado(modelo);
  };

  //Iniciamos el cargado de la pagina con el llamado de las bases de datos
  useEffect(() => {
    getOperarios();
    getPlantas();
  }, []);

  useEffect(() => {
    if (watchPlantaId) {
      contextoGlobal.setPlantaId(watchPlantaId);
      dispatch(plantSlice.actions.setSelectPlant(watchPlantaId));
      buscarPlantaSeleccionada();
    }
  }, [watchPlantaId]);

  const valorPlantaId = getValues("plantaId");
  useEffect(() => {
    if (valorPlantaId) {
      getAllLinea();
      getOqcDesignada();
      setValue("modeloID", 0);
      setValue("lineaId", 0);
    }
  }, [valorPlantaId]);

  useEffect(() => {
    if (lineaIdWatch) {
      contextoGlobal.setLineaSeleccionadaId(lineaIdWatch);
      getModelos();
      oqcDesignada();
    }
  }, [lineaIdWatch]);

  const watchModelo = watch("modeloID");
  useEffect(() => {
    contextoGlobal.setModeloSeleccionadoId(watchModelo);
    getListaOperarios();
    if (watchModelo) {
      const modeloBuscado = modelo.find((elementos) => elementos.id == watchModelo);
      dispatch(oqcModeloSlice.actions.setObject(modeloBuscado));
    }
    dispatch(plantSlice.actions.setSelectPlant(contextoGlobal.plantaId));
    dispatch(lineaProduccionSlice.actions.setSelectLinea(contextoGlobal.lineaSeleccionadaId));
  }, [watchModelo]);

  useEffect(() => {
    if (contextoGlobal.agregarSupervisor) {
      getListaOperarios();
    }
  }, [contextoGlobal.agregarSupervisor]);

  useEffect(() => {
    if (contextoGlobal.eliminarMuestra) {
      setValue("modeloID", 0);
    }
  }, [contextoGlobal.eliminarMuestra]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
      <section className="flex gap-5 justify-around items-end w-full">
        <div className="flex flex-col items-center border-b border-gray-500 w-48">
          <p className="font-semibold mb-4">Auditor</p>
          <p className="text-xl font-semibold">{getValues("userName")}</p>
        </div>
        <div className="w-[15rem]">
          {listaPlantas && (
            <Controller
              name="plantaId"
              control={control}
              defaultValue={0}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel sx={{ left: "29%", fontSize: "1.35rem", fontWeight: "600", top: "-25%" }}>
                    Planta
                  </InputLabel>
                  <Select {...field} variant="standard">
                    {listaPlantas &&
                      listaPlantas.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div className="font-semibold text-center">{x.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          )}
        </div>
        <div className="flex flex-col items-center border-b border-gray-500 w-48">
          <p className="font-semibold mb-4">Producto</p>
          <p className="text-xl font-semibold">Celulares Motorola</p>
        </div>
      </section>
      <hr className="w-full border-gray-500 mt-6" />
      <section className="flex items-center gap-x-3 w-full mt-4 p-4">
        <Controller
          name="lineaId"
          control={control}
          defaultValue={0}
          render={({ field }) => (
            <div className="grid items-center relative">
              <select
                {...field}
                className="selectSupervisorPlantaProducto"
                {...register("lineaId", {
                  required: {
                    value: true,
                    message: "Ingrese una linea valida"
                  },
                  validate: (value) => {
                    if (value == 0) {
                      return "Ingrese una linea";
                    } else {
                      return true;
                    }
                  }
                })}>
                <option value="0">Seleccione una línea</option>
                {lineas?.map((elementos) => (
                  <option value={elementos.id} key={elementos.id}>
                    {elementos.nombre}
                  </option>
                ))}
              </select>
              <ArrowDropDown className="absolute right-5 col-start-1" />
            </div>
          )}
        />
        <Controller
          name="modeloID"
          control={control}
          defaultValue={0}
          render={({ field }) => (
            <div className="grid items-center relative">
              <select
                {...field}
                className="selectSupervisorPlantaProducto"
                {...register("modeloID", {
                  required: {
                    value: true,
                    message: "Ingrese una linea valida"
                  },
                  validate: (value) => {
                    if (value == 0) {
                      return "Ingrese una modelo valido";
                    } else {
                      return true;
                    }
                  }
                })}>
                <option value="0">Seleccione Sales Model</option>
                {modelo?.map((elementos) => (
                  <option key={elementos.id} value={elementos.id}>
                    {elementos.modeloNewsan}
                  </option>
                ))}
              </select>
              <ArrowDropDown className="absolute right-5 col-start-1" />
            </div>
          )}
        />
        <button
          type="submit"
          disabled={!isValid || palletsCerrados}
          onClick={() => contextoGlobal?.setMasterBox(!contextoGlobal.masterBox)}
          className={`${
            palletsCerrados ? "bg-gray-400 hover:bg-gray-600" : "bg-[#9D78DC] hover:bg-violet-600"
          } text-white font-semibold w-[60%] h-full text-xl rounded-md shadow-shadowBox md`}>
          Nuevo Registro
        </button>
      </section>
      <div></div>
    </form>
  );
};
