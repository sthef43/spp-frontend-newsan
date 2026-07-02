import { Delete } from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import { FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests, ProductoSliceRequests } from "app/Middleware/reducers";
import { ValidarQrLgSliceRequests } from "app/Middleware/reducers/ValidarQrLgSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ValidarQrLgForm } from "app/features/trazabilidad/modules/validarQrLg/components/ValidarQrLgForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ValidarQrLg = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const buttonClasses = MaterialButtons();
  interface initialState {
    planta: number;
    linea: number;
    producto: number;
  }
  const initialStateVar = {
    planta: 0,
    linea: 0,
    producto: 0
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Leer ValidarQrLg por planta y linea
  const [listValidarQrLg, setListValidarQrLg] = useState([]);
  const getValidarQrLg = async () => {
    if (watchPlanta != 0 && watchLinea != 0) {
      try {
        const params = {
          plantaId: watchPlanta,
          lineaId: watchLinea,
          productoId: watchProducto
        };
        const responses = unwrapResult(
          await dispatch(ValidarQrLgSliceRequests.getListByPlantaLineaProductoRequest(params))
        );
        setListValidarQrLg(responses);
      } catch (error) {
        openNotificationUI("Error al leer validar Qr Lg.", "error");
      }
    }
  };

  //Leer Plantas
  const [listPlantas, setListPantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Líneas por planta
  const [listLineas, setListLineas] = useState([]);
  const getLineas = async () => {
    try {
      const responses = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(watchPlanta))
      );
      setListLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  //Leer Producto
  const [listProducto, setListProducto] = useState([]);
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  //Eliminar
  const deleteRow = async (row) => {
    const resp = await getConfirmation("Eliminar", "¿Esta seguro que desea eliminar el registro?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(ValidarQrLgSliceRequests.deleteRequest(row.id)));
        if (response) {
          openNotificationUI("Se elimino el registro correctamente", "success");
          getValidarQrLg();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  //Watch
  const watchProducto = watch("producto");
  useEffect(() => {
    if (watchProducto) {
      getValidarQrLg();
    }
  }, [watchProducto]);

  const watchLinea = watch("linea");
  useEffect(() => {
    if (watchLinea) {
      getProducto();
      setValue("producto", 0);
      watchProducto == 0;
    }
  }, [watchLinea]);

  const watchPlanta = watch("planta");
  useEffect(() => {
    if (watchPlanta) {
      setListProducto(null);
      watchProducto == 0;
      watchLinea == 0;
      getLineas();
    }
  }, [watchPlanta]);

  //Editar
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Agregar
  const agregar = () => {
    if (watchPlanta && watchLinea && watchProducto) {
      setEditState({ plantaId: watchPlanta, lineaId: watchLinea, productoId: watchProducto });
      setEstaEditando(false);
      setModalOpen(true);
    } else {
      openNotificationUI("Ingrese Planta - Línea - Producto.", "error");
    }
  };

  //Use efect genérico
  useEffect(() => {
    TitleChanger("VALIDAR QR LG - ADMIN");
    getPlantas();
  }, []);

  return (
    <div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <div className="mt-2" style={{ width: "60%" }}>
              <Controller
                name="planta"
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
          <Grid item xs={3}>
            <div className="mt-2" style={{ width: "60%" }}>
              <Controller
                name="linea"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel>Línea</InputLabel>
                    <Select {...field} placeholder="Seleccione Línea" variant="standard">
                      {listLineas &&
                        listLineas.map((x) => (
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
          <Grid item xs={3}>
            <div className="mt-2" style={{ width: "60%" }}>
              <Controller
                name="producto"
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
        </Grid>
      </div>
      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          excel
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Familia",
              field: "familia.nombre"
            },
            {
              title: "Modelo",
              field: "modelo.nombre"
            },
            {
              title: "Código",
              field: "codigo"
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
            // {
            //   title: "Validado",
            //   field: "",
            //   render: (row) => {
            //     return row.valido? (
            //       <IconButton disabled>
            //         <Check color="success" />
            //       </IconButton>
            //     ) : (
            //       <IconButton disabled>
            //         <Clear color="error" />
            //       </IconButton>
            //     );
            //   }
            // },
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
                        <span>
                          <IconButton
                            onClick={() => {
                              deleteRow(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Delete color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            agregar();
          }}
          dataInfo={listValidarQrLg}
        />
        <ModalCompoment title="Nuevo Registro Validar QR LG" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <ValidarQrLgForm
            setOpenPopup={setModalOpen}
            editState={editState}
            refresh={getValidarQrLg}
            estaEditando={estaEditando}
          />
        </ModalCompoment>
      </div>
    </div>
  );
};
