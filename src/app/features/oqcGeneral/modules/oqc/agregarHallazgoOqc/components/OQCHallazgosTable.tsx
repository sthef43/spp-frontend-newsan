import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { IProducto } from "app/models";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OQCHallazgosForm } from "./OQCHallazgosForm";
import { OQCHallazgoImage } from "./OQCHallazgoImage";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { OQCHallazgoSliceRequests, oqcHallazgoSlice } from "app/features/oqcGeneral/slices/OQCHallazgoSlice";

export const OQCHallazgosTable = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();

  const [form, setForm] = useState(false);
  const [openModalImage, setOpenModalImage] = useState(false);

  const hallazgos = useAppSelector<IOQCHallazgo[]>((state) => state.oqcHallazgo.dataAll);
  const producto = useAppSelector<IProducto>((state) => state.producto.object);

  const onEliminar = async (hallazgo: IOQCHallazgo) => {
    try {
      if (await getConfirmation("Eliminar hallazgo", "Esta seguro que quiere eliminar el hallazgo")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        await dispatch(OQCHallazgoSliceRequests.deleteRequest(hallazgo.id));
        await dispatch(OQCHallazgoSliceRequests.getAllByProductoIdRequest(producto.id));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };

  const onEdit = async (hallazgo: IOQCHallazgo) => {
    await dispatch(oqcHallazgoSlice.actions.setObject(hallazgo));
    setForm(true);
  };

  const onOpenForm = async () => {
    await dispatch(oqcHallazgoSlice.actions.setObject(null));
    setForm(true);
  };

  const onOpenImage = async (hallazgo: IOQCHallazgo) => {
    await dispatch(oqcHallazgoSlice.actions.setObject(hallazgo));
    setOpenModalImage(true);
  };

  return (
    <ContainerForPages optionsLayout="Table" activeEffectVisible>
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Nombre",
            field: "nombre"
          },
          {
            title: "Categoria",
            field: "oqcCategoria.nombre"
          },
          {
            title: "Ponderación",
            field: "oqcPonderacion.nombre"
          },
          {
            title: "Acciones",
            field: "",
            render: (row: IOQCHallazgo) => {
              const sinImagen = row.urlImage === null ? false : true;
              return (
                <ActionsButtons
                  sinImagen={sinImagen}
                  onImageProps={onOpenImage}
                  mostrarIconoImagen={true}
                  row={row}
                  edit
                  eliminar
                  onDeleteProps={onEliminar}
                  onEditProps={onEdit}
                />
              );
            }
          }
        ]}
        agregar={onOpenForm}
        buscar
        dataInfo={hallazgos}
        rowStyle={(rowData: IOQCHallazgo) => {
          switch (rowData.oqcPonderacion.color) {
            case "Rojo":
              return { padding: 1, backgroundColor: "#f44b4e", fontSize: 14 };
            case "Verde":
              return { padding: 1, backgroundColor: "#5dae3a", fontSize: 14 };
            case "Amarillo":
              return { padding: 1, backgroundColor: "#fdaf59", fontSize: 14 };
            default:
              return { padding: 1, fontSize: 14 };
          }
        }}
      />
      <ModalCompoment openPopup={form} setOpenPopup={setForm} title="Agregar/editar un hallazgo">
        <OQCHallazgosForm closeModal={setForm} />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModalImage} openPopup={openModalImage} title="Agregar/Actualizar imagen">
        <OQCHallazgoImage openModal={openModalImage} setOpenModal={setOpenModalImage} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
