import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IOQCCategoria } from "app/models/IOQCCategoria";
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { Bookmark, BookmarkBorderOutlined } from "@mui/icons-material";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import { OQCSliceRequests } from "app/features/oqcGeneral/slices/OQCSlice";
import { OQCCategoriaSliceRequests } from "app/features/oqcGeneral/slices/OQCCategoriaSlice";
import { OQCHallazgoSliceRequests } from "app/features/oqcGeneral/slices/OQCHallazgoSlice";
import { OQCBloqueHallazgoSliceRequests } from "app/features/oqcGeneral/slices/OQCBloqueHallazgoSlice";

const defaultValues = {
  nombreBloque: "",
  listaHallazgosAgregados: [],
  CategoriaHallazgo: 0
};

interface Props {
  productoId: number;
  bloqueSeleccionado: IOQCBloqueGroup;
  closeModal: (state: boolean) => void;
  guardarCambios: (newValue: boolean) => void;
}

export const OQCBloqueEditarModal: React.FC<Props> = ({
  bloqueSeleccionado,
  closeModal,
  guardarCambios,
  productoId
}) => {
  const { control, watch } = useForm({ defaultValues: defaultValues });
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const categoriaWatchId = watch("CategoriaHallazgo");
  const autoFocusRef = useRef<HTMLLIElement>(null);
  const color = MaterialButtons();

  const [categoriasHallazgos, setCategoriasHallazgos] = useState<IOQCCategoria[]>([]);
  const [hallazgosOqc, setHallazgosOqc] = useState<IOQCHallazgo[]>([]);
  const onCategorias = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OQCCategoriaSliceRequests.getAllRequest()));
      if (response) {
        setCategoriasHallazgos(response);
      }
      if (categoriaWatchId == 0) {
        const responseHallazgos = unwrapResult(
          await dispatch(OQCHallazgoSliceRequests.getAllByProductoIdRequest(bloqueSeleccionado.oqcBloque.productoId))
        );
        setHallazgosOqc(responseHallazgos);
      } else {
        const responseHallazgosConCategoria = unwrapResult(
          await dispatch(
            OQCHallazgoSliceRequests.getAllByProductoIdAndCategoriaRequest({
              productoId: bloqueSeleccionado.oqcBloque.productoId,
              categoriaId: categoriaWatchId
            })
          )
        );
        setHallazgosOqc(responseHallazgosConCategoria);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const submitChanges = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      /*
            const actuallizarBloque = {
                ...bloqueSeleccionado,
                oqcBloque: {
                    ...bloqueSeleccionado.oqcBloque,
                    oqcBloqueHallazgo: aux
                }
            }*/
      const response = await dispatch(OQCBloqueHallazgoSliceRequests.multiPutRequest(hallazgosParaAgregar));
      if (response) {
        console.log(response);
      }
      await dispatch(OQCSliceRequests.getAllByProductoIdRequest(productoId));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Se agregaron los hallazgos correctamente", "success");
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  const [aux, setAux] = useState([...bloqueSeleccionado.oqcBloque.oqcBloqueHallazgo]);
  const [hallazgosParaAgregar, setHallazgosParaAgregar] = useState([]);
  const añadirHallazgo = (row) => {
    setHallazgosParaAgregar((prevItems) => {
      console.log(row);
      if (prevItems.some((itemExiste) => itemExiste.oqcHallazgoId === row.id)) {
        return prevItems.filter((itemExiste) => itemExiste.oqcHallazgoId !== row.id);
      } else {
        setHallazgosParaAgregar((prev) =>
          prev.concat({
            oqcBloqueId: bloqueSeleccionado.oqcBloque.id,
            oqcHallazgoId: row.id
          })
        );
      }
    });
  };

  useEffect(() => {
    if (bloqueSeleccionado || categoriaWatchId) {
      onCategorias();
    }
  }, [bloqueSeleccionado, categoriaWatchId]);

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, []);

  return (
    <main className="w-[36rem]">
      <section className="w-full flex flex-col gap-y-4">
        <Controller
          control={control}
          name="CategoriaHallazgo"
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ paddingX: "4px", backgroundColor: "white" }}>Seleccione una categoria</InputLabel>
              <Select {...field}>
                <MenuItem value={0} ref={autoFocusRef}>
                  <div className="w-full">
                    <div>Sin filtro</div>
                  </div>
                </MenuItem>
                {categoriasHallazgos?.map((elementos) => (
                  <MenuItem key={elementos.id} value={elementos.id}>
                    <div className="w-full">
                      <div>{elementos.nombre}</div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </section>
      <TableComponent
        IDcolumn="id"
        buscar
        dataInfo={hallazgosOqc}
        columns={[
          {
            title: "Seleccionar",
            field: "",
            render: (row: IOQCHallazgo) => (
              <Checkbox
                icon={
                  <BookmarkBorderOutlined
                    sx={
                      hallazgosParaAgregar.find((elementos) => elementos.oqcHallazgoId == row.id)
                        ? { fill: "#1f88c7" }
                        : {}
                    }
                  />
                }
                checkedIcon={<Bookmark />}
                checked={aux.find((elementos) => elementos.oqcHallazgoId == row.id) ? true : false}
                onClick={() => {
                  añadirHallazgo(row);
                }}
              />
            )
          },
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Criticidad",
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
      <div className="flex gap-5 justify-center mt-4">
        <Button
          className={color.greenButton}
          onClick={() => {
            submitChanges();
            guardarCambios(false);
          }}>
          Guardar
        </Button>
        <Button
          className={color.redButton}
          onClick={() => {
            closeModal(false);
          }}>
          Cancelar
        </Button>
      </div>
    </main>
  );
};
