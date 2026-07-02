/* eslint-disable unused-imports/no-unused-vars */
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { ICLIContendorItems } from "../../Models/ICLIContenedorItems";
import { ICLIImpresionEtiquetas } from "../../Models/ICLIImpresionEtiquetas";
import { CLIContenedorItemsSliceRequest } from "../../Middlewares/CLIContenedorItemsSlice";
import { CLIImpresionEtiquetasSliceRequests } from "../../Middlewares/CLIImpresionEtiquetas";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshLista: (newValue: ICLIContendorItems[]) => void;
  contenedorSeleccionado: ICLIContendorItems;
  listaItems: ICLIImpresionEtiquetas[];
}

export const EliminarContenedor: React.FC<Props> = ({
  setOpenModal,
  refreshLista,
  contenedorSeleccionado,
  listaItems
}) => {
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const borrarContenedor = async () => {
    const itemsFormateados = formatearImpresiones();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(CLIImpresionEtiquetasSliceRequests.multiPutRequest(itemsFormateados))
      );
      const eliminarContenedor = unwrapResult(
        await dispatch(CLIContenedorItemsSliceRequest.DeleteRequest(contenedorSeleccionado.id))
      );
      const refresh = unwrapResult(await dispatch(CLIContenedorItemsSliceRequest.GetByOptionLpn("CLI")));
      if (eliminarContenedor) {
        refreshLista(refresh);
        openNotificationUI("Se elimino el contendor correctamente", "success");
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    setOpenModal(false);
  };

  const formatearImpresiones = () => {
    const nuevoArray = [...listaItems];
    nuevoArray.forEach((elementos) => {
      delete elementos.cliItems;
      delete elementos.cliSectores;
      elementos.cliContenedorItemsId = null;
    });
    if (nuevoArray != null) {
      return nuevoArray;
    }
  };

  return (
    <main>
      <section>
        <p className="my-4 text-2xl font-medium">Seguro que desea eliminar el contenedor?</p>
      </section>
      <section className="flex flex-row justify-center gap-x-4">
        <div>
          <Button
            type="submit"
            onClick={() => {
              borrarContenedor();
            }}
            className={buttonClases.greenButton}>
            Eliminar
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
    </main>
  );
};
