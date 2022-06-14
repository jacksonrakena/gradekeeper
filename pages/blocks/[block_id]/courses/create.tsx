import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { StudyBlock } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { TopBar } from "../../../../components/TopBar";
import { randomColor, _null } from "../../../../lib/logic";

export type ComponentDto = {
  id: string;
  weighting: number;
  dropLowest: number;
  name: string;
  numberOfSubcomponents: number;
};

const SubjectCreationPage: NextPage = () => {
  const router = useRouter();
  const { block_id } = router.query;
  const [studyBlock, setStudyBlock] = useState(_null<StudyBlock>());
  const [isLoading, setLoading] = useState(true);

  const emptyComponents: Partial<ComponentDto>[] = [
    {
      id: randomColor(),
      dropLowest: 0,
      weighting: 0.2,
      numberOfSubcomponents: 1,
    },
  ];
  const [components, setComponents] = useState(emptyComponents);
  const [color, setColor] = useState(randomColor());

  useEffect(() => {
    if (router.isReady) {
      fetch(`/api/block/${block_id}`)
        .then((e) => e.json())
        .then((f) => {
          setStudyBlock(f);
          setLoading(false);
        });
    }
  }, [router.isReady]);
  if (isLoading) return <div>Loading..</div>;
  return (
    <div>
      <TopBar />
      <div className="p-8">
        <div className="font-bold text-2xl">Add a new subject to {studyBlock?.name}</div>
        <div>Currently, Gradekeeper only supports the grade boundaries at Victoria University of Wellington.</div>

        <Formik
          initialValues={{
            name: "",
            codeName: "",
            codeNo: "",
            color: "",
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
                color: color,
                components: components,
              }),
            })
              .then((e) => e.json())
              .then((f) => {
                setSubmitting(false);
                router.push(`/blocks/${block_id}/courses/${f.id}`);
              });
          }}
        >
          {({ values, handleSubmit, isSubmitting }) => (
            <Form className="mt-4 flex flex-wrap" onSubmit={handleSubmit}>
              <div>
                <div className="mb-4 text-xl font-semibold">Information</div>
                <Stack spacing={3}>
                  <Field name="codeName">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isInvalid={form.errors.codeName && form.touched.codeName}>
                        <FormLabel htmlFor="name">Course code name</FormLabel>
                        <Input htmlSize={8} width="auto" size="md" placeholder="ENGR" {...field} id="codeName" type="text" />
                        <FormErrorMessage>{form.errors.codeName}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="codeNo">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isInvalid={form.errors.codeNo && form.touched.codeNo}>
                        <FormLabel htmlFor="codeNo">Course code number</FormLabel>
                        <Input htmlSize={8} width="auto" size="md" placeholder="101" {...field} id="codeNo" type="text" />
                        <FormErrorMessage>{form.errors.codeNo}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="name">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isInvalid={form.errors.name && form.touched.name}>
                        <FormLabel htmlFor="name">Course code name</FormLabel>
                        <Input htmlSize={16} width="auto" size="md" placeholder="Engineering Design" {...field} id="name" type="text" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <div className="mb-6">
                    <label htmlFor="longName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Course color
                    </label>

                    <SketchPicker
                      color={color}
                      onChangeComplete={(e: { hex: string }) => {
                        setColor(e.hex);
                      }}
                    />
                  </div>
                  <Button type="submit" isLoading={isSubmitting} colorScheme="teal">
                    Create
                  </Button>
                </Stack>
              </div>
              <div>
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
                        <Tr className={useColorModeValue("bg-gray-50", "")}>
                          <Th className="p-2">Name</Th>
                          <Th className="p-2">Number of pieces</Th>
                          <Th className="p-2">Weighting</Th>
                          <Th className="p-2">Drop lowest</Th>
                          <Th className="p-2"></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {components.map((comp) => (
                          <SubjectComponentRow
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
                    colorScheme="teal"
                    aria-label="Add row"
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
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const SubjectComponentRow = (props: {
  original: Partial<ComponentDto>;
  onUpdate: (e: Partial<ComponentDto>) => void;
  onDelete: () => void;
}) => {
  return (
    <Tr key={props.original.id}>
      <Td className="p-2">
        <input
          type="text"
          onChange={(e) => {
            props.onUpdate({ ...props.original, name: e.target.value });
          }}
          value={props.original.name ?? ""}
          id="courseCodeName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
          placeholder="Labs"
          required={true}
        />
      </Td>
      <Td className="p-2">
        <input
          type="text"
          onChange={(e) => {
            props.onUpdate({
              ...props.original,
              numberOfSubcomponents: Number.parseInt(e.target.value),
            });
          }}
          value={props.original.numberOfSubcomponents ?? 0}
          id="courseCodeName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
          placeholder="2"
          required={true}
        />
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

export default SubjectCreationPage;
