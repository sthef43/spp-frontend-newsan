/* eslint-disable unused-imports/no-unused-vars */
import {
  AdminPanelSettingsRounded,
  BatteryChargingFullRounded,
  ConfirmationNumberRounded,
  DisplaySettingsRounded,
  HealthAndSafetyRounded,
  HelpCenterRounded,
  LeaderboardOutlined,
  LocalFireDepartmentRounded,
  PhoneAndroidRounded,
  PrecisionManufacturingRounded,
  QrCode2Rounded,
  VerifiedRounded,
  Warehouse,
  WorkspacePremiumRounded
} from "@mui/icons-material";
import React from "react";
import { CSSProperties } from "react";

interface Props {
  padre: string;
}

export const AsignarImagenSegunPadre: React.FC<Props> = ({ padre }) => {
  const stylesIcon: CSSProperties = {
    fontSize: "34px",
    padding: "5px",
    borderRadius: "100%"
  };

  const Icono = () => {
    const getStyle = (color: string) => ({
      color: color,
      backgroundColor: `${color}25`,
      borderRadius: "8px",
      padding: "4px",
      fontSize: "28px",
      ...stylesIcon
    });

    //Cada vez que se añada un nuevo padre se debe agregar un caso en el switch
    //O añadir el nuevo modulo al grupo de un padre existente
    switch (padre) {
      case "Admin":
      case "Administración":
      case "Gerencia":
      case "Cuenta":
        return <AdminPanelSettingsRounded sx={getStyle("#1976d2")} />;
      case "Manejo sistema":
      case "EBS":
      case "Otras funciones":
        return <DisplaySettingsRounded sx={getStyle("#455a64")} />;

      case "Producción":
      case "Plan Produccion Spp":
      case "Programación Industrial":
      case "Ingenieria":
        return <PrecisionManufacturingRounded sx={getStyle("#e65100")} />;
      case "Dobladora":
      case "Soldadura":
        return <LocalFireDepartmentRounded sx={getStyle("#ff5722")} />;
      case "Baterías":
        return <BatteryChargingFullRounded sx={getStyle("#d32f2f")} />;

      case "Calidad":
      case "SGI":
      case "Auditorías":
      case "Auditorias-V2.0":
        return <VerifiedRounded sx={getStyle("#2e7d32")} />;
      case "Seguridad e higiene":
        return <HealthAndSafetyRounded sx={getStyle("#1b5e20")} />;

      case "Cli":
      case "Supermercado":
      case "Contenedor":
        return <Warehouse sx={getStyle("#673ab7")} />;
      case "Trazabilidad":
      case "Etiquetas":
        return <QrCode2Rounded sx={getStyle("#5d4037")} />;

      case "OQC":
        return <WorkspacePremiumRounded sx={getStyle("#2e7d32")} />;
      case "OQC Celulares":
        return <PhoneAndroidRounded sx={getStyle("#0288d1")} />;
      case "Tableros":
      case "Informes":
        return <LeaderboardOutlined sx={getStyle("#0097a7")} />;
      case "Tickets":
        return <ConfirmationNumberRounded sx={getStyle("#fbc02d")} />;
      case "Ayuda":
        return <HelpCenterRounded sx={getStyle("#78909c")} />;

      default:
        return null;
    }
  };

  return (
    <main>
      <Icono />
    </main>
  );
};
