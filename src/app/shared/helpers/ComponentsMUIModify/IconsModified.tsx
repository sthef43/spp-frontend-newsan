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

type ButtonType = "editButton" | "restoreButton" | "shippingButton" | "deleteButton" | "viewListButton" | "checkListButton" | "chartButton";

interface IColorPaletteEntry {
  light: { bg: string; radius: string };
  dark: { bg: string; radius: string };
}

type PaletteColors = Record<ButtonType, IColorPaletteEntry>;

const palleteColors: PaletteColors = {
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

interface IIconContainerProps {
  children: React.ReactNode;
  typeButton: ButtonType;
  size?: string;
  colorLight?: string;
}

interface IIconProps {
  size?: string;
  colorLight?: string;
}

const IconContainer = React.memo(function IconContainer({ children, typeButton, size, colorLight }: IIconContainerProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        display: "inline-flex",
        backgroundColor: isLight ? colorLight || palleteColors[typeButton].light.bg : palleteColors[typeButton].dark.bg,
        borderRadius: palleteColors[typeButton].light.radius,
        padding: "0.3rem",
        "& .MuiSvgIcon-root": { fontSize: size || "1.5rem" }
      }}>
      {children}
    </Box>
  );
});

IconContainer.displayName = "IconContainer";

type IconContainerPropsForExport = Omit<IIconContainerProps, "typeButton" | "children">;

export const EditIconEdited: React.FC<IconContainerPropsForExport> = ({ size, colorLight }) => (
  <IconContainer typeButton="editButton" size={size} colorLight={colorLight}>
    <EditRounded color="primary" />
  </IconContainer>
);

export const EditRestoreRounded: React.FC<IconContainerPropsForExport> = ({ size, colorLight }) => (
  <IconContainer typeButton="restoreButton" size={size} colorLight={colorLight}>
    <RestoreRounded color="secondary" />
  </IconContainer>
);

export const ImageIconEdited: React.FC<IIconProps> = ({ size, colorLight }) => (
  <IconContainer typeButton="editButton" size={size} colorLight={colorLight}>
    <ImageRounded color="primary" />
  </IconContainer>
);

export const EnterpriseIconEdited: React.FC<IIconProps> = ({ size, colorLight }) => (
  <IconContainer typeButton="editButton" size={size} colorLight={colorLight}>
    <MapsHomeWorkRounded color="primary" />
  </IconContainer>
);

export const ShippingIconEdited: React.FC<IIconProps> = ({ size, colorLight }) => (
  <IconContainer typeButton="shippingButton" size={size} colorLight={colorLight}>
    <LocalShippingRounded sx={{ fill: "#FFB53F" }} />
  </IconContainer>
);

export const DeleteIconEdited: React.FC<IIconProps> = ({ size, colorLight }) => (
  <IconContainer typeButton="deleteButton" size={size} colorLight={colorLight}>
    <DeleteRounded color="error" />
  </IconContainer>
);

export const ViewListIconEdited: React.FC<IIconProps> = ({ size, colorLight }) => (
  <IconContainer typeButton="viewListButton" size={size} colorLight={colorLight}>
    <ViewListRounded color="primary" />
  </IconContainer>
);

export const CheckListIconEdited: React.FC<IIconProps> = ({ size, colorLight }) => (
  <IconContainer typeButton="checkListButton" size={size} colorLight={colorLight}>
    <ChecklistRounded color="primary" />
  </IconContainer>
);

export const ChartButtonIconEdited: React.FC<IIconProps> = ({ size, colorLight }) => (
  <IconContainer typeButton="chartButton" size={size} colorLight={colorLight}>
    <BarChartRounded color="primary" />
  </IconContainer>
);
