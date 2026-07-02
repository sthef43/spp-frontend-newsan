import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { SupermaestroSliceRequest } from "app/Middleware/reducers/SupermaestroSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ISupermaestro } from "app/models/ISupermaestro";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useState } from "react";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { SupermaestroForm } from "../modals/SupermaestroForm";
interface Props {
  generico: string;
}

export const SupermaestroTable = ({ generico }: Props) => {
  const supermaestros: ISupermaestro[] = useAppSelector<ISupermaestro[]>((state) => state.supermaestro.dataAll);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState<ISupermaestro>();
  const { getConfirmation } = useConfirmationDialog();
  const onDelete = async (id: number) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        const resp = await dispatch(SupermaestroSliceRequest.deleteRequest(id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        const refresh = await dispatch(SupermaestroSliceRequest.getByGenerico(generico));
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const onEdit = (row) => {
    setEdit(row);
    setOpenModal(true);
  };
  return (
    <div>
      <TableComponent
        columns={[
          {
            title: "Genérico",
            field: "generico"
          },
          {
            title: "BPautas",
            field: "bPautas"
          },
          {
            title: "CodigoPautas",
            field: "codigoPautas"
          },
          {
            title: "BWip",
            field: "bWip"
          },
          {
            title: "CodigoWip",
            field: "codigoWip"
          },
          {
            title: "BAlternativo1",
            field: "bAlternativo1"
          },
          {
            title: "Alternativo1",
            field: "alternativo1"
          },
          {
            title: "BAlternativo2",
            field: "bAlternativo2"
          },
          {
            title: "Alternativo2",
            field: "alternativo2"
          },
          {
            title: "Puesto",
            field: "puesto"
          },
          {
            title: "Gaveta",
            field: "gaveta"
          },
          {
            title: "Descripcion",
            field: "descripcion"
          },
          {
            title: "DescripSector",
            field: "descripSector"
          },
          {
            title: "Area",
            field: "area"
          },
          {
            title: "CantidadMaterial",
            field: "cantidadMaterial"
          },
          {
            title: "StockGaveta",
            field: "stockGaveta"
          },
          {
            title: "StockSeguridad",
            field: "stockSeguridad"
          },
          {
            title: "Fecha",
            field: "fecha",
            render: (row) => {
              return moment(row.fecha).format("L");
            }
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
                          onEdit(row);
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
                          onDelete(row.idSupermaestro);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        IDcolumn={"idSupermaestro"}
        buscar
        dataInfo={supermaestros}
        Dense
        showFooter
        excel
      />
      <ModalCompoment title="Editar un elemento" openPopup={openModal} setOpenPopup={setOpenModal}>
        <SupermaestroForm dataEdit={edit} setOpenModal={setOpenModal} generico={generico} />
      </ModalCompoment>
    </div>
  );
};
