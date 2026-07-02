/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { OptionalStatesSlice } from "../Reducers/optionSelectSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { cliSectoresSlice, CLISectoresSliceRequest } from "app/features/cli/Middlewares/CliSectoresSlice";
import { OpcionesDeTransferencia } from "../Layout/OpcionesDeTransferencia";
import { ICLISectores } from "app/features/cli/Models/ICLISectores";

export const TransferirPlacasMain = () => {
  const { control, setValue } = useForm();

  const opcionesMenus = [
    { id: 1, opcion: "Generar Lpn Padre" },
    { id: 2, opcion: "Tranferir Lpn Padre" },
    { id: 3, opcion: "Recepcionar Lpn Padre" }
  ];

  const opcionesRecepciones = [
    { id: 1, opcion: "Sin Recepcion" },
    { id: 2, opcion: "Recepcionado" },
    { id: 3, opcion: "Rechazado" }
  ];

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [sectoresConContenedores, setSectoresConContenedores] = useState<ICLISectores[]>([]);

  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | number>("");
  const [opcionRechazoSeleccionada, setOpcionRechazoSeleccionada] = useState<string | number>("");

  FetchApi<ICLISectores[]>(
    CLISectoresSliceRequest.GetAllSectorsByContainers,
    null,
    false,
    opcionSeleccionada == 3,
    setSectoresConContenedores,
    true
  );

  useEffect(() => {
    if (opcionSeleccionada !== 3) {
      dispatch(OptionalStatesSlice.actions.setOpcionFiltrado(""));
      dispatch(cliSectoresSlice.actions.setObject(0));
      setValue("opcionRecepcion", "");
      setValue("sector", "");
    }
    const tituloPagina = opcionesMenus.find((elementos) => elementos.id === opcionSeleccionada);
    TitleChanger(opcionSeleccionada === "" ? "Sin Opcion" : tituloPagina.opcion);
  }, [opcionSeleccionada]);

  return (
    <main className="p-3">
      <section
        className={`${
          opcionSeleccionada === 3 ? "flex flex-row justify-between gap-x-4" : ""
        } bg-background shadow-shadowBox p-3`}>
        <SelectComponent
          inputLabel="Seleccione una opcion"
          listaObjetos={opcionesMenus}
          nameSelect="opcionHtml"
          valueLabel={(value) => value.opcion}
          valueSelect={(value) => value.id}
          control={control}
          ValueSave={(val) => {
            setOpcionSeleccionada(val as string);
            dispatch(OptionalStatesSlice.actions.setOpcionFiltrado(""));
          }}
          valueKey={(value) => value}
        />
        {opcionSeleccionada === 3 && (
          <>
            <SelectComponent
              inputLabel="Seleccione de recepcion"
              listaObjetos={opcionesRecepciones}
              nameSelect="opcionRecepcion"
              valueLabel={(value) => value.opcion}
              valueSelect={(value) => value.opcion}
              control={control}
              ValueSave={(val) => {
                setOpcionRechazoSeleccionada(val as string);
                dispatch(OptionalStatesSlice.actions.setOpcionFiltrado(val as string));
              }}
              valueKey={(value) => value}
            />
            <SelectComponent
              inputLabel="Seleccione un sector"
              listaObjetos={sectoresConContenedores}
              nameSelect="sector"
              valueLabel={(value) => value.nombreSector}
              valueSelect={(value) => value.id}
              control={control}
              ValueSave={(val) => {
                setOpcionRechazoSeleccionada(val as number);
                dispatch(cliSectoresSlice.actions.setObject(val as number));
              }}
              valueKey={(value) => value}
            />
          </>
        )}
      </section>
      <OpcionesDeTransferencia opcionId={opcionSeleccionada as number} />
    </main>
  );
};
