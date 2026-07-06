/* eslint-disable unused-imports/no-unused-vars */
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { RemoveRedEye } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { IControlLote, ILinea, IPlant } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { ReprocesosAprobadosRechazadosDTO } from "app/models/DTO/ReprocesosAbradosRechazadosDTO";
import { AccionAprobacionReprocesos } from "../Components/AccionAprobacionReprocesos";

export const AprobacionReprocesos = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const { TitleChanger } = useTitleOfApp();
  const [lineas, setLineas] = useState<ILinea[]>([]);
  const [dataOpen, setDataOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lineaModeloProp, setLineaModeloProp] = useState(null);
  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);

  const { control, watch, setValue } = useForm();

  const [lineaSeleccionada, setLineaSeleccionada] = useState<string | number>(null);
  const [controlLoteSelected, setControlLoteSelected] = useState<IControlLote>();
  const [reprocesosCantidad, setReprocesosCantidad] = useState<ReprocesosAprobadosRechazadosDTO>({
    reprocesoRechazados: 0,
    reprocesosAprobados: 0
  });

  const watchPlant = watch("plantId");

  const getLineasByPlantId = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const fetchResult = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlant)));
      if (fetchResult) {
        setLineas(fetchResult);
      }
    } catch (error) {
      setLineas(null);
      openNotificationUI("Se genero un error buscando las lineas", "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const getControlLotes = async () => {
    if ((lineaSeleccionada as number) > 0) {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const fetchResult = unwrapResult(
          await dispatch(ControlLoteSliceRequests.GetAllByLineaIdAndStateReprocesingIsS(lineaSeleccionada as number))
        );
        const reprocesos = unwrapResult(
          await dispatch(ControlLoteSliceRequests.ReproessingApprovedAndRejected(lineaSeleccionada as number))
        );
        if (fetchResult) {
          const clonObjetoFetch = fetchResult.filter((elementos) => {
            if (elementos.numeroOp && elementos.numeroOp) {
              return elementos;
            }
          });
          setReprocesosCantidad(reprocesos);
          setDataOpen(clonObjetoFetch);
        }
      } catch (e) {
        console.log(e);
        setDataOpen([]);
        openNotificationUI("Ocurrio un error intentando obtener los reprocesos", "error");
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  const mostrarAccion = (row: IControlLote) => {
    const aux = row.reprocesoLinea.some((elementos) => elementos.estadoReproceso === null);
    return aux;
  };

  // ---------------TITULO---------
  React.useEffect(() => {
    TitleChanger("Aprobacion Reprocesos");
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);

  useEffect(() => {
    if (lineaSeleccionada) {
      const buscarLineaSeleccionada = lineas.find((x) => x.idLinea == lineaSeleccionada);
      setLineaModeloProp({ linea: buscarLineaSeleccionada.descripcion, modelo: "" });
      getControlLotes();
    }
  }, [lineaSeleccionada]);

  useEffect(() => {
    if (watchPlant && watchPlant > 0) {
      getLineasByPlantId();
    }
  }, [watchPlant]);

  return (
    <div className="p-4">
      <div className="p-4 my-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="sm:flex md:flex items-center justify-around w-full font-semibold gap-x-4">
          {plantas && (
            <div className="w-full">
              <FormControl fullWidth variant="standard">
                <InputLabel>Planta</InputLabel>
                <Select
                  onChange={(e) => {
                    setValue("plantId", parseInt(e.target.value.toString()));
                  }}>
                  {plantas &&
                    plantas.map((plant) => (
                      <MenuItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          )}
          <>
            <SelectComponent
              inputLabel="Seleccione una línea."
              listaObjetos={lineas}
              nameSelect="linea"
              valueLabel={(value) => value.descripcion}
              valueSelect={(value) => value.idLinea}
              control={control}
              varianteEstilo="standard"
              valueKey={(value) => value}
              ValueSave={setLineaSeleccionada}
            />
          </>
        </div>
      </div>
      {dataOpen && (
        <div className="flex flex-col items-start w-full">
          <div>
            <p className="mt-4 text-2xl">A LA FECHA DE HOY</p>
          </div>
          {reprocesosCantidad && (
            <div className="flex flex-row gap-x-4">
              <TitleUIComponent
                title={`RECHAZADOS: ${
                  reprocesosCantidad.reprocesoRechazados !== null ? reprocesosCantidad.reprocesoRechazados : 0
                }`}
                classNameDiv="w-min whitespace-nowrap py-1 px-[8rem] mt-4"
                classNameTitle="text-2xl"
              />
              <TitleUIComponent
                title={`REPROCESADOS: ${
                  reprocesosCantidad.reprocesosAprobados !== null ? reprocesosCantidad.reprocesosAprobados : 0
                }`}
                classNameDiv="w-min whitespace-nowrap py-1 px-[8rem] mt-4"
                classNameTitle="text-2xl"
              />
            </div>
          )}
        </div>
      )}
      {dataOpen && (
        <TableComponent
          IDcolumn={"idControlLote"}
          buscar={true}
          columns={[
            {
              title: "Modelo",
              field: "codigoModelo"
            },
            {
              title: "OP",
              field: "numeroOp"
            },
            {
              title: "Lote",
              field: "lote"
            },
            {
              title: "Desde",
              field: "serieDesde"
            },
            {
              title: "Hasta",
              field: "serieHasta"
            },
            {
              title: "Rechazados",
              field: "cantidadRechazos"
            },
            {
              title: "Reprocesados",
              field: "cantidadReprocesos"
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      {mostrarAccion(row) && (
                        <Tooltip title="">
                          <IconButton
                            onClick={() => {
                              setControlLoteSelected(row);
                              setModalOpen(true);
                              setLineaModeloProp({
                                modelo: row.codigoModelo,
                                linea: lineaModeloProp.linea,
                                nombreSupervisor: row.nombreSupervisor
                              });
                            }}
                            size="small"
                            style={{ position: "relative" }}>
                            <RemoveRedEye fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              }
            }
          ]}
          dataInfo={dataOpen}
          Dense={true}
        />
      )}
      <ModalCompoment title="Equipos Reprocesados" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        {
          <AccionAprobacionReprocesos
            controlLoteSelected={controlLoteSelected}
            setOpenPopup={setModalOpen}
            getListByControlLoteId={getControlLotes}
            refreshList={getControlLotes}
            lineaModeloProp={lineaModeloProp}
          />
        }
      </ModalCompoment>
    </div>
  );
};
