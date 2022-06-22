import { EditIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import React, { InputHTMLAttributes, PropsWithChildren, useState } from "react";

export interface GkEditableProps extends PropsWithChildren {
  onSubmit?: (value: string) => void;
  value: string;
  onBeginEdit?: (value: string) => void;
  onChange?: (value: string) => void;
  onCancelEdit?: (value: string) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export const GkEditable = React.forwardRef<HTMLDivElement, GkEditableProps>((props: GkEditableProps, ref) => {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <form
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
    <Flex alignItems={"center"}>
      <Text
        cursor={"pointer"}
        onClick={() => {
          setEditing(true);
          if (props.onBeginEdit) props.onBeginEdit(props.value);
        }}
      >
        <Flex alignItems={"center"} ref={ref}>
          <EditIcon mr={1} />
          {props.value}
        </Flex>
      </Text>
    </Flex>
  );
});
