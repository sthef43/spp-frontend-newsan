import React, { useState } from "react";
import { OQCBloqueGroupImage } from "../../administrarOqc/components/OQCBloqueGroupImage";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { Visibility } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
interface IViewOQCBloqueGroupImage {
  imageUrl: string;
  id?: number;
}
export const ViewOQCBloqueGroupImage = ({ imageUrl, id }: IViewOQCBloqueGroupImage): JSX.Element => {
  const [openModalImage, setOpenModalImage] = useState(false);

  const onViewImage = () => {
    setOpenModalImage(true);
  };
  return (
    <>
      {imageUrl !== "" && (
        <div className="flex gap-4 ">
          <Tooltip title="Ver imagen de ayuda">
            <Button onClick={onViewImage} variant="contained" className=" w-full shadow-md px-4 py-1">
              <Visibility />
            </Button>
          </Tooltip>
        </div>
      )}
      <ModalCompoment title="Preview Imagen" setOpenPopup={setOpenModalImage} openPopup={openModalImage}>
        <OQCBloqueGroupImage imageUrl={imageUrl} edit oqcBloqueGroupId={id} />
      </ModalCompoment>
    </>
  );
};
