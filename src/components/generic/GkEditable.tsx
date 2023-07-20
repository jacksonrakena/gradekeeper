import { Box, Spinner, TextProps } from "@chakra-ui/react";
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

export interface GkEditablePropsLoadable {
  onSubmit?: (value?: string) => Promise<void>;
  initialValue: string;
  formatter?: (value?: string) => string;
}

export const GkEditableLoadable = React.forwardRef<HTMLDivElement, GkEditablePropsLoadable>((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(props.initialValue);
  if (loading) {
    return <Spinner />;
  }
  if (editing) {
    return (
      <form
        style={{ display: "inline" }}
        onSubmit={(e) => {
          e.preventDefault();
          setEditing(false);
          setLoading(true);
          (async () => {
            if (props.onSubmit) {
              await props.onSubmit(value);
              setLoading(false);
            }
          })();
        }}
        onBlur={() => {
          setEditing(false);
          setValue(props.initialValue);
        }}
      >
        <input size={value.length} type={"text"} value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
      </form>
    );
  }
  return (
    <Box
      display={"inline"}
      cursor={"pointer"}
      onClick={() => {
        setEditing(true);
      }}
    >
      {(props.formatter ?? ((v) => v))(value)}
    </Box>
  );
});
