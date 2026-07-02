/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useCallback, useState } from "react";
import { ILinea } from "app/models";
import { IconButton, TablePagination } from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import EditIcon from "@mui/icons-material/Edit";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AdminLineasForm } from "../Modals/AdminLineasForm";

interface Props {
  lineas: ILinea[];
}

export const AdminLineasTable = ({ lineas }: Props): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);
  const [dataEdit, setDataEdit] = useState<ILinea>({} as ILinea);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  const count = (lineas ?? []).length;

  const lineasPaginadas =
    rowsPerPage > 0 ? (lineas ?? []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : lineas ?? [];

  const handleEditCL = useCallback((row: ILinea) => {
    setDataEdit(row);
    setOpenModal(true);
  }, []);

  const setOpenModalCL = useCallback((state: boolean) => {
    setOpenModal(state);
  }, []);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [count, rowsPerPage]);

  return (
    <div className="text-textNew">
      <div className="mx-2 mb-3 overflow-hidden rounded-[3px]">
        <div className="border-b border-gray-400 border-divider w-full mb-5"></div>
        <table className="bg-New shadow-Box rounded-xs w-full table-fixed">
          <thead>
            <tr className="text-[14px] text-center bg-NewTertiary">
              <th className="py-[14px] px-[20px] text-left font-semibold">Línea</th>
              <th className="font-semibold">Alias</th>
              <th className="font-semibold">Código</th>
              <th className="font-semibold">Tipo</th>
              <th className="font-semibold">Tipo de Unidad</th>
              <th className="font-semibold">Código</th>
              <th className="font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {lineasPaginadas?.map((row, idx) => (
              <tr key={row.idLinea} className="text-[12px] text-center font-regular">
                <td className="py-[25px] px-[15px] text-left">{row.descripcion}</td>
                <td>{row.alias}</td>
                <td>{row.codigo}</td>
                <td>{row.tipo}</td>
                <td>{row.tipoUnidad}</td>
                <td>{row.codigoInicio}</td>
                <td>
                  <IconButton size="medium" onClick={() => handleEditCL(row)} className="text-[#1976d2]">
                    <EditIcon fontSize="medium" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {!lineas?.length && (
              <tr className="border-t border-divider ">
                <td colSpan={7} className="h-[220px]" />
              </tr>
            )}
          </tbody>
        </table>
        <TablePagination
          rowsPerPageOptions={[5, 8, 12, 25, 50]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(0, 25, 71, 1)" : "#EFF8FF")
          }}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
      <div>
        <ModalCompoment
          titleModalStyle="Audit"
          showModalCenterPage
          setOpenPopup={setOpenModal}
          openPopup={openModal}
          title="Edtiar campos de Líneas"
          subTitle="Configure y gestione las relaciones técnicas de las líneas de producción">
          <AdminLineasForm dataEdit={dataEdit} setOpenModal={setOpenModalCL} />
        </ModalCompoment>
      </div>
      <style>{`
      /* OCULTA EL TÍTULO DEL MODALCOMPONENT */
      .MuiDialogTitle-root .bg-gradient-to-r:has(h1:empty) {display: none !important;}
      .MuiDialogTitle-root:has(h1:empty) {display: none !important;}
      table tbody tr:nth-child(odd){background-color: #ffffff;}
      table tbody tr:nth-child(even){background-color: #EFF8FF;}
      .dark table tbody tr:nth-child(odd){background-color: #000D27;}
      .dark table tbody tr:nth-child(even){background-color: rgba(0, 25, 71, 1);}
      `}</style>
    </div>
  );
};
