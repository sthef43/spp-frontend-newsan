/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { BateriasCodigoSliceRequests } from "app/features/baterias/middleware/BateriasCodigoSlice";
import { EstacionesBateriaSliceRequests } from "app/features/baterias/slices/EstacionesBateriaSlice copy";
import { EstacionesCodigoSliceRequests } from "app/features/baterias/slices/EstacionesCodigoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IBateriasCodigo } from "app/features/baterias/models/IBateriasCodigo";
import { IEstacionesBateria } from "app/features/baterias/models/IEstacionesBateria";
import { IEstacionesCodigo } from "app/features/baterias/models/IEstacionesCodigo";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { MaterialButtons, IconButtons } from "app/shared/components/material-ui/MaterialButtons";
import useFetchApi from "app/shared/hooks/useFetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Button, IconButton, TextField } from "@mui/material";
import { Check } from "@mui/icons-material";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from "classnames";
import produce from "immer";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";

const InitialState = {
  bateriaCodigo: "",
  estacionCodigo: ""
};

export const BateriasCRUDPage = () => {
  const classes = MaterialButtons();
  const classesIconButton = IconButtons();
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const { State: BateriasList } = useFetchApi<IBateriasCodigo[]>(BateriasCodigoSliceRequests.getAllRequest);
  const { State: EstacionesList } = useFetchApi<IEstacionesCodigo[]>(EstacionesCodigoSliceRequests.getAllRequest);

  const { State: EstacionesBateriaList, setState: setEstacionesBateriaList } = useFetchApi<IEstacionesBateria[]>(
    EstacionesBateriaSliceRequests.getAllRequest
  );

  const [errors, seterrors] = useState({ estacion: false, bateria: false });
  const [EstacionesBateria, setEstacionesBateria] = useState<IEstacionesBateria>({
    estadoId: 1,
    estacion: null,
    bateria: null
  });

  const changeBateria = (e) => {
    const resultado = BateriasList?.find((x) => x.codigo.toLowerCase() == e.target.value.toLowerCase());
    if (resultado) {
      seterrors({ ...errors, bateria: false });
      setEstacionesBateria(
        produce((draft) => {
          draft.bateria = resultado;
        })
      );
    } else {
      seterrors({ ...errors, bateria: true });
    }
  };

  const changeEstacion = (e) => {
    console.log(e.target.value);
    const resultado = EstacionesList?.find((x) => x.codigo.toLowerCase() == e.target.value.toLowerCase());
    if (resultado) {
      seterrors({ ...errors, estacion: false });
      setEstacionesBateria(
        produce((draft) => {
          draft.estacion = resultado;
        })
      );
    } else {
      seterrors({ ...errors, estacion: true });
    }
  };

  const completarRegistro = async (EstacionBateria: IEstacionesBateria) => {
    const copy = _.cloneDeep(EstacionBateria);
    copy.estadoId = 4;
    copy.estado = undefined;
    await dispatch(EstacionesBateriaSliceRequests.PutRequest(copy));
    let resultado2;
    try {
      resultado2 = unwrapResult(await dispatch(EstacionesBateriaSliceRequests.getAllRequest()));
    } catch {
      resultado2 = null;
    }
    if (resultado2) {
      setEstacionesBateriaList(resultado2);
      ChangeStatus();
    }
  };

  const onGuardar = async () => {
    let resultado;
    try {
      const fidedElement = EstacionesBateriaList.find(
        (x) =>
          x.bateria.codigo == EstacionesBateria.bateria.codigo || x.estacion.codigo == EstacionesBateria.estacion.codigo
      );
      if (!fidedElement) {
        resultado = unwrapResult(await dispatch(EstacionesBateriaSliceRequests.PostRequest(EstacionesBateria)));
      } else {
        const clone = _.cloneDeep(EstacionesBateria);
        clone.id = fidedElement.id;
        clone.estacionId = clone.estacion.id;
        clone.bateriaId = clone.bateria.id;
        clone.createdDate = fidedElement.createdDate;
        clone.bateria = undefined;
        clone.estacion = undefined;
        resultado = unwrapResult(await dispatch(EstacionesBateriaSliceRequests.PutRequest(clone)));
      }
    } catch {
      resultado = null;
    }
    if (resultado) {
      openNotificationUI("Cargando Batería con exito", "success");
      let resultado2;
      try {
        resultado2 = unwrapResult(await dispatch(EstacionesBateriaSliceRequests.getAllRequest()));
      } catch {
        resultado2 = null;
      }
      if (resultado2) {
        setEstacionesBateriaList(resultado2);
        ChangeStatus();
      }
      console.log("llege");
    }
  };

  const WhichIsMyStatus = (horario) => {
    console.log(horario);
    if (horario >= 16) {
      return 3;
    }
    if (horario >= 8) {
      return 2;
    } else {
      return 1;
    }
  };

  const ChangeStatus = () => {
    console.log(EstacionesBateriaList);
    if (EstacionesBateriaList?.length > 0) {
      setEstacionesBateriaList(
        produce((draft) => {
          draft.map((elemento) => {
            const date1 = moment(elemento.createdDate);
            const date2 = moment(Date.now());
            elemento.estadoId = WhichIsMyStatus(date2.diff(date1, "hours"));
          });
        })
      );
    }
  };

  useEffect(() => {
    ChangeStatus();
    const interval = setInterval(() => {
      ChangeStatus();
    }, 60000);

    // This is important, you must clear your interval when component unmounts
    return () => {
      console.log("llege al return");
      return clearInterval(interval);
    };
  }, [ChangeStatus]); // [] is for to execute `useEffect` only once as `componentWillMount`

  useEffect(() => {
    TitleChanger("CREACIÓN DE NUEVA AUDITORÍA");
  }, []);

  return (
    <div>
      <TitleUIComponent title="CARGA DE BATERÍAS" />
      <div className="px-4 bg-backgroundNew shadow-elevation-6 p-2 rounded-lg mx-4">
        <div className="flex justify-between gap-8 items-start">
          <TextField
            name="estacionCodigo"
            fullWidth
            variant="outlined"
            placeholder="Estación"
            label="Estación"
            onChange={(e) => {
              changeEstacion(e);
            }}
            error={errors.estacion}
            helperText={errors.estacion && "Estación no encontrada"}
          />
          <TextField
            fullWidth
            name="bateriaCodigo"
            variant="outlined"
            placeholder="Codigo Batería"
            label="Codigo Batería"
            onChange={(e) => {
              changeBateria(e);
            }}
            error={errors.bateria}
            helperText={errors.bateria && "Batería no encontrada"}
          />
          <Button
            size="large"
            variant="contained"
            className={classNames(classes.greenButton, "px-2 self-center")}
            disabled={errors.bateria || errors.estacion}
            onClick={() => onGuardar()}>
            Cargar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 items-start">
        <div className="grid grid-cols-1 rounded-lg overflow-hidden g-backgroundNew shadow-elevation-6 m-4">
          <div className="col-span-1 rounded-lg text-center py-1 text-2xl font-semibold bg-blue-600 text-gray-200">
            Baterías Completadas
          </div>
          {EstacionesBateriaList &&
            EstacionesBateriaList.map(
              (x) =>
                x.estadoId == 3 && (
                  <div key={x.id} className="grid grid-cols-7 items-center text-center">
                    <div className="col-span-2">Estacion: {x.estacion?.codigo}</div>
                    <div className="col-span-2">Bateria: {x.bateria?.codigo}</div>
                    <div className="col-span-2">
                      Inicio:{" "}
                      <span className="animate__animated animate__FadeIn"> {moment(x.createdDate).fromNow()}</span>
                    </div>
                    <div>
                      <IconButton
                        size="medium"
                        className={classNames(classesIconButton.greenIcon, "px-2 self-center")}
                        disabled={errors.bateria || errors.estacion}
                        onClick={() => completarRegistro(x)}>
                        <Check />
                      </IconButton>
                    </div>
                  </div>
                )
            )}
        </div>
        <div className="grid grid-cols-1 rounded-lg overflow-hidden g-backgroundNew shadow-elevation-6 m-4">
          <div className="col-span-1 rounded-lg text-center py-1 text-2xl font-semibold bg-green-600 text-gray-200">
            Baterias Cargando
          </div>
          {EstacionesBateriaList &&
            EstacionesBateriaList.map(
              (x) =>
                x.estadoId == 1 && (
                  <div key={x.id} className="grid grid-cols-3 text-center">
                    <div>Estacion: {x.estacion?.codigo}</div>
                    <div>Bateria: {x.bateria?.codigo}</div>
                    <div>
                      Inicio:{" "}
                      <span className="animate__animated animate__FadeIn"> {moment(x.createdDate).fromNow()}</span>
                    </div>
                  </div>
                )
            )}
        </div>
        <div className="grid grid-cols-1 rounded-lg overflow-hidden g-backgroundNew shadow-elevation-6 m-4">
          <div className="col-span-1 rounded-lg text-center py-1 text-2xl font-semibold bg-yellow-600 text-gray-200">
            Baterías Reposando
          </div>
          {EstacionesBateriaList &&
            EstacionesBateriaList.map(
              (x) =>
                x.estadoId == 2 && (
                  <div key={x.id} className="grid grid-cols-3 text-center">
                    <div>Estacion: {x.estacion?.codigo}</div>
                    <div>Bateria: {x.bateria?.codigo}</div>
                    <div>
                      Inicio:{" "}
                      <span className="animate__animated animate__FadeIn"> {moment(x.createdDate).fromNow()}</span>
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};
