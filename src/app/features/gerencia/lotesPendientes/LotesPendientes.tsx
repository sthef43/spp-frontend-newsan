/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";

//import MaterialTable from "material-table";
import { Info } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
//import "../produccion/media.css";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ProduccionDialog } from "app/features/produccion/modules/gestionProduccion/modals/ProduccionDialog";
import { ProduccionCierreLote } from "app/features/produccion/modules/gestionProduccion/modals/ProduccionCierreLote";
import { CheckCircle } from "@mui/icons-material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import _ from "lodash";
import { IPedidoCierreLote } from "app/models/IPedidoCierreLote";
import { PedidoCierreLoteSliceRequests } from "app/Middleware/reducers/PedidoCierreLoteSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ProduccionEditDialog } from "app/features/admin/AdministrarPlanDeProduccion/Modals/ProduccionEditDialog";

export const LotesPendientes = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();
  const [DataOpen, setData] = useState<IPedidoCierreLote[]>(null);
  const [cargando, setCargando] = useState(true);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalEditOpen, setModalEditOpen] = React.useState(false);
  const [modalCierreLoteOpen, setModalCierreLoteOpen] = React.useState(false);

  const [selectedPlanProd, setSelectedPlanProd] = React.useState(0);
  const [selectedPedidoCierre, setSelectedPedidoCierre] = React.useState<IPedidoCierreLote>(null);

  const OnInit = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let fetchResult;
    try {
      fetchResult = unwrapResult(await dispatch(PedidoCierreLoteSliceRequests.getAllPedidoCierreLoteRequest()));
    } catch (error) {
      fetchResult = null;
    }
    if (fetchResult) {
      console.log("🚀 ~ file: ProduccionPage.tsx ~ line 46 ~ OnInit ~ fetchResult", fetchResult);
      setData(setEstadoLote(fetchResult));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const setRow = (id: number) => {
    setSelectedPlanProd(id);
    setModalOpen(true);
  };

  useEffect(() => {
    OnInit();
  }, []);

  //REFRESCO LA LISTA CUANDO CIERRO UN LOTE PARA TENER LA INFO ACTUALIZADA
  const refreshPage = React.useCallback(async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const fetchResult = unwrapResult(await dispatch(PedidoCierreLoteSliceRequests.getAllPedidoCierreLoteRequest()));
    if (fetchResult) {
      console.log(fetchResult);
      setData(setEstadoLote(fetchResult));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  }, []);

  const setEstadoLote = (data: IPedidoCierreLote[]) => {
    const varData: IPedidoCierreLote[] = [];
    data.map((x) => {
      const aux = _.cloneDeep(x);
      if (x.estadoPedido === "P") {
        aux.estadoPedido = "1";
      }
      if (x.estadoPedido === "R") {
        aux.estadoPedido = "2";
      }
      if (x.estadoPedido === "C") {
        aux.estadoPedido = "3";
      }
      varData.push(aux);
    });
    console.log("🚀 ~ file: GerenciaPage.tsx ~ line 82 ~ data.map ~ varData", varData);
    return varData;
  };

  const comprobarEstado = (pedidoCierre: IPedidoCierreLote) => {
    switch (pedidoCierre.estadoPedido) {
      case "1":
        return (
          <div>
            <IconButton
              onClick={() => {
                setSelectedPlanProd(pedidoCierre.idPlanProd);
                setSelectedPedidoCierre(pedidoCierre);
                setModalCierreLoteOpen(true);
              }}
              size="small"
              style={{ position: "relative" }}>
              <CheckCircle />
            </IconButton>
          </div>
        );
      // case "1":
      //   return (
      //     <div>
      //       <IconButton
      //         onClick={() => {
      //           setSelectedPlanProd(pedidoCierre.idPlanProd);
      //           setModalEditOpen(true);
      //         }}
      //         size="small"
      //         style={{ position: "relative" }}>
      //         <Edit />
      //       </IconButton>
      //     </div>
      //   );
      // case "3":
      //   if (pedidoCierre.cantidad - parseInt(pedidoCierre.cantidadProducida) > 0 && pedidoCierre.cantidadRechazos === 0) {
      //     return (
      //       <div>
      //         <IconButton
      //           onClick={() => {
      //             setSelectedPlanProd(pedidoCierre.idPlanProd);
      //             setModalCierreCondicionalOpen(true);
      //           }}
      //           size="small"
      //           style={{ position: "relative" }}>
      //           <CheckCircle />
      //         </IconButton>
      //       </div>
      //     );
      //   } else {
      //     return;
      //   }
    }
  };

  const verEstado = (estado: string) => {
    switch (estado) {
      case "1":
        return "Pendiente";
      case "2":
        return "Rechazado";
      case "3":
        return "Cerrado";
    }
  };

  React.useEffect(() => {
    TitleChanger("LOTES PENDIENTES");
  }, []);

  return (
    <div className="my-2 mx-4">
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Modelo",
            field: "idPlanProdNavigation.codigoModelo"
          },
          {
            title: "Lote",
            field: "idPlanProdNavigation.lote"
          },
          {
            title: "Numero-OP",
            field: "idPlanProdNavigation.numeroOp"
          },
          {
            title: "Cantidad",
            field: "idPlanProdNavigation.cantidad"
          },
          {
            title: "Producidos",
            field: "idPlanProdNavigation.cantidadProducida"
          },
          {
            title: "Pendiente",
            field: "",
            render: (row) => {
              return Number(row.idPlanProdNavigation.cantidad) - Number(row.idPlanProdNavigation.cantidadProducida);
            }
          },
          {
            title: "No conformes",
            field: "idPlanProdNavigation.cantidadRechazos"
          },
          {
            title: "Estado",
            field: "estadoPedido",
            render: (row) => {
              return verEstado(row.estadoPedido);
            },
            lookup: {
              "1": "Pendiente",
              "2": "Rechazado",
              "3": "Cerrado"
            }
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
                        setRow(row?.idPlanProdNavigation.idProduccion);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Info />
                    </IconButton>
                  </div>
                  {comprobarEstado(row)}
                </div>
              );
            }
          }
        ]}
        dataInfo={DataOpen}
        //Collapse={true}
        buscar={true}
        Dense={true}
        filterWithSpecificValues={"Estado"}
        // Watch={(rowData) => {
        //   setRow(rowData?.idProduccion);
        // }}
        rowStyle={(rowData) => {
          switch (rowData.estadoPedido) {
            case "1":
              return { padding: 1, backgroundColor: "#fdaf59", fontSize: 14 };
            case "2":
              return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
            case "3":
              return { padding: 1, backgroundColor: "#5dae3a", fontSize: 14 };
            default:
              return { padding: 1, fontSize: 14 };
          }
        }}
      />
      <ModalCompoment title="Detalle de lote" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <ProduccionDialog id={selectedPlanProd} />
      </ModalCompoment>
      <ModalCompoment title="Edición de lote" openPopup={modalEditOpen} setOpenPopup={setModalEditOpen}>
        <ProduccionEditDialog id={selectedPlanProd} setModalEditOpen={setModalEditOpen} callback={refreshPage} />
      </ModalCompoment>
      <ModalCompoment title="Cierre de lote" openPopup={modalCierreLoteOpen} setOpenPopup={setModalCierreLoteOpen}>
        <ProduccionCierreLote
          id={selectedPlanProd}
          callback={refreshPage}
          setOpenPopup={setModalCierreLoteOpen}
          esGerencia={true}
          selectedPedidoCierre={selectedPedidoCierre}
        />
      </ModalCompoment>
    </div>
  );
};
