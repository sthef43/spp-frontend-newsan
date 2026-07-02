/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { Check, Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";

interface props {
  fileProp?: File; //La imagen, puede ser null
  setFileProp: (file: File) => void; //Para setear el archivo al estado
  modalOpen: (newValue: boolean) => void; //Para cerra el modal.
}
export const HojaParametrosImage = ({ fileProp, setFileProp, modalOpen }: props) => {
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const hiddenFileInput = React.useRef(null);
  const [data, setdata] = React.useState(null);
  const [dataImagen, setDataImagen] = React.useState(null);
  const [urlImage, seturlImage] = React.useState(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      setdata(file);
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
      setdata(fileProp);
      reader.addEventListener("load", () => {
        seturlImage(reader.result);
      });
      reader.readAsDataURL(fileProp);
    }
  }, [fileProp]);

  const handleClick = (event: React.MouseEvent) => {
    hiddenFileInput.current.click();
  };

  const upload = async (e) => {
    try {
      e.preventDefault();
      setDataImagen(null);
      openNotificationUI("Imagen asignada", "success");
      modalOpen(false);
    } catch (e) {
      openNotificationUI("Error al levantar la hoja de parámetros", "error");
    }
  };

  return (
    <div style={{ height: "80vh", width: "40vw", position: "relative" }}>
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
        accept="image/png, image/jpeg, image/jpg"
        onChange={onFileChange}
        ref={hiddenFileInput}
        multiple={false}
        className="hidden"
      />
      {urlImage && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "53rem"
          }}>
          <img style={{ maxWidth: "100%", maxHeight: "100%" }} alt="Imagen" src={urlImage} />
        </div>
      )}
    </div>
  );
};
