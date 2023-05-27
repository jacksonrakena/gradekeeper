import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
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
  useToast,
} from "@chakra-ui/react";
import { Field, FieldInputProps, FieldMetaProps, Form, Formik, FormikBag } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TwitterPicker } from "react-color";
import { useRecoilValue } from "recoil";
import { randomColor } from "../../../../lib/logic/core";
import { ProcessedUserState, useInvalidator } from "../../../../lib/state/course";
import { CreateCourseComponentRow } from "./CreateCourseComponentRow";

export type ComponentDto = {
  id: string;
  weighting: string;
  dropLowest: string;
  name: string;
  numberOfSubcomponents: string;
};

export const CreateCourse = (props: { block_id: string }) => {
  const { invalidate } = useInvalidator();
  const block_id = props.block_id;
  const toast = useToast();
  const router = useRouter();
  const emptyComponents: Partial<ComponentDto>[] = [
    {
      id: randomColor(),
      dropLowest: "0",
      weighting: "20",
      numberOfSubcomponents: "1",
    },
  ];
  const [components, setComponents] = useState(emptyComponents);
  const user = useRecoilValue(ProcessedUserState);
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
          fetch(`/api/block/${block_id}/course/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: values.name,
              codeName: values.codeName,
              codeNo: values.codeNo,
              color: values.color,
              components: components.map((c) => {
                return {
                  ...c,
                  weighting: Number.parseInt(c.weighting ?? "0") / 100,
                  dropLowest: Number.parseInt(c.dropLowest ?? "0"),
                };
              }),
            }),
          }).then(async (e) => {
            const f = await e.json();
            if (e.ok) {
              invalidate().then(() => {
                setSubmitting(false);
                router.push(`/blocks/${block_id}/courses/${f.id}`);
              });
            } else {
              setSubmitting(false);
              toast({
                title: "An error occurred.",
                description: f.error,
                status: "error",
                duration: 4000,
              });
            }
          });
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form className="mt-4" onSubmit={handleSubmit}>
            <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" colorScheme="theme">
              <TabList>
                <Tab>1. Information</Tab>
                <Tab>2. Components</Tab>
                <Tab>3. Create</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <Flex direction={"row"}>
                      <Field name="codeName">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl isInvalid={form.errors.codeName && form.touched.codeName}>
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
                          <FormControl isInvalid={form.errors.codeNo && form.touched.codeNo}>
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
                    </Flex>

                    <Field name="name">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
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
                          <TwitterPicker
                            triangle="hide"
                            color={field.value}
                            onChangeComplete={(e, event) => {
                              form.setFieldValue("color", e.hex, true);
                            }}
                          />
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Button mt={4} colorScheme={"brand"} onClick={() => setTabIndex(1)}>
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
                                        dropLowest: "0",
                                        weighting: "20",
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
