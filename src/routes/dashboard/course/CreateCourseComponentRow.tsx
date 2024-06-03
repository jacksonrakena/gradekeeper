import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { Pill } from "../../../components/generic/Pill";
import { singularMap } from "../../../lib/logic/processing";
import { ComponentDto } from "./CreateCourse";

export const CreateCourseComponentRow = (props: {
  original: Partial<ComponentDto>;
  onUpdate: (e: Partial<ComponentDto>) => void;
  onDelete: () => void;
}) => {
  const componentNamePlaceholder = useMemo(() => Object.keys(singularMap)[Math.floor(Object.keys(singularMap).length * Math.random())], []);
  return (
    <Pill boxProps={{ _hover: {} }} key={props.original.id}>
      <HStack>
        <NumberInput
          variant="flushed"
          onChange={(e, a) => {
            props.onUpdate({
              ...props.original,
              numberOfSubcomponents: e,
            });
          }}
          value={props.original.numberOfSubcomponents ?? 1}
          id="courseCodeName"
          //placeholder="2"
          min={1}
          max={10}
          w="50px"
          display={"flex"}
          alignItems={"center"}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text>x</Text>
        <Input
          type="text"
          variant="flushed"
          onChange={(e) => {
            props.onUpdate({ ...props.original, name: e.target.value });
          }}
          value={props.original.name ?? ""}
          id="courseCodeName"
          placeholder={componentNamePlaceholder}
          required={true}
        />
      </HStack>

      <Box>
        <Flex alignItems={"center"}>
          <Text mr={1}>{props.original.numberOfSubcomponents === "1" ? "Weight" : "Total combined weight"}: %</Text>
          <NumberInput
            display={"inline"}
            variant="flushed"
            onChange={(e) => {
              props.onUpdate({
                ...props.original,
                weighting: e,
              });
            }}
            maxWidth={"80px"}
            value={props.original.weighting}
            id="courseCodeName"
            keepWithinRange={false}
            clampValueOnBlur={false}
            min={1}
            max={100}
          >
            <NumberInputField />
          </NumberInput>
        </Flex>
      </Box>

      <Flex alignItems={"center"}>
        Drop lowest:{" "}
        <NumberInput
          display={"inline"}
          ml={2}
          variant="flushed"
          onChange={(e) => {
            props.onUpdate({
              ...props.original,
              dropLowest: e,
            });
          }}
          value={props.original.dropLowest}
          id="courseCodeName"
          maxW={"80px"}
          //placeholder="0"
          min={0}
        >
          <NumberInputField />
        </NumberInput>
      </Flex>
      <Box className="p-2">
        <IconButton
          colorScheme="brand"
          aria-label="Delete row"
          icon={<DeleteIcon />}
          onClick={() => {
            props.onDelete();
          }}
        />
      </Box>
    </Pill>
  );
};
