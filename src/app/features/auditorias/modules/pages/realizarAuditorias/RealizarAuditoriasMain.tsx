/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { plantSlice, PlantSliceRequests } from "app/Middleware/reducers";
import { IAppUser, IPermisos, IPlant, ISubRol } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { CheckCircleOutlined, EditRounded } from "@mui/icons-material";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { useHistory } from "react-router-dom";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import { auditoriaAsignadaSlice, AuditoriaAsignadaSliceRequest } from "../../../slices/AuditoriaAsignadaSlice";
import { PermisosSliceRequests } from "app/features/manejoSistema/slices/PermisosSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { statesListDataForAuditoriasSlice } from "../../../slices/ListaDatosParaAuditoriasSlice";

export const RealizarAuditoriasMain: React.FC = () => {
  const { control } = useForm();

  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);

  const history = useHistory();
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const [listaAuditorias, setListaAuditorias] = useState<IAuditoriaAsignada[]>([]);
  const [listaPlantas, setListaPLantas] = useState<IPlant[]>([]);
  const [listaSubRoles, setListaSubRoles] = useState<ISubRol[]>([]);

  const [plantaSeleccionada, setPlantaSeleccionada] = useState<string | number>(0);
  const [subRolSeleccionado, setSubRolSeleccionado] = useState<string | number>(0);

  FetchApi(PlantSliceRequests.getAllRequest, null, false, null, setListaPLantas, false, false, false);

  FetchApi<IAuditoriaAsignada[]>(
    AuditoriaAsignadaSliceRequest.getAllAuditsOfTheDay,
    {
      rolId: infoUser.permisos.rolId,
      subRolId: infoUser.permisos.subrolId,
      turnoId: infoUser.operator.turnoId,
      plantId: plantaSeleccionada
    },
    false,
    plantaSeleccionada && !infoUser.permisos.subrol.name.trim().toLocaleLowerCase().includes("admin"),
    setListaAuditorias,
    true,
    false,
    false
  );

  FetchApi<IAuditoriaAsignada[]>(
    AuditoriaAsignadaSliceRequest.getAllAuditsOfTheDay,
    {
      rolId: infoUser.permisos.rolId,
      subRolId: subRolSeleccionado,
      turnoId: infoUser.operator.turnoId,
      plantId: plantaSeleccionada
    },
    false,
    subRolSeleccionado,
    setListaAuditorias,
    true,
    false,
    false
  );

  FetchApi<IPermisos[]>(
    PermisosSliceRequests.getByRolId,
    infoUser.permisos.rolId,
    false,
    infoUser.permisos.subrol.name.trim().toLocaleLowerCase().includes("admin"),
    null,
    true,
    false,
    false,
    (data) => {
      const listaSubroles = data.map((elementos) => elementos.subrol);
      setListaSubRoles(listaSubroles);
    }
  );

  const hamdleEditAuditoria = async (auditoria: IAuditoriaAsignada) => {
    dispatch(statesListDataForAuditoriasSlice.actions.setBloquesVacio([]));
    const response = unwrapResult(
      await dispatch(AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById(auditoria.id))
    );
    if (response) {
      console.log(response);
      dispatch(auditoriaAsignadaSlice.actions.setAuditoria(response));
      dispatch(
        statesListDataForAuditoriasSlice.actions.setListaValores(
          response.auditoria.auditoriaListaValoresResult.auditoriaValoresResult
        )
      );
      response.auditoriaGrupoItemsResult.map((elementos) => {
        dispatch(statesListDataForAuditoriasSlice.actions.setBloques(elementos));
      });
      dispatch(
        statesListDataForAuditoriasSlice.actions.setTipoAuditoria(
          response.auditoria.auditoriaListaValoresResult.auditoriaTiposId
        )
      );
      history.push(`/main/auditorias-v2/crud-creacion-auditorias/${response.id}`);
    }
  };

  useEffect(() => {
    TitleChanger("Realizar Auditorías");
  }, []);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <h2 className="text-3xl font-semibold">Realizar Auditorías</h2>
      <div className="flex flex-row w-full justify-between gap-x-4 mt-6">
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
              dispatch(plantSlice.actions.setSelectPlant(value as number));
            }}
          />
        </div>
        {infoUser.permisos.subrol.name.trim().toLocaleLowerCase().includes("admin") && (
          <div className="w-1/2">
            <SelectComponent
              control={control}
              inputLabel="Seleccionar Sub Rol"
              listaObjetos={listaSubRoles}
              nameSelect="subRol"
              valueKey={(value) => value}
              valueLabel={(value) => value.name}
              valueSelect={(value) => value.id}
              ValueSave={setSubRolSeleccionado}
            />
          </div>
        )}
      </div>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          IDcolumn="id"
          buscar
          dataInfo={listaAuditorias}
          columns={[
            {
              title: "Fecha",
              field: "",
              render: (value: IAuditoriaAsignada) =>
                formatDateHourOrMinutes({
                  optionDate: "onlyDate",
                  optionHour: "fechaBaseDatos",
                  fechaIngresada: value.createdDate
                })
            },
            {
              title: "Nombre Auditoria",
              field: "nombre"
            },
            {
              title: "Linea",
              field: "lineaProduccion.nombre"
            },
            {
              title: "Cantidad Muestras Faltantes",
              field: "",
              render: (value: IAuditoriaAsignada) => {
                return (
                  <p className={value.cantidadMuestras != 0 ? "text-green-500" : "text-red-500"}>
                    {value.cantidadMuestrasOriginal} / {value.cantidadMuestras}
                  </p>
                );
              }
            },
            {
              title: "Accion",
              field: "",
              render: (value: IAuditoriaAsignada) => {
                return (
                  <div className="flex flex-row items-center gap-x-2">
                    <TooltipComponent
                      disabled={value.cantidadMuestras == 0}
                      onClick={() =>
                        value.cantidadMuestras != 0 &&
                        history.push(`/main/auditorias-v2/completar-auditoria/${value.id}/realizar`)
                      }
                      titleTooltip="Realizar Auditoria"
                      typeTooltip="normal"
                      componenteIcono={
                        <CheckCircleOutlined
                          color={value.cantidadMuestras != 0 ? "success" : "disabled"}
                          fontSize="medium"
                        />
                      }
                    />
                    {infoUser.permisos.subrol.name.trim().toLocaleLowerCase().includes("admin") && (
                      <TooltipComponent
                        onClick={() => hamdleEditAuditoria(value)}
                        titleTooltip="Editar"
                        typeTooltip="normal"
                        componenteIcono={<EditRounded color="primary" fontSize="medium" />}
                      />
                    )}
                  </div>
                );
              }
            }
          ]}
        />
      </ContainerForPages>
    </ContainerForPages>
  );
};
