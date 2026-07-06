import React from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Autocomplete, Button, Divider, FormControl, TextField, Theme } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ILinea, IGenerico, ILimites } from "app/models";
// import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { LimitesTable } from "./LimitesTable";
import { LimitesSliceRequests } from "app/Middleware/reducers/LimitesSlice";
import _ from "lodash";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";

export const ControlDeTorques = (): JSX.Element => {
  const initialState = {
    linea: 0,
    generico: 0
  };

  const { control, getValues, watch, setValue } = useForm({
    defaultValues: initialState
  });

  const [limites, setLimites] = React.useState<ILimites[]>([]);
  const [busquedaDisabled, setBusquedaDisabled] = React.useState<boolean>(false);
  const [lineas, setLineas] = React.useState<ILinea[]>([]);
  const [genericos, setGenericos] = React.useState<IGenerico[]>([]);
  const [codReparacion, setCodReparacion] = React.useState<string>("");
  const [tipoUnidad, setTipoUnidad] = React.useState<string>("");
  const [reset, setReset] = React.useState<number>(0);
  const buttonClasses = MaterialButtons();
  const [screenWidth, setScreenWidth] = React.useState("");

  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const defaultProps = {
    options: genericos,
    getOptionLabel: (option) => option?.codigo
  };

  React.useEffect(() => {
    TitleChanger("CONTROL DE TORQUES");
  }, []);

  const onInit = async () => {
    let fetchLineasResult;
    try {
      fetchLineasResult = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    } catch (error) {
      fetchLineasResult = null;
    }
    if (fetchLineasResult) {
      setLineas(fetchLineasResult);
    }
  };

  //FETCH PARA TRAERME LOS MODELOS DE ESA LINEA
  const handleLineaChange = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      setValue("generico", 0);
      setReset((value) => value + 1);
      const fetchGenericoResult = unwrapResult(
        await dispatch(GenericoSliceRequests.getAllByTipoUnidadRequest(tipoUnidad))
      );
      setGenericos(_.orderBy(fetchGenericoResult, (l) => l.codigo));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getAllLimites = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      console.log("value en el fetch", getValues("generico"));
      const fetchLimitesResult = unwrapResult(
        await dispatch(
          LimitesSliceRequests.getAllByLineaGenerico({
            linea: parseInt(codReparacion),
            generico: getValues("generico")
          })
        )
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      setLimites(_.orderBy(fetchLimitesResult, "numeroPuesto"));
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getTitleSize = () => {
    setScreenWidth(window.screen.availWidth >= 420 ? "text-2xl" : "text-base");
  };

  React.useEffect(() => {
    getTitleSize();
  }, [window.screen]);

  //LISTENER, SE EJECUTA CUANDO SELECCIONE UNA LINEA
  React.useEffect(() => {
    if (tipoUnidad?.length > 0) {
      handleLineaChange();
    }
  }, [tipoUnidad]);

  React.useEffect(() => {
    onInit();
  }, []);
  React.useEffect(() => {
    if (genericos) {
      const value = genericos?.find((x) => x.id == getValues("generico"));
      setValue("generico", parseInt(value?.codigo));
    }
  }, [genericos]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="sm:flex md:flex items-center justify-around w-full font-semibold  mb-4">
            <SelectOFPlantAndProducts
              selectLineas
              setTipoUnidadLinea={setTipoUnidad}
              setCodigoErrorProps={setCodReparacion}>
              <div className="flex gap-4 ">
                <FormControl variant="standard" fullWidth>
                  <Autocomplete
                    {...defaultProps}
                    key={reset}
                    onChange={(e, newvalue: any) => setValue("generico", newvalue.id)}
                    renderInput={(params) => <TextField {...params} variant="standard" fullWidth label="Genério" />}
                  />
                </FormControl>
                <Button
                  onClick={() => {
                    getAllLimites();
                  }}
                  className={buttonClasses.blueButton}
                  disabled={busquedaDisabled}
                  variant="contained">
                  Buscar
                </Button>
              </div>
            </SelectOFPlantAndProducts>
          </div>
          <Divider />
          {limites.length > 0 && (
            <div className="animate__animated animate_fadeUp">
              <LimitesTable
                limites={limites}
                linea={lineas.find((lan) => lan.codigoReparacion === codReparacion).descripcion}
                refresh={getAllLimites}
              />
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
};
