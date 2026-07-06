/* eslint-disable unused-imports/no-unused-vars */
import { colors } from "@mui/material";
import { alpha } from "@mui/material/styles";

const buttonStyles = {
  purpleButton: {
    color: "white",
    backgroundColor: colors.purple[500],
    "&:hover": {
      backgroundColor: colors.purple[700]
    },
    "&:disabled": {
      color: alpha(colors.grey[900], 1),
      backgroundColor: alpha(colors.grey[600], 0.12)
    }
  },
  greenButton: {
    color: "white",
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[700]
    },
    "&:disabled": {
      color: alpha(colors.grey[900], 1),
      backgroundColor: alpha(colors.grey[600], 0.12)
    }
  },
  yellowButton: {
    color: "white",
    backgroundColor: colors.yellow[600],
    "&:hover": {
      backgroundColor: colors.yellow[700]
    },
    "&:disabled": {
      color: alpha(colors.grey[900], 1),
      backgroundColor: alpha(colors.grey[600], 0.12)
    }
  },
  blueButton: {
    color: "white",
    backgroundColor: colors.blue[700],
    "&:hover": {
      backgroundColor: colors.blue[800]
    },
    "&:disabled": {
      color: alpha(colors.grey[900], 1),
      backgroundColor: alpha(colors.grey[600], 0.12)
    }
  },
  redButton: {
    color: "white",
    backgroundColor: colors.red[600],
    "&:hover": {
      backgroundColor: colors.red[700]
    },
    "&:disabled": {
      color: alpha(colors.grey[900], 1),
      backgroundColor: alpha(colors.grey[600], 0.12)
    }
  },
  orangeButton: {
    color: "white",
    backgroundColor: colors.orange[600],
    "&:hover": {
      backgroundColor: colors.orange[700]
    },
    "&:disabled": {
      color: "white",
      backgroundColor: alpha(colors.grey[500], 0.12)
    }
  },
  blueButtonTickets: {
    color: "white",
    backgroundColor: colors.blue[600],
    "&:hover": {
      backgroundColor: colors.blue[700]
    },
    "&:disabled": {
      color: "white",
      backgroundColor: alpha(colors.grey[500], 0.12)
    }
  },
  greenButtonTickets: {
    color: "white",
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[700]
    },
    "&:disabled": {
      color: "white",
      backgroundColor: alpha(colors.grey[500], 0.12)
    }
  },
  purpleButtonTickets: {
    color: "white",
    backgroundColor: colors.purple[600],
    "&:hover": {
      backgroundColor: colors.purple[700]
    },
    "&:disabled": {
      color: "white",
      backgroundColor: alpha(colors.grey[500], 0.12)
    }
  }
};

const iconStyles = {
  purpleIcon: {
    color: colors.purple[500],
    "&:hover": {
      backgroundColor: alpha(colors.purple[500], 0.1)
    },
    "&:disabled": {
      backgroundColor: alpha(colors.grey[900], 0.12)
    }
  },
  greenIcon: {
    color: colors.green[600],
    "&:hover": {
      backgroundColor: alpha(colors.green[600], 0.1)
    }
  },
  yellowIcon: {
    color: colors.yellow[500],
    "&:hover": {
      backgroundColor: alpha(colors.yellow[500], 0.1)
    }
  }
};

function styleObjectToCss(selector: string, styles: any): string {
  let css = `${selector} {`;
  const nestedRules: string[] = [];

  for (const [key, value] of Object.entries(styles)) {
    if (typeof value === "object" && value !== null) {
      const nestedParts = key
        .split(",")
        .map((part) => {
          let p = part.replace(/&/g, selector);
          if (p.includes(":disabled")) {
            p = `${p}, ${p.replace(":disabled", ".Mui-disabled")}`;
          }
          return p;
        })
        .join(",");
      nestedRules.push(styleObjectToCss(nestedParts, value));
    } else {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      css += `${cssKey}: ${value}; `;
    }
  }

  css += "}";
  return css + "\n" + nestedRules.join("\n");
}

let isStylesInjected = false;

function injectStyles() {
  if (isStylesInjected || typeof document === "undefined") return;

  let cssString = "";

  for (const [className, styles] of Object.entries(buttonStyles)) {
    cssString += styleObjectToCss(`.mui-btn-${className}`, styles) + "\n";
  }

  for (const [className, styles] of Object.entries(iconStyles)) {
    cssString += styleObjectToCss(`.mui-icon-${className}`, styles) + "\n";
  }

  const styleTag = document.createElement("style");
  styleTag.setAttribute("data-mui-buttons", "true");
  styleTag.innerHTML = cssString;
  document.head.appendChild(styleTag);

  isStylesInjected = true;
}

export const MaterialButtons = () => {
  injectStyles();
  return {
    purpleButton: "mui-btn-purpleButton",
    greenButton: "mui-btn-greenButton",
    yellowButton: "mui-btn-yellowButton",
    blueButton: "mui-btn-blueButton",
    redButton: "mui-btn-redButton",
    orangeButton: "mui-btn-orangeButton",
    blueButtonTickets: "mui-btn-blueButtonTickets",
    greenButtonTickets: "mui-btn-greenButtonTickets",
    purpleButtonTickets: "mui-btn-purpleButtonTickets"
  };
};

export const IconButtons = () => {
  injectStyles();
  return {
    purpleIcon: "mui-icon-purpleIcon",
    greenIcon: "mui-icon-greenIcon",
    yellowIcon: "mui-icon-yellowIcon"
  };
};
