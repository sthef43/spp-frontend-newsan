import { Check, Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
// import { Document, Page } from "react-pdf";

interface props {
  fileProp?: any; //La imagen, puede ser null
  setFileProp: any; //Para setear el archivo al estado
  modalOpen: any; //Para cerra el modal.
}
export const AprobacionPlanosImage = ({ fileProp, setFileProp, modalOpen }: props) => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const hiddenFileInput: any = React.useRef(null);
  const [urlImage, seturlImage] = React.useState(null);

  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        seturlImage(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
      setFileProp(file);
    }
  };

  //si le mando el file por las props, muestra la foto.
  //Es para cuando carga una imagen, cierra el modal, y luego la vuelve a abrir.
  useEffect(() => {
    if (fileProp) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        seturlImage(reader.result);
      });
      reader.readAsDataURL(fileProp);
    }
  }, [fileProp]);

  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };

  const upload = async (e) => {
    try {
      e.preventDefault();
      openNotificationUI("Imagen guardada con éxito", "success");
      modalOpen(false);
      //setOpenPopup(false);
    } catch (e) {
      openNotificationUI("Error al levantar el plano", "error");
    }
  };

  return (
    <div style={{ height: "80vh", width: "60vw", position: "relative" }}>
      <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
        <Button
          onClick={handleClick}
          variant="contained"
          className="bg-blue-500 shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
          <Upload />
          <span>Importar</span>
        </Button>
        <Button startIcon={<Check />} className={classes.greenButton} variant="contained" onClick={upload}>
          Guardar
        </Button>
      </div>
      <input
        type="file"
        name="Importar"
        // accept="image/png, image/jpeg, image/jpg, image/pdf"
        accept="image/pdf"
        onChange={onFileChange}
        ref={hiddenFileInput}
        multiple={false}
        className="hidden"
      />
      <div className=" flex-col gap-30 " style={{ height: "90%" }}>
        {urlImage && (
          <>
            {/* <img style={{ width: "100%", height: "100%" }} src={urlImage} /> */}
            <iframe style={{ width: "100%", height: "100%" }} src={urlImage} />
          </>
        )}
      </div>
    </div>
  );
};
