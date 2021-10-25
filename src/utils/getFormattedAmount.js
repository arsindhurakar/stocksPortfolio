const getFormattedAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    // style: "currency",
    // currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export default getFormattedAmount;
