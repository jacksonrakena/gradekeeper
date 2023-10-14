import { routes, useApi } from "@/lib/net/fetch";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Decimal } from "decimal.js";
import { Field, FieldInputProps, FieldMetaProps, Form, Formik, FormikBag } from "formik";
import { useState } from "react";
import { SwatchesPicker } from "react-color";
import { useNavigate } from "react-router";
import { randomColor } from "../../../lib/logic/processing";
import { useInvalidator } from "../../../lib/state/course";
import { CreateCourseComponentRow } from "./CreateCourseComponentRow";

export type ComponentDto = {
  id: string;
  weighting: Decimal;
  dropLowest: string;
  name: string;
  numberOfSubcomponents: string;
};

interface CreateCourseFormValues {
  name: string;
  codeName: string;
  codeNo: string;
  color: string;
  components: ComponentDto;
}

export const CreateCourse = (props: { block_id: string }) => {
  const { invalidate } = useInvalidator();
  const block_id = props.block_id;
  const toast = useToast();
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
  const [components, setComponents] = useState(emptyComponents);
  const tablecolor = useColorModeValue("bg-gray-50", "");
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <div>
      <div>Let&apos;s make a new course.</div>

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
            name: values.name,
            codeName: values.codeName,
            codeNo: values.codeNo,
            color: values.color,
            components: components.map((c) => {
              return {
                ...c,
                weighting: new Decimal(c.weighting ?? 100).div(100),
                dropLowest: Number.parseInt(c.dropLowest ?? "0"),
              };
            }),
          };
          api.post<{ id: string }>(routes.block(block_id).createCourse(), object).then(async (f) => {
            if (f) {
              invalidate().then(() => {
                setSubmitting(false);
                navigate(`/blocks/${block_id}/courses/${f.id}`);
              });
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
                  <HStack justifyItems={""} wrap={"wrap"}>
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
                    <Field name="name">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl width={"auto"} isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel htmlFor="name">Course name</FormLabel>
                          <Input
                            variant="filled"
                            htmlSize={16}
                            width="auto"
                            size="md"
                            placeholder="Engineering Design"
                            {...field}
                            id="name"
                            type="text"
                          />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </HStack>

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
                        <SwatchesPicker
                          color={field.value}
                          onChangeComplete={(e, event) => {
                            form.setFieldValue("color", e.hex, true);
                          }}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Button mt={4} colorScheme={"brand"} onClick={() => setTabIndex(1)}>
                    Next
                  </Button>
                </TabPanel>
                <TabPanel>
                  <div style={{ maxWidth: "95%" }}>
                    <div className="mb-2 text-xl font-semibold">Syllabus components</div>
                    <div className="text-sm mb-4">
                      Components are pieces of work that contribute to your grade. <br />
                      For example, assignments and tests are components. <br />
                      <br />
                      Each component can have subcomponents, for example Test 1. <br />
                    </div>
                    <div>
                      <TableContainer>
                        <Table>
                          <Thead>
                            <Tr className={tablecolor}>
                              <Th className="">Qty.</Th>
                              <Th className="">Name</Th>
                              <Th className="">Total Weighting</Th>
                              <Th className="">Drop lowest</Th>
                              <Th className=""></Th>
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
                            <Tr key="add">
                              <Td>
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
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                  <Button mt={4} colorScheme={"brand"} onClick={() => setTabIndex(2)}>
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
