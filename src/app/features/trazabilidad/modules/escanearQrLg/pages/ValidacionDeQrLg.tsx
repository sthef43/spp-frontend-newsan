import { Check, Clear } from "@mui/icons-material";
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
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { ValidarQrLgSliceRequests } from "app/Middleware/reducers/ValidarQrLgSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ValidarCodigoQrLgForm } from "app/features/trazabilidad/modules/escanearQrLg/modal/ValidarCodigoQrLgForm";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from "xlsx";

export const ValidacionDeQrLg = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const classes = MaterialButtons();
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

  //Leer ValidarQrLg por planta - linea - producto
  const [listValidarQrLg, setListValidarQrLg] = useState([]);
  const getValidarQrLg = async () => {
    // console.log(fechaSelectDesde);
    // console.log(fechaSelectHasta);
    if (watchPlanta != 0 && watchLinea != 0 && watchProducto != 0) {
      try {
        const params = {
          plantaId: watchPlanta,
          lineaId: watchLinea,
          productoId: watchProducto,
          fechaDesde: fechaSelectDesde,
          fechaHasta: fechaSelectHasta
        };
        const responses = unwrapResult(await dispatch(ValidarQrLgSliceRequests.getListByPLPFechaRequest(params)));
        setListValidarQrLg(responses);
      } catch (error) {
        openNotificationUI("Error leer Validar Qr Lg.", "error");
      }
    } else {
      openNotificationUI("Seleccionar Planta - Línea - Producto.", "error");
    }
  };

  const [listValidarQrLg2, setListValidarQrLg2] = useState([]);
  const getValidarQrLg2 = async () => {
    if (!(listValidarQrLg.length > 0)) {
      return;
    }
    const flattenedData: any[] = [];
    let uniqueId = 0;

    listValidarQrLg.forEach((plan) => {
      let flattenedItem = {
        //ValidarQrLg
        Id: uniqueId++,
        Planta: plan.planta.name,
        Linea: plan.linea.nombre,
        Producto: plan.producto.nombre,
        Familia: plan.familia.nombre,
        Modelo: plan.modelo.nombre,
        Codigo: plan.codigo,
        //ValidadosQrLg
        FechaValidado: null,
        Estado: null
      };
      if (plan.validadosQrLg.length == 0) {
        flattenedData.push(flattenedItem);
      } else {
        plan.validadosQrLg.forEach((embarque) => {
          flattenedItem = {
            ...flattenedItem,
            Id: uniqueId++,
            FechaValidado: moment(embarque.createdDate).format("L - hh:mm a"),
            Estado: embarque.valido
          };
          flattenedData.push(flattenedItem);
        });
      }
    });
    // console.log(flattenedData);
    setListValidarQrLg2(flattenedData);
  };

  useEffect(() => {
    getValidarQrLg2();
  }, [listValidarQrLg]);

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
  // const deleteRow = async (row) => {
  //   const resp = await getConfirmation("Eliminar", "¿Esta seguro que desea eliminar el registro?");
  //   if (resp) {
  //     try {
  //       const response = unwrapResult(await dispatch(ValidarQrLgSliceRequests.deleteRequest(row.id)));
  //       if (response) {
  //         openNotificationUI("Se elimino el registro correctamente", "success");
  //         getValidarQrLg();
  //       }
  //     } catch (error) {
  //       openNotificationUI("Error al eliminar el registro.", "error");
  //     }
  //   }
  // };

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
  // const [estaEditando, setEstaEditando] = useState(false);
  // const editar = (rowData) => {
  //   setEditState({ ...rowData });
  //   setEstaEditando(true);
  //   setModalOpen(true);
  // };
  // setEstaEditando(false);

  //Agregar
  const [ModalOpen, setModalOpen] = useState(false);
  const [editState, setEditState] = useState(null);
  const agregar = () => {
    if (watchPlanta && watchLinea && watchProducto) {
      setEditState({ plantaId: watchPlanta, lineaId: watchLinea, productoId: watchProducto });
      setModalOpen(true);
    } else {
      openNotificationUI("Ingrese Planta - Línea - Producto.", "error");
    }
  };

  //Fecha desde y hasta
  const [fechaSelectDesde, setfechaSelectDesde] = useState(null);
  const onChangeFechaDesde = (fecha: string) => {
    setfechaSelectDesde(moment(fecha).format("YYYY-MM-DD"));
  };
  const [fechaSelectHasta, setfechaSelectHasta] = useState(null);
  const onChangeFechaHasta = (fecha: string) => {
    setfechaSelectHasta(moment(fecha).format("YYYY-MM-DD"));
  };

  //Use efect genérico
  useEffect(() => {
    TitleChanger("VALIDAR QR LG");
    getPlantas();
  }, []);

  //Exportar a Excel
  const exportToExcel = (): void => {
    // console.log(listValidarQrLg);
    if (!(listValidarQrLg.length > 0)) {
      openNotificationUI("No hay datos para exportar a Excel.", "error");
      return;
    }
    // return;
    const flattenedData: any[] = [];
    listValidarQrLg.forEach((plan) => {
      let flattenedItem = {
        //ValidarQrLg
        Planta: plan.planta.name,
        Linea: plan.linea.nombre,
        Producto: plan.producto.nombre,
        Familia: plan.familia.nombre,
        Modelo: plan.modelo.nombre,
        Codigo: plan.codigo,
        //ValidadosQrLg
        FechaValidado: null,
        Estado: null
      };
      if (plan.validadosQrLg.length == 0) {
        flattenedData.push(flattenedItem);
      } else {
        plan.validadosQrLg.forEach((embarque) => {
          flattenedItem = {
            ...flattenedItem,
            FechaValidado: moment(embarque.createdDate).format("L - hh:mm a"),
            Estado: embarque.valido ? "Good" : "No Good"
          };
          flattenedData.push(flattenedItem);
        });
      }
    });
    // console.log(flattenedData);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = "SPP-ValidacionQrLg.xlsx";
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div>
      <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Grid container spacing={1}>
          <Grid item xs={2}>
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
          <Grid item xs={2}>
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
          <Grid item xs={2}>
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
          <Grid item xs={3}>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              <div>
                Desde
                <SelectOfDate pickFecha setFechaProps={onChangeFechaDesde} />
              </div>
              <div>
                Hasta
                <SelectOfDate pickFecha setFechaProps={onChangeFechaHasta} />
              </div>
            </div>
          </Grid>
          <Grid item xs={2}>
            <div>
              <Button
                onClick={getValidarQrLg}
                sx={{ marginLeft: "40%" }}
                className={buttonClasses.purpleButton}
                variant="contained">
                Buscar
              </Button>
            </div>
          </Grid>
          <Grid item xs={1}>
            <Button className={classes.greenButton} variant="contained" onClick={exportToExcel}>
              Exportar
            </Button>
          </Grid>
        </Grid>
      </div>

      <div className="my-2 mx-4 h-full">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"Id"}
          // excel
          columns={[
            {
              title: "Familia",
              field: "Familia"
            },
            {
              title: "Modelo",
              field: "Modelo"
            },
            {
              title: "Código",
              field: "Codigo"
            },
            {
              title: "Fecha Validación",
              field: "FechaValidado"
            },
            {
              title: "Validado",
              field: "Estado",
              render: (row) => {
                return row.Estado ? (
                  <Tooltip title="Good">
                    <span>
                      <IconButton disabled>
                        <Check color="success" />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title="No Good">
                    <span>
                      <IconButton disabled>
                        <Clear color="error" />
                      </IconButton>
                    </span>
                  </Tooltip>
                );
              }
            }
          ]}
          agregar={() => {
            agregar();
          }}
          dataInfo={listValidarQrLg2}
        />
      </div>
      <ModalCompoment title="Nueva Validación de QR LG" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <ValidarCodigoQrLgForm setOpenPopup={setModalOpen} editState={editState} refresh={getValidarQrLg} />
      </ModalCompoment>
    </div>
  );
};
