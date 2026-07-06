/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Control, FieldErrors, FieldValues, UseFormReset, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { AddCircleRounded, InfoRounded } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { AgregarTipoAuditoria } from "../../modals/creacionAuditorias/AgregarTipoAuditoria";
import FetchApi from "app/shared/helpers/FetchApi";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { auditoriasUISlice } from "../../../slices/auditoriasUISlice";
import { AuditoriaListaValoresSliceRequest } from "../../../slices/AuditoriaListaValoresSlice";
import { IAuditoriaListaValores } from "../../../models/IAuditoriaListaValores";
import { IAuditoriaValores } from "../../../models/IAuditoriaValores";
import { IAuditoriaAsignada } from "../../../models/IAuditoriaAsignada";
import { useParams } from "react-router-dom";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";

interface Props {
  controlFather: Control;
  setValuesFather: UseFormSetValue<FieldValues>;
  resetFather: UseFormReset<FieldValues>;
  errosFather: FieldErrors<FieldValues>;
  triggerFather: UseFormTrigger<FieldValues>;
}

export const CreacionAuditoriaSegundoPaso: React.FC<Props> = ({ controlFather }) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);
  const { listaValores } = useAppSelector((state) => state.auditoriasUI);
  const { activeFetchTipoAuditoria } = useAppSelector((state) => state.auditoriasUI);
  const auditoria = useAppSelector((state) => state.auditoriaAsignada.data as IAuditoriaAsignada);
  const { estadoModalNuevoTipo } = useAppSelector((state) => state.auditoriasUI);

  const params = useParams();
  const dispatch = useAppDispatch();

  const [listaTipoAuditorias, setListaTipoAuditorias] = useState<IAuditoriaListaValores[]>(
    params && auditoria ? auditoria.auditoriaListaValoresResult.auditoriaValoresResult : []
  );

  const [tipoAuditoriaSeleccionada, setTipoAuditoriaSeleccionada] = useState<string | number>(0);

  FetchApi<IAuditoriaListaValores[]>(
    AuditoriaListaValoresSliceRequest.GetAuditListWithRolId,
    infoUser.permisos.rolId,
    false,
    activeFetchTipoAuditoria,
    setListaTipoAuditorias,
    false,
    false,
    false,
    () => {
      dispatch(auditoriasUISlice.actions.setActiveFetchTipoAuditoria(false));
    }
  );

  const renderListaValores = (e: IAuditoriaListaValores): JSX.Element => {
    let valoresBloq;
    if (params && auditoria) {
      valoresBloq = listaValores;
    } else {
      valoresBloq = e.auditoriaValoresListaBloq.flatMap((elementos) => elementos.auditoriaValores);
    }
    return (
      <>
        {e.auditoriaValoresListaBloq && e.auditoriaValoresListaBloq.length > 0 && (
          <div className="flex flex-row items-center justify-between w-full gap-x-6">
            <p className="text-xl">{e.nombre}</p>
            <p className="text-xl">(Valores: {valoresBloq.map((elementos) => elementos.nombre).join(", ")})</p>
            <p className="text-xl">Muestras: {e.auditoriaTipos.nombre}</p>
          </div>
        )}
      </>
    );
  };

  const cambiarEstadoValores = (elemento: IAuditoriaValores, objetoValue: string) => {
    const clonElemento = { ...elemento };
    switch (objetoValue) {
      case "flagMail":
        clonElemento.flagMail = !clonElemento.flagMail;
        break;
      case "flagCriterio":
        clonElemento.flagCriterio = clonElemento.flagCriterio ? false : true;
        break;
    }
    const cambiarObjeto = listaValores.map((value) => {
      if (value.id === clonElemento.id) {
        return clonElemento;
      }
      return value;
    });
    dispatch(auditoriasUISlice.actions.setListaValores(cambiarObjeto));
  };

  const renderInputCambiarEstado = (estado: boolean, elemento: IAuditoriaValores, objetoValue: string) => {
    return (
      <div className="flex flex-row justify-center items-center">
        <p
          onClick={() => cambiarEstadoValores(elemento, objetoValue)}
          className={`text-sm ${
            estado ? "bg-green-500" : "bg-background"
          } rounded-l-md px-6 py-2 cursor-pointer transition-colors duration-300`}>
          SI
        </p>
        <p
          onClick={() => cambiarEstadoValores(elemento, objetoValue)}
          className={`text-sm ${
            estado ? "bg-background" : "bg-green-500"
          } rounded-r-md px-6 py-2 cursor-pointer transition-colors duration-300`}>
          NO
        </p>
      </div>
    );
  };

  useEffect(() => {
    if (tipoAuditoriaSeleccionada !== 0) {
      const listaPadre = listaTipoAuditorias.find((item) => item.id === tipoAuditoriaSeleccionada);
      const valoresBloq = listaPadre.auditoriaValoresListaBloq.flatMap((elementos) => elementos.auditoriaValores);
      dispatch(auditoriasUISlice.actions.setListaValores(valoresBloq));
      dispatch(auditoriasUISlice.actions.setListaValoresPadre(listaPadre));
    } else if (auditoria) {
      dispatch(
        auditoriasUISlice.actions.setListaValores(
          auditoria.auditoriaListaValoresResult.auditoriaValoresResult
        )
      );
    }
  }, [tipoAuditoriaSeleccionada, auditoria]);

  return (
    <main>
      <ContainerForPages
        optionsLayout="personalized"
        activeEffectVisible
        classNamePersonalized="flex flex-row items-center justify-between w-full gap-x-6">
        <SelectComponent
          inputLabel="Seleccionar Tipo de Valores"
          listaObjetos={listaTipoAuditorias}
          nameSelect="tipoAuditoria"
          control={controlFather}
          valueLabel={(e) => renderListaValores(e)}
          valueSelect={(e) => e.id}
          disabled={params && auditoria ? true : false}
          ValueSave={(e) => {
            setTipoAuditoriaSeleccionada(e);
            dispatch(auditoriasUISlice.actions.setTipoAuditoria(e as number));
          }}
          valueKey={(e) => e}
          estilosPersonalizados={{
            borderRadius: "2px",
            backgroundColor: "var(--secondary-color)",
            cursor: params && auditoria ? "not-allowed" : "pointer"
          }}
          estilosSelectItems={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
        />
        <div
          onClick={() => {
            dispatch(auditoriasUISlice.actions.setEstadoModalNuevoTipo(params && auditoria ? false : true));
            dispatch(auditoriasUISlice.actions.setListaValoresPreview([]));
            dispatch(auditoriasUISlice.actions.setListaValoresPadre());
            dispatch(auditoriasUISlice.actions.setTipoAuditoria(0));
            dispatch(auditoriasUISlice.actions.setMostrarListaValores(false));
          }}
          className={`${
            params && auditoria
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-primaryNewOpacity group transition-colors duration-150"
          } flex flex-row items-center justify-center gap-x-6 p-2 bg-secondaryNew rounded-md border-dashed border-2 w-full border-primaryNew`}>
          <AddCircleRounded className="group-hover:fill-white" sx={{ fill: "var(--primary-color)" }} fontSize="large" />
          <p className="text-primaryNew text-xl group-hover:text-white">Agregar nuevo tipo de auditoria</p>
        </div>
      </ContainerForPages>
      {listaValores && listaValores.length > 0 && (
        <ContainerForPages optionsLayout="Table" activeEffectVisible>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Valor</TableCell>
                  <TableCell align="center">Descripcion</TableCell>
                  <TableCell align="center">
                    <div className="flex flex-row items-center justify-center gap-x-2 w-full">
                      <p>Enviar por email</p>
                      <TooltipComponent
                        typeTooltip="normal"
                        titleTooltip="Si el valor esta marcado como enviar por email, se enviara un correo electronico con los items seleccionados"
                        componenteIcono={<InfoRounded fontSize="small" sx={{ color: "var(--primary-color)" }} />}
                      />
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex flex-row items-center justify-center gap-x-2 w-full">
                      <p>Item No good</p>
                      <TooltipComponent
                        typeTooltip="normal"
                        titleTooltip="Los valores marcados como no good seran evaluados para la ponderacion final cuando se realice la auditoria y seran obligatorios al realizar una auditoria"
                        componenteIcono={<InfoRounded fontSize="small" sx={{ color: "var(--primary-color)" }} />}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listaValores.map((value) => (
                  <TableRow key={value.id}>
                    <TableCell align="center">{value.nombre}</TableCell>
                    <TableCell align="center">{value.descripcion}</TableCell>
                    <TableCell align="center">{renderInputCambiarEstado(value.flagMail, value, "flagMail")}</TableCell>
                    <TableCell align="center">
                      {renderInputCambiarEstado(value.flagCriterio, value, "flagCriterio")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ContainerForPages>
      )}
      <ModalCompoment
        showModalCenterPage
        openPopup={estadoModalNuevoTipo}
        setOpenPopup={() => dispatch(auditoriasUISlice.actions.setEstadoModalNuevoTipo())}
        title="Agregar nuevo tipo de Auditoria"
        titleModalStyle="Audit">
        <AgregarTipoAuditoria
          setOpenModal={() => dispatch(auditoriasUISlice.actions.setEstadoModalNuevoTipo())}
          openModal={estadoModalNuevoTipo}
        />
      </ModalCompoment>
    </main>
  );
};
