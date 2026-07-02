/* eslint-disable @typescript-eslint/no-explicit-any */
import { unwrapResult } from "@reduxjs/toolkit";
import { ScrapPlacasSliceRequests } from "app/Middleware/reducers/scrapPlacasSlice";
import { useAppDispatch } from "app/core/store/store";
import React, { useEffect, useRef, useState } from "react";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { AssignmentLateOutlined } from "@mui/icons-material";
import {
  FormHelperText,
  IconButton,
  InputLabel,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Tooltip
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { IScrapPlacas } from "app/services/scrapPlacas.service";
import { SemielaboradoIASliceRequest } from "app/Middleware/reducers/semielaboradoIaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { Controller, useForm } from "react-hook-form";
import { IPlanProd } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { empq_declarationsSliceRequests } from "app/Middleware/reducers/Empq_declarationsSlice";

import moment from "moment";
import { IEMPQ_Declarations } from "app/services/empq_declarations.service";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";

const ScrapPlacasPage = (): JSX.Element => {
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const [row, setRow] = useState<IScrapPlacas>(null);
  const [openListadoOp, setOpenListadoOp] = useState(false);
  const [scrapPlacas, setScrapPlacas] = useState<any[]>([]);
  const [numerosOp, setListaNumerosOp] = useState<any>(null);
  const [opsByFamilia, setOpsByFamilia] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const planesProduccion = useRef<IPlanProd[]>([]);
  const scrapPlacaSeleccionado = useRef<IScrapPlacas>(null);

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      comentarioCalidad: "",
      numeroOp: "",
      fechaInicio: moment().toDate(),
      fechaFin: moment().toDate()
    }
  });

  const numeroOp = watch("numeroOp") ?? "";
  const comentarioCalidad = watch("comentarioCalidad") ?? "";
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");
  const opEsSinAsignar = numeroOp.trim() === "" || numeroOp.trim().toLowerCase() === "sin op asignada";
  const puedeGuardar = opEsSinAsignar ? true : comentarioCalidad.trim().length > 0;

  const getScrapPlacasByFecha = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());

      const param = {
        fechaDesde: moment(fechaInicio).format("YYYY-MM-DD"),
        fechaHasta: moment(fechaFin).format("YYYY-MM-DD")
      };

      if (param.fechaDesde > param.fechaHasta) {
        openNotificationUI("Fecha Desde debe ser MENOR a Fecha Hasta", "error");
      } else {
        const scrapPlacas = unwrapResult(await dispatch(ScrapPlacasSliceRequests.getListByDesdeHastaRequest(param)));

        if (scrapPlacas) {
          const resx: any = {};
          const listaNumerosOp = scrapPlacas.map((e) => e.numeroOp);
          const listaNumerosOpUnicos = [...new Set(listaNumerosOp)];

          listaNumerosOpUnicos.forEach((op) => {
            if (op == "") {
              resx[op] = "Sin OP Asignada";
            } else {
              resx[op] = op;
            }
          });

          setListaNumerosOp(resx);
        }

        setScrapPlacas(scrapPlacas || []);
      }

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(error, "error");
    }
  };

  const cargarOpsParaModal = async (scrapPlaca: IScrapPlacas) => {
    setOpsByFamilia([]);
    planesProduccion.current = [];

    // Nuevo endpoint: OPs por familia
    try {
      const familia = scrapPlaca?.familia;
      if (!familia) throw new Error("Sin familia en la placa");

      const ops = unwrapResult(await dispatch(ScrapPlacasSliceRequests.getOpsByFamiliaRequest(familia)));
      setOpsByFamilia(Array.isArray(ops) ? ops : []);
      return;
    } catch (e) {
      console.log("No se pudo traer OPs por familia. Fallback a semielaborado:", e);
    }

    // Fallback viejo
    const operacion = scrapPlaca?.operacion;
    if (!operacion) throw new Error("Sin operacion Asignada");

    const semiIA = unwrapResult(await dispatch(SemielaboradoIASliceRequest.getByValorRequest(operacion.semiElaborado)));
    if (!semiIA) throw new Error("No se obtuvo un semielaborado");

    const tipoSemielaboradoId = semiIA.semielaboradoTipoId;
    const planProds = unwrapResult(
      await dispatch(
        PlanProdSliceRequests.GetOpsSemiElaborado({
          modelo: scrapPlaca.familia,
          semielaboradoId: tipoSemielaboradoId
        })
      )
    );

    planesProduccion.current = planProds || [];
  };

  const asignarOp = async (scrapPlaca: IScrapPlacas) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());

      scrapPlacaSeleccionado.current = scrapPlaca;
      setRow(scrapPlaca);

      // Precargar OP si existe (permite reasignar)
      const opActual = scrapPlaca?.numeroOp;
      const tieneOpReal = opActual && opActual !== "" && opActual !== "Sin OP Asignada";
      setValue("numeroOp", tieneOpReal ? opActual : "");

      // Precargar comentario
      setValue("comentarioCalidad", scrapPlaca?.comentariosCalidad || "");

      await cargarOpsParaModal(scrapPlaca);

      setOpenListadoOp(true);

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Ha Ocurrido un error al obtener las ops", "error");
    }
  };

  useEffect(() => {
    TitleChanger("Scrap Placas");
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const opNuevaRaw = (values.numeroOp ?? "").toString().trim();
      const opNueva = opNuevaRaw.toLowerCase() === "sin op asignada" ? "" : opNuevaRaw;

      const opAnteriorRaw = (scrapPlacaSeleccionado.current?.numeroOp ?? "").toString().trim();
      const opAnterior = opAnteriorRaw.toLowerCase() === "sin op asignada" ? "" : opAnteriorRaw;

      let titulo = "";
      let mensaje = "";

      if (opAnterior === "" && opNueva !== "") {
        titulo = "Asignar OP";
        mensaje = `¿Confirmás asignar la OP ${opNueva}?`;
      } else if (opAnterior !== "" && opNueva === "") {
        titulo = "Quitar OP";
        mensaje = `Vas a quitar la OP ${opAnterior} y la placa volverá a rechazado. ¿Confirmás?`;
      } else if (opAnterior !== "" && opNueva !== "" && opAnterior !== opNueva) {
        titulo = "Reasignar OP";
        mensaje = `Vas a cambiar la OP de ${opAnterior} a ${opNueva}. ¿Confirmás?`;
      } else {
        titulo = "Guardar";
        mensaje = "¿Confirmás guardar los cambios?";
      }

      const ok = await getConfirmation(titulo, mensaje);
      if (!ok) return;

      dispatch(LoadingUISlice.actions.LoadingUIOpen());

      const comentarioFinal = opNueva === "" ? "" : values.comentarioCalidad;

      const scrapPlaca: IScrapPlacas = {
        ...scrapPlacaSeleccionado.current,
        comentariosCalidad: comentarioFinal,
        numeroOp: opNueva
      };

      const empaque = unwrapResult(await dispatch(empq_declarationsSliceRequests.getByCodigo(scrapPlaca.codigo)));

      if (!empaque && opNueva !== "") {
        const planSeleccionado = planesProduccion.current.find((d) => d.numeroOp == opNueva);

        if (!planSeleccionado) {
          openNotificationUI(
            "No se encontró detalle de PlanProd para crear EMPQ. Se guardó la OP en ScrapPlacas.",
            "warning"
          );
        } else {
          const newEmpaque: IEMPQ_Declarations = {
            id: scrapPlaca.codigo,
            cantidad: 1,
            organization_code: planSeleccionado.organizacion,
            codigo_Producto: planSeleccionado.tipoSemiElaborado,
            fecha_Insercion: moment().format(),
            modelo: scrapPlaca.modelo,
            nro_Op: opNueva,
            referencia_1: null
          };

          unwrapResult(await dispatch(empq_declarationsSliceRequests.postRequest(newEmpaque)));
        }
      }

      unwrapResult(await dispatch(ScrapPlacasSliceRequests.PutRequest(scrapPlaca)));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        openNotificationUI(JSON.stringify(error.message), "error");
      } else {
        openNotificationUI(JSON.stringify(error), "error");
      }
    } finally {
      reset({
        comentarioCalidad: "",
        numeroOp: "",
        fechaInicio,
        fechaFin
      });

      setOpenListadoOp(false);
      setOpsByFamilia([]);
      planesProduccion.current = [];
      scrapPlacaSeleccionado.current = null;
      setRow(null);

      getScrapPlacasByFecha();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <div style={{ margin: "1%" }}>
      <div className="grid col-span-1 sm:grid-cols-6 gap-8 text-center bg-secondaryNew rounded-md shadow-elevation-6 p-2 mt-2 items-center">
        <div>
          <DesktopDatePicker
            label="Desde"
            value={fechaInicio}
            inputFormat="DD/MM/yyyy"
            onChange={(e: any) => setValue("fechaInicio", e)}
            renderInput={(field) => <TextField {...field} variant="standard" />}
          />
        </div>
        <div>
          <DesktopDatePicker
            label="Hasta"
            value={fechaFin}
            inputFormat="DD/MM/yyyy"
            onChange={(e: any) => setValue("fechaFin", e)}
            renderInput={(field) => <TextField {...field} variant="standard" />}
          />
        </div>
        <div>
          <Button className={buttonClasses.blueButton} onClick={getScrapPlacasByFecha}>
            Buscar
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <TitleUIComponent title={`Scrap Diario: ${scrapPlacas.length}`} />
      </div>

      <div className="mx-4">
        <TableComponent
          IDcolumn={"id"}
          excel
          columns={[
            { title: "Codigo", field: "codigo" },
            { title: "Origen", field: "origen" },
            { title: "Causa", field: "causa" },
            { title: "Componente", field: "componente" },
            { title: "Modelo", field: "modelo" },
            { title: "Familia", field: "familia" },
            {
              title: "Numero de OP",
              field: "numeroOp",
              lookup: numerosOp,
              render: (row) => <div>{row.numeroOp || "Sin OP Asignada"}</div>
            },
            {
              title: "Fecha",
              field: "createdDate",
              render: (row) => moment(row.createdDate).format("L")
            },
            {
              title: "Comentario Calidad",
              field: "comentariosCalidad",
              render: (row) => <p>{row.comentariosCalidad}</p>
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => (
                <div ref={containerRef}>
                  <Tooltip title="Asignar / Reasignar OP">
                    <IconButton onClick={() => asignarOp(row)} size="small">
                      <AssignmentLateOutlined />
                    </IconButton>
                  </Tooltip>
                </div>
              )
            }
          ]}
          dataInfo={scrapPlacas}
          buscar
          Dense
          filterWithSpecificValues={"Estado"}
        />

        <ModalCompoment title={"Asignacion de OP"} openPopup={openListadoOp} setOpenPopup={setOpenListadoOp}>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Aviso OP actual */}
              {row?.numeroOp && row.numeroOp !== "" && row.numeroOp !== "Sin OP Asignada" ? (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.06)",
                    marginBottom: 12
                  }}>
                  <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>OP actual</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{row.numeroOp}</div>
                </div>
              ) : null}

              <Controller
                name="numeroOp"
                control={control}
                rules={{}}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <InputLabel id="numero-op-label" shrink>
                      Seleccione la OP
                    </InputLabel>

                    <Select
                      labelId="numero-op-label"
                      label="Seleccione la OP"
                      value={field.value ?? ""}
                      input={<OutlinedInput label="Seleccione la OP" />}
                      displayEmpty
                      onChange={(e) => {
                        const newValue = (e.target.value ?? "").toString();

                        field.onChange(newValue);

                        const opNorm = newValue.trim().toLowerCase();
                        if (opNorm === "" || opNorm === "sin op asignada") {
                          setValue("comentarioCalidad", "");
                        }
                      }}>
                      <MenuItem value="">
                        <em>Sin OP Asignada</em>
                      </MenuItem>

                      {opsByFamilia?.length > 0
                        ? opsByFamilia.map((op) => (
                            <MenuItem key={op} value={op}>
                              {op}
                            </MenuItem>
                          ))
                        : planesProduccion.current?.map((x) => (
                            <MenuItem key={x.idProduccion} value={x.numeroOp}>
                              {x.numeroOp}
                            </MenuItem>
                          ))}
                    </Select>

                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />

              <hr className="m-2" />
              <Controller
                name="comentarioCalidad"
                control={control}
                rules={{
                  validate: (v) => {
                    const op = (watch("numeroOp") ?? "").toString().trim().toLowerCase();
                    const opSinAsignar = op === "" || op === "sin op asignada";

                    if (opSinAsignar) return true;

                    return (v ?? "").toString().trim().length > 0;
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField label="Comentario" multiline {...field} />
                    {!!error && <FormHelperText>Comentario requerido</FormHelperText>}
                  </FormControl>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
                <Button
                  className={`${buttonClasses.redButton} col-span-2`}
                  variant="contained"
                  onClick={() => {
                    reset({
                      comentarioCalidad: "",
                      numeroOp: "",
                      fechaInicio,
                      fechaFin
                    });
                    setOpsByFamilia([]);
                    planesProduccion.current = [];
                    setOpenListadoOp(false);
                  }}>
                  Cancelar
                </Button>

                <Button
                  className={`${buttonClasses.greenButton} col-span-2`}
                  type="submit"
                  variant="contained"
                  disabled={!puedeGuardar}>
                  Guardar
                </Button>
              </div>

              {!puedeGuardar && (
                <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8, textAlign: "center" }}>Agregue un comentario</p>
              )}
            </form>
          </div>
        </ModalCompoment>
      </div>
    </div>
  );
};

export default ScrapPlacasPage;
