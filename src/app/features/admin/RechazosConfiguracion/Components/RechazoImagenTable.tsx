import React from "react";
import {
  IconButton,
  Tooltip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { Visibility } from "@mui/icons-material";
import { RechazoImagenSliceRequests } from "app/Middleware/reducers/RechazoImagenSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IRechazoImagen } from "app/models/IRechazoImagen";
import { ActionsButtons } from "app/shared/helpers/ActionsButtons";

interface IRechazoImagenTable {
  openForm: (state: boolean) => void;
  setEditState: (state: IRechazoImagen) => void;
  openImage: (state: IRechazoImagen) => void;
  refresh: () => void;
}

export const RechazoImagenTable = ({ openForm, setEditState, refresh, openImage }: IRechazoImagenTable) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const puestosImagen = useAppSelector<IRechazoImagen[]>((state) => state.rechazoImagen.dataAll);

  const onDelete = async (rechazoImage: IRechazoImagen) => {
    try {
      const confirm = await getConfirmation("Eliminar registro", "Esta seguro de eliminar el registro?");
      if (confirm) {
        const resp = await dispatch(RechazoImagenSliceRequests.deleteRequest(rechazoImage.id));
        resp && openNotificationUI("Se elimino correctamente", "success");
        refresh();
      }
    } catch (e) {
      openNotificationUI(e as any, "error");
    }
  };

  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return puestosImagen ?? [];

    return (puestosImagen ?? []).filter((r) => {
      const familia = (r?.familia?.nombre ?? "").toLowerCase();
      const nums = (r?.numerosColumnas ?? "").toLowerCase();
      const cod = String(r?.codigoRechazo ?? "").toLowerCase();
      const linea = (r?.lineaProduccion?.nombre ?? "").toLowerCase();
      return familia.includes(s) || nums.includes(s) || cod.includes(s) || linea.includes(s);
    });
  }, [puestosImagen, search]);

  React.useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage, puestosImagen]);

  const count = filtered.length;

  const paged = React.useMemo(() => {
    if (rowsPerPage <= 0) return filtered;
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-[22px] rounded-[3px] py-3">
        <button
          className="min-w-[140px] h-[35px] shadow-[0px_4px_4px_0px_#00000040] rounded-[5px] bg-[#137FEC] !text-[#FFF] !text-[14px] font-medium normal-case hover:bg-[#2c94fdff]"
          onClick={() => openForm(true)}>
          + Familia
        </button>

        <div className="flex-1 bg-New rounded-[3px] px-2 py-2">
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
            variant="standard"
            fullWidth
            InputProps={{ disableUnderline: true }}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full mb-5 border-[#777A79] dark:border-[#4f5c6690] border-b "></div>
      </div>

      {/* Tabla Nueva */}
      <TableContainer component={Paper} className="bg-New shadow-none rounded-[3px]">
        <Table size="small" className="table-fixed w-full">
          <TableHead>
            <TableRow className="bg-New">
              <TableCell className="!border-[#6d6d6d24] text-[14px] font-semibold text-textNew !px-[40px] py-3">
                Familia
              </TableCell>
              <TableCell className="!border-[#6d6d6d24] text-[14px] font-semibold text-textNew">
                Número en Columna
              </TableCell>
              <TableCell className="!border-[#6d6d6d24] text-[14px] font-semibold text-textNew">
                Código de Rechazo
              </TableCell>
              <TableCell className="!border-[#6d6d6d24] text-[14px] font-semibold text-textNew">
                Línea de Producción
              </TableCell>
              <TableCell className="!border-[#6d6d6d24] text-[14px] font-semibold text-textNew center">
                Acción
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody className="!shadow-none">
            {paged.map((row) => {
              const hasImg = (row?.imagenUrl ?? "").length > 1;

              return (
                <TableRow key={row.id} className="bg-New">
                  <TableCell className="!border-[#6d6d6d24] !text-[12px] text-textNew !px-[40px]">
                    {row?.familia?.nombre}
                  </TableCell>
                  <TableCell className="!border-[#6d6d6d24] !text-[12px] text-textNew">
                    {row?.numerosColumnas}
                  </TableCell>
                  <TableCell className="!border-[#6d6d6d24] !text-[12px] text-textNew !px-[60px]">
                    {row?.codigoRechazo}
                  </TableCell>
                  <TableCell className="!border-[#6d6d6d24] !text-[12px] text-textNew !px-[25px]">
                    {row?.lineaProduccion?.nombre}
                  </TableCell>

                  <TableCell className="!border-[#6d6d6d24] text-[12px] !text-center">
                    <div className="rechazo-actions w-full flex justify-center items-center">
                      <IconButton onClick={() => openImage(row)} className="!ml-[8px]">
                        <Tooltip title={hasImg ? "Ver imagen" : "Agregar imagen"}>
                          <Visibility fontSize="small" className="!ml-[10px]" />
                        </Tooltip>
                      </IconButton>

                      <ActionsButtons
                        edit
                        eliminar
                        row={row}
                        onEditProps={(r) => setEditState(r)}
                        onDeleteProps={(r) => onDelete(r)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {count === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center color-[#3F3D56]">
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true
          }}
          className="bg-New"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableContainer>

      <style>{`
      .center{ text-align:center !important; width:150px;}
      
      /* Color azul en iconos */
      .rechazo-actions svg,.rechazo-actions .MuiSvgIcon-root,.rechazo-actions .MuiIconButton-root svg,.rechazo-actions .MuiIconButton-root .MuiSvgIcon-root{
        color: #1976d2 !important;}
      `}</style>
    </div>
  );
};
