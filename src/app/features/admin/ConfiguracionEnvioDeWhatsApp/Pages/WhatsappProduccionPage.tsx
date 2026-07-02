/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { WhatsappMsgSliceRequests } from "app/Middleware/reducers/WhatsappMsgSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useState } from "react";
import { WhatsappMsgForm } from "../Modals/WhatsappMsgFrom";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { IconButton, Button, Tooltip } from "@mui/material";
import { ContactPhoneRounded, Edit } from "@mui/icons-material";
import { AccionAsignarUsuarios } from "../Modals/AccionAsignarUsuarios";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { WhatsappMsgTiempoPage } from "../Modals/WhatsappMsgTiempoPage";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { plantSlice, PlantSliceRequests } from "app/Middleware/reducers";
import { ILinea, IPlant } from "app/models";
import { WhatsappMsgOpcionAsignacion } from "../Modals/WhatsappMsgOpcionAsignacion";
import { WhatsappMsgOpcionAsignacionSliceRequest } from "app/Middleware/reducers/WhatsappMsgOpcionAsignacionSlice";
import { IWhatsappMsgOpcionAsignacion } from "app/models/IWhatsappMsgOpcionAsignacion";
import FetchApi from "app/shared/helpers/FetchApi";
import { useForm } from "react-hook-form";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const WhatsappProduccionPage = () => {
  const { control } = useForm();

  const { TitleChanger } = useTitleOfApp();
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();

  const opcionesAsignacion = useAppSelector(
    (state) => state.whatsAppAsignaciones.dataAll as IWhatsappMsgOpcionAsignacion[]
  );

  const [rowSelected, setRowSelected] = useState(null);

  const [plantSelected, setPlantSelected] = useState<string | number>(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | number>(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfiguracionHora, setModalConfiguracionHora] = useState(false);
  const [openModalAsignarUsuarios, setOpenModalAsignarUsuarios] = useState(false);
  const [openModalCrearOpcionesDeEnvio, setOpenModalCrearOpcionesDeEnvio] = useState(false);

  FetchApi<IWhatsappMsgOpcionAsignacion[]>(
    WhatsappMsgOpcionAsignacionSliceRequest.GetOptionsByPlantId,
    plantSelected,
    false,
    plantSelected,
    null,
    true
  );

  const [dataInfo, setDataInfo] = useState<IWhatsappMsg[]>([]);
  FetchApi<IWhatsappMsg[]>(
    WhatsappMsgSliceRequests.GetAllByWhatsapAsignacionId,
    opcionSeleccionada,
    false,
    opcionSeleccionada,
    setDataInfo,
    true
  );

  const [lineas, setLineas] = useState([]);
  FetchApi<ILinea[]>(LineaSliceRequests.getAllRequest, null, false, null, setLineas, false);

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setPlantas, false);

  const accionAsignarUsuarios = (row) => {
    setOpenModalAsignarUsuarios(true);
    setRowSelected(row);
  };

  useEffect(() => {
    TitleChanger("Configuracion envio de whatsapp");
  }, []);

  useEffect(() => {
    if (plantSelected) {
      dispatch(plantSlice.actions.setSelectPlant(plantSelected as number));
    }
  }, [plantSelected]);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Selects">
        <div>
          {plantas && (
            <section className="flex flex-row gap-x-4 items-center">
              <div style={{ width: "400px", paddingRight: "10px" }}>
                <SelectComponent
                  listaObjetos={plantas}
                  inputLabel="Seleccione una planta"
                  nameSelect="planta"
                  valueLabel={(value) => value.name}
                  valueSelect={(value) => value.id}
                  ValueSave={setPlantSelected}
                  valueKey={(value) => value}
                  control={control}
                  varianteEstilo="standard"
                />
              </div>
              {plantSelected !== 0 && (
                <div className="w-[400px] pr-3">
                  <SelectComponent
                    listaObjetos={opcionesAsignacion}
                    inputLabel="Seleccione una opcion"
                    nameSelect="opcion"
                    valueLabel={(value) => value.nombre}
                    valueSelect={(value) => value.id}
                    ValueSave={setOpcionSeleccionada}
                    valueKey={(value) => value}
                    control={control}
                    varianteEstilo="standard"
                  />
                </div>
              )}
            </section>
          )}
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <Button
            className={classes.greenButton}
            disabled={opcionSeleccionada === 0}
            onClick={() => {
              setModalConfiguracionHora(true);
            }}>
            Configurar Hora Envio
          </Button>
          <Button
            disabled={plantSelected === 0}
            className={classes.blueButton}
            onClick={() => {
              setOpenModalCrearOpcionesDeEnvio(true);
            }}>
            Agregar nuevas opciones de envio
          </Button>
        </div>
      </ContainerForPages>
      <ContainerForPages optionsLayout="Table">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Linea",
              field: "",
              render: (row) => {
                return lineas.find((x) => x.idLinea == row.idLinea)?.descripcion;
              }
            },
            {
              title: "Mañana",
              field: "",
              render: (row) => {
                return row.m == true ? "SI" : "NO";
              }
            },
            {
              title: "Tarde",
              field: "",
              render: (row) => {
                return row.t == true ? "SI" : "NO";
              }
            },
            {
              title: "Noche",
              field: "",
              render: (row) => {
                return row.n == true ? "SI" : "NO";
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <Tooltip title="Asignar numeros de whatsapp">
                      <div>
                        <IconButton
                          onClick={() => {
                            accionAsignarUsuarios(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <ContactPhoneRounded />
                        </IconButton>
                      </div>
                    </Tooltip>
                    <Tooltip title="Editar Registro">
                      <div>
                        <IconButton
                          onClick={() => {
                            setRowSelected(row);
                            setModalOpen(true);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Edit />
                        </IconButton>
                      </div>
                    </Tooltip>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            setRowSelected(null);
            setModalOpen(true);
          }}
          dataInfo={dataInfo}
        />
      </ContainerForPages>
      <ModalCompoment title={"Agregar Lineas de envio"} openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <WhatsappMsgForm
          setOpenPopup={setModalOpen}
          editState={false}
          refresh={setDataInfo}
          lineas={lineas}
          rowSelected={rowSelected}
          opcionSeleccionada={opcionSeleccionada as number}
        />
      </ModalCompoment>
      <ModalCompoment
        title={"Asignar usuarios"}
        openPopup={openModalAsignarUsuarios}
        setOpenPopup={setOpenModalAsignarUsuarios}>
        <AccionAsignarUsuarios
          rowSelected={rowSelected}
          setOpenModal={setOpenModalAsignarUsuarios}
          openModal={openModalAsignarUsuarios}
          opcionSeleccionada={opcionSeleccionada as number}
        />
      </ModalCompoment>
      <ModalCompoment
        title={"Configurar hora envio"}
        openPopup={modalConfiguracionHora}
        setOpenPopup={setModalConfiguracionHora}>
        <WhatsappMsgTiempoPage></WhatsappMsgTiempoPage>
      </ModalCompoment>
      <ModalCompoment
        title={"Agreagr opciones de envio"}
        setOpenPopup={setOpenModalCrearOpcionesDeEnvio}
        openPopup={openModalCrearOpcionesDeEnvio}>
        <WhatsappMsgOpcionAsignacion
          setOpenModal={setOpenModalCrearOpcionesDeEnvio}
          openModal={openModalCrearOpcionesDeEnvio}
          plantaSeleccionadaId={plantSelected as number}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
