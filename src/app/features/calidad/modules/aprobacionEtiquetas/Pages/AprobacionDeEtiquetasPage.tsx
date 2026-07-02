import { Button, MenuItem, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea, IPlant } from "app/models";
import { IImpresionEtiqueta } from "app/models/IImpresionEtiqueta";
import { AprobarEtiquetasModal } from "app/features/calidad/modules/aprobacionEtiquetas/Components/AprobarEtiquetasModal";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { AprobarMaterialModal } from "app/features/calidad/modules/aprobacionEtiquetas/Components/AprobarMaterialModal";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import { useForm } from "react-hook-form";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";

interface argumentosEndpoint {
  fechaDesde: string;
  fechaHasta: string;
  numeroOp?: string;
  idLinea: number;
  opcion: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AprobacionDeEtiquetasPage = () => {
  const { control } = useForm();

  const ImpresionEtiquetas = useAppSelector((x) => x.impresionEtiquetas.dataAll);
  // const planprod = useAppSelector((x) => x.planprod.dataAll);
  // const [selectedPlanProd, setSelectedPlanProd] = React.useState<IPlanProd>(null);

  const classes = MaterialButtons();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [selectedLinea, setSelectedLinea] = React.useState(0);
  const plantas = useAppSelector((state) => state.plant.dataAll as IPlant[]);
  const [plantSelected, setPlantSelected] = useState<string | number>(0);
  const [lineas, setLineas] = useState<ILinea[]>();

  // const CustomAutocomplete = (options, onChange, defaultValue) => {
  //   return (
  //     <Autocomplete
  //       options={options}
  //       onChange={onChange}
  //       defaultValue={defaultValue}
  //       getOptionLabel={(option) => `${option.codigoModelo}  ${option?.numeroOp} Lote ${option?.lote}`}
  //       renderInput={(props) => <TextField {...props} variant="standard" fullWidth label="Modelo" />}
  //     />
  //   );
  // };

  // const [valor, setValor] = React.useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalAprobarMaterial, setOpenModalAprobarMaterial] = React.useState(false);
  const [dataTable, setDataTable] = React.useState<IImpresionEtiqueta[]>([]);
  const [argumentosEndpoint, setArgumentosEndpoint] = useState<argumentosEndpoint>();

  //Estados para el select de fecha
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [error, setError] = useState(false);

  //Id para saber si tiene que traer por aprobacion o creado
  const [estadoSeleccionada, setEstadoSeleccionado] = useState<string | number>(0);
  const listadoAprobaciones = [
    { id: 1, estado: "Filtrar por fecha de impresion" },
    { id: 2, estado: "Filtrar por fecha de aprobacion" }
  ];

  // const handleChange = (e, value) => {
  //   // what to do here?
  //   dispatch(PlanProdSlice.actions.setObject(value))
  //   console.log(value);
  //   if (value) setSelectedPlanProd(value);
  // };

  // const refresh = async () => {
  //   const response = await dispatch(ImpresionEtiquetaSliceRequests.getByOP(selectedPlanProd.numeroOp));
  // };

  const getImpresionLinea = async () => {
    if (!error && selectedLinea != 0) {
      try {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(
          await dispatch(
            ImpresionEtiquetaSliceRequests.GetAllImpresionByDateLineaAndOpcion({
              fechaDesde: fechaDesde,
              fechaHasta: fechaHasta,
              lineaId: selectedLinea,
              opcion: estadoSeleccionada
            })
          )
        );
        dispatch(PlanProdSliceRequests.GetPlanProdByIdLinea(selectedLinea));
        if (response) {
          const nuevosArgumentos: argumentosEndpoint = {
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            idLinea: selectedLinea | 0,
            opcion: estadoSeleccionada.toString()
          };
          setArgumentosEndpoint(nuevosArgumentos);
          setDataTable(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
  };

  const getLineasByPlant = async () => {
    let result = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
    if (result) {
      result = result.filter((x) => x.plantId == plantSelected);
      if (result && result.length > 0) setLineas(result);
      else {
        setLineas(null);
        setDataTable([]);
        console.log("set lineas null");
      }
    }
  };

  // const getImpresionesModelo = async () => {
  //   try {
  //     dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."))
  //     const response = unwrapResult(await dispatch(ImpresionEtiquetaSliceRequests.GetAllImpresionByDateOPAndOpcion({ fechaDesde: fechaDesde, fechaHasta: fechaHasta, op: selectedPlanProd.numeroOp, opcion: estadoSeleccionada })))
  //     if (response) {
  //       const nuevosArgumentos: argumentosEndpoint = { fechaDesde: fechaDesde, fechaHasta: fechaHasta, idLinea: selectedLinea.idLinea, opcion: estadoSeleccionada.toString(), numeroOp: selectedPlanProd.numeroOp}
  //       setArgumentosEndpoint(nuevosArgumentos)
  //       setDataTable(response)
  //     }
  //   } catch (error) {
  //     openNotificationUI(error, "error")
  //   } finally {
  //     dispatch(LoadingUISlice.actions.LoadingUIClose())
  //   }
  // }

  const horaDeAprobacion = (row: IImpresionEtiqueta) => {
    if (row.lastModifiedDate !== null && row.usuarioAprobacion !== "") {
      return moment(row.lastModifiedDate).format("L") + " " + moment(row.lastModifiedDate).format("LTS");
    } else if (row.fechaAprobacion !== null && row.horaAprobacion !== null) {
      return moment(row.fechaAprobacion).format("L") + " " + moment(row.horaAprobacion).format("LTS");
    } else {
      return `Sin Aprobacion`;
    }
  };

  React.useEffect(() => {
    TitleChanger("Aprobación de etiquetas");
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);

  React.useEffect(() => {
    if (ImpresionEtiquetas) setDataTable(ImpresionEtiquetas);
    else setDataTable(null);
  }, [ImpresionEtiquetas]);

  React.useEffect(() => {
    if (selectedLinea !== null || fechaDesde || fechaHasta || estadoSeleccionada) {
      getImpresionLinea();
    }
  }, [selectedLinea, fechaDesde, fechaHasta, estadoSeleccionada]);

  //llamo a las etiquetas
  // React.useEffect(() => {
  //   if (selectedPlanProd && !error) {
  //     getImpresionesModelo()
  //   }
  // }, [selectedPlanProd]);

  useEffect(() => {
    if (plantSelected && Number(plantSelected) > 0) getLineasByPlant();
    //getLineasByPlantId();
  }, [plantSelected]);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <ContainerForPages optionsLayout="Selects">
        {plantas && (
          <div className="p-2 w-[350px]">
            <SelectComponent
              varianteEstilo="standard"
              listaObjetos={plantas}
              inputLabel={"Selecione la planta"}
              nameSelect="planta"
              valueSelect={(value) => value.id}
              valueLabel={(value) => value.name}
              control={control}
              ValueSave={setPlantSelected}
              valueKey={(value) => value}
            />
          </div>
        )}
        <div>
          <SelectOfDate
            fechaDesdeHasta
            setFechaDesdeProps={setFechaDesde}
            setFechaHastaProps={setFechaHasta}
            setErrorProps={setError}
          />
        </div>
        <div className="w-[400px] p-2">
          <SelectComponent
            varianteEstilo="standard"
            listaObjetos={listadoAprobaciones}
            inputLabel={"Selecione una opcion de aprobacion"}
            nameSelect="estadoAprobacion"
            valueSelect={(value) => value.id}
            valueLabel={(value) => value.estado}
            control={control}
            ValueSave={setEstadoSeleccionado}
            valueKey={(value) => value}
          />
        </div>
        <div className="w-[400px] p-2">
          <TextField
            variant="standard"
            value={selectedLinea}
            label="Linea"
            defaultValue={0}
            placeholder="Seleccione la linea"
            fullWidth
            onChange={(e: any) => {
              if (e.target.value) {
                const info = lineas.find((x) => x.idLinea == e.target.value);
                setSelectedLinea(info.idLinea);
              }
            }}
            select>
            {lineas?.map((line: ILinea) => (
              <MenuItem key={line.idLinea} value={line.idLinea}>
                {line.descripcion}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {/* <div style={{ width: "400px" }}>{planprod && CustomAutocomplete(planprod, handleChange, valor)}</div> */}
      </ContainerForPages>
      {/* Empieza la tabla */}
      <div className="mt-4">
        <div className="m-2 flex justify-center gap-x-4">
          <Button className={classes.greenButton} onClick={() => setOpenModal(true)}>
            Aprobar etiqueta
          </Button>
          <Button className={classes.blueButton} onClick={() => setOpenModalAprobarMaterial(true)}>
            Aprobar material
          </Button>
        </div>
        {dataTable && selectedLinea && (
          <ContainerForPages optionsLayout="Table" activeEffectVisible>
            <TableComponent
              IDcolumn="idImpresionEtiqueta"
              columns={[
                {
                  title: "Número de OP",
                  field: "numeroOp"
                },
                {
                  title: "Ingresado por",
                  field: "nombreUsuario"
                },
                {
                  title: "Modelo",
                  field: "codigoModelo"
                },
                {
                  title: "Codigo Interno",
                  field: "codigoInterno"
                },
                {
                  title: "Descripción de etiqueta",
                  field: "tipoEtiqueta.descripcion"
                },
                {
                  title: "Cantidad",
                  field: "cantidadImpresa"
                },
                {
                  title: "Lote",
                  field: "lote"
                },
                {
                  title: "Fecha y hora Aprobacion",
                  field: "",
                  render: (row) => horaDeAprobacion(row)
                },
                {
                  title: "Aprobado por:",
                  field: "usuarioAprobacion"
                }
              ]}
              dataInfo={dataTable}
              buscar={true}
            />
          </ContainerForPages>
        )}
      </div>
      <ModalCompoment
        setOpenPopup={setOpenModal}
        openPopup={openModal}
        title="Aprobar etiqueta"
        titleModalStyle="Audit"
        subTitle="Aprobacion de etiquetas para calidad"
        showModalCenterPage>
        <AprobarEtiquetasModal
          listaArgumentos={argumentosEndpoint}
          setDataTable={setDataTable}
          setOpenModal={setOpenModal}
          lineaId={selectedLinea}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalAprobarMaterial}
        openPopup={openModalAprobarMaterial}
        title="Aprobar material">
        <AprobarMaterialModal
          openModal={openModalAprobarMaterial}
          setDataTable={setDataTable}
          setOpenModal={setOpenModalAprobarMaterial}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
