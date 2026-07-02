import { EstacionesBateriaSliceRequests } from "app/Middleware/reducers/EstacionesBateriaSlice copy";
import { useAppDispatch } from "app/core/store/store";
import { IEstacionesBateria } from "app/features/baterias/models/IEstacionesBateria";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import useFetchApi from "app/shared/hooks/useFetchApi";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { unwrapResult } from "@reduxjs/toolkit";
import produce from "immer";
import _ from "lodash";
import moment from "moment";
import React, { useEffect } from "react";

export const BateriasViewPage = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const { State: EstacionesBateriaList, setState: setEstacionesBateriaList } = useFetchApi<IEstacionesBateria[]>(
    EstacionesBateriaSliceRequests.getAllRequest
  );

  const EstadoDeLaBateria = (bateria: number, tipo: number) => {
    if (tipo == 1) {
      return `linear-gradient( 90deg, rgb(16, 185, 129) 0 ${bateria}%,transparent ${bateria}% 100% )`;
    } else if (tipo == 2) {
      return `linear-gradient( 90deg, rgb(245, 158, 11) 0 ${bateria}%,transparent ${bateria}% 100% )`;
    } else {
      return `transparent`;
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

  const getInfo = async () => {
    let resultado2: IEstacionesBateria[];
    try {
      resultado2 = unwrapResult(await dispatch(EstacionesBateriaSliceRequests.getAllRequest()));
    } catch {
      resultado2 = null;
    }
    if (resultado2) {
      resultado2 = _.orderBy(resultado2, ["createdDate"], ["asc"]);
      setEstacionesBateriaList(resultado2);
      ChangeStatus();
    }
  };

  useEffect(() => {
    ChangeStatus();
    const interval = setInterval(() => {
      getInfo();
    }, 30000);

    // This is important, you must clear your interval when component unmounts
    return () => {
      console.log("llege al return");
      return clearInterval(interval);
    };
  }, [getInfo]);

  useEffect(() => {
    TitleChanger("CREACIÓN DE NUEVA AUDITORÍA");
  }, []);

  return (
    <div>
      <TitleUIComponent title="CONTROL DE CARGA P6" />
      <div className="mx-5">
        <div className="grid grid-cols-2 w-full text-center gap-2">
          <div className="col-span-1 w-full rounded-lg shadow-elevation-6 bg-background overflow-hidden text-center">
            <div className="col-span-1 rounded-lg text-center rounded-b-none py-1 text-2xl font-semibold shadow-elevation-4  bg-green-600 text-gray-200">
              <div>BATERÍAS CARGANDO</div>
              <div className="grid grid-cols-4 w-full py-1 text-lg font-semibold text-gray-200">
                <div>ESTACIÓN</div>
                <div>BATERÍA</div>
                <div>CARGA</div>
                <div>TIEMPO</div>
              </div>
            </div>
            {EstacionesBateriaList &&
              EstacionesBateriaList.map((element, _index) => {
                if (element.estadoId == 1)
                  return (
                    <div
                      key={element.id}
                      className="col-span-1 grid grid-cols-4 text-xl py-1 w-full"
                      style={{
                        background: EstadoDeLaBateria(
                          (moment(Date.now()).diff(moment(element.createdDate), "minutes") / 480) * 100,
                          element.estadoId
                        )
                      }}>
                      <div>{element.estacion.codigo}</div>
                      <div>{element.bateria.codigo}</div>
                      <div>
                        Cargando{" "}
                        {Math.round((moment(Date.now()).diff(moment(element.createdDate), "minutes") / 480) * 100)}%
                      </div>
                      <div>{moment(element.createdDate).fromNow()}</div>
                    </div>
                  );
              })}
          </div>
          <div className=" col-span-1 w-full rounded-lg shadow-elevation-6 bg-background overflow-hidden text-center">
            <div className="col-span-1 rounded-lg text-center rounded-b-none py-1 text-2xl font-semibold shadow-elevation-4  bg-yellow-600 text-gray-200">
              <div>BATERÍAS REPOSANDO</div>
              <div className="grid grid-cols-4 w-full bg-yellow-600 py-1  text-lg font-semibold text-gray-200">
                <div>ESTACIÓN</div>
                <div>BATERÍA</div>
                <div>CARGA</div>
                <div>TIEMPO</div>
              </div>
            </div>
            {EstacionesBateriaList &&
              EstacionesBateriaList.map((element, _index) => {
                if (element.estadoId == 2)
                  return (
                    <div
                      key={element.id}
                      className="col-span-1 grid grid-cols-4 text-xl py-1 w-full"
                      style={{
                        background: EstadoDeLaBateria(
                          (moment().diff(moment(element.createdDate).add(8, "hours"), "minutes") / 480) * 100,
                          element.estadoId
                        )
                      }}>
                      <div>{element.estacion.codigo}</div>
                      <div>{element.bateria.codigo}</div>
                      <div>
                        Reposando{" "}
                        {Math.round(
                          (moment().diff(moment(element.createdDate).add(8, "hours"), "minutes") / 480) * 100
                        )}
                        %
                      </div>
                      <div>{moment(element.createdDate).add(8, "hours").fromNow()}</div>
                    </div>
                  );
              })}
          </div>
          <div className="col-span-2 w-full rounded-lg shadow-elevation-6 bg-background overflow-hidden text-center">
            <div className="col-span-1 rounded-lg text-center rounded-b-none py-1 text-2xl font-semibold shadow-elevation-4  bg-blue-600 text-gray-200">
              <div>BATERÍAS COMPLETADAS</div>
              <div className="grid grid-cols-3 w-full bg-blue-600 py-1  text-lg font-semibold text-gray-200">
                <div>ESTACIÓN</div>
                <div>BATERÍA</div>
                <div>TIEMPO</div>
              </div>
            </div>
            {EstacionesBateriaList &&
              EstacionesBateriaList.map((element, index) => {
                if (element.estadoId == 3)
                  return (
                    <div key={index} className="col-span-1 grid grid-cols-3 text-xl py-1 w-full">
                      <div>{element.estacion.codigo}</div>
                      <div>{element.bateria.codigo}</div>
                      <div>{moment(element.createdDate).add(16, "hours").fromNow()}</div>
                    </div>
                  );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
