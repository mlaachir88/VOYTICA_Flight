const express = require("express");
const cors = require("cors");

const flightRoutes = require("./routes/flight.routes");
const airportRoutes = require("./routes/airport.routes"); // ← NOUVEAU

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/flights", flightRoutes);
app.use("/api/airports", airportRoutes); // ← NOUVEAU


app.get("/", (req, res) => {
  res.send("Voytica API is running...");
});

module.exports = app;