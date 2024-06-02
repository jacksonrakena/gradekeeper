import { preferenceColor } from "@/lib/colors";
import { routes, useApi } from "@/lib/net/fetch";
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
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { Decimal } from "decimal.js";
import { Field, FieldInputProps, FieldMetaProps, Form, Formik, FormikBag } from "formik";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useNavigate } from "react-router";
import { randomColor } from "../../../lib/logic/processing";
import { ProcessedUserState, useInvalidator } from "../../../lib/state/course";
import { CreateCourseComponentRow } from "./CreateCourseComponentRow";

export type ComponentDto = {
  id: string;
  weighting: Decimal;
  dropLowest: string;
  name: string;
  numberOfSubcomponents: string;
};

export const CreateCourse = (props: { block_id: string }) => {
  const { invalidate } = useInvalidator();
  const block_id = props.block_id;
  const blocks = useAtomValue(ProcessedUserState);
  const navigate = useNavigate();
  const api = useApi();
  const emptyComponents: Partial<ComponentDto>[] = [
    {
      id: randomColor(),
      dropLowest: "0",
      weighting: new Decimal(20),
      numberOfSubcomponents: "1",
    },
  ];
  const theme = useTheme();
  const [components, setComponents] = useState(emptyComponents);
  const componentsValid = components
    .map((e) => e.weighting)
    .reduce((a, b) => (a && b ? a?.add(b) : new Decimal(0)))
    ?.eq(100);
  const tablecolor = useColorModeValue("bg-gray-50", "");
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div>
      <Formik
        initialValues={{
          name: "",
          codeName: "",
          codeNo: "",
          color: randomColor(),
          components: [
            {
              id: randomColor(),
              dropLowest: 0,
              weighting: 0.2,
              numberOfSubcomponents: 1,
            },
          ],
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          const object = {
            ...values,
            components: components.map((c) => ({
              ...c,
              weighting: new Decimal(c.weighting ?? 100).div(100),
              dropLowest: Number.parseInt(c.dropLowest ?? "0"),
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
        {({ values, handleSubmit, isSubmitting }) => (
          <Form className="mt-4" onSubmit={handleSubmit}>
            <Stepper colorScheme={"brand"} index={tabIndex} orientation={"horizontal"}>
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
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl width={"auto"} isInvalid={form.errors.codeName && form.touched.codeName}>
                              <FormLabel htmlFor="name">Faculty code</FormLabel>
                              <Input
                                variant="filled"
                                htmlSize={8}
                                width="auto"
                                size="md"
                                placeholder="ENGR"
                                {...field}
                                id="codeName"
                                type="text"
                              />
                              <FormErrorMessage>{form.errors.codeName}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="codeNo">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl width={"auto"} isInvalid={form.errors.codeNo && form.touched.codeNo}>
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
                              <FormErrorMessage>{form.errors.codeNo}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>
                      <Field name="name">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel htmlFor="name">Course name</FormLabel>
                            <Input variant="filled" maxW="500px" placeholder="Engineering Design" {...field} id="name" type="text" />
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="color">
                        {({
                          field,
                          form,
                          meta,
                        }: {
                          field: FieldInputProps<string>;
                          form: FormikBag<string, any>;
                          meta: FieldMetaProps<string>;
                        }) => (
                          <FormControl>
                            <FormLabel htmlFor="color">Course color</FormLabel>
                            <HexColorPicker
                              color={field.value}
                              onChange={(e) => {
                                form.setFieldValue("color", e, true);
                              }}
                            />
                            {/*  <SwatchesPicker
                               color={field.value}
                               onChangeComplete={(e, event) => {
                                 form.setFieldValue("color", e.hex, true);
                               }}
                             /> */}
                          </FormControl>
                        )}
                      </Field>
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

                  <Button mt={4} colorScheme={"brand"} onClick={() => setTabIndex(1)}>
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
                    <div>
                      <TableContainer>
                        <Table variant={"unstyled"}>
                          <Thead>
                            <Tr className={tablecolor}>
                              <Th>Qty.</Th>
                              <Th>Name</Th>
                              <Th>Total Weighting</Th>
                              <Th>Drop lowest</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {components.map((comp) => (
                              <CreateCourseComponentRow
                                key={comp.id}
                                onDelete={() => {
                                  setComponents(components.filter((a) => a.id !== comp.id));
                                }}
                                original={comp}
                                onUpdate={(f) => {
                                  setComponents(
                                    components.map((ff) => {
                                      if (f.id === ff.id) return f;
                                      return ff;
                                    })
                                  );
                                }}
                              />
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <Button
                        colorScheme="blue"
                        aria-label="Add row"
                        size="sm"
                        onClick={() => {
                          setComponents([
                            ...components,
                            {
                              id: Math.random().toString(),
                              dropLowest: "0",
                              weighting: new Decimal(10),
                              numberOfSubcomponents: "1",
                            },
                          ]);
                        }}
                        leftIcon={<AddIcon />}
                      >
                        Add component
                      </Button>
                    </div>
                    {!componentsValid && (
                      <Box mt={6}>
                        <Alert status="error" flexDir={"column"} alignItems={"start"}>
                          <Flex>
                            <AlertIcon />
                            <AlertTitle>Syllabus must add up to 100%</AlertTitle>
                          </Flex>
                          <AlertDescription mt={4}>
                            The components you have added only account for{" "}
                            {components
                              .map((e) => e.weighting)
                              .reduce((a, b) => (a && b ? a?.add(b) : new Decimal(0)))
                              ?.toDecimalPlaces(2)
                              .toString()}
                            % of your course grade.
                          </AlertDescription>
                        </Alert>
                      </Box>
                    )}
                  </div>
                  <Button mt={4} colorScheme={"brand"} onClick={() => setTabIndex(2)} isDisabled={!componentsValid}>
                    Next
                  </Button>
                </TabPanel>
                <TabPanel>
                  <Text mb={4} color={"gray.600"}>
                    On the next screen, you&apos;ll be able to record your results so far.
                  </Text>

                  <Button type="submit" isLoading={isSubmitting} colorScheme="brand">
                    Create
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Form>
        )}
      </Formik>
    </div>
  );
};
