useEffect(() => {
  console.log("Fetching stock data for", symbol, "with range", range);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/stocks/combined/${symbol}`);
      let data = res.data;

      console.log("Fetched data:", data); // 🔍 Check the actual response here

      // Filter data based on selected range
      const now = new Date();
      let startTime;

      switch (range) {
        case "1D":
          startTime = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
          break;
        case "1W":
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "1M":
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "3M":
          startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "1Y":
          startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = null;
      }

      if (startTime) {
        data = data.filter((item) => new Date(item.timestamp) >= startTime);
      }

      console.log("Filtered data:", data); // 🔍 Verify filtered result

      setChartData(data);
    } catch (err) {
      console.error("Failed to load stock data:", err);
    }
  };

  fetchData();
}, [symbol, range]);
