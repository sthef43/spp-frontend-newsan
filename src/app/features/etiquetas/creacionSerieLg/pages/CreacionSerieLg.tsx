import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ProductoSliceRequests } from "app/Middleware/reducers";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { SerieLgSliceRequests } from "app/Middleware/reducers/SerieLgSlice";
import { useAppDispatch } from "app/core/store/store";
import { IProducto } from "app/models";
import { IFamilia } from "app/models/IFamilia";
import { IModelo } from "app/models/IModelo";
import { ISerieLg } from "app/models/ISerieLg";
import { CreacionSerieLgExl } from "app/features/etiquetas/creacionSerieLg/modals/CreacionSerieLgExl";
import { SerieLgForm } from "app/features/etiquetas/creacionSerieLg/modals/SerieLgForm";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const CreacionSerieLg = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();

  interface initialState {
    productoId: number;
    familiaId: number;
    modeloId: number;
    fecha: string;
    codigo: string;
  }
  const initialStateVar = {
    productoId: 0,
    familiaId: 0,
    modeloId: 0,
    fecha: "",
    codigo: ""
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    TitleChanger("CREACION SERIE LG");
    getProducto();
  }, []);

  //Leer Producto
  const [listProducto, setListProducto] = useState<IProducto[] | null>(null);
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };
  //Leer Familia por producto
  const [listFamilias, setListFamilias] = useState<IFamilia[] | null>(null);
  const getFamilias = async () => {
    try {
      const responses = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(watchProductoId)));
      if (responses.length > 0) {
        const filtro = responses.filter((x) => x.nombre.toUpperCase().includes("IL"));
        setListFamilias(filtro);
      } else {
        setListFamilias(responses);
      }
    } catch (error) {
      openNotificationUI("Error al leer familias.", "error");
    }
  };
  //Leer Modelos por familia
  const [listModelos, setListModelos] = useState<IModelo[] | null>(null);
  const getModelos = async () => {
    try {
      const responses = unwrapResult(await dispatch(ModeloSliceRequest.getAllByFamiliaId(watchFamiliaId)));
      setListModelos(responses);
    } catch (error) {
      openNotificationUI("Error al leer modelos.", "error");
    }
  };

  //Servicio para verificar Código
  const getCodigo = async () => {
    try {
      if (!watchCodigo) {
        openNotificationUI("Ingrese código a buscar.", "error");
      } else {
        const responses = unwrapResult(await dispatch(SerieLgSliceRequests.getByNroSrv(watchCodigo)));
        if (responses) {
          openNotificationUI("Código Existe en base de datos.", "success");
        } else {
          openNotificationUI("Código no encontrado.", "error");
        }
      }
    } catch (error) {
      openNotificationUI("Error al leer el código.", "error");
    }
  };

  //getListSerieLg mediante los filtros
  const [listSerieLg, setListSerieLg] = useState<ISerieLg[] | null>(null);
  const getListSerieLg = async () => {
    if (watchFamiliaId == 0) {
      openNotificationUI("Ingrese valores a Buscar", "error");
    } else {
      const modeloFilter = listModelos.filter((a) => a.id === watchModeloId);
      const familiaFilter = listFamilias.filter((a) => a.id === watchFamiliaId);
      const modelA = {
        generico: familiaFilter[0].nombre,
        modelo: modeloFilter.length > 0 ? modeloFilter[0].nombre : "-1"
      };
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      try {
        const result = unwrapResult(await dispatch(SerieLgSliceRequests.getListByMGRequest(modelA)));
        setListSerieLg(result);
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      } catch (error) {
        openNotificationUI("Error al leer en serieLg.", "error");
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  //Eliminar
  const eliminar = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro que quiere eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(SerieLgSliceRequests.EliminarByIdRequest(row)));
        openNotificationUI("Se eliminó el registro correctamente", "success");
        getListSerieLg();
      } catch (error) {
        openNotificationUI("Error al eliminar.", "error");
      }
    }
  };

  //Watch
  const watchCodigo = watch("codigo");
  const watchModeloId = watch("modeloId");
  const watchProductoId = watch("productoId");
  useEffect(() => {
    if (watchProductoId) {
      getFamilias();
    }
  }, [watchProductoId]);
  const watchFamiliaId = watch("familiaId");
  useEffect(() => {
    if (watchFamiliaId) {
      getModelos();
    }
  }, [watchFamiliaId]);

  //Agregar - Editar
  const [editState, setEditState] = useState<ISerieLg | null>(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const editar = async (e) => {
    setEstaEditando(true);
    setEditState(e);
    setModalOpen(true);
  };
  const agregar = () => {
    setEstaEditando(false);
    setEditState(null);
    setModalOpen(true);
  };

  //Excel
  const [modalImportar, setModalImportar] = useState(false);

  return (
    <div>
      <Grid container className="h-full p-5 mt-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Grid item xs={2}>
          <div className="mt-2" style={{ width: "90%" }}>
            <Controller
              name="productoId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Producto</InputLabel>
                  <Select {...field} placeholder="Seleccione Producto" variant="standard">
                    {listProducto &&
                      listProducto.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                  {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="mt-2" style={{ width: "90%" }}>
            <Controller
              name="familiaId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Familia</InputLabel>
                  <Select {...field} placeholder="Seleccione Familia" variant="standard">
                    {listFamilias &&
                      listFamilias.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                  {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="mt-2" style={{ width: "90%" }}>
            <Controller
              name="modeloId"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Modelo</InputLabel>
                  <Select {...field} placeholder="Seleccione Modelo" variant="standard">
                    {listModelos &&
                      listModelos.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          <div className="w-full">
                            <div>{x.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                  {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                  {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="mt-2" style={{ width: "90%" }}>
            <Button onClick={getListSerieLg} className={buttonClasses.blueButton} variant="contained">
              Buscar
            </Button>
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="mt-2" style={{ width: "90%" }}>
            <Controller
              name="codigo"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Código</InputLabel>
                  <Input {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="mt-2" style={{ width: "90%" }}>
            <Button onClick={getCodigo} className={buttonClasses.purpleButton} variant="contained">
              Verificar
            </Button>
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className="mt-2" style={{ width: "90%" }}>
            <Button
              disabled={listSerieLg === null}
              onClick={() => {
                setModalImportar(true);
              }}
              className={buttonClasses.greenButton}
              variant="contained">
              Importar Excel
            </Button>
          </div>
        </Grid>
      </Grid>
      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          buscar={true}
          excel
          IDcolumn={"id"}
          agregar={agregar}
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Código",
              field: "trazabilidad"
            },
            {
              title: "Familia",
              field: "generico"
            },
            {
              title: "Modelo",
              field: "modelo"
            },
            {
              title: "Fecha",
              field: "fecha",
              render: (row) => {
                return moment(row.fecha).format("L");
              }
            },
            {
              title: "Impreso",
              field: "impreso",
              render: (row) => {
                return row.impreso ? "Si" : "No";
              }
            },
            {
              title: "Usado",
              field: "usado",
              render: (row) => {
                return row.usado ? "Si" : "No";
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => {
                            editar(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </div>
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
                  </div>
                );
              }
            }
          ]}
          dataInfo={listSerieLg}
        />
      </div>
      <ModalCompoment title="Gestión Serie Lg" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <SerieLgForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getListSerieLg}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
      <ModalCompoment title="Importación de Archivo Excel" openPopup={modalImportar} setOpenPopup={setModalImportar}>
        <CreacionSerieLgExl setOpenPopup={setModalImportar} refresh={getListSerieLg} listSerieLg={listSerieLg} />
      </ModalCompoment>
    </div>
  );
};
