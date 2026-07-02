import React, { useEffect, useMemo, useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import { SelectOFLineasP6 } from "app/shared/helpers/SelectOFLineasP6";
import {
  VerificacionDiariaService,
  CreateSeguridadElectricaRegistroDto,
  MaquinaTestDto,
  SeguridadElectricaConfigDto
} from "app/services/verificacionDiaria.service";

type Turno = "MAÑANA" | "TARDE" | "NOCHE";

const toISODate = (d: Date | null) => {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const VerificacionDiaria = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();

  const service = useMemo(() => new VerificacionDiariaService(), []);

  // filtros
  const [plantId, setPlantId] = useState<number>(0);
  const [lineId, setLineId] = useState<number>(0);
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [turno, setTurno] = useState<Turno>("MAÑANA");
  // data
  const [maquina, setMaquina] = useState<MaquinaTestDto | null>(null);
  const [config, setConfig] = useState<SeguridadElectricaConfigDto | null>(null);
  const [searched, setSearched] = useState(false);
  const [registroId, setRegistroId] = useState<number>(0);

  const ID_AUDITOR = 1416; //hardcode

  const [earthSetInf, setEarthSetInf] = useState<boolean>(true);
  const [earthPasa, setEarthPasa] = useState<boolean>(true);
  const [earthResult, setEarthResult] = useState<boolean>(true);

  const [withKV, setWithKV] = useState<string>("1KV");
  const [withTSeg, setWithTSeg] = useState<string>("1");
  const [withResult, setWithResult] = useState<boolean>(true);

  const [insVdc, setInsVdc] = useState<string>("500V");
  const [insTSeg, setInsTSeg] = useState<string>("1");
  const [insResult, setInsResult] = useState<boolean>(true);

  const [instrumento, setInstrumento] = useState<string>("");
  const [fechaVenc, setFechaVenc] = useState<Date | null>(null);

  useEffect(() => {
    TitleChanger("Verificación Diaria");
  }, [TitleChanger]);

  // reset al cambiar filtros base
  useEffect(() => {
    setMaquina(null);
    setConfig(null);
    setInstrumento("");
    setFechaVenc(null);
    setSearched(false);
    setRegistroId(0);
  }, [plantId, lineId]);

  const handleBuscar = async () => {
    if (!plantId || !lineId || !fecha) {
      openNotificationUI("Seleccioná Planta, Línea y Fecha.", "warning");
      return;
    }

    try {
      const fechaISO = toISODate(fecha);

      // máquina
      const m = await service.getMaquinaActivaByPlantaLinea(plantId, lineId);
      setMaquina(m);

      if (!m) {
        openNotificationUI("No hay máquina activa para esa Planta + Línea.", "warning");
        setSearched(false);
        return;
      }

      // config Marca/Modelo por línea
      const cfg = await service.getSegElectricaConfig(lineId);
      setConfig(cfg);

      if (!cfg) {
        openNotificationUI("Falta configuración (Marca/Modelo) en SeguridadElectrica para esa línea.", "warning");
      } else {
        setInstrumento(`${cfg.marca} ${cfg.modelo}`.trim());
      }

      // si ya existe registro
      const reg = await service.getSegElectricaRegistro(lineId, fechaISO);

      if (reg) {
        setRegistroId(Number(reg.id ?? reg.Id ?? 0));
        openNotificationUI("Ya existe registro para ese día (no hay update).", "warning");
      } else {
        setRegistroId(0);
        openNotificationUI("OK: completá checklist y guardá.", "success");
      }

      setSearched(true);
    } catch (e: any) {
      openNotificationUI(e?.response?.data ?? e?.message ?? "Error en Buscar", "error");
      setSearched(false);
    }
  };

  const handleGuardar = async () => {
    if (!searched) return;

    if (!lineId || !fecha) {
      openNotificationUI("Faltan datos: Línea y Fecha.", "warning");
      return;
    }

    if (!maquina?.id || !maquina?.numeroSerie) {
      openNotificationUI("Falta la máquina de test (no se pudo traer).", "warning");
      return;
    }

    if (registroId > 0) {
      openNotificationUI("Ya existe un registro para ese día (no hay update aún).", "warning");
      return;
    }

    try {
      const payload: CreateSeguridadElectricaRegistroDto = {
        IdLinea: lineId,
        Fecha: toISODate(fecha),

        IdMaquinaTest: maquina.id,
        MaquinaTestNumeroSerie: maquina.numeroSerie,

        EarthBond_SetInf: earthSetInf,
        EarthBond_Pasa: earthPasa,
        EarthBond_Result: earthResult,

        Withstanding_KVoltsAC: withKV,
        Withstanding_TSeg: withTSeg,
        Withstanding_Result: withResult,

        Insulation_VoltsDC: insVdc,
        Insulation_TSeg: insTSeg,
        Insulation_Result: insResult,

        Instrumento: instrumento,
        FechaVencimiento: fechaVenc ? toISODate(fechaVenc) : null,

        IdAuditorUser: ID_AUDITOR
      };

      const id = await service.createSegElectricaRegistro(payload);

      if (id > 0) {
        setRegistroId(id);
        openNotificationUI(`Guardado OK. Id=${id}`, "success");
      } else {
        openNotificationUI("No se pudo guardar.", "error");
      }
    } catch (e: any) {
      openNotificationUI(e?.response?.data ?? e?.message ?? "Error al guardar", "error");
    }
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-[22px] font-semibold mb-4">VERIFICACIÓN DIARIA - SEGURIDAD ELÉCTRICA</h1>

      {/* FILTROS */}
      <div className="bg-secondary rounded-md px-3 py-3">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6 justify-between">
          <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap md:items-end gap-4 w-full">
            <div className="w-full md:w-[200px] [&_.bg-secondaryNew]:!bg-transparent">
              <SelectOFPlant
                setPlantId={(id: number) => {
                  setPlantId(id);
                  setLineId(0);
                }}
              />
            </div>

            <div className="w-full md:w-[200px] [&_.bg-secondaryNew]:!bg-transparent">
              <SelectOFLineasP6 setIdLinea={(id: number) => setLineId(id)} />
            </div>

            <div className="w-full md:w-[220px]">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha"
                  inputFormat="dd/MM/yyyy"
                  value={fecha}
                  onChange={(v) => setFecha(v)}
                  renderInput={(params) => <TextField variant="standard" {...params} fullWidth />}
                />
              </LocalizationProvider>
            </div>

            <div className="w-full md:w-[200px]">
              <TextField
                select
                variant="standard"
                label="Turno"
                value={turno}
                onChange={(e) => setTurno(e.target.value as Turno)}
                fullWidth>
                <MenuItem value="MAÑANA">Mañana</MenuItem>
                <MenuItem value="TARDE">Tarde</MenuItem>
                <MenuItem value="NOCHE">Noche</MenuItem>
              </TextField>
            </div>
          </div>

          <div className="w-full lg:w-[200px]">
            <Button
              onClick={handleBuscar}
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: 18,
                height: 52,
                width: "100%",
                borderRadius: 1,
                bgcolor: "#66B8FF",
                "&:hover": { bgcolor: "#4FA9FF" }
              }}>
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {/* AL BUSCAR SE RENDERIZA TODO */}
      {searched && (
        <>
          {/* DATOS DE MÁQUINA */}
          <div className="mt-4 bg-secondary rounded-md p-3">
            <div className="font-semibold mb-3">Máquina de Test</div>

            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-[260px]">
                <TextField
                  variant="standard"
                  label="Marca"
                  value={maquina?.marca ?? ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </div>

              <div className="w-full md:w-[260px]">
                <TextField
                  variant="standard"
                  label="Modelo"
                  value={maquina?.modelo ?? ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </div>

              <div className="w-full md:w-[260px]">
                <TextField
                  variant="standard"
                  label="N° Serie (Máquina Test)"
                  value={maquina?.numeroSerie ?? ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </div>

              <div className="w-full md:w-[220px]">
                <TextField
                  variant="standard"
                  label="IdMaquinaTest"
                  value={maquina?.id ?? ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </div>
            </div>

            <div className="mt-3 text-sm opacity-80">
              Config instrumento (SeguridadElectrica):{" "}
              <b>{config ? `${config.marca} ${config.modelo}` : "NO CARGADA (te va a dar -2 al guardar)"}</b>
            </div>
          </div>

          {/* CHECKLIST */}
          <div className="mt-4 bg-secondary rounded-md p-3">
            <div className="font-semibold mb-3">Checklist</div>

            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-[220px]">
                <TextField
                  variant="standard"
                  label="Auditor (hardcode test)"
                  value={ID_AUDITOR}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </div>

              <div className="w-full md:w-[260px]">
                <TextField
                  variant="standard"
                  label="Instrumento"
                  value={instrumento}
                  onChange={(e) => setInstrumento(e.target.value)}
                  fullWidth
                />
              </div>

              <div className="w-full md:w-[220px]">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Fecha vencimiento"
                    inputFormat="dd/MM/yyyy"
                    value={fechaVenc}
                    onChange={(v) => setFechaVenc(v)}
                    renderInput={(params) => <TextField variant="standard" {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* EARTH BOND */}
              <div className="bg-New rounded-md p-3">
                <div className="font-semibold mb-2">EARTH BOND TEST</div>

                <TextField
                  select
                  variant="standard"
                  label="Set Inf"
                  value={earthSetInf ? "OK" : "NG"}
                  onChange={(e) => setEarthSetInf(e.target.value === "OK")}
                  fullWidth>
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="NG">NG</MenuItem>
                </TextField>

                <div className="h-3" />

                <TextField
                  select
                  variant="standard"
                  label="Pasa"
                  value={earthPasa ? "OK" : "NG"}
                  onChange={(e) => setEarthPasa(e.target.value === "OK")}
                  fullWidth>
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="NG">NG</MenuItem>
                </TextField>

                <div className="h-3" />

                <TextField
                  select
                  variant="standard"
                  label="Resultado"
                  value={earthResult ? "OK" : "NG"}
                  onChange={(e) => setEarthResult(e.target.value === "OK")}
                  fullWidth>
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="NG">NG</MenuItem>
                </TextField>
              </div>

              {/* WITHSTANDING */}
              <div className="bg-New rounded-md p-3">
                <div className="font-semibold mb-2">WITHSTANDING TEST</div>

                <TextField
                  variant="standard"
                  label="KV AC"
                  value={withKV}
                  onChange={(e) => setWithKV(e.target.value)}
                  fullWidth
                />
                <div className="h-3" />
                <TextField
                  variant="standard"
                  label="T (seg)"
                  value={withTSeg}
                  onChange={(e) => setWithTSeg(e.target.value)}
                  fullWidth
                />
                <div className="h-3" />

                <TextField
                  select
                  variant="standard"
                  label="Resultado"
                  value={withResult ? "OK" : "NG"}
                  onChange={(e) => setWithResult(e.target.value === "OK")}
                  fullWidth>
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="NG">NG</MenuItem>
                </TextField>
              </div>

              {/* INSULATION */}
              <div className="bg-New rounded-md p-3">
                <div className="font-semibold mb-2">INSULATION TEST</div>

                <TextField
                  variant="standard"
                  label="Volts DC"
                  value={insVdc}
                  onChange={(e) => setInsVdc(e.target.value)}
                  fullWidth
                />
                <div className="h-3" />
                <TextField
                  variant="standard"
                  label="T (seg)"
                  value={insTSeg}
                  onChange={(e) => setInsTSeg(e.target.value)}
                  fullWidth
                />
                <div className="h-3" />

                <TextField
                  select
                  variant="standard"
                  label="Resultado"
                  value={insResult ? "OK" : "NG"}
                  onChange={(e) => setInsResult(e.target.value === "OK")}
                  fullWidth>
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="NG">NG</MenuItem>
                </TextField>
              </div>
            </div>

            {/* GUARDAR */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleGuardar}
                disabled={registroId > 0}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontSize: 18,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: "#4CAF50",
                  "&:hover": { bgcolor: "#43A047" }
                }}>
                Guardar
              </Button>
            </div>

            {registroId > 0 && (
              <div className="mt-2 text-sm opacity-80">
                Ya existe registro (Id = <b>{registroId}</b>) para ese día.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VerificacionDiaria;
