import { ISuperCargalinea } from "app/models";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TableComponent } from "../../../../shared/components/Table/TableComponent";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";
import { Button, Checkbox, IconButton, Tooltip } from "@mui/material";
import { Print, PrintOutlined } from "@mui/icons-material";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { GeneradorEtiquetasTable } from "./GeneradorEtiquetasTable";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { useAppSelector } from "app/core/store/store";
import { ComercialForm } from "../modals/ComercialForm";
interface Props {
  data: ISuperCargalinea[];
  onEditProps?: any;
  onDeleteProps?: any;
  onAddProps?: any;
  view?: boolean;
  etiquetas?: boolean;
  impresora?: string;
  modelo: string;
  refresh: any;
}

export const ComercialTable = ({
  data,
  onEditProps,
  onDeleteProps,
  onAddProps,
  view,
  etiquetas,
  impresora,
  modelo,
  refresh
}: Props): JSX.Element => {
  const [modalPrint, setModalPrint] = useState(false);
  const [material, setMaterial] = useState({} as ISuperCargalinea);
  const [materiales, setMateriales] = useState<ISuperCargalinea[]>([]);
  const color = MaterialButtons();
  const linea = useAppSelector((state) => state.linea.object);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (linea) console.log(linea.idLinea);
  }, [linea]);

  const onDelete = (row: ISuperCargalinea) => {
    onDeleteProps(row.idSupercargalinea);
  };
  const onEdit = (row) => {
    onEditProps(row);
  };
  const onAdd = (row) => {
    //onAddProps(row); //lo comento xq no hace nada
    console.log(linea);
    setOpenModal(true);
    console.log("Super2024");
  };
  const onChangeCheck = (idSupercargalinea: number, checked: boolean): void => {
    if (checked) {
      const newMaterial = data.find((d) => d.idSupercargalinea == idSupercargalinea);
      setMateriales([...materiales, newMaterial]);
    } else {
      const materialesFilter = materiales.filter((m) => m.idSupercargalinea !== idSupercargalinea);
      setMateriales(materialesFilter);
    }
  };

  const onGenerarEtiquetas = (row: ISuperCargalinea) => {
    setModalPrint(true);
    setMaterial(row);
    setMateriales([]);
  };
  useEffect(() => {
    setMateriales([]);
  }, [data]);
  return (
    <div>
      <TableComponent
        excel
        IDcolumn="idSupercargalinea"
        buscar
        button={
          <Button
            color="secondary"
            className="mx-3"
            disabled={materiales.length == 0}
            onClick={() => setModalPrint(true)}>
            <Print />
            Imprimir seleccionados
          </Button>
        }
        columns={[
          {
            title: "Para imprimir",
            field: "",
            render: (row: ISuperCargalinea) =>
              !view ? (
                <Checkbox disabled icon={<PrintOutlined />} checkedIcon={<Print />} checked />
              ) : (
                <Checkbox
                  icon={<PrintOutlined />}
                  checkedIcon={<Print />}
                  checked={materiales.find((mate) => mate.idSupercargalinea == row.idSupercargalinea) ? true : false}
                  onClick={(e: any) => onChangeCheck(row.idSupercargalinea, e.target.checked)}
                />
              )
          },
          {
            title: "Código modelo",
            field: "codigoModelo"
          },
          {
            title: "Gaveta",
            field: "gaveta"
          },
          {
            title: "Cantidad",
            field: "cantidadMaterial"
          },
          {
            title: "Código de pautas",
            field: "codigoPautas"
          },
          {
            title: "Descripción",
            field: "descripcion"
          },
          {
            title: "Posicion",
            field: "descripSector"
          },
          {
            title: "Alternativo",
            field: "alternativo1"
          },
          {
            title: "Fecha",
            field: "",
            render: (row) => moment(row).format("L")
          },
          {
            title: "Usuario",
            field: "usuario"
          },
          {
            title: "Cantidad de material",
            field: "cantidadMaterial"
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <ActionsButtons
                    row={row}
                    edit
                    eliminar
                    onDeleteProps={onDelete}
                    onEditProps={onEdit}
                    disabled={view}
                  />
                  {etiquetas && (
                    <div>
                      <Tooltip title="Generar etiqueta">
                        <IconButton
                          disabled={!view}
                          onClick={() => onGenerarEtiquetas(row)}
                          size="small"
                          style={{ position: "relative" }}>
                          <Print />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              );
            }
          }
        ]}
        dataInfo={data}
        agregar={onAdd}
      />
      <ModalCompoment
        title={materiales.length != 0 ? "Imprimir lote seleccionados" : "Generar etiquetas"}
        setOpenPopup={setModalPrint}
        openPopup={modalPrint}>
        <GeneradorEtiquetasTable
          material={material}
          impresora={impresora}
          closeModal={setModalPrint}
          materiales={materiales}
        />
      </ModalCompoment>

      <ModalCompoment openPopup={openModal} setOpenPopup={setOpenModal} title={"Agregar material"}>
        <ComercialForm
          modelo={modelo}
          dataEdit={null}
          setOpenModal={setOpenModal}
          idLinea={linea?.idLinea}
          refresh={refresh}
        />
      </ModalCompoment>
    </div>
  );
};
