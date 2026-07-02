/* eslint-disable unused-imports/no-unused-vars */
import React, { useRef, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import TitleUIComponent from "../../../../../../shared/components/helpComponents/TitleUIComponent";
import { Button } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IProducto } from "app/models";
import { OQCHallazgoSliceRequests } from "app/features/oqcGeneral/slices/OQCHallazgoSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

export const OQCHallazgoImage: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const { control } = useForm();

  const hallazgo = useAppSelector((state) => state.oqcHallazgo.object as IOQCHallazgo);
  const producto = useAppSelector<IProducto>((state) => state.producto.object);

  const [file, setFile] = useState<File>();

  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const ref: any = useRef(null);

  const subirImagen = async () => {
    try {
      if (
        await getConfirmation(
          "Subir Imagen",
          "Desea subir esta imagen para este hallazgos",
          null,
          "Aceptar",
          "Cancelar"
        )
      ) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(
          await dispatch(OQCHallazgoSliceRequests.UploadImageHallazgo({ hallazgoId: hallazgo.id, file: file }))
        );
        if (response) {
          await dispatch(OQCHallazgoSliceRequests.getAllByProductoIdRequest(producto.id));
          setOpenModal(false);
          openNotificationUI("Se agrego la imagen con exito", "success");
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [urlImage, seturlImage] = useState(null);
  const onFileChange = (event) => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.addEventListener("load", () => {
        file.url = reader.result;
        setFile(file);
        seturlImage(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const seleccionarImagen = () => {
    ref.current.click();
  };

  console.log(hallazgo);

  return (
    <main className="w-[70vw]">
      <section className="flex flex-row justify-center">
        {hallazgo && hallazgo.urlImage !== null ? (
          <div className="flex flex-row justify-between items-center gap-x-6">
            <div className="flex flex-col justify-center items-center">
              <TitleUIComponent title="Imagen Actual" />
              <figure>
                <img
                  src={`${import.meta.env.BASE_URL}imagenes/oqc/hallazgos/${hallazgo.id}/${hallazgo.urlImage}`}
                  alt="imagen actual"
                />
              </figure>
            </div>
            <Button
              onClick={() => {
                seleccionarImagen();
              }}
              className={classes.blueButton}>
              Actualizar Imagen
            </Button>
            <input
              type="file"
              accept="image/png, image/jpeg,"
              name="cargar"
              onChange={onFileChange}
              ref={ref}
              multiple={false}
              className="hidden"
            />
            {urlImage && (
              <div className="flex flex-col justify-center items-center">
                <TitleUIComponent title="Imagen Nueva" />
                <figure>
                  <img src={urlImage} alt="" />
                </figure>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div>
              <Button
                onClick={() => {
                  seleccionarImagen();
                }}
                className={classes.blueButton}>
                Cargar nueva Imagen
              </Button>
              <input
                type="file"
                accept="image/png, image/jpeg,"
                name="cargar"
                onChange={onFileChange}
                ref={ref}
                multiple={false}
                className="hidden"
              />
            </div>
            <div>
              {urlImage !== null && (
                <div className="mt-4">
                  <figure>
                    <img src={urlImage} alt="imagen pre cargada" />
                  </figure>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      <div className="flex flex-row w-full justify-around mt-4 gap-x-2">
        <div>
          <Button
            disabled={urlImage === null}
            onClick={() => {
              subirImagen();
            }}
            className={classes.blueButtonTickets}>
            Guardar
          </Button>
        </div>
        <div>
          <div>
            <Button
              onClick={() => {
                setOpenModal(false);
              }}
              className={classes.redButton}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
