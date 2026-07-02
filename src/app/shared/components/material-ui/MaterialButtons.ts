/* eslint-disable unused-imports/no-unused-vars */

import { colors } from "@mui/material";
import {
  alpha,
} from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export const MaterialButtons = makeStyles((theme) => ({
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
  //Tickets, lo unico que cambia es que si el fondo es completamente negro, estos se adaptan para que se distinga entre los botones disabled
  orangeButton: {
    color: "white",
    backgroundColor: colors.orange[600],
    "&:hover": {
      backgroundColor: colors.orange[700]
    },
    "&:disabled": {
      color: "White",
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
}));

export const IconButtons = makeStyles((theme) => ({
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
    },
  }
}));
