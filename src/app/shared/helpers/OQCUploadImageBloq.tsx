import { Close, Image, Visibility } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { MaterialButtons } from "../components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import { OQCBloqueGroupImage } from "../../features/oqcGeneral/modules/oqc/administrarOqc/components/OQCBloqueGroupImage";
interface IOQCUploadImageBloq {
  setImage?: (value) => void;
  imageUrlP: string;
  imagenes?: Array<{ oqcBloqueId: number; image: any }>;
  id?: number;
  oqcBloqueId: number;
  edit?: boolean;
}
export const OQCUploadImageBloq = ({
  id,
  setImage,
  imagenes,
  edit,
  imageUrlP,
  oqcBloqueId
}: IOQCUploadImageBloq): JSX.Element => {
  const hiddenFileInput: any = useRef(null);
  const [openModalImage, setOpenModalImage] = useState(false);
  const classes = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const [imageUrl, setImageUrl] = useState(null);

  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage((oldValue) => [...oldValue, { oqcBloqueId: oqcBloqueId, image: file }]);
        setImageUrl(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const onViewImage = () => {
    setOpenModalImage(true);
  };
  const onDelete = async (): Promise<void> => {
    if (await getConfirmation("Eliminar imagen", "Esta seguro que quiere eliminar la imagen del bloque?")) {
      const newImage = imagenes.filter((img) => img.oqcBloqueId != oqcBloqueId);
      setImage(newImage);
    }
  };
  useEffect(() => {
    setImageUrl(imageUrlP);
  }, [imageUrlP]);

  return (
    <div className="max-w-fit">
      {!imagenes?.find((img) => img.oqcBloqueId == oqcBloqueId) && (imageUrlP == "" || !edit) ? (
        <>
          <Tooltip title="Agregar una imagen">
            <Button
              disabled={oqcBloqueId == 0}
              onClick={handleClick}
              variant="contained"
              className="w-full shadow-md px-4 py-1">
              <Image />
            </Button>
          </Tooltip>
          <input
            type="file"
            accept="image/png, image/jpeg"
            name="Importar"
            onChange={(event) => onFileChange(event)}
            ref={hiddenFileInput}
            multiple={false}
            className="hidden"
          />
        </>
      ) : (
        <div className="flex gap-4 ">
          <Tooltip title="Ver imagen">
            <Button onClick={onViewImage} variant="contained" className=" w-full shadow-md px-4 py-1">
              <Visibility />
            </Button>
          </Tooltip>
          <Tooltip title="Eliminar imagen del bloque">
            <IconButton onClick={onDelete} className={classes.redButton} disabled={edit}>
              <Close />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <ModalCompoment title="" setOpenPopup={setOpenModalImage} openPopup={openModalImage}>
        <OQCBloqueGroupImage imageUrl={imageUrl} edit={edit} oqcBloqueGroupId={id} />
      </ModalCompoment>
    </div>
  );
};
