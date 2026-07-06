import React, { useCallback } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close, Info } from "@mui/icons-material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useAppDispatch } from "app/core/store/store";
import { IInstpuesto } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { PuestoDialog } from "./PuestoDialog";
import { PuestoCreate } from "./PuestoCreate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { InstpuestoSliceRequests } from "../../slices/InstpuestoSlice";
// import { ProduccionDialog } from "../produccion/produccionDialog/ProduccionDialog";

export const PuestosCrud = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalPuestoOpen, setModalPuestoOpen] = React.useState(false);
  const [selectedPuesto, setSelectedPuesto] = React.useState<IInstpuesto>(null);
  const [productoId, setProductoId] = React.useState<number>(0);
  const [puestos, setPuestos] = React.useState<IInstpuesto[]>([]);

  const onGetPuestos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const fetchPuestosResult = unwrapResult(
        await dispatch(InstpuestoSliceRequests.GetAllByProductoIdRequest(productoId))
      );
      setPuestos(fetchPuestosResult);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const setRow = (puesto: IInstpuesto) => {
    setSelectedPuesto(puesto);
    setModalOpen(true);
  };

  const handleAgregarPuesto = () => {
    setModalPuestoOpen(true);
  };
  const productoCB = useCallback((productId) => {
    setProductoId(productId);
  }, []);

  React.useEffect(() => {
    productoId != 0 && onGetPuestos();
  }, [productoId]);
  React.useEffect(() => {
    TitleChanger("Puestos de torque");
  }, []);

  return (
    <div>
      <div>
        <SelectOFPlantAndProducts setProductoId={productoCB} />
      </div>
      {productoId != 0 && (
        <div className="text-end animate__animated animate__fadeInUp">
          <TableComponent
            IDcolumn={"idInstpuesto"}
            columns={[
              {
                title: "Código Puesto",
                field: "codigoPuesto"
              },
              {
                title: "Descripción",
                field: "descripcion"
              },
              {
                title: "Sector",
                field: "sector"
              },
              {
                title: "Tipo",
                field: "tipo"
              },
              {
                title: "Crítico",
                field: "",
                render: (row) =>
                  row.critico ? (
                    <Tooltip title="Verdadero">
                      <IconButton>
                        <Check color="success" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Falso">
                      <IconButton>
                        <Close color="error" />
                      </IconButton>
                    </Tooltip>
                  )
              },
              {
                title: "Acciones",
                field: "",
                render: (row: IInstpuesto) => {
                  return (
                    <div className="flex w-full justify-end sm:justify-start gap-4">
                      <div>
                        <IconButton
                          onClick={() => {
                            setRow(row);
                          }}
                          size="small"
                          style={{ position: "relative" }}>
                          <Info />
                        </IconButton>
                      </div>
                    </div>
                  );
                }
              }
            ]}
            dataInfo={puestos}
            //Collapse={true}
            buscar={true}
            Dense={true}
            filterWithSpecificValues={"Estado"}
            agregar={handleAgregarPuesto}
          />
          <ModalCompoment title="Detalle del puesto" openPopup={modalOpen} setOpenPopup={setModalOpen}>
            <PuestoDialog puesto={selectedPuesto} callback={setModalOpen} refreshTable={onGetPuestos} />
          </ModalCompoment>
          <ModalCompoment title="Creación del puesto" openPopup={modalPuestoOpen} setOpenPopup={setModalPuestoOpen}>
            <PuestoCreate callback={setModalPuestoOpen} refreshTable={onGetPuestos} productoId={productoId} />
          </ModalCompoment>
        </div>
      )}
    </div>
  );
};
