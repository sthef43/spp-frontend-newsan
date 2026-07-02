import { Circle, Image } from "@mui/icons-material";
import { Button, FormHelperText, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { ModalCompoment } from "../../../../../../shared/components/ModalComponent";
import { OQCVerImagenAyudaHallazgo } from "./OQCVerImagenAyudaHallazgo";
import { oqcHallazgoResultSlice } from "app/features/oqcGeneral/slices/OQCHallazgoResultSlice";
interface IOQCHallazgoResultBloq {
  bloHa: IOQCBloqueHallazgo;
  view: boolean;
}
export const OQCHallazgoResultBloq = ({ bloHa, view }: IOQCHallazgoResultBloq): JSX.Element => {
  const dispatch = useAppDispatch();
  const buttonColor = MaterialButtons();

  const [hallazgoSeleccionado, setHallazgoSeleccionado] = useState<IOQCHallazgo>();

  const [openModalImagen, setOpenModalImage] = useState(false);

  const oqcHallazgoResult = useAppSelector<IOQCHallazgoResult[]>((state) => state.oqcHallazgoResult.dataAll);

  const onGetState = (bloqueHallazgoId: number): boolean => {
    return oqcHallazgoResult.find((oqcHR) => oqcHR.oqcBloqueHallazgoId == bloqueHallazgoId)?.state;
  };

  const onGetComent = (bloqueHallazgoId: number): string => {
    return oqcHallazgoResult.find((oqcHR) => oqcHR.oqcBloqueHallazgoId == bloqueHallazgoId)?.comentario;
  };

  const onChangeState = (state, bloqueHallazgoId: number): void => {
    if (!view) dispatch(oqcHallazgoResultSlice.actions.setNewState({ state, id: bloqueHallazgoId }));
  };

  const onChangeComent = ({ target }, bloqueHallazgoId: number): void => {
    const { value } = target;
    dispatch(oqcHallazgoResultSlice.actions.setNewComent({ comentario: value, id: bloqueHallazgoId }));
  };

  const getError = (bloqueHallazgoId: number): boolean => {
    const comentarioLength =
      oqcHallazgoResult.find((oqcHR) => oqcHR.oqcBloqueHallazgoId == bloqueHallazgoId && oqcHR.state == false)
        ?.comentario.length || 1;
    return comentarioLength == 0 ? true : false;
  };

  const handleOpenModalImage = (hallazgo: IOQCHallazgo) => {
    setHallazgoSeleccionado(hallazgo);
    setOpenModalImage(true);
  };

  return (
    <div key={bloHa.id} className="flex gap-5 flex-col p-5 mr-2 border-gray-500 rounded-md border">
      <div className="flex gap-5 flex-col minnotebook:flex-row">
        {bloHa.oqcHallazgo.urlImage !== null && (
          <Tooltip title="Ver imagen de ayuda">
            <span>
              <IconButton
                onClick={() => {
                  handleOpenModalImage(bloHa.oqcHallazgo);
                }}
                size="small"
                style={{ position: "relative" }}>
                <Image color="primary" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Typography
          textAlign="left"
          sx={{
            fontSize: "20px",
            marginY: "auto",
            width: "100%",
            gap: "10px"
          }}>
          {bloHa.oqcHallazgo.nombre}
          <Tooltip title={`Criticidad: ${bloHa.oqcHallazgo?.oqcPonderacion?.criticidad}`} sx={{ marginLeft: "10px" }}>
            <Circle
              color={`${
                bloHa.oqcHallazgo.oqcPonderacion?.color == "Rojo"
                  ? "error"
                  : bloHa.oqcHallazgo.oqcPonderacion?.color == "Verde"
                  ? "success"
                  : "warning"
              }`}
            />
          </Tooltip>
        </Typography>
        <Button
          color="success"
          className={onGetState(bloHa.id) && buttonColor.greenButton}
          onClick={() => onChangeState(true, bloHa.id)}>
          GOOD
        </Button>
        <Button
          color="error"
          className={onGetState(bloHa.id) != null && !onGetState(bloHa.id) && buttonColor.redButton}
          onClick={() => onChangeState(false, bloHa.id)}>
          NG
        </Button>
      </div>
      <TextField
        label="Comentario:"
        multiline
        disabled={view}
        onChange={(e) => onChangeComent(e, bloHa.id)}
        value={onGetComent(bloHa.id)}
        error={getError(bloHa.id)}
        helperText={<FormHelperText>Si el hallazgo es NG el comentario es obligatorio</FormHelperText>}
      />
      <ModalCompoment setOpenPopup={setOpenModalImage} openPopup={openModalImagen} title="Imagen De Ayuda">
        <OQCVerImagenAyudaHallazgo
          openModal={openModalImagen}
          setOpenModal={setOpenModalImage}
          hallazgo={hallazgoSeleccionado}
        />
      </ModalCompoment>
    </div>
  );
};
