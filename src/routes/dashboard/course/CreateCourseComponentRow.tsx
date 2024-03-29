import { DeleteIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Td,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { singularMap } from "../../../lib/logic/processing";
import { ComponentDto } from "./CreateCourse";

export const CreateCourseComponentRow = (props: {
  original: Partial<ComponentDto>;
  onUpdate: (e: Partial<ComponentDto>) => void;
  onDelete: () => void;
}) => {
  const componentNamePlaceholder = useMemo(() => Object.keys(singularMap)[Math.floor(Object.keys(singularMap).length * Math.random())], []);
  return (
    <Tr key={props.original.id}>
      <Td>
        <NumberInput
          variant="outline"
          onChange={(e, a) => {
            props.onUpdate({
              ...props.original,
              numberOfSubcomponents: e,
            });
          }}
          value={props.original.numberOfSubcomponents ?? 1}
          id="courseCodeName"
          placeholder="2"
          width={"70px"}
          min={1}
          max={10}
          display={"flex"}
          alignItems={"center"}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Td>
      <Td className="">
        <Input
          type="text"
          variant="filled"
          onChange={(e) => {
            props.onUpdate({ ...props.original, name: e.target.value });
          }}
          value={props.original.name ?? ""}
          id="courseCodeName"
          minW={"150px"}
          placeholder={componentNamePlaceholder}
          required={true}
        />
      </Td>

      <Td className="p-2">
        %
        <NumberInput
          display={"inline"}
          variant="filled"
          onChange={(e) => {
            props.onUpdate({
              ...props.original,
              weighting: e,
            });
          }}
          value={props.original.weighting}
          id="courseCodeName"
          placeholder="2"
          min={1}
        >
          <NumberInputField />
        </NumberInput>
      </Td>
      <Td className="p-2">
        <NumberInput
          display={"inline"}
          variant="filled"
          onChange={(e) => {
            props.onUpdate({
              ...props.original,
              dropLowest: e,
            });
          }}
          value={props.original.dropLowest}
          id="courseCodeName"
          placeholder="0"
          min={0}
        >
          <NumberInputField />
        </NumberInput>
      </Td>
      <Td className="p-2">
        <IconButton
          colorScheme="brand"
          aria-label="Delete row"
          icon={<DeleteIcon />}
          onClick={() => {
            props.onDelete();
          }}
        />
      </Td>
    </Tr>
  );
};
