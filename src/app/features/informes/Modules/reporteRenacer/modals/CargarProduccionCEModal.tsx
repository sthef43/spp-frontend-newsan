/* eslint-disable unused-imports/no-unused-vars */
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { TurnoSliceRequests } from "app/Middleware/reducers/TurnoSlice";
import { ITurno } from "app/models";
import { IModelo } from "app/models/IModelo";
import FetchApi from "app/shared/helpers/FetchApi";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { IRenacerProduccionCE } from "app/models/IRenacerProduccionCE";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { RenacerProduccionCESliceRequest } from "app/Middleware/reducers/RenacerProduccionCESlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Sliders } from "app/shared/components/Sliders";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
}

export const CargarProduccionCEModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
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
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const [expandend, setExpanded] = useState<string | false>(false);
  const [opcionSlider, setOpcionSlider] = useState<string>("Agregar");

  const [listaModelos, setListaModelos] = useState<IModelo[]>([]);
  FetchApi<IModelo[]>(ModeloSliceRequest.GetAllModelsActivateByRenacer, null, true, openModal, setListaModelos, true);

  const [listaTurnos, setListaTurnos] = useState<ITurno[]>([]);
  FetchApi<ITurno[]>(TurnoSliceRequests.getAllRequest, null, true, openModal, setListaTurnos);

  const [produccionCE, setProduccionCE] = useState<IRenacerProduccionCE[]>([]);
  const getAllCEProducidas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await unwrapResult(await dispatch(RenacerProduccionCESliceRequest.getAllRequest()));
      if (response) {
        setProduccionCE(response);
        calcularCantidadtotalPlacas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onSubmit = async (data) => {
    const nuevaCargaProduccion = generarNuevaProduccion(data);
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(RenacerProduccionCESliceRequest.PostRequest(nuevaCargaProduccion)));
      const refreshTable = unwrapResult(await dispatch(RenacerProduccionCESliceRequest.getAllRequest()));
      if (response) {
        setProduccionCE(refreshTable);
        openNotificationUI("Se cargo la produccion correctamente", "success");
        setValue("cantidad", "");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const generarNuevaProduccion = (data: any) => {
    const nuevoObjeto: IRenacerProduccionCE = {
      fecha: fechaSeleccionada,
      cantidad: parseInt(data.cantidad),
      familia: "E12IMB",
      modelo: modeloSeleccionado,
      turnoId: turnoSeleccionado
    };
    if (nuevoObjeto !== null) {
      return nuevoObjeto;
    }
  };

  const [cantidadTotal, setCantidadTotal] = useState(0);
  const calcularCantidadtotalPlacas = (listaRegistros: IRenacerProduccionCE[]) => {
    let cantidad = 0;
    listaRegistros.forEach((elementos) => {
      cantidad = cantidad += elementos.cantidad;
    });
    setCantidadTotal(cantidad);
  };

  useEffect(() => {
    if (openModal) {
      getAllCEProducidas();
    }
  }, [openModal]);

  return (
    <main className="w-[45vw]">
      <section className="flex flex-col gap-y-4 w-full">
        <Sliders
          nameSlider={"Cargar"}
          titleSlider="Formulario Cargar"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
              <SelectOfDate pickFecha setFechaProps={setFechaSeleccionada} />
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
              <SelectComponent
                control={control}
                nameSelect="turnoSeleccionado"
                inputLabel="Seleccione un turno"
                listaObjetos={listaTurnos}
                valueLabel={(item) => item.nombre}
                valueSelect={(item) => item.id}
                ValueSave={setTurnoSeleccionado}
                valueKey={(item) => item}
              />
              <TextFieldComponent
                index={3}
                valueDefault=""
                nameInput="cantidad"
                labelInput="Ingrese una cantidad"
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
          {produccionCE && (
            <>
              <Sliders
                nameSlider="tablaDatos"
                titleSlider="Produccion Cargada"
                expandend={expandend}
                setExpanded={setExpanded}
                setOpcionSlider={setOpcionSlider}
                elementJSX={
                  <div className="w-full">
                    <TitleUIComponent title={`Cantidad Total Ingresada: ${cantidadTotal}`} />
                    <TableComponent
                      IDcolumn="id"
                      buscar
                      dataInfo={produccionCE}
                      columns={[
                        {
                          title: "Fecha",
                          field: "fecha"
                        },
                        {
                          title: "Modelo",
                          field: "modelo"
                        },
                        {
                          title: "Familia",
                          field: "familia"
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
