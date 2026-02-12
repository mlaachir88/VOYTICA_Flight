const { getRates, convert } = require("../utils/currency");

exports.getCurrencyRates = () => {
  return getRates();
};

exports.convertCurrency = (amount, from, to) => {
  return convert(amount, from, to);
};