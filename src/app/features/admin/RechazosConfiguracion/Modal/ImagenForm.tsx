/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { IRechazoImagen } from "app/models/IRechazoImagen";
import { Imagen } from "app/shared/helpers/Imagen";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import produce from "immer";
import React, { useEffect, useRef, useState } from "react";
import { RechazoImagenSliceRequests } from "app/Middleware/reducers/RechazoImagenSlice";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

interface IImageFormProps {
  refresh: () => void;
  editState: IRechazoImagen;
  closeModal: (state) => void;
}
export const ImagenForm = ({ refresh, editState, closeModal }: IImageFormProps) => {
  const [urlImage, seturlImage] = useState(null);
  const [rechazoImagen, setRechazoImagen] = useState({ rechazoImagenId: "", imageFile: null });
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const hiddenFileInput: any = useRef(null);
  const classes = MaterialButtons();

  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      setRechazoImagen(
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
  };

  const upload = async (e) => {
    try {
      const result = await dispatch(RechazoImagenSliceRequests.UploadImagenRequest(rechazoImagen));
      openNotificationUI("Imagen guardada con éxito", "success");
      setRechazoImagen(null);
      seturlImage(null);
      refresh();
      closeModal(false);
      //   location.reload();
    } catch (error) {
      openNotificationUI("Error en la subida de la imagen", "error");
    }
  };

  useEffect(() => {
    setRechazoImagen({ ...rechazoImagen, rechazoImagenId: editState.id.toString() });
  }, [editState]);
  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center m-3">
        <Button
          onClick={handleClick}
          variant="contained"
          className="bg-[#137FEC] shadow-md hover:bg-[#2c94fdff] text-white text-icon-rest rounded-[5px] normal-case px-4 py-2">
          <Upload />
          <span className="hidden sm:block">{editState.imagenUrl ? "Cambiar imagen" : "Argegar imagen"}</span>
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
        <Imagen url={editState.imagenUrl} folderUrl="imagenes/rechazo" />
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
  );
};
