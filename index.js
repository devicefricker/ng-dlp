import { LinkGetter } from './src/linkgetter.js';
import { Downloader } from './src/downloader.js';

import fs from 'fs/promises';
import path from 'path';
import { parseArgs } from 'node:util';

const isCompiled = typeof process.pkg !== 'undefined';

const testSuitePath = isCompiled 
    ? path.join(process.cwd(), 'data', 'test-suite.json')
    : path.join(__dirname, 'data', 'test-suite.json')

const versionPath = isCompiled
    ? path.join(process.cwd(), 'data', 'version')
    : path.join(__dirname, 'data', 'version')
const config = {
    allowPositionals: true,
    options: {
        path: { type: 'string', short: 'P' },
        test: { type: 'boolean', short: 't' },
        version: { type: 'boolean', short: 'V'}
    }
}

const { values, positionals } = parseArgs(config);

if (values.version) {
    const ver = await fs.readFile(versionPath, "utf8");
    console.log(ver);
    process.exit(0);
}
if (values.test) {
    console.log(`[ng-dlp]: Running test suite...`)

    const testSuiteStr = await fs.readFile(testSuitePath, "utf8");
    const testSuiteObj = JSON.parse(testSuiteStr);

    const keys = Object.keys(testSuiteObj);

    for(let i = 0; i < keys.length; i++) {
        await main(testSuiteObj[keys].url);
    }

    console.log(`[ng-dlp]: All tests completed`)
    process.exit(0);
}

if(!positionals[0]) {
    console.error("[ng-dlp]: ERROR: No URL");
    process.exit(1);
}

await main(positionals[0]);

async function main(url) {
    console.log(`[ng-dlp]: Creating new link grabber task on ${url}`);
    const lg = new LinkGetter(url),
        links = await lg.get();

    console.log(`[ng-dlp]: Invoking downloader on ${links.length} ${(links.length < 2) ? "link" : "links"}`);

    const dl = new Downloader(links, isCompiled);
    await dl.dl(values.path);
}