// taux statiques pour MVP (à mettre à jour plus tard via API)
const RATES = {
  EUR: 1,
  USD: 1.08,
  MAD: 10.9,
};

exports.getRates = () => RATES;

exports.convert = (amount, from, to) => {
  if (!RATES[from] || !RATES[to]) {
    return null;
  }

  // convertit d'abord en EUR → puis vers la devise finale
  const amountInEUR = amount / RATES[from];
  const converted = amountInEUR * RATES[to];

  return Math.round(converted * 100) / 100; // arrondi pro
};