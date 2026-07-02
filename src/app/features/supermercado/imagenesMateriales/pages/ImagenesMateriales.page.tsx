import { MaterialesImagenSliceRequests } from "app/Middleware/reducers/MaterialesImagenSlice";
import { SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISuperCargalinea } from "app/models";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Check, Upload } from "@mui/icons-material";
import { Autocomplete, Button, Skeleton, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import produce from "immer";
import React, { useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
const ImagenAnterior = (props: any) => {
  const dispatch = useAppDispatch();
  const [MaterialImagen, setMaterialImagen] = useState(null);
  const getInfo = async () => {
    setMaterialImagen(unwrapResult(await dispatch(MaterialesImagenSliceRequests.getByCodigoWip(props.codigoWip))));
  };
  React.useEffect(() => {
    if (props.codigoWip) {
      getInfo();
    }
  }, [props.codigoWip]);
  return (
    <>
      {MaterialImagen?.url && (
        <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
          <TitleUIComponent title="Imagen actual" classNameTitle="text-base" />
          <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
            <img
              style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
              src={`${import.meta.env.BASE_URL}/imagenes/materiales/${MaterialImagen.url}`}
            />
          </div>
        </div>
      )}
    </>
  );
};

export const ImagenesMaterialesPage = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();
  const hiddenFileInput: any = React.useRef(null);
  React.useEffect(() => {
    TitleChanger("Imagenes Materiales");
  }, []);
  // const { State: ListGroupedByModeloOp } = useFetchApi<ISuperCargalinea[]>(
  //   SuperCargalineaSliceRequests.getGroupedByModeloOp
  // );
  const { State: informationOfOP } = useFetchApi<ISuperCargalinea[]>(SuperCargalineaSliceRequests.getMateriales);
  const { openNotificationUI } = useNotificationUI();
  const [data, setdata] = useState({ material: "", imageFile: null });
  const [urlImage, seturlImage] = useState(null);
  //const [ValoresCargaLinea, setValoresCargaLinea] = useState({ op: "", modelo: "" });

  // const setInfoMaterial = async (buscar) => {
  //   let info;
  //   try {
  //     info = unwrapResult(await dispatch(SuperCargalineaSliceRequests.getByNumeroOp(buscar)));
  //   } catch (e) {
  //     info = null;
  //   }
  //   setinformationOfOP(info);
  // };
  // React.useEffect(() => {
  //   if (ValoresCargaLinea?.op?.length > 2) {
  //     setInfoMaterial(ValoresCargaLinea.op);
  //   }
  // }, [ValoresCargaLinea]);
  // const cambiarInfo = (option: ISuperCargalinea) => {
  //   if (option) {
  //     setValoresCargaLinea(
  //       produce((draft) => {
  //         draft.op = option.numeroOp;
  //         draft.modelo = option.codigoModelo;
  //       })
  //     );
  //   }
  // };
  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

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
  };
  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
    //setdata((prev) => ({ ...prev, imageFile: event.target.files[0] }));
  };
  const upload = async (e) => {
    const result = unwrapResult(await dispatch(MaterialesImagenSliceRequests.Upload(data)));
    if (result) {
      {
        openNotificationUI("Imagen guardada con éxito", "success");
        seturlImage(null);
        setdata({ material: "", imageFile: null });
      }
    } else openNotificationUI("Error en la subida de la imagen", "error");
  };

  return (
    <div>
      <TitleUIComponent title="Ingreso " />
      <div className="mx-5">
        <div className="grid grid-cols-2 justify-center gap-4 my-5 w-full">
          {/* // <div className="col-span-2">
          //   {ListGroupedByModeloOp?.length > 0 && (
          //     <Autocomplete
          //       id="op_codigo"
          //       options={ListGroupedByModeloOp}
          //       onChange={(e, newvalue: any) => cambiarInfo(newvalue)}
          //       getOptionLabel={(option) => `${option.codigoModelo}  ${option.numeroOp}`}
          //       // renderOption={(props, option: ISuperCargalinea) => (
          //       //   <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
          //       //     {`${option.codigoModelo}  ${option.numeroOp}`}
          //       //   </Box>
          //       // )}
          //       renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Modelos" />}
          //     />
          //   )}
          // </div> */}
          <div className="col-span-2 flex gap-4 justify-center w-full ">
            <div className="w-full">
              {informationOfOP ? (
                <Autocomplete
                  id="material"
                  disabled={!informationOfOP}
                  options={informationOfOP.map((option) => `${option.descripcion}  ${option.codigoWip}`)}
                  // getOptionLabel={(option: ISuperCargalinea) => `${option.descripcion}  ${option.codigoWip}`}
                  onChange={(e, newvalue: any) =>
                    newvalue && setdata({ imageFile: null, material: newvalue.codigoWip })
                  }
                  renderInput={(params) => <TextField {...params} variant="outlined" fullWidth label="Materiales" />}
                />
              ) : (
                <Skeleton animation="wave" variant="rectangular" className="w-full py-4 rounded-md" />
              )}
            </div>
            <Button
              onClick={handleClick}
              variant="contained"
              className="bg-blue-500 shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1"
              disabled={!data.material}>
              <Upload />
              <span className="hidden sm:block">Importar</span>
            </Button>
            <input
              type="file"
              name="Importar"
              onChange={onFileChange}
              ref={hiddenFileInput}
              multiple={false}
              className="hidden"
            />
          </div>

          {data?.material && <ImagenAnterior codigoWip={data?.material} />}
          <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
            {urlImage && (
              <>
                <TitleUIComponent title="Preview nueva imagen" classNameTitle="text-base" />
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
