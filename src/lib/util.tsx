import Decimal from "decimal.js";

export const isPossibleDecimal = (input: any) => {
  try {
    new Decimal(input);
    return true;
  } catch (e) {
    return false;
  }
};
