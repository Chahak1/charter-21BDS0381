const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const baseDataDir = path.join(__dirname, "../data");

function getSimFile(symbol) {
  return path.join(baseDataDir, "simulated", `${symbol}.csv`);
}

const loadedSims = {};

function loadSimData(symbol) {
  return new Promise((resolve) => {
    if (loadedSims[symbol]) return resolve(loadedSims[symbol]);
    const simFile = getSimFile(symbol);
    const arr = [];
    if (!fs.existsSync(simFile)) return resolve([]);
    fs.createReadStream(simFile)
      .pipe(csv())
      .on("data", (data) => arr.push(data))
      .on("end", () => {
        loadedSims[symbol] = arr;
        resolve(arr);
      });
  });
}

module.exports = function (server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async function (ws) {
  ws.on("message", async (message) => {
    const { symbol } = JSON.parse(message);
    const simRows = await loadSimData(symbol);
    let idx = 0;

    const sendRow = () => {
      if (idx < simRows.length && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ symbol, ...simRows[idx] }));
        idx++;
        setTimeout(sendRow, 1000);
      }
    };
    sendRow();
  });
});

}