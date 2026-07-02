import { Delete, Edit } from "@mui/icons-material";
import { DialogContent, IconButton, TextField, Tooltip } from "@mui/material";
import { PlanProdMaterialesSliceRequests } from "app/Middleware/reducers/PlanProdMaterialesSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISuperCargalinea } from "app/models";
import { IPlanProdMateriales } from "app/models/IPlanProdMateriales";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import moment from "moment";
import React from "react";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface prop {
  materiales: IPlanProdMateriales[];
  refresh?: () => void;
}

export const ProduccionMateriales = ({ materiales, refresh }: prop): JSX.Element => {
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [modalCargaMaterialesOpen, setModalCargaMaterialesOpen] = React.useState(false);
  const [selectedMaterial, setSelectedMaterial] = React.useState<ISuperCargalinea[]>([]);
  const row = React.useRef<IPlanProdMateriales>(null);
  const nuevaCantidad = React.useRef(0);
  const { getConfirmation } = useConfirmationDialog();

  const createData = () => {
    console.log(materiales);
    const varData = [];
    materiales.map((rech: IPlanProdMateriales) => {
      const aux = {
        ...rech
      };
    });
    return varData;
  };

  const handleEdit = async (cantidad) => {
    try {
      const response = await getConfirmation("Cantidad de material", "cant agregar", miBody(cantidad));
      console.log(response);
      if (!response) return;
      if (cantidad == nuevaCantidad.current) return;
      const planProd = row.current;
      const confirm = await getConfirmation("Actualizacion", "Esta seguro de actualizar el registro?");
      if (!confirm) return;
      planProd.cantidad = nuevaCantidad.current;
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const res = unwrapResult(await dispatch(PlanProdMaterialesSliceRequests.PutRequest(planProd)));
      if (!res) {
        throw new Error("No se actualizo el Registro");
      }
      openNotificationUI("Registro Actualizado Correctamente", "success");
      refresh();
      // materiales.map((material) => {
      //   if (material.id == planProd.id) {
      //     console.log(material.id);
      //     material.cantidad = planProd.cantidad;
      //   }
      // });
    } catch (error) {
      openNotificationUI("No Se pudo actualizar el registro", "error");
      console.error(error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onDelete = async (id) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (!confirm) return;
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const res = unwrapResult(await dispatch(PlanProdMaterialesSliceRequests.deleteRequest(id)));
      if (!res) {
        throw new Error("No se actualizo el Registro");
      }
      openNotificationUI("Registro Eliminado Correctamente", "success");
      refresh();
    } catch (error) {
      openNotificationUI("No Se pudo actualizar el registro", "error");
      console.error(error);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const miBody = (cantidad: number) => {
    const handleCantidadChange = async (e) => {
      const newCantidad = parseInt(e.target.value);
      nuevaCantidad.current = newCantidad;
    };

    return (
      <div>
        <DialogContent>
          <TextField
            label="Cantidad"
            type="number"
            variant="standard"
            defaultValue={cantidad}
            onChange={handleCantidadChange}
          />
        </DialogContent>
      </div>
    );
  };

  return (
    <div className="w-full">
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Fecha Pedido",
            field: "createdDate",
            render: (row) => <span>{moment(row.createdDate).format("DD-MM-YYYY")}</span>
          },
          {
            title: "Modelo",
            field: "codigoModelo"
          },
          {
            title: "Codigo Pauta",
            field: "codigoPautas"
          },
          {
            title: "Número de OP",
            field: "numeroOp"
          },
          {
            title: "Cantidad",
            field: "cantidad"
          },
          {
            title: "Solicitante",
            field: "nombreSupervisor"
          },
          {
            title: "Descripción",
            field: "descripcion"
          },
          {
            title: "Acciones",
            field: "",
            render: (rowData: any) => (
              <div className="flex w-full justify-end sm:justify-start gap-4">
                <div>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => {
                        console.log(rowData);
                        row.current = rowData;
                        nuevaCantidad.current = rowData.cantidad;
                        handleEdit(rowData.cantidad);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => {
                        onDelete(rowData.id);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            )
          }
        ]}
        dataInfo={materiales}
        //Collapse={true}
        // rowStyle={(rowData) => {
        //   return rowData.cargando ?? { backgroundColor: "#2697F" };
        // }}
        // buscar={true}
        Dense={true}
      />
      <br />
    </div>
  );
};
