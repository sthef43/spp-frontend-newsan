/* eslint-disable react/display-name */
//import MaterialTable from "material-table";
import React from "react";
import { ISuperCargalinea } from "app/models/ISuperCargalinea";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { SuperCargalineaSliceRequests } from "app/Middleware/reducers/SuperCargalineaSlice";

import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { MaterialButtons } from "../../../shared/components/material-ui/MaterialButtons";
import { TableComponent } from "../../../shared/components/Table/TableComponent";
import { Button, Checkbox, DialogContent, FormControlLabel, FormGroup, TextField } from "@mui/material";
import produce from "immer";

interface props {
  numeroOp: string;
  cantidadEquipos: number;
  setSelectedMaterial: any;
  setOpenPopup: any;
}

export const MaterialesDialog = ({
  numeroOp,
  cantidadEquipos,
  setSelectedMaterial,
  setOpenPopup
}: props): JSX.Element => {
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const [superCargalinea, setSuperCargalinea] = React.useState<ISuperCargalinea[]>([]); //LISTA DE MATERIALES
  const [auxSuperCargalinea, setAuxSuperCargalinea] = React.useState<any>([]);
  const [listaMaterialesAux, setlistaMaterialesAux] = React.useState<ISuperCargalinea[]>([]); //LISTA DE MATERIALES
  const [cantidad] = React.useState<number>(cantidadEquipos);

  const cargarDatosMateriales = async () => {
    let fetchSuperCargalineaResult: ISuperCargalinea[];
    try {
      fetchSuperCargalineaResult = unwrapResult(await dispatch(SuperCargalineaSliceRequests.getByNumeroOp(numeroOp)));
    } catch (error) {
      fetchSuperCargalineaResult = null;
    }
    if (fetchSuperCargalineaResult) {
      setSuperCargalinea(fetchSuperCargalineaResult);
    }
  };

  React.useEffect(() => {
    cargarDatosMateriales();
  }, []);

  const checkIfIn = (material): boolean => {
    return listaMaterialesAux.filter((e) => e.codigoPautas == material.codigoPautas).length > 0;
  };

  const checkSeleccionado = (id: number) => {
    console.log(
      "Return del check selected",
      listaMaterialesAux.some((e) => e.idSupercargalinea == id)
    );
    return listaMaterialesAux.some((e) => e.idSupercargalinea == id);
  };

  //CREO LAS ROWS DE LA TABLA
  const createData = () => {
    const varData = [];
    superCargalinea.map((material) => {
      const aux = {
        ...material,
        cargado: false
      };
      varData.push(aux);
    });
    return varData;
  };
  React.useEffect(() => {
    setAuxSuperCargalinea(createData());
  }, [superCargalinea]);

  const miBody = (material) => {
    const handleCantidadChange = async (e) => {
      console.log(e);
      material.cantidadMaterial = parseInt(e.target.value);
      console.log(material);
    };

    return (
      <div>
        <DialogContent>
          <TextField
            label="Cantidad"
            type="number"
            variant="standard"
            defaultValue={material?.cantidadMaterial * cantidad}
            onChange={(e) => handleCantidadChange(e)}
          />
        </DialogContent>
      </div>
    );
  };

  const eliminarMaterial = (material) => {
    console.log(material);
    if (listaMaterialesAux.length > 0) {
      const newArray = listaMaterialesAux.filter(function (e) {
        return e.codigoPautas !== material.codigoPautas;
      });
      setlistaMaterialesAux(newArray);
    }
  };

  const handleSelectionChange = async (material) => {
    const cantidadMinima = material.cantidadMaterial * cantidad;
    const response = await getConfirmation("Cantidad de material", "cant agregar", miBody(material));
    if (!response) {
      material.cargado = false;
      eliminarMaterial(material);
    } else {
      material.cargado = true;
      setlistaMaterialesAux(
        produce((draft) => {
          debugger;
          const auxMaterialDraf = JSON.parse(JSON.stringify(material));
          if (auxMaterialDraf.cantidadMaterial < cantidadMinima) {
            auxMaterialDraf.cantidadMaterial = auxMaterialDraf.cantidadMaterial * cantidad;
          }
          draft.push(auxMaterialDraf);
        })
      );
    }
    setAuxSuperCargalinea(
      produce((draft: ISuperCargalinea[]) => {
        const auxdraft = draft.find((x) => x.idSupercargalinea == material.idSupercargalinea);
        auxdraft.cargado = material.cargado;
        // auxdraft.cantidadMaterial = material.cantidadMaterial * cantidad;
      })
    );
  };

  const handleDesmarcar = (material) => {
    eliminarMaterial(material);

    setAuxSuperCargalinea(
      produce((draft: ISuperCargalinea[]) => {
        const auxdraft = draft.find((x) => x.idSupercargalinea == material.idSupercargalinea);
        auxdraft.cargado = false;
        // auxdraft.cantidadMaterial = material.cantidadMaterial;
      })
    );
  };

  //asigno la lista de materiales y cierro el modal
  const handleGuardarMateriales = () => {
    setSelectedMaterial(listaMaterialesAux);
    console.log(listaMaterialesAux, "materiales");
    setOpenPopup(false);
  };

  //cierro el modal solamente
  const handleCancelarMateirales = () => {
    setOpenPopup(false);
  };

  return (
    <div style={{ width: "78vw" }}>
      <TableComponent
        buscar={true}
        IDcolumn={"idSupercargalinea"}
        columns={[
          {
            title: "Código",
            field: "codigoPautas"
          },
          {
            title: "Descripcion",
            field: "descripcion"
          },
          {
            title: "Sector",
            field: "descripSector"
          },
          {
            title: "Accion",
            field: "",
            render: (row) => (
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" checked={row.cargado} />}
                  label="Agregar"
                  onChange={() => {
                    if (!checkIfIn(row)) {
                      handleSelectionChange(row);
                    } else {
                      handleDesmarcar(row);
                    }
                  }}
                />
              </FormGroup>
            )
          }
        ]}
        dataInfo={auxSuperCargalinea}
        Dense={true}
      />
      <div className="flex justify-center">
        <div className=" m-4">
          <Button
            className={buttonClasses.greenButton}
            type="submit"
            variant="contained"
            onClick={handleGuardarMateriales}>
            Guardar
          </Button>
        </div>
        <div className=" m-4 ">
          <Button
            className={buttonClasses.redButton}
            type="submit"
            variant="contained"
            onClick={handleCancelarMateirales}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
