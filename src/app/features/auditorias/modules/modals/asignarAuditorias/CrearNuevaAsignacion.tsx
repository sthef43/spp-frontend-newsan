/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAuditoria } from "../../../models/IAuditoria";
import { useInputValidations } from "app/shared/hooks/useInputValidations";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import FetchApi from "app/shared/helpers/FetchApi";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { IAppUser, IPermisos, ISubRol, ITurno } from "app/models";
import { PermisosSliceRequests } from "app/features/manejoSistema/slices/PermisosSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { AuditoriaEntidadesDTO } from "../../../models/DTO/AuditoriaEntidadesDTO";
import { IAuditoriaItemsResult } from "../../../models/IAuditoriaItemsResult";
import { IAuditoriaGrupoItemsResult } from "../../../models/IAuditoriaGrupoItemsResult";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { AuditoriaAsignadaSliceRequest } from "../../../slices/AuditoriaAsignadaSlice";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import { unwrapResult } from "@reduxjs/toolkit";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  openModal: boolean;
  edicionActiva: boolean;
  auditoriaSeleccionadaEditar?: IAuditoriaAsignada;
  setListaAuditoriasAsignadas?: (newValue: IAuditoriaAsignada[]) => void;
  setOpenModal: (newValue: boolean) => void;
  setActiveRefresh?: (newValue: boolean) => void;
}

export const CrearNuevaAsignacion: React.FC<Props> = ({
  setOpenModal,
  openModal,
  setActiveRefresh,
  edicionActiva,
  auditoriaSeleccionadaEditar,
  setListaAuditoriasAsignadas
}) => {
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const auditorias = useAppSelector((state) => state.auditoria.dataAll as IAuditoria[]);
  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);
  const { object } = useAppSelector((state) => state.plant);

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const {
    validators: { isNumeric }
  } = useInputValidations(trigger);
  const { FetchPost, FetchPut } = useFetchApiMultiResults();

  const [listaLineasProduccion, setLineasProduccion] = useState<ILineaProduccion[]>([]);
  const [listaSubRoles, setListaSubRoles] = useState<ISubRol[]>([]);
  const [listaTurnos, setListaTurnos] = useState<ITurno[]>([]);

  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<string | number>(
    edicionActiva ? auditoriaSeleccionadaEditar?.auditoriaId : 0
  );
  const [lineaProduccionSeleccionada, setLineaProduccionSeleccionada] = useState<string | number>(
    edicionActiva ? auditoriaSeleccionadaEditar?.lineaProduccionId : 0
  );
  const [subrolSeleccionado, setSubrolSeleccionado] = useState<string | number>(
    edicionActiva ? auditoriaSeleccionadaEditar?.subRolId : 0
  );
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string | number>(
    edicionActiva ? auditoriaSeleccionadaEditar?.turnoId : 0
  );

  FetchApi<ILineaProduccion[]>(
    LineaProduccionSliceRequests.getByPlantId,
    infoUser.operator.plantaId,
    false,
    openModal,
    setLineasProduccion,
    true,
    false,
    false
  );

  FetchApi<IPermisos[]>(
    PermisosSliceRequests.getByRolId,
    infoUser.permisos.rolId,
    false,
    openModal,
    null,
    true,
    false,
    false,
    (data) => {
      const allSubRoles = data.map((item) => item.subrol);
      setListaSubRoles(allSubRoles);
    }
  );

  FetchApi<ITurno[]>(TurnoSliceRequests.getAllRequest, null, false, openModal, setListaTurnos, true, false, false);

  const onSubmit = (data) => {
    let nuevaAuditoria: AuditoriaEntidadesDTO;
    let actualizacionAuditoria: IAuditoriaAsignada;

    if (!edicionActiva) {
      nuevaAuditoria = generateAuditoriaEntidades(data);
    } else {
      actualizacionAuditoria = generarActualizacion(data);
    }

    if (!edicionActiva) {
      FetchPost(AuditoriaAsignadaSliceRequest.createAuditWithResults, nuevaAuditoria, false, () => {
        openNotificationUI("Auditoria asignada correctamente", "success");
        setActiveRefresh(true);
        setOpenModal(false);
      });
    } else {
      FetchPut({
        consoleLog: false,
        modelPut: actualizacionAuditoria,
        sliceRequest: AuditoriaAsignadaSliceRequest.PutRequest,
        activeConfirmation: true,
        mensajePersonalizado: true,
        messageUser: "La auditoria seleccionada sera editada con los nuevos valores ingresados, ¿Desea continuar?",
        titleUser: "Actualizar Auditoria",
        functionAdd: async () => {
          const response = unwrapResult(
            await dispatch(AuditoriaAsignadaSliceRequest.getAllAuditAsignedByAuditId(auditoriaSeleccionada as number))
          );
          setListaAuditoriasAsignadas(response);
          openNotificationUI("Auditoria editada correctamente", "success");
          setOpenModal(false);
        }
      });
    }
  };

  const generateResultAuditoria = (data) => {
    const result: IAuditoriaAsignada = {
      auditoriaMailGroup: auditorias.find((item) => item.id === auditoriaSeleccionada)?.auditoriaMailGroup,
      nombre: auditorias.find((item) => item.id === auditoriaSeleccionada)?.nombre,
      lineaProduccionId: lineaProduccionSeleccionada as number,
      turnoId: turnoSeleccionado as number,
      cantidadMuestras: data.cantidad,
      numeroRegistro: auditorias.find((item) => item.id === auditoriaSeleccionada)?.numeroRegistro,
      rolId: infoUser.permisos.rolId,
      subRolId: subrolSeleccionado as number,
      auditoriaId: auditoriaSeleccionada as number,
      plantId: object?.id ? object.id : 0
    };
    return result;
  };

  const generarActualizacion = (data) => {
    const clonAuditoriaSeleccionada = { ...auditoriaSeleccionadaEditar };

    delete clonAuditoriaSeleccionada.auditoria;
    delete clonAuditoriaSeleccionada.subRol;
    delete clonAuditoriaSeleccionada.turno;
    delete clonAuditoriaSeleccionada.lineaProduccion;

    const actualizacionAuditoria: IAuditoriaAsignada = {
      ...clonAuditoriaSeleccionada,
      lineaProduccionId: lineaProduccionSeleccionada as number,
      turnoId: turnoSeleccionado as number,
      cantidadMuestras: data.cantidad,
      subRolId: subrolSeleccionado as number,
      auditoriaId: auditoriaSeleccionada as number
    };
    return actualizacionAuditoria;
  };

  const generateAuditoriaEntidades = (data) => {
    const auditoriaResult = generateResultAuditoria(data);
    const auditoriaPrincipal = auditorias.find((item) => item.id === auditoriaSeleccionada);

    //Primer nivel de los (padre de los items y valores)
    const auditoriaListaValores = { ...auditoriaPrincipal?.auditoriaListaValoresResult };

    //Segundo nivel (items y valores)
    const grupoItemsResult: IAuditoriaGrupoItemsResult[] = auditoriaPrincipal.auditoriaGrupoItemsResult.map(
      (bloque) => {
        const itemsClonados: IAuditoriaItemsResult[] = bloque.auditoriaItemsResult.map((item) => {
          return {
            nombre: item.nombre,
            descripcion: item.descripcion,
            auditoriaNivelItemId: item.auditoriaNivelItemId,
            auditoriaGrupoItemsResultId: 0,
            deleted: false
          };
        });
        return {
          nombre: bloque.nombre,
          descripcion: bloque.descripcion,
          urlArchivo: bloque.urlArchivo,
          auditoriaItemsResult: itemsClonados
        };
      }
    );
    const valores = auditoriaListaValores.auditoriaValoresResult.map((item) => {
      const elementos = { ...item };
      delete elementos.id;
      return elementos;
    });

    delete auditoriaListaValores.id;
    delete auditoriaListaValores.auditoriaId;
    delete auditoriaListaValores.auditoriaValoresResult;

    const clonItemsResult = grupoItemsResult.map((item) => {
      const elementos = { ...item };
      delete elementos.auditoriaId;
      return elementos;
    });

    const entidadEnviada: AuditoriaEntidadesDTO = {
      auditoriaAsignada: auditoriaResult,
      auditoriaValores: valores,
      auditoriaListaValores: auditoriaListaValores,
      auditoriaGrupoItems: clonItemsResult
    };
    return entidadEnviada;
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[65vw] h-full" activeEffectVisible>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-6">
        <SelectComponent
          activeRequired
          control={control}
          inputLabel="Lista De Auditorias disponibles"
          nameSelect="auditoria"
          defaultValue={edicionActiva ? auditoriaSeleccionadaEditar?.auditoriaId : 0}
          disabled={edicionActiva}
          varianteEstilo="standard"
          listaObjetos={auditorias}
          valueKey={(value) => value}
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          ValueSave={setAuditoriaSeleccionada}
        />
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Cantidad de muestras"
          nameInput="cantidad"
          requiredBool
          validacionAdicionales={isNumeric("Se deben ingresar solo numeros")}
          errors={errors}
          typeInput="standard"
          valueDefault={edicionActiva ? auditoriaSeleccionadaEditar?.cantidadMuestras.toString() : ""}
        />
        <SelectComponent
          control={control}
          inputLabel="Seleccionar Linea de Produccion"
          activeRequired
          defaultValue={edicionActiva ? auditoriaSeleccionadaEditar?.lineaProduccionId : 0}
          listaObjetos={listaLineasProduccion}
          nameSelect="lineaProduccion"
          valueKey={(value) => value}
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          ValueSave={setLineaProduccionSeleccionada}
          varianteEstilo="standard"
        />
        <TextFieldComponent
          control={control}
          index={0}
          labelInput="Rol"
          nameInput="rol"
          typeInput="standard"
          disabled
          valueDefault={infoUser.permisos.rol.name}
        />
        <SelectComponent
          activeRequired
          control={control}
          inputLabel="Seleccionar SubRol"
          listaObjetos={listaSubRoles}
          nameSelect="subrol"
          defaultValue={edicionActiva ? auditoriaSeleccionadaEditar?.subRolId : 0}
          valueKey={(value) => value}
          valueLabel={(value) => value.name}
          valueSelect={(value) => value.id}
          ValueSave={setSubrolSeleccionado}
          varianteEstilo="standard"
        />
        <SelectComponent
          activeRequired
          control={control}
          inputLabel="Seleccionar Turno"
          listaObjetos={listaTurnos}
          nameSelect="turno"
          defaultValue={edicionActiva ? auditoriaSeleccionadaEditar?.turnoId : 0}
          valueKey={(value) => value}
          valueLabel={(value) => value.nombre}
          valueSelect={(value) => value.id}
          ValueSave={setTurnoSeleccionado}
          varianteEstilo="standard"
        />
        <FormButtons onCancel={() => setOpenModal(false)} disabled={!isValid} />
      </form>
    </ContainerForPages>
  );
};
