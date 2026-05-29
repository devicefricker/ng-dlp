import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { LinkGetter } from './src/linkgetter.js';
import { Downloader } from './src/downloader.js';
import { InfoGrabber } from './src/infograbber.js';
import { GetAsCheerio } from './src/getascheerio.js';

const __filename = fileURLToPath(import.meta.url),
      __dirname = path.dirname(__filename);

const isCompiled = typeof process.pkg !== 'undefined';

const testSuitePath = isCompiled 
    ? path.join(process.cwd(), 'data', 'test-suite.json')
    : path.join(__dirname, 'data', 'test-suite.json')

const versionPath = isCompiled
    ? path.join(process.cwd(), 'data', 'version')
    : path.join(__dirname, 'data', 'version');

const validQualityOptions = ["1080p", "720p", "360p"]
const config = {
    allowPositionals: true,
    options: {
        path: { type: 'string', short: 'P' },
        test: { type: 'boolean', short: 't' },
        version: { type: 'boolean', short: 'V'},
        quality: { type: 'string', short: 'q'},
        writeinfojson: { type: 'boolean' }
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
    console.log(`[ng-dlp]: No URL`);
    process.exit(1);
}

if(!values.quality) {
    await main(positionals[0]);
} else {
    if(!validQualityOptions.includes(values.quality)) {
        console.log(`[ng-dlp]: Invalid quality option, valid options are '1080p', '720p' or '360p'.`)
        process.exit(1);
    }
    await main(positionals[0], {"quality": values.quality})
}
async function main(url, args) {
    console.log(`[ng-dlp]: Creating new link grabber task on ${url}`);
    const lg = new LinkGetter(url, args),
        links = await lg.get();

    if(values.writeinfojson) {
        /* This code is garbage because I didn't plan ahead. 
            So now I have to write most of the Downloader class into the index.js file.
            I'll have to write a new file saver class later. */
        console.log(`[ng-dlp]: Creating new info grabber task on ${url}`);
        const $ = await GetAsCheerio(url),
              ig = new InfoGrabber($, false),
              info = await ig.get(),
              outputfolder = (values.path) ? values.path : "output",
              root = isCompiled ? path.join(__dirname, '..') : process.cwd(),
              folder = path.join(root, outputfolder),
              finaloutputpath = path.join(folder, `${path.basename(links[0]).split("?")[0]}.json`)
        await fs.writeFile(finaloutputpath, JSON.stringify(info));
        console.log(`[ng-dlp]: Wrote info json at ${finaloutputpath}`)
    }    
    console.log(`[ng-dlp]: Invoking downloader on ${links.length} ${(links.length < 2) ? "link" : "links"}`);

    const dl = new Downloader(links, isCompiled);
    await dl.dl(values.path);
}