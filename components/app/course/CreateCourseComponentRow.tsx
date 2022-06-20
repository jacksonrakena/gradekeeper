import { DeleteIcon } from "@chakra-ui/icons";
import { Tr, Td, Input, NumberInput, NumberInputField, IconButton } from "@chakra-ui/react";
import { useMemo } from "react";
import { singularMap } from "../../../lib/logic";
import { ComponentDto } from "./CreateCourse";

export const CreateCourseComponentRow = (props: {
  original: Partial<ComponentDto>;
  onUpdate: (e: Partial<ComponentDto>) => void;
  onDelete: () => void;
}) => {
  const componentNamePlaceholder = useMemo(() => Object.keys(singularMap)[Math.floor(Object.keys(singularMap).length * Math.random())], []);
  return (
    <Tr key={props.original.id}>
      <Td className="p-2">
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
        <NumberInput
          variant="filled"
          onChange={(e, a) => {
            console.log(a);
            props.onUpdate({
              ...props.original,
              numberOfSubcomponents: e,
            });
          }}
          value={props.original.numberOfSubcomponents ?? 1}
          id="courseCodeName"
          placeholder="2"
          min={1}
        >
          <NumberInputField />
        </NumberInput>
      </Td>
      <Td className="p-2">
        %
        <input
          type="number"
          onChange={(e) => {
            props.onUpdate({
              ...props.original,
              weighting: e.target.valueAsNumber / 100,
            });
          }}
          value={(props.original.weighting ?? 0.2) * 100}
          id="courseCodeName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
          placeholder="2"
          required={true}
        />
      </Td>
      <Td className="p-2">
        <input
          type="number"
          onChange={(e) => {
            props.onUpdate({
              ...props.original,
              dropLowest: Number.parseInt(e.target.value),
            });
          }}
          value={props.original.dropLowest ?? 0}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
          placeholder="0"
          required={true}
        />
      </Td>
      <Td className="p-2">
        <IconButton
          colorScheme="teal"
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
