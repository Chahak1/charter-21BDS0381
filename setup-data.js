const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const stocks = ['AAPL', 'GOOG', 'TSLA', 'MSFT', 'WMT', 'IBM', 'UL'];

console.log('Setting up stock data files...');
console.log(`Data directory: ${dataDir}`);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Check and create missing files
stocks.forEach(stock => {
  const lowerFile = path.join(dataDir, `${stock.toLowerCase()}.csv`);
  const upperFile = path.join(dataDir, `${stock.toUpperCase()}.csv`);
  
  console.log(`Checking ${stock}:`);
  console.log(`  Lowercase: ${fs.existsSync(lowerFile) ? '✓' : '✗'} ${lowerFile}`);
  console.log(`  Uppercase: ${fs.existsSync(upperFile) ? '✓' : '✗'} ${upperFile}`);
  
  // If one exists but not the other, copy it
  if (fs.existsSync(lowerFile) && !fs.existsSync(upperFile)) {
    fs.copyFileSync(lowerFile, upperFile);
    console.log(`  Created uppercase version`);
  } else if (fs.existsSync(upperFile) && !fs.existsSync(lowerFile)) {
    fs.copyFileSync(upperFile, lowerFile);
    console.log(`  Created lowercase version`);
  }
});

console.log('Data setup complete!');

// List all files
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));
console.log(`\nAvailable data files: ${files.join(', ')}`);