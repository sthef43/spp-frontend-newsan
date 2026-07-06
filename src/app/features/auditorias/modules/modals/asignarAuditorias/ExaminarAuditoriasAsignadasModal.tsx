/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import FetchApi from "app/shared/helpers/FetchApi";
import { AuditoriaAsignadaSliceRequest } from "../../../slices/AuditoriaAsignadaSlice";
import { Avatar } from "@mui/material";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { EditRounded } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { CrearNuevaAsignacion } from "./CrearNuevaAsignacion";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  auditoriaId: number;
}

const AvatarAuditoria = ({ name }: { name: string }) => {
  const { generateColorRandom } = UseUtilHooks();
  const colorFijo = React.useMemo(() => generateColorRandom(), []);
  return <Avatar sx={{ bgcolor: colorFijo, width: 40, height: 40 }}>{name.split(" ")[0][0]}</Avatar>;
};

export const ExaminarAuditoriasAsignadasModal: React.FC<Props> = ({ setOpenModal, openModal, auditoriaId }) => {
  const [openModalEditar, setOpenModalEditar] = useState<boolean>(false);
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<IAuditoriaAsignada>();

  const [listaAuditoriasAsignadas, setListaAuditoriasAsignadas] = useState<IAuditoriaAsignada[]>([]);

  FetchApi<IAuditoriaAsignada[]>(
    AuditoriaAsignadaSliceRequest.getAllAuditAsignedByAuditId,
    auditoriaId,
    false,
    openModal,
    setListaAuditoriasAsignadas,
    true,
    true,
    true
  );

  const handleEditarAuditoria = (auditoria: IAuditoriaAsignada) => {
    setAuditoriaSeleccionada(auditoria);
    setOpenModalEditar(true);
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[80vw]" activeEffectVisible>
      {listaAuditoriasAsignadas.length > 0 ? (
        <>
          <header className="flex flex-row w-full justify-center gap-x-4">
            <h2 className="font-semibold text-xl w-full text-center border border-gray-300 p-2 rounded-md bg-backgroundModalAudit">
              Nombre Auditoria: <span className="font-normal">{listaAuditoriasAsignadas[0].auditoria.nombre}</span>
            </h2>
            <h2 className="font-semibold text-xl w-full text-center border border-gray-300 p-2 rounded-md bg-backgroundModalAudit">
              Numero de Registro:{" "}
              <span className="font-normal">{listaAuditoriasAsignadas[0].auditoria.numeroRegistro}</span>
            </h2>
          </header>
          <section className="flex flex-col items-start mt-4">
            <h3 className="font-semibold text-lg w-full text-center border border-gray-300 p-2 rounded-md bg-backgroundModalAudit">
              Subroles Asignados
            </h3>
            <div className="flex flex-row w-full justify-start mt-4 gap-x-4">
              {listaAuditoriasAsignadas.map((elementos, index) => (
                <div key={index} className="flex flex-row justify-between w-2/6 border border-gray-300 p-2 rounded-md">
                  <div className="w-full flex flex-row gap-x-2 items-center">
                    <AvatarAuditoria name={`${elementos.subRol.name}`} />
                    <div>
                      <p className="font-semibold">{elementos.subRol.name}</p>
                      <p className="text-sm text-gray-500">{elementos.lineaProduccion.nombre}</p>
                    </div>
                  </div>
                  <TooltipComponent
                    titleTooltip="Editar Auditoria Asignada"
                    typeTooltip="normal"
                    onClick={() => handleEditarAuditoria(elementos)}
                    componenteIcono={<EditRounded color="primary" />}
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <h3 className="font-semibold text-lg w-full text-center border border-gray-300 p-2 rounded-md bg-backgroundModalAudit">
          No se encontraron auditorias asignadas
        </h3>
      )}
      <ModalCompoment
        setOpenPopup={setOpenModalEditar}
        openPopup={openModalEditar}
        showModalCenterPage
        title="Editar Auditoria Asignada"
        subTitle="Editar auditoria previamente asignada"
        titleModalStyle="Audit">
        <CrearNuevaAsignacion
          openModal={openModalEditar}
          setOpenModal={setOpenModalEditar}
          auditoriaSeleccionadaEditar={auditoriaSeleccionada}
          edicionActiva={true}
          setListaAuditoriasAsignadas={setListaAuditoriasAsignadas}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
