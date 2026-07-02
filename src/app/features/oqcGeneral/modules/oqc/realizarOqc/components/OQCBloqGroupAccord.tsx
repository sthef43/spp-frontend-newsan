import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControlLabel,
  FormGroup,
  Typography,
  Checkbox
} from "@mui/material";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ViewOQCBloqueGroupImage } from "./ViewOQCBloqueGroupImage";
import { UploadImageBloque } from "./UploadImageBloque";
import { IOQCHallazgoResult } from "app/models/IOQCHallazgoResult";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { OQCHallazgoResultBloq } from "./OQCHallazgoResultBloq";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { Controller, useForm } from "react-hook-form";
import { oqcHallazgoResultSlice } from "app/features/oqcGeneral/slices/OQCHallazgoResultSlice";
interface IOQCBloqGroupAccord {
  bloGroup: IOQCBloqueGroup;
  index: number;
  view: boolean;
  envioDatos: boolean;
}

export const OQCBloqGroupAccord = ({ bloGroup, index, view, envioDatos }: IOQCBloqGroupAccord): JSX.Element => {
  const { watch, setValue, control, register } = useForm();
  const dispatch = useAppDispatch();
  const buttonColor = MaterialButtons();

  const oqcHallazgoResult = useAppSelector<IOQCHallazgoResult[]>((state) => state.oqcHallazgoResult.dataAll);
  const oqcDesginadaResultado = useAppSelector<IOQCDesignadaResultado>((state) => state.oqcDesignadaResultado.object);
  const oqcDesignada = useAppSelector<IOQCDesignada>((state) => state.oqcDesignada.object);

  const [oqcBloqueHallazgoIds, setOqcBloqueHallazgoIds] = useState([]);

  const onNewBloqueHallazgo = (): void => {
    const bloqueHallazgoArr: IOQCHallazgoResult[] = bloGroup.oqcBloque.oqcBloqueHallazgo.map((blqHa) => {
      return { oqcBloqueHallazgoId: blqHa.id, state: null, comentario: "", oqcDesignadaResultadoId: 0 };
    });
    dispatch(oqcHallazgoResultSlice.actions.setNewOQCArray(bloqueHallazgoArr));
  };
  const onGetRealize = (): string => {
    const cantidadHecha: number = oqcHallazgoResult.filter(
      (oqcHR) => oqcBloqueHallazgoIds.includes(oqcHR.oqcBloqueHallazgoId) && oqcHR.state == true
    ).length;
    const cantidadTotal: number = oqcHallazgoResult.filter((oqcHR) =>
      oqcBloqueHallazgoIds.includes(oqcHR.oqcBloqueHallazgoId)
    ).length;
    const result = cantidadTotal - cantidadHecha;
    return `${result}/${cantidadTotal}`;
  };
  const onChangeStateBloq = (): void => {
    bloGroup?.oqcBloque?.oqcBloqueHallazgo?.forEach((bloqH) => {
      if (!view) dispatch(oqcHallazgoResultSlice.actions.setNewState({ state: true, id: bloqH.id }));
    });
  };

  // Ordenar el arreglo en la copia
  const [ordenado, setOrdenado] = useState<IOQCBloqueGroup>(null);
  const ordenar = () => {
    if (bloGroup.oqcBloque.oqcBloqueHallazgo.length > 0) {
      const sortedData = JSON.parse(JSON.stringify(bloGroup));
      sortedData.oqcBloque.oqcBloqueHallazgo.sort((a, b) => {
        if (a.oqcHallazgo.nombre < b.oqcHallazgo.nombre) {
          return -1;
        }
        if (a.oqcHallazgo.nombre > b.oqcHallazgo.nombre) {
          return 1;
        }
        return 0;
      });
      setOrdenado(sortedData);
    }
  };

  const [mostarCheck, setMostarCheck] = useState(false);
  const [checkActivado, setCheckActivado] = useState(false);
  const manejoExpancion = (even, buttonId) => {
    const checkActivado = even.target.checked;
    even.stopPropagation();

    if (buttonId == "acordion") {
      setMostarCheck((prev) => !prev);
    }

    if (buttonId == "seleccionTodo" && checkActivado) {
      setCheckActivado(true);
      ordenado?.oqcBloque?.oqcBloqueHallazgo?.map((bloHa) =>
        dispatch(oqcHallazgoResultSlice.actions.setNewState({ state: true, id: bloHa.id }))
      );
    } else if (buttonId == "seleccionTodo" && !checkActivado) {
      setCheckActivado(false);
      ordenado?.oqcBloque?.oqcBloqueHallazgo?.map((bloHa) =>
        dispatch(oqcHallazgoResultSlice.actions.setNewState({ state: null, id: bloHa.id }))
      );
    }
  };

  const eliminarSeleccionado = () => {
    setCheckActivado(false);
    ordenado?.oqcBloque?.oqcBloqueHallazgo?.map((bloHa) =>
      dispatch(oqcHallazgoResultSlice.actions.setNewState({ state: null, id: bloHa.id }))
    );
  };

  useEffect(() => {
    !oqcDesginadaResultado && onNewBloqueHallazgo();
  }, []);

  useEffect(() => {
    ordenar();
    setOqcBloqueHallazgoIds(bloGroup.oqcBloque.oqcBloqueHallazgo.map((oqcBH) => oqcBH.id));
  }, [bloGroup]);

  useEffect(() => {
    if (envioDatos) {
      eliminarSeleccionado();
    }
  }, [envioDatos]);

  return (
    <div className="mt-5 flex items-center gap-5 justify-around w-full flex-col minnotebook:flex-row" key={bloGroup.id}>
      <Accordion onChange={(e) => manejoExpancion(e, "acordion")} className="w-full">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography
            sx={{
              color: `${
                oqcHallazgoResult.find(
                  (oqcHR) =>
                    oqcBloqueHallazgoIds.includes(oqcHR.oqcBloqueHallazgoId) &&
                    (oqcHR.state == false || oqcHR.state == null)
                )
                  ? "#DF6466"
                  : "green"
              }`,
              fontSize: "30px"
            }}>
            {index + 1}.{bloGroup?.oqcBloque?.nombre} - {onGetRealize()}
          </Typography>
          {mostarCheck && (
            <div className="ml-[65%] text-xl z-50">
              <Controller
                name="checkboxSelect"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormGroup>
                    <FormControlLabel
                      {...field}
                      label="Seleccionar todo Good"
                      onClick={(e) => manejoExpancion(e, "seleccionTodo")}
                      control={<Checkbox {...register("ssas")} checked={checkActivado} />}
                    />
                  </FormGroup>
                )}
              />
            </div>
          )}
        </AccordionSummary>
        <AccordionDetails style={{ padding: 2 }}>
          <div className="grid grid-cols-1 ml-4 gap-5 pb-5">
            {ordenado?.oqcBloque?.oqcBloqueHallazgo
              ?.slice()
              .sort((PositionA, PositionB) => PositionA.position - PositionB.position)
              .map((bloHa) => (
                <OQCHallazgoResultBloq bloHa={bloHa} view={view} key={bloHa.id} />
              ))}
          </div>
        </AccordionDetails>
      </Accordion>
      <div className="flex flex-col minnotebook:flex-row gap-6">
        {oqcDesignada.oqc.botonBloque && (
          <Button color="success" className={buttonColor.greenButton} onClick={() => onChangeStateBloq()}>
            GOOD
          </Button>
        )}
        <ViewOQCBloqueGroupImage imageUrl={bloGroup.imagenUrl} id={bloGroup.id} key={bloGroup.oqcBloqueId} />
        <UploadImageBloque OQCBloqueGroupId={bloGroup.id} view={view} />
      </div>
    </div>
  );
};
