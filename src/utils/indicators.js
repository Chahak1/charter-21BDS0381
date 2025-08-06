// List of supported indicators
export const INDICATORS = ["SMA", "EMA", "RSI", "MACD", "VWAP"];

/**
 * Simple Moving Average (SMA)
 */
export function sma(data, window) {
  const closes = data.map(row => parseFloat(row.close));
  return closes.map((_, idx, arr) =>
    idx < window - 1
      ? null
      : arr.slice(idx - window + 1, idx + 1).reduce((a, b) => a + b, 0) / window
  );
}

/**
 * Exponential Moving Average (EMA)
 */
export function ema(data, window) {
  const k = 2 / (window + 1);
  const closes = data.map(row => parseFloat(row.close));
  const result = [];

  closes.forEach((price, idx) => {
    if (idx === 0) {
      result.push(price); // seed EMA with first value
    } else {
      const prev = result[result.length - 1];
      result.push(price * k + prev * (1 - k));
    }
  });

  return result.map((val, idx) => (idx < window - 1 ? null : val));
}

/**
 * Relative Strength Index (RSI)
 */
export function rsi(data, period = 14) {
  const closes = data.map(row => parseFloat(row.close));
  const gains = [], losses = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      gains.push(diff);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(-diff);
    }
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const rsis = [null, ...Array(period - 1).fill(null)];

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsis.push(100 - 100 / (1 + rs));
  }

  return rsis;
}

/**
 * Moving Average Convergence Divergence (MACD)
 */
export function macd(data, shortWindow = 12, longWindow = 26, signalWindow = 9) {
  const shortEMA = ema(data, shortWindow);
  const longEMA = ema(data, longWindow);
  const macdLine = shortEMA.map((val, idx) =>
    val !== null && longEMA[idx] !== null ? val - longEMA[idx] : null
  );
  const signalLine = ema(macdLine.map(v => ({ close: v ?? 0 })), signalWindow);
  const histogram = macdLine.map((val, idx) =>
    val !== null && signalLine[idx] !== null ? val - signalLine[idx] : null
  );

  return { macdLine, signalLine, histogram };
}

/**
 * Volume Weighted Average Price (VWAP)
 */
export function vwap(data) {
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  return data.map((row, idx) => {
    const typicalPrice = (parseFloat(row.high) + parseFloat(row.low) + parseFloat(row.close)) / 3;
    const volume = parseFloat(row.volume);
    cumulativeTPV += typicalPrice * volume;
    cumulativeVolume += volume;
    return cumulativeVolume === 0 ? null : cumulativeTPV / cumulativeVolume;
  });
}

/**
 * Bollinger Bands
 */
export function bollingerBands(data, window = 20, multiplier = 2) {
  const smaValues = sma(data, window);
  const closes = data.map(row => parseFloat(row.close));
  
  const bands = smaValues.map((smaVal, idx) => {
    if (smaVal === null || idx < window - 1) {
      return { upper: null, middle: null, lower: null };
    }
    
    const slice = closes.slice(idx - window + 1, idx + 1);
    const variance = slice.reduce((acc, val) => acc + Math.pow(val - smaVal, 2), 0) / window;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: smaVal + (multiplier * stdDev),
      middle: smaVal,
      lower: smaVal - (multiplier * stdDev)
    };
  });
  
  return bands;
}