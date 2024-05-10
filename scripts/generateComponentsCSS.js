import fs from 'fs';
import path from 'path';

const componentsDir = path.join(__dirname, '../styles/components');
const outputFile = path.join(__dirname, '../styles/components.css');

const files = fs.readdirSync(componentsDir);
const imports = files
  .filter((file) => file.endsWith('.css'))
  .map((file) => `@import './components/${file}';`)
  .join('\n');

fs.writeFileSync(outputFile, imports);
console.log('Generated components.css with the following imports:');
console.log(imports);
