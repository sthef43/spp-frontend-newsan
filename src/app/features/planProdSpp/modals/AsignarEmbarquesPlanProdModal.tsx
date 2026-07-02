import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import FetchApi from "app/shared/helpers/FetchApi";
import { PlanProdSppEmbarqueSlice, PlanProdSppEmbarqueSliceRequest } from "../reducers/PlanProdSppEmbarqueSlice";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { Control, UseFormSetValue, FieldValues, UseFormWatch } from "react-hook-form";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  watchFather?: UseFormWatch<FieldValues>;
}

export const AsignarEmbarquesPlanProdModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  controlFather,
  setValuesFather,
  watchFather
}) => {
  const embarquesEnLista = useAppSelector((state) => state.planProdSppEmbarques.preCarga);

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { debounceTime } = UseUtilHooks();

  const watchNumeroEmbarque = watchFather("busquedaEmbarque");
  const activarBusqueda = debounceTime(watchNumeroEmbarque, 500);

  const [listaEmbarques, setListaEmbarques] = useState<IPlanProdSppEmbarque[]>([]);
  FetchApi<IPlanProdSppEmbarque[]>(
    PlanProdSppEmbarqueSliceRequest.SearchShipmentByNumber,
    watchNumeroEmbarque,
    true,
    activarBusqueda,
    setListaEmbarques,
    true
  );

  const listaPreCargarEmbarques = (embarque: IPlanProdSppEmbarque) => {
    dispatch(PlanProdSppEmbarqueSlice.actions.setDataEmbarques(embarque));
  };

  const eliminarDeLaLista = (embarqueId: number) => {
    dispatch(PlanProdSppEmbarqueSlice.actions.setDeleteEmbarque(embarqueId));
  };

  return (
    <main className="w-[60vw]">
      <section className="flex flex-col gap-y-4">
        <div>
          <TextFieldComponent
            control={controlFather}
            index={0}
            nameInput="busquedaEmbarque"
            valueDefault=""
            labelInput="Ingrese el numero del embarque"
          />
        </div>
        <div className="flex flex-col gap-y-4">
          {listaEmbarques.map((elementos) => {
            const yaAgregados = embarquesEnLista.some((elementosEnLista) => {
              return elementos.id === elementosEnLista.id;
            });
            return (
              <div className="bg-background p-2 flex flex-col" key={elementos.id}>
                <ul className="grid grid-cols-4 justify-items-center w-full items-center">
                  <li>Nombre: {elementos.nombreEmbarque}</li>
                  <li>N°: {elementos.numeroEmbarque}</li>
                  <li>Estado: {elementos.estadoEmbarque.nombre}</li>
                  <li>
                    {!yaAgregados ? (
                      <Tooltip title="Agregar Embarque">
                        <IconButton
                          onClick={() => {
                            listaPreCargarEmbarques(elementos);
                          }}
                          style={{ position: "relative" }}
                          size="small">
                          <Add color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Eliminar de la lista">
                        <IconButton
                          onClick={() => {
                            eliminarDeLaLista(elementos.id);
                          }}
                          style={{ position: "relative" }}
                          size="small">
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </section>
      <div className="flex justify-center w-full mt-4">
        <Button
          className={buttonClases.blueButton}
          onClick={() => {
            setOpenModal(false);
          }}>
          Atras
        </Button>
      </div>
    </main>
  );
};
