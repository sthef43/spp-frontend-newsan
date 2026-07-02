import { Check } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import moment from "moment";
import React from "react";

interface Props {
  setOpenModal: any;
  paradasDeLinea: IParadasDeLinea[];
}

export const ModalParadasDeLinea = ({ setOpenModal, paradasDeLinea }: Props) => {
  const classes = MaterialButtons();

  const onCancel = () => {
    setOpenModal(false);
  };

  return (
    <div className="m-1 sm:m-10 h-full">
      <TableComponent
        IDcolumn={"id"}
        columns={[
          {
            title: "Linea de producción",
            field: "lineaProduccion.nombre"
          },
          {
            title: "Código de modelo",
            field: "modelo.nombre"
          },
          {
            title: "Desde",
            field: "horaInicio"
          },
          {
            title: "Hasta",
            field: "horaFin"
          },
          {
            title: "Fecha",
            field: "",
            render: (row: any) => row && <div className="w-full">{moment(row?.fecha).format("YYYY-MM-DD")}</div>
          },
          {
            title: "Causa",
            field: "causa"
          },
          {
            title: "Area",
            field: "areaTraza.nombre"
          },
          {
            title: "Minutos",
            field: "minutos"
          },
          {
            title: "Supervisor",
            field: "supervisor"
          },
          {
            title: "Discontinuo?",
            field: "",
            render: (row: any) =>
              row && (
                <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
                  <div id="icono" className="col-span-2 text-right sm:text-left ">
                    {row.discontinuo ? (
                      <Tooltip title="Si">
                        <IconButton size="small">
                          <Check fontSize="small" color="success" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="No">
                        <IconButton size="small">
                          <Check fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )
          }
        ]}
        buscar
        dataInfo={paradasDeLinea}
      />
      <div className="my-2 flex justify-around ">
        <Button className={classes.greenButton} type="button" variant="contained" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
