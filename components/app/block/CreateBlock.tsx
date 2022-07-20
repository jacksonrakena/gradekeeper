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
  Text,
} from "@chakra-ui/react";
import { Field, FieldHookConfig, Form, Formik, useField, useFormikContext } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserContext } from "../../../lib/UserContext";

const templates: { [key: string]: { name: string; startDate: Date; endDate: Date }[] } = {
  "Victoria University of Wellington": [
    {
      name: "Trimester 1, 2022",
      startDate: new Date(2022, 2, 28),
      endDate: new Date(2022, 6, 26),
    },
    {
      name: "Trimester 2, 2022",
      startDate: new Date(2022, 7, 11),
      endDate: new Date(2022, 11, 13),
    },
    {
      name: "Trimester 3, 2022",
      startDate: new Date(2022, 11, 14),
      endDate: new Date(2023, 2, 13),
    },
  ],
};

export const CreateBlock = (props: { onClose: () => void }) => {
  const router = useRouter();
  const context = useUserContext();
  const [institutionTemplates, setTemplates] = useState<{ name: string; startDate: Date; endDate: Date }[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<{ name: string; startDate: Date; endDate: Date }>();
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
          initialValues={{ name: "", startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)) }}
          validate={(values) => {
            const errors: any = {};
            if (!values.name) errors["name"] = "Required";
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            fetch(`/api/block/create`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) })
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
                        <DatePickerField name="startDate" />
                        <FormErrorMessage>{form.errors.startDate}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="endDate">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl mb={4} isInvalid={form.errors.endDate && form.touched.endDate}>
                        <FormLabel htmlFor="endDate">End date</FormLabel>
                        <DatePickerField name="endDate" />
                        <FormErrorMessage>{form.errors.endDate}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
                <Button type="submit" isLoading={isSubmitting} colorScheme="brand">
                  Create
                </Button>
              </Box>
              <Divider />
              <Box className="my-4">
                <FormLabel>Or, select a template:</FormLabel>
                <Flex>
                  <Box mr="8">
                    <FormLabel>Institution</FormLabel>
                    <Select
                      placeholder="Select an institution"
                      onChange={(f) => {
                        setTemplates(templates[f.target.value]);
                      }}
                    >
                      {Object.keys(templates).map((e) => (
                        <option value={e}>{e}</option>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    {institutionTemplates && (
                      <>
                        <FormLabel>Template:</FormLabel>
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
                            <option value={e.name}>{e.name}</option>
                          ))}
                        </Select>
                      </>
                    )}
                  </Box>
                </Flex>
                {selectedTemplate && (
                  <Box className="my-4">
                    <FormLabel>You've selected:</FormLabel>
                    <Text>{selectedTemplate.name}</Text>
                    <Text size="sm" className="mb-4">
                      {dtf.format(selectedTemplate.startDate)} — {dtf.format(selectedTemplate.endDate)}
                    </Text>
                    <Button type="submit" isLoading={isSubmitting} colorScheme="brand">
                      Create from template
                    </Button>
                  </Box>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};
const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props as FieldHookConfig<any>);
  return (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={(val: any) => {
        setFieldValue(field.name, val);
      }}
    />
  );
};
