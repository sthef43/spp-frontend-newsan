/* eslint-disable unused-imports/no-unused-vars */
import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps, accordionSummaryClasses } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Typography } from "@mui/material";

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    backgroundColor: "var(--secondary-color)",
    borderBottom: "1px solid #d4cdcd",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&::before": {
      display: "none"
    }
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: "transparent",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: "rotate(90deg)"
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  // padding: '0 5rem 1rem',
}));

interface Props {
  titleSlider: string;
  elementJSX: JSX.Element;
  nameSlider: string;
  expandend: string | false;
  setExpanded: (value: string | false) => void;
  setOpcionSlider?: (newValue: string) => void;
}

export const Sliders: React.FC<Props> = ({
  titleSlider,
  elementJSX,
  nameSlider,
  expandend,
  setExpanded,
  setOpcionSlider
}) => {
  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <Accordion
        expanded={expandend === nameSlider}
        onClick={() => {
          setOpcionSlider(nameSlider);
        }}
        onChange={handleChange(nameSlider)}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography component="span">{titleSlider}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{titleSlider != "" && <>{elementJSX}</>}</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
