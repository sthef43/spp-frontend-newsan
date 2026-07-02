/* eslint-disable unused-imports/no-unused-vars */
import { Check, Upload } from "@mui/icons-material";
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasImagenSliceRequests } from "app/Middleware/reducers/EtiquetasImagenSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ModelosSliceRequests } from "app/Middleware/reducers/ModelosSlice";
import { useAppDispatch } from "app/core/store/store";
import { IModelos } from "app/models";
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import produce from "immer";
import React from "react";

const ImagenAnterior = (props: any) => {
  const dispatch = useAppDispatch();
  const [etiquetaImagen, setEtiquetaImagen] = React.useState(null);
  React.useEffect(() => {
    setEtiquetaImagen(props.etiquetaImagen);
  }, [props.etiquetaImagen]);
  return (
    <>
      {etiquetaImagen?.url && (
        <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
          <TitleUIComponent title="Imagen actual" classNameTitle="text-base" />
          <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
            <img
              style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
              src={`${import.meta.env.BASE_URL}imagenes/patron-etiquetas/${etiquetaImagen.url}`}
            />
          </div>
        </div>
      )}
      {etiquetaImagen?.url == null && (
        <div className="flex justify-center">
          <TitleUIComponent title="Sin imagen" classNameTitle="text-base" />
        </div>
      )}
    </>
  );
};

export const IngresarImagenesEtiquetas = () => {
  const classes = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    TitleChanger("Ingresar imagenes para etiquetas");
  }, []);
  const hiddenFileInput: any = React.useRef(null);
  const [modelos, setModelos] = React.useState<IModelos[]>();
  const [selectModelo, setSelectModelo] = React.useState<IModelos>(null);
  const [tipoEtiqueta, setTipoEtiqueta] = React.useState<string>();
  const [tipoUnidad, setTipoUnidad] = React.useState<string>();
  const [data, setdata] = React.useState({ modelo: "", tipoDeEtiqueta: "", imageFile: null, tipoUnidad: "" });
  const [dataImagen, setDataImagen] = React.useState<IEtiquetasImagen>();
  const [urlImage, seturlImage] = React.useState(null);
  const getAllModels = async (etiqueta: string, tipoUnidad: string) => {
    let result;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      result = unwrapResult(await dispatch(ModelosSliceRequests.getModelosByTipoUnidad(tipoUnidad)));
      result = getTipoModelo(result, etiqueta, tipoUnidad);
      setModelos(result);
      // if (etiqueta == "EE") {
      //   setModelos(result);
      // } else {
      //   if (tipoUnidad == "I") {
      //     result = result.map((modelo) => {
      //       modelo.nombre = modelo.nombre + "I";
      //       return modelo;
      //     });
      //     setModelos(result);
      //   } else {
      //     result = result.map((modelo) => {
      //       modelo.nombre = modelo.nombre + "E";
      //       return modelo;
      //     });
      //     setModelos(result);
      //   }
      // }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (x) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      result = null;
    }
  };
  const getTipoModelo = (modelos: IModelos[], etiqueta: string, tipoUnidad: string) => {
    const newModelos = modelos.filter((modelo) => {
      if (etiqueta == "EM") {
        if (modelo.tipoUnidad == "I" && tipoUnidad == "I") {
          return modelo;
        } else if (modelo.tipoUnidad == "E" && tipoUnidad == "E") {
          return modelo;
        } else if (modelo.tipoUnidad == "P" && tipoUnidad == "P") {
          return modelo;
        } else if (modelo.tipoUnidad == "W" && tipoUnidad == "W") {
          return modelo;
        }
      }
      if (etiqueta == "EE") {
        if (modelo.tipoUnidad != "P") {
          return modelo;
        }
      }
      if (etiqueta == "EC") {
        if (modelo.nombre.startsWith("S4")) {
          if (modelo.tipoUnidad == "I" && tipoUnidad == "I") {
            return modelo;
          } else if (modelo.tipoUnidad == "E" && tipoUnidad == "E") {
            return modelo;
          }
        }
      }
    });
    return newModelos;
  };

  const getImage = async (tipoEtiqueta) => {
    let result;
    try {
      result = unwrapResult(
        await dispatch(
          EtiquetasImagenSliceRequests.getByModelo({
            modelo: selectModelo.codigoModelo,
            tipoDeEtiqueta: tipoEtiqueta
          })
        )
      );
      setDataImagen(result);
    } catch (x) {
      result = null;
    }
  };

  const onFileChange = (event) => {
    if (event.target.files[0]) {
      console.log(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();
      console.log(reader);
      setdata(
        produce((draft) => {
          draft.imageFile = file;
        })
      );
      reader.addEventListener("load", () => {
        seturlImage(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
    console.log(urlImage);
  };

  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };

  const upload = async (e) => {
    if (selectModelo != null) {
      const result = unwrapResult(await dispatch(EtiquetasImagenSliceRequests.Upload(data)));
      if (result) {
        {
          openNotificationUI("Imagen guardada con éxito", "success");
          setTipoEtiqueta("");
          setSelectModelo(null);
          setValor(null);
          setDataImagen(null);
          seturlImage(null);
          setdata({ modelo: "", tipoDeEtiqueta: "", imageFile: null, tipoUnidad: "" });
          location.reload();
        }
      } else openNotificationUI("Error en la subida de la imagen", "error");
    } else openNotificationUI("Error el modelo no es valido", "error");
  };

  const CustomAutocomplete = (options, onChange, defaultValue) => {
    return (
      <Autocomplete
        options={options}
        onChange={onChange}
        defaultValue={defaultValue}
        getOptionLabel={(option) => `${option.codigoModelo}`}
        renderInput={(props) => <TextField {...props} fullWidth label="Modelos" variant="filled" />}
      />
    );
  };

  const [valor, setValor] = React.useState();
  const handleChange = (e, value) => {
    if (value) {
      console.log(value.codigoModelo);
      setSelectModelo(value);
      setdata({ ...data, modelo: value.codigoModelo });
    }
  };

  React.useEffect(() => {
    console.log(selectModelo);
    if (selectModelo && tipoEtiqueta) {
      getImage(tipoEtiqueta);
    }
  }, [selectModelo, tipoEtiqueta]);
  React.useEffect(() => {
    TitleChanger("Ingreso de imagenes de etiquetas");
  }, []);
  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <div className="mx-5">
        <div className="grid grid-cols-2 justify-center gap-4 my-5 w-full">
          <div className="col-span-2 flex gap-4 justify-center w-full ">
            <div className="w-full">
              <FormControl variant="filled" fullWidth className="mb-3">
                <InputLabel>Tipo de etiqueta</InputLabel>
                <Select
                  value={tipoEtiqueta}
                  onChange={(e: any) => {
                    if (e.target.value) {
                      setTipoEtiqueta(e.target.value);
                      setdata({ ...data, tipoDeEtiqueta: e.target.value });
                      if (e.target.value == "EE") {
                        getAllModels(e.target.value, "");
                      }
                    }
                  }}>
                  <MenuItem value={"EM"}> Modelo</MenuItem>
                  <MenuItem value={"EE"}> Eficiencia</MenuItem>
                  <MenuItem value={"EC"}> Caja</MenuItem>
                </Select>
              </FormControl>
              {tipoEtiqueta != "EE" && (
                <FormControl variant="filled" fullWidth className="mb-3">
                  <InputLabel>Tipo de unidad</InputLabel>
                  <Select
                    value={tipoUnidad}
                    onChange={(e: any) => {
                      if (e.target.value) {
                        setTipoUnidad(e.target.value);
                        getAllModels(tipoEtiqueta, e.target.value);
                        setdata({ ...data, tipoUnidad: e.target.value });
                      }
                    }}>
                    <MenuItem value={"E"}> Exterior</MenuItem>
                    <MenuItem value={"I"}> Interior</MenuItem>
                    <MenuItem value={"W"}> Window</MenuItem>
                    {/* <MenuItem value={"P"}> Portable</MenuItem> */}

                    {/* {tipoEtiqueta != "EC" && <MenuItem value={"W"}> Window</MenuItem>} */}
                  </Select>
                </FormControl>
              )}
              {modelos && CustomAutocomplete(modelos, handleChange, valor)}
            </div>
            <Button
              onClick={handleClick}
              variant="contained"
              className="bg-blue-500 shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1"
              disabled={!tipoEtiqueta && data.modelo == ""}>
              <Upload />
              <span className="hidden sm:block">Importar</span>
            </Button>
            <input
              type="file"
              accept="image/png, image/jpeg"
              name="Importar"
              onChange={onFileChange}
              ref={hiddenFileInput}
              multiple={false}
              className="hidden"
            />
          </div>
          <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
            {dataImagen?.modelo && <ImagenAnterior etiquetaImagen={dataImagen} />}
            {urlImage && (
              <>
                <TitleUIComponent title="Preview nueva imagen de etiqueta" classNameTitle="text-base" />
                <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
                  <img style={{ maxHeight: "50vh", width: "auto", height: "100%" }} src={urlImage} />
                </div>
                <Button startIcon={<Check />} className={classes.greenButton} variant="contained" onClick={upload}>
                  Guardar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
