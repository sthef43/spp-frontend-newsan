/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Stack, Chip } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
// import { SemielaboradoSliceRequests } from "app/Middleware/reducers/SemielaboradoSlice";
import { SemielaboradoTipoSliceRequests } from "app/Middleware/reducers/SemielaboradoTipoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
// import { ILinea } from "app/models";
// import { ISemielaborado } from "app/models/ISemielaborado";
import { ISemielaboradoTipo } from "app/models/ISemielaboradoTipo";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { IFamilia } from "app/models/IFamilia";
import { ISemielaboradoIA } from "app/models/ISemielaboradoIA";
import { SemielaboradoIASliceRequest } from "app/Middleware/reducers/semielaboradoIaSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { ILineaProduccionFamilia } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { EditaSemielaboradoIA } from "app/features/admin/AdministrarPlanDeProduccion/Modals/EditaSemielaboradoIA";

interface Props {
  setOpenModal: (open: boolean) => void;
  familia: IFamilia;
  handleFamilia?: boolean;
}
export const SemiElaboradosIAForm = ({ setOpenModal, familia, handleFamilia = false }: Props) => {
  const semielaboradosTipo = useAppSelector<ISemielaboradoTipo[]>((state) => state.semielaboradoTipo.dataAll);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();

  const [listSemielaboradosIA, setListSemielaboradosIA] = useState<ISemielaboradoIA[]>([]);
  const [familias, setFamilias] = useState<IFamilia[]>(null);
  const [familiaSelected, setFamiliaSelected] = useState<IFamilia>(null);

  const InitStates = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responses = await Promise.all([
        dispatch(SemielaboradoTipoSliceRequests.getAllRequest()),
        dispatch(SemielaboradoIASliceRequest.getByFamiliaIdRequest(familiaSelected.id))
      ]);

      const semisElaboradosIA: any = responses[1].payload;
      setListSemielaboradosIA([...semisElaboradosIA]);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const getFamilias = async () => {
    const result = unwrapResult(await dispatch(FamiliaSliceRequests.getAllRequest()));
    setFamilias(result);
  };

  const handleAddSemiElaborado = async () => {
    try {
      const find = listSemielaboradosIA.find(
        (d) => d.valor == getValues("valor") || d.semielaboradoTipoId == getValues("semielaboradoTipoId")
      );
      if (find) {
        openNotificationUI("El valor/tipo ya se encuentra en la lista", "error");
        return;
      }
      const newValue: ISemielaboradoIA = {
        familiaId: familiaSelected.id,
        valor: getValues("valor"),
        semielaboradoTipoId: getValues("semielaboradoTipoId")
        //semielaboradoTipo: semielaboradosTipo.find((d) => d.id == getValues("semielaboradoTipoId"))
      };
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(SemielaboradoIASliceRequest.agregar(newValue));
      //const newSemi: any = response;
      //console.log(newSemi);

      //newSemi.semielaboradoTipo = newValue.semielaboradoTipo;
      InitStates();
      reset();
      //setListSemielaboradosIA([...listSemielaboradosIA, newSemi]);

      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("SemiElaborado agregado correctamente", "success");
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const getLineaProduccionFamiliaBySemielaboradoId = async (semielaboradoIAId) => {
    const result = unwrapResult(await dispatch(LineaProduccionFamiliaSliceRequests.getAllRequest()));

    if (!result) return null;

    const existe = result.find((x) => x.semielaboradoIAId == semielaboradoIAId);

    if (!existe) return null;

    return existe;
  };

  //Cuando se elimina el semielaborad, si ese id esta en LineaProduccionFamilia, se updetea y pone en null.
  const eliminarSemielaboradoIdDeLineaProduccionFamilia = async (id) => {
    const lineaProduccionFamiliaResult = await getLineaProduccionFamiliaBySemielaboradoId(id);
    if (!lineaProduccionFamiliaResult) return false;

    updateLineaProduccionFamilia(lineaProduccionFamiliaResult);
  };

  const updateLineaProduccionFamilia = async (lineaProFam: ILineaProduccionFamilia) => {
    lineaProFam.semielaboradoIAId = null;
    const result = unwrapResult(await dispatch(LineaProduccionFamiliaSliceRequests.PutRequest(lineaProFam)));
    if (result) {
      openNotificationUI(
        "Se elimino el semielaborado de la linea " +
          result.lineaProduccion.descripcion +
          " para la familia " +
          result.familia.nombre,
        "success"
      );
    }
  };

  const handleDelSemiElaborado = (data: ISemielaboradoIA) => async () => {
    try {
      const newValues = listSemielaboradosIA.filter((d) => d.valor != data.valor);
      if (data?.id) {
        const response = dispatch(await SemielaboradoIASliceRequest.deleteRequest(data.id));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
        if (response) {
          openNotificationUI("SemiElaborado eliminado correctamente", "success");
          eliminarSemielaboradoIdDeLineaProduccionFamilia(data.id);
          reset();
        } else {
          openNotificationUI("No se pudo eliminar el semiElaborado", "error");
        }
      }
      setListSemielaboradosIA([...newValues]);
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const defaultValues = {
    valor: "",
    // familiaId: familia.id,
    semielaboradoTipoId: 0,
    familiaId: familia != null ? familia.id : 0
  };
  const { control, formState, handleSubmit, reset, getValues, watch } = useForm({
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (familiaSelected != null) {
      InitStates();
    }
  }, [familiaSelected]);

  //Cuando se renderiza el componente y le paso familia, se setea en el stateFamilia.
  useEffect(() => {
    getFamilias();
    if (familia != null) {
      setFamiliaSelected(familia);
    }
  }, []);

  const watchFamilia = watch("familiaId");

  //Watch para cada vez que cambia la familia, se setea en el state.
  useEffect(() => {
    if (watchFamilia != 0 && familias != null) {
      const fam = familias.find((x) => x.id == watchFamilia);
      setFamiliaSelected(fam);
    }
  }, [watchFamilia]);

  const [modalOpen, setModalOpen] = useState(false);
  const [semiEdit, setSemiEdit] = useState(null);
  return (
    <div>
      {/* <TextField className="w-full" disabled label="Familia" defaultValue={familia.nombre} /> */}
      <form className="py-4" onSubmit={handleSubmit(handleAddSemiElaborado)}>
        <div className="grid sm:grid-row-3 sm:gap-4 w-full">
          <Controller
            name="familiaId"
            control={control}
            rules={{ required: true, min: 1 }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Familia</InputLabel>
                <Select {...field} variant="standard">
                  {familias &&
                    familias.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div>{x.nombre}</div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>Debe Seleccionar una familia.</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="valor"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Semielaborado Externo</InputLabel>
                <Input {...field} />
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="semielaboradoTipoId"
            control={control}
            rules={{ required: true, min: 1 }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione un tipo de semielaborado</InputLabel>
                <Select {...field} variant="standard">
                  {semielaboradosTipo &&
                    semielaboradosTipo.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div>{x.nombre}</div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && <FormHelperText>Debe Seleccionar el tipo del Semielaborado</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <Button className="w-full my-2" type="submit" variant="outlined">
          Agregar
        </Button>
      </form>
      <div id="chip-container" className="w-full py-1 max-h-72 overflow-y-auto px-1">
        <Stack spacing={2}>
          {listSemielaboradosIA.map((semi) => (
            <Chip
              size="medium"
              color="info"
              className="flex justify-between"
              key={semi.valor}
              label={semi.valor + " Tipo:" + semi.semielaboradoTipo.nombre}
              onDelete={(e) => {
                setModalOpen(true);
                setSemiEdit(semi);
              }}
            />
          ))}
        </Stack>
      </div>
      <ModalCompoment title={"Editar SemiElaborado IA"} openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <EditaSemielaboradoIA
          semiEdit={semiEdit}
          setModalOpen={setModalOpen}
          InitStates={InitStates}></EditaSemielaboradoIA>
      </ModalCompoment>
    </div>
  );
};
