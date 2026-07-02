import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FetchApi from "app/shared/helpers/FetchApi";
import { useAuditoriaContext } from "./context/AuditoriaContext";
import { useEppContext } from "./context/EppSelectionContext";
import { SEHEPPSliceRequest } from "app/features/seguridadEHigiene/auditoriasPersonal/reducers/SEH_EPPSlice";
import { ListButtonEpp } from "./components/ListButtonEpp";
import { SearchPersonal } from "./components/SearchPersonal";
import { SEH_Auditoria } from "app/features/seguridadEHigiene/auditoriasPersonal/interfaces/SEH_Auditoria";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { TextField, Button, IconButton, Tooltip } from "@mui/material";
import { PersonalInfo } from "./components/PersonalInfo";
import { useAppDispatch } from "app/core/store/store";
import { SP_SearchPersonal } from "app/features/seguridadEHigiene/auditoriasPersonal/services/SEH_Auditoria.services";
import { SelectedEppList } from "./components/SelectedEppList";
import { Edit, MoreHoriz, Forward } from "@mui/icons-material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
// import { unwrapResult } from "@reduxjs/toolkit";
// import { sehAuditoriaSliceRequest } from "app/shared/Pages/seguridadeEHigiene/reducers/SEH_AuditoriaSlice";
import HistorialContainer from "./components/HistorialContainer";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { sehAuditoriaSliceRequest } from "app/features/seguridadEHigiene/auditoriasPersonal/reducers/SEH_AuditoriaSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
// import {} from 'sweetalert2'

type AuditMode = "create" | "view";

export const AuditoriaPageContent = () => {
  const location = useLocation();
  const history = useHistory();
  const { path } = useRouteMatch();

  const buttonClases = MaterialButtons();
  const { auditoriaData, conteoUltimoGrupoHistorial, auditoriasIdAviso } = useAuditoriaContext();
  const { selectedEpps, isSelected, setSelectedEpps } = useEppContext();
  const [personalSelected, setPersonalSelected] = useState<SP_SearchPersonal>();
  const [countSelectedEpp, setCountSelectedEpp] = useState(0);
  const [verHistorial, setVerHistorial] = useState(false);
  const [epps, setEpps] = useState([]);

  const { getConfirmation } = useConfirmationDialog();

  const [mode, setMode] = useState<AuditMode>("create");
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { isValid }
  } = useForm<SEH_Auditoria>({
    defaultValues: !auditoriaData
      ? {
          personalId: ""
        }
      : auditoriaData
  });

  const sp_personal = watch("sp_personal");

  FetchApi(SEHEPPSliceRequest.getAllRequest, null, false, null, setEpps);

  const handleConfirm = (body: JSX.Element) => {
    return getConfirmation("", "", body, "Guardar", "Cancelar");
  };

  const onSubmit = async (data: SEH_Auditoria) => {
    try {
      const auditoria: SEH_Auditoria = {
        ...data,
        area: data.area,
        linea: data.linea,
        planta: data.planta,
        detalles: selectedEpps.map((detalle) => ({ ...detalle }))
      };

      let response = null;
      if (editMode) {
        const confirm = (await handleConfirm(
          <div className="p-4 text-center">¿Esta Seguro de Editar esta auditoría?</div>
        )) as boolean;
        if (!confirm) return;
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        delete auditoria.personal;
        delete auditoria.auditor;
        delete auditoria.sancion;
        response = unwrapResult(await dispatch(sehAuditoriaSliceRequest.NestedUpdateRequest(auditoria)));
      } else {
        auditoria.detalles.map((detalle) => {
          delete detalle.epp;
        });
        let confirm = false;
        let notificationRRHH = false;
        if (conteoUltimoGrupoHistorial + 1 == 3) {
          confirm = (await handleConfirm(
            <div className="p-4 text-center">
              <span className="uppercase">
                {" "}
                {personalSelected.apellido} {personalSelected.nombre}{" "}
              </span>
              cuenta con <strong>TRES LLAMADOS DE ATENCIÓN.</strong>
              El Mail Sera Dirigido a RRHH para su evaluación.
            </div>
          )) as boolean;
          notificationRRHH = true;
        } else {
          confirm = (await handleConfirm(
            <div className="p-4 text-center">¿Esta Seguro de querer guardar esta auditoría?</div>
          )) as boolean;
        }
        if (!confirm) {
          handleReset();
          return;
        }
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        response = unwrapResult(await dispatch(sehAuditoriaSliceRequest.NuevaAuditoria(auditoria)));
        if (response) {
          const ids = [response.id];
          if (notificationRRHH) {
            ids.push(...auditoriasIdAviso);
          }
          unwrapResult(await dispatch(EmailSliceRequest.SendMailAuditoriaSeguridadEHigiene(ids)));
        }
      }
      if (!response) {
        throw new Error("No se pudo completar la operacion");
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleReset();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    const state = location.state as { mode: AuditMode };
    if (state?.mode) {
      setMode(state?.mode);
    }
  }, [location]);

  useEffect(() => {
    if (auditoriaData) {
      setPersonalSelected({
        empresa: auditoriaData.empresa,
        linea: auditoriaData.linea,
        nombre: auditoriaData.personal.nombre,
        apellido: auditoriaData.personal.apellido,
        planta: auditoriaData.planta,
        personalId: auditoriaData.personalId,
        area: auditoriaData.area
      });
    }
  }, [auditoriaData]);

  useEffect(() => {
    const count = selectedEpps.filter((d) => !d?.deleted).length;
    setCountSelectedEpp(count);
  }, [selectedEpps]);

  const goBack = () => {
    const newPath = path.replace(/\/detalles\/?(:id)?\/?/, "");
    history.push(`${newPath}`);
  };

  const handleEdit = () => {
    if (editMode) {
      let epp = selectedEpps.filter((d) => d.id);
      epp = epp.map((d) => {
        d.deleted = false;
        return d;
      });
      setSelectedEpps(epp);
    }

    reset();
    setEditMode(!editMode);
  };

  const handlePersonalSelected = (personal: SP_SearchPersonal) => {
    // Al seleccionar, se actualiza el estado y los campos del formulario
    // setPersonalSelected(personal);

    if (personal) {
      setValue("personalId", personal.personalId);
      setValue("area", personal.area);
      setValue("empresa", personal.empresa);
      setValue("linea", personal.linea);
      setValue("planta", personal.planta);
      setValue("sp_personal", personal);
    }
  };

  //RESET
  const handleReset = () => {
    try {
      reset(); //RESETEO EL FORMULARIO
      let epp = []; //si no es editMode los epp seleccionados keda en [](vacio)
      if (editMode) {
        //Si el reseto es cuando esta editando tengo
        //que devolver los epp al estado original que tenia la auditoria
        epp = selectedEpps.filter((d) => d.id);
        epp = epp.map((d) => {
          d.deleted = false;
          return d;
        });
      } else {
        setPersonalSelected(null); //Si no esta en edicion deberia quedar en nulo
      }
      setSelectedEpps(epp); //Devuelvo los Epp
      if (mode != "create") goBack(); //Si esta en modo crear lo dejo en la pagina pro si quiere agrega rotro
    } catch (e) {
      goBack();
    }
  };

  const historialEdit = (id: number) => {
    const newPath = path.replace(/\/detalles\/?(:id)?\/?/, `/detalles/${id}`);
    history.push(`${newPath}`, {
      mode: "view"
    });
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {
          //EL BUSCADOR SOLO SE MUESTRA SI SE ESTA EN MODE CREATE
          mode == "create" ? (
            <div className="flex">
              <Tooltip title="Volver Atras">
                <IconButton
                  onClick={goBack}
                  className="rotate-180 text-[#2C96FF]"
                  size="small"
                  style={{ position: "relative" }}>
                  <Forward fontSize="large" />
                </IconButton>
              </Tooltip>
              <SearchPersonal
                clearErrors={clearErrors}
                setError={setError}
                control={control}
                onPersonalSelected={handlePersonalSelected}
                disabled={personalSelected != null}
                reset={handleReset}
              />
            </div>
          ) : null
        }
        {mode == "create" ? (
          <>{sp_personal ? <PersonalInfo {...sp_personal} onClick={() => setPersonalSelected(sp_personal)} /> : null}</>
        ) : (
          <>{personalSelected ? <PersonalInfo {...personalSelected} /> : null}</>
        )}

        {/* Botones EDITAR-VOLVER ATRAS-MAS(SIN FUNCION TODAVIA) 
          SOLO SE MUESTRAN SI SE ESTA EDITANDO
        */}
        {mode == "view" ? (
          <div className="w-full flex justify-between p-4 my-2">
            <div>
              <Tooltip title="Volver Atras">
                <IconButton
                  onClick={goBack}
                  className="rotate-180 text-[#2C96FF]"
                  size="small"
                  style={{ position: "relative" }}>
                  <Forward fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="flex justify-center gap-4 p-4">
              <Tooltip title="Editar">
                <IconButton
                  disabled={auditoriaData.sancionId != null}
                  className={buttonClases.greenButton}
                  onClick={handleEdit}
                  size="small"
                  style={{ position: "relative" }}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ver Historial">
                <IconButton
                  className={buttonClases.blueButton}
                  onClick={() => setVerHistorial(!verHistorial)}
                  size="small"
                  style={{ position: "relative" }}>
                  <MoreHoriz />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ) : null}

        {/* LISTADO EPP */}
        {personalSelected && (
          <>
            <div className="mt-2 mx-2 flex flex-col gap-5 lg:flex-row w-full">
              {mode == "create" || editMode ? <ListButtonEpp epps={epps} /> : null}
              <div className="bg-background p-2 w-full border rounded-md">
                <div className="w-full">
                  <h1 className="border-b-[1px] border-blue-300 mb-2 p-4 text-center">Faltante de EPP</h1>
                  <div className="p-4">
                    <SelectedEppList canDelete={mode == "create" || editMode} />
                  </div>
                </div>
                <div className="p-4 flex justify-center items-center gap-3">
                  <Controller
                    control={control}
                    name="observaciones"
                    rules={{
                      minLength: {
                        value: 5,
                        message: "Ingrese una observacion mas larga"
                      },
                      required: {
                        value: true,
                        message: "Debe ingresar una descripcion"
                      }
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <TextField
                        {...field}
                        error={invalid}
                        helperText={error?.message}
                        fullWidth
                        label="Agregar Descripcion"
                        disabled={mode != "create" && !editMode}
                      />
                    )}
                  />
                  {mode == "create" || editMode ? (
                    <Button type="submit" variant="contained" disabled={!isValid || countSelectedEpp == 0}>
                      Guardar
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
      </form>
      {/* HISTORIAL */}
      {personalSelected && (
        <HistorialContainer
          currentAuditoriaId={auditoriaData?.id || 0}
          clickEdit={historialEdit}
          personalId={personalSelected.personalId}
        />
      )}
    </div>
  );
};
