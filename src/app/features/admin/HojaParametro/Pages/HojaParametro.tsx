/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { Check, CheckBox, Clear, Comment, Delete, Error, Image, Print } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  Tooltip
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { HojaParametroSliceRequests } from "app/Middleware/reducers/HojaParametroSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { IHojaParametro } from "app/models/IHojaParametro";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import HojaParametrosComentarios from "../Modals/HojaParametrosComentarios";
import { HojaParametrosAprobacionForm } from "../Modals/HojaParametrosAprobacionForm";
import { HojaParametrosForm } from "../Modals/HojaParametrosForm";
import { HojaParametrosImageAprobadaForm } from "../Modals/HojaParametrosImageAprobadaForm";
import { HojaParametrosImprimirForm } from "../Modals/HojaParametrosImprimirForm";
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";

interface initialState {
  productoId: number;
  familiaId: number;
}
const initialStateVar = {
  productoId: 0,
  familiaId: 0
};

export const HojaParametro = (): JSX.Element => {
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const buttonClasses = MaterialButtons();

  //Tomo el Id de la hoja de parametros seleccionada
  const [hojaParametroId, setHojaParametroId] = useState(0);

  //Check que viene seleccionado como predeterminado
  const [checkedAprobadoNombre, setCheckedAprobadoNombre] = useState("Aprobado");

  //Estados de condicional y apertura de modales
  const [openModalComments, setOpenModalComments] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const [esCalidad, setEsCalidad] = useState(false);
  const [modalOpenAprobar, setModalOpenAprobar] = useState(false);
  const [modalVerImagen, setModalVerImagen] = useState(false);
  const [modalVerImagenAprobada, setModalVerImagenAprobada] = useState(false);
  const [checkedAprobado, setCheckedAprobado] = useState(true);

  const [productoNombre, setProductoNombre] = useState(null);
  const [familiaNombre, setFamiliaNombre] = useState(null);
  const [emailStateAprobar, setEmailStateAprobar] = useState(null);

  const [listProducto, setListProducto] = useState([]);
  const [listFamilia, setListFamilia] = useState([]);
  const [listHojasParametros, setlistHojasParametros] = useState([]);

  //Imagen e Impresión
  const [stringImagen, setStringImagen] = useState<IHojaParametro | null>(null);
  const [stringImprimir, setStringImprimir] = useState<IHojaParametro | null>(null);
  const [editStateAprobar, setEditStateAprobar] = useState<IHojaParametro | null>(null);

  //Watchs
  const watchProducto = watch("productoId");
  const watchFamilia = watch("familiaId");

  //Leer Producto
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  //Leer Familia
  const getFamilia = async () => {
    try {
      const responses = unwrapResult(await dispatch(FamiliaSliceRequests.getAllByProductoId(watchProducto)));
      setListFamilia(responses);
    } catch (error) {
      openNotificationUI("Error al leer familia.", "error");
    }
  };

  //Leer Hoja Param por aprobado, planta y producto
  const getHojasParametros = async () => {
    if (watchProducto != 0) {
      try {
        const params = { estado: checkedAprobadoNombre, productoId: watchProducto, familiaId: watchFamilia };
        const responses = unwrapResult(await dispatch(HojaParametroSliceRequests.getListByEstadoRequest(params)));
        setlistHojasParametros(responses);
      } catch (error) {
        openNotificationUI("Error al leer hojas de parámetros.", "error");
      }
    } else {
      openNotificationUI("Seleccione Producto.", "error");
    }
  };

  //Eliminar
  const deleteRow = async (row) => {
    const resp = await getConfirmation("Eliminar hoja de parámetros", "¿Esta seguro que desea eliminar el registro?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(HojaParametroSliceRequests.deleteRequest(row.id)));
        if (response) {
          openNotificationUI("Se elimino la hoja de parámetros correctamente", "success");
          getHojasParametros();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar hoja de parámetros.", "error");
      }
    }
  };

  const AprobarRow = async (row) => {
    const objectSubmit = {
      ...row,
      modelo: null,
      marca: null,
      proveedores: null,
      userCalidad: null,
      userSector: null,
      userCalidadId: esCalidad ? infoUser.id : row.userCalidadId,
      fechaCalidad: esCalidad ? moment(row.lastModifiedDate).format("L") : row.fechaCalidad,
      userSectorId: !esCalidad ? infoUser.id : row.userSectorId,
      fechaSector: !esCalidad ? moment(row.lastModifiedDate).format("L") : row.fechaSector
    };
    const props = {
      producto: productoNombre,
      familia: familiaNombre,
      usuario: infoUser.operator.name + " " + infoUser.operator.surname,
      modelo: row.modelo.nombre,
      marca: row.marca.descripcion,
      version: row.version,
      proveedor: row.proveedores.descripcion + " - " + row.proveedores.tipo,
      emailsDestiners: ""
    };
    setEditStateAprobar({ ...objectSubmit });
    setEmailStateAprobar({ ...props });
    setModalOpenAprobar(true);
  };

  // Determina si es de calidad
  const getEsCalidad = () => {
    infoUser.permisos.rol.name.toUpperCase().includes("calidad".toUpperCase())
      ? setEsCalidad(true)
      : setEsCalidad(false);
  };

  const verImagen = (row) => {
    setStringImagen({ ...row });
    if (checkedAprobadoNombre == "Aprobado") {
      setModalVerImagenAprobada(true);
    } else {
      setModalVerImagen(true);
    }
  };
  const ImprimirRow = (row) => {
    setStringImprimir({ ...row });
  };

  const componentRef = React.useRef(null);
  const handleImprimir = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Imprimir Plano",
    copyStyles: true,
    pageStyle: "@page { size: auto; background-color: black; -webkit-print-color-adjust: exact; margin: 0 }"
  });

  //Watch Columna de Fechas
  // const watchLinea = watch("linea");
  // const [lineaNombre, setLineaNombre] = useState(null);
  // useEffect(() => {
  //   if (listLineas && listLineas.length > 0) {
  //     const resp = listLineas.find((x) => x.id === watchLinea);
  //     setLineaNombre(resp.nombre);
  //   }
  // }, [watchLinea]);

  // const watchPlanta = watch("planta");
  // const [plantaNombre, setPlantaNombre] = useState(null);
  // useEffect(() => {
  //   console.log(watchPlanta);
  //   if (listPlantas && listPlantas.length > 0) {
  //     const resp = listPlantas.find((x) => x.id === watchPlanta);
  //     setPlantaNombre(resp.name);
  //   }
  //   watchLinea == 0;
  //   getLineas();
  // }, [watchPlanta]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedAprobadoNombre(event.target.value);
    event.target.value == "Aprobado" ? setCheckedAprobado(true) : setCheckedAprobado(false);
  };

  const controlProps = (item: string) => ({
    checked: checkedAprobadoNombre === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item }
  });

  // const [selectedValue, setSelectedValue] = React.useState('Aprobado');
  // const handleChangeOrigen = (event: React.ChangeEvent<HTMLInputElement>) => {
  // setCheckedAprobado(event.target.checked);
  // event.target.checked ? setCheckedAprobadoNombre("Aprobado") : setCheckedAprobadoNombre("Pendiente");
  // };

  useEffect(() => {
    stringImprimir && handleImprimir();
  }, [stringImprimir]);

  useEffect(() => {
    if (listProducto && listProducto.length > 0) {
      const resp = listProducto.find((x) => x.id === watchProducto);
      if (resp) {
        setProductoNombre(resp.nombre);
      }
    }
  }, [watchProducto]);

  useEffect(() => {
    if (listFamilia && listFamilia.length > 0) {
      const resp = listFamilia.find((x) => x.id === watchFamilia);
      if (resp) {
        setFamiliaNombre(resp.nombre);
      }
    }
  }, [watchFamilia]);

  useEffect(() => {
    if (watchProducto) {
      getFamilia();
    }
  }, [watchProducto]);

  useEffect(() => {
    getHojasParametros();
  }, [checkedAprobadoNombre]);

  useEffect(() => {
    if (watchFamilia) {
      getHojasParametros();
    }
  }, [watchFamilia]);

  //Use efect genérico
  useEffect(() => {
    TitleChanger("HOJAS DE PARAMETROS");
    getEsCalidad();
    getProducto();
    // getProducto();
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <>
        <ContainerForPages optionsLayout="Selects">
          <div className="flex flex-row item-center w-full gap-x-4">
            <div className="w-full">
              <Controller
                name="productoId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="standard" error={!!error}>
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
            <div className="w-full">
              <Controller
                name="familiaId"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="standard" error={!!error}>
                    <InputLabel>Familia</InputLabel>
                    <Select {...field} placeholder="Seleccione Familia" variant="standard">
                      {listFamilia &&
                        listFamilia.map((x) => (
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
          </div>
          <div className="w-full">
            {/* <div className="mt-2" style={{ width: "60%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedAprobado}
                    onChange={handleChangeOrigen}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={checkedAprobadoNombre}
              />
            </div> */}
            <div className="flex flex-row items-center justify-center">
              <Radio {...controlProps("Pendiente")} color="primary" />
              Pendiente
              <Radio {...controlProps("Aprobado")} color="success" />
              Aprobado
              <Radio {...controlProps("Desaprobado")} color="secondary" />
              Desaprobado
            </div>
          </div>
          <div>
            <div>
              <Button
                onClick={getHojasParametros}
                sx={{ marginLeft: 3 }}
                className={buttonClasses.greenButton}
                variant="contained">
                Buscar
              </Button>
            </div>
          </div>
        </ContainerForPages>
      </>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          Dense={true}
          // Overflow={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Modelo",
              field: "modelo.nombre"
            },
            {
              title: "Marca",
              field: "marca.descripcion"
            },
            {
              title: "Proveedor",
              field: "proveedores.descripcion"
            },
            {
              title: "Versión",
              field: "version"
            },
            {
              title: "Hoja de Parámetros",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Ver Hoja de Parámetros">
                        {row.imagen != "" && row.imagen != null ? (
                          <IconButton
                            // disabled={!esCalidad}
                            onClick={() => {
                              verImagen(row);
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
                      </Tooltip>
                    </div>
                  </div>
                );
              }
            },
            {
              title: "Calidad-Usuario",
              field: "",
              render: (row) => {
                if (row.userCalidad == null) {
                  return "-";
                } else {
                  return row.userCalidad.operator.name + " " + row.userCalidad.operator.surname;
                }
              }
            },
            {
              title: "Calidad-Fecha",
              field: "",
              render: (row) => {
                if (row.fechaCalidad == null) {
                  return "-";
                } else {
                  return row.fechaCalidad;
                }
              }
            },
            {
              title: "Sector-Usuario",
              field: "",
              render: (row) => {
                if (row.userSector == null) {
                  return "-";
                } else {
                  return row.userSector.operator.name + " " + row.userSector.operator.surname;
                }
              }
            },
            {
              title: "Sector-Fecha",
              field: "",
              render: (row) => {
                if (row.fechaSector == null) {
                  return "-";
                } else {
                  return row.fechaSector;
                }
              }
            },
            {
              title: "Estado",
              field: "",
              render: (row) => {
                return row.estado == "Desaprobado" ? (
                  <IconButton disabled>
                    <Clear color="error" />
                  </IconButton>
                ) : (
                  <IconButton disabled>
                    <Check color="success" />
                  </IconButton>
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
                      <Tooltip title="Aprobar">
                        <span>
                          <IconButton
                            hidden={checkedAprobado}
                            onClick={() => {
                              AprobarRow(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <CheckBox color="success" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Ver Observaciones">
                        <IconButton
                          onClick={() => {
                            setHojaParametroId(row.id);
                            setOpenModalComments(true);
                          }}
                          size="small"
                          color="info"
                          style={{ position: "relative" }}>
                          <Comment />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Imprimir">
                        <span>
                          <IconButton
                            hidden={!checkedAprobado}
                            onClick={() => {
                              ImprimirRow(row);
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <Print color="inherit" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton
                            disabled={esCalidad}
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
            if (watchProducto != 0 && watchFamilia != 0) {
              // console.log("ambos distintos de cero")
              esCalidad ? openNotificationUI("No habilitado para Calidad.", "error") : setModalOpen(true);
            } else {
              openNotificationUI("Seleccione Producto - Familia.", "error");
            }
          }}
          dataInfo={listHojasParametros}
        />
      </ContainerForPages>
      <ModalCompoment title="Nueva Hoja de Parámetros" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <HojaParametrosForm
          setOpenPopup={setModalOpen}
          getFamiliaId={watchFamilia}
          getProductoId={watchProducto}
          getFamiliaNombre={familiaNombre}
          getProductoNombre={productoNombre}
          refresh={getHojasParametros}
        />
      </ModalCompoment>
      <ModalCompoment
        title={"Hoja de Parámetros"}
        openPopup={modalVerImagenAprobada}
        setOpenPopup={setModalVerImagenAprobada}>
        <HojaParametrosImageAprobadaForm fila={stringImagen} />
      </ModalCompoment>

      <div className="hidden bg-white">
        <HojaParametrosImprimirForm parentRef={componentRef} fila={stringImprimir} />
      </div>

      <ModalCompoment title="Vista Hoja de Parámetros" openPopup={modalVerImagen} setOpenPopup={setModalVerImagen}>
        <>
          <div className="col-span-2 flex justify-center flex-col gap-4 items-center">
            <div className="border-2 rounded-lg overflow-hidden border-red-400 ">
              <>
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={`${import.meta.env.VITE_PUBLIC_URL}/imagenes/HojaParametros/${stringImagen?.imagen}`}
                />
              </>
            </div>
          </div>
        </>
      </ModalCompoment>
      <ModalCompoment
        title={"Aprobar Hoja de Parámetros"}
        openPopup={modalOpenAprobar}
        setOpenPopup={setModalOpenAprobar}>
        <HojaParametrosAprobacionForm
          setOpenPopup={setModalOpenAprobar}
          editState={editStateAprobar}
          emailState={emailStateAprobar}
          refresh={getHojasParametros}
        />
      </ModalCompoment>
      <ModalCompoment title={"Observaciones"} openPopup={openModalComments} setOpenPopup={setOpenModalComments}>
        <HojaParametrosComentarios hojaParametrosId={hojaParametroId} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
