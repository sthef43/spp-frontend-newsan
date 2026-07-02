/* eslint-disable unused-imports/no-unused-vars */
import { Check, Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { AuditBloqSliceRequests } from "app/features/audit/slices/AuditBloqSlice";
import { useAppDispatch } from "app/core/store/store";
import { IAuditBloq } from "app/models";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import produce from "immer";
import React from "react";
const ImagenAnterior = (props: any) => {
  const [bloqImagen, setbloqImagen] = React.useState(null);
  React.useEffect(() => {
    setbloqImagen(props.bloqImagen);
  }, [props.bloqImagen]);
  return (
    <>
      <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
        <TitleUIComponent title="Imagen actual" classNameTitle="text-base" />
        <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
          <img
            style={{ maxHeight: "50vh", width: "auto", height: "100%" }}
            src={`${import.meta.env.BASE_URL}imagenes/auditBloq/${bloqImagen}`}
          />
        </div>
      </div>
    </>
  );
};
interface Props {
  setSelectedArrAuditBloq: any;
  setOpenPopup: any;
  auditBloqSelect: IAuditBloq;
  bloqIndex: number;
}
export const AuditImageBloq = ({ setSelectedArrAuditBloq, setOpenPopup, auditBloqSelect, bloqIndex }: Props) => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const hiddenFileInput: any = React.useRef(null);
  const [data, setdata] = React.useState({
    bloqName: "",
    id: 0,
    imageFile: null
  });
  const [dataImagen, setDataImagen] = React.useState(null);
  const [auditBloq, setAuditBloq] = React.useState<IAuditBloq>(null);
  const [urlImage, seturlImage] = React.useState(null);
  const [fileName, setfileName] = React.useState("");
  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setfileName(file.name);
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
  };
  const upload = async (e) => {
    try {
      e.preventDefault();
      setSelectedArrAuditBloq(
        produce((draft) => {
          draft[bloqIndex].imagen = data.bloqName + "." + fileName.trim();
        })
      );
      const result = unwrapResult(await dispatch(AuditBloqSliceRequests.Upload(data)));
      setDataImagen(null);
      setAuditBloq(null);
      openNotificationUI("Imagen guardada con éxito", "success");
      setOpenPopup(false);
    } catch (e) {
      openNotificationUI("Error en la subida de la imagen", "error");
    }
  };
  React.useEffect(() => {
    setAuditBloq(auditBloqSelect);
    console.log(auditBloqSelect);
  }, [auditBloqSelect]);
  React.useEffect(() => {
    setDataImagen(auditBloq?.imagen);
  }, [auditBloq]);
  React.useEffect(() => {
    const bloqName = auditBloqSelect.bloq?.name.replace(/ /g, "");
    setdata({
      bloqName,
      id: auditBloqSelect?.id,
      imageFile: null
    });
  }, [bloqIndex, auditBloqSelect]);
  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <div className="mx-5">
        <div className="grid grid-cols-2 justify-center gap-4 my-5 w-full">
          <div className="col-span-2 flex gap-4 justify-center w-full ">
            <Button
              onClick={handleClick}
              variant="contained"
              className="bg-blue-500 shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
              <Upload />
              <span className="hidden sm:block">Importar</span>
            </Button>
            <input
              type="file"
              name="Importar"
              accept="image/png, image/jpeg"
              onChange={onFileChange}
              ref={hiddenFileInput}
              multiple={false}
              className="hidden"
            />
          </div>
          <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
            {dataImagen != "sinImagen" && <ImagenAnterior bloqImagen={dataImagen} />}
            {urlImage && (
              <>
                <TitleUIComponent title="Preview nueva imagen para el bloque" classNameTitle="text-base" />
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
