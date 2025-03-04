import * as fs from 'fs-extra';
import * as path from 'path';

const srcTemplatesPath = path.join(__dirname, 'templates');
const distTemplatesPath = path.join(__dirname, '..', 'dist', 'templates');

fs.copySync(srcTemplatesPath, distTemplatesPath);
console.log('Templates copied to dist folder.');