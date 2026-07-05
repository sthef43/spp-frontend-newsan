import React, { useEffect, useMemo, useState } from "react";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAppUser, IPlant } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { plantSlice, PlantSliceRequests } from "app/Middleware/reducers";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { Button } from "@mui/material";
import { AddCircle, DeleteRounded, EditRounded } from "@mui/icons-material";
import { IAuditoriaTipo } from "../../models/IAuditoriaTipo";
import { auditoriaTipoSlice, AuditoriaTipoSliceRequest } from "../../slices/AuditoriaTipoSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AgregarTipoAuditoriaForm } from "../modals/tiposAuditoria/AgregarTipoAuditoriaForm";

export const TiposAuditoriaMain = () => {
  const { control } = useForm();

  const infoUser = useAppSelector((state) => state.appUser.data as IAppUser);
  const tipos = useAppSelector((state) => state.auditoriaTipo.dataAll as IAuditoriaTipo[]);
  const { object, dataAll: plants } = useAppSelector((state) => state.plant);

  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { FetchDelete } = useFetchApiMultiResults<boolean>();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeRefresh, setActiveRefresh] = useState<boolean>(false);
  const [edicionActiva, setEdicionActiva] = useState<boolean>(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<IAuditoriaTipo | undefined>(undefined);

  FetchApi(PlantSliceRequests.getAllRequest, null, false, null, null, false, false, false);

  FetchApi<IAuditoriaTipo[]>(
    AuditoriaTipoSliceRequest.GetTiposByRolAndPlantId,
    { rolId: infoUser.permisos?.rolId, plantId: object?.id ? object.id : 0 },
    false,
    object?.id || activeRefresh ? object.id : 0,
    null,
    true,
    false,
    false,
    () => setActiveRefresh(false)
  );

  useEffect(() => {
    TitleChanger("Tipos de Auditoría");
    dispatch(auditoriaTipoSlice.actions.setListaTipos([]));
  }, []);

  const handleOpenCreate = () => {
    setEdicionActiva(false);
    setTipoSeleccionado(undefined);
    setOpenModal(true);
  };

  const handleOpenEdit = (tipo: IAuditoriaTipo) => {
    setEdicionActiva(true);
    setTipoSeleccionado(tipo);
    setOpenModal(true);
  };

  const columns = useMemo(
    () => [
      { title: "Nombre", field: "nombre" },
      { title: "Descripción", field: "descripcion" },
      {
        title: "Planta",
        field: "",
        render: (value: IAuditoriaTipo) => {
          const plant = plants.find((p) => p.id === value.plantId);
          return plant?.name || "-";
        }
      },
      {
        title: "Acción",
        field: "",
        render: (value: IAuditoriaTipo) => (
          <div className="flex flex-row items-center gap-x-2">
            <TooltipComponent
              titleTooltip="Editar"
              typeTooltip="normal"
              onClick={() => handleOpenEdit(value)}
              componenteIcono={<EditRounded color="primary" />}
            />
            <TooltipComponent
              titleTooltip="Eliminar"
              typeTooltip="normal"
              onClick={() => {
                FetchDelete({
                  sliceRequest: AuditoriaTipoSliceRequest.deleteRequest,
                  deleteId: value.id,
                  consoleLog: false,
                  functionAdd: () => setActiveRefresh(true)
                });
              }}
              componenteIcono={<DeleteRounded color="error" />}
            />
          </div>
        )
      }
    ],
    [plants, FetchDelete]
  );

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <h2 className="text-3xl font-semibold">Tipos de Auditoría</h2>
      <div className="flex flex-row w-full justify-between gap-x-4 mt-6">
        <div className="w-1/2">
          <SelectComponent
            control={control}
            listaObjetos={plants}
            nameSelect="planta"
            valueLabel={(value: IPlant) => value.name}
            valueSelect={(value: IPlant) => value.id}
            inputLabel="Seleccione una planta"
            ValueSave={(value) => {
              dispatch(plantSlice.actions.setSelectPlant(value as number));
            }}
            valueKey={(value) => value}
          />
        </div>
        <Button
          disabled={!object?.id}
          onClick={handleOpenCreate}
          variant="contained"
          className={`${buttonClasses.blueButton} w-1/5`}>
          <AddCircle sx={{ marginRight: "16px" }} />
          <p>Nuevo Tipo</p>
        </Button>
      </div>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        {tipos.length === 0 ? (
          <div className="w-full text-center py-10 text-gray-500 text-lg">
            No se encontraron tipos de auditoría
          </div>
        ) : (
          <TableComponent
            dataInfo={tipos}
            IDcolumn="id"
            buscar
            columns={columns}
          />
        )}
      </ContainerForPages>
      <ModalCompoment
        setOpenPopup={setOpenModal}
        openPopup={openModal}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle={edicionActiva ? "Editar tipo de auditoría existente" : "Creación de un nuevo tipo de auditoría"}
        title={edicionActiva ? "Editar Tipo de Auditoría" : "Nuevo Tipo de Auditoría"}>
        <AgregarTipoAuditoriaForm
          setOpenModal={setOpenModal}
          setActiveRefresh={setActiveRefresh}
          edicionActiva={edicionActiva}
          tipoSeleccionado={tipoSeleccionado}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
