import React, { useState } from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { HorasExtrasForm } from "../modals/HorasExtrasForm";
import moment from "moment";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { InfoRounded, VisibilityRounded } from "@mui/icons-material";
import { IHoraExtra } from "app/models/IHoraExtra";
import { Typography } from "@mui/material";
import _ from "lodash";
import { IHoraExtraTurnoExtras } from "app/models/IHoraExtraTurnoExtras";
interface IHorasET {
  refresh: () => void;
  productoId: number;
}
export const HorasExtrasProduccionTable = ({ refresh, productoId }: IHorasET): JSX.Element => {
  const horasExtras = useAppSelector((state) => state.horaExtra.dataAll);

  const [openModal, setOpenModal] = useState(false);
  const [edicionActiva, setEdicionActiva] = useState(false);
  const [data, setData] = useState<IHoraExtra | null>(null);

  const handleOpenModal = (row: IHoraExtra) => {
    setOpenModal(true);
    setEdicionActiva(true);
    setData(row);
  };

  const renderInfoHorasExtras = (row: IHoraExtra, titulos: string, campo?: string, campo2?: string) => {
    const horasExtras = row.horaExtraTurnoExtras;
    const buscar = campo;
    const buscar2 = campo2;

    if (horasExtras.length == 1) {
      const datoUnitario = _.get(horasExtras[0], buscar, "");
      const datoUnitario2 = _.get(horasExtras[0], buscar2, "");
      return (
        <h1>
          {datoUnitario} {datoUnitario2 && <span>- {datoUnitario2}</span>}
        </h1>
      );
    }
    return (
      <>
        <TooltipComponent
          titleTooltip={
            <>
              <Typography
                sx={{
                  backgroundColor: "var(--newsanLighten-color)",
                  textAlign: "center",
                  color: "white",
                  padding: ".3rem"
                }}>
                {titulos}
              </Typography>
            </>
          }
          styleTooltip={{
            backgroundColor: "var(--secondary-color)",
            fontSize: "12px",
            border: "1px solid var(--background-color)",
            padding: "0",
            color: "var(--text-color)"
          }}
          typeTooltip="HtmlType"
          componenteIcono={<InfoRounded color="primary" />}>
          <div className="flex flex-col gap-y-4">
            {horasExtras.map((horaExtra) => {
              const datoUnitario = _.get(horaExtra, buscar, "");
              const datoUnitario2 = _.get(horaExtra, buscar2, "");
              return (
                <h1 key={horaExtra.id} className="bg-primaryNewOpacity w-full text-center">
                  {datoUnitario} {datoUnitario2 && <span>- {datoUnitario2}</span>}
                </h1>
              );
            })}
          </div>
        </TooltipComponent>
      </>
    );
  };

  const renderInfoHorasExtrasLinea = (row: IHoraExtraTurnoExtras[], titulos: string, campo?: string) => {
    const lineasAgrupadas = _.groupBy(row, "horaExtraId");
    const listaGrupos = Object.values(lineasAgrupadas).flatMap((lineas) =>
      lineas.flatMap((item) => item.turnoExtrasLineaProduccion)
    );

    if (listaGrupos.length == 0) {
      return <h1>-</h1>;
    }

    return (
      <>
        <TooltipComponent
          titleTooltip={
            <>
              <Typography
                sx={{
                  backgroundColor: "var(--newsanLighten-color)",
                  textAlign: "center",
                  color: "white",
                  padding: ".3rem"
                }}>
                {titulos}
              </Typography>
            </>
          }
          styleTooltip={{
            backgroundColor: "var(--secondary-color)",
            fontSize: "12px",
            border: "1px solid var(--background-color)",
            padding: "0",
            color: "var(--text-color)"
          }}
          typeTooltip="HtmlType"
          componenteIcono={<InfoRounded color="primary" />}>
          <div className="flex flex-col gap-y-4">
            {listaGrupos.map((lineas, index) => {
              const buscar = `${campo}`;
              const datoUnitario = _.get(lineas, buscar, "");
              return (
                <h1 key={index} className="bg-primaryNewOpacity w-full text-center">
                  {datoUnitario}
                </h1>
              );
            })}
          </div>
        </TooltipComponent>
      </>
    );
  };

  return (
    <ContainerForPages optionsLayout="Table" activeEffectVisible>
      <TableComponent
        columns={[
          {
            title: "Fecha",
            field: "fecha",
            render: (row: IHoraExtra) => <h1>{moment(row.createdDate).format("L")}</h1>
          },
          {
            title: "Turno",
            field: "turnoExtras.turno.nombre",
            render: (row: IHoraExtra) => (
              <h1>{renderInfoHorasExtras(row, "Turnos con horas extras solicitadas", "turnoExtras.turno.nombre")}</h1>
            )
          },
          {
            title: "Horario",
            field: "",
            render: (row: IHoraExtra) => (
              <h1>
                {renderInfoHorasExtras(
                  row,
                  "Horarios con horas extras solicitadas",
                  "turnoExtras.desdeHora",
                  "turnoExtras.hastaHora"
                )}
              </h1>
            )
          },
          {
            title: "Linea",
            field: "horaExtraTurnoExtras",
            render: (row: IHoraExtra) => (
              <h1>
                {renderInfoHorasExtrasLinea(
                  row.horaExtraTurnoExtras,
                  "Lineas con horas extras solicitadas",
                  "lineaProduccion.nombre"
                )}
              </h1>
            )
          },
          {
            title: "Detalle",
            field: "turnoExtrasLineaProduccion[0].detalle",
            render: (row: IHoraExtra) => {
              if (row.horaExtraTurnoExtras.length == 0) {
                return <h1>-</h1>;
              }
              return (
                <h1>
                  {row.horaExtraTurnoExtras[0].turnoExtrasLineaProduccion[0].detalle != ""
                    ? row.horaExtraTurnoExtras[0].turnoExtrasLineaProduccion[0].detalle
                    : "-"}
                </h1>
              );
            }
          },
          {
            title: "Total personal",
            field: "turnoExtrasLineaProduccion[0].cantidad",
            render: (row: IHoraExtra) => (
              <h1>{renderInfoHorasExtrasLinea(row.horaExtraTurnoExtras, "Total personal", "cantidad")}</h1>
            )
          },
          {
            title: "Acciones",
            field: "",
            render: (row: IHoraExtra) => {
              if (row.horaExtraTurnoExtras.length > 0) {
                return (
                  <TooltipComponent
                    onClick={() => handleOpenModal(row)}
                    typeTooltip="normal"
                    titleTooltip="Examinar"
                    componenteIcono={<VisibilityRounded color="primary" />}
                  />
                );
              }
            }
          }
        ]}
        IDcolumn="id"
        buscar
        dataInfo={horasExtras}
      />
      <ModalCompoment
        title="Agregar horas extras"
        setOpenPopup={setOpenModal}
        openPopup={openModal}
        titleModalStyle="Audit"
        subTitle="Completa los detalles para crear la solicitud de horas extras">
        <HorasExtrasForm
          refresh={refresh}
          openModal={setOpenModal}
          edicionActiva={edicionActiva}
          data={data}
          productoId={productoId}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
