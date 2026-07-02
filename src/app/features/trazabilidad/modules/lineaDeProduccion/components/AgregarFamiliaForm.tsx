import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Select, MenuItem } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { unwrapResult } from "@reduxjs/toolkit";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";

interface Props {
  filaSeleccionada: any;
  refreshList: any;
  refreshListaLineasProduccion: any;
  productId: any;
  familiasList: any;
}
export const AgregarFamiliaForm = ({
  filaSeleccionada,
  familiasList,
  productId,
  refreshList,
  refreshListaLineasProduccion
}: Props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  interface initialState {
    lineaProduccionId?: number;
    familiaId: number;
  }

  const initialStateVar = {
    familiaId: null,
    lineaProduccionId: filaSeleccionada || null
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { isDirty, isValid } = formState;

  const [listOfFamilias, setListOfFamilias] = useState([]);
  const [noContent, setNoContent] = useState(false);

  const getFamilias = async () => {
    const familias = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(productId))); //Obtengo las familias para el select2
    const listaFamiliasFilter = familiasList?.map((p) => {
      return p.familia;
    });
    const diferencia = familias.filter((p1) => {
      const existe = listaFamiliasFilter?.find((p2) => p2.id == p1.id);
      if (!existe) {
        return p1;
      }
    });
    console.log(diferencia);
    setListOfFamilias(diferencia);
    if (diferencia.length == 0) {
      setNoContent(true);
    }
  };

  useEffect(() => {
    getFamilias();
  }, [familiasList]);

  const agregarLineaProduccionFamilia = async (e) => {
    console.log("DATOS A INSERTAR: " + JSON.stringify(e));
    let result;
    try {
      result = await dispatch(LineaProduccionFamiliaSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
    } catch (x) {
      result = null;
    }
    //const ParamName = JSON.stringify(result.payload.ParamName == undefined); //me fijo si el paramName esta disponible
    //const tieneError = ParamName == "false"; //Si es false, significa que tiene dato, entonces encontro un error.
    //if (result && !tieneError) {
    if (result) {
      openNotificationUI("Dato agregado exitosamente :)", "success");
      refreshList(); //Refresca la lista de los puestos
      refreshListaLineasProduccion(); //refresca la lista principal de lineas de produccion.
      getFamilias(); //Actualizo el select2 de combos para que no aparezca la familia que acabo de insertar.
    } else {
      //Tiene error, es el unique de que ya tiene ese puesto asignado a la linea.
      openNotificationUI(result.payload.ParamName, "warning");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(agregarLineaProduccionFamilia)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            {noContent ? (
              <div className="m-2 text-center">No hay familias disponibles.</div>
            ) : (
              <Controller
                name="familiaId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Seleccione una familia</InputLabel>
                    <Select {...field} variant="standard">
                      {listOfFamilias &&
                        listOfFamilias.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.nombre}</div>
                            </div>
                          </MenuItem>
                        ))}
                    </Select>
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            )}
          </div>
          <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
