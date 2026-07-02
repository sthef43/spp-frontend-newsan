import { Upload, Visibility } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCDesignadaResultadoImagen } from "app/models/IOQCDesignadaResultadoImagen";
import React, { useEffect, useRef, useState } from "react";
import { ModalCompoment } from "../../../../../../shared/components/ModalComponent";
import { OQCDesignadaResultadoImage } from "./OQCDesignadaResultadoImage";
import { oqcDesignadaResultadoImagenSlice } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoImagenSlice";
interface IUploadImageBloque {
  OQCBloqueGroupId: number;
  view: boolean;
}
export const UploadImageBloque = ({ OQCBloqueGroupId, view }: IUploadImageBloque): JSX.Element => {
  const dispatch = useAppDispatch();
  const [openModalImage, setOpenModalImage] = useState(false);
  const [oqcDRI, setOQCDRI] = useState<IOQCDesignadaResultadoImagen>(null);
  const hiddenFileInput: any = useRef(null);

  const oqcDesignadaResultadoImagenes = useAppSelector<IOQCDesignadaResultadoImagen[]>(
    (state) => state.oqcDesignadaResultadoImagen.dataAll
  );
  const onViewImage = () => {
    setOpenModalImage(true);
  };
  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        dispatch(
          oqcDesignadaResultadoImagenSlice.actions.setOQC({
            imagenUrl: reader.result,
            oqcBloqueGroupId: OQCBloqueGroupId,
            image: file
          })
        );
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    oqcDesignadaResultadoImagenes &&
      setOQCDRI(oqcDesignadaResultadoImagenes.find((dri) => dri.oqcBloqueGroupId == OQCBloqueGroupId));
  }, [oqcDesignadaResultadoImagenes]);

  return (
    <div>
      {oqcDRI && oqcDRI?.imagenUrl !== "" ? (
        <div className="flex gap-4 ">
          <Tooltip title="Ver imagen adjunta">
            <Button onClick={onViewImage} variant="contained" className=" w-full shadow-md px-4 py-1">
              <Visibility />
            </Button>
          </Tooltip>
        </div>
      ) : (
        <>
          <Tooltip title="Agregar una imagen">
            <Button onClick={handleClick} variant="contained" className="w-full shadow-md px-4 py-1" disabled={view}>
              <Upload />
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
      )}
      <ModalCompoment title="" setOpenPopup={setOpenModalImage} openPopup={openModalImage}>
        <OQCDesignadaResultadoImage
          imageUrl={oqcDRI?.imagenUrl || ""}
          edit={view}
          oqcDesignadaResultadoId={OQCBloqueGroupId}
        />
      </ModalCompoment>
    </div>
  );
};
