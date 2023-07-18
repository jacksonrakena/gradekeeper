import { Box, Flex, TextProps } from "@chakra-ui/react";
import React, { InputHTMLAttributes, PropsWithChildren, useState } from "react";

export interface GkEditableProps extends PropsWithChildren {
  onSubmit?: (value?: string) => void;
  value: string;
  onBeginEdit?: (value: string) => void;
  onChange?: (value: string) => void;
  onCancelEdit?: (value: string) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  displayProps?: TextProps;
  icon?: React.ReactNode;
}

export const GkEditable = React.forwardRef<HTMLDivElement, GkEditableProps>((props: GkEditableProps, ref) => {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      // @ts-ignore
      <form
        {...props.inputProps}
        onSubmit={(e) => {
          e.preventDefault();
          setEditing(false);
          if (props.onSubmit) props.onSubmit(props.value);
        }}
        onBlur={(e) => {
          setEditing(false);
          if (props.onCancelEdit) props.onCancelEdit(props.value);
        }}
      >
        <input
          {...props.inputProps}
          onChange={(e) => {
            if (props.onChange) props.onChange(e.target.value);
          }}
          autoFocus
          style={{ display: "inline", whiteSpace: "nowrap" }}
          type={"text"}
          value={props.value}
        />
      </form>
    );
  }
  return (
    <Flex alignItems={"center"} {...props.displayProps}>
      <Box
        cursor={"pointer"}
        onClick={() => {
          setEditing(true);
          if (props.onBeginEdit) props.onBeginEdit(props.value);
        }}
        {...props.displayProps}
      >
        <Flex {...props.displayProps} alignItems={"center"} ref={ref}>
          {props.icon}
          {props.value}
        </Flex>
      </Box>
    </Flex>
  );
});
GkEditable.displayName = "GkEditable";