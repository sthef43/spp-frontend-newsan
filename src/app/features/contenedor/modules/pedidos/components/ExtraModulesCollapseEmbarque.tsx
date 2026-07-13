import { Delete, Edit, ViewAgenda } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { IContEmbarque } from "app/models/IContEmbarque";
import { IContPlanProduccion } from "app/models/IContPlanProduccion";
import { TableComponent } from "app/shared/components/Table/TableComponent";

interface CollapseProps {
  row: IContPlanProduccion;
  onEditarEmbarque: (embarque: IContEmbarque) => void;
  onEliminarEmbarque: (embarque: IContEmbarque) => void;
  onAgregarEmbarque: (plan: IContPlanProduccion) => void;
  onVerContenedores: (embarque: IContEmbarque) => void;
}

export const ExtraModulesCollapseEmbarque = ({
  row,
  onEditarEmbarque,
  onEliminarEmbarque,
  onAgregarEmbarque,
  onVerContenedores
}: CollapseProps): JSX.Element => {
  return (
    <div className="my-2 mx-4 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew w-full">
      <div>
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Id",
              field: "id"
            },
            {
              title: "Embarque",
              field: "detalle"
            },
            {
              title: "Número",
              field: "numero"
            },
            {
              title: "Acciones",
              field: "",
              render: (embarque: IContEmbarque) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => { onEditarEmbarque(embarque); }}
                          size="small"
                          className="relative">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => { onEliminarEmbarque(embarque); }}
                          size="small"
                          className="relative">
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <Tooltip title="Contenedores">
                        <IconButton
                          onClick={() => {
                            onVerContenedores(embarque);
                          }}
                          size="small"
                          className="relative">
                          <ViewAgenda color="info" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className="flex items-center justify-center">
                      {embarque.contContenedor?.length ?? 0}
                    </div>
                  </div>
                );
              }
            }
          ]}
          agregar={() => { onAgregarEmbarque(row); }}
          dataInfo={row.contEmbarque ?? []}
        />
      </div>
    </div>
  );
};
