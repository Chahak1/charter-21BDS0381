const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

const baseDataDir = path.join(__dirname, "../data");

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) return resolve([]);
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

exports.getCombinedData = async (symbol) => {
  const historicalPath = path.join(baseDataDir, "historical", `${symbol}.csv`);
  const simulatedPath = path.join(baseDataDir, "simulated", `${symbol}.csv`);

  const [historical, simulated] = await Promise.all([
    readCSV(historicalPath),
    readCSV(simulatedPath),
  ]);

  // Sort both by timestamp (optional)
  const combined = [...historical, ...simulated].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return combined;
};
