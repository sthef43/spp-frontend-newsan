import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import * as XLSX from "xlsx";
import { StatesFormModalsSlice } from "../reducers/StatesForModalsSlice";
import { IDataExcelEmbarques } from "../models/IDataExcelEmbarques";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";

export function UseExcelEmbarquesHooks() {
  const { dataAll } = useAppSelector((state) => state.planProdSppEstadoEmbarques);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const handleFileExcelEmbarques = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onFilUploadExcel(file);
    }
    e.target.value = "";
  };

  const onFilUploadExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      jsonData.shift();
      const embarquesFormat = formatDataExcel(jsonData);
      const embarquesSet: IPlanProdSppEmbarque[] = embarquesFormat.map((elementos) => {
        const estadoEmbarque = dataAll.find(
          (estados) => elementos.status.toLowerCase().trim() === estados.nombre.toLowerCase().trim()
        );
        const aux: IPlanProdSppEmbarque = {
          nombreEmbarque: elementos.partes && elementos.partes ? elementos.partes : "",
          numeroEmbarque:
            elementos.numeroEmbarque && elementos.numeroEmbarque ? elementos.numeroEmbarque.toString() : "",
          estadoEmbarqueId: estadoEmbarque && estadoEmbarque ? estadoEmbarque.id : 10,
          bajada: elementos.bajada,
          po: elementos.po.toString()
        };
        return aux;
      });
      dispatch(StatesFormModalsSlice.actions.setDataFormatExcelEmbarque(embarquesSet));
    };
    reader.readAsArrayBuffer(file);
    openNotificationUI("Se cargo el excel de los embarques con exito", "info");
  };

  const formatDataExcel = (stringDataExcel: IDataExcelEmbarques[]): IDataExcelEmbarques[] => {
    const excelFormat = stringDataExcel.map(
      (elementos: any): IDataExcelEmbarques => ({
        numeroEmbarque: elementos[6],
        po: elementos[3],
        partes: elementos[7],
        status: elementos[8],
        bajada: elementos[9]
      })
    );
    return excelFormat;
  };

  return { handleFileExcelEmbarques };
}
