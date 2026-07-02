/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react/display-name */
import { ArrowDownward, Search, FirstPage, ChevronLeft, ChevronRight, LastPage, FilterList } from "@mui/icons-material";
//import MaterialTable from "material-table";
import React, { forwardRef } from "react";
import { IPlanProd } from "app/models/IPlanProd";
import { useAppDispatch } from "app/core/store/store";
import { IControlLote } from "app/models/IControlLote";
import { TableComponent } from "app/shared/components/Table/TableComponent";

interface props {
  pautasAprobadas: Array<IPlanProd>[];
}

export const PautasAprobadasTable = ({ pautasAprobadas }: props): JSX.Element => {
  const tableIcons = {
    FirstPage: forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
    SortArrow: forwardRef<SVGSVGElement>((props, ref) => <ArrowDownward {...props} ref={ref} />),
    LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronLeft {...props} ref={ref} />),
    Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
    ClearSearch: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
    Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />)
  };

  const dispatch = useAppDispatch();
  const [datosControlLote, setdatosControlLote] = React.useState<IControlLote[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRechazo, setSelectedRechazo] = React.useState<IControlLote>(null);
  const [planProdDelRechazo, setPlanProdDelRechazo] = React.useState<IPlanProd>(null);

  return (
    <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
      {/*  <div className="w-full flex justify-center ">
        <TitleUIComponent title="Números de serie rechazados" classNameDiv="w-full whitespace-wrap mx-0" />
      </div> */}
      <TableComponent
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Version Proceso",
            field: "versionProceso"
          },
          {
            title: "Generico",
            field: "generico"
          },
          {
            title: "Plataforma",
            field: "plataforma"
          },
          {
            title: "Linea",
            field: "linea"
          },
          {
            title: "Puesto",
            field: "puesto"
          }
          /*  {
            title: "",
            field: "",
            render: (row) => (
              <IconButton
                onClick={() => {
                  setRow(row);
                }}
                size="small">
                <Edit />
              </IconButton>
            )
          } */
        ]}
        dataInfo={pautasAprobadas}
      />
      {/*   <ModalCompoment title="Editar rechazo" openPopup={modalOpen} setOpenPopup={setModalOpen}>
        <RechazoEditDialog
          controlLote={selectedRechazo}
          rechazados={datosControlLote}
          planProd={planProdDelRechazo}
          onInitRechazosTable={onInit}
          setOpenPopup={setModalOpen}
        />
      </ModalCompoment> */}
    </div>
  );
};
