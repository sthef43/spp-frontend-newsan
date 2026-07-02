import React from "react";
import { Switch, TablePagination } from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ILinea } from "app/models";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
// import { ControlEBSTable } from "app/shared/components/produccion/EBS/ControlEBSTable";

export const ControlEBSPage = () => {
  const lineas = useAppSelector<ILinea[]>((action) => action.linea.dataAll);

  const { getConfirmation } = useConfirmationDialog();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const count = (lineas ?? []).length;
  const isOn = (lineas?.[0]?.relacionaEbs ?? "N") === "S";
  const lineasPaginadas =
    rowsPerPage > 0 ? (lineas ?? []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : lineas ?? [];

  const getAllLineas = async () => {
    try {
      await dispatch(LineaSliceRequests.getAllRequest());
    } catch (e) {
      openNotificationUI(e as any, "error");
    }
  };

  const handleEBS = async () => {
    try {
      let condicion: string;
      const declaraEnEBS = lineas?.[0]?.relacionaEbs;

      const confirm =
        declaraEnEBS == "S" ? await getConfirmation("Desactivar EBS", "") : await getConfirmation("Activar EBS", "");

      if (confirm) {
        declaraEnEBS == "S" ? (condicion = "N") : (condicion = "S");

        const response = await dispatch(LineaSliceRequests.cambiarEBSRequest(condicion));
        // response && declaraEnEBS == "S"
        //   ? openNotificationUI("Se desactivo correctamente", "success")
        //   : openNotificationUI("Se activo correctamente", "success");

        getAllLineas();
      }
    } catch (e) {
      openNotificationUI(e as any, "error");
    }
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    TitleChanger("Control de base de datos con EBS");
    getAllLineas();
  }, []);

  React.useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [count, rowsPerPage]);

  return (
    <div className="container m-auto mt-10">
      <div className="flex justify-center">
        <div className="bg-New rounded-[5px] w-full max-w-[1100px] h-[140px] px-8 py-2">
          <div className="text-[20px] font-bold text-textNew">Estado Global</div>
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-textNew font-regular">Activar/Desactivar EBS</div>

            {/* Switch personalizado */}
            <Switch
              checked={isOn}
              onChange={handleEBS}
              className={`ebs-switch scale-[1.35]
                [&_.MuiSwitch-track]:!opacity-100 
                [&_.MuiSwitch-track]:!rounded-[999px] 
                [&_.MuiSwitch-thumb]:!bg-[#FFF]
                [&_.MuiSwitch-thumb]:!scale-[0.50]
                  ${
                    isOn
                      ? "[&_.MuiSwitch-track]:!bg-[#10B981] [&_.MuiSwitch-switchBase.Mui-checked]:!text-[#10B981]"
                      : "[&_.MuiSwitch-track]:!bg-[#BDBDBD] [&_.MuiSwitch-switchBase]:!text-[#BDBDBD]"
                  }`}
              inputProps={{ "aria-label": "Activar/Desactivar EBS" }}
            />
          </div>

          <div
            className={`mt-[5px] h-[44px] rounded-[5px] flex items-center justify-center text-[12px] font-regular
             ${isOn ? "bg-[#E7F8F2] text-[#10B981]" : "bg-[#FFF4E2] text-[#FFB53F]"}`}>
            {isOn ? "SISTEMA OPERATIVO ACTIVO" : "SISTEMA OPERATIVO DESACTIVADO"}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[1100px] pt-5 border-b border-divider"></div>
      </div>

      {/* <ControlEBSTable /> comento tabla vieja */}

      {/* TABLA NUEVA*/}
      <div className="mt-7 flex justify-center">
        <div className="bg-New rounded-[3px] w-full max-w-[1100px]">
          <div className="flex justify-between py-3 bg-NewSecondary border-b border-[var(--border)]">
            <div className="font-bold text-textNew text-[12px] text-center w-[240px]">Línea de Producción</div>
            <div className="font-bold text-textNew text-[12px] text-center w-[220px]">Estado en EBS</div>
          </div>
          <div className="w-full bg-New">
            {lineasPaginadas.map((x) => {
              const on = x.relacionaEbs === "S";
              return (
                <div key={x.idLinea} className="flex justify-between py-3 px-[65px] border-b border-[var(--border)]">
                  <div className="text-[12px] text-textNew flex items-center">{x.descripcion}</div>
                  <div className="text-[12px] text-textNew flex items-center w-[220px] justify-end">
                    <span
                      className={`flex items-center justify-center h-[24px] px-2 rounded-[5px] text-[11px] font-semibold ${
                        on ? "bg-[#E7F8F2] text-[#10B981]" : "bg-[#FFF4E2] text-[#FFB53F]"
                      }`}>
                      {on ? "ACTIVO" : "DESACTIVADO"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </div>
      </div>
    </div>
  );
};
