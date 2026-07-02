import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { InputDatePicker } from "../../../../components/InputDatePicker";
import moment from "moment";
import { useDateRangeValidation } from "../../../../hooks/useDateRangeValidation";
import { useHistory, useRouteMatch } from "react-router";
import { SEH_Auditoria } from "../../../../interfaces/SEH_Auditoria";
import { sehAuditoriaSliceRequest } from "../../../../reducers/SEH_AuditoriaSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Delete, RemoveRedEye } from "@mui/icons-material";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IPlant } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { useForm } from "react-hook-form";

interface AuditExport {
  fecha: string;
  planta: string;
  linea: string;
  operario: string;
  dni: string;
  empresa: string;
  eppFaltantes: string;
  observacionAuditoria: string;
  auditor: string;
  fechaSancion: string;
  observacionSancion: string;
}

export const AuditoriasPage = () => {
  const { control } = useForm();

  const [auditorias, setAuditorias] = useState<SEH_Auditoria[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = useState<SEH_Auditoria[]>([]);
  const [dataToExport, setDataToExport] = useState<AuditExport[]>([]);
  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const excelExportRef = React.useRef(null);

  const [search, setSearch] = useState<string>("");

  const { TitleChanger } = useTitleOfApp();
  const buttonClases = MaterialButtons();
  const history = useHistory();
  const { path } = useRouteMatch();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(null);

  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setListaPlantas, false);

  const [desde, setDesde] = useState(moment().add(-1, "day").toDate());
  const [hasta, setHasta] = useState(moment().toDate());

  const { errors, isInvalid } = useDateRangeValidation(desde, hasta);

  const GetAuditoriasByDate = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const params = { planta: plantaSeleccionada as string, from: moment(desde).format(), to: moment(hasta).format() };
      const response = unwrapResult(await dispatch(sehAuditoriaSliceRequest.GetAllByDate(params)));
      setAuditorias(response);
    } catch (e) {
      let mensaje = "";
      if (typeof e == "string") mensaje = e;
      if (typeof e == "object") mensaje = "Ha Ocurrido un Error";
      openNotificationUI(mensaje, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onSearch = () => {
    try {
      console.log(`Buscar desde ${moment(desde).format()} hasta ${moment(hasta).format()}`);
      GetAuditoriasByDate();
    } catch (e) {
      console.log(e);
    }
  };

  const handleExport = () => {
    if (excelExportRef.current) {
      excelExportRef.current.save();
    }
  };

  const onAdd = () => {
    history.push(`${path}/detalles`, {
      mode: "create"
    });
  };

  const handleViewDetail = (id) => {
    history.push(`${path}/detalles/${id}`, {
      mode: "view"
    });
  };

  useEffect(() => {
    let tempAuditorias = auditorias;
    if (search == "") setFilteredAuditorias(auditorias);
    else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = auditorias.filter((audit) => {
        const personalName = `${audit.personal?.nombre || ""} ${audit.personal?.apellido || ""}`.toLowerCase();
        const auditorName = `${audit.auditor?.nombre || ""} ${audit.auditor?.apellido || ""}`.toLowerCase();
        return (
          audit.planta.toLowerCase().includes(lowercasedSearch) ||
          audit.linea.toLowerCase().includes(lowercasedSearch) ||
          audit.empresa.toLowerCase().includes(lowercasedSearch) ||
          audit.personalId.toString().includes(lowercasedSearch) ||
          personalName.includes(lowercasedSearch) ||
          auditorName.includes(lowercasedSearch)
        );
      });
      setFilteredAuditorias(filtered);
      tempAuditorias = filtered;
    }
    const dataToExport: AuditExport[] = tempAuditorias.map((audit) => ({
      fecha: moment(audit.createdDate).format("DD/MM/YYYY"),
      planta: audit.planta,
      linea: audit.linea,
      operario: `${audit.personal?.apellido} ${audit.personal?.nombre}`,
      dni: `${audit.personalId}`,
      empresa: audit.empresa,
      observacionAuditoria: audit.observaciones,
      eppFaltantes: audit.detalles.map((d) => d.epp?.nombre).join("-"),
      auditor: `${audit.auditor ? `${audit.auditor?.apellido} ${audit.auditor?.nombre}` : "Sin Informacion"}`,
      fechaSancion: audit.sancion ? moment(audit.sancion.fecha).format("DD/MM/YYYY") : "Sin Sancion",
      observacionSancion: audit.sancion ? audit.sancion.observacion : "Sin Sancion"
    }));
    setDataToExport(dataToExport);
  }, [search, auditorias]);

  useEffect(() => {
    if (desde && hasta) {
      GetAuditoriasByDate();
    }
  }, []);

  useEffect(() => {
    TitleChanger("Auditorias Personal");
  }, []);

  return (
    <div className="w-full h-full">
      <header className=" p-4 mx-3">
        <h3>Ver Historial de Auditorias de EPP</h3>
        <div className="w-full flex j items-center px-2 mt-4 gap-8">
          <div className="flex gap-8 w-full">
            <SelectComponent
              control={control}
              inputLabel="Planta"
              listaObjetos={listaPlantas}
              nameSelect="planta"
              valueLabel={(value) => value.name}
              valueSelect={(value) => value.name}
              ValueSave={setPlantaSeleccionada}
              valueKey={(value) => value}
              varianteEstilo="standard"
            />
            <InputDatePicker
              label="Desde"
              setDate={setDesde}
              defaultValue={desde}
              maxDate={hasta}
              error={errors.startDate.hasError}
              helperText={errors.startDate.message}
            />
            <InputDatePicker
              label="Hasta"
              setDate={setHasta}
              defaultValue={hasta}
              minDate={desde}
              error={errors.endDate.hasError}
              helperText={errors.endDate.message}
            />
          </div>
          <div className="flex gap-4 justify-end w-1/3">
            <Button
              onClick={onSearch}
              type="button"
              sx={{ width: "50%" }}
              disabled={isInvalid}
              className={buttonClases.blueButton}>
              Buscar
            </Button>
            <Button onClick={onAdd} type="button" sx={{ width: "50%" }} className={buttonClases.purpleButton}>
              Agregar
            </Button>
          </div>
        </div>
      </header>
      <div className="w-full px-4">
        <hr className="px-4 mt-4" />
      </div>
      <div className="p-4 mx-auto flex flex-col gap-2">
        <TextField
          className="w-full "
          style={{
            backgroundColor: "var(--background-color)"
          }}
          label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-row mt-2 w-full justify-start">
          <Button type="button" onClick={handleExport} className={buttonClases.greenButton}>
            Exportar
          </Button>
        </div>
      </div>
      <div className="w-full p-4">
        <ExcelExport
          data={dataToExport}
          ref={excelExportRef}
          fileName={`auditorias_${moment().format("YYYY-MM-DD")}.xlsx`}>
          <ExcelExportColumn title="Fecha" field="fecha" />
          <ExcelExportColumn title="Planta" field="planta" />
          <ExcelExportColumn title="Línea" field="linea" />
          <ExcelExportColumn title="Operario" field="operario" />
          <ExcelExportColumn title="DNI" field="dni" />
          <ExcelExportColumn title="Empresa" field="empresa" />
          <ExcelExportColumn title="Auditor" field="auditor" />
          <ExcelExportColumn title="EPP Faltantes" field="eppFaltantes" />
          <ExcelExportColumn title="Observación de la auditoría" field="observacionAuditoria" />
          <ExcelExportColumn title="Fecha de sanción" field="fechaSancion" />
          <ExcelExportColumn title="Observación de la sanción" field="observacionSancion" />
        </ExcelExport>
        <TableComponent
          IDcolumn="id"
          columns={[
            {
              title: "Fecha",
              field: "",
              render: (row: SEH_Auditoria) => <span>{moment(row.createdDate).format("DD/MM/YYYY")}</span>
            },
            {
              title: "Planta",
              field: "planta"
            },
            {
              title: "Linea",
              field: "linea"
            },
            {
              title: "Operario",
              field: "",
              render: (row: SEH_Auditoria) => (
                <span>
                  {row.personal?.apellido} {row.personal?.nombre}
                </span>
              )
            },
            {
              title: "DNI",
              field: "personalId"
            },
            {
              title: "Empresa",
              field: "empresa"
            },
            {
              title: "Auditor",
              field: "",
              render: (row: SEH_Auditoria) => (
                <span>
                  {row.auditor?.nombre} {row.auditor?.apellido}
                </span>
              )
            },
            {
              title: "",
              field: "",
              render: (row: SEH_Auditoria) => (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Ver Auditoria">
                      <IconButton
                        onClick={() => {
                          handleViewDetail(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <RemoveRedEye />
                      </IconButton>
                    </Tooltip>
                  </div>
                  {!row.sancionId && (
                    <div>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => {
                            console.log(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              )
            }
          ]}
          dataInfo={filteredAuditorias}
          Dense={true}
        />
      </div>
    </div>
  );
};
