import { Edit } from "@mui/icons-material";
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
import React from "react";
interface Props {
  handleEdit: any;
}
export const TargetTable = ({ handleEdit }: Props) => {
  const target = useAppSelector((s) => s.target?.object);

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
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0
    }
  }));
  return !target ? (
    <></>
  ) : (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Target</StyledTableCell>
              <StyledTableCell align="right">Target desarme</StyledTableCell>
              {/* aca agrege */}
              <StyledTableCell align="right">Cant</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow key={target?.idTarget}>
              <StyledTableCell component="th" scope="row">
                {target?.target}
              </StyledTableCell>
              <StyledTableCell align="right">{target?.targetDesarme}</StyledTableCell>
              {/*lo q agregre      */}
              <StyledTableCell align="right">{target?.standar}</StyledTableCell>
              {/* /// */}
              <StyledTableCell align="right">
                <Tooltip title="Cambiar target">
                  <IconButton
                    onClick={() => {
                      handleEdit();
                    }}
                    size="small"
                    style={{ position: "relative" }}>
                    <Edit color="info" />
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
