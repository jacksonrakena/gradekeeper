import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TopBar } from "../../components/TopBar";
import { useUserContext } from "../../UserContext";

const BlockCreationPage: NextPage = () => {
  const router = useRouter();
  const context = useUserContext();

  return (
    <div>
      <TopBar />
      <div className="p-8">
        <div className="font-bold text-2xl">Create a new study block</div>
        <div>A study block is a collection of courses, like a trimester or a semester at some universities.</div>

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
                  router.push("/");
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
            /* and other goodies */
          }) => (
            <Form className="mt-4" onSubmit={handleSubmit}>
              <Field name="name">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel htmlFor="name">Block name</FormLabel>
                    <Input {...field} id="name" type="text" />
                    <FormHelperText>For example, Trimester 1 or Semester 2.</FormHelperText>
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="startDate">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl isInvalid={form.errors.startDate && form.touched.startDate}>
                    <FormLabel htmlFor="startDate">Block start date</FormLabel>
                    <DatePickerField name="startDate" />
                    <FormErrorMessage>{form.errors.startDate}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="endDate">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl isInvalid={form.errors.endDate && form.touched.endDate}>
                    <FormLabel htmlFor="endDate">Block end date</FormLabel>
                    <DatePickerField name="endDate" />
                    <FormErrorMessage>{form.errors.endDate}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button type="submit" isLoading={isSubmitting} colorScheme="teal">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
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
export default BlockCreationPage;
