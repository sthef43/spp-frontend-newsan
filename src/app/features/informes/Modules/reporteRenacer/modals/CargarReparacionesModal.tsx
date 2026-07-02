import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { IModelo } from "app/models/IModelo";
import FetchApi from "app/shared/helpers/FetchApi";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IRenacerReparaciones } from "app/models/IRenacerReparaciones";
import { RenacerReparacionesSliceRequest } from "app/Middleware/reducers/RenacerReparacioneSlice";
import { Sliders } from "app/shared/components/Sliders";
import { TableComponent } from "app/shared/components/Table/TableComponent";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
}

export const CargarReparacionesModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  const [expandend, setExpanded] = useState<string | false>(false);
  const [opcionSlider, setOpcionSlider] = useState<string>("Agregar");

  const [listaModelos, setListaModelos] = useState<IModelo[]>([]);
  FetchApi<IModelo[]>(ModeloSliceRequest.GetAllModelsActivateByRenacer, null, true, openModal, setListaModelos, true);

  const [registrosReparaciones, setRegistrosReparaciones] = useState<IRenacerReparaciones[]>([]);
  FetchApi<IRenacerReparaciones[]>(
    RenacerReparacionesSliceRequest.GetReparacionesGroupByPosicion,
    null,
    false,
    openModal,
    setRegistrosReparaciones
  );

  const onSubmit = async (data) => {
    const nuevaCargaProduccion = generarNuevaProduccion(data);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(RenacerReparacionesSliceRequest.PostRequest(nuevaCargaProduccion)));
      const responseRegistrosReparaciones = unwrapResult(
        await dispatch(RenacerReparacionesSliceRequest.getAllRequest())
      );
      if (response) {
        setRegistrosReparaciones(responseRegistrosReparaciones);
        setInputs();
        openNotificationUI("La reparacion se ingreso correctamente", "success");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const setInputs = () => {
    setValue("numeroTraza", "");
    setValue("estadoPlaca", "");
    setValue("posicion", "");
    setValue("cantidad", "");
  };

  const generarNuevaProduccion = (data: any) => {
    const nuevoObjeto: IRenacerReparaciones = {
      traza: data.numeroTraza,
      modelo: modeloSeleccionado,
      estado: data.estadoPlaca,
      posicion: data.posicion,
      cantidad: parseInt(data.cantidad)
    };
    if (nuevoObjeto !== null) {
      return nuevoObjeto;
    }
  };

  return (
    <main className="w-[45vw]">
      <section className="flex flex-col gap-y-4 w-full">
        <Sliders
          nameSlider="cargarReparaciones"
          titleSlider="Cargar Reparaciones"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
              <TextFieldComponent
                index={0}
                valueDefault=""
                nameInput="numeroTraza"
                labelInput="Ingrese el numero de traza"
                //requiredBool
                control={control}
                errors={errors}
              />
              <SelectComponent
                nameSelect="modeloSeleccionado"
                inputLabel="Seleccione un modelo"
                listaObjetos={listaModelos}
                valueLabel={(item) => item.nombre}
                valueSelect={(item) => item.nombre}
                ValueSave={setModeloSeleccionado}
                valueKey={(item) => item}
                control={control}
              />
              <TextFieldComponent
                index={1}
                valueDefault=""
                nameInput="estadoPlaca"
                labelInput="Ingrese el estado de la placa"
                //requiredBool
                control={control}
                errors={errors}
              />
              <TextFieldComponent
                index={2}
                valueDefault=""
                nameInput="posicion"
                labelInput="Ingrese la posicion"
                //requiredBool
                control={control}
                errors={errors}
              />
              <TextFieldComponent
                index={3}
                valueDefault=""
                nameInput="cantidad"
                labelInput="Ingrese la cantidad"
                //requiredBool
                control={control}
                errors={errors}
              />
              <section className="flex justify-center gap-x-4 mt-4">
                <div>
                  <Button type="submit" className={buttonClases.greenButton}>
                    Guardar
                  </Button>
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={() => {
                      setOpenModal(false);
                    }}
                    className={buttonClases.redButton}>
                    Cancelar
                  </Button>
                </div>
              </section>
            </form>
          }
        />
        <div className="w-full">
          {registrosReparaciones && (
            <>
              <Sliders
                nameSlider="registrosReparaciones"
                titleSlider="Registros De Reparacion Cargados"
                expandend={expandend}
                setExpanded={setExpanded}
                setOpcionSlider={setOpcionSlider}
                elementJSX={
                  <div className="w-full">
                    <TableComponent
                      IDcolumn="id"
                      buscar
                      dataInfo={registrosReparaciones}
                      columns={[
                        {
                          title: "Modelo",
                          field: "modelo"
                        },
                        {
                          title: "Estado",
                          field: "estado"
                        },
                        {
                          title: "Posicion",
                          field: "posicion"
                        },
                        {
                          title: "Cantidad",
                          field: "cantidad"
                        }
                      ]}
                    />
                  </div>
                }
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
};
