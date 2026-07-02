import { IAutomotrizJig } from "app/features/informes/Modules/reportePlacasAutomotriz/Interfaces/IAutomotrizJig";
import React, { useMemo } from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  dataTest: IAutomotrizJig;
}
export const AutomotrizTesteosModal = ({ dataTest }: Props): JSX.Element => {
  const testeoObj = useMemo(() => {
    if (!dataTest?.testeo) return null;
    try {
      return JSON.parse(dataTest.testeo);
    } catch (e) {
      return null;
    }
  }, [dataTest]);

  const dataParaTabla = useMemo(() => {
    console.log("datateste", testeoObj);
    return [{ ...dataTest, testeoObj }];
  }, [dataTest, testeoObj]);

  const columnsTabla = useMemo(() => {
    return [
      {
        title: "Max Vol Test - Eff [%]",
        field: "",
        render: (row: any) => row.testeoObj?.["Maximum Voltage Test"]?.["Efficiency[%]"] || "N/A"
      },
      {
        title: "Max Vol Test - Input Current[mA]",
        field: "",
        render: (row: any) => row.testeoObj?.["Maximum Voltage Test"]?.["Input Current[mA]"] || "N/A"
      },
      {
        title: "Max Vol Test - Input Voltaje[V]",
        field: "",
        render: (row: any) => row.testeoObj?.["Maximum Voltage Test"]?.["Input Voltage[V]"] || "N/A"
      },
      {
        title: "Max Vol Test - Output Current[mA]",
        field: "",
        render: (row: any) => row.testeoObj?.["Maximum Voltage Test"]?.["Output Current[mA]"] || "N/A"
      },
      {
        title: "Max Vol Test - Output Voltage[V]",
        field: "",
        render: (row: any) => row.testeoObj?.["Maximum Voltage Test"]?.["Output Voltage[V]"] || "N/A"
      },
      //---------
      // {
      //   title: "Min Vol test - Eff [%]",
      //   field: "",
      //   render: (row: any) => row.testeoObj?.["Minimum Voltage Test"]?.["Efficiency[%]"] || "N/A"
      // },
      {
        title: "Min Vol test - Input Current[mA]",
        field: "",
        render: (row: any) => row.testeoObj?.["Minimum Voltage Test"]?.["Input Current[mA]"] || "N/A"
      },
      {
        title: "Min Vol test - Input Voltaje[V]",
        field: "",
        render: (row: any) => row.testeoObj?.["Minimum Voltage Test"]?.["Input Voltage[V]"] || "N/A"
      },
      {
        title: "Min Vol test - Output Current[mA]",
        field: "",
        render: (row: any) => row.testeoObj?.["Minimum Voltage Test"]?.["Output Current[mA]"] || "N/A"
      },
      {
        title: "Min Vol test - Output Voltage[V]",
        field: "",
        render: (row: any) => row.testeoObj?.["Minimum Voltage Test"]?.["Output Voltage[V]"] || "N/A"
      },
      //---------
      {
        title: "Rated Vol Test - Eff [%]",
        field: "",
        render: (row: any) => row.testeoObj?.["Rated Voltage Test"]?.["Efficiency[%]"] || "N/A"
      },
      {
        title: "Rated Vol Test - Input Current[mA]",
        field: "",
        render: (row: any) => row.testeoObj?.["Rated Voltage Test"]?.["Input Current[mA]"] || "N/A"
      },
      {
        title: "Rated Vol Test - Input Voltaje[V]",
        field: "",
        render: (row: any) => row.testeoObj?.["Rated Voltage Test"]?.["Input Voltage[V]"] || "N/A"
      },
      {
        title: "Rated Vol Test - Output Current[mA]",
        field: "",
        render: (row: any) => row.testeoObj?.["Rated Voltage Test"]?.["Output Current[mA]"] || "N/A"
      },
      {
        title: "Rated Vol Test - Output Voltage[V]",
        field: "",
        render: (row: any) => row.testeoObj?.["Rated Voltage Test"]?.["Output Voltage[V]"] || "N/A"
      },
      //----------
      {
        title: "Slot",
        field: "",
        render: (row: any) => row.testeoObj?.["Slot"] || "N/A"
      },
      {
        title: "Resultado",
        field: "",
        render: (row: any) => (
          <div>
            {row.testeoObj?.["Test Result"] === "OK" ? (
              <CheckIcon sx={{ color: "#28fc03" }} />
            ) : (
              <CloseIcon sx={{ color: "#fc031c" }} />
            )}
          </div>
        )
      }
    ];
  }, [dataTest]);

  return (
    <div className="w-full max-w-[1200px] p-2 mx-auto">
      <div className="w-full overflow-x-auto scrollbar-thin">
        {/*ancho total que necesitan tus columnas para que se vean bien 
             A medida que se necesitem más columnas, hay que subirle los pxs :-| (ej: 1200px, 1500px) */}
        <div className="min-w-[2900px]">
          <TableComponent IDcolumn={"id"} columns={columnsTabla} dataInfo={dataParaTabla} Overflow={false} />
        </div>
      </div>
    </div>
  );
};
