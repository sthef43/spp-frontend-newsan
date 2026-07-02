import React from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { IAudit } from "app/models/IAudit";
import { useHistory } from "react-router";
import { TableComponent } from "../../../../../shared/components/Table/TableComponent";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import { IAppUser, IPlant } from "app/models";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { AuditSliceRequests } from "app/features/audit/slices/AuditSlice";
const divofacctions =
  "w-full py-2 sm:col-span-1 items-center grid grid-cols-3 sm:grid-cols-2 sm:border-2 sm:content-center border-gray-500 rounded-md px-0 sm:px-4 gap-2 sm:gap-4";

export const AuditTableOfAudits = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { TitleChanger } = useTitleOfApp();

  const audits = useAppSelector<IAudit[]>((state) => state.audit.dataAll);
  const planta = useAppSelector<IPlant>((state) => state.plant.object);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const onGetAudits = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(
        AuditSliceRequests.getAllByPlantIdAndRolRequest({ plantId: planta.id, rolId: infoUser?.permisos?.rol?.id })
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  React.useEffect(() => {
    planta && onGetAudits();
  }, [planta]);

  React.useEffect(() => {
    TitleChanger("Creación y Edición de Auditorías");
  }, []);

  const ExtraModulesCollapse = ({ row }: any) => {
    return (
      <>
        <div className={divofacctions}>
          <div className="font-bold">Lista nombre: </div>
          <div className="col-span-2 sm:col-span-1 text-right ">{row?.auditType?.lista?.name}</div>
        </div>
        <div className={divofacctions}>
          <div className="font-bold">Lista de valores: </div>
          <div className="col-span-2 sm:col-span-1 text-right ">
            {row?.auditType?.lista?.listaValores?.map((element, index) =>
              element.valor.flagCriterio ? (
                <span className="text-green-600 px-1" key={index}>
                  {element.valor.name}
                </span>
              ) : (
                <span className="text-red-600 px-1" key={index}>
                  {element.valor.name}
                </span>
              )
            )}
          </div>
        </div>
      </>
    );
  };
  return (
    <div>
      <TitleUIComponent title="Lo siguiente es una lista de todas las auditorías. Si quiere crear una nueva, seleccione agregar. Si desea editar una búsquela" />
      <div className="my-2 mx-4 h-full">
        <SelectOFPlant />
        {/* aca va el search  */}
        {planta && (
          <TableComponent
            buscar={true}
            IDcolumn={"id"}
            columns={[
              {
                title: "Nombre",
                field: "name"
              },
              {
                title: "Num.Registro",
                field: "numberRegistry"
              },
              {
                title: "Nombre Auditoría",
                field: "auditType.name"
              },
              {
                title: "Lista Nombre",
                field: "auditType.lista.name"
              }
            ]}
            agregar={() => {
              history.push("/main/auditoria/CRUD/0");
            }}
            dataInfo={audits}
            Collapse={true}
            CollapseExtraModulesBefore={ExtraModulesCollapse}
            Edit={(row) => {
              history.push(`/main/auditoria/CRUD/${row.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
};
