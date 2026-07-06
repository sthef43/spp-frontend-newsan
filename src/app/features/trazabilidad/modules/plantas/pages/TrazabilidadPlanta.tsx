import React, { useEffect, useState } from "react";
import { IPlant } from "app/models/IPlant";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { PlantSliceRequests } from "app/Middleware/reducers/PlantSlice";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IAppUser } from "app/models/IAppUser";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TrazabilidadPlantaForm } from "app/features/trazabilidad/modules/plantas/modal/TrazabilidadPlantaForm";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
export const TrazabilidadPlanta = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [cargando, setCargando] = useState(true);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const { TitleChanger } = useTitleOfApp();
  const tableRef = React.createRef();
  //const { State: plantList } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, undefined);
  const [plantList, setPlantList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<IPlant | null>(null);
  const [selectedPlanProd, setSelectedPlanProd] = React.useState(0);
  const { getConfirmation } = useConfirmationDialog();
  const deleteProduct = async (row) => {
    console.log(row);
    const resp = await getConfirmation("Borrar una planta", "Está seguro que desea borrar la planta?");
    if (resp) {
      const response = unwrapResult(await dispatch(PlantSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Se elimino la planta correctamente", "success");
        getPlantas();
      }
    }
  };
  const getPlantas = async () => {
    const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
    setPlantList(responses);
    setDataSource(JSON.parse(JSON.stringify(responses)));
  };
  const refresh = () => {
    getPlantas();
  };
  const [estaEditando, setEstaEditando] = useState(false);
  const [tituloModal, setTituloModal] = useState("Creacion");
  useEffect(() => {
    setTituloModal(estaEditando ? " Edicion " : " Creacion ");
  }, [estaEditando]);
  useEffect(() => {
    getPlantas();
  }, []);
  React.useEffect(() => {
    if (plantList?.length > 0) {
      setDataSource(JSON.parse(JSON.stringify(plantList)));
      setCargando(false);
    }
  }, [plantList]);
  React.useEffect(() => {
    TitleChanger("CARGA DE PLANTAS");
  }, []);

  const editar = (row) => {
    setEditState({
      id: row.id,
      createdDate: row.createdDate,
      name: row.name,
      deleted: false
    });
    setEstaEditando(true);
    setModalOpen(true);
  };

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Nombre",
            field: "name"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <IconButton
                      onClick={() => {
                        editar(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit />
                    </IconButton>
                  </div>
                  <div>
                    <IconButton
                      onClick={() => {
                        deleteProduct(row.id);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          setEstaEditando(false);
          setModalOpen(true);
        }}
        dataInfo={dataSource}
      />
      <ModalCompoment title={tituloModal + " de una planta"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <TrazabilidadPlantaForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={refresh}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
