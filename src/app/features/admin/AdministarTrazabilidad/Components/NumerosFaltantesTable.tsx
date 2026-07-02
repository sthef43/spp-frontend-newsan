/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react/display-name */
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
//import MaterialTable from "material-table";
import React from "react";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { IInicio } from "app/models";
import produce from "immer";
import { IconButton } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { AgregarTrazabilidad } from "app/features/admin/AdministarTrazabilidad/Components/AgregarTrazabilidad";

interface props {
  producidos: IInicio[];
  fecha: string;
  turno: string;
  codigoInicio: string;
  refreshProducidos: any;
  type: string;
}

export const NumerosFaltantesTable = ({
  producidos,
  fecha,
  turno,
  codigoInicio,
  refreshProducidos,
  type
}: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const [opsDelDia, setOpsDelDia] = React.useState<string[]>([]);
  const [faltantes, setFaltantes] = React.useState<IInicio[]>([]);
  const [opSelect, setOpSelect] = React.useState<boolean>(false);
  const [selectedFaltante, setSelectedFaltante] = React.useState<IInicio>(null);
  const [modalAddFaltante, setModalAddFaltante] = React.useState(false);

  const ordenarNumeros = (producidosAux: IInicio[]): IInicio[] => {
    const numerosOrdenados: IInicio[] = JSON.parse(JSON.stringify(producidosAux));

    const ordenados = numerosOrdenados.sort((a: IInicio, b: IInicio): number => {
      return a.codigoNewsan.localeCompare(b.codigoNewsan);
    });
    return ordenados;
  };

  //Inserta los 0 faltantes al codigoNewsan. En este caso, debe tener una longitud de 7.
  const getNumero = (numeroFaltante: string) => {
    const longitudDeseada = 7;
    const cerosNecesarios = longitudDeseada - numeroFaltante.length;

    const num = numeroFaltante.padStart(longitudDeseada, "0".repeat(cerosNecesarios));
    return num;
  };

  const calcularFaltantes = (producidosAux: IInicio[], ultimo: IInicio) => {
    const faltantesAux: IInicio[] = [];
    const numerosOrdenados = ordenarNumeros(producidosAux);
    let numerCompletadoConCerosString;
    // compara con el ultimo del dia anterior
    let numcodigonewsan = producidosAux[producidosAux.length - 1]?.codigoNewsan;
    numcodigonewsan = numcodigonewsan.substring(8);
    const prefijocodigonewsan = producidosAux[producidosAux.length - 1]?.codigoNewsan.substring(0, 8);

    //Compara el ultimo numero contra el ante ultimo.
    if (
      parseInt(numcodigonewsan) - parseInt(ultimo?.codigoNewsan.substring(8)) !== 1 &&
      ultimo?.nroOp === producidosAux[0]?.nroOp
    ) {
      const numeroCalcular = parseInt(producidosAux[producidosAux.length - 1]?.codigoNewsan.substring(8)) - 1; //Al numero, le resto 1. Ese es el que falta!
      numerCompletadoConCerosString = getNumero(numeroCalcular.toString()); //Al numero, le inserto los 0 restantes, tiene q tener 7 digitos.
      const nuevoFaltantee = {
        ...producidosAux[producidosAux.length - 1],
        codigoNewsan: prefijocodigonewsan + numerCompletadoConCerosString
      };
      faltantesAux.push(nuevoFaltantee);
    }
    // compara los del dia actual

    for (let index = 1; index < numerosOrdenados.length; index++) {
      const faltante = numerosOrdenados[index];
      //Si el numero que estoy paradao menos el anterior, da diferente de 1 y tienen la misma op, es por que faltan numeros.
      if (
        parseInt(faltante.codigoNewsan.substring(8)) -
          parseInt(numerosOrdenados[index - 1].codigoNewsan.substring(8)) !==
          1 &&
        faltante.nroOp === numerosOrdenados[index - 1].nroOp
      ) {
        const numeroCalcular = parseInt(faltante.codigoNewsan.substring(8)) - 1; //Al numero, le resto 1. Ese es el que falta!
        numerCompletadoConCerosString = getNumero(numeroCalcular.toString()); //Al numero, le inserto los 0 restantes, tiene q tener 7 digitos.
        let nuevoFaltantee = {
          ...faltante,
          codigoNewsan: prefijocodigonewsan + numerCompletadoConCerosString //El prefijo + el numero debe tener una longitud de caracteres de 15.
        };
        faltantesAux.push(nuevoFaltantee);
        while (
          parseInt(nuevoFaltantee.codigoNewsan.substring(8)) -
            parseInt(numerosOrdenados[index - 1].codigoNewsan.substring(8)) !==
            1 &&
          nuevoFaltantee.nroOp === numerosOrdenados[index - 1].nroOp
        ) {
          const numeroCalcular = parseInt(nuevoFaltantee.codigoNewsan.substring(8)) - 1; //Al numero, le resto 1. Ese es el que falta!
          numerCompletadoConCerosString = getNumero(numeroCalcular.toString()); //Al numero, le inserto los 0 restantes, tiene q tener 7 digitos.
          const aux = {
            ...nuevoFaltantee,
            idInicio: nuevoFaltantee.idInicio++,
            codigoNewsan: prefijocodigonewsan + numerCompletadoConCerosString
          };
          faltantesAux.push(aux);
          nuevoFaltantee = {
            ...nuevoFaltantee,
            codigoNewsan: prefijocodigonewsan + numerCompletadoConCerosString
          };
        }
      }
    }

    setFaltantes(
      produce((draft: IInicio[]) => {
        draft.push(...faltantesAux);
      })
    );
  };

  const getUltimoProducido = async (modelo: string) => {
    let fetchUltimoInicioResult: IInicio;
    try {
      fetchUltimoInicioResult = unwrapResult(
        await dispatch(
          InicioSliceRequests.getUltimoInicioByLineaRequest({
            codigoLinea: codigoInicio,
            fechaActual: fecha,
            modelo: modelo
          })
        )
      );
    } catch (error) {
      fetchUltimoInicioResult = null;
    }
    if (fetchUltimoInicioResult) {
      return fetchUltimoInicioResult;
    }
  };

  const calcularFaltantesPorOp = () => {
    opsDelDia.map(async (op) => {
      const producidosByOp = producidos.filter((prod) => {
        return prod.nroOp === op;
      });
      const ultimo = await getUltimoProducido(producidos[0].modeloFin);
      calcularFaltantes(producidosByOp, ultimo);
    });
  };

  const onInit = async () => {
    let fetchOpsDelDiaResult;
    try {
      fetchOpsDelDiaResult = unwrapResult(
        await dispatch(
          InicioSliceRequests.getAllOpsDelDiaRequest({
            fecha: fecha,
            turno: turno,
            codigoInicio: codigoInicio
          })
        )
      );
    } catch (error) {
      fetchOpsDelDiaResult = null;
    }
    if (fetchOpsDelDiaResult) {
      setOpsDelDia(fetchOpsDelDiaResult);
      setOpSelect(true);
    }
  };

  React.useEffect(() => {
    onInit();
  }, []);

  React.useEffect(() => {
    if (opsDelDia.length > 0) {
      calcularFaltantesPorOp();
    }
  }, [opsDelDia]);

  const setRow = (id: number) => {
    const numeroSelected = faltantes.find((f) => f.idInicio === id);

    setSelectedFaltante(numeroSelected);
    setModalAddFaltante(true);
  };

  return (
    <div>
      <div className="p-4 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew shadow-md">
        <div className="w-full flex justify-center ">
          <TitleUIComponent
            title={faltantes.length > 0 ? "Números de serie faltantes" : "Sin números faltantes"}
            classNameDiv="w-full whitespace-wrap mx-0"
          />
        </div>
        {faltantes.length > 0 && (
          <TableComponent
            IDcolumn={"idInicio"}
            columns={[
              {
                title: "Números Faltantes",
                field: "codigoNewsan"
              },
              {
                title: "Número de OP",
                field: "nroOp"
              },
              {
                title: "Acciones",
                field: "",
                render: (rowData: any) =>
                  rowData &&
                  type == "N" && (
                    <div className="w-full grid grid-cols-3 sm:grid-cols-2 gap-4">
                      <div id="icono" className="col-span-2 text-right sm:text-left ">
                        <IconButton
                          onClick={() => {
                            setRow(rowData?.idInicio);
                          }}
                          size="small">
                          <AddCircle fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  )
              }
            ]}
            dataInfo={faltantes}
            Dense={true}
          />
        )}
        <ModalCompoment title="Agregar número faltante" openPopup={modalAddFaltante} setOpenPopup={setModalAddFaltante}>
          {/* <EditProducidoDialog numeroEscaneado={selectedProducido} setOpenPopup={setModalEditProducido} /> */}
          <AgregarTrazabilidad
            setModalAddFaltante={setModalAddFaltante}
            faltante={selectedFaltante}
            refreshTable={calcularFaltantesPorOp}
            refreshProducidos={refreshProducidos}
            fechaFilter={fecha}
          />
        </ModalCompoment>
      </div>
    </div>
  );
};
