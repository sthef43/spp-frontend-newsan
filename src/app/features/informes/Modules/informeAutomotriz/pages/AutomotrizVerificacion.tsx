import { Tabs, Tab, Button, IconButton } from "@mui/material";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import moment from "moment";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { AutomotrizTabLaVerificacion } from "../components/AutmotrizTablaVerificacion";
import { ModalCompoment } from "../../../../../shared/components/ModalComponent";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

const styleSxRoot = {
  backgroundColor: "#bcc0c4",
  width: "100%",
  borderRadius: "8px",
  minHeight: "60px",
  "& .MuiTabs-indicator": {
    height: "44px",
    bottom: "8px",
    backgroundColor: "#FFFFFF",
    borderRadius: "6px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
    zIndex: 1
  },
  "& .MuiTabs-flexContainer": {
    height: "60px",
    alignItems: "center",
    justifyContent: "space-around"
  }
};

const styleTabs = {
  width: "30%",
  minHeight: "44px",
  padding: 0,
  maxWidth: "none",
  zIndex: 2,
  fontWeight: 600,
  textTransform: "none",
  color: "#6B7280",
  "&.Mui-selected": { color: "#111827" }
};

export const AutomotrizVerificacion = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const { control, watch } = useForm();
  const [tipoBusqueda, setTipoBusqueda] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [dataTraza, setDataTraza] = useState<TrazaOperaciones[] | any[]>([]);
  const [openModalTraza, setOpenModalTraza] = useState(false);
  const [dataModalTraza, setDataModalTraza] = useState<any>(null);
  const buttonClases = MaterialButtons();
  const valueFilterSemi: string = watch("valueFilterSemi");

  const openModalTest = (data: any) => {
    console.log("abrir modal de detalle de caja con las placas hermanadas", data);
    setOpenModalTraza(true);
    setDataModalTraza(data);
  };

  const columnsBatea = [
    {
      title: "Fecha",
      field: "fecha",
      render: (row) => {
        return (
          <div className="w-full font-medium text-center text-gray-600">{moment(row.fecha).format("DD/MM/YYYY")}</div>
        );
      }
    },
    {
      title: "QR",
      field: "codigoInit",
      render: (row) => {
        return <div className="w-full font-semibold text-center text-gray-800">{row.codigoInit}</div>;
      }
    }
  ];

  const columnsTabla = useMemo(() => {
    if (tipoBusqueda === "1") {
      return [
        { title: "QR", field: "codigoInit" },
        { title: "Batea", field: "batea" },
        { title: "Caja", field: "caja" },
        { title: "Fecha", field: "fecha", render: (row: any) => moment(row.createdDate).format("DD/MM/YYYY") }
      ];
    }

    if (tipoBusqueda === "2") {
      return [
        { title: "QR", field: "codigoInit" },
        { title: "Caja", field: "caja" },
        { title: "Fecha", field: "fecha", render: (row: any) => moment(row.createdDate).format("DD/MM/YYYY") }
      ];
    }

    if (tipoBusqueda === "3") {
      return [
        { title: "Batea", field: "nroBatea" },
        {
          title: "Cantidad",
          field: "cantidadPlacas",
          render: (row: any) => (row.cantidadPlacas ? row.cantidadPlacas : "Sin información")
        },
        { title: "Fecha", field: "fecha", render: (row: any) => moment(row.createdDate).format("DD/MM/YYYY") },
        {
          title: "Acciones",
          field: "",
          render: (row: any) => {
            return (
              <div className="flex w-full justify-end sm:justify-start gap-4">
                <div>
                  <IconButton size="small" onClick={() => openModalTest(row)}>
                    <VisibilityIcon sx={{ color: "#137FEC" }} />
                  </IconButton>
                </div>
              </div>
            );
          }
        }
      ];
    }

    return [];
  }, [tipoBusqueda]);

  const getTraza = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Buscando traza..."));
    setIsLoading(true);
    let result = [];

    try {
      result = unwrapResult(
        await dispatch(
          TrazaOperacionesSliceRequests.GetTrazaAutomotriz({
            tipoBusqueda: Number(tipoBusqueda),
            codigo: valueFilterSemi
          })
        )
      );

      if (result) {
        if (tipoBusqueda === "3") {
          const resultadoFinal = Object.values(
            result.reduce((acumulador: any, placa: any) => {
              if (!acumulador[placa.batea]) {
                acumulador[placa.batea] = {
                  nroBatea: placa.batea,
                  cantidadPlacas: 0,
                  placas: []
                };
              }

              acumulador[placa.batea].cantidadPlacas += 1;
              acumulador[placa.batea].placas.push(placa);

              return acumulador;
            }, {})
          );
          setDataTraza(resultadoFinal);
        } else {
          setDataTraza(result);
        }
      }
    } catch (err) {
      openNotificationUI("Ocurrio un error al traer la información", "error");
    } finally {
      setIsLoading(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setDataTraza([]);
    setTipoBusqueda(newValue);
  };

  useEffect(() => {
    console.log("buscando semi", valueFilterSemi);
  }, [valueFilterSemi]);

  useEffect(() => {
    TitleChanger("Informe Automotriz");
  }, []);

  return (
    <div className="w-full px-3 flex flex-col pt-5 justify-center gap-4">
      <div className="w-full gap-2 flex flex-col">
        <p className="font-bold text-3xl">Verificación de Placas Automotriz</p>
        <p className="text-[#3F3D56] font-normal text-lg">Verifica el recorrido y hermanado de cada placa</p>
      </div>
      <div className="w-full flex justify-center flex-wrap gap-6">
        <div className="w-full">
          <p className="text-[#3F3D56] font-medium text-lg">Filtro de busqueda</p>
        </div>
        <Tabs value={tipoBusqueda} onChange={handleChange} aria-label="wrapped label tabs example" sx={styleSxRoot}>
          <Tab value="1" label="QR-PLACA" disableRipple sx={styleTabs} />
          <Tab value="2" label="BATEA" disableRipple sx={styleTabs} />
          <Tab value="3" label="CAJA" disableRipple sx={styleTabs} />
        </Tabs>
        <div className="w-full flex flex-row gap-5 items-center">
          <div className="w-3/5">
            <TextFieldComponent
              control={control}
              index={0}
              labelInput={(() => {
                switch (tipoBusqueda) {
                  case "1":
                    return "Buscar por QR";
                  case "2":
                    return "Buscar por Batea";
                  case "3":
                    return "Buscar por Caja";
                  default:
                    return "Buscar...";
                }
              })()}
              valueDefault=""
              nameInput="valueFilterSemi"
              typeInput="standard"
            />
          </div>
          <Button
            sx={{ height: "30px" }}
            className={buttonClases.blueButton}
            aria-label="declarar producción"
            onClick={getTraza}>
            Buscar
          </Button>
        </div>
        <div className="w-full">
          {isLoading ? (
            <p>Buscando información...</p>
          ) : dataTraza && dataTraza.length > 0 ? (
            <div className="w-full">
              <AutomotrizTabLaVerificacion data={dataTraza} columns={columnsTabla} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <ModalCompoment
        title={`Batea: ${dataModalTraza ? dataModalTraza.nroBatea : ""}`}
        openPopup={openModalTraza}
        setOpenPopup={setOpenModalTraza}
        showModalCenterPage={true}
        titleModalStyle="Audit">
        <AutomotrizTabLaVerificacion data={dataModalTraza?.placas} columns={columnsBatea} flagMovimientos={true} />
      </ModalCompoment>
    </div>
  );
};
