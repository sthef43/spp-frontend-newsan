/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Button, Collapse, Menu, MenuItem, TableFooter, TableSortLabel, TextField } from "@mui/material";
import { Delete, Edit, FilterList, Search, Visibility } from "@mui/icons-material";
import { Buscador } from "app/shared/helpers/deepSearch";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import _ from "lodash";
import classNames from "classnames";
import { visuallyHidden } from "@mui/utils";
import { IQuery, IQueryResult } from "app/models/IQuery";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";

export const divofacctions =
  "w-full py-2 sm:col-span-1 items-center grid grid-cols-3 sm:grid-cols-2 sm:border-2 sm:content-center border-gray-500 rounded-md px-0 sm:px-4 gap-2 sm:gap-4";

interface propsTable {
  dataInfo?: any;
  agregar?: (props?: any) => any;
  columns: { title: string; field: string; lookup?: Record<string, unknown>; render?: (row: any) => any }[];
  buscar?: boolean;
  Dense?: boolean;
  Overflow?: boolean;
  IDcolumn: string;
  AsyncData?: (query: IQuery<any>) => Promise<IQueryResult<any>>;
  Collapse?: boolean;
  CollapseExtraModulesBefore?: any;
  filterWithSpecificValues?: any;
  CollapseExtraModulesAfter?: any;
  CollapseOverride?: any;
  rightButton?: { name: string; func: any };
  Edit?: (props?: any) => any;
  Delete?: (props?: any) => any;
  rowStyle?: (props?: any) => any;
  Watch?: (props?: any) => any;
  setFiltroSeleccionadoProp?: (props?: any) => any;
  showFooter?: boolean | true;
  excel?: boolean; //Cuando pones true, aparece le boton para exportar a excel, la info que tenes en la tabla.
  fileNameExcel?: string;
  button?: JSX.Element;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (_.get(b, orderBy) < _.get(a, orderBy)) {
    return -1;
  }
  if (_.get(b, orderBy) > _.get(a, orderBy)) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
// function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }
const ModuleCollapse = (props: any) => {
  const { row } = props;
  return (
    <>
      {props.CollapseOverride ? (
        <props.CollapseOverride />
      ) : (
        <div className="w-full sm:flex  sm:items-stretch sm:justify-center sm:gap-2 px-8">
          {props.CollapseExtraModulesBefore && <props.CollapseExtraModulesBefore row={row} />}
          {(props.Edit || props.Watch || props.Delete) && (
            <div className={divofacctions}>
              <div className=" font-bold">Acciones </div>
              <div className="col-span-2 sm:col-span-1 text-right justify-end flex gap-4">
                {props.Edit && (
                  <IconButton
                    className="textButtons"
                    onClick={() => {
                      props.Edit(row);
                    }}
                    size="large">
                    <Edit />
                  </IconButton>
                )}
                {props.Watch && (
                  <IconButton
                    className="textButtons"
                    onClick={() => {
                      props.Watch(row);
                    }}
                    size="large">
                    <Visibility />
                  </IconButton>
                )}
                {props.Delete && (
                  <IconButton
                    className="textButtons"
                    onClick={() => {
                      props.Delete(row);
                    }}
                    color="error"
                    size="large">
                    <Delete />
                  </IconButton>
                )}
              </div>
            </div>
          )}
          {props.CollapseExtraModulesAfter && <props.CollapseExtraModulesAfter row={row} />}
        </div>
      )}
    </>
  );
};

const RowBody = (props: any) => {
  const { row, rowStyle } = props;
  const [open, setOpen] = React.useState(false);

  const [isSelected, setIsSelected] = React.useState(false);
  const [SelectedRowId, setSelectedRowId] = React.useState(false);

  const handleRowClick = () => {
    setSelectedRowId(row.id);
    setIsSelected(!isSelected); // invertir estadoss
  };

  // para aplicar estilos a las filas seleecionadas
  const rowClasses = classNames({
    "bg-yellow-500": isSelected
  });

  const funcionDeRenderizado = (row) => {
    if (rowStyle) {
      return {
        "&:last-child td, &:last-child th": { border: 0 },
        "& > *": { borderBottom: "1px solid #E5E7EB" },
        ...rowStyle(row)
      };
    } else {
      return {
        "&:last-child td, &:last-child th": { border: 0 },
        "& > *": { borderBottom: "1px solid #E5E7EB" }
      };
    }
  };
  return (
    <>
      <TableRow
        role="checkbox"
        sx={{ ...funcionDeRenderizado(row), cursor: "pointer" }}
        onClick={handleRowClick}
        className={rowClasses}>
        {props.Collapse && (
          <TableCell sx={{ "@media (max-width: 640px)": { padding: "0", position: "relative" } }}>
            <IconButton
              sx={{ "@media (max-width: 640px)": { position: "absolute", padding: 0, top: "4px" } }}
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {props.columns?.map((element, index) => (
          <TableCell
            align="left"
            key={index}
            sx={{
              "@media (max-width: 640px)": { padding: "0rem 2rem" },
              backgroundColor: index === 0 ? "var(--secondary-color)" : undefined,
              position: index === 0 ? "sticky" : undefined, // se agrega la propiedad 'sticky' a la primera columna para que se mueva
              left: index === 0 ? 0 : undefined, // ajusta la posición horizontal de la primera columna
              zIndex: index === 0 ? 1 : undefined // etablece zIndex a 1 para la primera columna
              // backgroundColor: index === 0 ? DarkMode ? "#FFFFFF" : "#FFFFFF" : undefined ver esto
            }}>
            <div className={classNames("w-full grid grid-cols-3 sm:grid-cols-2 gap-4", props.Dense ? "py-0" : "py-2")}>
              <div className="sm:hidden font-bold">{element.title}:</div>
              <div className={classNames("col-span-2 text-right  sm:text-left", props.Dense ? "text-xs" : "text-base")}>
                {element.render ? element.render(row) : element.field && _.get(row, element.field)}
              </div>
            </div>
          </TableCell>
        ))}
      </TableRow>
      {props.Collapse && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={props.columns.length + 1}
            sx={{
              "@media (max-width: 640px)": {
                padding: "0rem 0rem"
              }
            }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <ModuleCollapse row={row} {...props} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const PositionedMenu = ({ lookup, setFilterSelected, title }: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (x: any) => {
    setFilterSelected({ title: title, value: x });

    setAnchorEl(null);
  };
  const handleCloseNothing = () => {
    setFilterSelected({ title: "", value: "" });

    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls="demo-positioned-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}>
        <FilterList fontSize="small" />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseNothing}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}>
        <MenuItem
          key={"dummy"}
          onClick={() => {
            handleCloseNothing();
          }}>
          Sin filtro
        </MenuItem>
        {Object.keys(lookup).map((x: any) => (
          <MenuItem
            key={x}
            onClick={() => {
              handleClose(x);
            }}>
            {lookup[x]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
function EnhancedTableHead(props: any) {
  const { order, orderBy, onRequestSort, setFilterSelected } = props;
  const createSortHandler = (property) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ fontSize: "1rem" }}>
      <TableRow>
        {props.Collapse && <TableCell padding="checkbox" />}
        {props.columns.map((element) => (
          <TableCell
            className={classNames(props.Dense ? "text-sm" : "text-base")}
            align="left"
            key={element.title}
            sortDirection={orderBy === element.title ? order : false}>
            <TableSortLabel
              active={orderBy === element.title}
              direction={orderBy === element.title ? order : "asc"}
              onClick={createSortHandler(element.title)}>
              {element.title}
              {orderBy === element.title ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
              {element.lookup && (
                <PositionedMenu lookup={element.lookup} setFilterSelected={setFilterSelected} title={element.field} />
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
/** Esta tabla puede contener los siguientes valores
 *
 *  `dataInfo`:`any` es el array de objetos necesario para necesaria para formar las columnas
 *
 *  `agregar`:`(props?: any) => any` sirve para llamar a agregar informarcion, tenes que pasarle una funcion que como parametros va a tener la row y despues se ejecutara esa funcion.
 *
 *  columns: { title: string; field: string | ((row: any) => any) }[];
 *
 *  buscar?: boolean;
 *  Dense?: boolean;
 *  IDcolumn: string;
 *  AsyncData?: (query: IQuery<any>) => Promise<IQueryResult<any>>;
 *  Collapse?: boolean;
 *  CollapseExtraModulesBefore?: any;
 *  filterWithSpecificValues?: any;
 *  CollapseExtraModulesAfter?: any;
 *  CollapseOverride?: any;
 *  Edit?: (props?: any) => any;
 *  Delete?: (props?: any) => any;
 *  rowStyle?: (props?: any) => any;
 *  Watch?: (props?: any) => any;
 */
export const TableDesliz = (props: propsTable) => {
  const [DataOpen, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchString, setSearchString] = React.useState("");
  const [order, setOrder] = React.useState<Order>("asc");
  const [quantityOfElements, setQuantityOfElements] = React.useState<number>(0);
  const [filterSelected, setFilterSelected] = React.useState({ title: "", value: "" });
  const [orderBy, setOrderBy] = React.useState("");
  const [totalCount, setTotalCount] = React.useState(0);
  const buttonClasses = MaterialButtons();
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChange = (e: any) => {
    if (props.dataInfo) {
      setSearchString(e.target.value);
      setPage(0);
    } else {
      setSearchString(e.target.value);
    }
  };

  const changeQuantityOfElements = (e: number, data: any) => {
    setQuantityOfElements(e);
  };

  const memorizeQuant = React.useCallback(_.debounce(changeQuantityOfElements, 1000), [changeQuantityOfElements]);

  const handleAsyncData = async () => {
    const result = await props.AsyncData({
      page: page,
      pageSize: rowsPerPage,
      search: searchString
    });
    setTotalCount(result.totalCount);
    //setTotalPages(result.page);
    setData(result.data);
  };

  React.useEffect(() => {
    //setData(_.cloneDeep(props.dataInfo));
    if (!props.dataInfo) {
      if (props.AsyncData) {
        handleAsyncData();
      }
    } else {
      if (searchString.length > 0) {
        setData(Buscador(_.cloneDeep(props.dataInfo), searchString));
      } else {
        setData(_.cloneDeep(props.dataInfo));
      }
    }
    return () => {
      //
    };
  }, [props, rowsPerPage, page, searchString]);

  const FilterTable = (table) => {
    const newTable = table.filter((x) => {
      if (filterSelected?.value) {
        return x[filterSelected.title] == filterSelected.value;
      } else {
        return true;
      }
    });

    memorizeQuant(newTable.length, newTable);
    return newTable;
  };

  //guarda el filtro, llamando la funcion que se le pasa por prop. Sino se la pasa, no hace nada.
  const setearFiltro = () => {
    if (props.setFiltroSeleccionadoProp) props.setFiltroSeleccionadoProp(filterSelected.value);
  };

  React.useEffect(() => {
    setPage(0);
  }, [filterSelected.value, order, orderBy]);

  //UseEffect para setear el filtro cuando cambia.
  React.useEffect(() => {
    setPage(0);
    setearFiltro();
  }, [filterSelected.value]);

  const _exporter = React.createRef<ExcelExport>();
  const excelExport = () => {
    if (_exporter.current) {
      _exporter.current.save();
    }
  };

  return (
    <div>
      {props.buscar && (
        <div className="my-2 h-full">
          {/* aca va el search  */}
          <div className="flex rounded-lg items-center px-2 w-full my-2 bg-secondaryNew shadow-elevation-4">
            {props.agregar && (
              <Button
                variant="contained"
                color="primary"
                className={buttonClasses.blueButton}
                onClick={() => {
                  props.agregar();
                }}>
                Agregar
              </Button>
            )}
            {props.button && props.button}
            {props.excel && (
              <div className="p-2">
                <Button
                  variant="contained"
                  color="secondary"
                  className={buttonClasses.greenButton}
                  onClick={excelExport}>
                  Exportar
                </Button>
                <ExcelExport
                  data={
                    props.dataInfo?.length > 0
                      ? rowsPerPage > 0
                        ? FilterTable(DataOpen).sort(
                            getComparator(order, props.columns.find((x) => x.title === orderBy)?.field as any)
                          )
                        : DataOpen
                      : DataOpen
                  }
                  ref={_exporter}
                  fileName={props.fileNameExcel ?? ""}>
                  {props.columns.map((e) => (
                    <ExcelExportColumn field={e.field} title={e.title} key={e.field} />
                  ))}
                </ExcelExport>
              </div>
            )}
            <div className=" text-gray-900 dark:text-gray-200 px-2 w-full pb-4">
              <div className="flex items-end">
                <Search />
                <TextField
                  id="busqueda"
                  fullWidth
                  value={searchString}
                  label="Buscar"
                  type="search"
                  onChange={handleChange}
                  variant="standard"
                />
              </div>
            </div>
            {props.rightButton && (
              <Button
                variant="contained"
                color="primary"
                className={buttonClasses.blueButton}
                onClick={() => {
                  props.rightButton.func();
                }}>
                {props.rightButton.name}
              </Button>
            )}
          </div>
        </div>
      )}
      <TableContainer
        component={Paper}
        className={classNames("shadow-elevation-6 rounded-lg", props.Overflow ? "overflow-y-auto h-screen" : "")}>
        <Table size="small" aria-label="simple table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            setFilterSelected={setFilterSelected}
            {...props}
          />
          <TableBody>
            {props.dataInfo?.length > 0
              ? (rowsPerPage > 0
                  ? FilterTable(DataOpen)
                      .sort(getComparator(order, props.columns.find((x) => x.title === orderBy)?.field as any))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : DataOpen
                ).map((row: any) => {
                  return (
                    <RowBody {...props} row={row} key={_.get(row, props.IDcolumn)} selectedRowId={selectedRowId} />
                  );
                })
              : DataOpen.map((row: any) => (
                  <RowBody {...props} row={row} key={_.get(row, props.IDcolumn)} selectedRowId={selectedRowId} />
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={props.dataInfo ? quantityOfElements : totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page"
                  },
                  native: true
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};
