/* eslint-disable react/display-name */
import React from "react";
import { IXXE_WIP_OT } from "app/models/IXXE_WIP_OT";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
// import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@material-ui/icons";
// import MaterialTable from "material-table";

interface props {
  ops: IXXE_WIP_OT[];
  setOpenPopup: any;
  setOpSeleccionada: any;
  limpiarCampos?: any;
}
interface nuevaData {
  wiP_ENTITY_NAME: string;
  starT_QUANTITY: string;
  segmenT1: string;
  quantitY_COMPLETED: string;
  cargado: boolean;
}

export const OpsTable = ({ ops, setOpenPopup, setOpSeleccionada, limpiarCampos }: props): JSX.Element => {
  const buttonClasses = MaterialButtons();
  const [nuevoOpArr, setNuevoOpArr] = React.useState<nuevaData[]>([]);

  //CREO LAS ROWS DE LA TABLA CUANDO CAMBIA LA SELECCION
  const createNewData = (rowOp: nuevaData) => {
    const varData = [];
    nuevoOpArr.map((op: nuevaData) => {
      if (op.wiP_ENTITY_NAME !== rowOp.wiP_ENTITY_NAME) {
        const aux = {
          ...op,
          cargado: false
        };
        varData.push(aux);
      } else {
        const aux = {
          ...rowOp
        };
        varData.push(aux);
      }
    });
    setNuevoOpArr(varData);
  };

  const handleSelectionChange = async (op) => {
    op.cargado = true;
    setOpSeleccionada(op);
    createNewData(op);
  };

  //CREO LAS ROWS DE LA TABLA LA PRIMERA VEZ
  const createData = () => {
    const varData = [];
    ops.map((op) => {
      const aux = {
        ...op,
        cargado: false
      };
      varData.push(aux);
    });
    setNuevoOpArr(varData);
  };

  React.useEffect(() => {
    createData();
  }, []);

  const handleDesmarcar = () => {
    createData(); //DESTILDA TODOS
    setOpSeleccionada(null); //LO BORRO DE LA REFERENCIA PARA QUE NO QUEDEN DATOS INCONSISTENTES
  };
  //cierro el dialog con la op ya seleccionada
  const handleOpSeleccionada = () => {
    setOpenPopup(false);
  };

  //cierro el modal y seteo en NULL la op para no generar inconsistencias
  const handleCancelar = () => {
    setOpSeleccionada(null); //LO BORRO DE LA REFERENCIA PARA QUE NO QUEDEN DATOS INCONSISTENTES
    limpiarCampos(); //borro los datos de la op que seleccione anteriormente
    setOpenPopup(false);
  };
  return (
    <div className="h-screen" style={{ height: "80vh", width: "70vw" }}>
      <TableComponent
        IDcolumn={"wiP_ENTITY_NAME"}
        columns={[
          {
            title: "Número de OP",
            field: "wiP_ENTITY_NAME"
          },
          {
            title: "Cantidad",
            field: "starT_QUANTITY"
          },
          {
            title: "Modelo",
            field: "segmenT1"
          },
          {
            title: "Cantidad Producida",
            field: "quantitY_COMPLETED"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={row?.cargado}
                          onChange={() => {
                            if (!row?.cargado) {
                              handleSelectionChange(row);
                            } else {
                              handleDesmarcar();
                            }
                          }}
                        />
                      }
                      label="Agregar"
                    />
                  </FormGroup>
                </div>
              );
            }
          }
        ]}
        dataInfo={nuevoOpArr}
        //Collapse={true}
        // rowStyle={(rowData) => {
        //   return rowData.cargando ?? { backgroundColor: "#2697F" };
        // }}
        buscar={true}
        Dense={true}
      />

      <div className="flex justify-center">
        <div className=" m-4">
          <Button
            className={buttonClasses.greenButton}
            type="submit"
            variant="contained"
            onClick={handleOpSeleccionada}>
            Guardar
          </Button>
        </div>
        <div className=" m-4 ">
          <Button className={buttonClasses.redButton} type="submit" variant="contained" onClick={handleCancelar}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
