import { Settings } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { DobMaestroPiezaliceRequests } from "app/Middleware/reducers/DobMaestroPiezaSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface props {
  refresh: any;
  setOpenPopup: any;
  listMaestroPieza: any;
}

export const MaestroPiezaExl = ({ setOpenPopup, refresh, listMaestroPieza }: props) => {
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
        arreglo.push({
          id: index,
          articulo: e[0],
          generico: e[1],
          descripcion: e[2],
          tipo: e[3],
          codigoMP: e[4],
          dimension: e[5],
          consumo: e[6],
          proveedor: e[7]
        });
      });
      setListExcel(arreglo);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (listExcel) {
      verificar();
    }
  }, [listExcel]);

  //Verificar Listado para Agregar/Modificar Articulos
  const [listAgregar, setListAgregar] = useState(null);
  const [listModificar, setListModificar] = useState(null);
  const verificar = () => {
    const arrListAgregar = [];
    const arrListModificar = [];
    listExcel.map((p) => {
      const f = listMaestroPieza.filter((x) => x.articulo == p.articulo);
      if (f.length > 0) {
        const q = { ...p, id: f[0].id, createdDate: f[0].createdDate };
        arrListModificar.push(q);
      } else {
        arrListAgregar.push(p);
      }
    });
    setListAgregar(arrListAgregar);
    setListModificar(arrListModificar);
  };

  //Guardar Cambios
  const guardarCambios = async () => {
    try {
      const newlistAgregar = listAgregar.map(({ id, ...rest }) => rest);
      unwrapResult(await dispatch(DobMaestroPiezaliceRequests.multiPostRequest(newlistAgregar)));
      unwrapResult(await dispatch(DobMaestroPiezaliceRequests.multiPutRequest(listModificar)));
      openNotificationUI("Guardado...", "success");
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
        <p>* Columnas: Articulo | Generico | Descripcion | Tipo | Materia Prima | Dimensión | Consumo | Proveedor.</p>
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
              // buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Artículo",
                  field: "articulo"
                },
                {
                  title: "Genérico",
                  field: "generico"
                },
                {
                  title: "Descripcion",
                  field: "descripcion"
                },
                {
                  title: "Tipo",
                  field: "tipo"
                },
                {
                  title: "Materia Prima",
                  field: "codigoMP"
                },
                {
                  title: "Dimension",
                  field: "dimension"
                },
                {
                  title: "Consumo",
                  field: "consumo"
                },
                {
                  title: "Proveedor",
                  field: "proveedor"
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
          <p>Modificar</p>
          <div className="mt-2">
            <TableComponent
              Dense={true}
              // buscar={true}
              IDcolumn={"id"}
              columns={[
                {
                  title: "Id",
                  field: "id"
                },
                {
                  title: "Artículo",
                  field: "articulo"
                },
                {
                  title: "Genérico",
                  field: "generico"
                },
                {
                  title: "Descripcion",
                  field: "descripcion"
                },
                {
                  title: "Tipo",
                  field: "tipo"
                },
                {
                  title: "Materia Prima",
                  field: "codigoMP"
                },
                {
                  title: "Dimension",
                  field: "dimension"
                },
                {
                  title: "Consumo",
                  field: "consumo"
                },
                {
                  title: "Proveedor",
                  field: "proveedor"
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
