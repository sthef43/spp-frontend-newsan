/* eslint-disable unused-imports/no-unused-vars */
import React, { Suspense, useEffect, useState } from "react";
import FetchApi from "app/shared/helpers/FetchApi";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { ModalPruebas } from "../Modals/Pruebas/ModalPruebas";
import { UseGeneratorCodesForLabels } from "app/shared/hooks/useGeneratorCodesForLabels";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { Info, InfoRounded } from "@mui/icons-material";
import { StepperComponent } from "app/shared/helpers/ComponentsMUIModify/StepperComponent";
import { useAppDispatch } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICLISectores } from "../Models/ICLISectores";
import { SelectComponentForm } from "app/shared/helpers/ComponentsForForms/SelectComponentForm";
import { useForm } from "react-hook-form";
import { CLISectoresSliceRequest } from "../Middlewares/CliSectoresSlice";

const fakeData1 = [
  {
    id: 1,
    name: "sector1",
    completado: true
  },
  {
    id: 2,
    name: "sector2",
    completado: false
  },
  {
    id: 3,
    name: "sector3",
    completado: false
  },
  {
    id: 4,
    name: "sector4",
    completado: true
  },
  {
    id: 5,
    name: "sector5",
    completado: false
  }
];

const fakeData2 = [
  {
    id: 1,
    name: "sector1",
    completado: true
  },
  {
    id: 10,
    name: "sector2",
    completado: false
  },
  {
    id: 11,
    name: "sector3",
    completado: false
  },
  {
    id: 2,
    name: "sector4",
    completado: true
  },
  {
    id: 3,
    name: "sector5",
    completado: false
  }
];

export const Pruebas = () => {
  const stylesTool: React.CSSProperties = {
    width: "25rem"
  };

  const { control, watch } = useForm();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const [listaContenedore, setListaContenedores] = useState<ICLISectores[]>([]);
  const [listaSectores, setListaSectores] = useState<ICLISectores[]>([]);
  const [listaSectoresModificada, setListaSectoresModificada] = useState([]);
  const [cantidadAprobados, setCantidadAprobados] = useState(0);

  const [pruebaSelect, setPruebaSelect] = useState<Array<string | number>>([]);

  const { generateLpnWitPrefixCode } = UseGeneratorCodesForLabels();
  const { generateSeriesNumbers, validateOrReplaceWithRegex } = UseUtilHooks();

  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, null, setListaSectores);
  FetchApi<ICLISectores[]>(CLISectoresSliceRequest.getAllRequest, null, false, null, setListaContenedores);

  const getAllModify = async () => {
    const lista = [];
    try {
      const response = unwrapResult(await dispatch(CLISectoresSliceRequest.getAllRequest()));
      if (response) {
        response.map((elementos, index) => {
          if (index < 5) {
            const aux = {
              ...elementos,
              completado: false
            };
            lista.push(aux);
          }
        });
        setCantidadAprobados(0);
        setListaSectoresModificada(lista);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { formatDateHourOrMinutes } = UseUtilHooks();

  const pruebaDeCompnentes = () => {
    const sd = generateLpnWitPrefixCode(7, "SD-");
    console.log(sd);
  };

  //LO QUE FALTA POR PROBAR DEL COMPONENTE Stepper SERIA QUE LOS BOTONES DE ATRAS Y ADELANTE FUNCIONEN DE FORMA LOGIACA
  const probarBotonesNext = (): void => {
    const clonLista = [...listaSectoresModificada];
    const elementoEncontrado = clonLista.find((sectores) => sectores.completado == false);
    const newList = clonLista.map((elementos) => {
      if (elementoEncontrado && elementoEncontrado.id == elementos.id) {
        elementos.completado = true;
        return elementos;
      } else {
        return elementos;
      }
    });
    actualizarCantidadAprobados(newList);
    setListaSectoresModificada(newList);
  };

  const probarBotonBack = (): void => {
    const clonLista = [...listaSectoresModificada];
    const elementoEncontrado = clonLista.filter((sectores) => sectores.completado == true);
    const newList = clonLista.map((elementos) => {
      const ultimoElementoFiltrado = elementoEncontrado.at(-1);
      if (ultimoElementoFiltrado && ultimoElementoFiltrado.id == elementos.id) {
        elementos.completado = false;
        return elementos;
      } else {
        return elementos;
      }
    });
    actualizarCantidadAprobados(newList);
    setListaSectoresModificada(newList);
  };

  const actualizarCantidadAprobados = (listaSectores: any[]) => {
    const cantidadNuevaAprobados = listaSectores.filter((elementos) => elementos.completado).length;
    setCantidadAprobados(cantidadNuevaAprobados);
  };

  const pruebaGenerarSeries = () => {
    const sd = generateSeriesNumbers("07515", "30000", "30005");
    console.log(sd);
  };

  const pruebaRegex = () => {
    const sd = validateOrReplaceWithRegex("2512CEI12ITA05135", { typeRegex: "lettersAndNumbers" }, "replace");
    console.log(sd);
  };

  const funcionItemTerminado = (item: any) => {
    console.log(item);
  };

  useEffect(() => {
    getAllModify();
  }, []);

  console.log(pruebaSelect);

  return (
    <main className="w-full p-4">
      {listaContenedore && listaContenedore.length > 0 && (
        <SelectComponentForm
          control={control}
          activeMultiple={true}
          setMultiplesValues={setPruebaSelect}
          label="Seleccione un contenedor"
          listItems={listaContenedore}
          name="multiSelect"
          valueLabel={(item) => item.jefeSector}
          valueSelect={(item) => item.id}
        />
      )}
      <h1>hola mundo</h1>
      <div className="flex flex-row gap-2">
        <button onClick={() => setOpenModal(true)}>abrir Modal</button>
        <button
          onClick={() => {
            pruebaDeCompnentes();
          }}>
          Generar lpn
        </button>
        <button onClick={() => pruebaGenerarSeries()}>Generar numero de series</button>
        <button onClick={() => pruebaRegex()}>Validar numero</button>
      </div>
      <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Prueba Componente">
        <ModalPruebas openModal={openModal} setOpenModal={setOpenModal} />
      </ModalCompoment>
      <p>{formatDateHourOrMinutes({ optionDate: "fullDate", optionHour: "fechaAutomatica" })}</p>
      {listaContenedore[11] && (
        <p>
          {formatDateHourOrMinutes({
            optionDate: "fullDate",
            optionHour: "fechaBaseDatos",
            fechaIngresada: listaContenedore[11].createdDate
          })}
        </p>
      )}
      <div className="w-full flex flex-row justify-center items-center">
        <TooltipComponent typeTooltip="normal" titleTooltip="Prueba icono normal" componenteIcono={<Info />} />
        <TooltipComponent
          styleTooltip={stylesTool}
          typeTooltip="HtmlType"
          titleTooltip="Prueba icono html"
          componenteIcono={<InfoRounded />}>
          <>
            <h1>hola mundo</h1>
            <h1>{formatDateHourOrMinutes({ optionDate: "fullDate", optionHour: "fechaAutomatica" })}</h1>
          </>
        </TooltipComponent>
      </div>
      {/* <Suspense fallback={<p>Cargando...</p>}>
        <div className="mt-10 w-full">
          <TableComponent
            buscar
            IDcolumn={"id"}
            dataInfo={listaSectores}
            columns={[
              {
                title: "Nombre Sector",
                field: "nombreSector"
              },
              {
                title: "Jefe Sector",
                field: "jefeSector"
              },
              {
                title: "Numero ID",
                field: "id"
              },
              {
                title: "Acciones",
                field: "",
                render: (row: ICliSectores) => {
                  return (
                    <>
                      <main className="flex flex-row items-center gap-x-2">
                        <TooltipComponent
                          onClick={() => { funcionOnClick(row.id) }}
                          arrow
                          disabled={row.id == 3}
                          titleTooltip="Eliminar Sector"
                          typeTooltip="normal"
                          componenteIcono={<Delete color={row.id == 3 ? "disabled" : "error"} />}
                        />
                        <TooltipComponent
                          onClick={() => { funcionOnClick(row.id) }}
                          titleTooltip="Editar Sector Sector"
                          typeTooltip="normal"
                          componenteIcono={<Edit color="primary" />}
                        />
                        <TooltipComponent
                          onClick={() => { funcionOnClick(row.id) }}
                          styleTooltip={aux}
                          titleTooltip="Informacion Sector"
                          typeTooltip="HtmlType"
                          componenteIcono={<InfoRounded color="action" />}>
                          <>
                            <h1 className="underline mb-2">Informacion Sobre el sector</h1>
                            <ul className="list-disc">
                              <li className="ml-6">Cantidad Estacks: {row.cantidadStacks}</li>
                              <li className="ml-6">Jefe Sector: {row.jefeSector}</li>
                              <li className="ml-6">Jefe Sector: {row.jefeSector}</li>
                            </ul>
                          </>
                        </TooltipComponent>
                      </main>
                    </>
                  );
                }
              }
            ]}
          />
        </div>
      </Suspense> */}
      <div>
        <button onClick={() => probarBotonBack()}>Boton Back</button>
        <button onClick={() => probarBotonesNext()}>Boton Next</button>
      </div>
      <Suspense fallback={<p>Cargando...</p>}>
        <div className="my-8 w-full">
          <StepperComponent
            activeStepNumber={cantidadAprobados}
            itemList={listaSectoresModificada}
            orientationStepper="horizontal"
            labelStepper={(value) => value.jefeSector}
            elementComplete={(value) => value.completado}
            activeButtonsNextAndBefore={true}
            functionButtonBack={probarBotonBack}
            functionButtonNext={probarBotonesNext}
            itemFinishedFunction={funcionItemTerminado}
            activeTooltipItem
            arrayItemsVisualizer={["jefeSector", "cantidadStacks", "nombreSector", "operator.dni"]}
            stylesForToolTip={stylesTool}
          />
        </div>
      </Suspense>
      <Suspense fallback={<p>Cargando...</p>}>
        {fakeData1.map((elementos) => {
          return (
            <div key={elementos.id}>
              <p className="text-green-500">{elementos.name}</p>
            </div>
          );
        })}
      </Suspense>
    </main>
  );
};
