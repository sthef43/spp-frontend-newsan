import { Check, Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";

interface props {
  fileProp?: any; //La imagen, puede ser null
  setFileProp: any; //Para setear el archivo al estado
  modalOpen: any; //Para cerra el modal.
}
export const CDImage = ({ fileProp, setFileProp, modalOpen }: props) => {
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
      
      console.log(file);
      console.log(reader.result);
      setFileProp(file);
    }
  };

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
    } catch (e) {
      openNotificationUI("Error en la subida de la imagen", "error");
    }
  };

  useEffect(() => {
    console.log(urlImage)
  }, [urlImage])
  

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
              accept="image/jpg, image/jpeg"
              onChange={onFileChange}
              ref={hiddenFileInput}
              multiple={false}
              className="hidden"
            />
          </div>
          <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
            {urlImage && (
              <>
                <TitleUIComponent title="Prevista de Imagen" classNameTitle="text-base" />
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
