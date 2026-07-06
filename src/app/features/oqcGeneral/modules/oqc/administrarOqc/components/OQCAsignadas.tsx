import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQCDesignada } from "app/models/IOQCDesignada";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IOQC } from "app/models/IOQC";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { OQCAsignarForm } from "./OQCAsignarForm";
import { OQCDesignadaSliceRequests, oqcDesignadaSlice } from "app/features/oqcGeneral/slices/OQCDesignadaSlice";
interface IOQCAsignadas {
  closeModal: (state: boolean) => void;
}
export const OQCAsignadas = ({ closeModal }: IOQCAsignadas): JSX.Element => {
  const oqcsDes = useAppSelector<IOQCDesignada[]>((state) => state.oqcDesignada.dataAll);
  const oqc = useAppSelector<IOQC>((state) => state.oqc.object);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const [form, setForm] = useState(false);
  const onEliminar = async (oqcDesi: IOQCDesignada) => {
    try {
      if (await getConfirmation("Eliminar OQC designada", "Esta seguro que quiere eliminar el OQC designado")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        await dispatch(OQCDesignadaSliceRequests.deleteRequest(oqcDesi.id));
        await dispatch(OQCDesignadaSliceRequests.getAllByOQCIdRequest(oqc.id));
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const getAll = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCDesignadaSliceRequests.getAllByOQCIdRequest(oqc.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };
  const onEdit = async (oqcDesi: IOQCDesignada) => {
    dispatch(oqcDesignadaSlice.actions.setObject(oqcDesi));
    setForm(true);
  };
  useEffect(() => {
    oqc && getAll();
    return () => {
      dispatch(oqcDesignadaSlice.actions.setObject(null));
    };
  }, [oqc]);

  return (
    <div className="w-[90vw]">
      <TableComponent
        IDcolumn="id"
        columns={[
          {
            title: "Linea de producción",
            field: "lineaProduccion.nombre"
          },
          {
            title: "Turno",
            field: "turno.nombre"
          },
          {
            title: "Cantidad",
            field: "cantidad"
          },
          {
            title: "Validar LPN",
            field: "",
            render: (row) => (row.lpn ? "Si" : "No")
          },
          {
            title: "Celulares",
            field: "",
            render: (row) => (row.celulares ? "Si" : "No")
          },
          {
            title: "Valida imei 2",
            field: "",
            render: (row) => (row.imei2 ? "Si" : "No")
          },
          {
            title: "Paletiza",
            field: "",
            render: (row) => (row.paletiza ? "Si" : "No")
          },
          {
            title: "Validar Manual",
            field: "",
            render: (row) => (row.chkManual ? "Si" : "No")
          },
          {
            title: "Validar Ficha Técnica",
            field: "",
            render: (row) => (row.chkFichaTecnica ? "Si" : "No")
          },
          {
            title: "Validar Ficha de Garantía",
            field: "",
            render: (row) => (row.chkFichaGarantia ? "Si" : "No")
          },
          {
            title: "Validar Acceso Guiado",
            field: "",
            render: (row) => (row.chkAccesoGuiado ? "Si" : "No")
          },
          {
            title: "Validar Etiqueta EE",
            field: "",
            render: (row) => (row.chkEtiquetaEE ? "Si" : "No")
          },
          {
            title: "Validar Etiqueta CNC",
            field: "",
            render: (row) => (row.chkAEtiquetaCNC ? "Si" : "No")
          },
          {
            title: "Validar Etiqueta EAN",
            field: "",
            render: (row) => (row.chkEtiquetaEAN ? "Si" : "No")
          },
          {
            title: "Validar Fe De Erratas",
            field: "",
            render: (row) => (row.chkFeDeErratas ? "Si" : "No")
          },
          {
            title: "Validar Guia Magic Control",
            field: "",
            render: (row) => (row.chkGuiaMagicControl ? "Si" : "No")
          },
          {
            title: "Validar Etiqueta Fuente Alimentacion",
            field: "",
            render: (row) => (row.chkEtiquetaFuenteAlimentacion ? "Si" : "No")
          },
          {
            title: "Validar Etiqueta Cable USB",
            field: "",
            render: (row) => (row.chkEtiquetaCableUSB ? "Si" : "No")
          },
          {
            title: "Validar Etiqueta Film Protector",
            field: "",
            render: (row) => (row.chkEtiquetaFilmControl ? "Si" : "No")
          },
          {
            title: "Validar Etiqueta Film QR",
            field: "",
            render: (row) => (row.chkEtiquetaQr ? "Si" : "No")
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => <ActionsButtons row={row} edit eliminar onDeleteProps={onEliminar} onEditProps={onEdit} />
          }
        ]}
        buscar
        dataInfo={oqcsDes}
      />
      <ModalCompoment openPopup={form} setOpenPopup={setForm} title="Editar">
        <OQCAsignarForm closeModal={setForm} refresh={getAll} />
      </ModalCompoment>
    </div>
  );
};
