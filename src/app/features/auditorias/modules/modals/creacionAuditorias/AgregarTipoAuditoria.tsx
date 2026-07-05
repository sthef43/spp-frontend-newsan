/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IAuditoriaTipos } from "../../../models/IAuditoriaTipos";
import FetchApi from "app/shared/helpers/FetchApi";
import { AuditoriaTiposSliceRequest } from "../../../slices/AuditoriaTiposSlice";
import { IAppUser } from "app/models";
import { IAuditoriaListaValores } from "../../../models/IAuditoriaListaValores";
import { AuditoriaListaValoresSliceRequest } from "../../../slices/AuditoriaListaValoresSlice";
import { AddCircleRounded, InfoRounded } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AgregarAsignarValores } from "./AgregarAsignarValores";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAuditoriaValores } from "../../../models/IAuditoriaValores";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IStatesForActiveFetchs } from "../../../models/utils/IStatesForActiveFetchs";
import { auditoriasUISlice } from "../../../slices/auditoriasUISlice";
import { AuditoriaValoresSliceRequest } from "../../../slices/AuditoriaValoresSlice";
import { AgregarTipoAgrupacion } from "./AgregarTipoAgrupacion";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { IAuditoriaValoresListaBloq } from "../../../models/IAuditoriaValoresListaBloq";
import { AuditoriaValoresListaBloqSliceRequest } from "../../../slices/AuditoriaValoresListaBloqSlice";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
}

const renderListaValores = (e: IAuditoriaListaValores): JSX.Element => {
  const valoresBloq = e.auditoriaValoresListaBloq.flatMap((elementos) => elementos.auditoriaValores);
  return (
    <>
      {e.auditoriaValoresListaBloq && e.auditoriaValoresListaBloq.length > 0 && (
        <div className="flex flex-row items-center justify-between w-full gap-x-6">
          <p className="text-base">{e.nombre}</p>
          <p className="text-base">(Valores: {valoresBloq.map((elementos) => elementos.nombre).join(", ")})</p>
        </div>
      )}
    </>
  );
};

export const AgregarTipoAuditoria: React.FC<Props> = ({ setOpenModal, openModal }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);
  const { mostrarListaValores } = useAppSelector((state) => state.auditoriasUI);
  const { activeFetchListaValores, activeFetchTipoAgrupacion } = useAppSelector(
    (state) => state.auditoriasUI as IStatesForActiveFetchs
  );
  const { listaValoresPreview } = useAppSelector((state) => state.auditoriasUI);

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const { FetchPost } = useFetchApiMultiResults<
    IAuditoriaListaValores | IAuditoriaValores[] | IAuditoriaValoresListaBloq[]
  >();

  const [openModalAgregarValores, setOpenModalAgregarValores] = useState<boolean>(false);
  const [openModalAgregarTipoAgrupacion, setOpenModalAgregarTipoAgrupacion] = useState<boolean>(false);

  const [listaTipoAuditorias, setListaTipoAuditorias] = useState<IAuditoriaTipos[]>([]);
  const [listaValoresFetch, setListaValoresFetch] = useState<IAuditoriaValores[]>([]);
  const [auditoriaListaValores, setAuditoriaListaValores] = useState<IAuditoriaListaValores[]>([]);

  const [tipoAuditoriaSeleccionada, setTipoAuditoriaSeleccionada] = useState<string | number>(0);
  const [grupoValoresSeleccionado, setGrupoValoresSeleccionado] = useState<string | number>(0);

  FetchApi<IAuditoriaTipos[]>(
    AuditoriaTiposSliceRequest.GetAllAuditTypesByRolId,
    infoUser.permisos.rolId,
    false,
    activeFetchTipoAgrupacion,
    setListaTipoAuditorias,
    false,
    false,
    false,
    () => {
      dispatch(auditoriasUISlice.actions.setActiveFetchTipoAgrupacion(false));
    }
  );

  FetchApi<IAuditoriaValores[]>(
    AuditoriaListaValoresSliceRequest.GetAllAuditsByTypeAuditId,
    tipoAuditoriaSeleccionada,
    false,
    tipoAuditoriaSeleccionada,
    setAuditoriaListaValores,
    true,
    false,
    false
  );

  FetchApi<IAuditoriaValores[]>(
    AuditoriaListaValoresSliceRequest.GetAuditById,
    grupoValoresSeleccionado,
    false,
    grupoValoresSeleccionado,
    setListaValoresFetch,
    true,
    false,
    false
  );

  const onSubmit = async (data: any) => {
    const nuevaLista = generarNuevaListaValores(data);
    const datosParaLaTabla = !mostrarListaValores ? generarValoresCreados() : listaValoresPreview;
    if (
      await getConfirmation(
        "Crear Nueva Lista",
        "Desea continuar con la creacion de la lista",
        null,
        "Aceptar",
        "Cancelar"
      )
    ) {
      FetchPost(AuditoriaListaValoresSliceRequest.PostRequest, nuevaLista, false, (responseLista) => {
        FetchPost(AuditoriaValoresSliceRequest.MultiPostReturnList, datosParaLaTabla, false, (responseValores) => {
          generateBloq(
            (responseLista as IAuditoriaListaValores).id,
            (responseValores as IAuditoriaValores[]).map((item) => item.id)
          );
        });
      });
    }
  };

  const generateBloq = async (listaValoresId: number, valoresResultId: number[]) => {
    const listaBloques: IAuditoriaValoresListaBloq[] = Array.from({ length: valoresResultId.length }, (_, index) => {
      return {
        auditoriaListaValoresId: listaValoresId,
        auditoriaValoresId: valoresResultId[index]
      };
    });
    FetchPost(AuditoriaValoresListaBloqSliceRequest.multiPostRequest, listaBloques, false, () => {
      openNotificationUI("Lista de valores creada exitosamente", "success");
      dispatch(auditoriasUISlice.actions.setActiveFetchListaValores(true));
      dispatch(auditoriasUISlice.actions.setActiveFetchTipoAuditoria(true));
      setOpenModal(false);
    });
  };

  const renderInputCambiarEstado = (estado: boolean) => {
    // elemento: IAuditoriaValores, objetoValue: string => esto va dentro de los argumentos
    return (
      <div className="flex flex-row justify-center items-center">
        <p
          // onClick={() => cambiarEstadoValores(elemento, objetoValue)}
          className={`text-sm ${
            estado ? "bg-green-500" : "bg-background"
          } rounded-l-md px-6 py-2 transition-colors duration-300`}>
          SI
        </p>
        <p
          // onClick={() => cambiarEstadoValores(elemento, objetoValue)}
          className={`text-sm ${
            estado ? "bg-background" : "bg-green-500"
          } rounded-r-md px-6 py-2 transition-colors duration-300`}>
          NO
        </p>
      </div>
    );
  };

  const generarNuevaListaValores = (data: any) => {
    const { nombreLista, descripcionLista } = data;
    const nuevaLista: IAuditoriaListaValores = {
      descripcion: descripcionLista,
      nombre: nombreLista,
      auditoriaTiposId: tipoAuditoriaSeleccionada as number
    };
    return nuevaLista;
  };

  const generarValoresCreados = () => {
    const valores: IAuditoriaValores[] = listaValoresFetch.map((items) => {
      const elementos = { ...items };
      delete elementos.id;
      return elementos;
    });
    return valores;
  };

  const listaRenderizado = () => {
    const datosParaLaTabla = !mostrarListaValores ? listaValoresFetch : listaValoresPreview;
    const tieneDatosParaMostrar = datosParaLaTabla && datosParaLaTabla.length > 0;
    if (!tieneDatosParaMostrar) {
      return [];
    }
    return datosParaLaTabla;
  };

  return (
    <main className="w-[65vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-y-4">
        <div className="flex flex-row items-center gap-x-20">
          <TextFieldComponent
            labelInput="Nombre de la lista"
            control={control}
            index={0}
            nameInput="nombreLista"
            valueDefault=""
            requiredBool
            errors={errors}
          />
          <TextFieldComponent
            labelInput="Descripcion de la lista"
            control={control}
            index={1}
            nameInput="descripcionLista"
            valueDefault=""
            requiredBool
            errors={errors}
          />
        </div>
        <div className="flex flex-row items-center gap-x-20">
          <SelectComponent
            inputLabel="Item existente"
            listaObjetos={listaTipoAuditorias}
            nameSelect="tipoAuditoria"
            valueLabel={(value) => value.nombre}
            valueSelect={(value) => value.id}
            ValueSave={(e) => {
              setTipoAuditoriaSeleccionada(e);
              dispatch(auditoriasUISlice.actions.setTipoProductoId(e as number));
            }}
            valueKey={(value) => value}
            control={control}
          />
          <div
            onClick={() => setOpenModalAgregarTipoAgrupacion(true)}
            className="flex flex-row items-center justify-center gap-x-6 cursor-pointer py-2 w-full bg-secondaryNew rounded-md border-dashed border-2 border-primaryNew hover:bg-primaryNewOpacity group transition-colors duration-150">
            <AddCircleRounded
              className="group-hover:fill-white"
              sx={{ fill: "var(--primary-color)" }}
              fontSize="large"
            />
            <p className="text-primaryNew text-xl group-hover:text-white">Agregar nuevo tipo de auditoria</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-20">
          {!mostrarListaValores && (
            <SelectComponent
              control={control}
              inputLabel="Seleccione el grupo de valores"
              listaObjetos={auditoriaListaValores}
              nameSelect="grupoValores"
              valueLabel={(value) => renderListaValores(value)}
              valueSelect={(value) => value.id}
              ValueSave={setGrupoValoresSeleccionado}
              valueKey={(value) => value}
            />
          )}
          <div
            onClick={() => {
              setOpenModalAgregarValores(true);
            }}
            className={`flex flex-row items-center justify-center gap-x-6 py-2 w-full rounded-md border-dashed border-2 transition-colors duration-150 bg-secondaryNew border-primaryNew hover:bg-primaryNewOpacity cursor-pointer`}>
            <AddCircleRounded
              className="group-hover:fill-white"
              sx={{ fill: "var(--primary-color)" }}
              fontSize="large"
            />
            <p className="text-primaryNew text-xl group-hover:text-white">Agregar nueva lista de valores</p>
          </div>
        </div>
        {/* {auditoriaListaValores.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Valor</TableCell>
                  <TableCell align="center">Descripcion</TableCell>
                  <TableCell align="center">Enviar por email</TableCell>
                  <TableCell align="center">Item good</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditoriaListaValores.map((value) => (
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
        )} */}
        <>
          {listaRenderizado() && listaRenderizado().length > 0 && (
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
                          titleTooltip="Con este valor se envia un correo electronico"
                          componenteIcono={<InfoRounded fontSize="small" sx={{ color: "var(--primary-color)" }} />}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex flex-row items-center justify-center gap-x-2 w-full">
                        <p>Item good</p>
                        <TooltipComponent
                          typeTooltip="normal"
                          titleTooltip="Los valores marcados como no good seran evaluados para la ponderacion final cuando se realice la auditoria"
                          componenteIcono={<InfoRounded fontSize="small" sx={{ color: "var(--primary-color)" }} />}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listaRenderizado().map((value) => {
                    return (
                      <TableRow key={value.id}>
                        <TableCell align="center">{value.nombre}</TableCell>
                        <TableCell align="center">{value.descripcion}</TableCell>
                        <TableCell align="center">{renderInputCambiarEstado(value.flagMail)}</TableCell>
                        <TableCell align="center">{renderInputCambiarEstado(value.flagCriterio)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
        <div className="flex justify-center w-full mt-4">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            className={buttonClases.blueButton}
            disabled={
              !isValid ||
              (!mostrarListaValores ? listaValoresFetch.length === 0 : listaValoresPreview.length === 0) ||
              !tipoAuditoriaSeleccionada
            }>
            Guardar
          </Button>
        </div>
      </form>
      <ModalCompoment
        openPopup={openModalAgregarTipoAgrupacion}
        setOpenPopup={setOpenModalAgregarTipoAgrupacion}
        title="Agregar Nuevo Tipo de Agrupacion"
        showModalCenterPage
        titleModalStyle="Audit">
        <AgregarTipoAgrupacion setOpenModal={setOpenModalAgregarTipoAgrupacion} />
      </ModalCompoment>
      <ModalCompoment
        openPopup={openModalAgregarValores}
        setOpenPopup={setOpenModalAgregarValores}
        title="Agregar nueva lista de valores"
        showModalCenterPage
        titleModalStyle="Audit">
        <AgregarAsignarValores setOpenModal={setOpenModalAgregarValores} openModal={openModalAgregarValores} />
      </ModalCompoment>
    </main>
  );
};
