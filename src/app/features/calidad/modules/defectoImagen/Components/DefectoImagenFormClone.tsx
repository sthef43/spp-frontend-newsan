import { FormControl, MenuItem, Select, InputLabel, TextField, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IDefectoImagen } from "app/models/IDefectoImagen";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { DefectoImagenSliceRequest } from "app/Middleware/reducers/DefectoImagenSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { ILineaProduccionFamilia } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";

interface Props {
  setOpenModalClone: (newValue: boolean) => void;
  openModalClone: boolean;
  listaHallazgos: IDefectoImagen[];
  familiaDefectos: string;
}

export const DefectoImagenFormClone: React.FC<Props> = ({
  setOpenModalClone,
  openModalClone,
  listaHallazgos,
  familiaDefectos
}) => {
  const linea = useAppSelector((state) => state.lineaProduccion.object);

  const { watch, control } = useForm();
  const watchFamiliaSeleccionada = watch("familiaClonada");

  const dispatch = useAppDispatch();
  const classes = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [hallazgosEncontrados, setHallazgosEncontrados] = useState([]);
  const getHallazgos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(DefectoImagenSliceRequest.GetAllByFamilia(watchFamiliaSeleccionada))
      );
      if (response) {
        setHallazgosEncontrados(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [lineaProduccion, setLineaProduccion] = useState<ILineaProduccionFamilia[]>([]);
  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(LineaProduccionFamiliaSliceRequests.getAllByLineaId(linea.id)));
      if (response) {
        setLineaProduccion(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [aux, setAux] = useState<IDefectoImagen[]>([]);
  const modificarLista = () => {
    setAux(
      listaHallazgos.map((elementos) => {
        const nuevoElemento = {
          ...elementos,
          defecto: null,
          generico: watchFamiliaSeleccionada
        };
        delete nuevoElemento.idDefectoImagen;
        return nuevoElemento;
      })
    );
  };

  const clonarHallazgos = async () => {
    try {
      if (
        await getConfirmation(
          "Desea clonar los defectos?",
          `Se clonaran los defectos de la familia ${familiaDefectos} a ${watchFamiliaSeleccionada}, esta seguro?`
        )
      ) {
        if (hallazgosEncontrados.length == 0) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          await dispatch(DefectoImagenSliceRequest.MultiPostRequest(aux));
          openNotificationUI(
            `Se agregaron los defectos de la familia ${familiaDefectos} hacia la familia ${watchFamiliaSeleccionada}`,
            "success"
          );
        } else {
          if (
            await getConfirmation(
              "Se encontraron defectos",
              "Se encontraron defectos en la familia por lo cual se eliminaran los registros actuales, desea continuar?"
            )
          ) {
            const format = hallazgosEncontrados.map((elementos) => {
              const nuevoElemento = {
                ...elementos
              };
              delete nuevoElemento.defecto;
              return nuevoElemento;
            });
            await dispatch(DefectoImagenSliceRequest.multiDeleteRequest(format));
            await dispatch(DefectoImagenSliceRequest.MultiPostRequest(aux));
            openNotificationUI(
              `Se agregaron los defectos de la familia ${familiaDefectos} hacia la familia ${watchFamiliaSeleccionada}`,
              "success"
            );
          }
        }
      }
      setOpenModalClone(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  //{defaultValue={familia.familia?.nombre}

  useEffect(() => {
    if (watchFamiliaSeleccionada) {
      getHallazgos();
      modificarLista();
    }
  }, [watchFamiliaSeleccionada]);

  useEffect(() => {
    if (openModalClone) {
      getLineas();
    }
  }, [openModalClone]);

  return (
    <main className="w-[30vw]">
      <section className="w-full flex flex-col gap-y-4">
        <div>
          <TextField
            fullWidth
            id="familia-seleccionada"
            label="Familia Selecionada"
            defaultValue={"Familia seleccionada anteriormente"}
            variant="outlined"
            disabled={true}
          />
        </div>
        <div>
          <Controller
            name="familiaClonada"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Seleccione una familia</InputLabel>
                <Select label="Seleccione una familia" {...field} variant="outlined">
                  {lineaProduccion &&
                    lineaProduccion.map((elementos) => (
                      <MenuItem
                        key={elementos.id}
                        value={
                          linea.id == 7 || linea.id == 10 ? "M" + elementos.familia.nombre : elementos.familia.nombre
                        }>
                        <div className="w-full">
                          <div>
                            {linea.id == 7 || linea.id == 10
                              ? "M" + elementos.familia.nombre
                              : elementos.familia.nombre}
                          </div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div className="flex w-full justify-center gap-9">
          <Button
            onClick={() => {
              clonarHallazgos();
            }}
            className={classes.greenButton}>
            Clonar
          </Button>
          <Button
            onClick={() => {
              setOpenModalClone(false);
            }}
            className={classes.redButton}>
            Cancelar
          </Button>
        </div>
      </section>
    </main>
  );
};
