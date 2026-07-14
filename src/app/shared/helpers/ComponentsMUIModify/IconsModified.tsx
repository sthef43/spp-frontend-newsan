import React from "react";
import {
  BarChartRounded,
  ChecklistRounded,
  DeleteRounded,
  EditRounded,
  ImageRounded,
  LocalShippingRounded,
  MapsHomeWorkRounded,
  RestoreRounded,
  ViewListRounded
} from "@mui/icons-material";
import { useTheme, Box } from "@mui/material";

interface IconContainerProps {
  children: React.ReactNode;
  typeButton: "editButton" | "restoreButton" | "shippingButton" | "deleteButton" | "viewListButton" | "checkListButton" | "chartButton";
  size?: string;
  colorLigth?: string;
}

interface PropsIcon {
  size?: string;
  colorLigth?: string;
}

const palleteColors = {
  editButton: {
    light: { bg: "#EFF6FF", radius: "12px" },
    dark: { bg: "#042657", radius: "12px" }
  },
  restoreButton: {
    light: { bg: "#FFF5F5", radius: "12px" },
    dark: { bg: "#320606ff", radius: "12px" }
  },
  shippingButton: {
    light: { bg: "#FFEFD7", radius: "12px" },
    dark: { bg: "#5f5200", radius: "12px" }
  },
  deleteButton: {
    light: { bg: "#FFF5F5", radius: "12px" },
    dark: { bg: "#320606ff", radius: "12px" }
  },
  viewListButton: {
    light: { bg: "#FFF5F5", radius: "12px" },
    dark: { bg: "#320606ff", radius: "12px" }
  },
  checkListButton: {
    light: { bg: "#FFF5F5", radius: "12px" },
    dark: { bg: "#320606ff", radius: "12px" }
  },
  chartButton: {
    light: { bg: "#e3f4fcff", radius: "0.5rem" },
    dark: { bg: "#263340ff", radius: "0.5rem" }
  }
};

const IconContainer: React.FC<IconContainerProps> = ({ children, typeButton, size, colorLigth }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        display: "inline-flex",
        backgroundColor: isLight ? colorLigth || palleteColors[typeButton].light.bg : palleteColors[typeButton].dark.bg,
        borderRadius: palleteColors[typeButton].light.radius,
        padding: "0.3rem",
        "& .MuiSvgIcon-root": { fontSize: size || "1.5rem" }
      }}>
      {children}
    </Box>
  );
};

export const EditIconEdited = () => (
  <IconContainer typeButton="editButton">
    <EditRounded color="primary" />
  </IconContainer>
);

export const EditRestoreRounded = () => (
  <IconContainer typeButton="restoreButton">
    <RestoreRounded color="secondary" />
  </IconContainer>
);

export const ImageIconEdited: React.FC<PropsIcon> = ({ size, colorLigth }) => (
  <IconContainer typeButton="editButton" size={size} colorLigth={colorLigth}>
    <ImageRounded color="primary" />
  </IconContainer>
);

export const EnterpriseIconEdited: React.FC<PropsIcon> = ({ size }) => (
  <IconContainer typeButton="editButton" size={size}>
    <MapsHomeWorkRounded color="primary" />
  </IconContainer>
);

export const ShippingIconEdited: React.FC<PropsIcon> = ({ size }) => (
  <IconContainer typeButton="shippingButton" size={size}>
    <LocalShippingRounded sx={{ fill: "#FFB53F" }} />
  </IconContainer>
);

export const DeleteIconEdited: React.FC<PropsIcon> = ({ size, colorLigth }) => (
  <IconContainer typeButton="deleteButton" size={size} colorLigth={colorLigth}>
    <DeleteRounded color="error" />
  </IconContainer>
);

export const ViewListIconEdited: React.FC<PropsIcon> = ({ size, colorLigth }) => (
  <IconContainer typeButton="viewListButton" size={size} colorLigth={colorLigth}>
    <ViewListRounded color="primary" />
  </IconContainer>
);

export const CheckListIconEdited: React.FC<PropsIcon> = ({ size, colorLigth }) => (
  <IconContainer typeButton="checkListButton" size={size} colorLigth={colorLigth}>
    <ChecklistRounded color="primary" />
  </IconContainer>
);

export const ChartButtonIconEdited: React.FC<PropsIcon> = ({ size, colorLigth }) => (
  <IconContainer typeButton="chartButton" size={size} colorLigth={colorLigth}>
    <BarChartRounded color="primary" />
  </IconContainer>
)
