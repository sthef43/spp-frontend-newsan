import { oqcSlice } from "app/features/oqcGeneral/slices/OQCSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IOQC } from "app/models/IOQC";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../../../shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { ModalCompoment } from "../../../../../../shared/components/ModalComponent";
import { OQCForm } from "./OQCForm";
import { OQCAsignarForm } from "./OQCAsignarForm";
import { OQCAsignadas } from "./OQCAsignadas";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

export const OqcTable = (): JSX.Element => {
  const oqcs = useAppSelector<IOQC[]>((state) => state.oqc.dataAll);

  const dispatch = useAppDispatch();

  const [form, setForm] = useState(false);
  const [view, setView] = useState(false);
  const [formAsignar, setFormAsignar] = useState(false);

  const [edicionActiva, setEdicionActiva] = useState(false);
  const [oqcSeleccionado, setOqcSeleccionad] = useState<IOQC>();

  const onEdit = async (oqc: IOQC) => {
    dispatch(oqcSlice.actions.setObject(oqc));
    setEdicionActiva(true);
    setOqcSeleccionad(oqc);
    setForm(true);
  };

  const onOpenForm = async () => {
    dispatch(oqcSlice.actions.setObject(null));
    setEdicionActiva(false);
    setForm(true);
  };

  const onAsignar = async (oqc: IOQC) => {
    dispatch(oqcSlice.actions.setObject(oqc));
    setFormAsignar(true);
  };

  const onView = async (oqc: IOQC) => {
    dispatch(oqcSlice.actions.setObject(oqc));
    setView(true);
  };

  const renderizarOQC = (name: string, row) => {
    if (name != "") {
      return (
        <ActionsButtons
          row={row}
          edit
          onEditProps={onEdit}
          add
          addTitle="Asignar OQC"
          addColor="info"
          view
          viewTitle="Ver asignadas"
          viewColor="info"
          onAddProps={onAsignar}
          onViewProps={onView}
        />
      );
    }
  };

  useEffect(() => {
    return () => {
      dispatch(oqcSlice.actions.setObject(null));
    };
  }, []);

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
            title: "Emails",
            field: "emailGroup.name"
          },
          {
            title: "Validar número de serie",
            field: "",
            render: (row) => (row.validarNumSerie ? "Si" : "No")
          },
          {
            title: "Envia email",
            field: "",
            render: (row) => (row.email ? "Si" : "No")
          },
          {
            title: "Envia email solo en caso de NG?",
            field: "",
            render: (row) => (row.emailNG ? "Si" : "No")
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => renderizarOQC(row.nombre, row)
          }
        ]}
        agregar={onOpenForm}
        buscar
        dataInfo={oqcs}
      />
      <ModalCompoment openPopup={form} setOpenPopup={setForm} title="Agregar/editar OQC">
        <OQCForm closeModal={setForm} edicionActiva={edicionActiva} oqcSeleccionado={oqcSeleccionado} />
      </ModalCompoment>
      <ModalCompoment openPopup={formAsignar} setOpenPopup={setFormAsignar} title="Asignar OQC">
        <OQCAsignarForm closeModal={setFormAsignar} />
      </ModalCompoment>
      <ModalCompoment openPopup={view} setOpenPopup={setView} title="Asignaciones">
        <OQCAsignadas closeModal={setView} />
      </ModalCompoment>
    </ContainerForPages>
  );
};
