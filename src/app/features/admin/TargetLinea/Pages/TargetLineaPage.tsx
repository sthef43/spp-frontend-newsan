/* eslint-disable unused-imports/no-unused-vars */
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { ILinea, IPlant } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { IFamilia } from "app/models/IFamilia";
import { ITargets } from "app/models/ITargets";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { TargetsSliceRequests } from "app/Middleware/reducers/TargetsSlice";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import Edit from "@mui/icons-material/Edit";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { TargetForm } from "../Modals/TargetForm";

interface initialValues {
  planta: number;
  linea: number;
  familia: string;
}

const defaultValuesForm = {
  planta: 0,
  linea: 0,
  familia: ""
};

export const TargetLineaPage = () => {
  const { control, watch, getValues, setValue } = useForm<initialValues>({ defaultValues: defaultValuesForm });

  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [ModalOpen, setModalOpen] = useState(false);
  const [estaEditando, setEstaEditando] = useState(false);

  const [editState, setEditState] = useState(null);

  const [listPlantas, setListPantas] = useState<IPlant[]>([]);
  const [listLineas, setListLineas] = useState<ILinea[]>([]);
  const [listFamilias, setListFamilias] = useState<IFamilia[]>([]);
  const [listTargets, setListTargets] = useState<ITargets[] | null>([]);

  const watchFamilia = watch("familia");
  const watchLinea = watch("linea");
  const watchPlanta = watch("planta");

  //Leer Plantas
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Líneas por planta
  const getLineas = async () => {
    try {
      const responses = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlanta)));
      setListLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  //Leer Familias por línea
  const getFamilias = async () => {
    const filtroLinea = listLineas.filter((a) => a.idLinea === watchLinea);
    try {
      const responses = unwrapResult(
        await dispatch(FamiliaSliceRequests.getListByNombreRequest(filtroLinea[0].tipoUnidad))
      );
      setListFamilias(responses);
    } catch (error) {
      openNotificationUI("Error al leer familias.", "error");
    }
  };

  //Leer Targets por familia
  const getTargets = async () => {
    try {
      const response = unwrapResult(
        await dispatch(
          TargetsSliceRequests.getTargetByIdLineaGenericoRequest({ idLinea: watchLinea, generico: watchFamilia })
        )
      );
      if (response) {
        setListTargets([response]);
      } else {
        openNotificationUI("No tiene target asignado, favor cargarlo.", "success");
        setListTargets([]);
        agregar();
      }
    } catch (error) {
      openNotificationUI("Error al leer targets.", "error");
    }
  };

  //Editar - Agregar
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };
  const agregar = () => {
    setEditState({ generico: watchFamilia, idLinea: watchLinea });
    setEstaEditando(false);
    setModalOpen(true);
  };

  //Watch
  useEffect(() => {
    if (watchFamilia) {
      getTargets();
    }
  }, [watchFamilia]);

  useEffect(() => {
    if (watchLinea) {
      setListFamilias([]);
      watchFamilia == "";
      getFamilias();
    }
  }, [watchLinea]);

  useEffect(() => {
    if (watchPlanta) {
      setListFamilias([]);
      setListLineas([]);
      watchFamilia == "";
      watchLinea == 0;
      getLineas();
    }
  }, [watchPlanta]);

  //Use efect genérico
  useEffect(() => {
    TitleChanger("Target de Linea");
    getPlantas();
  }, []);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Selects">
        <div className="w-full">
          <Controller
            name="planta"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="standard" error={!!error}>
                <InputLabel>Planta</InputLabel>
                <Select {...field} placeholder="Seleccione Planta" variant="standard">
                  {listPlantas &&
                    listPlantas.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div className="w-full">
                          <div>{x.name}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="linea"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="standard" error={!!error}>
                <InputLabel>Línea</InputLabel>
                <Select {...field} placeholder="Seleccione Línea" variant="standard">
                  {listLineas &&
                    listLineas.map((x) => (
                      <MenuItem key={x.idLinea} value={x.idLinea}>
                        <div className="w-full">
                          <div>{x.descripcion}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="familia"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="standard" error={!!error}>
                <InputLabel>Familia</InputLabel>
                <Select {...field} placeholder="Seleccione Familia" variant="standard">
                  {listFamilias &&
                    listFamilias.map((x) => (
                      <MenuItem key={x.id} value={x.nombre}>
                        <div className="w-full">
                          <div>{x.nombre}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
      </ContainerForPages>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          Dense={true}
          IDcolumn={"idTarget"}
          columns={[
            {
              title: "Target",
              field: "target"
            },
            {
              title: "Target de Desarme",
              field: "targetDesarme"
            },
            {
              title: "Dotación",
              field: "dotacion"
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
          dataInfo={listTargets}
        />
        <ModalCompoment title="Nuevo Target de Línea" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
          <TargetForm
            setOpenPopup={setModalOpen}
            editState={editState}
            refresh={getTargets}
            estaEditando={estaEditando}
          />
        </ModalCompoment>
      </ContainerForPages>
    </ContainerForPages>
  );
};
