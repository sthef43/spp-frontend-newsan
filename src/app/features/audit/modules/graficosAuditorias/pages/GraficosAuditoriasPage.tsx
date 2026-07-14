import React, { useEffect, useState } from "react";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { IAppUser, IAuditType, IPlant, IProducto } from "app/models";
import { ContainerForGraphics } from "app/shared/helpers/Graficos/containers/ContainerForGraphics";
import FetchApi from "app/shared/helpers/FetchApi";
import { useAppSelector } from "app/core/store/store";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { SelectComponentNormal } from "app/shared/helpers/ComponentsForForms/SelectComponentNormal";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { AuditTypeSliceRequests } from "app/features/audit/slices/AuditTypeSlice";
import { ProductoSliceRequests } from "app/Middleware/reducers/ProductoSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { AuditHistoricoSliceRequests } from "app/features/audit/slices/AuditHistoricoSlice";
import { IAuditHistorico } from "app/models/IAuditHistorico";

export const GraficosAuditoriasPage = () => {
  const userSession = useAppSelector((state) => state.appUser.data as IAppUser);

  const { TitleChanger } = useTitleOfApp();

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [error, setError] = useState(false);
  const [activeFetch, setActiveFetch] = useState(false);

  const [plantId, setPlantId] = useState(0);
  const [lineaProduccionId, setLineaProduccionId] = useState(0);
  const [productoId, setProductoId] = useState(0);
  const [tipoAuditoria, setTipoAuditoria] = useState("");

  const [plantas, setPlantas] = useState<IPlant[]>([]);
  const [listaAuditorias, setListaAuditorias] = useState<IAuditHistorico[]>([]);
  const [auditTypes, setAuditTypes] = useState<IAuditType[]>([]);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [lineaProduccion, setLineaProduccion] = useState<ILineaProduccion[]>([]);

  FetchApi<IPlant[]>(PlantSliceRequests.getAllRequest, null, false, true, setPlantas, true, false, true);
  FetchApi<IAuditType[]>(
    AuditTypeSliceRequests.GetAllByRolIdRequest,
    userSession?.permisos.rolId,
    false,
    null,
    setAuditTypes,
    false,
    false,
    false
  );
  FetchApi<IProducto[]>(ProductoSliceRequests.getAllRequest, null, false, null, setProductos, false, false, false);
  FetchApi<ILineaProduccion[]>(
    LineaProduccionSliceRequests.getAllByProductId,
    productoId,
    false,
    productoId,
    setLineaProduccion,
    true,
    false,
    false
  );

  FetchApi<IAuditHistorico[]>(
    AuditHistoricoSliceRequests.GetAllAuditHistoricsByPlantRolDatesAndLineId,
    {
      plantId: plantId,
      rolId: userSession?.permisos?.rolId,
      lineId: lineaProduccionId,
      tipoMuestra: tipoAuditoria,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta
    },
    false,
    plantId != 0 && activeFetch,
    setListaAuditorias,
    true,
    false,
    true,
    () => {
      setActiveFetch(false);
    }
  );

  useEffect(() => {
    TitleChanger("Gráficos de Auditorías Realizadas");
  }, []);

  useEffect(() => {
    if (fechaDesde && fechaHasta && plantId != 0 && tipoAuditoria != "" && lineaProduccionId != 0 && productoId != 0) {
      setActiveFetch(true);
    }
  }, [fechaDesde, fechaHasta, plantId, tipoAuditoria, lineaProduccionId, productoId]);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <h1 className="text-2xl font-bold mb-2">Gráficos de Auditorías</h1>
      {/* Contenedor de Filtros (2 fechas y 1 select de planta conectado al servicio) */}
      <ContainerForPages optionsLayout="Selects">
        <div className="w-full flex flex-col justify-center">
          <div className="w-full p-2 flex flex-row items-center gap-x-4">
            <SelectComponentNormal
              label="Seleccionar Planta"
              variant="standard"
              listItems={plantas}
              value={plantId}
              onChange={(item) => {
                setPlantId(item as number);
              }}
              valueLabel={(item) => item.name}
              valueSelect={(item) => item.id}
            />
            <SelectComponentNormal
              label="Seleccionar Producto"
              variant="standard"
              listItems={productos}
              value={productoId}
              onChange={(item) => {
                setProductoId(item as number);
              }}
              valueLabel={(item) => item.nombre}
              valueSelect={(item) => item.id}
            />
            {lineaProduccion.length > 0 && (
              <SelectComponentNormal
                label="Seleccionar Linea de Produccion"
                variant="standard"
                listItems={lineaProduccion}
                value={lineaProduccionId}
                onChange={(item) => {
                  setLineaProduccionId(item as number);
                }}
                valueLabel={(item) => item.nombre}
                valueSelect={(item) => item.id}
              />
            )}
            {auditTypes.length > 0 && lineaProduccionId != 0 && (
              <SelectComponentNormal
                label="Seleccionar Auditoria"
                variant="standard"
                listItems={auditTypes}
                value={tipoAuditoria}
                onChange={(item) => {
                  setTipoAuditoria(item as string);
                }}
                valueLabel={(item) => item.name}
                valueSelect={(item) => item.name}
              />
            )}
          </div>
          <SelectOfDate
            fechaDesdeHasta
            setFechaDesdeProps={setFechaDesde}
            setFechaHastaProps={setFechaHasta}
            setErrorProps={setError}
          />
        </div>
      </ContainerForPages>
      <div className="flex justify-start">
        <ContainerForGraphics
          activeDetailInformation
          classNameStyles="w-full"
          data={listaAuditorias}
          typeGraph="Area"
          titleTooltip="Haga click sobre un indice para obtener mas informacion"
          xAxisKey="indiceAprobacion"
          extraKeysMoreInformation={[
            {
              title: "Nombre Auditoria:",
              objectDate: "nombre"
            },
            {
              title: "Auditores:",
              objectDate: "nombreTipoAuditoria"
            },
            {
              title: "Tipo de Auditoria:",
              objectDate: "tipoMuestra"
            },
            {
              title: "Porcentaje de Aprobacion:",
              objectDate: "indiceAprobacion"
            },
            {
              title: "Operario Encargado",
              renderObjetcDate: (value: IAuditHistorico) => {
                return (
                  <p>
                    {value.operator.name} {value.operator.surname}
                  </p>
                );
              }
            }
          ]}
          areas={[
            { key: `indiceAprobacion`, stroke: "#3b82f6", fill: "#3b82f6" }
          ]}
          activeDoubleChart
          keyForDoubleChart="indiceAprobacion"
          thresholdForDoubleChart={92.00}
        />
      </div>
    </ContainerForPages>
  );
};
export default GraficosAuditoriasPage;
