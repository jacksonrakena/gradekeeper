import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUserContext } from "../../../lib/UserContext";

import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";

const CreateBlockModal = (props: { isOpen: boolean; onClose: () => void }) => {
  return (
    <>
      <Modal size="xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new study term</ModalHeader>
          <ModalBody>
            <CreateBlock onClose={props.onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateBlockModal;

const templates: { [key: string]: { name: string; startDate: string; endDate: string }[] } = {
  "Victoria University of Wellington": [
    {
      name: "Trimester 1, 2022",
      startDate: "2022-02-28",
      endDate: "2022-06-26",
    },
    {
      name: "Trimester 2, 2022",
      startDate: "2022-07-11",
      endDate: "2022-11-13",
    },
    {
      name: "Trimester 3, 2022",
      startDate: "2022-11-14",
      endDate: "2023-02-13",
    },
  ],
  "University of Canterbury": [
    {
      name: "Semester 1, 2022",
      startDate: "2022-02-21",
      endDate: "2022-06-25",
    },
    {
      name: "Semester 2, 2022",
      startDate: "2022-07-18",
      endDate: "2022-10-21",
    },
    {
      name: "Summer School, 2022",
      startDate: "2022-11-14",
      endDate: "2023-02-17",
    },
  ],
};

export const CreateBlock = (props: { onClose: () => void }) => {
  const router = useRouter();
  const context = useUserContext();
  const [institutionTemplates, setTemplates] = useState<{ name: string; startDate: string; endDate: string }[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<{ name: string; startDate: string; endDate: string }>();
  const dtf = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Box mb={4}>
      <div>A term is a collection of courses, like a trimester or a semester at some universities.</div>

      <Box>
        {" "}
        <Formik
          initialValues={{ name: "", startDate: "", endDate: "" }}
          validate={(values) => {
            const errors: any = {};
            if (!values.name) errors["name"] = "Required";
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            fetch(`/api/block/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...values,
                startDate: typeof values.startDate === "string" ? new Date(values.startDate) : values.startDate,
                endDate: typeof values.endDate === "string" ? new Date(values.endDate) : values.endDate,
              }),
            })
              .then((e) => e.json())
              .then((f) => {
                context.redownload().then(() => {
                  console.log("created " + f.id);
                  setSubmitting(false);
                  props.onClose();
                });
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setValues,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <Box className="my-4">
                <FormLabel>Select a template:</FormLabel>
                <Flex>
                  <Box>
                    <FormLabel>Institution</FormLabel>
                    <Select
                      placeholder="Select an institution"
                      onChange={(f) => {
                        if (!f.target.value) {
                          setSelectedTemplate(undefined);
                        }
                        setTemplates(templates[f.target.value]);
                      }}
                    >
                      {Object.keys(templates).map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <Spacer />
                  <Box>
                    {institutionTemplates && (
                      <>
                        <FormLabel>Term</FormLabel>
                        <Select
                          placeholder="Select a term"
                          onChange={(f) => {
                            if (!f.target.value) {
                              setSelectedTemplate(undefined);
                            } else {
                              const nt = institutionTemplates.filter((g) => g.name == f.target.value)[0];
                              setSelectedTemplate(nt);
                              setValues(nt);
                            }
                          }}
                        >
                          {institutionTemplates.map((e) => (
                            <option key={e.name} value={e.name}>
                              {e.name}
                            </option>
                          ))}
                        </Select>
                      </>
                    )}
                  </Box>
                </Flex>
                {selectedTemplate && (
                  <Box className="my-4">
                    <FormLabel>You've selected:</FormLabel>
                    <Flex alignItems={"center"} direction={"column"}>
                      <Text>{selectedTemplate.name}</Text>
                      <Text color="brand.600" size="sm" className="mb-4">
                        {dtf.format(new Date(selectedTemplate.startDate))} — {dtf.format(new Date(selectedTemplate.endDate))}
                      </Text>
                    </Flex>
                    <Button type="submit" isLoading={isSubmitting} colorScheme="brand">
                      Create from template
                    </Button>
                  </Box>
                )}
              </Box>
              {!selectedTemplate && (
                <>
                  <Divider />
                  <Box className="my-4">
                    <FormLabel>Or, create one from scratch:</FormLabel>
                    <Field name="name">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl mb={4} isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input variant="filled" {...field} placeholder="Trimester 1" id="name" type="text" />
                          <FormHelperText>For example, Trimester 1 or Semester 2.</FormHelperText>
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Flex direction={"row"}>
                      {" "}
                      <Field name="startDate">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl mb={4} isInvalid={form.errors.startDate && form.touched.startDate}>
                            <FormLabel htmlFor="startDate">Start date</FormLabel>
                            <Field type="date" name="startDate" />
                            <FormErrorMessage>{form.errors.startDate}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="endDate">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl mb={4} isInvalid={form.errors.endDate && form.touched.endDate}>
                            <FormLabel htmlFor="endDate">End date</FormLabel>
                            <Field type="date" name="endDate" />
                            <FormErrorMessage>{form.errors.endDate}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Flex>
                    <Button type="submit" isLoading={isSubmitting} colorScheme="brand">
                      Create
                    </Button>
                  </Box>
                </>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};