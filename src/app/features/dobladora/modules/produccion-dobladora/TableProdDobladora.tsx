import { useAppDispatch } from "app/core/store/store";
import { IDobProdDeclaracion } from "app/models/IDobProdDeclaracion";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import moment from "moment";
import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TablaMovimientosDeclaradosDobladora } from "./TablaMovimientosDeclaradosDobladora";

interface Props {
  data: IDobProdDeclaracion[];
}

export const TableProdDobladora = ({ data }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const [listaDeclaraciones, setListaDeclaraciones] = useState([]);
  const [movimientosDeclaradosModal, setMovimientosDeclaradosModal] = useState<IDobProdDeclaracion | undefined>(
    undefined
  );
  const [openModalMovs, setOpenModalMovs] = useState(false);

  const openMovimientosModal = (row: IDobProdDeclaracion) => {
    console.log("dec", row);
  };
  const getSemielaboradoSelected = () => {
    if (movimientosDeclaradosModal) {
      return movimientosDeclaradosModal.semielaborado;
    } else {
      return "Sin información";
    }
  };

  useEffect(() => {
    setListaDeclaraciones(data);
  }, []);

  return (
    <>
      <div className="w-full bg-white  rounded-md">
        <div className="w-full text-left  pl-3 flex items-center h-12">
          <p className="text-lg m-0">Historial de Semielaborados</p>
        </div>
        <TableComponent
          excel={true}
          IDcolumn={"id"}
          headerBackgroundColor="#F8FAFB"
          columns={[
            {
              title: "Fecha",
              field: "fecha",
              render: (row) => {
                return moment(row).format("DD/MM/YYYY");
              }
            },
            {
              title: "Semielaborado",
              field: "semielaborado"
            },
            {
              title: "Descripcion",
              field: "descripcion"
            },
            {
              title: "OP",
              field: "op"
            },
            {
              title: "Programado",
              field: "cantidadOP"
            },
            {
              title: "Producido",
              field: "totalDeclarado"
            },
            {
              title: "Acciones",
              field: "",
              render: (row: IDobProdDeclaracion) => {
                return (
                  <div className="flex w-full justify-end sm:justify-start gap-4">
                    <div>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setMovimientosDeclaradosModal(row);
                          setOpenModalMovs(!openModalMovs);
                        }}>
                        <VisibilityIcon sx={{ color: "#137FEC" }} />
                      </IconButton>
                    </div>
                  </div>
                );
              }
            }
          ]}
          dataInfo={listaDeclaraciones}></TableComponent>
      </div>
      <ModalCompoment
        title="Historial Semielaborado"
        subTitle={getSemielaboradoSelected()}
        openPopup={openModalMovs}
        setOpenPopup={setOpenModalMovs}
        titleModalStyle="Audit"
        onCloseDynamic={false}
        showModalCenterPage={true}
        subTitleClassName="text-sm text-[#137FEC] font-semibold mt-1">
        <TablaMovimientosDeclaradosDobladora dataDeclarada={movimientosDeclaradosModal} />
      </ModalCompoment>
    </>
  );
};
