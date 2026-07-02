/* eslint-disable unused-imports/no-unused-vars */
import { Grow, List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { TransitionGroup } from "react-transition-group";

interface Props<T> {
  items: T[];
  textItem: (item: T) => React.ReactNode | string;
  keyId: (item: T) => string | number;
  secondaryAction?: (item: T) => React.ReactNode;
  onClickItem?: (item: T) => void;
}

export const ContainerForItems = <T,>({ items, textItem, secondaryAction, onClickItem, keyId }: Props<T>) => {
  return (
    <section className="w-full h-full bg-secondaryNew p-4 rounded-md shadow-md">
      <List
        sx={{
          width: "100%",
          maxHeight: "360px",
          overflowY: "auto",
          marginTop: "12px",
          padding: "0"
        }}>
        <TransitionGroup>
          {items.map((item) => {
            const labelId = `list-label-${keyId(item)}`;
            return (
              <Grow in={true} key={keyId(item)}>
                <ListItem
                  sx={{
                    backgroundColor: "var(--background-color)",
                    margin: "0rem 0 1rem",
                    borderRadius: "10px",
                    border: "1px solid rgb(209, 213, 219)",
                    padding: "1rem"
                  }}
                  secondaryAction={secondaryAction(item)}
                  onClick={() => onClickItem?.(item)}>
                  <ListItemText id={labelId} primary={textItem(item)} />
                </ListItem>
              </Grow>
            );
          })}
        </TransitionGroup>
      </List>
    </section>
  );
};
