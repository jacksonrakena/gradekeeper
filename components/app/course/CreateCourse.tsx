import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Field, FieldInputProps, FieldMetaProps, Form, Formik, FormikBag } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { SliderPicker } from "react-color";
import { randomColor } from "../../../lib/logic";
import { useUserContext } from "../../../UserContext";
import { CreateCourseComponentRow } from "./CreateCourseComponentRow";

export type ComponentDto = {
  id: string;
  weighting: number;
  dropLowest: number;
  name: string;
  numberOfSubcomponents: string;
};

export const CreateCourse = (props: { block_id: string }) => {
  const block_id = props.block_id;
  const router = useRouter();
  const emptyComponents: Partial<ComponentDto>[] = [
    {
      id: randomColor(),
      dropLowest: 0,
      weighting: 0.2,
      numberOfSubcomponents: 1,
    },
  ];
  const [components, setComponents] = useState(emptyComponents);
  const userContext = useUserContext();
  const studyBlock = userContext.user?.studyBlocks.filter((d) => d.id === block_id?.toString())[0];
  const tablecolor = useColorModeValue("bg-gray-50", "");
  const [tabIndex, setTabIndex] = useState(0);
  if (!userContext.user) return <div>Loading</div>;
  return (
    <div>
      <div>Currently, Gradekeeper only supports the grade boundaries at Victoria University of Wellington.</div>

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
          fetch(`/api/block/${block_id}/course/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: values.name,
              codeName: values.codeName,
              codeNo: values.codeNo,
              color: values.color,
              components: components,
            }),
          })
            .then((e) => e.json())
            .then((f) => {
              userContext.redownload().then(() => {
                setSubmitting(false);
                router.push(`/blocks/${block_id}/courses/${f.id}`);
              });
            });
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form className="mt-4" onSubmit={handleSubmit}>
            <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed">
              <TabList>
                <Tab>1. Information</Tab>
                <Tab>2. Components</Tab>
                <Tab>3. Create</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <Field name="codeName">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl isInvalid={form.errors.codeName && form.touched.codeName}>
                          <FormLabel htmlFor="name">Course code name</FormLabel>
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
                        <FormControl isInvalid={form.errors.codeNo && form.touched.codeNo}>
                          <FormLabel htmlFor="codeNo">Course code number</FormLabel>
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
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel htmlFor="name">Course code name</FormLabel>
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
                          <SliderPicker
                            color={field.value}
                            onChangeComplete={(e, event) => {
                              form.setFieldValue("color", e.hex, true);
                            }}
                          />
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Button mt={4} colorScheme={"teal"} onClick={() => setTabIndex(1)}>
                    Next
                  </Button>
                </TabPanel>
                <TabPanel>
                  <div style={{ maxWidth: "95%" }}>
                    <div className="mb-2 text-xl font-semibold">Components</div>
                    <div className="text-sm mb-4">
                      Components are pieces of work that contribute to your grade. <br />
                      For example, assignments and tests are components. <br />
                      Each component can have subcomponents, for example Test 1. <br />
                    </div>
                    <div>
                      <TableContainer>
                        <Table>
                          <Thead>
                            <Tr className={tablecolor}>
                              <Th className="p-2">Name</Th>
                              <Th className="p-2">Number of pieces</Th>
                              <Th className="p-2">Weighting</Th>
                              <Th className="p-2">Drop lowest</Th>
                              <Th className="p-2"></Th>
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
                                        dropLowest: 0,
                                        weighting: 0.2,
                                        numberOfSubcomponents: 1,
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
                  <Button mt={4} colorScheme={"teal"} onClick={() => setTabIndex(2)}>
                    Next
                  </Button>
                </TabPanel>
                <TabPanel>
                  <Text mb={4} color={"gray.600"}>
                    On the next screen, you&apos;ll be able to record your results so far.
                  </Text>

                  <Button type="submit" isLoading={isSubmitting} colorScheme="teal">
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
