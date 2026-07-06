/* eslint-disable react/display-name */
import { Edit, RemoveRedEye } from "@mui/icons-material";
//import MaterialTable from "material-table";
import React from "react";
import { IPlanProd } from "app/models/IPlanProd";
import { ControlLoteSliceRequests } from "app/Middleware/reducers/ControlLoteSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { IControlLote } from "app/models/IControlLote";
import { RechazosSlice } from "app/features/calidad/slices/RechazosSlice";
import { IconButton } from "@mui/material";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { RechazoEditDialog } from "app/features/calidad/modules/noConformePlacas/Modals/RechazoEditDialog";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { AccionVisualizarRechazos } from "app/features/calidad/modules/noConformePlacas/Modals/AccionVisualizarRechazos";

interface props {
  plan: IPlanProd;
}

export const RechazosTable = ({ plan }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const [datosControlLote, setdatosControlLote] = React.useState<IControlLote[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRechazo, setSelectedRechazo] = React.useState<IControlLote>(null);
  const [planProdDelRechazo, setPlanProdDelRechazo] = React.useState<IPlanProd>(null);
  const [modalOpenRechazos, setModalOpenRechazos] = React.useState(false);
  const estado = useAppSelector((state) => state.rechazados.estado as boolean);

  React.useEffect(() => {
    if (estado) {
      onInit();
      dispatch(RechazosSlice.actions.setOnInitFalse());
    }
  }, [estado]);

  const onInit = async () => {
    const fetchResult = unwrapResult(
      await dispatch(
        ControlLoteSliceRequests.getAllRechazosRequest({
          modeloA: plan?.numeroOp,
          modeloB: plan.lote
        })
      )
    );
    dispatch(RechazosSlice.actions.setAllRechazos({ data: fetchResult })); //setea el state de redux
    setdatosControlLote(fetchResult);
  };

  React.useEffect(() => {
    if (plan?.idProduccion) {
      onInit();
    }
  }, []);

  const cargarDatosPlanProd = () => {
    const varData = [];
    datosControlLote.map((inicio) => {
      const aux = {
        idControlLote: inicio?.idControlLote,
        Desde: inicio?.serieDesde,
        Hasta: inicio?.serieHasta
      };
      varData.push(aux);
    });
    return varData;
  };

  const findRechazo = (id: number): IControlLote => {
    const rechazado = datosControlLote.find(function (e) {
      return e.idControlLote == id;
    });
    return rechazado;
  };

  const getPlanProdDelRechazo = async (nroOp: string) => {
    let fetchPlanProdResult;
    try {
      fetchPlanProdResult = unwrapResult(await dispatch(PlanProdSliceRequests.getPlanprodByNumeroOpRequest(nroOp)));
    } catch (error) {
      fetchPlanProdResult = null;
    }
    if (fetchPlanProdResult) {
      setPlanProdDelRechazo(fetchPlanProdResult);
      console.log(
        "🚀 ~ file: NoConformesTable.tsx ~ line 46 ~ getPlanProdDelRechazo ~ fetchPlanProdResult",
        fetchPlanProdResult
      );
    }
  };

  const setRow = async (rowData: any) => {
    setSelectedRechazo(findRechazo(rowData?.idControlLote));
    await getPlanProdDelRechazo(datosControlLote.find((r) => r.idControlLote === rowData?.idControlLote).numeroOp);
    setModalOpen(true);
  };

  const algo = async (rowData) => {
    await setSelectedRechazo(findRechazo(rowData?.idControlLote));
    setModalOpenRechazos(true);
  };

  return (
    <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
      <div className="w-full flex justify-center ">
        <TitleUIComponent title="Números de serie rechazados" classNameDiv="w-full whitespace-wrap mx-0" />
      </div>
      <TableComponent
        buscar={true}
        IDcolumn={"idControlLote"}
        columns={[
          {
            title: "Desde",
            field: "Desde"
          },
          {
            title: "Hasta",
            field: "Hasta"
          },
          {
            title: "",
            field: "",
            render: (row) => (
              <div>
                <IconButton
                  onClick={() => {
                    setRow(row);
                  }}
                  size="small">
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => {
                    //setRow(row);
                    algo(row);
                  }}
                  size="small">
                  <RemoveRedEye />
                </IconButton>
              </div>
            )
          }
        ]}
        dataInfo={cargarDatosPlanProd()}
        //Collapse={true}
        // Edit={(row) => {
        //   setRow(row?.idControlLote);
        // }}
      />
      <ModalCompoment title="Editar rechazo" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <RechazoEditDialog
          controlLote={selectedRechazo}
          rechazados={datosControlLote}
          planProd={planProdDelRechazo}
          onInitRechazosTable={onInit}
          setOpenPopup={setModalOpen}
        />
      </ModalCompoment>
      <ModalCompoment title="Rechazos" openPopup={modalOpenRechazos} setOpenPopup={setModalOpenRechazos}>
        <div style={{ width: "900px" }}>
          <AccionVisualizarRechazos
            controlLote={selectedRechazo}
            rechazados={datosControlLote}
            planProd={planProdDelRechazo}
            //onInitRechazosTable={onInit}
            //setOpenPopup={setModalOpen}
          />
        </div>
      </ModalCompoment>
    </div>
  );
};
