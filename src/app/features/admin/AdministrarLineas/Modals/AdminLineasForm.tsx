import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, FormControlLabel, Switch } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ILinea } from "app/models";
import { usePutLinea } from "app/shared/hooks/hooksServices/useLineasApi";

interface Props {
  setOpenModal: (state: boolean) => void;
  dataEdit: ILinea;
}

interface IValuesForm {
  descripcion: string;
  alias: string;
  codigo: string;
  tipo: string;
  tipoUnidad: string;
  codigoInicio: string;
  relacionaPlis: string;
  relacionaEbs: string;
  relacionaTrazabilidad: string;
  utilizaReparPlis: string;
  utilizaReparPlaqueta: string;
  desvinculaEvaporador: string;
  trazabilidadLG: string;
  testingLg: string;
  testingLgCe: string;
  testingIDUCE: string;
  relacionaManual: string;
  relacionaCajaElec: string;
  accesorios: string;
  loteSiguiente: string;
  tipoProduccion: string;
  activa: boolean;
}

export const AdminLineasForm = ({ setOpenModal, dataEdit }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid }
  } = useForm<IValuesForm>({
    defaultValues: dataEdit as any,
    mode: "onChange"
  });

  const [activa, setActiva] = useState(dataEdit.activa);

  const { execute: putLinea } = usePutLinea<ILinea>();

  const onSubmit = async (e) => {
    try {
      const actualizacion = generarActualizacion(e);
      await putLinea(actualizacion);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const generarActualizacion = (e) => {
    const objectSubmit = {
      ...e,
      idLinea: dataEdit.idLinea,
      FPY: dataEdit?.fpy,
      porcentajeFpy: dataEdit?.porcentajeFpy,
      estadoAndon: dataEdit?.estadoAndon,
      imprimeNroserie: dataEdit?.imprimeNroserie,
      verficaMes: dataEdit?.verficaMes
    };
    return objectSubmit;
  };

  useEffect(() => {
    setValue("activa", activa);
  }, [activa]);

  const col1 = useMemo(
    () => [
      { label: "¿Relaciona Plis?", field: "relacionaPlis" },
      { label: "¿Relaciona EBS?", field: "relacionaEbs" },
      { label: "¿Relaciona Trazabilidad?", field: "relacionaTrazabilidad" },
      { label: "¿Relaciona Caja Eléctrica?", field: "relacionaCajaElec" },
      { label: "¿Relaciona el Manual?", field: "relacionaManual" },
      { label: "¿Utiliza reparar Plaquetas?", field: "utilizaReparPlaqueta" }
    ],
    []
  );

  const col2 = useMemo(
    () => [
      { label: "¿Utiliza reparar PLIS?", field: "utilizaReparPlis" },
      { label: "Testing LG", field: "testingLg" },
      { label: "Testing LG/CE", field: "testingLgCe" },
      { label: "Testing IDU/CE", field: "testingIDUCE" },
      { label: "¿Es trazabilidad LG?", field: "trazabilidadLG" },
      { label: "Desvincular Evaporador", field: "desvinculaEvaporador" }
    ],
    []
  );

  const renderSwitchSN = (name: keyof IValuesForm, label: string) => (
    <Controller
      key={name as string}
      name={name as any}
      control={control}
      render={({ field }) => (
        <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
          <div className="text-[12px] font-medium">{label}</div>
          <Switch
            className="admin-switch switch-capsule-blue"
            checked={field.value === "S"}
            onChange={(e) => field.onChange(e.target.checked ? "S" : "N")}
          />
        </div>
      )}
    />
  );

  return (
    <div className="w-[90vw] txt">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg2 rounded-[5px]">
          <div className="grid grid-cols-6 gap-[35px] text-center py-3 px-12 text-[12px] font-medium">
            <div>
              <div>Línea</div>
              <div>{dataEdit?.descripcion || "-"}</div>
            </div>
            <div>
              <div>Alias</div>
              <div>{dataEdit?.alias || "-"}</div>
            </div>
            <div>
              <div>Código</div>
              <div>{dataEdit?.codigo || "-"}</div>
            </div>
            <div>
              <div>Tipo</div>
              <div>{dataEdit?.tipo || "-"}</div>
            </div>
            <div>
              <div>Tipo de Unidad</div>
              <div>{dataEdit?.tipoUnidad || "-"}</div>
            </div>
            <div>
              <div>Código de Inicio</div>
              <div>{dataEdit?.codigoInicio || "-"}</div>
            </div>
          </div>

          <div className="border-b border-[var(--border)] mb-5"></div>

          <div className="grid grid-cols-3 gap-3 px-2">
            {/* Col 1 */}
            <div className="px-12">{col1.map((x) => renderSwitchSN(x.field as any, x.label))}</div>

            {/* Col 2 */}
            <div className="px-12 border-x border-[var(--border)]">
              {col2.map((x) => renderSwitchSN(x.field as any, x.label))}
            </div>

            {/* Col 3 */}
            <div className="px-12">
              {/* accesorios */}
              <Controller
                name={"accesorios" as any}
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                    <div className="text-[12px] font-medium">¿Lleva Accesorios?</div>
                    <Switch
                      className="admin-switch switch-capsule-blue"
                      checked={field.value === "S"}
                      onChange={(e) => field.onChange(e.target.checked ? "S" : "N")}
                    />
                  </div>
                )}
              />

              {/* tipoProduccion */}
              <div className="pt-4">
                <div className="text-[12px] font-medium mb-2">Tipo de Producción</div>
                <Controller
                  name="tipoProduccion"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full h-[44px] font-normal text-[12px] px-3"
                      style={{ backgroundColor: "var(--inputBg)" }}
                    />
                  )}
                />
              </div>

              {/* loteSiguiente */}
              <div className="pt-4">
                <div className="text-[12px] font-medium mb-2">Lote Siguiente</div>
                <Controller
                  name="loteSiguiente"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full h-[44px] font-normal text-[12px] px-3"
                      style={{ backgroundColor: "var(--inputBg)" }}
                    />
                  )}
                />
              </div>

              <div className="pt-3">
                <FormControlLabel
                  label={<span className=" text-[14px] font-semibold">¿Activa?</span>}
                  control={
                    <Controller
                      name={"activa"}
                      control={control}
                      render={({ field }) => (
                        <Checkbox checked={activa} onClick={() => setActiva(!activa)} {...field} />
                      )}
                    />
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-[45px] pt-6 py-6 px-[55px]">
            <Button
              variant="text"
              onClick={() => setOpenModal(false)}
              className="text-[12px] font-semibold text-[var(--inputText)]">
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty && !isValid}
              className="!w-[140px] !h-[40px] !bg-[#137FEC] hover:!bg-[#2c94fdff] !text-white !px-10 !text-[12px] !font-semibold">
              Guardar
            </Button>
          </div>
        </div>
      </form>
      <style>
        {`
      .admin-switch{margin-right: -6px; height: 42px }

      .txt{color: #3F3D56}
      .dark .txt{color: #FFF}

      :root{
        --inputBg: #EFF8FF;
        --inputText: #000000;
        --border: #c4c4c459;
        --track: #BDBDBD;
      }
      
      .dark{
        --inputBg: #000D27;
        --inputText: #ffffff;
        --border: #5353534a;
        --track: #000D27;
      }

      .bg{background-color: #EFF8FF;}
      .dark .bg{background-color: #001947;}

      //___SWITCH PERSONALIZADO___//
      * TAMAÑO */
      .switch-capsule-blue{
      width: 44px !important;
      height: 24px !important;
      padding: 0 !important;
      }

      /* BASE */
      .switch-capsule-blue .MuiSwitch-switchBase{
      padding: 3px !important;
      }

      /* CAPSULA */
      .switch-capsule-blue .MuiSwitch-track{
      background-color:var(--track) !important;
      opacity: 1 !important;
      border-radius: 999px !important;
      }

      /* THUMB */
      .switch-capsule-blue .MuiSwitch-thumb{
      width: 12px !important;
      height: 12px !important;
      background-color: #ffffff !important;
      }

      /* OFF */
      .switch-capsule-blue .MuiSwitch-switchBase{
      transform: translate(3px, 2px);
      padding: 13px !important;
      }

      /* ON */
      .switch-capsule-blue .MuiSwitch-switchBase.Mui-checked{
      transform: translate(16px, 2px) !important;
      }

      /* TRACK */
      .switch-capsule-blue .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track{
      background-color: #137FEC !important;
      }  
      `}
      </style>
    </div>
  );
};
