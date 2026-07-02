import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IFamilia } from "app/models/IFamilia";
import { IModelo } from "app/models/IModelo";
import React from "react";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
interface Props {
  familia: IFamilia;
}
export const FamiliaInfo = ({ familia }: Props) => {
  const modelos = useAppSelector((p) => p.modelo.dataAll);
  const [dataTable, setDataTable] = React.useState<IModelo[]>(null);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(ModeloSliceRequest.getAllByFamiliaId(familia.id));
  }, []);
  React.useEffect(() => {
    setDataTable(modelos);
    return () => {
      setDataTable([]);
    };
  }, [modelos]);

  return (
    <div>
      <TableComponent
        columns={[
          {
            title: "Modelo",
            field: "nombre"
          },
          {
            title: "Descripción",
            field: "descripcion"
          }
        ]}
        IDcolumn="id"
        buscar
        dataInfo={dataTable}
      />
    </div>
  );
};
