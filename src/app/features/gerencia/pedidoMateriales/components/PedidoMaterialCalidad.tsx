import React from "react";
import { CheckCircle, Info } from "@mui/icons-material";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { PedidoMaterialCalidadDialog } from "app/features/gerencia/pedidoMateriales/modals/PedidoMaterialCalidadDialog";
import { IPedidoMaterialesCalidad } from "app/models/IPedidoMaterialesCalidad";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { IconButton } from "@mui/material";
import _ from "lodash";
import { PedidoMaterialesCalidadSliceRequests } from "app/Middleware/reducers/PedidoMaterialesCalidadSlice";
import { CalidadDialog } from "../../../calidad/components/CalidadDialog";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
/* import { ExportExcel } from "app/shared/components/helpComponents/ExportExcel"; */

export const PedidoMaterialCalidad = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = React.useState<IPedidoMaterialesCalidad[]>(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalPedidoMaterialesOpen, setModalPedidoMaterialesOpen] = React.useState(false);

  const [selectedControlLote, setSelectedControlLote] = React.useState(0);
  const [selectedPedidoMateriales, setSelectedPedidoMateriales] = React.useState<IPedidoMaterialesCalidad>(null);

  const OnInit = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    let fetchResult;
    try {
      fetchResult = unwrapResult(
        await dispatch(PedidoMaterialesCalidadSliceRequests.getAllPedidoMaterialesCalidadRequest())
      );
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
    setSelectedControlLote(id);
    setModalOpen(true);
  };

  React.useEffect(() => {
    OnInit();
  }, []);

  //REFRESCO LA LISTA CUANDO CIERRO UN LOTE PARA TENER LA INFO ACTUALIZADA
  const refreshPage = React.useCallback(async () => {
    const fetchResult = unwrapResult(
      await dispatch(PedidoMaterialesCalidadSliceRequests.getAllPedidoMaterialesCalidadRequest())
    );
    if (fetchResult) {
      console.log(fetchResult);
      setData(setEstadoLote(fetchResult));
    }
  }, []);

  const setEstadoLote = (data: IPedidoMaterialesCalidad[]) => {
    const varData: IPedidoMaterialesCalidad[] = [];
    data.map((x) => {
      const aux = _.cloneDeep(x);
      if (x.estadoPedido === "P") {
        aux.estadoPedido = "1";
      }
      if (x.estadoPedido === "R") {
        aux.estadoPedido = "2";
      }
      if (x.estadoPedido === "A") {
        aux.estadoPedido = "3";
      }
      varData.push(aux);
    });
    console.log("🚀 ~ file: PedidoMaterialesPAge.tsx ~ line 88 ~ data.map ~ varData", varData);
    return varData;
  };

  const comprobarEstado = (pedidoMateriales: IPedidoMaterialesCalidad) => {
    switch (pedidoMateriales.estadoPedido) {
      case "1":
        return (
          <div>
            <IconButton
              onClick={() => {
                setSelectedControlLote(pedidoMateriales.idControlLote);
                setSelectedPedidoMateriales(pedidoMateriales);
                setModalPedidoMaterialesOpen(true);
              }}
              size="small"
              style={{ position: "relative" }}>
              <CheckCircle />
            </IconButton>
          </div>
        );
    }
  };

  const verEstado = (estado: string) => {
    switch (estado) {
      case "1":
        return "Pendiente";
      case "2":
        return "Rechazado";
      case "3":
        return "Aprobado";
    }
  };

  return (
    <div>
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Modelo",
            field: "idControlLoteNavigation.codigoModelo"
          },
          {
            title: "Lote",
            field: "idControlLoteNavigation.lote"
          },
          {
            title: "Numero-OP",
            field: "idControlLoteNavigation.numeroOp"
          },
          {
            title: "No conformes",
            field: "idControlLoteNavigation.cantidadRechazos"
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
                        setRow(row?.idControlLoteNavigation?.idControlLote);
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
      <ModalCompoment title="Detalle de rechazo" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        {/* <ProduccionDialog id={selectedControlLote} esAdministracion={true} /> */}
        <CalidadDialog id={selectedControlLote} />
      </ModalCompoment>
      <ModalCompoment
        title="Detalles del pedido de Materiales"
        openPopup={modalPedidoMaterialesOpen}
        setOpenPopup={setModalPedidoMaterialesOpen}>
        <PedidoMaterialCalidadDialog
          selectedPedidoMateriales={selectedPedidoMateriales}
          setModalEditOpen={setModalPedidoMaterialesOpen}
          callback={refreshPage}
        />
      </ModalCompoment>
    </div>
  );
};
