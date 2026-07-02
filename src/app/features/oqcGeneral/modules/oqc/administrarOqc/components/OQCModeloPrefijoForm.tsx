/* eslint-disable unused-imports/no-unused-vars */
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { MaterialButtons } from "../../../../../../shared/components/material-ui/MaterialButtons";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, IconButton, TextField, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IOQCModeloPrefijo } from "app/models/IOQCModeloPrefijo";
import { ModalCompoment } from "../../../../../../shared/components/ModalComponent";
import { EditarOQCModeloPrefijoModal } from "./EditarOQCModeloPrefijoModal";
import { OQCModeloPrefijoSliceRequests } from "app/features/oqcGeneral/slices/OQCModeloPrefijoSlice";

interface props {
  setOpenPopup: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const OQCModeloPrefijoForm = ({ setOpenPopup }: props) => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  interface initialState {
    prefijo: string;
    modelo: string;
    manual: string;
    fichaTecnica: string;
    fichaGarantia: string;
    accesoGuiado: string;
    etiquetaEE: string;
    etiquetaCNC: string;
    etiquetaEAN: string;
    feDeErratas: string;
    guiaMagicControl: string;
    etiquetaFuenteAlimentacion: string;
    etiquetaCableUSB: string;
    etiquetaFilmProtector: string;
    etiquetaQr: string;
  }
  const initialStateVar = {
    prefijo: "",
    modelo: "",
    manual: "",
    fichaTecnica: "",
    fichaGarantia: "",
    accesoGuiado: "",
    etiquetaEE: "",
    etiquetaCNC: "",
    etiquetaEAN: "",
    feDeErratas: "",
    guiaMagicControl: "",
    etiquetaFuenteAlimentacion: "",
    etiquetaCableUSB: "",
    etiquetaFilmProtector: "",
    etiquetaQr: ""
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [prefijoSeleccionado, setPrefijoSeleccionado] = useState<IOQCModeloPrefijo>();

  //Leer
  const [modeloPrefijo, setModeloPrefijo] = useState([]);
  const getModeloPrefijo = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    try {
      const responses = unwrapResult(await dispatch(OQCModeloPrefijoSliceRequests.getAllRequest()));
      setModeloPrefijo(responses);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      openNotificationUI("Error al leer modelo prefijo.", "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //Guardar
  const loginSubmit = async (e) => {
    const obje = {
      ...e,
      modelo: e.modelo.toUpperCase()
    };
    const duplicado = modeloPrefijo.filter((x) => x.prefijo == e.prefijo);
    if (duplicado.length > 0) {
      openNotificationUI("El prefijo ya existe en la tabla.", "error");
      return;
    }
    try {
      unwrapResult(await dispatch(OQCModeloPrefijoSliceRequests.PostRequest(obje)));
      openNotificationUI("Registro agregado", "success");
      getModeloPrefijo();
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //Eliminar
  const eliminar = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro de eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(OQCModeloPrefijoSliceRequests.deleteRequest(row)));
        openNotificationUI("Registro eliminado", "success");
        getModeloPrefijo();
      } catch (error) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  //Editar
  const editarModelo = (modeloPrefijo: IOQCModeloPrefijo) => {
    setOpenModalEditar(true);
    setPrefijoSeleccionado(modeloPrefijo);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    getModeloPrefijo();
  }, []);

  return (
    <div style={{ height: "100%", width: "70vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className=" flex-col grid grid-cols-4 gap-30 m-2" style={{ height: "100%" }}>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="prefijo"
              control={control}
              rules={{
                required: "El prefijo es requerido",
                validate: (value) => {
                  if (value.length !== 5) {
                    return "El prefijo debe tener 5 caracteres";
                  }
                  if (!/^\d+$/.test(value)) {
                    return "El prefijo debe contener solo números";
                  }
                  return true;
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Prefijo"
                    variant="standard"
                    type="text"
                    inputProps={{ minLength: 5, maxLength: 5 }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="modelo"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Modelo"
                    variant="standard"
                    type="text"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    // onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="manual"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Manual"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className=" flex-col grid grid-cols-4 gap-30 m-2" style={{ height: "100%" }}>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="fichaTecnica"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Ficha Técnica"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="fichaGarantia"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Ficha Garantía"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="accesoGuiado"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Acceso Guiado"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="etiquetaEE"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Etiqueta EE"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="etiquetaCNC"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Etiqueta CNC"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="etiquetaEAN"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Etiqueta EAN"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="feDeErratas"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Fe De Erratas"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="guiaMagicControl"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Guia Magic Control"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="etiquetaFuenteAlimentacion"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Etiqueta Fuente Alimentacion"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="etiquetaCableUSB"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Etiqueta Cable USB"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="etiquetaFilmProtector"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Etiqueta Film Protector"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-1 gap-10 overflow-auto ml-10 mr-10" style={{ flex: "1 1 90%" }}>
            <Controller
              name="etiquetaQr"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <TextField
                    fullWidth
                    label="Etiqueta QR"
                    variant="standard"
                    type="text"
                    // inputProps={{ style: { textTransform: "uppercase" } }}
                    {...field}
                  />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="py-5 flex justify-self-center">
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Agregar
            </Button>
          </div>
        </div>
      </form>
      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          //   Overflow={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Prefijo",
              field: "prefijo"
            },
            {
              title: "Modelo",
              field: "modelo"
            },
            {
              title: "Manual",
              field: "manual"
            },
            {
              title: "Ficha Técnica",
              field: "fichaTecnica"
            },
            {
              title: "Ficha Garantía",
              field: "fichaGarantia"
            },
            {
              title: "Acceso Guiado",
              field: "accesoGuiado"
            },
            {
              title: "Etiqueta EE",
              field: "etiquetaEE"
            },
            {
              title: "Etiqueta CNC",
              field: "etiquetaCNC"
            },
            {
              title: "Etiqueta EAN",
              field: "etiquetaEAN"
            },
            {
              title: "Fe De Erratas",
              field: "feDeErratas"
            },
            {
              title: "Guia Magic Control",
              field: "guiaMagicControl"
            },
            {
              title: "Etiqueta Fuente Alimentacion",
              field: "etiquetaFuenteAlimentacion"
            },
            {
              title: "Etiqueta Cable USB",
              field: "etiquetaCableUSB"
            },
            {
              title: "Etiqueta Film Protector",
              field: "etiquetaFilmProtector"
            },
            {
              title: "Etiqueta QR",
              field: "etiquetaQr"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            eliminar(row.id);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => {
                            editarModelo(row);
                          }}
                          style={{ position: "relative" }}
                          size="small">
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          dataInfo={modeloPrefijo}
        />
      </div>
      <ModalCompoment title="Editar Modelo Prefijo" setOpenPopup={setOpenModalEditar} openPopup={openModalEditar}>
        <EditarOQCModeloPrefijoModal
          refreshList={setModeloPrefijo}
          modeloPrefijoSeleccionado={prefijoSeleccionado}
          openModal={openModalEditar}
          setOpenModal={setOpenModalEditar}
        />
      </ModalCompoment>
    </div>
  );
};
