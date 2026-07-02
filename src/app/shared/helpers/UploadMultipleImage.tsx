import { Close, Upload, Visibility } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ModalCompoment } from "../components/ModalComponent";
import { AuditImage } from "../../features/audit/modules/creacionEdicionAuditorias/components/AuditImage";
import { MaterialButtons } from "../components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useFileChange } from "../hooks/useFileChange";
import { AuditRegistryImageSliceRequests } from "app/features/audit/slices/AuditRegistryImageSlice";

interface IUploadMultipleImage {
  setListaImags: Dispatch<SetStateAction<Array<{ idBloq: number; file: File }>>>;
  listaImages: Array<{ idBloq: number; file: File }>;

  setImage: (value) => void;
  image: Array<{ id: number; image: any }>;
  id?: number;
  edit?: boolean;
}
export const UploadMultipleImage = ({
  id,
  setImage,
  image,
  edit,
  setListaImags,
  listaImages
}: IUploadMultipleImage): JSX.Element => {
  const [openModalImage, setOpenModalImage] = useState(false);
  const classes = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const params: any = useParams();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { selectFileChange } = useFileChange();

  const hiddenFileInput: any = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [srcImagen, setSrcImagen] = useState(null);

  const onInit = async () => {
    try {
      if (params.registryId) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const auditImage = unwrapResult(
          await dispatch(
            AuditRegistryImageSliceRequests.getImageByIdsRequest({
              auditRegistryId: params.registryId,
              auditBloqId: id
            })
          )
        );
        if (auditImage) {
          setImageUrl(auditImage.imageUrl);
        }
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      openNotificationUI(err, "error");
    }
  };

  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log("me cargue", file);
        setImage((oldValue) => [...oldValue, { id, image: file }]);
        setImageUrl(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const addImages = (image: File) => {
    setListaImags((prev) => [...prev, { idBloq: id, file: image }]);
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const onViewImage = () => {
    setOpenModalImage(true);
  };

  const onDelete = async (): Promise<void> => {
    if (await getConfirmation("Eliminar imagen", "Esta seguro que quiere eliminar la imagen del bloque?")) {
      const newImage = image.filter((img) => img.id != id);
      const filtrado = listaImages.filter((elementos) => elementos.idBloq != id);
      setListaImags(filtrado);
      setImage(newImage);
    }
  };

  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);
  useEffect(() => {
    onInit();
  }, [id]);

  return (
    <div className="w-full">
      {!image.find((img) => img.id == id) && !edit ? (
        <>
          <Button
            onClick={handleClick}
            variant="contained"
            className="bg-blue-500 w-full shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
            <Upload />
            <span className="hidden sm:block">Agregar una imagen</span>
          </Button>
          <input
            type="file"
            accept="image/png, image/jpeg"
            name="Importar"
            onChange={(event) => {
              onFileChange(event);
              selectFileChange(event, addImages, setSrcImagen);
            }}
            ref={hiddenFileInput}
            multiple={false}
            className="hidden"
          />
        </>
      ) : (
        <div className="flex gap-4 ">
          <Button
            onClick={onViewImage}
            variant="contained"
            className="bg-blue-500 w-full shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
            <Visibility />
            <span className="hidden sm:block">Ver imagen</span>
          </Button>
          <IconButton onClick={onDelete} className={classes.redButton} disabled={edit}>
            <Close />
          </IconButton>
        </div>
      )}
      <ModalCompoment title="" setOpenPopup={setOpenModalImage} openPopup={openModalImage}>
        <AuditImage imageUrl={imageUrl} edit={edit} auditBloqId={id} />
      </ModalCompoment>
    </div>
  );
};
