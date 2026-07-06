import React, { useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ParadaSliceRequests } from "app/Middleware/reducers/ParadaSlice";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ParadasForm } from "app/features/informes/Modules/cargaEficienciaPlanta/modals/ParadasForm";
import moment from "moment";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { Edit } from "@mui/icons-material";
import { ParadasEditForm } from "app/features/informes/Modules/cargaEficienciaPlanta/modals/ParadasEditForm";

export const ReporteParadas = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [listParadas, setListParadas] = useState([]);

  const classes = MaterialButtons();
  interface initialState {
    fechaInicio: Date;
    fechaFin: Date;
  }
  const initialStateVar = {
    fechaInicio: moment().toDate(),
    fechaFin: moment().toDate()
  };
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const fechaFin = watch("fechaFin");
  const fechaInicio = watch("fechaInicio");

  React.useEffect(() => {
    TitleChanger("reporte paradas");
  }, []);

  const getParadas = async (desde, hasta) => {
    let result = [];
    const param = {
      fechaDesde: desde,
      fechaHasta: hasta
    };
    try {
      result = unwrapResult(await dispatch(ParadaSliceRequests.getListByDesdeHastaRequest(param)));
    } catch (error) {
      throw new Error(error);
    }
    if (result) {
      const array = [];
      //Pongo la fecha en el formato correcto para la exportacion de excel
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        array.push({ ...element, fecha: moment(element.fecha).format("DD-MM-YYYY") });
      }
      setListParadas(array);
    }
  };

  interface initialState {
    codigoError2: number; // representa la linea.
    fechaInicio: Date;
    fechaFin: Date;
  }

  const handleSearch = () => {
    const inicio = moment(getValues("fechaInicio")).format("YYYY-MM-DD");
    const fin = moment(getValues("fechaFin")).format("YYYY-MM-DD");
    if (fin < inicio) {
      openNotificationUI("La fecha Desde no puede ser mayor a la fecha Hasta", "warning");
      return false;
    }
    getParadas(inicio, fin);
  };

  const _exporter = React.createRef<ExcelExport>();
  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  //Editar
  const [editState, setEditState] = useState(null);
  const [ModalOpenEdit, setModalOpenEdit] = useState(false);
  const editar = (rowData) => {
    const [day, month, year] = rowData.fecha.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    setEditState({ ...rowData, fecha: date.toISOString().slice(0, 10) });
    setModalOpenEdit(true);
  };

  return (
    <div className="p-2">
      <form style={{ width: "100%", height: "100%" }}>
        <div className="grid col-span-1 sm:grid-cols-4 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 items-center">
          {/* ----------------FECHA---------------*/}
          <div>
            <DesktopDatePicker
              label="Desde"
              value={fechaInicio}
              inputFormat="DD/MM/yyyy"
              onChange={(e: any) => {
                setValue("fechaInicio", e);
              }}
              renderInput={(field) => <TextField {...field} variant="standard" />}
            />
          </div>
          <div>
            <DesktopDatePicker
              label="Hasta"
              value={fechaFin}
              inputFormat="DD/MM/yyyy"
              onChange={(e: any) => {
                setValue("fechaFin", e);
              }}
              renderInput={(field) => <TextField {...field} variant="standard" />}
            />
          </div>
          <div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>
          <div>
            <Button className={classes.blueButton} variant="contained" onClick={excelExport}>
              Exportar a excel
            </Button>
            <ExcelExport
              data={listParadas}
              ref={_exporter}
              fileName={`PARADAS DE LINEA -${moment(fechaInicio).format("YYYY-MM-DD")} - ${moment(fechaFin).format(
                "YYYY-MM-DD"
              )}`}>
              <ExcelExportColumn field="fecha" title="Fecha" />
              <ExcelExportColumn field="lineaString" title="Linea" />
              <ExcelExportColumn field="turno" title="Turno" />
              <ExcelExportColumn field="target" title="Target" />
              <ExcelExportColumn field="producidos" title="Producidos" />
              <ExcelExportColumn field="minutosPerdidos" title="MinutosPerdidos" />
              <ExcelExportColumn field="motivo.tiempoXMantenimiento" title="Tiempo Mant." />
              <ExcelExportColumn field="motivo.cambiosIngenieria" title="Cambio Ing." />
              <ExcelExportColumn field="motivo.cambioModelo" title="Cambio Mod." />
              <ExcelExportColumn field="motivo.ausentismo" title="Ausentismo" />
              <ExcelExportColumn field="motivo.dobladoras" title="Dobladoras" />
              <ExcelExportColumn field="motivo.soldadura" title="Soldadura" />
              <ExcelExportColumn field="motivo.montaje" title="Montaje" />
              <ExcelExportColumn field="motivo.iaPlacasDisplay" title="IA Placas D." />
              <ExcelExportColumn field="motivo.iaPlacasMain" title="IA Placas M." />
              <ExcelExportColumn field="motivo.imPlacasDisplay" title="IM Placas D." />
              <ExcelExportColumn field="motivo.imPlacasMain" title="IM Placas M" />
              <ExcelExportColumn field="motivo.equipamientoMaquinariaMant" title="Equpamiento Maq. Mant." />
              <ExcelExportColumn field="equipamientoMaquinariaIng" title="Equipamiento Maq. Ing." />
              <ExcelExportColumn field="motivo.metodos" title="Metodos" />
              <ExcelExportColumn field="motivo.calidad" title="Calidad" />
              <ExcelExportColumn field="motivo.sistemas" title="Sistemas" />
              <ExcelExportColumn field="motivo.it" title="IT" />
              <ExcelExportColumn field="motivo.cli" title="Cli" />
              <ExcelExportColumn field="motivo.supply" title="Supply" />
              <ExcelExportColumn field="motivo.terceros" title="Terceros" />
              <ExcelExportColumn field="motivo.otros" title="Otros" />
              <ExcelExportColumn field="observacion" title="Obs" />
              <ExcelExportColumn field="responsableInicioLinea.nombre" title="Responsable" />
              <ExcelExportColumn field="valida.nombre" title="Valida" />
            </ExcelExport>
          </div>
        </div>
      </form>
      {listParadas && (
        <TableComponent
          Dense={true}
          Overflow={false}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Fecha",
              field: "fecha"
            },
            {
              title: "Linea",
              field: "lineaString"
            },
            {
              title: "turno",
              field: "turno"
            },
            {
              title: "Target",
              field: "target"
            },
            {
              title: "Producidos.",
              field: "producidos"
            },
            {
              title: "Min. Perdidos",
              field: "minutosPerdidos"
            },
            {
              title: "Tiempo por Mantenimiento",
              field: "motivo.tiempoXMantenimiento"
            },
            {
              title: "Cambio Ing.",
              field: "motivo.cambiosIngenieria"
            },
            {
              title: "Cambio Modelo",
              field: "motivo.cambioModelo"
            },
            {
              title: "Ausentismo",
              field: "motivo.ausentismo"
            },
            {
              title: "Dobladoras",
              field: "motivo.dobladoras"
            },
            {
              title: "Soldadura",
              field: "motivo.soldadura"
            },
            {
              title: "Montaje",
              field: "motivo.montaje"
            },
            {
              title: "IA Placas D.",
              field: "motivo.iaPlacasDisplay"
            },
            {
              title: "IA Placas M",
              field: "motivo.iaPlacasMain"
            },
            {
              title: "IM Placas D",
              field: "motivo.imPlacasDisplay"
            },
            {
              title: "IM Placas M",
              field: "motivo.imPlacasMain"
            },
            {
              title: "Equip. Maq. Mant",
              field: "motivo.equipamientoMaquinariaMant"
            },
            {
              title: "Equip. Maq. Ing",
              field: "motivo.equipamientoMaquinariaIng"
            },
            {
              title: "Metodos",
              field: "motivo.metodos"
            },
            {
              title: "Calidad",
              field: "motivo.calidad"
            },
            {
              title: "Sist.",
              field: "motivo.sistemas"
            },
            {
              title: "It",
              field: "motivo.it"
            },
            {
              title: "Aisl.",
              field: "motivo.abastecimiento"
            },
            {
              title: "Cli",
              field: "motivo.cli"
            },
            {
              title: "Supply.",
              field: "motivo.supply"
            },
            {
              title: "Terceros",
              field: "motivo.terceros"
            },
            {
              title: "Otros",
              field: "motivo.otros"
            },
            {
              title: "Obs",
              field: "observacion"
            },
            {
              title: "Resp.",
              field: "responsableInicioLinea.nombre"
            },
            {
              title: "Valida",
              field: "valida.nombre"
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
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            setEditState(null);
            setModalOpen(true);
          }}
          dataInfo={listParadas}
        />
      )}

      <ModalCompoment title={"Carga de una Parada."} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <ParadasForm setOpenPopup={setModalOpen} refresh={handleSearch} />
      </ModalCompoment>

      <ModalCompoment title={"Editar Parada."} openPopup={ModalOpenEdit} setOpenPopup={setModalOpenEdit}>
        <ParadasEditForm setOpenPopup={setModalOpenEdit} editState={editState} refresh={handleSearch} />
      </ModalCompoment>
    </div>
  );
};
