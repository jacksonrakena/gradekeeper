import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { Field } from "formik";
import { useMemo } from "react";
import { Pill } from "../../../components/generic/Pill";
import { singularMap } from "../../../lib/logic/processing";

export const CreateCourseComponentRow = (props: { idx: number; onDelete: () => void }) => {
  const componentNamePlaceholder = useMemo(() => Object.keys(singularMap)[Math.floor(Object.keys(singularMap).length * Math.random())], []);
  return (
    <Pill boxProps={{ _hover: {} }} key={props.idx}>
      <HStack>
        <Field name={`components.${props.idx}.numberOfSubcomponents`}>
          {({ field, form }: any) => (
            <NumberInput
              variant="flushed"
              w="50px"
              display={"flex"}
              alignItems={"center"}
              min={1}
              max={10}
              {...field}
              onChange={(vn) => form.setFieldValue(`components.${props.idx}.numberOfSubcomponents`, vn, true)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        </Field>
        <Text>x</Text>
        <Field name={`components.${props.idx}.name`}>
          {({ field, meta }: any) => (
            <FormControl width={"auto"} isInvalid={meta.error}>
              <Input type="text" variant="flushed" placeholder={componentNamePlaceholder} {...field} id="name" />
              <FormErrorMessage>{meta.error}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      </HStack>

      <Field name={`components.${props.idx}.weighting`}>
        {({ form, field, meta }: any) => (
          <Flex alignItems={"center"}>
            <Text mr={1}>{form.values.components[props.idx].numberOfSubcomponents === "1" ? "Weight" : "Total combined weight"}: %</Text>
            <FormControl width={"auto"} isInvalid={meta.error}>
              <NumberInput
                display={"inline"}
                variant="flushed"
                maxWidth={"80px"}
                keepWithinRange={false}
                clampValueOnBlur={false}
                min={1}
                max={100}
                {...field}
                onChange={(e) => {
                  form.setFieldValue(`components.${props.idx}.weighting`, e);
                }}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{meta.error}</FormErrorMessage>
            </FormControl>
          </Flex>
        )}
      </Field>

      <Field name={`components.${props.idx}.dropLowest`}>
        {({ form, field, meta }: any) => (
          <Flex alignItems={"center"}>
            <Text mr={2}>Drop lowest: </Text>
            <FormControl width={"auto"} isInvalid={meta.error}>
              <NumberInput
                display={"inline"}
                variant="flushed"
                maxWidth={"80px"}
                keepWithinRange={false}
                clampValueOnBlur={false}
                min={1}
                max={100}
                {...field}
                onChange={(e) => {
                  form.setFieldValue(`components.${props.idx}.dropLowest`, e);
                }}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{meta.error}</FormErrorMessage>
            </FormControl>
          </Flex>
        )}
      </Field>
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
