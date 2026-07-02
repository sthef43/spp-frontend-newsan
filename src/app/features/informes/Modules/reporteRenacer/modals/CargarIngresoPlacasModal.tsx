/* eslint-disable unused-imports/no-unused-vars */
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { IModelo } from "app/models/IModelo";
import FetchApi from "app/shared/helpers/FetchApi";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { useAppDispatch } from "app/core/store/store";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IRenacerIngresoPlacas } from "app/models/IRenacerIngresoPlacas";
import { RenacerIngresoPlacaSliceRequest } from "app/Middleware/reducers/RenacerIngresoPlacasSlice";
import { Sliders } from "app/shared/components/Sliders";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
}

export const CargarIngresoPlacasModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
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
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const [expandend, setExpanded] = useState<string | false>(false);
  const [opcionSlider, setOpcionSlider] = useState<string>("Agregar");

  const [listaModelos, setListaModelos] = useState<IModelo[]>([]);
  FetchApi<IModelo[]>(ModeloSliceRequest.GetAllModelsActivateByRenacer, null, true, openModal, setListaModelos, true);

  const [ingresosPlacas, setIngresosPlacas] = useState<IRenacerIngresoPlacas[]>([]);
  const getAllPlacasRenacer = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await unwrapResult(await dispatch(RenacerIngresoPlacaSliceRequest.getAllRequest()));
      if (response) {
        setIngresosPlacas(response);
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
      const response = unwrapResult(await dispatch(RenacerIngresoPlacaSliceRequest.PostRequest(nuevaCargaProduccion)));
      const responseIngresoPlacas = unwrapResult(await dispatch(RenacerIngresoPlacaSliceRequest.getAllRequest()));
      if (response) {
        setIngresosPlacas(responseIngresoPlacas);
        setearInputs();
        openNotificationUI("Se cargo el ingreso de placas correctamente", "success");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const setearInputs = () => {
    setValue("numeroRemito", "");
    setValue("cantidadPlacas", "");
    setValue("comentarios", "");
  };

  const generarNuevaProduccion = (data: any) => {
    const nuevoObjeto: IRenacerIngresoPlacas = {
      fecha: fechaSeleccionada,
      remito: data.numeroRemito,
      modelo: modeloSeleccionado,
      cantidadPlacas: parseInt(data.cantidadPlacas),
      comentarios: data.comentarios
    };
    if (nuevoObjeto !== null) {
      return nuevoObjeto;
    }
  };

  const [cantidadTotal, setCantidadTotal] = useState(0);
  const calcularCantidadtotalPlacas = (listaRegistros: IRenacerIngresoPlacas[]) => {
    let cantidad = 0;
    listaRegistros.forEach((elementos) => {
      cantidad = cantidad += elementos.cantidadPlacas;
    });
    setCantidadTotal(cantidad);
  };

  useEffect(() => {
    if (openModal) {
      getAllPlacasRenacer();
    }
  }, [openModal]);

  return (
    <main className="w-[45vw]">
      <section className="flex flex-col gap-y-4 w-full">
        <Sliders
          nameSlider="Cargar"
          titleSlider="Cargar Ingreso Placas"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
              <SelectOfDate pickFecha setFechaProps={setFechaSeleccionada} />
              <TextFieldComponent
                index={0}
                valueDefault=""
                nameInput="numeroRemito"
                labelInput="Ingrese el numero de remito"
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
                nameInput="cantidadPlacas"
                labelInput="Ingrese la cantidad de placas"
                //requiredBool
                control={control}
                errors={errors}
              />
              <TextFieldComponent
                index={2}
                valueDefault=""
                nameInput="comentarios"
                labelInput="Ingrese un comentario"
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
        <div className="full">
          {ingresosPlacas && (
            <>
              <Sliders
                nameSlider="tablaDatos"
                titleSlider="Ingreso De Placas Cargadas"
                expandend={expandend}
                setExpanded={setExpanded}
                setOpcionSlider={setOpcionSlider}
                elementJSX={
                  <div>
                    <TitleUIComponent title={`Cantidad Total Ingresada: ${cantidadTotal}`} />
                    <TableComponent
                      IDcolumn="id"
                      buscar
                      dataInfo={ingresosPlacas}
                      columns={[
                        {
                          title: "Fecha",
                          field: "fecha"
                        },
                        {
                          title: "Remito",
                          field: "remito"
                        },
                        {
                          title: "Modelo",
                          field: "modelo"
                        },
                        {
                          title: "Cantidad Placas",
                          field: "cantidadPlacas"
                        },
                        {
                          title: "Comentarios",
                          field: "comentarios"
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
