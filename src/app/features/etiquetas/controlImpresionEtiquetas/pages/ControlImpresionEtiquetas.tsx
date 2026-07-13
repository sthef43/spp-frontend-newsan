import { Delete, Edit } from "@mui/icons-material";
import { Autocomplete, Checkbox, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import { ImpresionEtiquetaSlice, ImpresionEtiquetaSliceRequests } from "app/Middleware/reducers/ImpresionEtiquetaSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { PlanProdSliceRequests } from "app/Middleware/reducers/PlanProdSlice";
import { TipoEtiquetaSliceRequests } from "app/Middleware/reducers/TipoEtiquetaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea, IPlanProd } from "app/models";
import { IImpresionEtiqueta } from "app/models/IImpresionEtiqueta";
import { ITipoEtiqueta } from "app/models/ITipoEtiqueta";
import { EtiquetasComponent } from "app/features/etiquetas/controlImpresionEtiquetas/components/Etiquetas.component";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import moment from "moment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

interface ModalInformation {
  idLinea: number;
  idTipoEtiqueta: number;
  tipoEtiquetaDescripcion: string;
  tipoEtiquetaCodigo: string;
  lote: string;
  codigoModelo: string;
  numeroOp: string;
  prefijoNewsan: string;
}

interface RfidRow {
  rfidDesde: string;
  rfidHasta: string;
}

export const ControlimpresionEtiquetas: React.FC = () => {
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const planprod = useAppSelector((x) => x.planprod.dataAll);
  const linea = useAppSelector((x) => x.linea.dataAll);
  const tipoEtiquetas = useAppSelector((x) => x.tipoEtiquetas.dataAll);

  const cantidadEtiquetas = useAppSelector((x) => x.impresionEtiquetas.dataAll);
  const impresionEtiquetas = useAppSelector((x) => x.impresionEtiquetas.filteredData);
  const [selectedLinea, setSelectedLinea] = useState<ILinea | null>(null);
  const [selectedPlanProd, setSelectedPlanProd] = useState<IPlanProd | null>(null);
  const [selectedTipoEtiqueta, setSelectedTipoEtiqueta] = useState<ITipoEtiqueta | null>(null);
  const [selectedEtiquetaImpresion, setSelectedEtiquetaImpresion] = useState<IImpresionEtiqueta | null>(null);
  const [modalInformation, setModalInformation] = useState<ModalInformation | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [rfidAnchorEl, setRfidAnchorEl] = useState<null | HTMLElement>(null);
  const [rfidRow, setRfidRow] = useState<RfidRow | null>(null);
  const [rfidLoading, setRfidLoading] = useState(false);
  const [rfidError, setRfidError] = useState<string | null>(null);
  const [prefijoNewsan, setPrefijoNewsan] = useState<string>("");

  const rfidOpen = Boolean(rfidAnchorEl);

  const closeRfidPopover = () => {
    setRfidAnchorEl(null);
    setRfidRow(null);
    setRfidLoading(false);
    setRfidError(null);
  };

  const tipoSel = (selectedTipoEtiqueta?.descripcion ?? "").toLowerCase();
  const isTipoSelRFID = tipoSel.includes("rfid");
  //llamos al plan prod de esa linea y las etiquetas
  useEffect(() => {
    setSelectedPlanProd(null);

    if (selectedLinea) {
      dispatch(PlanProdSliceRequests.GetPlanProdByIdLinea(selectedLinea.idLinea));
      dispatch(TipoEtiquetaSliceRequests.GetByIdLinea(selectedLinea.idLinea));
    }
  }, [selectedLinea]);

  //llamo a las etiquetas
  useEffect(() => {
    if (selectedPlanProd) {
      dispatch(ImpresionEtiquetaSliceRequests.getByOP(selectedPlanProd.numeroOp));
    }
  }, [selectedPlanProd]);

  useEffect(() => {
    if (selectedTipoEtiqueta) {
      dispatch(ImpresionEtiquetaSlice.actions.filtrar(selectedTipoEtiqueta?.idTipoEtiqueta));
    }
  }, [selectedTipoEtiqueta]);

  const deleteInfo = async (e: IImpresionEtiqueta) => {
    await dispatch(ImpresionEtiquetaSliceRequests.deleteWithRFIDRequest(e.idImpresionEtiqueta));
    await dispatch(ImpresionEtiquetaSliceRequests.getByOP(selectedPlanProd.numeroOp));
    await dispatch(ImpresionEtiquetaSlice.actions.filtrar(selectedTipoEtiqueta?.idTipoEtiqueta));
  };

  const contar = (e: ITipoEtiqueta) => {
    const count = cantidadEtiquetas?.filter((x) => x.idTipoEtiqueta == e.idTipoEtiqueta);
    let cantidadImpresa = 0;
    count?.map((x) => (cantidadImpresa += x.cantidadImpresa));
    return selectedPlanProd?.cantidad * e.posiciones - cantidadImpresa;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomAutocomplete = (options: any[], onChange: (e: React.SyntheticEvent, value: IPlanProd | null) => void, value: IPlanProd | null) => {
    return (
      <Autocomplete
        options={options}
        value={value}
        onChange={onChange}
        getOptionLabel={(option) => `${option.codigoModelo} ${option.numeroOp} Lote ${option.lote}`}
        renderInput={(props) => <TextField {...props} fullWidth label="Modelos" />}
      />
    );
  };

  const handleChange = async (e: React.SyntheticEvent, value: IPlanProd | null) => {
    if (!value) return;
    setSelectedPlanProd(value);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/PlanProd/GetPrefijoNewsanByModelo/${value.codigoModelo}`
      );
      setPrefijoNewsan(res.data?.prefijo ?? "");
    } catch {
      setPrefijoNewsan("");
      openNotificationUI("No se encontro prefijo para este modelo.", "warning");
    }
  };

  const horaDeAprobacion = (row: IImpresionEtiqueta) => {
    if (row.createdDate !== null) {
      return moment(row.createdDate).format("L") + " " + moment(row.createdDate).format("LTS");
    } else if (row.fechaImpresion !== null) {
      return moment(row.fechaImpresion).format("L") + " " + moment(row.fechaImpresion).format("LTS");
    } else {
      return `Sin Aprobacion`;
    }
  };

  const buildModalInformation = (): ModalInformation => ({
    idLinea: selectedTipoEtiqueta?.idLinea ?? 0,
    idTipoEtiqueta: selectedTipoEtiqueta?.idTipoEtiqueta ?? 0,
    tipoEtiquetaDescripcion: selectedTipoEtiqueta?.descripcion ?? "",
    tipoEtiquetaCodigo: selectedTipoEtiqueta?.codigo ?? "",
    lote: selectedPlanProd?.lote ?? "",
    codigoModelo: selectedPlanProd?.codigoModelo ?? "",
    numeroOp: selectedPlanProd?.numeroOp ?? "",
    prefijoNewsan: prefijoNewsan
  });

  useEffect(() => {
    TitleChanger("Control de impresion de etiquetas");
    dispatch(LineaSliceRequests.getAllRequest());
  }, []);

  //Lineas no visibles en front, eliminar una en caso de necesitar ver y usar.
  const lineasVisibles = useMemo(() => linea?.filter((l: ILinea) => {
    const d = (l.descripcion ?? "").toLowerCase();

    return !(
      d.includes("insercion manual") ||
      d.includes("im -") ||
      d.includes("im-") ||
      d.includes("display") ||
      d.includes("caja electrica") ||
      d.includes("caja eléctrica") ||
      d.includes("placa") ||
      d.includes("renacer") ||
      d.includes("automotriz")
    );
  }), [linea]);

  return (
    <ContainerForPages optionsLayout="page" activeEffectVisible>
      <div className="wraper-container flex flex-wrap flex-col gap-8">
        <ContainerForPages optionsLayout="Selects">
        <TextField
          value={selectedLinea?.idLinea || null}
          label="Linea"
          placeholder="Seleccione la linea"
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value) {
              const info = linea.find((x) => x.idLinea === Number(e.target.value));
              setSelectedLinea(info);
            }
          }}
          select>
          {lineasVisibles?.map((line: ILinea) => (
            <MenuItem key={line.idLinea} value={line.idLinea}>
              {line.descripcion}
            </MenuItem>
          ))}
        </TextField>

        {selectedLinea && planprod?.length > 0 && CustomAutocomplete(planprod, handleChange, selectedPlanProd)}
        </ContainerForPages>

        {selectedPlanProd && (
          <div className="grid grid-cols-2 gap-2 md:gap-8">
            <TextField label="lote" disabled fullWidth value={selectedPlanProd?.lote}></TextField>
            <TextField label="cantidad" disabled fullWidth value={selectedPlanProd?.cantidad}></TextField>
          </div>
        )}

        {selectedPlanProd && selectedLinea && (
          <div className="grid grid-cols-1 gap-2 md:gap-8 md:grid-cols-2">
            <div>
              <div className="bg-gradient-to-r from-newsan from-20% via-newsanColorMidSubtitle via-50% to-newsan to-80% shadow-elevation-8 my-2 mx-4 py-2 rounded-md text-gray-900 text-2xl dark:text-gray-200 ">
                <h1 className="text-center text-white ">Tipo de etiquetas</h1>
              </div>

              <ContainerForPages optionsLayout="Table" activeEffectVisible>
              <TableComponent
                IDcolumn="idTipoEtiqueta"
                columns={[
                  { title: "Tipo de etiqueta", field: "descripcion" },
                  { title: "Posiciones", field: "posiciones" },
                  { title: "Cantidad faltante", field: "", render: (e) => <div>{contar(e)}</div> },
                  {
                    title: "Acciones",
                    field: "",
                    render: (e: ITipoEtiqueta) => (
                      <Checkbox
                        checked={e.idTipoEtiqueta === selectedTipoEtiqueta?.idTipoEtiqueta}
                        onChange={(element: React.ChangeEvent<HTMLInputElement>) => {
                          if (element.target.checked) setSelectedTipoEtiqueta({ ...e });
                        }}
                      />
                    )
                  }
                ]}
                dataInfo={tipoEtiquetas}></TableComponent>
              </ContainerForPages>
            </div>

            <div>
              <div className="bg-gradient-to-r from-newsan from-20% via-newsanColorMidSubtitle via-50% to-newsan to-80% shadow-elevation-8 my-2 mx-4 py-2 rounded-md text-gray-900 text-2xl dark:text-gray-200 ">
                <h1 className="text-center text-white ">Etiquetas impresas</h1>
              </div>

              {selectedTipoEtiqueta && (
                <ContainerForPages optionsLayout="Table" activeEffectVisible>
                <TableComponent
                  IDcolumn="idImpresionEtiqueta"
                  columns={[
                    { title: "Cantidad impresa", field: "cantidadImpresa" },
                    { title: "Nombre", field: "nombreUsuario" },
                    { title: "Fecha de impresion", field: "", render: (row) => horaDeAprobacion(row) },
                    { title: "Codigo interno", field: "codigoInterno" },
                    {
                      title: "Acciones",
                      field: "",
                      render: (row) => (
                        <div className="flex w-full justify-start">
                          <div>
                            <Tooltip title="Eliminar registro">
                              <span>
                                <IconButton
                                  onClick={() => deleteInfo(row)}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <Delete color="error" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </div>

                          <div>
                            <Tooltip title="Examinar">
                              <span>
                                <IconButton
                                  onClick={() => {
                                    setModalInformation(buildModalInformation());
                                    setSelectedEtiquetaImpresion({ ...row });
                                    setOpenModal(true);
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <Edit color="primary" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </div>

                          {isTipoSelRFID && (
                            <Tooltip title="Ver rango RFID">
                              <IconButton
                                size="small"
                                onClick={async (ev) => {
                                  setRfidAnchorEl(ev.currentTarget);
                                  setRfidLoading(true);
                                  setRfidError(null);
                                  setRfidRow(null);

                                  try {
                                    const res = await axios.get(
                                      `${process.env.REACT_APP_API_URL}/ImpresionEtiquetaRFID/GetByIdImpresionEtiqueta/${row.idImpresionEtiqueta}`
                                    );
                                    setRfidRow(res.data);
                                  } catch {
                                    setRfidError("No se encontró rango RFID para este código interno.");
                                  } finally {
                                    setRfidLoading(false);
                                  }
                                }}>
                                <InfoOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      )
                    }
                  ]}
                  dataInfo={impresionEtiquetas}
                  buscar={true}
                  agregar={() => {
                    setModalInformation(buildModalInformation());
                    setSelectedEtiquetaImpresion(null);
                    setOpenModal(true);
                  }}
                />
              </ContainerForPages>
              )}
              <Popover
                open={rfidOpen}
                anchorEl={rfidAnchorEl}
                onClose={closeRfidPopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}>
                <div style={{ padding: 12, minWidth: 260 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Rango RFID
                  </Typography>
                  {rfidLoading && <Typography variant="body2">Cargando...</Typography>}
                  {!rfidLoading && rfidError && (
                    <Typography variant="body2" color="error">
                      {rfidError}
                    </Typography>
                  )}
                  {!rfidLoading && !rfidError && rfidRow && (
                    <>
                      <Typography variant="body2">
                        <b>Desde:</b> {rfidRow.rfidDesde}
                      </Typography>
                      <Typography variant="body2">
                        <b>Hasta:</b> {rfidRow.rfidHasta}
                      </Typography>
                    </>
                  )}
                </div>
              </Popover>
            </div>
          </div>
        )}
      </div>

      <ModalCompoment title="Etiquetas Impresas" openPopup={openModal} setOpenPopup={setOpenModal} showModalCenterPage titleModalStyle="Audit" subTitle="Gestión de etiquetas impresas">
        <EtiquetasComponent
          setOpenPopup={setOpenModal}
          impresionEtiqueta={selectedEtiquetaImpresion}
          informacion={modalInformation}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
