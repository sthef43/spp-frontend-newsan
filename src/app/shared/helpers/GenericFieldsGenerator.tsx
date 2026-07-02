import { DatePicker } from "@mui/x-date-pickers";
import {
  Autocomplete,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField
} from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { Controller } from "react-hook-form";

const MakeATextField = (props: any) => {
  return props.selectFields?.[props.label]?.type == "RadioGroup" ? (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={false}
      render={({ field, fieldState }) => (
        <FormGroup sx={props.styleFieldSX ?? props.styleFieldSX}>
          <FormLabel component="legend">{props.label}</FormLabel>
          <RadioGroup row {...field}>
            {props.selectFields?.[props.label]?.array?.map((x) => (
              <FormControlLabel
                key={x[props.selectFields[props.label].id]}
                value={x[props.selectFields[props.label].id]}
                control={<Radio />}
                label={x[props.selectFields[props.label].column]}
              />
            ))}
          </RadioGroup>
        </FormGroup>
      )}
    />
  ) : props.selectFields?.[props.label]?.type == "Autocomplete" &&
    props.selectFields?.[props.label]?.array?.length > 0 ? (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={props.selectFields?.[props.label] ? 1 : ""}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          value={props.selectFields?.[props.label]?.array?.find(
            (x) => x[props.selectFields[props.label].id] == field.value
          )}
          disabled={props.disabled}
          placeholder={props.label}
          sx={props.styleFieldSX ?? props.styleFieldSX}
          options={props.selectFields?.[props.label]?.array}
          getOptionLabel={(option) => {
            return option[props.selectFields?.[props.label]?.column];
          }}
          onChange={(e, newvalue: any) => {
            if (newvalue) field.onChange(newvalue[props.selectFields?.[props.label]?.id]);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={error?.message}
              variant={props.variant || "outlined"}
              fullWidth
              label={props.label}
            />
          )}
        />
      )}
    />
  ) : (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={props.selectFields?.[props.label] ? 1 : ""}
      render={({ field, fieldState: { error } }) => (
        <TextField
          //style={{display:"flex", flexDirection:"column"}}
          //className="flex flex-col"
          {...field}
          disabled={props.disabled}
          variant={props.variant || "outlined"}
          placeholder={props.label}
          label={props.label}
          error={!!error}
          sx={props.styleFieldSX ?? props.styleFieldSX}
          type={props.type || "text"}
          helperText={error?.message}
          multiline={true}
          select={!!props.selectFields?.[props.label]}>
          {props.selectFields?.[props.label]?.array?.map((x) => (
            <MenuItem key={x[props.selectFields[props.label].id]} value={x[props.selectFields[props.label].id]}>
              <div>{x[props.selectFields[props.label].column]}</div>
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};
const MakeADateField = (props: any) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={false}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          renderInput={(params) => (
            <TextField
              {...params}
              variant={props.variant || "outlined"}
              disabled={props.disabled}
              label={props.label}
              error={!!error}
              helperText={error?.message}
              sx={props.styleFieldSX ?? props.styleFieldSX}
            />
          )}
        />
      )}
    />
  );
};
const MakeASwitchField = (props: any) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={false}
      render={({ field, fieldState }) => (
        <FormGroup sx={props.styleFieldSX ?? props.styleFieldSX}>
          <FormLabel component="legend">{props.label}</FormLabel>
          <RadioGroup row {...field}>
            {props.selectFields?.[props.label]?.type == "RadioGroup" ? (
              props.selectFields?.[props.label]?.array?.map((x) => (
                <FormControlLabel
                  key={x[props.selectFields[props.label].id]}
                  value={x[props.selectFields[props.label].id]}
                  control={<Radio />}
                  label={x[props.selectFields[props.label].column]}
                  disabled={props.disabled}
                />
              ))
            ) : (
              <>
                <FormControlLabel value={true} control={<Radio />} label="SI" disabled={props.disabled} />
                <FormControlLabel value={false} control={<Radio />} label="NO" disabled={props.disabled} />
              </>
            )}
          </RadioGroup>
        </FormGroup>
      )}
    />
  );
};
export const WhatKindOfField = (props: any) => {
  switch (typeof props.keyOfField) {
    case "string":
      return (
        <div className={props.styleDiv ?? props.styleDiv}>
          {moment(props.keyOfField, moment.ISO_8601, true).isValid() ? (
            <MakeADateField {...props} />
          ) : (
            <MakeATextField {...props} />
          )}
        </div>
      );
    case "number":
      return (
        <div className={props.styleDiv ?? props.styleDiv}>
          <MakeATextField {...props} type={"number"} />
        </div>
      );
    case "boolean":
      return (
        <div className={props.styleDiv ?? props.styleDiv}>
          <MakeASwitchField {...props} />
        </div>
      );
    case "object":
      return props?.divObject?.div ? (
        <div className={props?.divObject?.div ? props.divObject.div : ""}>
          {_.get(props.titleOfObject, props.name)?.title && (
            <div className={props.divObject?.title}> {_.get(props.titleOfObject, props.name)?.title}</div>
          )}
          {Object.keys(props.label).map((keyEl) => {
            return (
              <WhatKindOfField
                {...props}
                key={keyEl}
                keyOfField={props.keyOfField[keyEl]}
                label={props.label[keyEl]}
                name={`${props.name}.${keyEl}`}
                control={props.control}
              />
            );
          })}
        </div>
      ) : (
        <>
          {props.keyOfField !== null &&
            props.keyOfField !== undefined &&
            Object.keys(props.label).map((keyEl) => {
              return (
                <WhatKindOfField
                  {...props}
                  key={keyEl}
                  keyOfField={props.keyOfField[keyEl]}
                  label={props.label[keyEl]}
                  name={`${props.name}.${keyEl}`}
                  control={props.control}
                />
              );
            })}
        </>
      );

    default:
      return <div></div>;
  }
};
interface needed {
  disabled?: boolean;
  values: any;
  control: any;
  labels: any;
  divObject?: { title: string; div: string };
  styleDiv?: string;
  titleOfObject?: any;
  styleFieldSX?: SxProps<Theme>;
  selectFields?: any;
  variant?: "filled" | "outlined" | "standard";
}
/**
 * Generico
 *
 */

export const GenericFieldsGenerator = (props: needed) => {
  const { values, control, labels, styleFieldSX, styleDiv, selectFields, variant, divObject, titleOfObject, disabled } =
    props;

  return (
    <React.Fragment>
      {Object.keys(labels).map(
        (keyEl) =>
          labels[keyEl] != "hidden" && (
            <WhatKindOfField
              key={keyEl}
              keyOfField={values[keyEl]}
              label={labels[keyEl]}
              styleFieldSX={styleFieldSX}
              styleDiv={styleDiv}
              name={keyEl}
              control={control}
              selectFields={selectFields}
              divObject={divObject}
              titleOfObject={titleOfObject}
              variant={variant}
              disabled={disabled}
            />
          )
      )}
    </React.Fragment>
  );
};
