import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SemielaboradoSliceRequests } from "app/Middleware/reducers/SemielaboradoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea } from "app/models";
import { ISemielaborado } from "app/models/ISemielaborado";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { SemielaboradoForm } from "app/features/trazabilidad/modules/agregarSemielaboradImParaDeclarar/modal/SemielaboradoForm";
import { SemielaboradosTable } from "app/features/trazabilidad/modules/agregarSemielaboradImParaDeclarar/components/SemielaboradosTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const SemielaboradoPage = () => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const lineas = useAppSelector<ILinea[]>((state) => state.linea.dataAll);
  const semielaborados = useAppSelector<ISemielaborado[]>((state) => state.semielaborado.dataAll);
  const [dataEdit, setDataEdit] = useState<ISemielaborado>(null);
  const [openModalForm, setOpenModalForm] = useState(false);
  const { control, getValues, watch } = useForm({ defaultValues: { lineaId: 0 } });
  const getAllLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(LineaSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const getAllSemielaborados = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(SemielaboradoSliceRequests.getAllByLineaIdRequest(lineaWatch));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const onAdd = () => {
    setDataEdit(null);
    setOpenModalForm(true);
  };
  const setEditForm = (row: ISemielaborado) => {
    setDataEdit(row);
    setOpenModalForm(true);
  };
  const lineaWatch = watch("lineaId");
  useEffect(() => {
    TitleChanger("Semielaborado");
    getAllLineas();
  }, []);
  useEffect(() => {
    lineaWatch != 0 && getAllSemielaborados();
  }, [lineaWatch]);

  return (
    <div className="my-2 mx-4 h-full">
      <div className="rounded-lg  px-2 w-full my-2 bg-secondaryNew shadow-elevation-4">
        <form className="m-4 py-4">
          <Controller
            name="lineaId"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Linea de producción</InputLabel>
                <Select {...field} variant="standard">
                  {lineas &&
                    lineas.map((x) => (
                      <MenuItem key={x.idLinea} value={x.idLinea}>
                        <div>{x.descripcion}</div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        </form>
        {lineaWatch != 0 && (
          <SemielaboradosTable
            dataTable={semielaborados}
            onAddProps={onAdd}
            lineaId={lineaWatch}
            refresh={getAllSemielaborados}
            setEditForm={setEditForm}
          />
        )}
        <ModalCompoment
          title={dataEdit ? "Editar semielaborado" : "Agregar semielaborado"}
          setOpenPopup={setOpenModalForm}
          openPopup={openModalForm}>
          <SemielaboradoForm
            dataEdit={dataEdit}
            refresh={getAllSemielaborados}
            setOpenModal={setOpenModalForm}
            lineaId={lineaWatch}
            apareceTable={false}
          />
        </ModalCompoment>
      </div>
    </div>
  );
};
