import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasImagenSliceRequests } from "app/Middleware/reducers/EtiquetasImagenSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import produce from "immer";
import { TipoEtiquetaSliceRequests } from "app/Middleware/reducers/TipoEtiquetaSlice";
import { ITipoEtiqueta } from "app/models/ITipoEtiqueta";

interface Props {
  modelo: string;
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  refreshTable: () => void;
}

export const AgregarImagenModal: React.FC<Props> = ({ modelo, openModal, setOpenModal, refreshTable }) => {
  const linea = useAppSelector((state) => state.linea.object);

  const dispatch = useAppDispatch();
  const classes = MaterialButtons();

  const {
    control,
    watch,
    register,
    formState: { isValid }
  } = useForm({ mode: "all" });

  const watchTipoEtiqueta = watch("tipoEtiqueta");
  const watchCodigoEtiqueta = watch("codigoEtiqueta");
  const ref: any = useRef(null);

  const [listaTipoEtiqueta, setListaTipoEtiquetas] = useState<ITipoEtiqueta[]>([]);
  const [codigosEtiquetas, setCodigosEtiquetas] = useState([]);
  const getTiposDeEtiqueta = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(TipoEtiquetaSliceRequests.GetByIdLinea(linea.idLinea)));
      const codigos = unwrapResult(await dispatch(EtiquetasImagenSliceRequests.getAllCodigosEtiquetas()));
      if (response) {
        setListaTipoEtiquetas(response);
        setCodigosEtiquetas(codigos);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [datosImagen, setDatosImagen] = useState({
    modelo: "",
    tipoDeEtiqueta: "",
    imageFile: null,
    tipoUnidad: "",
    codigoEtiqueta: ""
  });
  const [urlImage, seturlImage] = useState(null);
  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      setDatosImagen(
        produce((draft) => {
          draft.imageFile = file;
        })
      );
      reader.addEventListener("load", () => {
        seturlImage(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const subirImagen = async () => {
    const tipoEtiqueta = listaTipoEtiqueta.find((elementos) => elementos.idTipoEtiqueta == watchTipoEtiqueta);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const imagen = {
        ...datosImagen,
        modelo: modelo,
        tipoDeEtiqueta: tipoEtiqueta.codigo,
        tipoUnidad: null,
        codigoEtiqueta: watchCodigoEtiqueta
      };
      await dispatch(EtiquetasImagenSliceRequests.UploadImagesCalidad(imagen));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    refreshTable();
    setOpenModal(false);
  };

  const seleccionarImagen = () => {
    ref.current.click();
  };

  useEffect(() => {
    if (openModal) {
      getTiposDeEtiqueta();
    }
  }, [openModal]);

  return (
    <main className="w-[45vw]">
      <section className="w-full flex gap-x-4 items-start">
        <div className="w-[30%]">
          <TextField id="outlined-modelo" label="Modelo" value={modelo} variant="outlined" disabled />
        </div>
        <div className="w-[50%]">
          <Controller
            name="tipoEtiqueta"
            control={control}
            defaultValue={0}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo De Etiqueta</InputLabel>
                <Select label="Tipo De Etiqueta" {...field} variant="outlined">
                  {listaTipoEtiqueta &&
                    listaTipoEtiqueta?.map((elementos) => (
                      <MenuItem key={elementos.idTipoEtiqueta} value={elementos.idTipoEtiqueta}>
                        <div className="w-full">
                          <div>{elementos.descripcion}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div className="w-[30%]">
          <Controller
            name="codigoEtiqueta"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <TextField
                  {...field}
                  id="outlined-modelo"
                  label="Codigo Etiqueta"
                  variant="outlined"
                  {...register("codigoEtiqueta", {
                    pattern: {
                      value: /^\d-\d{3}-[A-Za-z0-9]\d{4}[A-Za-z0-9]-UX$/,
                      message: "Formato del codigo incorrecto"
                    },
                    validate: (value) => {
                      let mismoCodigo = false;
                      if (codigosEtiquetas != null) {
                        if (codigosEtiquetas.length > 0) {
                          mismoCodigo = codigosEtiquetas.some((elementos) => {
                            return value == elementos;
                          });
                        }
                      }
                      if (mismoCodigo) {
                        return "Codigo ya usado";
                      } else {
                        return true;
                      }
                    }
                  })}
                />
                {!!error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <Button
          disabled={!isValid}
          onClick={() => {
            seleccionarImagen();
          }}
          sx={{ width: "22%" }}
          className={classes.blueButton}>
          Subir Imagen
        </Button>
        <input
          type="file"
          accept="image/png, image/jpeg"
          name="Importar"
          onChange={onFileChange}
          ref={ref}
          multiple={false}
          className="hidden"
        />
      </section>
      {urlImage && (
        <div className="mt-4 flex flex-col items-center ">
          <figure>
            <img src={urlImage} alt="Imagen selecionada" />
          </figure>
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => {
                subirImagen();
              }}
              className={classes.greenButton}>
              Guardar
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};
