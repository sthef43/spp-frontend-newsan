/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import TitleUIComponent from "../../../../../../shared/components/helpComponents/TitleUIComponent";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IProducto } from "app/models";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OQCBloqueHallazgoForm } from "./OQCBloqueHallazgoForm";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import { IOQCBloque } from "app/models/IOQCBloque";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import produce from "immer";
import { OQCUploadImageBloq } from "app/shared/helpers/OQCUploadImageBloq";
import { IOQC } from "app/models/IOQC";
import { Delete, Edit } from "@mui/icons-material";
import { OQCBloqueEditarModal } from "./OQCBloqueEditarModal";
import { OQCPosicionHallazgo } from "./OQCPosicionHallazgo";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { unwrapResult } from "@reduxjs/toolkit";
import { OQCBloqueSliceRequests, oqcBloqueSlice } from "app/features/oqcGeneral/slices/OQCBloqueSlice";

interface IOQCBloqueForm {
  setValueBloqueGroup: (value: IOQCBloqueGroup[]) => void;
  setOQCBloqueGroupRemove: (value) => void;
  imagenes: Array<{ oqcBloqueId: number; image: any }>;
  setImages: (value) => void;
  closeModal: (value) => void;
}
export const OQCBloqueForm = ({
  setValueBloqueGroup,
  imagenes,
  setImages,
  setOQCBloqueGroupRemove,
  closeModal
}: IOQCBloqueForm): JSX.Element => {
  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const oqcBloques = useAppSelector<IOQCBloque[]>((state) => state.oqcBloque.dataAll as IOQCBloque[]);
  const oqc = useAppSelector<IOQC>((state) => state.oqc.object);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const colorButton = MaterialButtons();

  const [form, setForm] = useState(false);
  const [oqcBloqueGroup, setOQCBloqueGroup] = useState<IOQCBloqueGroup[]>([]);

  const onGetBloques = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCBloqueSliceRequests.getAllByProductoIdRequest(producto.id));
      const response = unwrapResult(await dispatch(OQCBloqueSliceRequests.getAllByProductoIdRequest(producto.id)));
      if (response) {
        console.log(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };

  const onCreate = () => {
    setForm(true);
  };

  /*
  const agregarIndex = async (bloqueHallazgo: IOQCBloqueHallazgo[], hallazgo) => {
    let positionValue = 0
    const findHallazgo = bloqueHallazgo.find((elementos) => elementos.id == hallazgo.id)
    bloqueHallazgo.forEach((elementos) => {
      if (elementos.position > 0) {
        positionValue = elementos.position
        console.log(elementos.position)
      }
    })
    positionValue += 1
    console.log(positionValue)
    const actualizarPosition = { ...findHallazgo, position: positionValue }
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."))
      delete actualizarPosition.oqcHallazgo
      const response = await dispatch(OQCBloqueHallazgoSliceRequests.PutRequest(actualizarPosition))
      const response2 = unwrapResult(await dispatch(OQCBloqueSliceRequests.getAllByProductoIdRequest(producto.id)))
      if (response) {
        console.log(response2)
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      if (response) {
        console.log(response)
      }
    } catch (erorr) {
      console.log(erorr)
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }*/

  const [openModal, setOpenModal] = useState(false);
  const editBloq = (_bloqSelect) => {
    setOpenModal(true);
  };
  const [openModalPosiciones, setOpenModalPosiciones] = useState(false);
  const [hallazoSeleccionado, setHallazgoSeleccionado] = useState<IOQCBloqueHallazgo>();
  const editPosicion = (hallazgo) => {
    setOpenModalPosiciones(true);
    setHallazgoSeleccionado(hallazgo);
  };

  const onAddBloque = () => {
    const newBloque: IOQCBloqueGroup = {
      id: 0,
      oqcBloqueId: 0,
      oqcId: 0,
      oqcBloque: {
        id: 0,
        nombre: "",
        productoId: producto.id
      },
      imagenUrl: ""
    };
    setOQCBloqueGroup([...oqcBloqueGroup, newBloque]);
  };
  const onChangeBloque = (oqcBloque: IOQCBloque, index: number) => {
    if (oqcBloqueGroup.find((oqcblg) => oqcblg.oqcBloqueId == oqcBloque.id)) {
      openNotificationUI("El bloque ya fue añadido", "warning");
      return;
    }
    setOQCBloqueGroup(
      produce((draft) => {
        if (draft[index].oqcBloqueId != 0 && draft[index].oqcBloqueId != oqcBloque.id) {
          const newImage = imagenes.filter((img) => img.oqcBloqueId != draft[index].oqcBloqueId);
          setImages(newImage);
        }
        draft[index] = { id: 0, oqcId: 0, oqcBloqueId: oqcBloque.id, oqcBloque };
      })
    );
  };
  const onRemoveBloq = (indx: number, bloqGroupId: number, oqcBloq: IOQCBloque) => {
    const newBloques = oqcBloqueGroup.filter((_, index) => index !== indx);
    setOQCBloqueGroup(newBloques);
    oqc && bloqGroupId != 0 && setOQCBloqueGroupRemove((value) => [...value, bloqGroupId]);
    if (bloqGroupId != 0) dispatch(oqcBloqueSlice.actions.add(oqcBloq));
  };

  useEffect(() => {
    const newBlG = oqcBloqueGroup?.flatMap((bloqueG) => {
      return { ...bloqueG, oqcBloque: null };
    });
    setValueBloqueGroup(newBlG);
  }, [oqcBloqueGroup]);

  useEffect(() => {
    producto && onGetBloques();
  }, [producto, setOpenModal]);

  useEffect(() => {
    oqc && setOQCBloqueGroup(oqc.oqcBloqueGroup);
  }, [oqc]);

  return (
    <div className="w-full">
      <TitleUIComponent
        title="Hallazgos agrupados por bloques"
        classNameTitle="text-base px-0"
        classNameDiv="w-full mx-0"
      />
      <div className="flex justify-between gap-4 m-5">
        <Button className={colorButton.greenButton} onClick={onAddBloque} type="button">
          Agregar existente
        </Button>
        <Button className={colorButton.yellowButton} type="button" onClick={onCreate}>
          Crear
        </Button>
        <ModalCompoment setOpenPopup={setForm} openPopup={form} title="Crear un bloque de hallazgos">
          <OQCBloqueHallazgoForm closeModal={setForm} />
        </ModalCompoment>
      </div>
      <Divider />
      {oqcBloqueGroup?.map((bloGroup: IOQCBloqueGroup, index) => (
        <div
          className="mt-5 flex justify-around items-center minnotebook:w-33vw flex-col minnotebook:flex-row minnotebook:gap-x-4"
          key={index}>
          <Accordion className="w-full">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography sx={{ color: `${bloGroup.oqcBloqueId == 0 ? "red" : "green"}` }}>
                {index + 1}.{bloGroup?.oqcBloque?.nombre || `Bloque numero ${index + 1}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ padding: 2 }}>
              <Autocomplete
                options={oqcBloques ? oqcBloques : []}
                getOptionLabel={(bloque) => (typeof bloque === "string" ? "" : bloque.nombre)}
                onChange={(e, newvalue: any) => {
                  if (newvalue?.id) {
                    onChangeBloque(newvalue, index);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" fullWidth label="Bloques existentes" />
                )}
              />
              <div className="flex flex-col ml-4">
                {bloGroup?.oqcBloque?.oqcBloqueHallazgo
                  ?.slice()
                  .sort((positionA, positionB) => positionA.position - positionB.position)
                  .map((bloHa) => (
                    <div key={bloHa.id}>
                      <FormControlLabel
                        onClick={() => {
                          editPosicion(bloHa);
                        }}
                        control={<Checkbox checked />}
                        key={bloHa.id}
                        label={`${bloHa.position}) ${bloHa.oqcHallazgo.nombre}`}
                      />
                    </div>
                  ))}
              </div>
            </AccordionDetails>
          </Accordion>
          <div className="w-full flex flex-row mt-2 justify-center minnotebook:mt-0 minnotebook:w-1/3">
            <OQCUploadImageBloq
              imageUrlP={bloGroup.imagenUrl}
              id={bloGroup.id}
              oqcBloqueId={bloGroup.oqcBloqueId}
              imagenes={imagenes}
              setImage={setImages}
              edit={oqc?.oqcBloqueGroup?.find((oqcb) => oqcb.id == bloGroup.id) ? true : false}
            />
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  onRemoveBloq(index, bloGroup.id, bloGroup.oqcBloque);
                }}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar Blqoue">
              <IconButton
                onClick={() => {
                  editBloq(bloGroup);
                }}
                size="small"
                style={{ position: "relative" }}>
                <Edit color="primary" />
              </IconButton>
            </Tooltip>
          </div>
          <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Editar bloque hallazgos">
            <OQCBloqueEditarModal
              bloqueSeleccionado={bloGroup}
              closeModal={setOpenModal}
              guardarCambios={closeModal}
              productoId={producto.id}
            />
          </ModalCompoment>
          <ModalCompoment
            setOpenPopup={setOpenModalPosiciones}
            openPopup={openModalPosiciones}
            title="Editar Posicion Hallazgo">
            <OQCPosicionHallazgo
              openModalPosition={openModalPosiciones}
              closeModal={setOpenModalPosiciones}
              productoId={producto.id}
              bloqueConHallazgos={bloGroup}
              hallazgo={hallazoSeleccionado}></OQCPosicionHallazgo>
          </ModalCompoment>
        </div>
      ))}
    </div>
  );
};
