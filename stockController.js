exports.getCombinedData = async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const data = await stockDataService.getCombinedData(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch combined stock data." });
  }
};
