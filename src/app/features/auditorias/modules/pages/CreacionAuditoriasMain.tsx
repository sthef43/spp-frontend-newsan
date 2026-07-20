import React, { useEffect, useState } from "react";
import { AddCircle, EditRounded, MoreHorizRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { plantSlice } from "app/Middleware/reducers";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser, IPlant } from "app/models";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { CheckListIconEdited, ViewListIconEdited } from "app/shared/helpers/ComponentsMUIModify/IconsModified";
import { PopperComponent } from "app/shared/helpers/ComponentsMUIModify/PopperComponent";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useGetAllPlantsExecute } from "app/shared/hooks/hooksServices/usePlantApi";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { IAuditoria } from "../../models/IAuditoria";
import { auditoriaAsignadaSlice, AuditoriaAsignadaSliceRequest } from "../../slices/AuditoriaAsignadaSlice";
import { auditoriasUISlice } from "../../slices/auditoriasUISlice";
import { useGetAllAuditsFatherByRolAndPlantId } from "../../composables/useAuditoriasApi";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { ExaminarBloquesAuditoria } from "../modals/creacionAuditorias/ExaminarBloquesAuditoria";
import { ExaminarValoresAudiutoria } from "../modals/creacionAuditorias/ExaminarValoresAuditoria";
import { useGetAllListValuesByAuditIdExcute } from "../../composables/useAuditoriaListaValoresResultApi";
import { IAuditoriaListaValoresResult } from "../../models/IAuditoriaListaValoresResult";
import { useGetAllGroupResultsByAuditIdExcute } from "../../composables/useAuditoriaGrupoItemsResultApi";
import { IAuditoriaGrupoItemsResult } from "../../models/IAuditoriaGrupoItemsResult";
import { IAuditoriaAsignada } from "../../models/IAuditoriaAsignada";
import { SeleccionarAuditoriaEditarModal } from "../modals/creacionAuditorias/SeleccionarAuditoriaEditarModal";

export const CreacionAuditoriasMain: React.FC = () => {
  const { control, watch } = useForm();

  const user = useAppSelector((state) => state.appUser.data as IAppUser);
  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);

  const buttonClases = MaterialButtons();
  const watchPlanta = watch("planta");
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [openModalBloques, setOpenModalBloques] = useState<boolean>(false);
  const [openModalValores, setOpenModalValores] = useState<boolean>(false);
  const [openModalSeleccion, setOpenModalSeleccion] = useState<boolean>(false);

  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<IAuditoria | null>(null);
  const [auditoriaPadreId, setAuditoriaPadreId] = useState<number>(0);

  const { TitleChanger } = useTitleOfApp();
  const { formatDateHourOrMinutes } = UseUtilHooks();
  const { execute: plantsExecute } = useGetAllPlantsExecute<IPlant[]>();
  const { response: auditorias } = useGetAllAuditsFatherByRolAndPlantId(watchPlanta, user.permisos.rolId);

  const { execute: groupResultsByAuditIdExecute, response: gruposResultados } =
    useGetAllGroupResultsByAuditIdExcute<IAuditoriaGrupoItemsResult[]>();
  const { execute: listValuesByAuditIdExecute, response: listaValores } =
    useGetAllListValuesByAuditIdExcute<IAuditoriaListaValoresResult>();

  const handleCreateAuditoria = () => {
    dispatch(auditoriasUISlice.actions.setModoEdicionGlobal(false));
    dispatch(auditoriaAsignadaSlice.actions.setAuditoria(null));
    dispatch(auditoriasUISlice.actions.setListaEmails(""));
    dispatch(auditoriasUISlice.actions.setBloquesVacio([]));
    dispatch(auditoriasUISlice.actions.setListaValores([]));
    dispatch(auditoriasUISlice.actions.setTipoAuditoria(0));
    dispatch(auditoriasUISlice.actions.setCantidadBloques(0));
    dispatch(auditoriasUISlice.actions.setBloqueSeleccionado({}));
    history.push("/main/auditorias-v2/crud-creacion-auditorias");
  };

  const handleExaminarBloques = (auditoria: IAuditoria) => {
    setAuditoriaSeleccionada(auditoria);
    groupResultsByAuditIdExecute(auditoria.id);
    setOpenModalBloques(true);
  };

  const handleExaminarValores = (auditoria: IAuditoria) => {
    setAuditoriaSeleccionada(auditoria);
    listValuesByAuditIdExecute(auditoria.id);
    setOpenModalValores(true);
  };

  const handleEdicionGlobal = async (auditoria: IAuditoria) => {
    dispatch(auditoriasUISlice.actions.setBloquesVacio([]));
    const response = unwrapResult(
      await dispatch(AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById(auditoria.id))
    );
    if (response) {
      dispatch(auditoriaAsignadaSlice.actions.setAuditoria(response));
      dispatch(
        auditoriasUISlice.actions.setListaValores(response.auditoria.auditoriaListaValoresResult.auditoriaValoresResult)
      );
      response.auditoriaGrupoItemsResult.map((elementos) => {
        dispatch(auditoriasUISlice.actions.setBloques(elementos));
      });
      dispatch(
        auditoriasUISlice.actions.setTipoAuditoria(response.auditoria.auditoriaListaValoresResult.auditoriaTiposId)
      );
      const todasLasAsignaciones = unwrapResult(
        await dispatch(AuditoriaAsignadaSliceRequest.getAllAuditAsignedByAuditId(auditoria.id))
      );
      dispatch(auditoriasUISlice.actions.setListaAuditoriasAsignadasGlobal(todasLasAsignaciones));
      dispatch(auditoriasUISlice.actions.setCantidadAuditoriasAfectadas(todasLasAsignaciones.length));
      dispatch(auditoriasUISlice.actions.setModoEdicionGlobal(true));
      history.push(`/main/auditorias-v2/crud-creacion-auditorias/${response.id}`);
    }
  };

  const handleAbrirSeleccionEspecifica = (auditoria: IAuditoria) => {
    setAuditoriaPadreId(auditoria.id);
    setOpenModalSeleccion(true);
  };

  useEffect(() => {
    TitleChanger("Creacion de Auditorías");
    plantsExecute();
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <h2 className="text-3xl font-semibold">Creacion de Auditorías</h2>
      <p className="text-muted-foreground text-sm text-gray-500">
        En este módulo podrá crear auditorías para luego asignarlas a los subroles disponibles.
      </p>
      <div className="mt-8 flex flex-row items-center justify-between w-full">
        <div className="w-1/2">
          <SelectComponent
            control={control}
            listaObjetos={plantas}
            nameSelect="planta"
            valueLabel={(value) => value.name}
            valueSelect={(value) => value.id}
            inputLabel="Seleccione una planta"
            ValueSave={(value) => dispatch(plantSlice.actions.setSelectPlant(value as number))}
            valueKey={(value) => value}
          />
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <Button
            disabled={!watchPlanta}
            className={`${buttonClases.blueButton} p-3 w-full`}
            variant="contained"
            onClick={handleCreateAuditoria}>
            <AddCircle sx={{ marginRight: "10px" }} />
            CREAR AUDITORIA
          </Button>
        </div>
      </div>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          dataInfo={auditorias}
          IDcolumn="id"
          columns={[
            {
              title: "Fecha",
              field: "",
              render: (auditoria: IAuditoria) => {
                return (
                  <p>
                    {formatDateHourOrMinutes({
                      optionDate: "fullDate",
                      optionHour: "fechaBaseDatos",
                      fechaIngresada: auditoria.createdDate
                    })}
                  </p>
                );
              }
            },
            {
              title: "Nombre Auditoria",
              field: "nombre"
            },
            {
              title: "Numero de Registro",
              field: "numeroRegistro"
            },
            {
              title: "Accion",
              field: "",
              render: (auditoria: IAuditoria) => {
                return (
                  <>
                    <PopperComponent
                      elementoIndex={(auditoria: IAuditoria) => auditoria.id}
                      elemento={auditoria}
                      showElement={<MoreHorizRounded color="primary" />}>
                      <div
                        className="flex flex-row items-center gap-x-3 cursor-pointer rounded-lg hover:bg-primaryNewOpacity hover:p-1 hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          handleExaminarBloques(auditoria);
                        }}>
                        <ViewListIconEdited />
                        <p className="font-semibold">Examinar Bloques</p>
                      </div>
                      <div
                        className="flex flex-row items-center gap-x-3 cursor-pointer rounded-lg hover:bg-primaryNewOpacity hover:p-1 hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          handleExaminarValores(auditoria);
                        }}>
                        <CheckListIconEdited />
                        <p className="font-semibold">Examinar Valores</p>
                      </div>
                      {/* <div
                        className="flex flex-row items-center gap-x-3 cursor-pointer rounded-lg hover:bg-primaryNewOpacity hover:p-1 hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          handleAbrirSeleccionEspecifica(auditoria);
                        }}>
                        <EditRounded color="primary" />
                        <p className="font-semibold">Editar Específica</p>
                      </div> */}
                      <div
                        className="flex flex-row items-center gap-x-3 cursor-pointer rounded-lg hover:bg-primaryNewOpacity hover:p-1 hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          handleEdicionGlobal(auditoria);
                        }}>
                        <EditRounded color="primary" />
                        <p className="font-semibold">Edición Global</p>
                      </div>
                    </PopperComponent>
                  </>
                );
              }
            }
          ]}
        />
      </ContainerForPages>
      <ModalCompoment
        openPopup={openModalBloques}
        showModalCenterPage
        showButtons
        functionButtonSave={() => setOpenModalBloques(false)}
        setOpenPopup={setOpenModalBloques}
        title={`Bloques - ${auditoriaSeleccionada?.nombre} - ${auditoriaSeleccionada?.numeroRegistro}`}
        subTitle="Modal exclusivamente para poder examinar bloques no editar"
        titleModalStyle="Audit">
        <ExaminarBloquesAuditoria
          auditoriaSeleccionada={auditoriaSeleccionada as IAuditoria}
          gruposAuditoria={gruposResultados as IAuditoriaGrupoItemsResult[]}
          setOpenModal={setOpenModalBloques}
        />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalValores}
        showModalCenterPage
        setOpenPopup={setOpenModalValores}
        title={`Valores - ${auditoriaSeleccionada?.nombre} - ${auditoriaSeleccionada?.numeroRegistro}`}
        subTitle="Modal exclusivamente para poder examinar valores no editar"
        titleModalStyle="Audit">
        <ExaminarValoresAudiutoria listaValores={listaValores} setOpenModal={setOpenModalValores} />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalSeleccion}
        openPopup={openModalSeleccion}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Seleccione la auditoría asignada que desea editar"
        title="Seleccionar Auditoría a Editar">
        <SeleccionarAuditoriaEditarModal
          setOpenModal={setOpenModalSeleccion}
          openModal={openModalSeleccion}
          auditoriaId={auditoriaPadreId}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
