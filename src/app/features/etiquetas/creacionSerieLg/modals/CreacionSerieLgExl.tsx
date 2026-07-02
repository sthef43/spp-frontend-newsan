import { Settings } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { SerieLgSliceRequests } from "app/Middleware/reducers/SerieLgSlice";
import moment from "moment";

interface props {
  refresh: any;
  setOpenPopup: any;
  listSerieLg: any;
}

export const CreacionSerieLgExl = ({ setOpenPopup, refresh, listSerieLg }: props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  //Leer Excel
  const [listExcel, setListExcel] = useState(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };
  //Excel fomateado
  const onFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; //Se lee la hoja 1
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); //Hoja a Json
      jsonData.shift(); //Elimino 1° fila
      const arreglo = [];
      jsonData.map((e, index) => {
        console.log(e[3]);
        if (e[0] != undefined) {
          arreglo.push({
            id: index + 2,
            trazabilidad: e[0],
            modelo: e[1],
            generico: e[2],
            fecha: moment(e[3], "DD/MM/YYYY").format("YYYY-MM-DD"),
            impreso: true,
            usado: false,
            deleted: false
          });
        }
      });
      if (arreglo[0].modelo == listSerieLg[0].modelo) {
        setListExcel(arreglo);
      } else {
        openNotificationUI("El modelo del archivo Excel difiere del seleccionado.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
  };
  useEffect(() => {
    if (listExcel) {
      verificar();
    }
  }, [listExcel]);

  //Verificar Listado para Agregar/Modificar
  const [listAgregar, setListAgregar] = useState(null);
  const [listModificar, setListModificar] = useState(null);
  const verificar = () => {
    const arrListAgregar = [];
    const arrListModificar = [];
    listExcel.map((p) => {
      const f = listSerieLg.filter((x) => x.trazabilidad == p.trazabilidad);
      if (f.length > 0) {
        arrListModificar.push(p);
      } else {
        arrListAgregar.push(p);
      }
    });
    setListAgregar(arrListAgregar);
    setListModificar(arrListModificar);
  };

  //Guardar Cambios
  const guardarCambios = async () => {
    const newlistAgregar = listAgregar.map(({ id, ...rest }) => rest);
    try {
      unwrapResult(await dispatch(SerieLgSliceRequests.multiPost(newlistAgregar)));
      openNotificationUI("Agregado...", "success");
      setOpenPopup(false);
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="mt-2 rounded-lg shadow-elevation-4 bg-secondaryNew"
        style={{
          flexDirection: "row",
          alignContent: "space-between",
          justifyContent: "space-around",
          alignItems: "stretch",
          padding: "15px"
        }}>
        <p>* Primera fila es de encabezado, no se leen.</p>
        <p>* Columnas: Códigos | Modelo | Genérico | Fecha -DD/MM/AAAA-.</p>
        <p>* Hoja 1 es la que se importa.</p>
        <p>* Las columnas restantes deben estar vacías.</p>
        <div className="pt-5">
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            disabled={false}
            variant="outlined"
            color="success"
            size="large"
            onClick={() => fileInputRef.current?.click()}>
            Seleccionar archivo
            <Settings />
          </Button>
        </div>
      </div>
      {listAgregar && (
        <div
          className="p-2 mt-2 rounded-lg shadow-elevation-4 bg-secondaryNew"
          style={{
            flexDirection: "row",
            alignContent: "space-between",
            justifyContent: "space-around",
            alignItems: "stretch",
            padding: "15px"
          }}>
          <p>Agregar</p>
          <div className="mt-2">
            <TableComponent
              Dense={true}
              buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Código",
                  field: "trazabilidad"
                },
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Genérico",
                  field: "generico"
                },
                {
                  title: "Fecha",
                  field: "fecha",
                  render: (row) => {
                    return moment(row.fecha).format("L");
                  }
                }
              ]}
              dataInfo={listAgregar}
            />
          </div>
        </div>
      )}
      {listModificar && (
        <div
          className="p-2 mt-2 rounded-lg shadow-elevation-4 bg-secondaryNew"
          style={{
            flexDirection: "row",
            alignContent: "space-between",
            justifyContent: "space-around",
            alignItems: "stretch",
            padding: "15px"
          }}>
          <p>Registro existentes - No impactan en la Base de Datos</p>
          <div className="mt-2">
            <TableComponent
              Dense={true}
              buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Código",
                  field: "trazabilidad"
                },
                {
                  title: "Modelo",
                  field: "modelo"
                },
                {
                  title: "Genérico",
                  field: "generico"
                },
                {
                  title: "Fecha",
                  field: "fecha",
                  render: (row) => {
                    return moment(row.fecha).format("L");
                  }
                }
              ]}
              dataInfo={listModificar}
            />
          </div>
        </div>
      )}
      {(listModificar || listAgregar) && (
        <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
          <Button className={classes.greenButton} variant="contained" onClick={guardarCambios}>
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
};
