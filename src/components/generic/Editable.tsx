import { Box, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";

export interface EditableProps {
  onSubmit?: (value?: string) => Promise<void>;
  initialValue: string;
  formatter?: (value?: string) => string;
}

export const Editable = React.forwardRef<HTMLDivElement, EditableProps>((props, ref) => {
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
      ref={ref}
    >
      {(props.formatter ?? ((v) => v))(value)}
    </Box>
  );
});
