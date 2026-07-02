/* eslint-disable unused-imports/no-unused-vars */
import { TableRowsOutlined, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { InformePlacasAutomotrizSP, tipoDato } from "../Interfaces/InformePlacasAutomotrizSP";
import { AutomotrizJigSliceRequest } from "../reducers/AutomotrizJigSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { GraficoPruebasPlacaModal } from "../modals/GraficoPruebasPlacaModal";
import { TablaDeAGSModal } from "../modals/TablaDeAGSModal";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IModelo } from "app/models/IModelo";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { IPlant, IProducto } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";
import _ from "lodash";
import { TablaDeTesteosModal } from "../modals/TablaDeTesteosModal";
import { ExcelExport, ExcelExportColumn, ExcelExportColumnGroup } from "@progress/kendo-react-excel-export";
import { obtenerDatosReferencia } from "app/shared/helpers/AutomotrizObtenerDatosReferencia";

export const InformePlacasAutomotriz = () => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const buttonClases = MaterialButtons();

  const _exporter = useRef<ExcelExport>(null);

  const [dataParaExcel, setDataParaExcel] = useState([]);

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | number>(0);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string | number>("");
  const [lineaSeleccionada, setLineaSeleccionada] = useState<string | number>(0);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [error, setError] = useState(false);

  const [openModalExaminar, setOpenModalExaminar] = useState(false);
  const [openModalVerTabla, setOpenModalVerTabla] = useState(false);
  const [openModalTablaTesteos, setOpenModalTablaTesteos] = useState(false);

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setPlantas, false);

  const [listaLineas, setListaLineas] = useState<ILineaProduccion[]>([]);
  FetchApi<ILineaProduccion[]>(
    LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId,
    { plantaId: plantaSeleccionada, productoId: productoSeleccionado },
    true,
    productoSeleccionado,
    setListaLineas
  );

  const [listaModelos, setListaModelos] = useState<IModelo[]>([]);
  FetchApi<IModelo[]>(ModeloSliceRequest.getAllByFamiliaId, 1134, false, productoSeleccionado, setListaModelos, true);

  const [listaProductos, setListaProductos] = useState<IProducto[]>([]);
  const getProducts = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantaSeleccionada as number))
      );
      const productsGroup = _.groupBy(response, "productoId");
      const key = Object.keys(productsGroup);
      if (key) {
        const productosSinKeys = key.map((k) => {
          return productsGroup[k][0].producto;
        });
        setListaProductos(productosSinKeys);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaPruebas, setListaPruebas] = useState<InformePlacasAutomotrizSP[]>([]);
  const getInformeAutomotriz = async () => {
    try {
      if (!error) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(
          await dispatch(
            AutomotrizJigSliceRequest.GetPlatesByLineAndFromAndUntil({
              fechaDesde: fechaDesde,
              fechaHasta: fechaHasta,
              lineaId: lineaSeleccionada,
              nameModelo: modeloSeleccionado as string
            })
          )
        );
        if (response) {
          setListaPruebas(response);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const verificarEstado = (row: InformePlacasAutomotrizSP) => {
    if (row.estado) {
      return <p className="text-green-500 text-lg inline-block">GOOD</p>;
    } else {
      return <p className="text-red-500 text-lg inline-block">NO GOOD</p>;
    }
  };

  const [placaSeleccionada, setPlacaSeleccionada] = useState<InformePlacasAutomotrizSP>();
  const handleExaminarModal = (row: InformePlacasAutomotrizSP, opcionModal: string) => {
    console.log(opcionModal);
    const parseDataTesteo: tipoDato = JSON.parse(row.testeo);
    const parseDataReferncia: tipoDato = JSON.parse(row.medicionReferencia);
    const parseDataMargenError: tipoDato = JSON.parse(row.margenError);
    const rowFormateada = {
      ...row,
      testeo: JSON.parse(row.testeo),
      dataParseada: parseDataTesteo,
      dataParseadaReferencia: parseDataReferncia,
      dataParsedMargenError: parseDataMargenError
    };
    setPlacaSeleccionada(rowFormateada);
    if (opcionModal == "grafico") {
      setOpenModalExaminar(true);
    }
    if (opcionModal == "tabla") {
      setOpenModalVerTabla(true);
    }
    if (opcionModal == "testeo") {
      setOpenModalTablaTesteos(true);
    }
  };

  const handleExportarExcel = () => {
    if (_exporter.current) {
      // Opcional: Podrías hacer validaciones aquí antes de descargar
      _exporter.current.save();
    }
  };

  useEffect(() => {
    if (modeloSeleccionado !== "YAZAKI") {
      return;
    }
    const dataParaExcel = listaPruebas.map((item) => ({
      codigo: item.codigo,
      linea: item.linea,
      modelo: item.modelo,
      proveedor: item.proveedor,
      estado: item.estado === true ? "Aprobado" : "Rechazado",
      fecha: new Date(item.fecha).toLocaleString("es-AR"),
      rated_input_voltage: obtenerDatosReferencia(JSON.parse(item.testeo), 3, 0),
      rated_input_current: obtenerDatosReferencia(JSON.parse(item.testeo), 3, 1),
      rated_output_voltage: obtenerDatosReferencia(JSON.parse(item.testeo), 3, 2),
      rated_output_current: obtenerDatosReferencia(JSON.parse(item.testeo), 3, 3),
      minium_input_voltage: obtenerDatosReferencia(JSON.parse(item.testeo), 4, 0),
      minium_input_current: obtenerDatosReferencia(JSON.parse(item.testeo), 4, 1),
      minium_output_voltage: obtenerDatosReferencia(JSON.parse(item.testeo), 4, 2),
      minium_output_current: obtenerDatosReferencia(JSON.parse(item.testeo), 4, 3),
      minium_efficiency: obtenerDatosReferencia(JSON.parse(item.testeo), 4, 4),
      maxium_input_voltage: obtenerDatosReferencia(JSON.parse(item.testeo), 5, 0),
      maxium_input_current: obtenerDatosReferencia(JSON.parse(item.testeo), 5, 1),
      maxium_output_voltage: obtenerDatosReferencia(JSON.parse(item.testeo), 5, 2),
      maxium_output_current: obtenerDatosReferencia(JSON.parse(item.testeo), 5, 3),
      maxium_efficiency: obtenerDatosReferencia(JSON.parse(item.testeo), 5, 4)
    }));
    setDataParaExcel(dataParaExcel);
  }, [listaPruebas]);

  useEffect(() => {
    if (fechaDesde || fechaHasta) {
      getInformeAutomotriz();
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    TitleChanger("Informe Placas Automotriz");
  }, []);

  useEffect(() => {
    if (plantaSeleccionada) {
      getProducts();
    }
  }, [plantaSeleccionada]);

  return (
    <main className="flex flex-col items-center my-4 px-4">
      <header className="w-full mt-6 bg-secondaryNew p-5 shadow-md flex flex-col rounded-md items-center">
        <div className="flex flex-row w-full item-center gap-x-4">
          <SelectComponent
            listaObjetos={plantas}
            nameSelect="planta"
            inputLabel="Seleccione una planta"
            valueLabel={(value) => value.name}
            valueSelect={(value) => value.id}
            valueKey={(value) => value}
            control={control}
            varianteEstilo="standard"
            ValueSave={setPlantaSeleccionada}
          />
          <SelectComponent
            listaObjetos={listaProductos}
            nameSelect="producto"
            inputLabel="Seleccione un producto"
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            valueKey={(value) => value}
            control={control}
            varianteEstilo="standard"
            ValueSave={setProductoSeleccionado}
          />
          {listaLineas && (
            <>
              <SelectComponent
                listaObjetos={listaLineas}
                nameSelect="lineaProduccion"
                inputLabel="Seleccione una linea"
                valueLabel={(value) => value.nombre}
                valueSelect={(value) => value.id}
                valueKey={(value) => value}
                control={control}
                varianteEstilo="standard"
                ValueSave={setLineaSeleccionada}
              />
              <SelectComponent
                listaObjetos={listaModelos}
                nameSelect="modelo"
                inputLabel="Seleccione un modelo"
                valueLabel={(value) => value.nombre}
                valueSelect={(value) => value.nombre}
                valueKey={(value) => value}
                control={control}
                varianteEstilo="standard"
                ValueSave={setModeloSeleccionado}
              />
            </>
          )}
        </div>
        <div className="mt-4">
          {modeloSeleccionado !== "" && (
            <div className="w-full">
              <SelectOfDate
                estilosPredeterminados
                fechaDesdeHasta
                setFechaDesdeProps={setFechaDesde}
                setFechaHastaProps={setFechaHasta}
                setErrorProps={setError}
              />
            </div>
          )}
        </div>
      </header>
      {listaPruebas && listaPruebas.length > 0 && (
        <section className="w-full mt-4 ">
          <ExcelExport data={dataParaExcel} ref={_exporter} fileName="Reporte_Pruebas.xlsx">
            <ExcelExportColumn field="codigo" title="Código" width={100} />
            <ExcelExportColumn field="linea" title="Línea" width={100} />
            <ExcelExportColumn field="modelo" title="Modelo" width={150} />
            <ExcelExportColumn field="proveedor" title="Proveedor" width={200} />
            <ExcelExportColumn field="estado" title="Estado" width={100} />
            <ExcelExportColumn field="fecha" title="Fecha de Registro" width={200} />
            <ExcelExportColumnGroup title="Rated Voltage Test" headerCellOptions={{ textAlign: "center" }}>
              <ExcelExportColumn field="rated_input_voltage" title="Input Voltage" width={200} />
              <ExcelExportColumn field="rated_input_current" title="Input Current" width={200} />
              <ExcelExportColumn field="rated_output_voltage" title="Output Voltage" width={200} />
              <ExcelExportColumn field="rated_output_current" title="Output Current" width={200} />
            </ExcelExportColumnGroup>
            <ExcelExportColumnGroup title="Minium Voltage Test" headerCellOptions={{ textAlign: "center" }}>
              <ExcelExportColumn field="minium_input_voltage" title="Input Voltage" width={200} />
              <ExcelExportColumn field="minium_input_current" title="Input Current" width={200} />
              <ExcelExportColumn field="minium_output_voltage" title="Output Voltage" width={200} />
              <ExcelExportColumn field="minium_output_current" title="Output Current" width={200} />
              <ExcelExportColumn field="minium_efficiency" title="Efficiency" width={200} />
            </ExcelExportColumnGroup>
            <ExcelExportColumnGroup title="Maxium Voltage Test" headerCellOptions={{ textAlign: "center" }}>
              <ExcelExportColumn field="maxium_input_voltage" title="Input Voltage" width={200} />
              <ExcelExportColumn field="maxium_input_current" title="Input Current" width={200} />
              <ExcelExportColumn field="maxium_output_voltage" title="Output Voltage" width={200} />
              <ExcelExportColumn field="maxium_output_current" title="Output Current" width={200} />
              <ExcelExportColumn field="maxium_efficiency" title="Efficiency" width={200} />
            </ExcelExportColumnGroup>
          </ExcelExport>
          <TableComponent
            IDcolumn="placaId"
            dataInfo={listaPruebas}
            buscar
            excel={modeloSeleccionado === "YAZAKI"}
            onExportExcel={handleExportarExcel}
            columns={[
              {
                title: "Codigo",
                field: "codigo"
              },
              {
                title: "Linea",
                field: "linea"
              },
              {
                title: "Modelo",
                field: "modelo"
              },
              {
                title: "Proveedor",
                field: "proveedor"
              },
              {
                title: "Estado",
                field: "",
                render: (row) => verificarEstado(row)
              },
              {
                title: "Fecha",
                field: "fecha",
                render: (row) => {
                  const fecha = new Date(row.fecha);
                  const formattedDate = `${String(fecha.getDate()).padStart(2, "0")}/${String(
                    fecha.getMonth() + 1
                  ).padStart(2, "0")}/${fecha.getFullYear()} ${String(fecha.getHours()).padStart(2, "0")}:${String(
                    fecha.getMinutes()
                  ).padStart(2, "0")}:${String(fecha.getSeconds()).padStart(2, "0")}`;
                  return <span>{formattedDate}</span>;
                }
              },
              {
                title: "Acciones",
                field: "",
                render: (row) => {
                  return (
                    <div className="flex flex-row items-center">
                      {modeloSeleccionado !== "YAZAKI" && (
                        <div>
                          <Tooltip title="Examinar Grafico">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  handleExaminarModal(row, "grafico");
                                }}
                                style={{ position: "relative" }}>
                                <Visibility color="primary" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                      )}
                      <div>
                        <Tooltip title="Examinar Datos Entrada y Salida">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => {
                                handleExaminarModal(row, modeloSeleccionado !== "YAZAKI" ? "tabla" : "testeo");
                              }}
                              style={{ position: "relative" }}>
                              <TableRowsOutlined color="secondary" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  );
                }
              }
            ]}
          />
        </section>
      )}
      <ModalCompoment setOpenPopup={setOpenModalExaminar} openPopup={openModalExaminar} title="Ganancia vs Frecuencia">
        <GraficoPruebasPlacaModal
          openModal={openModalExaminar}
          placaSeleccionada={placaSeleccionada}
          setOpenModal={setOpenModalExaminar}
        />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalVerTabla} openPopup={openModalVerTabla} title="Tabla AGC">
        <TablaDeAGSModal
          openModal={openModalVerTabla}
          setOpenModal={setOpenModalVerTabla}
          placaSeleccionada={placaSeleccionada}
        />
      </ModalCompoment>
      <ModalCompoment
        showModalCenterPage
        setOpenPopup={setOpenModalTablaTesteos}
        openPopup={openModalTablaTesteos}
        title="Tabla de Testeos">
        <TablaDeTesteosModal
          openModal={openModalTablaTesteos}
          setOpenModal={setOpenModalTablaTesteos}
          placaSeleccionada={placaSeleccionada}
        />
      </ModalCompoment>
    </main>
  );
};
