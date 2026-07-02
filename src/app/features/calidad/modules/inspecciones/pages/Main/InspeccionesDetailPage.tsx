import React, { useEffect, useState } from "react";
import InspeccionesCard from "../../components/inspecciones/InspeccionesCard";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "app/core/store/store";
import { CalidadInspeccionesSliceRequest } from "app/Middleware/reducers/CalidadInspeccionesSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ICalidadInspecciones, ICalidadInspeccionRechazoMultiple } from "app/services/calidad-inspecciones.service";
import moment from "moment";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import Swal from "sweetalert2";
const InspeccionesDetailPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const { codigo }: any = useParams();
  const dispatch = useAppDispatch();

  const [inspecciones, setInpecciones] = useState<ICalidadInspecciones[]>([]);
  const [rechazosMultiples, setRechazosMultiples] = useState<ICalidadInspeccionRechazoMultiple[]>([]);
  const [selected, setSelected] = useState<number>(0);

  const getInspeccionByCodigo = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const inspecciones = unwrapResult(await dispatch(CalidadInspeccionesSliceRequest.GetByCodigo(codigo)));
      setInpecciones(inspecciones);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    getInspeccionByCodigo();
  }, [codigo]);

  useEffect(() => {
    TitleChanger("Detalles Inspecciones Calidad");
  }, []);

  const handleGetRechazos = async (calidadInspeccionId: number) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const rechazo = unwrapResult(
        await dispatch(CalidadInspeccionesSliceRequest.GetRechazosByInspeccionId(calidadInspeccionId))
      );
      if (!rechazo || rechazo.length == 0) {
        Swal.fire({
          icon: "info",
          title: "Informacion",
          text: "No se encontraron rechazos"
        });
        setRechazosMultiples([]);
        setSelected(0);
        return;
      }
      setSelected(calidadInspeccionId);
      setRechazosMultiples(rechazo);
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener los rechazos"
      });
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-2 flex gap-1">
        {inspecciones.map((inspeccion) => (
          <InspeccionesCard
            key={inspeccion.id}
            id={inspeccion.id}
            codigo={inspeccion.codigo}
            fechaCreacion={moment(inspeccion.createdDate).format("DD/MM/YYYY hh:mm:ss")}
            estado={inspeccion.estado}
            finalizado={inspeccion.finalizado}
            iniciado={inspeccion.iniciado}
            inspeccionFuncional={inspeccion.inspeccionFuncional}
            inspeccionVisual={inspeccion.inspeccionVisual}
            selected={selected === inspeccion.id}
            inspector={
              `${inspeccion?.inspeccion?.inspector?.appUser?.operator?.surname} ${inspeccion?.inspeccion?.inspector?.appUser?.operator?.name}` ||
              "Sin Informacion"
            }
            getRechazo={handleGetRechazos}
          />
        ))}
      </div>
      {
        // Aqui se muestra la tabla de los rechazos multiples
        rechazosMultiples.length > 0 && (
          <>
            <div className="h-1 w-full bg-slate-500/10"></div>
            <div>
              <TableComponent
                buscar={true}
                IDcolumn={"id"}
                columns={[
                  {
                    title: "Identificador",
                    field: "calidadInspeccionesId",
                    render: (row) => (
                      <div>
                        <p className="text-gray-400">#{row.calidadInspeccionesId}</p>
                      </div>
                    )
                  },
                  {
                    title: "Tipo de Inspeccion",
                    field: "tipo"
                  },
                  {
                    title: "Componente",
                    field: "rechazoMultiple.componente",
                    render: (row) => (
                      <div>
                        <p>{row?.rechazoMultiple?.componente || "Sin Informacion"}</p>
                      </div>
                    )
                  },
                  {
                    title: "SubComponente",
                    field: "rechazoMultiple.subComponente",
                    render: (row) => (
                      <div>
                        <p>{row?.rechazoMultiple?.subComponente || "Sin Informacion"}</p>
                      </div>
                    )
                  },
                  {
                    title: "Defecto",
                    field: "rechazoMultiple.defecto",
                    render: (row) => (
                      <div>
                        <p>{row?.rechazoMultiple?.defecto || "Sin Informacion"}</p>
                      </div>
                    )
                  }
                ]}
                dataInfo={rechazosMultiples}
              />
            </div>
          </>
        )
      }
    </div>
  );
};

export default InspeccionesDetailPage;
