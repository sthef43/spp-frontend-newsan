/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { TrazaOperacionesSliceRequests } from "app/Middleware/reducers/TrazaOperacionesSlice";
import { useAppDispatch } from "app/core/store/store";
import { RenacerOperaciones } from "app/services/trazaOperaciones.service";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import * as XLSX from "xlsx";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Upload } from "@mui/icons-material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";

interface GroupedOperaciones {
  id: number;
  codigo: string;
  puestos: RenacerOperaciones[];
}

export interface RenacerExcelOperaciones {
  lpn: string;
  trazabilidad: string;
  cajaElectrica: string;
  fechaRegistro: string;
}

interface RawExcelData {
  LPN: string;
  Trazabilidad: string;
  "Caja Eléctrica": string;
  "Fecha Registro": string;
}

const initialDefaultVar = {
  codigo: ""
};

function parseRenacerExcelData(rawData: RawExcelData[]): RenacerExcelOperaciones[] {
  return rawData.map((item) => ({
    lpn: item.LPN,
    trazabilidad: item.Trazabilidad,
    cajaElectrica: item["Caja Eléctrica"],
    fechaRegistro: item["Fecha Registro"]
  }));
}

export const RenacerPage = () => {
  const { control, getValues, handleSubmit, formState, reset } = useForm({ defaultValues: initialDefaultVar });

  const hiddenFileInput: any = React.useRef(null);
  const buttonClasses = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();

  const [data, setData] = useState(null);
  const [operaciones, setoperaciones] = useState<RenacerOperaciones[]>([]);
  const [operacionesGrouped, setOperacionesGrouped] = useState<GroupedOperaciones[]>([]);

  const getLpn = async (data) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const operaciones = unwrapResult(
        await dispatch(TrazaOperacionesSliceRequests.GetRenacerOperacionesByLpn(data.codigo))
      );
      const grouped = _.chain(operaciones)
        .groupBy("id")
        .map((value, key) => ({
          id: +key,
          codigo: value.length > 0 ? value[0].codigo : "",
          puestos: value
        }))
        .value();
      setOperacionesGrouped(grouped);
      setoperaciones(operaciones);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const submitCodigos = async (operaciones: RenacerExcelOperaciones[]) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen());
      const response = unwrapResult(await dispatch(TrazaOperacionesSliceRequests.ImportarRenacer(operaciones)));
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    // const file = e.newState[0]?.getRawFile();
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
        cellDates: true,
        dateNF: "dd.mm.yyyy"
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const dataExcel: RawExcelData[] = XLSX.utils.sheet_to_json(ws);
      const parsedData = parseRenacerExcelData(dataExcel);
      /* Update state */
      setData(parsedData);
      console.log(parsedData);
      submitCodigos(parsedData);
    };
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    TitleChanger("Cargar Produccion De Renacer");
  }, []);

  return (
    <div className="p-4">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew ">
        <div className="text-center text-xl">Escanee Codigo</div>
        <div className="mt-4">
          <form onSubmit={handleSubmit(getLpn)}>
            <Controller
              name="codigo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="filled" error={!!error}>
                  <TextField {...field} autoFocus variant="outlined" />
                </FormControl>
              )}
            />
          </form>
        </div>
      </div>
      <div>
        {" "}
        <Button
          onClick={handleClick}
          variant="contained"
          className="bg-blue-500 w-full shadow-md hover:bg-blue-700 text-white text-icon-rest rounded-full px-4 py-1">
          <Upload />
          <span className="hidden sm:block"> excel</span>
        </Button>
        <input
          type="file"
          accept=".xlsx"
          name="Importar"
          onChange={onFileChange}
          ref={hiddenFileInput}
          multiple={false}
          className="hidden"
        />
      </div>
      <hr />
      <div>
        {operacionesGrouped.length > 0 && (
          <>
            <TableComponent
              Dense={true}
              Overflow={false}
              buscar={false}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Codigo",
                  field: "codigo"
                },
                {
                  title: "Puestos",
                  field: "puestos",
                  render: (row) => {
                    return (
                      <div className="w-full flex flex-col">
                        {row.puestos.map((puesto) => (
                          <div key={puesto.puesto}>
                            <span>Puesto: {puesto.puesto} </span>
                            <span> | </span>
                            <span>Hora: {puesto.puesto.fechaPuesto}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                }
              ]}
              agregar={() => {
                // openModal();
              }}
              dataInfo={operacionesGrouped}
            />
          </>
        )}
      </div>
    </div>
  );
};
