import React, { useEffect, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { PuestoSliceRequests } from "app/features/trazabilidad/slices/PuestoSlice";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IAppUser } from "app/models/IAppUser";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TrazabilidadPuestoForm } from "app/features/trazabilidad/modules/puestosLinea/modal/TrazabilidadPuestoForm";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IPlant, IPuesto } from "app/models";

export const TrazabilidadPuesto = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [cargando, setCargando] = useState(true);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const { TitleChanger } = useTitleOfApp();
  const { State: plants } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);
  const [puestoList, setPuestoList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const { openNotificationUI } = useNotificationUI();
  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<IPuesto | null>(null);
  const { getConfirmation } = useConfirmationDialog();
  const [estaEditando, setEstaEditando] = useState(false);
  const [tituloModal, setTituloModal] = useState("Creacion");
  const [plantSelected, setPlantSelected] = useState<number>(0);

  const deleteProduct = async (row) => {
    const resp = await getConfirmation("Borrar un puesto", "Esta seguro que quiere eliminar este puesto?");
    if (resp) {
      const response = unwrapResult(await dispatch(PuestoSliceRequests.deleteRequest(row)));
      if (response) {
        openNotificationUI("Dato eliminado correctamente", "success");
        getPuestos();
      }
    }
  };

  const getPuestos = async () => {
    let responses: IPuesto[] = unwrapResult(await dispatch(PuestoSliceRequests.getAllRequest()));
    responses = responses.filter((x) => x.plantId == plantSelected);
    setPuestoList(responses);
    setDataSource(JSON.parse(JSON.stringify(responses)));
  };

  const editar = (rowData) => {
    setEditState({
      id: rowData.id,
      createdDate: rowData.createdDate,
      nombre: rowData.nombre,
      descripcion: rowData.descripcion,
      deleted: false,
      plantId: rowData.plantId
    });
    setEstaEditando(true);
    setModalOpen(true);
  };

  const refresh = () => {
    getPuestos();
  };

  useEffect(() => {
    setTituloModal(estaEditando ? " Edicion " : " Creacion ");
  }, [estaEditando]);

  React.useEffect(() => {
    if (puestoList?.length > 0) {
      setDataSource(JSON.parse(JSON.stringify(puestoList)));
    }
  }, [puestoList]);

  React.useEffect(() => {
    TitleChanger("CARGA DE PUESTOS");
    getPuestos();
    infoUser && setPlantSelected(infoUser.operator.plantaId ?? 0);
  }, []);

  useEffect(() => {
    if (plants) {
      const numberPlant = infoUser.operator.plantaId;
      setPlantSelected(numberPlant);
    }
  }, [plants]);

  useEffect(() => {
    if (plantSelected) getPuestos();
  }, [plantSelected]);

  return (
    <div className="my-2 mx-4 h-full">
      <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
        <FormControl variant="filled">
          <InputLabel>Seleccione una planta</InputLabel>
          <Select
            label="Seleccione una planta"
            value={plantSelected}
            onChange={(event: any) => {
              if (event.target.value) setPlantSelected(event.target.value);
            }}>
            {plants?.map((elem: IPlant) => (
              <MenuItem key={elem.id} value={elem.id}>
                {elem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TableComponent
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Descripcion",
            field: "descripcion"
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
      <ModalCompoment title={tituloModal + " de un puesto"} openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <TrazabilidadPuestoForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={refresh}
          estaEditando={estaEditando}
          infoUser={infoUser}
        />
      </ModalCompoment>
    </div>
  );
};
