import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";

interface props {
  listEtiquetasFijas: any;
  setEtiquetaFijaEditar: any;
  callbackEliminar: any;
}

export const TableOfEtiquetasFijas = ({ listEtiquetasFijas, setEtiquetaFijaEditar, callbackEliminar }: props) => {
  /*  useEffect(() => {
    getEtiquetasFijas();
  }, []); */

  const editar = (row) => {
    setEtiquetaFijaEditar(row);
  };

  return (
    <div>
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Tipo Etiqueta",
            field: "zpL_TipoEtiquetas.descripcionTipoEtiqueta"
          },
          {
            title: "Modelo",
            field: "modelo"
          },
          {
            title: "Tipo Unidad",
            field: "tipoUnidad"
          },
          {
            title: "Pre Fijo",
            field: "preFijo"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => {
                        editar(row);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Edit color="success" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => {
                        callbackEliminar(row.id);
                      }}
                      size="small"
                      style={{ position: "relative" }}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }
          }
          /*  {
            title: "Tipo Etiqueta",
            field: "zpl_tipoEtiquet"
          }, */
          /*  {
            title: "Usuario",
            field: "",
            render: (row) => {
              return getUser(row);
            }
          }, */
          /* {
            title: "Fecha Impresion",
            field: "",
            render: (row) => {
              return moment(row?.impresoFecha).format("L");
            }
          } */
        ]}
        dataInfo={listEtiquetasFijas}
      />
    </div>
  );
};
