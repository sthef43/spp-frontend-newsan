import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Tooltip } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { XXE_WIP_OTSliceRequests } from "app/Middleware/reducers/XXE_WIP_OTSlice";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BarChartIcon from "@mui/icons-material/BarChart";
import { CardProdDobladora } from "./CardProdDobladora";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { TableProdDobladora } from "./TableProdDobladora";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { DobProdDeclaracionSliceRequests } from "app/Middleware/reducers/DobProdDeclaracionSlice";
import { IDobProdDeclaracion } from "app/models/IDobProdDeclaracion";
import { useRef } from "react";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import moment from "moment";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface initialState {
  codigoInicio: number; // representa la linea.
  fecha: Date | null;
  turno: string;
  turnoRadioButton: string;
  planta: number;
}

export const ProduccionDobladora = (): JSX.Element => {
  const { control, watch, setValue } = useForm();
  const exportarExcelMovs = useRef<ExcelExport>(null);
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();

  const valueFilterSemi: string = watch("valueFilterSemi");
  const tipoEquipos = [
    {
      tipo: "I",
      value: "I"
    },
    {
      tipo: "E",
      value: "E"
    }
  ];

  const [datosExcel, setDatosExcel] = useState([]);
  const [flagExport, setFlagExport] = useState(false);
  const [listaFamilias, setListaFamilias] = useState([]);
  const [familiasFiltradas, setFamiliasFiltradas] = useState([]);
  const [familiaSelected, setFamiliaSelected] = useState(null);
  const [tipoEquipo, setTipoEquipo] = useState(null);
  const [listaOps, setListaOps] = useState([]);
  const [declararProd, setDeclararProd] = useState(false);
  const [listaDeclaraciones, setListaDeclaraciones] = useState([]);

  const getFamiliasDispo = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result = [];
    try {
      result = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.GetFamiliasDisponibles()));
      console.log("familias", result);
      setListaFamilias(result);
    } catch (err) {
      openNotificationUI("Ocurrio un error al traer las familias", "error");
    }
    if (result) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const filterFamilias = () => {
    const familias = listaFamilias.filter((familia) => familia.charAt(0).includes(tipoEquipo));
    console.log("familias filtered", familias);
    setFamiliasFiltradas(familias);
  };

  const getOpsByFamilia = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result = [];
    try {
      result = unwrapResult(await dispatch(XXE_WIP_OTSliceRequests.GetOpDobladoraByFamilia(familiaSelected)));
      console.log("ops", result);
      setListaOps(result);
    } catch (err) {
      openNotificationUI("Ocurrio un error al traer las ops", "error");
    }
    if (result) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getListaDeclaraciones = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let result = [];
    try {
      result = unwrapResult(await dispatch(DobProdDeclaracionSliceRequests.getAllRequest()));
    } catch (err) {
      console.error(err);
    }
    if (result) {
      console.log("declaraciones", result);
      setListaDeclaraciones([...result]);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const opsFiltradas = useMemo(() => {
    if (!valueFilterSemi || valueFilterSemi.trim() === "") {
      return listaOps;
    }

    return listaOps.filter((op: IXXE_WIP_OT) =>
      op.segmenT1?.toLowerCase().includes(valueFilterSemi.toString().toLowerCase())
    );
  }, [listaOps, valueFilterSemi]);

  const declaracionesFiltradas = useMemo(() => {
    if (!valueFilterSemi || valueFilterSemi.trim() === "") {
      return listaDeclaraciones;
    }

    return listaDeclaraciones.filter((dec: IDobProdDeclaracion) =>
      dec.semielaborado?.toLowerCase().includes(valueFilterSemi.toString().toLowerCase())
    );
  }, [listaDeclaraciones, valueFilterSemi]);

  const onExport = () => {
    const declaracionesExcel = listaDeclaraciones.flatMap((declaracion: IDobProdDeclaracion) => {
      return declaracion.movimientos.map((mov) => ({
        fecha: moment(declaracion.fecha).format("DD/MM/YYYY"),
        OP: declaracion.op,
        Semielaborado: declaracion.semielaborado,
        totalDeclarado: declaracion.totalDeclarado,
        familia: declaracion.familia,
        descripcion: declaracion.descripcion,
        fechaMovimiento: moment(mov.fecha).format("DD/MM/YYYY"),
        horaMovimiento: moment(mov.fecha).format("HH:mm"),
        maquinaMovimiento: mov.nombreMaquina,
        produccionDeclarada: mov.cantDeclarada
      }));
    });

    setDatosExcel(declaracionesExcel);
    setFlagExport(true);
  };

  useEffect(() => {
    TitleChanger("PRODUCCIÓN DOBLADORA");
    getFamiliasDispo();
    getListaDeclaraciones();
  }, []);

  useEffect(() => {
    filterFamilias();
  }, [tipoEquipo]);

  useEffect(() => {
    getOpsByFamilia();
  }, [familiaSelected]);

  useEffect(() => {
    console.log("buscando semi", valueFilterSemi);
  }, [valueFilterSemi]);

  useEffect(() => {
    if (flagExport && datosExcel.length > 0 && exportarExcelMovs.current) {
      exportarExcelMovs.current.save();
      setFlagExport(false);
      setDatosExcel([]);
    }
  }, [datosExcel, flagExport]);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <div className="px-3 tw-pt-3  flex flex-col w-full gap-5">
        <div className="my-3 flex flex-col w-full">
          <p className="font-semibold text-2xl text-[#3F3D56]">Produccion de Caños</p>
          <p className="font-normal text-base text-[#3F3D56]">
            Administra y consulta el historial de producción de caños
          </p>
        </div>

        <div className="w-full flex flex-row gap-5">
          <div className="w-[60%] h-16 flex flex-row justify-between pl-7 pr-11 bg-white items-center border-[#EAEFF4] rounded ">
            <div>
              <p className="text-[#777A79] text-base font-medium">Planta</p>
              <p className="text-[#00355F] text-base font-semibold">P6</p>
            </div>
            <div>
              <p className="text-[#777A79] text-base font-medium">Producto</p>
              <p className="text-[#00355F] text-base font-semibold">Aire Acondicionado</p>
            </div>
            <div>
              <p className="text-[#777A79] text-base font-medium">Línea</p>
              <p className="text-[#00355F] text-base font-semibold">Dobladora</p>
            </div>
          </div>
          <div className="flex flex-row items-center w-[55%] gap-6">
            <SelectComponent
              listaObjetos={tipoEquipos}
              inputLabel="Tipo de equipo"
              valueSelect={(value) => value.value}
              control={control}
              ValueSave={setTipoEquipo}
              nameSelect="tipoEquipo"
              varianteEstilo="filled"
              valueKey={(value) => value}
              estilosPersonalizados={{
                backgroundColor: "#fff"
              }}
              valueLabel={(value) => value.tipo}
            />
            <SelectComponent
              listaObjetos={familiasFiltradas}
              inputLabel="Seleccione una familia"
              valueSelect={(value) => value}
              varianteEstilo="filled"
              control={control}
              ValueSave={setFamiliaSelected}
              disabled={tipoEquipo === null}
              valueLabel={(value) => value}
              nameSelect="familiaSelect"
              valueKey={(value) => value}
              estilosPersonalizados={{
                backgroundColor: "#fff"
              }}
            />
          </div>
        </div>

        <div className="w-full flex flex-row gap-6">
          <div className="w-3/5 bg-white">
            <TextFieldComponent
              control={control}
              index={0}
              labelInput="Buscar por semielaborado"
              valueDefault=""
              nameInput="valueFilterSemi"
            />
          </div>
          <div className="w-2/5 flex flex-row justify-between items-center">
            {declararProd ? (
              <div className="w-full flex flex-row justify-end">
                <Button
                  sx={{ width: "58%", height: "30px" }}
                  className={buttonClases.blueButton}
                  aria-label="declarar producción"
                  onClick={() => setDeclararProd(!declararProd)}>
                  {declararProd ? "VER HISTORIAL" : "DECLARAR"}
                </Button>
              </div>
            ) : (
              <>
                <div className="w-2/5 flex flex-row justify-end gap-5">
                  <Tooltip title="Descargar reporte" arrow placement="top">
                    <Button
                      sx={{ width: "20px", height: "30px" }}
                      className={buttonClases.greenButton}
                      onClick={onExport}
                      aria-label="descargar reporte">
                      <ArrowDownwardIcon />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Ver graficos" arrow placement="top">
                    <Button
                      sx={{ width: "20px", height: "30px" }}
                      className={buttonClases.blueButton}
                      aria-label="ver reporte">
                      <BarChartIcon />
                    </Button>
                  </Tooltip>
                </div>

                <Button
                  sx={{ width: "58%", height: "30px" }}
                  className={buttonClases.blueButton}
                  aria-label="declarar producción"
                  onClick={() => setDeclararProd(!declararProd)}>
                  {declararProd ? "VER HISTORIAL" : "DECLARAR"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 pt-3 w-full flex justify-center">
        {declararProd ? (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {opsFiltradas.map((op: IXXE_WIP_OT) => {
              return (
                <CardProdDobladora
                  data={op}
                  declaraciones={listaDeclaraciones}
                  key={op.wiP_ENTITY_NAME}
                  familiaSelected={familiaSelected}
                  onRefreshDeclaraciones={getListaDeclaraciones}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full">
            <TableProdDobladora key={declaracionesFiltradas.length} data={declaracionesFiltradas} />
          </div>
        )}
      </div>
      <>
        <ExcelExport
          data={datosExcel}
          ref={exportarExcelMovs}
          fileName={`Reporte_Dobladora_Movs_${moment().format("DD-MM-YYYY_HH-mm")}.xlsx`}>
          <ExcelExportColumn field="fecha" title="Fecha" />
          <ExcelExportColumn field="OP" title="Nro OP" />
          <ExcelExportColumn field="Semielaborado" title="Semielaborado" />
          <ExcelExportColumn field="totalDeclarado" title="Total Declarado" />
          <ExcelExportColumn field="familia" title="Familia" />
          <ExcelExportColumn field="descripcion" title="Descripcion" />
          <ExcelExportColumn field="fechaMovimiento" title="Fecha Declaracion" />
          <ExcelExportColumn field="horaMovimiento" title="Hora Declaracion" />
          <ExcelExportColumn field="maquinaMovimiento" title="Maquina utilizada" />
          <ExcelExportColumn field="produccionDeclarada" title="Cantidad declarada" />
        </ExcelExport>
      </>
    </ContainerForPages>
  );
};
