import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Typography
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { RechazoSliceRequests } from "app/Middleware/reducers/RechazoSlice";
import { useAppDispatch } from "app/core/store/store";
import { ILinea } from "app/models";
import { InformeRechazos } from "app/models/InformeRechazos";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { SelectOfDate } from "app/shared/helpers/SelectOfDate";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AccordionStyled = styled((props: AccordionProps) => <Accordion disableGutters elevation={1} square {...props} />)(
  ({ theme }) => ({
    borderRadius: "0"
  })
);

export const RechazoCalidad = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const buttonClasses = MaterialButtons();
  interface initialState {
    planta: number;
    linea: number;
  }
  const initialStateVar = {
    planta: 0,
    linea: 0
  };

  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Use efect genérico
  useEffect(() => {
    TitleChanger("Informe Rechazo Calidad");
    getPlantas();
  }, []);

  //Leer Plantas
  const [listPlantas, setListPantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //Leer Líneas por planta
  const [listLineas, setListLineas] = useState<ILinea[]>([]);
  const getLineas = async () => {
    try {
      const responses = unwrapResult(await dispatch(LineaSliceRequests.GetListByPlantId(watchPlanta)));
      setListLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer lineas.", "error");
    }
  };

  const [lista, setLista] = useState<InformeRechazos[]>([]);
  const [listaAgrupados, setListaAgrupados] = useState<InformeRechazos[]>([]);
  const buscarInformes = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          RechazoSliceRequests.GetInformeRehazos({
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            lineaId: watchLinea
          })
        )
      );
      const responseAgrupados = unwrapResult(
        await dispatch(
          RechazoSliceRequests.GetInformeRehazosAgrupados({
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            lineaId: watchLinea
          })
        )
      );
      if (response) {
        if (response.length > 0) {
          openNotificationUI("Se encontraron los rechazos", "success");
        } else {
          openNotificationUI("No se encontraron rechazos", "info");
        }
        console.log(response);
        setLista(response);
        setListaAgrupados(responseAgrupados);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  //Fecha
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [error, setError] = useState(false);

  //Watch
  const watchLinea = watch("linea");
  const watchPlanta = watch("planta");
  useEffect(() => {
    if (watchPlanta) {
      setValue("linea", 0);
      getLineas();
    }
  }, [watchPlanta]);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", marginTop: "1rem", padding: "0 1rem" }}>
      <div className="sm:flex md:flex items-center justify-around w-full font-semibold rounded-lg shadow-elevation-4 bg-secondaryNew">
        <div className="p-2 overflow-auto m-2" style={{ flex: "1 1 100%" }}>
          <SelectOfDate
            fechaDesdeHasta
            setFechaDesdeProps={setFechaDesde}
            setFechaHastaProps={setFechaHasta}
            setErrorProps={setError}
          />
        </div>
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Controller
            name="planta"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Planta</InputLabel>
                <Select {...field} placeholder="Seleccione Planta" variant="standard">
                  {listPlantas &&
                    listPlantas.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <div className="w-full">
                          <div>{x.name}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Controller
            name="linea"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Línea</InputLabel>
                <Select {...field} placeholder="Seleccione Línea" variant="standard">
                  {listLineas &&
                    listLineas.map((x) => (
                      <MenuItem key={x.idLinea} value={x.idLinea}>
                        <div className="w-full">
                          <div>{x.descripcion}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {!!error && error.type != "min" && <FormHelperText>{error.type}</FormHelperText>}
                {!!error && error.type == "min" && <FormHelperText>required</FormHelperText>}
              </FormControl>
            )}
          />
        </div>
        <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
          <Button
            onClick={buscarInformes}
            sx={{ marginLeft: 3 }}
            className={buttonClasses.greenButton}
            variant="contained"
            disabled={getValues("linea") === 0 || error}>
            Buscar
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <AccordionStyled sx={{ borderRadius: "0" }}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="unitaria-panel" id="unitaria-panel">
            <Typography component="span">Cantidad unitaria</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: "1px solid black" }}>
            <div className="my-2 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
              <TableComponent
                Dense={true}
                buscar={true}
                IDcolumn={"idRechazo"}
                excel
                transformExcel
                transformRegex={[
                  {
                    key: "componente",
                    // eslint-disable-next-line no-useless-escape
                    regex: "/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑs]/g" //todavia no se usa
                  },
                  {
                    key: "subComponente",
                    // eslint-disable-next-line no-useless-escape
                    regex: "/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑs]/g" //todavia no se usa
                  },
                  {
                    key: "defecto",
                    // eslint-disable-next-line no-useless-escape
                    regex: "/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑs]/g" //todavia no se usa
                  }
                ]}
                columns={[
                  {
                    title: "Línea",
                    field: "linea"
                  },
                  {
                    title: "Chasis",
                    field: "chasis",
                    render: (row) => {
                      if (watchLinea == 0) return "N/A";
                      const linea = listLineas.find((d) => d.idLinea == watchLinea);
                      if (!linea || !linea.descripcion.toLocaleLowerCase().includes("motos")) return "N/A";
                      return <div>{row.chasis}</div>;
                    }
                  },
                  {
                    title: "Modelo",
                    field: "modeloFin"
                  },
                  {
                    title: "Componente",
                    field: "componente"
                  },
                  {
                    title: "SubComponente",
                    field: "subComponente"
                  },
                  {
                    title: "Defecto",
                    field: "defecto"
                  },
                  {
                    title: "Cantidad",
                    field: "cantidadUnitaria"
                  },
                  {
                    title: "Estado",
                    field: "estado"
                  },
                  {
                    title: "Fecha",
                    field: "fecha"
                  },
                  {
                    title: "Hora",
                    field: "hora"
                  },
                  {
                    title: "Puesto",
                    field: "puesto"
                  },
                  {
                    title: "Turno",
                    field: "turno"
                  }
                ]}
                dataInfo={lista}
              />
            </div>
          </AccordionDetails>
        </AccordionStyled>
      </div>
      <div className="mt-4 pb-4">
        <AccordionStyled sx={{ borderRadius: "0" }}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="unitaria-panel" id="unitaria-panel">
            <Typography component="span">Cantidad Agrupada</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: "1px solid black" }}>
            <div className="my-2 h-full p-3 mt-3 rounded-lg shadow-elevation-4 bg-secondaryNew">
              <TableComponent
                Dense={true}
                buscar={true}
                IDcolumn={"idRechazo"}
                transformExcel
                transformRegex={[
                  {
                    key: "componente",
                    // eslint-disable-next-line no-useless-escape
                    regex: "/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑs]/g"
                  },
                  {
                    key: "subComponente",
                    // eslint-disable-next-line no-useless-escape
                    regex: "/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑs]/g"
                  },
                  {
                    key: "defecto",
                    // eslint-disable-next-line no-useless-escape
                    regex: "/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑs]/g"
                  }
                ]}
                excel
                columns={[
                  {
                    title: "Línea",
                    field: "linea"
                  },
                  {
                    title: "Componente",
                    field: "componente"
                  },
                  {
                    title: "SubComponente",
                    field: "subComponente"
                  },
                  {
                    title: "Defecto",
                    field: "defecto"
                  },
                  {
                    title: "Estado",
                    field: "estado"
                  },
                  {
                    title: "Fecha",
                    field: "fecha"
                  },
                  {
                    title: "Hora",
                    field: "hora"
                  },
                  {
                    title: "Puesto",
                    field: "puesto"
                  },
                  {
                    title: "Turno",
                    field: "turno"
                  },
                  {
                    title: "Cantidad",
                    field: "cantidadTotal"
                  }
                ]}
                dataInfo={listaAgrupados}
              />
            </div>
          </AccordionDetails>
        </AccordionStyled>
      </div>
    </div>
  );
};
