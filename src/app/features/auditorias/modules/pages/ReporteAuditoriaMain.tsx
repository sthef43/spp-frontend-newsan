/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Controller, useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IPlant } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { IAuditHistorico } from "app/models/IAuditHistorico";
import { AuditoriasHistoricoSliceRequest } from "../../slices/AuditoriasHistoricoSlice";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { PersonAddAlt1Rounded, ThumbDownAltRounded, Visibility } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AsignarSeguimiento } from "../modals/reporteAuditoria/AsignarSeguimiento";
import { IAuditoriasHistorico } from "../../models/IAuditoriasHistorico";
import { DarBajaAuditoria } from "../modals/reporteAuditoria/DarBajaAuditoria";
import { TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export const ReporteAuditoriaMain: React.FC = () => {
  const { control } = useForm();

  const history = useHistory();
  const fechaActual = dayjs().toDate();

  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { TitleChanger } = useTitleOfApp();

  const [openModalSeguimiento, setOpenModalSeguimiento] = useState<boolean>(false);
  const [openModalDarBaja, setOpenModalDarBaja] = useState<boolean>(false);

  const [activeFetchListaAuditoria, setActiveFetchListaAuditoria] = useState<boolean>(false);
  const [activeFetchAuditId, setActiveFetchAuditId] = useState<boolean>(false);

  const [listaPlantas, setListaPLantas] = useState<IPlant[]>([]);
  const [listaAuditorias, setListaAuditorias] = useState<IAuditHistorico[]>([]);
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<IAuditoriasHistorico>();
  const [auditoriaProp, setAuditoriaProp] = useState<IAuditoriasHistorico>();

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);

  //STATE PARA GUARDAR EL MES DE INICIO SELECCIONADO
  const [fechaSeleccionadaSelect, setFechaSeleccionadaSelect] = useState("");

  //STATE PARA GUARDAR EL MES DE FIN SELECCIONADO
  const [fechaFinSeleccionadaSelect, setFechaFinSeleccionadaSelect] = useState("");

  FetchApi(PlantSliceRequests.getAllRequest, null, false, null, setListaPLantas, false, false, false);

  const isValido = plantaSeleccionada && fechaSeleccionadaSelect && fechaFinSeleccionadaSelect;

  const activadorDinamico = isValido
    ? `${plantaSeleccionada}-${fechaSeleccionadaSelect}-${fechaFinSeleccionadaSelect}`
    : null;

  FetchApi<IAuditHistorico[]>(
    AuditoriasHistoricoSliceRequest.GetAllAuditsByPlantId,
    { plantaId: plantaSeleccionada, fechaDesde: fechaSeleccionadaSelect, fechaHasta: fechaFinSeleccionadaSelect },
    false,
    activadorDinamico,
    setListaAuditorias,
    true,
    false,
    false,
    () => {
      setActiveFetchListaAuditoria(false);
    }
  );

  FetchApi<IAuditoriasHistorico>(
    AuditoriasHistoricoSliceRequest.GetAuditById,
    auditoriaSeleccionada?.id,
    false,
    activeFetchAuditId,
    setAuditoriaProp,
    true,
    false,
    false,
    () => {
      setActiveFetchAuditId(false);
      setOpenModalSeguimiento(true);
    }
  );

  const handleMesChange = (e) => {
    const fechaFormateada = dayjs(e).format("YYYY-MM-DD");
    setFechaSeleccionadaSelect(fechaFormateada);
  };

  const handelMesFinChange = (e) => {
    const fechaFormateada = dayjs(e).format("YYYY-MM-DD");
    setFechaFinSeleccionadaSelect(fechaFormateada);
  };

  useEffect(() => {
    TitleChanger("Reporte de Auditoria");
  }, []);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <h2 className="text-3xl font-semibold">Reporte de Auditoria</h2>
      <div className="flex flex-row w-full justify-between mt-6 gap-x-10">
        <div className="w-1/2">
          <SelectComponent
            control={control}
            inputLabel="Seleccionar Planta"
            listaObjetos={listaPlantas}
            nameSelect="planta"
            valueKey={(value) => value}
            valueLabel={(value) => value.name}
            valueSelect={(value) => value.id}
            ValueSave={(value) => {
              setPlantaSeleccionada(value);
              setActiveFetchListaAuditoria(true);
            }}
          />
        </div>
        <div className="w-1/2 flex flex-row items-center gap-x-4">
          <div className="w-full">
            <Controller
              name="mes"
              control={control}
              render={({ field }) => (
                <DesktopDatePicker
                  label="Seleccione el mes de inicio"
                  views={["year", "month", "day"]}
                  value={fechaSeleccionadaSelect}
                  inputFormat="YYYY/MMMM/DD"
                  maxDate={fechaActual}
                  renderInput={(field) => <TextField {...field} variant="outlined" fullWidth />}
                  onChange={handleMesChange}
                />
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="mes"
              control={control}
              render={({ field }) => (
                <DesktopDatePicker
                  label="Seleccione el mes fin"
                  views={["year", "month", "day"]}
                  value={fechaFinSeleccionadaSelect}
                  inputFormat="YYYY/MMMM/DD"
                  maxDate={fechaActual}
                  renderInput={(field) => <TextField {...field} variant="outlined" fullWidth />}
                  onChange={handelMesFinChange}
                />
              )}
            />
          </div>
        </div>
      </div>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          IDcolumn="id"
          buscar
          Dense
          rowStyle={(value: IAuditoriasHistorico) => {
            return value.estadoAuditoria ? "" : { backgroundColor: "#FF625B" };
          }}
          dataInfo={listaAuditorias}
          columns={[
            {
              title: "Nombre",
              field: "nombre"
            },
            {
              title: "Num.Registo",
              field: "numeroRegistro"
            },
            {
              title: "Fecha",
              field: "",
              render: (value: IAuditoriasHistorico) =>
                formatDateHourOrMinutes({
                  optionDate: "onlyDate",
                  optionHour: "fechaBaseDatos",
                  fechaIngresada: value.createdDate
                })
            },
            {
              title: "Plant",
              field: "plant.name"
            },
            {
              title: "Turno",
              field: "turno.nombre"
            },
            {
              title: "Auditor",
              field: "",
              render: (value: IAuditoriasHistorico) => (
                <p>
                  {value.operator.name} {value.operator.surname}
                </p>
              )
            },
            {
              title: "Responsable Baja",
              field: ""
            },
            {
              title: "Razon Baja",
              field: ""
            },
            {
              title: "Fecha Baja",
              field: ""
            },
            {
              title: "Estado",
              field: "",
              render: (value: IAuditoriasHistorico) => {
                return <p>{value.estadoAuditoria ? "Activo" : "Dada de Baja"}</p>;
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (value: IAuditoriasHistorico) => {
                return (
                  <div className="flex flex-row gap-x-1">
                    <TooltipComponent
                      onClick={() => {
                        setAuditoriaSeleccionada(value);
                        setActiveFetchAuditId(true);
                      }}
                      componenteIcono={<PersonAddAlt1Rounded color="primary" />}
                      typeTooltip="normal"
                      titleTooltip="Agregar Responsable"
                    />
                    <TooltipComponent
                      componenteIcono={<Visibility color="primary" />}
                      typeTooltip="normal"
                      titleTooltip="Ver Auditoria"
                      onClick={() => history.push(`/main/auditorias-v2/examinar-auditoria/${value.id}/examinar`)}
                    />
                    {value.estadoAuditoria && (
                      <TooltipComponent
                        onClick={() => {
                          setAuditoriaProp(value);
                          setOpenModalDarBaja(true);
                        }}
                        componenteIcono={<ThumbDownAltRounded color="error" />}
                        typeTooltip="normal"
                        titleTooltip="Dar de Baja la Auditoria"
                      />
                    )}
                  </div>
                );
              }
            }
          ]}
        />
        <ModalCompoment
          setOpenPopup={setOpenModalSeguimiento}
          openPopup={openModalSeguimiento}
          showModalCenterPage
          titleModalStyle="Audit"
          subTitle="Asignar a una responsable para el seguimiento de la auditoria"
          title="Asignar seguimiento a la auditoria">
          <AsignarSeguimiento
            openModal={openModalSeguimiento}
            setOpenModal={setOpenModalSeguimiento}
            auditoriaSeleccionada={auditoriaProp}
          />
        </ModalCompoment>
        <ModalCompoment
          setOpenPopup={setOpenModalDarBaja}
          openPopup={openModalDarBaja}
          showModalCenterPage
          titleModalStyle="Audit"
          subTitle="Dar de baja la auditoria asignando una persona responsable"
          title="Dar de baja la auditoria">
          <DarBajaAuditoria
            setOpenModal={setOpenModalDarBaja}
            auditoriaSeleccionada={auditoriaProp}
            setActiveFetch={setActiveFetchListaAuditoria}
          />
        </ModalCompoment>
      </ContainerForPages>
    </ContainerForPages>
  );
};
