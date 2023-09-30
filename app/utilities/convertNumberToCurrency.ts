export const convertNumberToCurrency = (inputNumber: number) => {
  let re = "\\d(?=(\\d{" + (0 || 3) + "})+" + (2 > 0 ? "\\." : "$") + ")";
  return inputNumber.toFixed(Math.max(0, ~~2)).replace(new RegExp(re, "g"), "$&,");
};
