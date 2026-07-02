/* eslint-disable unused-imports/no-unused-vars */
import { Edit, Image } from "@mui/icons-material";
import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EtiquetasImagenSliceRequests } from "app/Middleware/reducers/EtiquetasImagenSlice";
import { LineaSlice, LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea, IPlanProd } from "app/models";
import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import { ActualizarImagenModal } from "app/features/calidad/modules/cargaImagenesEtiquetas/Components/ActualizarImagenModal";
import { AgregarImagenModal } from "app/features/calidad/modules/cargaImagenesEtiquetas/Components/AgregarImagenModal";
import { VerImagenCargadaModal } from "app/features/calidad/modules/cargaImagenesEtiquetas/Components/VerImagenCargadaModal";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { SelectLineaAndPlant } from "app/shared/helpers/SelectLineaAndPlant";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const CargarImagenesEtiquetas = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { watch, control, setValue } = useForm({ mode: "all" });

  const [openModalAgregarImagen, setOpenModalAgregarImagen] = useState(false);
  const [openModalVerImagen, setOpenModalVerImagen] = useState(false);
  const [openModalActualizarImagen, setOpenModalActualizarImagen] = useState(false);

  const [datosImagen, setDatosImagen] = useState<IEtiquetasImagen>();

  const watchLineaId: number = watch("lineaId");
  const watchCodigoModelo: string = watch("codigoModelo");

  const [listaLineas, setListaLineas] = useState<ILinea[]>([]);
  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(planta)));
      if (response.length == 0) {
        setListaLineas([]);
      } else {
        setListaLineas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      openNotificationUI(`Se encontro el error ${error}`, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaModelos, setListaModelos] = useState<IPlanProd[]>([]);
  const getModelos = async () => {
    const lineaSeleccionada = listaLineas.find((elementos) => elementos.idLinea == watchLineaId);
    dispatch(LineaSlice.actions.setStateObject(lineaSeleccionada));
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          PlanProdSliceRequests.getListModelsByIdentifyLine({
            identificador: lineaSeleccionada.tipoUnidad,
            lineaId: watchLineaId
          })
        )
      );
      if (response.length > 0) {
        setListaModelos(response);
      } else {
        setListaModelos([]);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaImagenes, setListaImagenes] = useState<IEtiquetasImagen[]>([]);
  const getImagenes = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(EtiquetasImagenSliceRequests.getAllByModelo(watchCodigoModelo)));
      if (response.length == 0) {
        openNotificationUI("No se econtraron imagenes", "warning");
        setListaImagenes([]);
      } else {
        setListaImagenes(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [planta, plantaid] = useState(0);
  const [productoId, setProductoId] = useState(0);

  useEffect(() => {
    TitleChanger("Cargar Imagenes De Etiquetas");
  }, []);

  useEffect(() => {
    if (productoId) {
      getLineas();
      setValue("lineaId", 0);
      setValue("codigoModelo", 0);
    }
  }, [productoId]);

  useEffect(() => {
    if (watchLineaId) {
      getModelos();
      if (listaImagenes.length > 0) {
        setListaImagenes([]);
      }
    }
  }, [watchLineaId]);

  useEffect(() => {
    if (watchCodigoModelo) {
      getImagenes();
    }
  }, [watchCodigoModelo]);

  return (
    <main className="px-3 w-screen">
      <section className="w-full flex-col">
        <SelectLineaAndPlant
          activarEstilosPersonalizados={true}
          estilos="w-full mt-6 bg-bg-background p-5 flex border border-gray-300 rounded-md shadow-md gap-10"
          setPlantaId={plantaid}
          setProductoId={setProductoId}
          aniadirCodigoHtml={
            <>
              <div className="w-full">
                <Controller
                  name="lineaId"
                  control={control}
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Seleccione una linea</InputLabel>
                      <Select label="Seleccione un modelo" {...field} variant="outlined">
                        {listaLineas &&
                          listaLineas?.map((elementos) => (
                            <MenuItem key={elementos.idLinea} value={elementos.idLinea}>
                              <div className="w-full">
                                <div>{elementos.descripcion}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="codigoModelo"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Seleccione un modelo</InputLabel>
                      <Select label="Seleccione un modelo" {...field} variant="outlined">
                        {listaModelos &&
                          listaModelos?.map((elementos) => (
                            <MenuItem key={elementos.idProduccion} value={elementos.codigoModelo}>
                              <div className="w-full">
                                <div>{elementos.codigoModelo}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </>
          }
        />
        {watchCodigoModelo != "" && productoId != 0 && (
          <div className="mt-4">
            <TableComponent
              IDcolumn="id"
              buscar={true}
              dataInfo={listaImagenes}
              agregar={() => {
                setOpenModalAgregarImagen(true);
              }}
              columns={[
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Tipo De Etiqueta",
                  field: "tipoDeEtiqueta"
                },
                {
                  title: "Imagenes",
                  field: "",
                  render: (rowData) => {
                    return (
                      <Tooltip title="Ver imagen">
                        <IconButton
                          size="medium"
                          color="primary"
                          style={{ position: "relative" }}
                          onClick={() => {
                            setOpenModalVerImagen(true);
                            setDatosImagen(rowData);
                          }}>
                          <Image />
                        </IconButton>
                      </Tooltip>
                    );
                  }
                },
                {
                  title: "Acciones",
                  field: "",
                  render: (rowData) => {
                    return (
                      <Tooltip title="Editar imagen">
                        <IconButton
                          size="medium"
                          color="primary"
                          style={{ position: "relative" }}
                          onClick={() => {
                            setOpenModalActualizarImagen(true);
                            setDatosImagen(rowData);
                          }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    );
                  }
                }
              ]}
            />
          </div>
        )}
        <ModalCompoment
          setOpenPopup={setOpenModalActualizarImagen}
          openPopup={openModalActualizarImagen}
          title="Actualizar imagen">
          <ActualizarImagenModal
            refreshTable={getImagenes}
            setOpenModalActualizarImagen={setOpenModalActualizarImagen}
            datosImagen={datosImagen}></ActualizarImagenModal>
        </ModalCompoment>
        <ModalCompoment
          setOpenPopup={setOpenModalAgregarImagen}
          openPopup={openModalAgregarImagen}
          title="AGREGAR IMAGEN">
          <AgregarImagenModal
            refreshTable={getImagenes}
            setOpenModal={setOpenModalAgregarImagen}
            openModal={openModalAgregarImagen}
            modelo={watchCodigoModelo}
          />
        </ModalCompoment>
        <ModalCompoment
          setOpenPopup={setOpenModalVerImagen}
          openPopup={openModalVerImagen}
          title="DATOS Y IMAGEN ASIGNADA">
          <VerImagenCargadaModal datosImagen={datosImagen} />
        </ModalCompoment>
      </section>
    </main>
  );
};
