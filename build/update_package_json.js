import fs from 'fs/promises';
import path from 'path';
import { Date2 } from './date.js';
const date = new Date2()
const ver = date.getDate()

const filePath = path.resolve(import.meta.dirname, "..", "package.json");

const data = await fs.readFile(filePath, 'utf8');

const obj = JSON.parse(data);

obj.version = ver;

await fs.writeFile(filePath, JSON.stringify(obj, null, 2), 'utf8');


