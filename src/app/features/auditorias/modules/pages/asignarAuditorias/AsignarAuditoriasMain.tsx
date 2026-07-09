/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAppUser } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { plantSlice, PlantSliceRequests } from "app/Middleware/reducers";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { Button } from "@mui/material";
import { AddCircle, DeleteRounded, VisibilityRounded } from "@mui/icons-material";
import { IAuditoria } from "../../../models/IAuditoria";
import { auditoriaSlice, AuditoriaSliceRequest } from "../../../slices/AuditoriaSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { CrearNuevaAsignacion } from "../../modals/asignarAuditorias/CrearNuevaAsignacion";
import { ExaminarAuditoriasAsignadasModal } from "../../modals/asignarAuditorias/ExaminarAuditoriasAsignadasModal";

export const AsignarAuditoriasMain = () => {
  const { control } = useForm();

  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);
  const auditorias = useAppSelector((state) => state.auditoria.dataAll as IAuditoria[]);
  const { object, dataAll } = useAppSelector((state) => state.plant);

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { formatDateHourOrMinutes } = UseUtilHooks();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalExaminar, setOpenModalExaminar] = useState<boolean>(false);
  const [activeRefresh, setActiveRefresh] = useState<boolean>(false);

  const [auditoriaId, setAuditoriaId] = useState<number>(0);

  FetchApi(PlantSliceRequests.getAllRequest, null, false, null, null, false, false, false);

  FetchApi<IAuditoria[]>(
    AuditoriaSliceRequest.GetAllAuditsByRolAndPlantId,
    { idPlant: object?.id ? object.id : 0, idRol: infoUser.permisos.rolId },
    false,
    object?.id || activeRefresh ? object.id : 0,
    null,
    true,
    false,
    false,
    () => setActiveRefresh(!activeRefresh)
  );

  useEffect(() => {
    TitleChanger("Asignar Auditorias");
    dispatch(auditoriaSlice.actions.setListaAuditorias([]));
  }, []);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <h2 className="text-3xl font-semibold">Asignar Auditorias</h2>
      <div className="flex flex-row w-full justify-between gap-x-4 mt-6">
        <div className="w-1/2">
          <SelectComponent
            control={control}
            listaObjetos={dataAll}
            nameSelect="planta"
            valueLabel={(value) => value.name}
            valueSelect={(value) => value.id}
            inputLabel="Seleccione una planta"
            ValueSave={(value) => {
              dispatch(plantSlice.actions.setSelectPlant(value as number));
            }}
            valueKey={(value) => value}
          />
        </div>
        <Button
          disabled={object?.id ? false : true}
          onClick={() => setOpenModal(true)}
          variant="contained"
          className={`${buttonClases.blueButton} w-1/5`}>
          <AddCircle sx={{ marginRight: "16px" }} />
          <p>Asignar Auditoria</p>
        </Button>
      </div>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          dataInfo={auditorias}
          IDcolumn="id"
          columns={[
            {
              title: "Fecha",
              field: "",
              render: (value: IAuditoria) =>
                formatDateHourOrMinutes({
                  optionDate: "fullDate",
                  optionHour: "fechaBaseDatos",
                  fechaIngresada: value.createdDate
                })
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
              render: (value: IAuditoria) => {
                return (
                  <div className="flex flex-row items-center gap-x-2">
                    <TooltipComponent
                      titleTooltip="Examinar"
                      typeTooltip="normal"
                      onClick={() => {
                        setAuditoriaId(value.id);
                        setOpenModalExaminar(true);
                      }}
                      componenteIcono={<VisibilityRounded color="primary" />}
                    />
                    <TooltipComponent
                      titleTooltip="Eliminar"
                      typeTooltip="normal"
                      componenteIcono={<DeleteRounded color="error" />}
                    />
                  </div>
                );
              }
            }
          ]}
        />
      </ContainerForPages>
      <ModalCompoment
        setOpenPopup={setOpenModal}
        openPopup={openModal}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Asignacion de una nueva auditoria a realizar"
        title="Creacion de nueva auditoria a realizar">
        <CrearNuevaAsignacion
          edicionActiva={false}
          setActiveRefresh={setActiveRefresh}
          setOpenModal={setOpenModal}
          openModal={openModal}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalExaminar}
        openPopup={openModalExaminar}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Informacion sobre las auditorias asignadas a subroles"
        title="Examinar auditoria asignada">
        <ExaminarAuditoriasAsignadasModal
          setOpenModal={setOpenModalExaminar}
          openModal={openModalExaminar}
          auditoriaId={auditoriaId}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
