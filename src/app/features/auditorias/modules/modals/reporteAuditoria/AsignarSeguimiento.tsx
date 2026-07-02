/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAuditoriasHistorico } from "../../../models/IAuditoriasHistorico";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { CheckRounded, CloseRounded, PersonAddRounded } from "@mui/icons-material";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { Tooltip } from "@mui/material";

interface TablaItems {
  nombreBloque: string;
  nombreItem: string;
  comentario: string;
  valor: string;
  resuelto: boolean;
  seguimiento: boolean;
  id: number;
}

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  auditoriaSeleccionada: IAuditoriasHistorico;
}

export const AsignarSeguimiento: React.FC<Props> = ({ setOpenModal, openModal, auditoriaSeleccionada }) => {
  const { control } = useForm();

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const generarDatosTabla = () => {
    let datos: TablaItems[] = [];
    if (auditoriaSeleccionada) {
      const listaValores =
        auditoriaSeleccionada.auditoriaAsignada.auditoria.auditoriaListaValoresResult.auditoriaValoresResult;
      const listaItems = auditoriaSeleccionada.auditoriaGrupoItemsHistorico.flatMap(
        (elementos) => elementos.auditoriaItemsHistorico
      );
      datos = listaItems.map((elements) => {
        const valor = listaValores.find((elementos) => elementos.nombre === elements.valorAsignado);
        return {
          id: elements.id,
          comentario: elements.comentario,
          valor: valor?.nombre,
          resuelto: false,
          seguimiento: false,
          nombreBloque: auditoriaSeleccionada.auditoriaGrupoItemsHistorico.find(
            (elementos) => elementos.id === elements.auditoriaGrupoItemsHistoricoId
          ).nombre,
          nombreItem: elements.nombre
        };
      });
    }
    return datos;
  };

  const renderEstado = (estado: boolean) => {
    return (
      <div
        className={`${
          estado ? "bg-green-300" : "bg-red-300"
        } flex flex-row items-center gap-x-1 rounded-full px-2 py-1 w-fit`}>
        <Tooltip title={estado ? "Resuelto" : "No Resuelto"}>
          <>
            {estado ? (
              <CheckRounded color="success" fontSize="small" />
            ) : (
              <CloseRounded color="error" fontSize="small" />
            )}
            <p className="text-sm">{estado ? "SI" : "NO"}</p>
          </>
        </Tooltip>
      </div>
    );
  };

  useEffect(() => {
    if (auditoriaSeleccionada) {
      generarDatosTabla();
    }
  }, [auditoriaSeleccionada]);

  return (
    <ContainerForPages optionsLayout="personalized" activeEffectVisible classNamePersonalized="w-[80vw]">
      <TableComponent
        IDcolumn="id"
        dataInfo={generarDatosTabla()}
        columns={[
          {
            title: "Bloque",
            field: "nombreBloque"
          },
          {
            title: "Item",
            field: "nombreItem"
          },
          {
            title: "Comentario",
            field: "",
            render: (value: TablaItems) => {
              return <p className="text-sm italic text-gray-500">{value.comentario}</p>;
            }
          },
          {
            title: "Valor",
            field: "valor"
          },
          {
            title: "Resuelto",
            field: "",
            render: (value: TablaItems) => renderEstado(value.resuelto)
          },
          {
            title: "Seguimiento",
            field: "",
            render: (value: TablaItems) => renderEstado(value.seguimiento)
          },
          {
            title: "Acciones",
            field: "",
            render: (value: TablaItems) => {
              return (
                <div className="flex flex-row gap-x-1">
                  <TooltipComponent
                    componenteIcono={<PersonAddRounded color="primary" />}
                    typeTooltip="normal"
                    titleTooltip="Asignar Responsable"
                  />
                </div>
              );
            }
          }
        ]}
      />
    </ContainerForPages>
  );
};
