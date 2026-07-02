import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IProducto } from "app/models";
import { IOQCCategoria } from "app/models/IOQCCategoria";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { IOQCBloqueHallazgo } from "app/models/IOQCBloqueHallazgo";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { OQCBloqueSliceRequests } from "app/features/oqcGeneral/slices/OQCBloqueSlice";
import { OQCCategoriaSliceRequests } from "app/features/oqcGeneral/slices/OQCCategoriaSlice";
import { OQCHallazgoSliceRequests } from "app/features/oqcGeneral/slices/OQCHallazgoSlice";

interface IOQCBloqueHallazgoForm {
  closeModal: (state: boolean) => void;
}

const defaultValues = {
  nombre: "",
  productoId: 0,
  oqcBloqueHallazgo: []
};

export const OQCBloqueHallazgoForm = ({ closeModal }: IOQCBloqueHallazgoForm): JSX.Element => {
  const { control, setValue, getValues } = useForm({ defaultValues: defaultValues });

  const categorias = useAppSelector<IOQCCategoria[]>((state) => state.oqcCategoria.dataAll);
  const hallazgos = useAppSelector<IOQCHallazgo[]>((state) => state.oqcHallazgo.dataAll);
  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const color = MaterialButtons();

  const [filtro, setFiltro] = useState<string | number>("todos");
  const { append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "oqcBloqueHallazgo" // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const onCategorias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCCategoriaSliceRequests.getAllRequest());
      await dispatch(OQCHallazgoSliceRequests.getAllByProductoIdRequest(producto.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onChangeCategoria = async ({ target }): Promise<void> => {
    try {
      const { value } = target;
      setFiltro(value);
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (value == "todos") {
        await dispatch(OQCHallazgoSliceRequests.getAllByProductoIdRequest(producto.id));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        return;
      }
      await dispatch(
        OQCHallazgoSliceRequests.getAllByProductoIdAndCategoriaRequest({ productoId: producto.id, categoriaId: value })
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onSubmit = async (): Promise<void> => {
    try {
      if (getValues("oqcBloqueHallazgo").length == 0) {
        openNotificationUI("Tiene que seleccionar al menos un hallazgo", "warning");
        return;
      }
      if (getValues("nombre").length == 0) {
        openNotificationUI("El nombre debe tener al menos un caracter", "warning");
        return;
      }
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCBloqueSliceRequests.NestedAddRequest(getValues()));
      await dispatch(OQCBloqueSliceRequests.getAllByProductoIdRequest(producto.id));
      openNotificationUI("Se creo con éxito", "success");
      closeModal(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onChangeCheck = async (id: number, { target }) => {
    const { checked } = target;
    if (checked) {
      const oqcBloqueHallazgo: IOQCBloqueHallazgo = {
        oqcBloqueId: 0,
        oqcHallazgoId: id
      };
      append(oqcBloqueHallazgo);
    } else {
      const index: number = getValues("oqcBloqueHallazgo").findIndex(
        (ba: IOQCBloqueHallazgo) => ba.oqcHallazgoId == id
      );
      remove(index);
    }
  };

  useEffect(() => {
    if (producto) {
      setValue("productoId", producto.id);
      onCategorias();
    }
  }, [producto]);

  return (
    <div className="w-full flex gap-5 justify-center flex-col">
      <Controller
        control={control}
        name="nombre"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Nombre" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Divider />
      <FormControl fullWidth>
        <InputLabel>Seleccione una categoria para filtrar</InputLabel>
        <Select label="Seleccione una categoria para filtrar" fullWidth onChange={onChangeCategoria} value={filtro}>
          <MenuItem value="todos" key="Todos">
            <ListItemText>Sin filtro</ListItemText>
          </MenuItem>
          {categorias?.map((categoria) => (
            <MenuItem value={categoria.id} key={categoria.id}>
              <ListItemText>{categoria.nombre}</ListItemText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableComponent
        IDcolumn="id"
        dataInfo={hallazgos}
        buscar
        Dense
        columns={[
          {
            title: "Seleccionar",
            field: "",
            render: (row: IOQCHallazgo) => (
              <Checkbox
                icon={<BookmarkBorder />}
                checkedIcon={<Bookmark />}
                checked={
                  getValues("oqcBloqueHallazgo").find((p: IOQCBloqueHallazgo) => p.oqcHallazgoId == row.id)
                    ? true
                    : false
                }
                onClick={(e) => onChangeCheck(row.id, e)}
              />
            )
          },
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Ponderacion",
            field: "",
            render: (row: IOQCHallazgo) => (
              <div
                className={`text-${
                  row.oqcPonderacion.color == "Rojo"
                    ? "red"
                    : row.oqcPonderacion.color == "Amarillo"
                    ? "yellow"
                    : "green"
                }-500`}>
                {row.oqcPonderacion.nombre}
              </div>
            )
          }
        ]}
      />
      <div className="flex gap-5 justify-center">
        <Button className={color.greenButton} onClick={onSubmit}>
          Guardar
        </Button>
        <Button className={color.redButton} onClick={() => closeModal(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
