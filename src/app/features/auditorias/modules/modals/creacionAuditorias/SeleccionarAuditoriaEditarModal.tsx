import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Avatar } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import FetchApi from "app/shared/helpers/FetchApi";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { useAppDispatch } from "app/core/store/store";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import { AuditoriaAsignadaSliceRequest, auditoriaAsignadaSlice } from "../../../slices/AuditoriaAsignadaSlice";
import { auditoriasUISlice } from "../../../slices/auditoriasUISlice";

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

export const SeleccionarAuditoriaEditarModal: React.FC<Props> = ({ setOpenModal, openModal, auditoriaId }) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

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

  const handleEditarEspecifica = async (asignacion: IAuditoriaAsignada) => {
    dispatch(auditoriasUISlice.actions.setBloquesVacio([]));
    const response = unwrapResult(
      await dispatch(AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById(asignacion.id))
    );
    if (response) {
      dispatch(auditoriaAsignadaSlice.actions.setAuditoria(response));
      dispatch(
        auditoriasUISlice.actions.setListaValores(
          response.auditoria.auditoriaListaValoresResult.auditoriaValoresResult
        )
      );
      response.auditoriaGrupoItemsResult.map((elementos) => {
        dispatch(auditoriasUISlice.actions.setBloques(elementos));
      });
      dispatch(
        auditoriasUISlice.actions.setTipoAuditoria(
          response.auditoria.auditoriaListaValoresResult.auditoriaTiposId
        )
      );
      dispatch(auditoriasUISlice.actions.setListaAuditoriasAsignadasGlobal([]));
      dispatch(auditoriasUISlice.actions.setCantidadAuditoriasAfectadas(0));
      dispatch(auditoriasUISlice.actions.setModoEdicionGlobal(false));
      setOpenModal(false);
      history.push(`/main/auditorias-v2/crud-creacion-auditorias/${response.id}`);
    }
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[80vw]" activeEffectVisible>
      {listaAuditoriasAsignadas.length > 0 ? (
        <>
          <header className="flex flex-row w-full justify-center gap-x-4">
            <h2 className="font-semibold text-xl w-full text-center border border-gray-300 p-2 rounded-md bg-backgroundModalAudit">
              Nombre Auditoria: <span className="font-normal">{listaAuditoriasAsignadas[0].auditoria?.nombre}</span>
            </h2>
            <h2 className="font-semibold text-xl w-full text-center border border-gray-300 p-2 rounded-md bg-backgroundModalAudit">
              Numero de Registro:{" "}
              <span className="font-normal">{listaAuditoriasAsignadas[0].auditoria?.numeroRegistro}</span>
            </h2>
          </header>
          <section className="flex flex-col items-start mt-4">
            <h3 className="font-semibold text-lg w-full text-center border border-gray-300 p-2 rounded-md bg-backgroundModalAudit">
              Subroles Asignados
            </h3>
            <div className="flex flex-row w-full justify-start mt-4 gap-x-4 flex-wrap">
              {listaAuditoriasAsignadas.map((elementos, index) => (
                <div key={index} className="flex flex-row justify-between w-2/6 border border-gray-300 p-2 rounded-md">
                  <div className="w-full flex flex-row gap-x-2 items-center">
                    <AvatarAuditoria name={`${elementos.subRol?.name}`} />
                    <div>
                      <p className="font-semibold">{elementos.subRol?.name}</p>
                      <p className="text-sm text-gray-500">{elementos.lineaProduccion?.nombre}</p>
                    </div>
                  </div>
                  <TooltipComponent
                    titleTooltip="Editar Auditoria Asignada"
                    typeTooltip="normal"
                    onClick={() => handleEditarEspecifica(elementos)}
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
    </ContainerForPages>
  );
};
