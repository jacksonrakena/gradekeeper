import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";

const CompletedDonation: NextPage = () => {
  return (
    <Box m={12}>
      <Alert status="success" mb={6}>
        <AlertIcon />
        <AlertTitle>Thank you so much!</AlertTitle>
        <AlertDescription>People like you help keep Gradekeeper alive. Our team thanks you and your generosity.</AlertDescription>
      </Alert>
      <Heading mb={4}>Help support Gradekeeper</Heading>
      <Text maxW={"80%"}>
        Gradekeeper is, and will always be, free for all students to use, but Gradekeeper costs money to operate, including server costs,
        infrastructure costs, and expensive licenses.
        <br />
        <br />
        Your contribution means a lot to us.
        <Box mt={8}>
          <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="hosted_button_id" value="7GYGVATJW2LYJ" />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
              border="0"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt="Donate with PayPal button"
            />
            <img alt="" border="0" src="https://www.paypal.com/en_NZ/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </Box>
      </Text>
    </Box>
  );
};

export default CompletedDonation;
