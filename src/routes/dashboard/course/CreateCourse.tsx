import { preferenceColor } from "@/lib/colors";
import { randomColor } from "@/lib/logic/processing";
import { routes, useApi } from "@/lib/net/fetch";
import { isPossibleDecimal } from "@/lib/util";
import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import { Decimal } from "decimal.js";
import { FastField, FastFieldProps, Field, FieldArray, FieldProps, Form, Formik } from "formik";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { ProcessedUserState, useInvalidator } from "../../../lib/state/course";
import { CreateCourseComponentRow } from "./CreateCourseComponentRow";

const ComponentSchema = Yup.object().shape({
  name: Yup.string().min(1).max(100).required("Required"),
  dropLowest: Yup.number().min(0).max(100).required("Required"),
  numberOfSubcomponents: Yup.number().min(1).max(100).required("Required"),
  weighting: Yup.number().min(0.5).max(100).required("Required"),
});
export type ComponentSchemaType = Yup.InferType<typeof ComponentSchema>;

const CreateCourseSchema = Yup.object().shape({
  name: Yup.string().min(1).max(100).required("Required"),
  codeName: Yup.string().min(1).max(50).required("Required"),
  codeNo: Yup.string().max(50).required("Required"),
  components: Yup.array(ComponentSchema)
    .min(1)
    .max(100)
    .test("not-complete", "Syllabus must add up to 100%", (components) => {
      return (
        components &&
        components
          .map((e) => (isPossibleDecimal(e.weighting) ? new Decimal(e.weighting!) : new Decimal(0)))
          .reduce((a, b) => (a && b ? a?.add(b) : new Decimal(0)), new Decimal(0))
          .eq(100)
      );
    })
    .required(),
  color: Yup.string().required(),
});

const fieldsByPage = [["name", "codeName", "codeNo", "color"], ["components"], []];

export const CreateCourse = (props: { block_id: string }) => {
  const { invalidate } = useInvalidator();
  const block_id = props.block_id;
  const blocks = useAtomValue(ProcessedUserState);
  const navigate = useNavigate();
  const api = useApi();
  const stepperOrientation = useBreakpointValue<"vertical" | "horizontal">({ base: "vertical", md: "horizontal" });
  const theme = useTheme();

  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Formik
      validationSchema={CreateCourseSchema}
      initialValues={CreateCourseSchema.cast({ components: [], color: randomColor(), codeName: "", name: "", codeNo: "" })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        const object = {
          ...values,
          components: values.components.map((c) => ({
            ...c,
            weighting: new Decimal(c.weighting).div(100),
            dropLowest: Number.parseInt(c.dropLowest.toString()),
          })),
        };

        api.post<{ id: string }>(routes.block(block_id).createCourse(), object).then(async (f) => {
          if (f) {
            invalidate().then(() => {
              setSubmitting(false);
              navigate(`/blocks/${block_id}/courses/${f.id}`);
            });
          } else {
            setSubmitting(false);
          }
        });
      }}
    >
      {({ values, errors, handleSubmit, isSubmitting }) => (
        <Form className="mt-4" onSubmit={handleSubmit}>
          <Stepper colorScheme={"brand"} index={tabIndex} orientation={stepperOrientation}>
            {[
              {
                name: "Course information",
                description: "Name and course code",
              },
              {
                name: "Syllabus components",
                description: "Tests, assignments, labs",
              },
              {
                name: "Confirm",
                description: "",
              },
            ].map((step, index) => (
              <Step onClick={() => setTabIndex(index)} key={index}>
                <StepIndicator>
                  <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>{step.name}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" colorScheme="theme">
            <TabPanels>
              <TabPanel>
                <VStack alignItems={"start"}>
                  <VStack width="100%" spacing={6} alignItems={"start"}>
                    <HStack spacing={4}>
                      <Field name="codeName">
                        {({ field, form, meta }: FieldProps<any>) => (
                          <FormControl width={"auto"} isInvalid={!!meta.error}>
                            <FormLabel htmlFor="name">Faculty code</FormLabel>
                            <Input variant="filled" htmlSize={8} width="auto" size="md" placeholder="ENGR" type="text" {...field} />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="codeNo">
                        {({ field, form, meta }: FieldProps<any>) => (
                          <FormControl width={"auto"} isInvalid={!!meta.error}>
                            <FormLabel htmlFor="codeNo">Course number</FormLabel>
                            <Input
                              variant="filled"
                              htmlSize={8}
                              width="auto"
                              size="md"
                              placeholder="101"
                              {...field}
                              id="codeNo"
                              type="text"
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </HStack>
                    <Field name="name">
                      {({ field, form, meta }: FieldProps<any>) => (
                        <FormControl isInvalid={!!meta.error}>
                          <FormLabel htmlFor="name">Course name</FormLabel>
                          <Input variant="filled" maxW="500px" placeholder="Engineering Design" type="text" {...field} />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <FastField name="color">
                      {({ field, form, meta }: FastFieldProps<any>) => (
                        <FormControl>
                          <FormLabel htmlFor="color">Course color</FormLabel>
                          <HexColorPicker
                            color={field.value}
                            onChange={(e) => {
                              form.setFieldValue("color", e, false);
                            }}
                          />
                        </FormControl>
                      )}
                    </FastField>
                    <Heading size="md">Preview</Heading>
                    <Box
                      bgColor={values.color}
                      color={preferenceColor(values.color, theme.colors.brand["900"], theme.colors.brand["100"])}
                      p={4}
                      w="100%"
                    >
                      <VStack alignItems={"start"}>
                        <HStack>
                          <Text fontWeight={"semibold"} display={"inline"} mr={2}>
                            {values.codeName} {values.codeNo}
                          </Text>
                          <Text display={"inline"}> {values.name}</Text>
                        </HStack>
                        <Text>{blocks?.studyBlocks.filter((e) => e.id === block_id)[0].name}</Text>
                      </VStack>
                    </Box>
                  </VStack>
                </VStack>
                <Button
                  isDisabled={Object.keys(errors).filter((e) => fieldsByPage[tabIndex].includes(e)).length > 0}
                  mt={4}
                  colorScheme={"brand"}
                  onClick={() => setTabIndex(1)}
                >
                  Next
                </Button>
              </TabPanel>
              <TabPanel>
                <div>
                  <Box className="mb-2 text-xl font-semibold">Syllabus components</Box>
                  <div className="text-sm mb-4">
                    Components are pieces of work that contribute to your grade. <br />
                    For example, assignments and tests are components. <br />
                    <br />
                    For example &mdash; if you have 3 assignments, worth 10% each, add a component called 'Assignments', set qty to 3, and
                    'total weighting' to 30%.
                  </div>
                  <Box>
                    <FieldArray
                      name="components"
                      render={(arrayHelpers) => {
                        return (
                          <Box>
                            {values.components &&
                              values.components.map((_, i) => <CreateCourseComponentRow onDelete={() => arrayHelpers.remove(i)} idx={i} />)}
                            <Button
                              colorScheme="blue"
                              aria-label="Add row"
                              size="sm"
                              onClick={() =>
                                arrayHelpers.push({
                                  id: Math.random().toString(),
                                  dropLowest: "0",
                                  weighting: "10",
                                  numberOfSubcomponents: "1",
                                })
                              }
                              leftIcon={<AddIcon />}
                            >
                              Add component
                            </Button>
                          </Box>
                        );
                      }}
                    />
                  </Box>
                  {!values.components
                    .map((e) => (isPossibleDecimal(e.weighting) ? new Decimal(e.weighting!) : new Decimal(0)))
                    .reduce((a, b) => (a && b ? a?.add(b) : new Decimal(0)), new Decimal(0))
                    .eq(100) && (
                    <Box mt={6}>
                      <Alert status="error" flexDir={"column"} alignItems={"start"}>
                        <Flex>
                          <AlertIcon />
                          <AlertTitle>Syllabus must add up to 100%</AlertTitle>
                        </Flex>
                        <AlertDescription mt={4}>
                          The components you have added only account for{" "}
                          {values.components
                            .map((e) => (isPossibleDecimal(e.weighting) ? new Decimal(e.weighting!) : new Decimal(0)))
                            .reduce((a, b) => (a && b ? a?.add(b) : new Decimal(0)), new Decimal(0))
                            .toDecimalPlaces(2)
                            .toString()}
                          % of your course grade.
                        </AlertDescription>
                      </Alert>
                    </Box>
                  )}
                </div>
                <Button
                  isDisabled={Object.keys(errors).filter((e) => fieldsByPage[tabIndex].includes(e)).length > 0}
                  mt={4}
                  colorScheme={"brand"}
                  onClick={() => setTabIndex(2)}
                >
                  Next
                </Button>
              </TabPanel>
              <TabPanel>
                <Text mb={4} color={"gray.600"}>
                  On the next screen, you&apos;ll be able to record your results so far.
                </Text>

                <Button isDisabled={Object.keys(errors).length > 0} type="submit" isLoading={isSubmitting} colorScheme="brand">
                  Create
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Form>
      )}
    </Formik>
  );
};
