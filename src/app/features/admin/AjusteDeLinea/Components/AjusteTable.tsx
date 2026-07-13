import { Delete, Edit } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import { useAppSelector } from "app/core/store/store";

interface Props {
  handleReset: () => void;
  handleEdit: () => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

export const AjusteTable = ({ handleReset, handleEdit }: Props) => {
  const ajuste = useAppSelector((s) => s.ajuste?.object);

  return (
    <div className="shadow-lg">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Linea</StyledTableCell>
              <StyledTableCell align="right">Identificador</StyledTableCell>
              <StyledTableCell align="right">Ajuste</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow key={ajuste?.id}>
              <StyledTableCell component="th" scope="row">
                {ajuste?.linea?.descripcion}
              </StyledTableCell>
              <StyledTableCell align="right">{ajuste?.identificador}</StyledTableCell>
              <StyledTableCell align="right">{ajuste?.ajuste1}</StyledTableCell>
              <StyledTableCell align="right">
                <Tooltip title="Cambiar ajuste">
                  <IconButton
                    onClick={() => {
                      handleEdit();
                    }}
                    size="small"
                    style={{ position: "relative" }}>
                    <Edit color="info" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Quitar ajuste">
                  <IconButton
                    onClick={() => {
                      handleReset();
                    }}
                    size="small"
                    style={{ position: "relative" }}>
                    <Delete color="error" />
                  </IconButton>
                </Tooltip>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
