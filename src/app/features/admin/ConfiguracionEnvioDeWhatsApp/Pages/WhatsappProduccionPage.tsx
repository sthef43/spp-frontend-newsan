import { WhatsappMsgSliceRequests } from "app/features/admin/slices/WhatsappMsgSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { WhatsappMsgForm } from "../Modals/WhatsappMsgForm";
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
import { WhatsappMsgOpcionAsignacionSliceRequest } from "app/features/admin/slices/WhatsappMsgOpcionAsignacionSlice";
import { IWhatsappMsgOpcionAsignacion } from "app/models/IWhatsappMsgOpcionAsignacion";
import FetchApi from "app/shared/helpers/FetchApi";
import { useForm, useWatch } from "react-hook-form";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";

interface FormData {
  planta: number | string;
  opcion: number | string;
}

export const WhatsappProduccionPage: React.FC = () => {
  const { control, setValue } = useForm<FormData>({
    defaultValues: {
      planta: 0,
      opcion: 0,
    },
  });

  const watchedPlanta = useWatch({ control, name: "planta" });
  const watchedOpcion = useWatch({ control, name: "opcion" });

  const { TitleChanger } = useTitleOfApp();
  const { greenButton, blueButton } = MaterialButtons();
  const dispatch = useAppDispatch();

  const opcionesAsignacion = useAppSelector(
    (state) => state.whatsAppAsignaciones.dataAll ?? []
  );

  const [rowSelected, setRowSelected] = useState<IWhatsappMsg | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfiguracionHora, setModalConfiguracionHora] = useState(false);
  const [openModalAsignarUsuarios, setOpenModalAsignarUsuarios] = useState(false);
  const [openModalCrearOpcionesDeEnvio, setOpenModalCrearOpcionesDeEnvio] = useState(false);

  useEffect(() => {
    setValue("opcion", 0);
  }, [watchedPlanta, setValue]);

  FetchApi<IWhatsappMsgOpcionAsignacion[]>(
    WhatsappMsgOpcionAsignacionSliceRequest.GetOptionsByPlantId,
    watchedPlanta,
    false,
    watchedPlanta,
    null,
    true
  );

  const [dataInfo, setDataInfo] = useState<IWhatsappMsg[]>([]);
  FetchApi<IWhatsappMsg[]>(
    WhatsappMsgSliceRequests.GetAllByWhatsapAsignacionId,
    watchedOpcion,
    false,
    watchedOpcion,
    setDataInfo,
    true
  );

  const [lineas, setLineas] = useState<ILinea[]>([]);
  FetchApi<ILinea[]>(LineaSliceRequests.getAllRequest, null, false, null, setLineas, false);

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, null, setPlantas, false);

  const lineasMap = useMemo(() => new Map(lineas.map((l) => [l.idLinea, l])), [lineas]);

  const accionAsignarUsuarios = useCallback((row: IWhatsappMsg) => {
    setOpenModalAsignarUsuarios(true);
    setRowSelected(row);
  }, []);

  useEffect(() => {
    TitleChanger("Configuracion envio de whatsapp");
  }, [TitleChanger]);

  useEffect(() => {
    if (watchedPlanta) {
      dispatch(plantSlice.actions.setSelectPlant(watchedPlanta as number));
    }
  }, [watchedPlanta, dispatch]);

  const columns = useMemo(
    () => [
      {
        title: "Linea",
        field: "",
        render: (row: IWhatsappMsg) => {
          return lineasMap.get(row.idLinea)?.descripcion;
        },
      },
      {
        title: "Mañana",
        field: "",
        render: (row: IWhatsappMsg) => {
          return row.m ? "SI" : "NO";
        },
      },
      {
        title: "Tarde",
        field: "",
        render: (row: IWhatsappMsg) => {
          return row.t ? "SI" : "NO";
        },
      },
      {
        title: "Noche",
        field: "",
        render: (row: IWhatsappMsg) => {
          return row.n ? "SI" : "NO";
        },
      },
      {
        title: "Acciones",
        field: "",
        render: (row: IWhatsappMsg) => {
          return (
            <div className="flex w-full justify-end sm:justify-start gap-4">
              <Tooltip title="Asignar numeros de whatsapp">
                <IconButton
                  onClick={() => {
                    accionAsignarUsuarios(row);
                  }}
                  size="small"
                  className="relative"
                  aria-label="Asignar números de WhatsApp">
                  <ContactPhoneRounded />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar Registro">
                <IconButton
                  onClick={() => {
                    setRowSelected(row);
                    setModalOpen(true);
                  }}
                  size="small"
                  className="relative"
                  aria-label="Editar registro">
                  <Edit />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [lineasMap, accionAsignarUsuarios]
  );

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Selects">
        <div>
          {plantas ? (
            <section className="flex flex-row gap-x-4 items-center">
              <div className="w-[400px] pr-3">
                <SelectComponentForm
                  listItems={plantas}
                  label="Seleccione una planta"
                  name="planta"
                  valueLabel={(value) => value.name}
                  valueSelect={(value) => value.id}
                  control={control}
                  variant="standard"
                />
              </div>
              {watchedPlanta !== 0 ? (
                <div className="w-[400px] pr-3">
                  <SelectComponentForm
                    listItems={opcionesAsignacion}
                    label="Seleccione una opcion"
                    name="opcion"
                    valueLabel={(value) => value.nombre}
                    valueSelect={(value) => value.id}
                    control={control}
                    variant="standard"
                  />
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
        <div className="flex flex-row items-center gap-x-4">
          <Button
            className={greenButton}
            disabled={watchedOpcion === 0}
            onClick={() => {
              setModalConfiguracionHora(true);
            }}>
            Configurar Hora Envio
          </Button>
          <Button
            disabled={watchedPlanta === 0}
            className={blueButton}
            onClick={() => {
              setOpenModalCrearOpcionesDeEnvio(true);
            }}>
            Agregar nuevas opciones de envio
          </Button>
        </div>
      </ContainerForPages>
      <ContainerForPages optionsLayout="Table" activeEffectVisible>
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={columns}
          agregar={() => {
            setRowSelected(null);
            setModalOpen(true);
          }}
          dataInfo={dataInfo}
        />
      </ContainerForPages>
      <ModalCompoment
        title="Agregar Lineas de envio"
        openPopup={modalOpen}
        setOpenPopup={setModalOpen}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Seleccione las líneas de envío para la configuración de WhatsApp">
        <WhatsappMsgForm
          setOpenPopup={setModalOpen}
          editState={false}
          refresh={setDataInfo}
          lineas={lineas}
          rowSelected={rowSelected}
          opcionSeleccionada={watchedOpcion as number}
        />
      </ModalCompoment>
      <ModalCompoment
        title="Asignar usuarios"
        openPopup={openModalAsignarUsuarios}
        setOpenPopup={setOpenModalAsignarUsuarios}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Asigne los números de WhatsApp a las líneas seleccionadas">
        <AccionAsignarUsuarios
          rowSelected={rowSelected}
          setOpenModal={setOpenModalAsignarUsuarios}
          openModal={openModalAsignarUsuarios}
          opcionSeleccionada={watchedOpcion as number}
        />
      </ModalCompoment>
      <ModalCompoment
        title="Configurar hora envio"
        openPopup={modalConfiguracionHora}
        setOpenPopup={setModalConfiguracionHora}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Configure el horario de envío de mensajes de WhatsApp">
        <WhatsappMsgTiempoPage />
      </ModalCompoment>
      <ModalCompoment
        title="Agregar opciones de envio"
        setOpenPopup={setOpenModalCrearOpcionesDeEnvio}
        openPopup={openModalCrearOpcionesDeEnvio}
        showModalCenterPage
        titleModalStyle="Audit"
        subTitle="Cree nuevas opciones de envío para la planta seleccionada">
        <WhatsappMsgOpcionAsignacion
          setOpenModal={setOpenModalCrearOpcionesDeEnvio}
          openModal={openModalCrearOpcionesDeEnvio}
          plantaSeleccionadaId={watchedPlanta as number}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
