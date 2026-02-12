// /config/duffelClient.js
const { Duffel } = require("@duffel/api");

if (!process.env.DUFFEL_API_KEY) {
  console.error("❌ ERROR: DUFFEL_API_KEY is missing in environment variables.");
  process.exit(1);
}

const duffel = new Duffel({
  token: process.env.DUFFEL_API_KEY,
});

module.exports = duffel;