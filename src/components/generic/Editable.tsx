import { Box, BoxProps, Spinner, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export interface EditableProps {
  onSubmit?: (value?: string) => Promise<void>;
  backingValue: string;
  formatter?: (value?: string) => string;
  displayProps?: Partial<BoxProps>;
}

export const Editable = React.forwardRef<HTMLDivElement, EditableProps>((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(props.backingValue);
  useEffect(() => {
    setValue(props.backingValue);
  }, [props.backingValue]);
  const textForeground = useColorModeValue("black", "white");
  if (loading) {
    return <Spinner />;
  }
  if (editing) {
    return (
      <form
        style={{ display: "inline", color: textForeground }}
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
          setValue(props.backingValue);
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
      ref={ref}
      {...props.displayProps}
    >
      {(props.formatter ?? ((v) => v))(value)}
    </Box>
  );
});
