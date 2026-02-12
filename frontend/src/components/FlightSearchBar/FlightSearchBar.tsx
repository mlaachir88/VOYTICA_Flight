import { useState } from "react";
import { motion } from "framer-motion";

export default function FlightSearchBar() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams({ from, to, date });
    window.location.href = "/search?" + params.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-3xl bg-white/20 backdrop-blur-xl shadow-xl rounded-3xl p-6 border border-white/30"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Find the best flights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* FROM */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">From</label>
          <input
            type="text"
            placeholder="Paris (PAR)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-white/70 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* TO */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">To</label>
          <input
            type="text"
            placeholder="Casablanca (CMN)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-white/70 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* DATE */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white/70 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Search Button */}
      <motion.button
        onClick={handleSearch}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
      >
        Search Flights
      </motion.button>
    </motion.div>
  );
}
