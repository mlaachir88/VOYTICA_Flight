const currencyService = require("../services/currency.service");

exports.getRates = (req, res) => {
  return res.json({
    base: "EUR",
    rates: currencyService.getCurrencyRates(),
  });
};

exports.convert = (req, res) => {
  const { amount, from, to } = req.query;

  if (!amount || !from || !to) {
    return res.status(400).json({
      error: "Missing parameters: amount, from, to",
    });
  }

  const result = currencyService.convertCurrency(Number(amount), from, to);

  if (result === null) {
    return res.status(400).json({
      error: "Invalid currency code",
    });
  }

  return res.json({
    amount: Number(amount),
    from,
    to,
    result,
  });
};