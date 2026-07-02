import React, { useCallback } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Check, Clear, ContentCopy, Edit } from "@mui/icons-material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useAppDispatch } from "app/core/store/store";
import { IGenerico } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { LimiteDialog } from "app/features/calidad/modules/limitesDeTorqueInstrumental/Components/LimiteDialog";
import { LimiteCreate } from "app/features/calidad/modules/limitesDeTorqueInstrumental/Components/LimiteCreate";
import moment from "moment";
import { LimitesSliceRequests } from "app/Middleware/reducers/LimitesSlice";
import { ILimites } from "app/models/ILimites";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ClonarForm } from "app/features/calidad/modules/limitesDeTorqueInstrumental/Components/ClonarForm";

export const LimitesCrud = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const buttonClasses = MaterialButtons();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalLimiteOpen, setModalLimiteOpen] = React.useState(false);
  const [clonar, setClonar] = React.useState(false);

  const [identificadorLinea, setIdentificadorLinea] = React.useState<number>(0);
  const [productoId, setProductoId] = React.useState<number>(0);
  const [tipoUnidad, setTipoUnidad] = React.useState<string>("");

  const [selectedLimite, setSelectedLimite] = React.useState<ILimites>(null);
  const [limites, setLimites] = React.useState<ILimites[]>([]);
  const [genericos, setGenericos] = React.useState<IGenerico[]>([]);

  const onInit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const fetchGenericosResult = unwrapResult(await dispatch(GenericoSliceRequests.getAllRequest()));
      setGenericos(fetchGenericosResult);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const getLimites = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(LimitesSliceRequests.getAllByLinea({ linea: identificadorLinea })));
      setLimites(response);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const setRow = (limite: ILimites) => {
    setSelectedLimite(limite);
    setModalOpen(true);
  };

  const handleAgregarLimite = () => {
    setModalLimiteOpen(true);
  };
  const setIdentificadorLineaProps = useCallback((idL: string) => {
    setIdentificadorLinea(parseInt(idL));
  }, []);

  const setTipoUnidadCL = useCallback((tipoUnidad: string) => {
    setTipoUnidad(tipoUnidad);
  }, []);

  const setCloseCL = useCallback((state: boolean) => {
    setClonar(state);
  }, []);

  const setProductCL = useCallback((idP: number) => {
    setProductoId(idP);
  }, []);

  React.useEffect(() => {
    identificadorLinea > 0 && getLimites();
  }, [identificadorLinea]);

  React.useEffect(() => {
    onInit();
    TitleChanger("Limites");
  }, []);

  return (
    <div className=" animate__animated animate__fadeInUp">
      <SelectOFPlantAndProducts
        setCodigoErrorProps={setIdentificadorLineaProps}
        selectLineas
        setProductoId={setProductCL}
        setTipoUnidadLinea={setTipoUnidadCL}>
        {identificadorLinea > 0 && (
          <div className="p-4">
            <Button
              onClick={() => {
                handleAgregarLimite();
              }}
              className={buttonClasses.blueButton}
              variant="contained">
              Nuevo Limite
            </Button>
          </div>
        )}
      </SelectOFPlantAndProducts>
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Código Trazabilidad",
            field: "",
            render: (row: ILimites) => {
              return row?.codigoTrazabilidad.length > 0 ? row?.codigoTrazabilidad : "Sin codigo";
            }
          },
          {
            title: "Código Puesto",
            field: "",
            render: (row: ILimites) => {
              return row?.codigoPuesto.length > 0 ? row?.codigoPuesto : "Sin codigo puesto";
            }
          },
          {
            title: "Fecha",
            field: "",
            render: (row: any) => moment(row?.fecha).format("DD/MM/YYYY")
          },
          {
            title: "Generico",
            field: "",
            render: (row: ILimites) => {
              return genericos.find((gen) => gen?.id === row?.idGenerico)?.codigo;
            }
          },
          {
            title: "Torque mínimo",
            field: "",
            render: (row: ILimites) => {
              return row?.torqueMinimo !== null ? row?.torqueMinimo : "Sin torque mínimo";
            }
          },
          {
            title: "Torque máximo",
            field: "",
            render: (row: ILimites) => {
              return row?.torqueMaximo !== null ? row?.torqueMaximo : "Sin torque máximo";
            }
          },
          {
            title: "Crítico",
            field: "",
            render: (row) => {
              return row.instpuesto.critico ? (
                <IconButton disabled>
                  <Check color="success" />
                </IconButton>
              ) : (
                <IconButton disabled>
                  <Clear color="error" />
                </IconButton>
              );
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row: ILimites) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <Tooltip title="Editar/Eliminar">
                    <IconButton
                      onClick={() => {
                        setRow(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clonar">
                    <IconButton
                      onClick={() => {
                        setSelectedLimite(row);
                        setClonar(true);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }
          }
        ]}
        dataInfo={limites}
        //Collapse={true}
        buscar={true}
        Dense={true}
        filterWithSpecificValues={"Estado"}
      />
      <ModalCompoment title="Clonar limite a otro generico" openPopup={clonar} setOpenPopup={setClonar}>
        <ClonarForm closeModal={setCloseCL} limite={selectedLimite} refresh={getLimites} tipoUnidad={tipoUnidad} />
      </ModalCompoment>
      <ModalCompoment title="Detalle del limite" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <LimiteDialog limite={selectedLimite} callback={setModalOpen} refreshTable={getLimites} />
      </ModalCompoment>
      <ModalCompoment title="Creación del limite" openPopup={modalLimiteOpen} setOpenPopup={setModalLimiteOpen}>
        <LimiteCreate
          callback={setModalLimiteOpen}
          refreshTable={getLimites}
          indetidicadorL={identificadorLinea}
          productoId={productoId}
        />
      </ModalCompoment>
    </div>
  );
};
