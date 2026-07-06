/* eslint-disable unused-imports/no-unused-vars */
import { Delete, Edit, Error, Image } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests, ProductoSliceRequests } from "app/Middleware/reducers";
import { CalidadDocumentSliceRequests } from "app/Middleware/reducers/CalidadDocumentSlice";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { SemielaboradoIASliceRequest } from "app/Middleware/reducers/semielaboradoIaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant, IProducto, ISemielaboradoIA } from "app/models";
import { ICalidadDocument } from "app/models/ICalidadDocument";
import { IFamilia } from "app/models/IFamilia";
import { IModelo } from "app/models/IModelo";
import { CalidadDocumentForm } from "app/features/calidad/modules/calidadDocument/Components/CalidadDocumentForm";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const CalidadDocument = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();

  interface initialState {
    plantId: number;
    productoId: number;
    familiaId: number;
    modeloId: number;
    semielaboradoIAId: number;
    nombre: string;
    descripcion: string;
  }
  const initialStateVar = {
    plantId: 0,
    productoId: 0,
    familiaId: 0,
    modeloId: 0,
    semielaboradoIAId: 0,
    nombre: "",
    descripcion: ""
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    TitleChanger("VISUALIZAR DOCUMENTOS");
    getPlantas();
    getProducto();
  }, []);

  //Leer Plantas
  const [listPlantas, setListPantas] = useState<IPlant[] | null>(null);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

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
      setListFamilias(responses);
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

  //Leer SemielaboradoIA por familia
  const [listSemielaboradoIA, setListSemielaboradoIA] = useState<ISemielaboradoIA[] | null>(null);
  const getSemielaboradoIA = async () => {
    try {
      const responses = unwrapResult(await dispatch(SemielaboradoIASliceRequest.getByFamiliaIdRequest(watchFamiliaId)));
      setListSemielaboradoIA(responses);
    } catch (error) {
      openNotificationUI("Error al leer semielaboradoIA.", "error");
    }
  };

  //Leer Documentos
  const [listCalidadDocument, setListCalidadDocument] = useState<ICalidadDocument[] | null>(null);
  const getCalidadDocument = async () => {
    try {
      if (
        getValues("plantId") === 0 ||
        getValues("productoId") === 0 ||
        getValues("familiaId") === 0 ||
        getValues("modeloId") === 0 ||
        getValues("semielaboradoIAId") === 0
      ) {
        openNotificationUI("Seleccione filtros para Buscar.", "error");
      } else {
        const modelo = {
          plantId: getValues("plantId"),
          productoId: getValues("productoId"),
          familiaId: getValues("familiaId"),
          modeloId: getValues("modeloId"),
          semielaboradoIAId: getValues("semielaboradoIAId")
        };
        const responses = unwrapResult(await dispatch(CalidadDocumentSliceRequests.getByPlPrFaMoSIARequest(modelo)));
        setListCalidadDocument(responses);
      }
    } catch (error) {
      openNotificationUI("Error al leer documentos.", "error");
    }
  };

  //Watch
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
      getSemielaboradoIA();
    }
  }, [watchFamiliaId]);

  //Imagen
  const [modalVerImagen, setModalVerImagen] = useState(false);
  const [stringImagen, setStringImagen] = useState("");
  const verImagen = (imagen) => {
    setModalVerImagen(true);
    setStringImagen(imagen);
  };

  //Eliminar
  const eliminar = async (row) => {
    const resp = await getConfirmation("Eliminar", "Esta seguro que quiere eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(CalidadDocumentSliceRequests.deleteRequest(row)));
        openNotificationUI("Se eliminó el registro correctamente", "success");
        getCalidadDocument();
      } catch (error) {
        openNotificationUI("Error al eliminar ubicacion.", "error");
      }
    }
  };

  //Agregar - Editar
  const [editState, setEditState] = useState<ICalidadDocument | null>(null);
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

  return (
    <div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Grid container>
          <Grid item xs={2}>
            <div className="mt-2" style={{ width: "90%" }}>
              <Controller
                name="plantId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Planta</InputLabel>
                    <Select {...field} placeholder="Seleccione Planta" variant="standard">
                      {listPlantas &&
                        listPlantas.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.name}</div>
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
          <Grid item xs={2}>
            <div className="mt-2" style={{ width: "90%" }}>
              <Controller
                name="semielaboradoIAId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>SemielaboradoIA</InputLabel>
                    <Select {...field} placeholder="Seleccione SemielaboradoIA" variant="standard">
                      {listSemielaboradoIA &&
                        listSemielaboradoIA.map((x) => (
                          <MenuItem key={x.id} value={x.id}>
                            <div className="w-full">
                              <div>{x.valor}</div>
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
            <div>
              <Button onClick={getCalidadDocument} className={buttonClasses.purpleButton} variant="contained">
                Buscar
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          agregar={agregar}
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Nombre",
              field: "nombre"
            },
            {
              title: "Imagen",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      {row.descripcion != "" && row.descripcion != null ? (
                        <IconButton
                          onClick={() => {
                            verImagen(row.descripcion);
                          }}
                          size="small"
                          color="success"
                          style={{ position: "relative" }}>
                          <Image />
                        </IconButton>
                      ) : (
                        <IconButton size="small" color="error" style={{ position: "relative" }}>
                          <Error />
                        </IconButton>
                      )}
                    </div>
                  </div>
                );
              }
            },
            {
              title: "Fecha Creación",
              field: "",
              render: (row) => {
                return moment(row.createdDate).format("L");
              }
            },
            {
              title: "Fecha Modificación",
              field: "",
              render: (row) => {
                return moment(row.lastModifiedDate).format("L");
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
          dataInfo={listCalidadDocument}
        />
        <ModalCompoment title="Vista de Imagen" openPopup={modalVerImagen} setOpenPopup={setModalVerImagen}>
          <>
            <div className=" flex-col gap-30 " style={{ height: "100%" }}>
              <div style={{ height: "81vh", width: "90vw" }}>
                <div className=" flex-col gap-30 " style={{ width: "100%", height: "100%" }}>
                  <>
                    <img
                      //   style={{ width: "100%", height: "100%", display: "flex" }}
                      src={`${import.meta.env.VITE_PUBLIC_URL}/imagenes/CalidadDocument/${stringImagen}`}
                    />
                    {/* <iframe
                      style={{ width: "100%", height: "100%", display: "flex" }}
                      src={`${import.meta.env.VITE_PUBLIC_URL}/imagenes/CalidadDocument/${stringImagen}`}
                    /> */}
                  </>
                </div>
              </div>
            </div>
          </>
        </ModalCompoment>
      </div>
      <ModalCompoment title="Gestión Documentos" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <CalidadDocumentForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getCalidadDocument}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
